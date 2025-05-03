
import { supabase } from "@/integrations/supabase/client";

export interface ReportSetting {
  id: string;
  name: string;
  value: string;
  created_at: string;
}

export const fetchSettings = async (): Promise<ReportSetting[]> => {
  const { data, error } = await supabase
    .from("report_settings")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching report settings:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const createSetting = async (name: string, value: string): Promise<ReportSetting> => {
  const { data, error } = await supabase
    .from("report_settings")
    .insert({ name, value })
    .select()
    .single();

  if (error) {
    console.error("Error creating report setting:", error);
    throw new Error(error.message);
  }

  return data;
};

export const updateSetting = async (id: string, value: string): Promise<void> => {
  const { error } = await supabase
    .from("report_settings")
    .update({ value })
    .eq("id", id);

  if (error) {
    console.error("Error updating report setting:", error);
    throw new Error(error.message);
  }
};

export const deleteSetting = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("report_settings")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting report setting:", error);
    throw new Error(error.message);
  }
};
