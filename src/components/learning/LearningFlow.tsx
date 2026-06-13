const steps = [
  "Academy",
  "Course",
  "Module",
  "Lesson",
  "Assessment",
  "VR Practice",
  "Results",
  "Certificate",
  "Rewards",
  "Opportunities",
];

export function LearningFlow() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step, index) => (
        <div key={step} className="rounded-lg border border-white/10 bg-white/10 p-4">
          <p className="text-sm font-semibold text-gold">{String(index + 1).padStart(2, "0")}</p>
          <p className="mt-3 text-base font-semibold text-white">{step}</p>
        </div>
      ))}
    </div>
  );
}
