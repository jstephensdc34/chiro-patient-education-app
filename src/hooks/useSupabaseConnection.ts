
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";

export const useSupabaseConnection = () => {
  const { isAuthenticated } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple ping to verify connection
        const { data } = await supabase.from("report_settings").select("count").limit(1);
        setConnectionStatus("connected");
      } catch (error) {
        console.error("Database connection error:", error);
        setConnectionStatus("disconnected");
      }
    };

    checkConnection();
  }, []);

  return { isAuthenticated, connectionStatus };
};
