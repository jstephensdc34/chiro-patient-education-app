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

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("shared-reports")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};
