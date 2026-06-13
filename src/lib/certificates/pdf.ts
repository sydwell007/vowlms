function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

export function buildCertificatePdfBytes(input: {
  learnerName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}) {
  const lines = [
    "VowLMS Certificate of Completion",
    `Learner: ${input.learnerName}`,
    `Course: ${input.courseName}`,
    `Completion date: ${input.completionDate}`,
    `Certificate ID: ${input.certificateId}`,
    "GoalVow Academy Ecosystem",
  ];

  const content = [
    "BT",
    "/F1 26 Tf",
    "72 735 Td",
    `(${escapePdfText(lines[0])}) Tj`,
    "/F1 14 Tf",
    "0 -54 Td",
    `(${escapePdfText(lines[1])}) Tj`,
    "0 -30 Td",
    `(${escapePdfText(lines[2])}) Tj`,
    "0 -30 Td",
    `(${escapePdfText(lines[3])}) Tj`,
    "0 -30 Td",
    `(${escapePdfText(lines[4])}) Tj`,
    "0 -58 Td",
    "/F1 12 Tf",
    `(${escapePdfText(lines[5])}) Tj`,
    "ET",
  ].join("\n");

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += object;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}
