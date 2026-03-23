import { supabase } from "@/integrations/supabase/client";
import { PatientInfo, ReportItem } from "@/types";
import { ReportSetting } from "@/services/reportSettingsService";
import { generateReportHtml } from "./pdf/generateReportHtml";

interface ShareReportParams {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  customTreatmentGoals?: string;
  settings: ReportSetting[];
  subcategories: any[];
}

export const shareReport = async (params: ShareReportParams): Promise<string> => {
  const html = generateReportHtml(params);

  // Create a unique filename
  const timestamp = Date.now();
  const safeName = params.patient.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const fileName = `report-${safeName}-${timestamp}.html`;

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from("shared-reports")
    .upload(fileName, new Blob([html], { type: "text/html" }), {
      contentType: "text/html",
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(`Failed to upload report: ${error.message}`);
  }

  // Build the edge function URL to serve the HTML with correct Content-Type
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const serveUrl = `${supabaseUrl}/functions/v1/serve-report?file=${encodeURIComponent(fileName)}`;

  return serveUrl;
};
