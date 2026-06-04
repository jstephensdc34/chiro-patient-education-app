export interface ComposeReportEmailParams {
  patientName: string;
  clinicName: string;
  fullReportUrl: string;
  overviewReportUrl: string;
}

export interface ComposedEmail {
  subject: string;
  body: string;
}

export const composeReportEmail = ({
  patientName,
  clinicName,
  fullReportUrl,
  overviewReportUrl,
}: ComposeReportEmailParams): ComposedEmail => {
  const subject = `Your Clinical Report of Findings & Care Plan${patientName ? ` – ${patientName}` : ""}`;

  const body = [
    `Hi${patientName ? ` ${patientName}` : ""},`,
    "",
    "Your Clinical Report of Findings & Care Plan is ready to view.",
    "",
    `Full Report: ${fullReportUrl}`,
    `Overview: ${overviewReportUrl}`,
    "",
    "Please reply to this email with any questions.",
    "",
    `— ${clinicName}`,
  ].join("\n");

  return { subject, body };
};

export const buildMailtoUrl = ({ subject, body }: ComposedEmail): string => {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
