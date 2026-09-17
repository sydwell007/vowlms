param(
  [string]$SourceRoot = "G:\3\_Business\1\_GoalVow Holdings\_2025\C\_Business Units\BU1\_Upskilling with CPD\4\_Microsoft Office Courses",
  [string]$OutputPath = "src\data\microsoft-office-source-content.json"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (-not (Test-Path -LiteralPath $SourceRoot -PathType Container)) {
  throw "Microsoft Office source folder is unavailable: $SourceRoot"
}

$tracks = @(
  @{ Directory = "1_MicroSoft Word\1_MS Word Basic\Word\Student Materials\Student-Files_Word"; Slugs = @("managing-word-documents-and-options", "managing-word-edits-and-document-layouts", "working-with-word-objects", "inserting-and-managing-word-tables-and-lists", "managing-word-references-and-finalizing-word-documents") },
  @{ Directory = "1_MicroSoft Word\2_MS Word Advance\Student-Files_Word-Document-Version"; Slugs = @("updating-word-settings", "modifying-and-creating-document-style-and-templates", "creating-reusable-content-and-custom-design-elements", "creating-reference-tables-and-restricting-editing", "managing-document-content", "creating-and-managing-macros", "managing-customer-lists-and-creating-mailings") },
  @{ Directory = "2_MicroSoft Excel\1_MS Excel 2019 Associate\Student-Files_Word-Document"; Slugs = @("introduction-to-excel", "managing-worksheets-and-workbooks", "formatting-cells", "managing-tables-and-range-data", "using-formulas-and-functions", "getting-and-transforming-data", "visualizing-data", "preparing-to-print-and-checking-for-issues") },
  @{ Directory = "2_MicroSoft Excel\2_MS Excel 2019 Expert\Excel Expert\Student_materials\Student-Files_Word"; Slugs = @("managing-and-formatting-data", "using-advanced-formulas", "validating-and-auditing-data", "analyzing-data", "using-simple-macros", "using-microsoft-pivottables-and-microsoft-pivotcharts", "collaborating-with-other-people") },
  @{ Directory = "3_MS Power Point\1_PowerPoint\Student_materials\Student-Files_Word-Document-Version"; Slugs = @("introducing-the-powerpoint-fundamentals", "managing-content-on-slides", "adding-visuals-to-presentations", "working-with-advanced-visuals", "organizing-and-printing-presentations", "configuring-slideshows", "managing-slide-masters-and-presentation-settings") },
  @{ Directory = "4_MS Outlook 2019\Outlook\Student_materials\Student-Files"; Slugs = @("getting-started-with-outlook", "composing-and-managing-email", "organizing-email", "automating-messages", "managing-calendars", "creating-and-managing-contacts", "managing-tasks-and-notes") },
  @{ Directory = "5_MS Access 2019\Student-Files"; Slugs = @("introduction-to-databases-and-microsoft-access", "designing-and-setting-up-data-structure", "adding-and-editing-data", "asking-questions-of-data", "understanding-reporting-basics", "defining-database-relationships", "asking-deeper-questions-of-data", "presenting-complex-data") }
)

function Get-DocumentParagraphs([string]$Path) {
  $archive = [IO.Compression.ZipFile]::OpenRead($Path)
  try {
    $entry = $archive.GetEntry("word/document.xml")
    $reader = [IO.StreamReader]::new($entry.Open())
    try { [xml]$xml = $reader.ReadToEnd() } finally { $reader.Dispose() }
  } finally { $archive.Dispose() }

  $ns = [Xml.XmlNamespaceManager]::new($xml.NameTable)
  $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
  $result = [Collections.Generic.List[object]]::new()
  foreach ($node in $xml.SelectNodes("//w:body/w:p", $ns)) {
    $text = (($node.SelectNodes(".//w:t", $ns) | ForEach-Object { $_.InnerText }) -join "").Trim()
    if (-not $text) { continue }
    $styleNode = $node.SelectSingleNode("w:pPr/w:pStyle", $ns)
    $style = if ($styleNode) { $styleNode.GetAttribute("val", "http://schemas.openxmlformats.org/wordprocessingml/2006/main") } else { "" }
    $result.Add([pscustomobject]@{ Text = $text; Style = $style })
  }
  return $result
}

function Convert-ToLessonHtml($Paragraphs) {
  $html = [Collections.Generic.List[string]]::new()
  $skipSection = $false
  $characters = 0
  foreach ($paragraph in $Paragraphs) {
    $text = $paragraph.Text
    $style = $paragraph.Style
    if ($style -eq "Heading1") { continue }
    if ($style -eq "Heading2") {
      $skipSection = $text -match "^(Warm-up|Wrap-up)$"
      if (-not $skipSection) {
        $encoded = [Net.WebUtility]::HtmlEncode($text)
        $html.Add("<h2>$encoded</h2>")
        $characters += $text.Length
      }
      continue
    }
    if ($skipSection -or $style -match "^(Caption|Prompt)" -or $text -match "^(Figure|Table)\s+\d+") { continue }
    $encoded = [Net.WebUtility]::HtmlEncode($text)
    if ($style -match "^(Bullet|Numberedlist)") { $html.Add("<ul><li>$encoded</li></ul>") }
    elseif ($style -match "^Heading") { $html.Add("<h3>$encoded</h3>") }
    else { $html.Add("<p>$encoded</p>") }
    $characters += $text.Length
    if ($characters -ge 18000) {
      $html.Add("<p><em>Continue the guided practice in the supplied module resources.</em></p>")
      break
    }
  }
  return ($html -join "`n")
}

$catalogue = [ordered]@{}
foreach ($track in $tracks) {
  $directory = Join-Path $SourceRoot $track.Directory
  for ($index = 0; $index -lt $track.Slugs.Count; $index++) {
    $moduleNumber = $index + 1
    $guide = Get-ChildItem -LiteralPath $directory -File -Filter "*M$moduleNumber*.docx" | Where-Object { $_.Name -notmatch "Capstone" } | Select-Object -First 1
    if (-not $guide) { throw "Student guide M$moduleNumber not found in $directory" }

    $paragraphs = @(Get-DocumentParagraphs $guide.FullName)
    $lessonStarts = @()
    for ($i = 0; $i -lt $paragraphs.Count; $i++) {
      if ($paragraphs[$i].Style -eq "Heading1" -and $paragraphs[$i].Text -match "^Lesson\s+(\d+)\s*:\s*(.+)$") {
        $lessonStarts += [pscustomobject]@{ Index = $i; Number = [int]$Matches[1]; Title = $paragraphs[$i].Text }
      }
    }

    $overviewEnd = if ($lessonStarts.Count) { $lessonStarts[0].Index } else { [Math]::Min($paragraphs.Count, 80) }
    $overview = Convert-ToLessonHtml $paragraphs[0..([Math]::Max(0, $overviewEnd - 1))]
    $lessons = [Collections.Generic.List[object]]::new()
    for ($lessonIndex = 0; $lessonIndex -lt $lessonStarts.Count; $lessonIndex++) {
      $start = $lessonStarts[$lessonIndex].Index
      $end = if ($lessonIndex + 1 -lt $lessonStarts.Count) { $lessonStarts[$lessonIndex + 1].Index - 1 } else { $paragraphs.Count - 1 }
      $lessons.Add([ordered]@{
        number = $lessonStarts[$lessonIndex].Number
        title = $lessonStarts[$lessonIndex].Title
        content = Convert-ToLessonHtml $paragraphs[$start..$end]
      })
    }

    $catalogue[$track.Slugs[$index]] = [ordered]@{
      guide = $guide.Name
      overview = $overview
      lessons = $lessons
    }
  }
}

$resolvedOutput = Join-Path (Get-Location) $OutputPath
$json = $catalogue | ConvertTo-Json -Depth 8
[IO.File]::WriteAllText($resolvedOutput, $json, [Text.UTF8Encoding]::new($false))
Write-Output "Generated $($catalogue.Count) source-aligned Microsoft Office modules at $resolvedOutput"
