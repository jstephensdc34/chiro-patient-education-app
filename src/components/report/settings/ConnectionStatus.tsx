
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ConnectionStatusProps {
  connectionStatus: "checking" | "connected" | "disconnected";
  isAuthenticated: boolean;
}

export const ConnectionStatus = ({ connectionStatus, isAuthenticated }: ConnectionStatusProps) => {
  const { user } = useAuth();
  
  return (
    <>
      <div className="text-sm font-normal">
        {connectionStatus === "checking" && "Checking database connection..."}
        {connectionStatus === "connected" && (
          <span className="text-success flex items-center">
            <span className="h-2 w-2 bg-success rounded-full mr-2"></span>
            Connected to database
          </span>
        )}
        {connectionStatus === "disconnected" && (
          <span className="text-destructive flex items-center">
            <span className="h-2 w-2 bg-destructive rounded-full mr-2"></span>
            Database disconnected
          </span>
        )}
      </div>
      {!isAuthenticated && (
        <div className="bg-warning-soft border-l-4 border-warning p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-warning mb-2 md:mb-0">
              You are not authenticated. You can view settings, but you won't be able to create, update, or delete them.
            </p>
            <Link to="/auth">
              <Button className="bg-primary-accent hover:bg-primary/90 whitespace-nowrap">
                Login / Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
