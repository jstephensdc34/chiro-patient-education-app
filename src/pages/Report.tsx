
import { useState, useEffect } from "react";
import { CategoryType, PatientInfo } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { ReportSettings } from "@/components/report/ReportSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReportSettings } from "@/hooks/useReportSettings";
import { useSupabaseConnection } from "@/hooks/useSupabaseConnection";
import { useReportData } from "@/hooks/useReportData";
import { useReportGeneration } from "@/hooks/useReportGeneration";
import { ReportBuilder } from "@/components/report/ReportBuilder";

const Report = () => {
  const { connectionStatus } = useSupabaseConnection();
  const { settings, loading: settingsLoading, reloadSettings } = useReportSettings(connectionStatus);
  const { items, subcategories, isLoading } = useReportData();
  const {
    patient,
    selectedItems,
    additionalNotes,
    activeCategory,
    isGeneratingPDF,
    handlePatientInfoChange,
    handleToggleItem,
    handleGenerateReport,
    setAdditionalNotes,
    setActiveCategory
  } = useReportGeneration(items, settings, subcategories);
  
  const [activeTab, setActiveTab] = useState<"report" | "settings">("report");
  
  // Reload settings when active tab changes to report
  useEffect(() => {
    if (activeTab === "report") {
      reloadSettings();
    }
  }, [activeTab, reloadSettings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "report" | "settings")} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="report">Report Builder</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="report">
            <ReportBuilder 
              patient={patient}
              items={items}
              selectedItems={selectedItems}
              additionalNotes={additionalNotes}
              settings={settings}
              settingsLoading={settingsLoading}
              isLoading={isLoading}
              isGeneratingPDF={isGeneratingPDF}
              subcategories={subcategories}
              activeCategory={activeCategory}
              onPatientInfoChange={handlePatientInfoChange}
              onToggleItem={handleToggleItem}
              onCategoryChange={setActiveCategory}
              onNotesChange={setAdditionalNotes}
              onGeneratePDF={handleGenerateReport}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <ReportSettings onSettingsUpdated={reloadSettings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Report;
