
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSupabaseConnection = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple ping to verify connection
        const { data } = await supabase.from("report_settings").select("count").limit(1);
        setConnectionStatus("connected");
        
        // Check authentication status
        const { data: sessionData } = await supabase.auth.getSession();
        setIsAuthenticated(!!sessionData.session);
      } catch (error) {
        console.error("Database connection error:", error);
        setConnectionStatus("disconnected");
      }
    };

    checkConnection();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isAuthenticated, connectionStatus };
};
