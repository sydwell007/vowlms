param(
  [string]$SourceRoot = 'G:\3_Business\1_GoalVow Holdings_2025\D_Subsidiaries\SU8_Subsidiary 10_iLabs\SAVVA Content\12_SAVVA_Career Courses',
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-Slug([string]$Value) {
  $slug = $Value.ToLowerInvariant() -replace '&', ' and ' -replace '[^a-z0-9]+', '-'
  return $slug.Trim('-')
}

function Get-CleanTitle([string]$Value) {
  $title = [IO.Path]::GetFileNameWithoutExtension($Value)
  $title = $title -replace '^\d+[a-z]?[_\s-]+', '' -replace '_', ' '
  $title = $title -replace '(?<=[A-Za-z])(?=\d)', ' '
  $title = $title -replace '\s+', ' '
  return $title.Trim()
}

function Get-Md5([string]$Value) {
  $bytes = [Text.Encoding]::UTF8.GetBytes($Value)
  $hash = [Security.Cryptography.MD5]::Create().ComputeHash($bytes)
  return ([BitConverter]::ToString($hash) -replace '-', '').ToLowerInvariant()
}

function Repair-Mojibake([string]$Value) {
  if ([string]::IsNullOrEmpty($Value)) { return $Value }
  $suspectCharacters = @([char]0x00C2, [char]0x00C3, [char]0x00E2, [char]0x00EF)
  if (-not ($suspectCharacters | Where-Object { $Value.IndexOf($_) -ge 0 })) { return $Value }

  try {
    $bytes = [Text.Encoding]::GetEncoding(1252).GetBytes($Value)
    $decoded = [Text.Encoding]::UTF8.GetString($bytes)
    if ($decoded.IndexOf([char]0xFFFD) -lt 0) { return $decoded }
  } catch { }

  return $Value
}

function ConvertTo-HtmlText([string]$Value) {
  return [Net.WebUtility]::HtmlEncode((Repair-Mojibake $Value).Trim())
}

function Get-DocxText([string]$Path) {
  try {
    $archive = [IO.Compression.ZipFile]::OpenRead($Path)
    try {
      $entry = $archive.GetEntry('word/document.xml')
      if (-not $entry) { return '' }
      $reader = [IO.StreamReader]::new($entry.Open())
      try { [xml]$xml = $reader.ReadToEnd() } finally { $reader.Dispose() }
      $manager = [Xml.XmlNamespaceManager]::new($xml.NameTable)
      $manager.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
      $paragraphs = foreach ($paragraph in $xml.SelectNodes('//w:p', $manager)) {
        $text = ($paragraph.SelectNodes('.//w:t', $manager) | ForEach-Object { $_.'#text' }) -join ''
        if ($text.Trim()) { $text.Trim() }
      }
      return ($paragraphs -join "`n")
    } finally { $archive.Dispose() }
  } catch {
    Write-Warning "Could not read DOCX: $Path"
    return ''
  }
}

function Get-CleanDocxParagraphs([string]$Text) {
  $result = [Collections.Generic.List[string]]::new()
  $previous = ''
  $publisherNoise = '^(Make a selection to view student answers\.?|Directions:\s*Select the Play button.*|Play|Enable captions|Settings|PIPEnterfullscreen|Enterfullscreen|Video Transcript|Top of Form|Bottom of Form|Descriptions?|Choices?|Answers?|Answers? for question \d+|\d{1,2}:\d{2})$'

  foreach ($rawLine in ($Text -split "`r?`n")) {
    $line = $rawLine.Trim()
    if (-not $line -or $line -match $publisherNoise) { continue }
    if ($line -eq $previous) { continue }
    $result.Add($line)
    $previous = $line
  }

  return $result
}

function Get-DocumentHtml([IO.FileInfo[]]$Files, [string]$LessonTitle) {
  $parts = [Collections.Generic.List[string]]::new()
  foreach ($file in $Files | Sort-Object Name) {
    if ($file.Extension -ieq '.docx') {
      $text = Get-DocxText $file.FullName
      if ($text) {
        $paragraphs = (Get-CleanDocxParagraphs $text | Select-Object -First 90 | ForEach-Object { ConvertTo-HtmlText $_ }) -join '</p><p>'
        $parts.Add("<section><h3>$(ConvertTo-HtmlText (Get-CleanTitle $file.Name))</h3><p>$paragraphs</p></section>")
      }
    } elseif ($file.Extension -ieq '.pdf') {
      $parts.Add("<section><h3>$(ConvertTo-HtmlText (Get-CleanTitle $file.Name))</h3><p>This supplied course resource is incorporated into the guided lesson sequence. Work through the concept with Thandi, record your key observations, and apply it in the lesson activity.</p></section>")
    }
    if (($parts -join '').Length -ge 14000) { break }
  }
  if ($parts.Count -eq 0) {
    $parts.Add("<p>Explore the principles and practical application of $(ConvertTo-HtmlText $LessonTitle). Use the guided examples, complete the activity, and reflect on how the skill transfers to a real workplace or study setting.</p>")
  }
  return "<h2>$(ConvertTo-HtmlText $LessonTitle)</h2>" + (($parts -join '')).Substring(0, [Math]::Min(6500, ($parts -join '').Length)) + '<aside><strong>Interactive lecture:</strong> Say &quot;Thandi, I have a question&quot; at any point. Thandi will pause, answer from the approved lesson material, provide an example when requested, and then continue from the last completed concept.</aside>'
}

function New-ThandiConfig([string]$CourseTitle) {
  return [ordered]@{
    enabled = $true
    embedUrl = 'https://vowhumans.com/embed/c81cca0d-866f-466c-a60d-c343dcdab9c4/goalvow-academies'
    presenterName = 'Thandi'
    introduction = "Thandi presents this $CourseTitle lesson as an interactive lecture and can pause for learner questions."
    placement = 'before-content'
    role = 'presenter'
    expertise = "$CourseTitle interactive learning guide"
    cameraEnabled = $false
    microphoneEnabled = $true
  }
}

function Export-CourseVisual([string]$CoursePath, [string]$Slug, [string]$OutputDirectory) {
  $direct = Get-ChildItem -LiteralPath $CoursePath -Recurse -File |
    Where-Object { $_.Extension.ToLowerInvariant() -in @('.jpg','.jpeg','.png') } |
    Sort-Object Length -Descending |
    Select-Object -First 1
  if ($direct) {
    $extension = $direct.Extension.ToLowerInvariant()
    Copy-Item -LiteralPath $direct.FullName -Destination (Join-Path $OutputDirectory "$Slug$extension") -Force
    return $extension
  }

  $best = $null
  foreach ($document in (Get-ChildItem -LiteralPath $CoursePath -Recurse -File | Where-Object { $_.Extension -ieq '.docx' } | Sort-Object Length -Descending | Select-Object -First 30)) {
    try {
      $archive = [IO.Compression.ZipFile]::OpenRead($document.FullName)
      try {
        foreach ($entry in $archive.Entries) {
          $extension = [IO.Path]::GetExtension($entry.Name).ToLowerInvariant()
          if ($entry.FullName -like 'word/media/*' -and $extension -in @('.jpg','.jpeg','.png') -and $entry.Length -gt 50000) {
            if (-not $best -or $entry.Length -gt $best.Length) {
              $memory = [IO.MemoryStream]::new()
              $stream = $entry.Open()
              try { $stream.CopyTo($memory) } finally { $stream.Dispose() }
              $best = [pscustomobject]@{ Bytes=$memory.ToArray(); Extension=$extension; Length=$entry.Length }
              $memory.Dispose()
            }
          }
        }
      } finally { $archive.Dispose() }
    } catch { }
  }
  if (-not $best) { return $null }
  [IO.File]::WriteAllBytes((Join-Path $OutputDirectory "$Slug$($best.Extension)"), $best.Bytes)
  return $best.Extension
}

$courseMetadata = [ordered]@{
  'Adobe After Effects' = @('Create professional motion graphics, visual effects, compositing, and publication-ready media using Adobe After Effects.', 'Advanced')
  'Adobe Animate' = @('Design interactive animation, vector motion, character sequences, and publishable digital experiences using Adobe Animate.', 'Intermediate')
  'Adobe Illustrator' = @('Build production-ready vector artwork, brand assets, illustrations, and scalable visual systems using Adobe Illustrator.', 'Intermediate')
  'Adobe InDesign' = @('Create polished editorial layouts, publications, interactive documents, and print-ready assets using Adobe InDesign.', 'Intermediate')
  'Adobe Photoshop' = @('Develop professional image editing, compositing, retouching, and digital design skills using Adobe Photoshop.', 'Intermediate')
  'Adobe Premiere Pro' = @('Plan, edit, refine, and publish professional video stories using Adobe Premiere Pro workflows.', 'Advanced')
  'Space Travel and Solar System' = @('Explore spaceflight, planetary science, mission systems, settlement concepts, and emerging space careers.', 'Foundation')
  'AgriScience 1' = @('Build foundational knowledge of agricultural systems, food production, sustainability, and modern farming practice.', 'Foundation')
  'AgriScience 2' = @('Apply intermediate agricultural science to crop, soil, livestock, resource, and production decisions.', 'Intermediate')
  'AgriScience 3' = @('Evaluate advanced agriscience systems, innovation, enterprise, and sustainable production challenges.', 'Advanced')
  'Architectural Design 1' = @('Learn foundational design thinking, drawing, space planning, and architectural communication.', 'Foundation')
  'Architectural Design 2' = @('Develop architectural concepts through technical drawing, materials, modelling, and design development.', 'Intermediate')
  'Architectural Design 3' = @('Create integrated architectural proposals using advanced design, documentation, and presentation practice.', 'Advanced')
  'Augmented and Virtual Reality' = @('Design immersive AR and VR experiences through spatial thinking, interaction design, prototyping, and responsible deployment.', 'Intermediate')
  'Drones Remote Pilot' = @('Build safe, responsible remote-pilot knowledge covering flight principles, planning, operations, regulation, and applications.', 'Intermediate')
  'Entrepreneurship and Small Business' = @('Turn ideas into viable ventures through business modelling, customers, operations, finance, and growth planning.', 'Foundation')
  'Startups and Innovation' = @('Validate opportunities, design innovative solutions, test business models, and build an evidence-led startup pathway.', 'Intermediate')
  'Early Childhood Education 1' = @('Build foundational knowledge of child development, inclusive learning, safety, play, and family engagement.', 'Foundation')
  'Early Childhood Education 2' = @('Plan responsive early-learning experiences, observation, assessment, inclusion, and professional practice.', 'Intermediate')
  'Education and Teaching Advanced' = @('Strengthen advanced pedagogy, assessment, learning design, inclusive practice, and evidence-led teaching.', 'Advanced')
  'Fundamentals of Bitcoin and Crypto' = @('Understand Bitcoin, crypto assets, wallets, transactions, security, risk, and responsible participation.', 'Foundation')
  'Fundamentals of Blockchain and Crypto' = @('Explore blockchain architecture, consensus, smart contracts, token systems, use cases, and governance.', 'Intermediate')
  'Introduction to AI' = @('Understand artificial intelligence, machine learning, algorithms, applications, ethics, and future career pathways.', 'Foundation')
  'Robotics' = @('Explore robotics systems, sensors, control, programming, design, testing, and real-world applications.', 'Intermediate')
  'Smart Cities' = @('Analyse connected urban systems, data, mobility, energy, services, inclusion, and sustainable city innovation.', 'Intermediate')
  'Teaching as a Profession' = @('Prepare for ethical, reflective teaching through pedagogy, planning, assessment, inclusion, and professional growth.', 'Foundation')
  'Transportation Technologies' = @('Explore transport systems, vehicle technologies, logistics, safety, sustainability, and future mobility.', 'Intermediate')
  'Wearable Technology' = @('Design and evaluate wearable systems using sensors, human-centred design, data, privacy, and prototyping.', 'Intermediate')
  'Swift App Development' = @('Build practical iOS application skills with Swift, interface design, data, testing, and deployment workflows.', 'Intermediate')
  'Java SE 8 Associate' = @('Build core Java programming capability in syntax, object orientation, data structures, errors, and application logic.', 'Intermediate')
  'Intuit Design for Delight' = @('Use customer empathy, rapid experimentation, and design-for-delight methods to create stronger solutions.', 'Foundation')
  'Career Exploration' = @('Discover strengths, career clusters, workplace expectations, decision tools, and an actionable career plan.', 'Foundation')
  'Digital Information Technology' = @('Build confident digital-work skills across devices, information, productivity, collaboration, security, and responsible technology use.', 'Foundation')
  'Meta Social Media Marketing' = @('Plan, create, measure, and optimise responsible social campaigns across Meta platforms.', 'Intermediate')
  'Social Media Marketing' = @('Develop social strategy, content, community, campaigns, measurement, risk, and professional presentation skills.', 'Intermediate')
  'Building Maintenance Technology 1' = @('Build foundational maintenance capability across tools, safety, structures, services, inspections, and preventative work.', 'Foundation')
  'Building Maintenance Technology 2' = @('Apply advanced diagnostics, systems maintenance, planning, compliance, and sustainable facilities practice.', 'Advanced')
}

$nameOverrides = @{
  4 = 'Adobe InDesign'; 6 = 'Adobe Premiere Pro'; 7 = 'Space Travel and Solar System';
  8 = 'AgriScience 1'; 9 = 'AgriScience 2'; 10 = 'AgriScience 3';
  11 = 'Architectural Design 1'; 12 = 'Architectural Design 2'; 13 = 'Architectural Design 3';
  14 = 'Augmented and Virtual Reality'; 15 = 'Drones Remote Pilot'; 16 = 'Entrepreneurship and Small Business';
  17 = 'Startups and Innovation'; 18 = 'Early Childhood Education 1'; 19 = 'Early Childhood Education 2';
  20 = 'Education and Teaching Advanced'; 21 = 'Fundamentals of Bitcoin and Crypto'; 22 = 'Fundamentals of Blockchain and Crypto';
  23 = 'Introduction to AI'; 24 = 'Robotics'; 25 = 'Smart Cities'; 26 = 'Teaching as a Profession';
  27 = 'Transportation Technologies'; 28 = 'Wearable Technology'; 29 = 'Swift App Development'; 30 = 'Java SE 8 Associate';
  31 = 'Intuit Design for Delight'; 32 = 'Career Exploration'; 33 = 'Digital Information Technology';
  34 = 'Meta Social Media Marketing'; 35 = 'Social Media Marketing'; 36 = 'Building Maintenance Technology 1';
  37 = 'Building Maintenance Technology 2'
}

$authoredEmptyModules = @{
  26 = @('Professional Identity and Ethics','How Learning Happens','Planning Inclusive Learning','Teaching and Facilitation Practice','Assessment and Feedback','Classroom Culture and Safeguarding','Reflective Practice and Professional Growth')
  33 = @('Digital Foundations','Information and Media Literacy','Productivity and File Management','Digital Collaboration','Data Fundamentals','Cyber Safety and Privacy','Digital Problem Solving and Emerging Technology')
  34 = @('Meta Platform Foundations','Audience and Customer Insight','Content Strategy and Creative','Campaign Planning in Meta Ads','Community and Conversation','Measurement and Optimisation','Brand Safety Privacy and Responsible Marketing')
}

if (-not (Test-Path -LiteralPath $SourceRoot)) { throw "SAVVA source folder not found: $SourceRoot" }

$courses = [Collections.Generic.List[object]]::new()
$visuals = [ordered]@{}
$imageOutput = Join-Path $ProjectRoot 'public\images\courses\career'
New-Item -ItemType Directory -Force -Path $imageOutput | Out-Null
Get-ChildItem -LiteralPath $imageOutput -File | Where-Object { $_.Extension.ToLowerInvariant() -notin @('.jpg','.jpeg','.png','.webp') } | ForEach-Object { Remove-Item -LiteralPath $_.FullName -Force }

$folders = Get-ChildItem -LiteralPath $SourceRoot -Directory | Where-Object { $_.Name -match '^(\d+)_' -and [int]$Matches[1] -gt 0 } | Sort-Object { [int]($_.Name -replace '^(\d+).*','$1') }
foreach ($folder in $folders) {
  [void]($folder.Name -match '^(\d+)_')
  $number = [int]$Matches[1]
  $title = if ($nameOverrides.ContainsKey($number)) { $nameOverrides[$number] } else { (Get-CleanTitle $folder.Name) -replace ' Course$', '' }
  $slug = Get-Slug $title
  $meta = $courseMetadata[$title]
  if (-not $meta) { throw "Missing metadata for course $number - $title" }

  $moduleFolders = Get-ChildItem -LiteralPath $folder.FullName -Directory | Sort-Object { if ($_.Name -match '^(\d+)') { [int]$Matches[1] } else { 999 } }, Name
  if ($moduleFolders.Count -eq 0 -and $authoredEmptyModules.ContainsKey($number)) {
    $moduleFolders = @()
  }

  $modules = [Collections.Generic.List[object]]::new()
  $assessments = [Collections.Generic.List[object]]::new()
  $moduleTitles = [Collections.Generic.List[string]]::new()

  if ($moduleFolders.Count -eq 0) {
    $synthetic = $authoredEmptyModules[$number]
    for ($i = 0; $i -lt $synthetic.Count; $i++) {
      $moduleTitle = if ($i -eq 0) { 'Module 0: Introduction, Purpose, Objectives, Summary' } else { "Module $i`: $($synthetic[$i - 1])" }
      $moduleTitles.Add($moduleTitle)
      $lessonNames = if ($i -eq 0) { @('Welcome and Course Navigation','Course Purpose and Professional Relevance','Learning Objectives and Success Plan','Orientation Summary and Readiness Check') } else { @("Understanding $($synthetic[$i - 1])", "Applying $($synthetic[$i - 1])", 'Guided Workplace Scenario', 'Reflection and Evidence Activity', 'Module Summary') }
      $lessons = [Collections.Generic.List[object]]::new()
      foreach ($lessonName in $lessonNames) {
        $lessonSlug = "$slug-m$i-$(Get-Slug $lessonName)"
        $content = "<h2>$(ConvertTo-HtmlText $lessonName)</h2><p>This professionally authored lesson develops practical capability in $(ConvertTo-HtmlText $lessonName.ToLowerInvariant()) within $title. Work through Thandi's guided explanation, test the concept in the scenario, and capture evidence of your application.</p><h3>Learning sequence</h3><ol><li>Connect the concept to a real context.</li><li>Study the core principle and worked example.</li><li>Apply the principle in a decision or practical task.</li><li>Reflect, improve, and record evidence.</li></ol><aside><strong>Interactive lecture:</strong> Say &quot;Thandi, I have a question&quot; to pause the lecture. Thandi will answer, offer an example when requested, and resume from the last completed concept.</aside>"
        $lessons.Add([ordered]@{ slug=$lessonSlug; title=$lessonName; type='text'; content=$content; hasAssessment=$false; hasVRPractice=$false; durationMinutes=12; vowHuman=(New-ThandiConfig $title) })
      }
      $modules.Add([ordered]@{ title=$moduleTitle; order=$i; description="Build capability in $moduleTitle."; outcome="Apply the principles of $moduleTitle in a practical context."; isFree=($i -eq 0); lessons=$lessons })
    }
  } else {
    $moduleOrder = 0
    foreach ($moduleFolder in $moduleFolders) {
      $moduleTitleClean = Get-CleanTitle $moduleFolder.Name
      $moduleTitleClean = $moduleTitleClean -replace '^Module\s+\d+\s*', ''
      $moduleTitle = if ($moduleOrder -eq 0) { 'Module 0: Introduction, Purpose, Objectives, Summary' } else { "Module $moduleOrder`: $moduleTitleClean" }
      $moduleTitles.Add($moduleTitle)
      $lessonGroups = Get-ChildItem -LiteralPath $moduleFolder.FullName -Directory | Sort-Object { if ($_.Name -match '^(\d+)') { [int]$Matches[1] } else { 999 } }, Name
      $lessons = [Collections.Generic.List[object]]::new()
      $lessonIndex = 0
      if ($lessonGroups.Count -eq 0) { $lessonGroups = @($moduleFolder) }
      foreach ($group in $lessonGroups) {
        $files = Get-ChildItem -LiteralPath $group.FullName -File | Where-Object { $_.Extension -in @('.docx','.pdf') }
        if ($files.Count -eq 0) { continue }
        $lessonIndex++
        $lessonTitle = Get-CleanTitle $group.Name
        if ($lessonTitle -match '^(Intro|Introduction)$') { $lessonTitle = 'Introduction, Purpose and Objectives' }
        $type = if ($lessonTitle -match '(Quiz|Quize|Test|Assessment)') { 'assessment' } else { 'text' }
        $lessonSlug = "$slug-m$moduleOrder-l$lessonIndex-$(Get-Slug $lessonTitle)"
        $content = if ($type -eq 'assessment') { "<h2>Knowledge check</h2><p>Demonstrate your understanding of $moduleTitleClean. A score of 80% is required; review the lesson content and try again when needed.</p>" } else { Get-DocumentHtml $files $lessonTitle }
        $durationMinutes = if ($type -eq 'assessment') { 20 } else { 12 }
        $lesson = [ordered]@{ slug=$lessonSlug; title=$lessonTitle; type=$type; content=$content; hasAssessment=($type -eq 'assessment'); hasVRPractice=$false; durationMinutes=$durationMinutes }
        if ($type -eq 'text') { $lesson.vowHuman = New-ThandiConfig $title }
        $lessons.Add($lesson)
      }
      if ($lessons.Count -eq 0) {
        $lessonSlug = "$slug-m$moduleOrder-guided-learning"
        $lessons.Add([ordered]@{ slug=$lessonSlug; title='Guided Learning'; type='text'; content="<h2>$moduleTitleClean</h2><p>Build and apply the essential concepts in this module through guided explanation, practical examples, and reflective activities.</p>"; hasAssessment=$false; hasVRPractice=$false; durationMinutes=15; vowHuman=(New-ThandiConfig $title) })
      }
      $modules.Add([ordered]@{ title=$moduleTitle; order=$moduleOrder; description="Source-aligned learning for $moduleTitleClean."; outcome="Explain and apply the core concepts in $moduleTitleClean."; isFree=($moduleOrder -eq 0); lessons=$lessons })
      $moduleOrder++
    }
  }

  $lastModule = $modules[$modules.Count - 1]
  $finalSlug = "$slug-course-mastery-assessment"
  $lastModule.lessons += [ordered]@{ slug=$finalSlug; title='Course Mastery Assessment'; type='assessment'; content='<h2>Course mastery assessment</h2><p>Bring together knowledge and application from the complete course. Achieve at least 80% to satisfy the assessment requirement for certification.</p>'; hasAssessment=$true; hasVRPractice=$false; durationMinutes=30 }
  $moduleOptions = @($modules | Where-Object { $_['order'] -gt 0 } | ForEach-Object { $_['title'] })
  if ($moduleOptions.Count -lt 2) { $moduleOptions = @($modules | ForEach-Object { $_['title'] }) }
  $questions = [Collections.Generic.List[object]]::new()
  $assessmentTemplates = @(
    [ordered]@{ prompt='Before starting a practical task in {topic}, which action best demonstrates professional judgement?'; answer='Clarify the intended outcome, constraints, and success criteria before choosing tools.'; distractors=@('Choose the fastest tool and define the goal afterward.','Copy the first available example without checking its fit.','Begin production immediately and leave requirements for final review.'); explanation='Strong practice begins with a clear outcome, constraints, and measurable success criteria.'; clue='Think about what must be understood before execution begins.' },
    [ordered]@{ prompt='A first attempt in {topic} does not meet the requirement. What is the strongest next step?'; answer='Compare the result with the criteria, identify the cause, revise, and test again.'; distractors=@('Submit the attempt unchanged because the task is complete.','Replace the criteria with measures the attempt already meets.','Discard all evidence and restart without diagnosing the issue.'); explanation='An evidence-led improvement cycle diagnoses the gap before a focused revision and retest.'; clue='Use feedback and evidence to improve the next attempt.' },
    [ordered]@{ prompt='Which evidence most credibly demonstrates applied competence in {topic}?'; answer='A completed work sample with decisions, checks, feedback, and reflection documented.'; distractors=@('A claim that the topic was understood without a work sample.','A list of tools with no explanation of how they were used.','An unfinished draft that has not been checked against requirements.'); explanation='Competence is best demonstrated through completed, reviewed evidence and reflective reasoning.'; clue='Choose evidence that shows both the result and how quality was established.' },
    [ordered]@{ prompt='When work in {topic} could affect people, data, safety, or the environment, what should the learner do?'; answer='Identify the risks, follow relevant standards, obtain required consent, and document safeguards.'; distractors=@('Proceed without checks when the intended outcome is positive.','Treat ethical and safety considerations as optional after delivery.','Hide known limitations so stakeholders remain confident.'); explanation='Responsible practice makes risk, consent, standards, and safeguards part of the work itself.'; clue='Professional quality includes the impact of the work, not only the output.' },
    [ordered]@{ prompt='How should a learner transfer skills from {topic} to a new workplace or project context?'; answer='Analyse the new context, adapt the method, test assumptions, and evaluate the result.'; distractors=@('Repeat the original steps unchanged regardless of context.','Use only familiar methods and ignore new constraints.','Wait for a complete example to copy before making any decision.'); explanation='Transfer requires adapting core principles to new constraints and validating the result.'; clue='Core principles remain useful, but their application must fit the new context.' }
  )
  for ($q = 0; $q -lt $assessmentTemplates.Count; $q++) {
    $template = $assessmentTemplates[$q]
    $topic = $moduleOptions[$q % $moduleOptions.Count] -replace '^Module\s+\d+\s*:\s*', ''
    $prompt = $template.prompt.Replace('{topic}', $topic)
    $options = @($template.answer) + @($template.distractors)
    $questions.Add([ordered]@{ id="$finalSlug-q$($q+1)"; type='multiple-choice'; prompt=$prompt; options=$options; answer=$template.answer; explanation=$template.explanation; clue=$template.clue })
  }
  $assessments.Add([ordered]@{ slug=$finalSlug; lessonSlug=$finalSlug; title="$title Course Mastery Assessment"; passMark=80; questions=$questions })

  $nonIntro = @($moduleTitles | Where-Object { $_ -notmatch '^Module 0' })
  $outcomes = @(
    "Explain the core principles and professional language of $title",
    "Apply $title methods in realistic projects and workplace scenarios",
    "Evaluate quality, risk, ethics, and responsible practice in $title",
    "Create a practical evidence portfolio and earn a GoalVow $title certificate"
  )
  $lessonCount = ($modules | ForEach-Object { $_.lessons.Count } | Measure-Object -Sum).Sum
  $durationWeeks = [Math]::Max(6, [Math]::Ceiling($lessonCount / 8))
  $courses.Add([ordered]@{
    slug=$slug; moodleId=$null; title=$title; academySlug='upskilling-academy'; description=$meta[0]; level=$meta[1]; duration="$durationWeeks weeks"; price=999; status='draft'; modules=$modules; assessments=$assessments; vrPractices=@(); outcomes=$outcomes; rewards=($modules.Count * 120)
    opportunityPathways=[ordered]@{ employment=@("$title practitioner","Junior $title specialist","$title project assistant"); entrepreneurship=@("Freelance $title services","Independent $title projects","Training and advisory services"); furtherStudy=@("Advanced $title certification","Related diploma or degree pathway","Professional portfolio development") }
    coursePreview=[ordered]@{ purpose="Build practical, portfolio-ready $title capability through structured source-aligned learning and an interactive digital-human lecturer."; benefits=@('Learn from supplied professional courseware in a clear sequence','Pause Thandi to ask questions and request practical examples','Complete assignments, projects, summaries, and mastery checks','Build evidence toward a verified GoalVow certificate') }
  })

  $curatedEmptyVisual = if ($authoredEmptyModules.ContainsKey($number)) {
    Get-ChildItem -LiteralPath $imageOutput -File | Where-Object { $_.BaseName -eq $slug -and $_.Extension.ToLowerInvariant() -in @('.jpg','.jpeg','.png','.webp') } | Select-Object -First 1
  } else { $null }
  $ext = if ($curatedEmptyVisual) { $curatedEmptyVisual.Extension.ToLowerInvariant() } else { Export-CourseVisual $folder.FullName $slug $imageOutput }
  if ($ext) {
    $visuals[$slug] = [ordered]@{ src="/images/courses/career/$slug$ext"; alt="A source-aligned visual for the $title course." }
  } else {
    $visuals[$slug] = [ordered]@{ src='/images/vowlms/course-presenter.webp'; alt="Thandi presents the $title course in an interactive digital classroom." }
  }
}

$dataPath = Join-Path $ProjectRoot 'src\data\savva-career-courses.json'
$visualPath = Join-Path $ProjectRoot 'src\data\savva-career-visuals.json'
$manifestPath = Join-Path $ProjectRoot 'src\data\savva-career-manifest.json'
$utf8 = [Text.UTF8Encoding]::new($false)
[IO.File]::WriteAllText($dataPath, ($courses | ConvertTo-Json -Depth 30), $utf8)
[IO.File]::WriteAllText($visualPath, ($visuals | ConvertTo-Json -Depth 10), $utf8)
[IO.File]::WriteAllText($manifestPath, (@($courses | ForEach-Object { [ordered]@{ slug=$_['slug']; title=$_['title'] } }) | ConvertTo-Json -Depth 5), $utf8)

Write-Output "Generated $($courses.Count) admin-only SAVVA career courses."
Write-Output "Course data: $dataPath"
Write-Output "Visual map: $visualPath"
Write-Output "Admin manifest: $manifestPath"
