const KNOWN_EVENTS: Record<string, string> = {
  enroll: "Course enrolled",
  lesson_complete: "Lesson completed",
  assessment_pass: "Assessment passed",
  certificate_issued: "Certificate issued",
  redemption_donate_sent: "VOWR sent to another learner",
  redemption_donate_received: "VOWR received from another learner",
};

/** Turns a raw `reward_events.event` value into learner-facing copy. */
export function humanizeRewardEvent(event: string): string {
  if (event.startsWith("redemption:")) {
    return event
      .slice("redemption:".length)
      .split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  }
  return KNOWN_EVENTS[event] ?? event.replace(/_/g, " ");
}
