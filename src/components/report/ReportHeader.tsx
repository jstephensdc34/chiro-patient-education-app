
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ReportSetting } from "@/services/reportSettingsService";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportHeaderProps {
  settings?: ReportSetting[];
  loading?: boolean;
}

export const ReportHeader = ({ settings = [], loading = false }: ReportHeaderProps) => {
  const [clinicInfo, setClinicInfo] = useState({
    name: "My Chiropractic Clinic",
    website: "www.mychiropractic.com",
    logoUrl: ""
  });

  useEffect(() => {
    if (settings.length > 0) {
      const info = {
        name: settings.find(s => s.name === "clinic_name")?.value || clinicInfo.name,
        website: settings.find(s => s.name === "clinic_website")?.value || clinicInfo.website,
        logoUrl: settings.find(s => s.name === "logo_url")?.value || clinicInfo.logoUrl
      };
      setClinicInfo(info);
    }
  }, [settings]);

  if (loading) {
    return (
      <Card className="mb-6 bg-gray-50 border border-gray-200">
        <CardContent className="pt-4 flex items-center gap-6">
          <Skeleton className="w-32 h-32" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 bg-gray-50 border border-gray-200">
      <CardContent className="pt-4 flex items-center gap-6">
        <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center">
          {clinicInfo.logoUrl ? (
            <img
              src={clinicInfo.logoUrl}
              alt="Clinic Logo"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
              <span className="text-xs text-gray-500">Logo</span>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-medical-700">{clinicInfo.name}</h2>
          <p className="text-sm text-gray-600">{clinicInfo.website}</p>
        </div>
      </CardContent>
    </Card>
  );
};
