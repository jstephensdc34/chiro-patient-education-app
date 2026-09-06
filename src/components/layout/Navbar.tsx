
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <nav className="border-b bg-card px-4 py-2.5 shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <span className="text-xl font-semibold text-primary">Chiro Patient Ed Suite</span>
        </Link>
        <div className="flex items-center lg:order-2">
          <div className="flex space-x-2">
            {isAuthenticated ? (
              <>
                <Link to="/report">
                  <Button variant="default">
                    Create Report
                  </Button>
                </Link>
                <Link to="/library">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary-soft">
                    Manage Library
                  </Button>
                </Link>
                <Button variant="outline" onClick={signOut} className="border-destructive text-destructive hover:bg-destructive/10">
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default">
                  Login / Sign Up
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
