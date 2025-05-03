
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ConnectionStatusProps {
  connectionStatus: "checking" | "connected" | "disconnected";
  isAuthenticated: boolean;
}

export const ConnectionStatus = ({ connectionStatus, isAuthenticated }: ConnectionStatusProps) => {
  return (
    <>
      <div className="text-sm font-normal">
        {connectionStatus === "checking" && "Checking database connection..."}
        {connectionStatus === "connected" && (
          <span className="text-green-600 flex items-center">
            <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
            Connected to database
          </span>
        )}
        {connectionStatus === "disconnected" && (
          <span className="text-red-600 flex items-center">
            <span className="h-2 w-2 bg-red-600 rounded-full mr-2"></span>
            Database disconnected
          </span>
        )}
      </div>
      {!isAuthenticated && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">
            You are not authenticated. You can view settings, but you won't be able to create, update, or delete them.
          </p>
        </div>
      )}
    </>
  );
};
