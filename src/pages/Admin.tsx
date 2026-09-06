
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { CopyLibraryItems } from "@/components/admin/CopyLibraryItems";
import { useAuth } from "@/components/auth/AuthContext";

const Admin = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Admin Dashboard</h1>
        
        <div className="grid gap-6">
          <CopyLibraryItems />
          {/* Add more admin tools here as needed */}
        </div>
      </main>
    </div>
  );
};

export default Admin;
