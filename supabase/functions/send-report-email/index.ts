import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EmailReportRequest {
  recipientEmail: string;
  subject?: string;
  patientName: string;
  clinicName: string;
  clinicEmail?: string;
  clinicPhone?: string;
  clinicWebsite?: string;
  logoUrl?: string;
  fullReportUrl: string;
  overviewReportUrl: string;
}

const escapeHtml = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const buildHtml = (d: EmailReportRequest) => {
  const clinicName = escapeHtml(d.clinicName);
  const patient = escapeHtml(d.patientName);
  const footerLine = [d.clinicPhone, d.clinicEmail, d.clinicWebsite]
    .filter(Boolean)
    .map((v) => escapeHtml(v!))
    .join(" &middot; ");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr><td style="padding:32px 36px 8px 36px;text-align:center;">
          ${d.logoUrl ? `<img src="${escapeHtml(d.logoUrl)}" alt="${clinicName}" style="max-height:64px;margin-bottom:16px;" />` : ""}
          <h1 style="margin:0;font-size:20px;color:#111827;font-weight:700;">${clinicName}</h1>
        </td></tr>

        <tr><td style="padding:24px 36px 8px 36px;">
          <p style="margin:0 0 16px 0;font-size:16px;line-height:1.55;color:#1f2937;">Hello${patient ? `, ${patient}` : ""},</p>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#374151;">
            Your clinical <strong>Report of Findings</strong> and <strong>Care Plan</strong> is ready to view.
            Please click the links below to securely access your documents:
          </p>
        </td></tr>

        <tr><td align="center" style="padding:0 36px 8px 36px;">
          <a href="${escapeHtml(d.overviewReportUrl)}" target="_blank"
             style="display:inline-block;width:80%;padding:14px 20px;margin:6px 0;background:#059669;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;text-align:center;">
            View Overview Report
          </a>
        </td></tr>
        <tr><td align="center" style="padding:0 36px 24px 36px;">
          <a href="${escapeHtml(d.fullReportUrl)}" target="_blank"
             style="display:inline-block;width:80%;padding:14px 20px;margin:6px 0;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;text-align:center;">
            View Full Report
          </a>
        </td></tr>

        <tr><td style="padding:8px 36px 32px 36px;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
            If you have any questions, please contact the clinic.
          </p>
        </td></tr>

        <tr><td style="padding:20px 36px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:12px;">
          <div style="font-weight:600;color:#374151;margin-bottom:4px;">${clinicName}</div>
          ${footerLine ? `<div>${footerLine}</div>` : ""}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const data: EmailReportRequest = await req.json();

    if (!data.recipientEmail || !data.fullReportUrl || !data.overviewReportUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clinicName = data.clinicName || "Chiropractic Clinic";
    const fromEmail = Deno.env.get("REPORT_FROM_ADDRESS") || "reports@info.chiropracticspecialistsmn.com";
    const fromAddress = `${clinicName} <${fromEmail}>`;
    const replyTo = data.clinicEmail && data.clinicEmail.includes("@") ? data.clinicEmail : undefined;

    const html = buildHtml(data);
    const subject =
      data.subject || `Your Clinical Report of Findings & Care Plan${data.patientName ? ` – ${data.patientName}` : ""}`;

    const emailConfig: any = {
      from: fromAddress,
      to: [data.recipientEmail],
      subject,
      html,
      text:
        `Hello${data.patientName ? `, ${data.patientName}` : ""},\n\n` +
        `Your clinical Report of Findings and Care Plan is ready to view.\n\n` +
        `Overview Report: ${data.overviewReportUrl}\n` +
        `Full Report: ${data.fullReportUrl}\n\n` +
        `If you have any questions, please contact the clinic.\n\n` +
        `${clinicName}`,
    };
    if (replyTo) emailConfig.reply_to = replyTo;

    const emailResponse = await resend.emails.send(emailConfig);

    if (emailResponse.error) {
      throw new Error(`Email service error: ${emailResponse.error.message || "Unknown error"}`);
    }

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.data?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("send-report-email error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
