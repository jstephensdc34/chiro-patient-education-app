interface TreatmentScheduleParts {
  visitsPerPeriod?: string;
  periodUnit?: "week" | "month";
  duration?: string;
  durationUnit?: "weeks" | "months";
}

/**
 * Composes a human-readable treatment schedule sentence, e.g.
 * "3 visits per week for 6 weeks". Handles partial entries gracefully
 * and returns an empty string when nothing is entered.
 */
export const composeTreatmentSchedule = ({
  visitsPerPeriod,
  periodUnit,
  duration,
  durationUnit,
}: TreatmentScheduleParts): string => {
  const visits = (visitsPerPeriod || "").trim();
  const dur = (duration || "").trim();

  const frequencyPart = visits
    ? `${visits} visit${visits === "1" ? "" : "s"} per ${periodUnit || "week"}`
    : "";

  const durationPart = dur
    ? `${dur} ${durationUnit || "weeks"}${Number(dur) === 1 ? "" : ""}`.replace("1 weeks", "1 week").replace("1 months", "1 month")
    : "";

  if (frequencyPart && durationPart) {
    return `${frequencyPart} for ${durationPart}`;
  }
  if (frequencyPart) return frequencyPart;
  if (durationPart) return `${durationPart} of care`;
  return "";
};
