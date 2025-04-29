
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <Link to="/" className="flex items-center space-x-3">
          <span className="text-xl font-semibold text-medical-700">ChiroReportCraft</span>
        </Link>
        <div className="flex items-center lg:order-2">
          <div className="flex space-x-2">
            <Link to="/report">
              <Button variant="default" className="bg-medical-600 hover:bg-medical-700">
                Create Report
              </Button>
            </Link>
            <Link to="/library">
              <Button variant="outline" className="text-medical-600 border-medical-600 hover:bg-medical-100">
                Manage Library
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
