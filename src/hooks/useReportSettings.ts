
import { useState, useEffect } from "react";
import { ReportSetting, fetchSettings } from "@/services/reportSettingsService";

export const useReportSettings = (connectionStatus: "checking" | "connected" | "disconnected") => {
  const [settings, setSettings] = useState<ReportSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching settings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load settings on initial render and when connection status changes
  useEffect(() => {
    if (connectionStatus === "connected") {
      loadSettings();
    }
  }, [connectionStatus]);

  return { 
    settings, 
    loading, 
    error, 
    setSettings, 
    reloadSettings: loadSettings 
  };
};
