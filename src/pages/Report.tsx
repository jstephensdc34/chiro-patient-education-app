
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CategoryType, PatientInfo, ReportItem } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { PatientInfoForm } from "@/components/report/PatientInfoForm";
import { NotesField } from "@/components/report/NotesField";
import { ReportItemsSelector } from "@/components/report/ReportItemsSelector";
import { ReportPreview } from "@/components/report/ReportPreview";
import { ReportSettings } from "@/components/report/ReportSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchItemsByCategory, fetchSubcategories } from "@/services/libraryService";
import { useAuth } from "@/components/auth/AuthContext";
import { useReportSettings } from "@/hooks/useReportSettings";
import { useSupabaseConnection } from "@/hooks/useSupabaseConnection";

const Report = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { connectionStatus } = useSupabaseConnection();
  const { settings, loading: settingsLoading, reloadSettings } = useReportSettings(connectionStatus);
  const [activeCategory, setActiveCategory] = useState<CategoryType>("diagnosis");
  const [patient, setPatient] = useState<PatientInfo>({
    name: "",
    age: undefined,
    gender: "",
    date: new Date().toISOString().split("T")[0]
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"report" | "settings">("report");
  const [items, setItems] = useState<ReportItem[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Fetch subcategories on component mount
  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        const fetchedSubcategories = await fetchSubcategories();
        setSubcategories(fetchedSubcategories);
      } catch (error) {
        console.error("Error loading subcategories:", error);
        toast({
          title: "Error",
          description: "Failed to load subcategories.",
          variant: "destructive",
        });
      }
    };
    
    loadSubcategories();
  }, [toast]);
  
  // Fetch items for all categories
  useEffect(() => {
    const loadAllItems = async () => {
      setIsLoading(true);
      try {
        const allCategories: CategoryType[] = ["diagnosis", "extremity", "treatment", "homecare", "exercises"];
        const promises = allCategories.map(category => fetchItemsByCategory(category));
        const results = await Promise.all(promises);
        
        // Combine all items from all categories
        const allItems = results.flat();
        setItems(allItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast({
          title: "Error",
          description: "Failed to load report items.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadAllItems();
    }
  }, [user, toast]);
  
  // Reload settings when active tab changes to report
  useEffect(() => {
    if (activeTab === "report") {
      reloadSettings();
    }
  }, [activeTab, reloadSettings]);
  
  const handlePatientInfoChange = (key: keyof PatientInfo, value: string | number) => {
    setPatient(prev => ({ ...prev, [key]: value }));
  };
  
  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const handleGenerateReport = () => {
    // Validation
    if (!patient.name) {
      toast({
        title: "Missing Information",
        description: "Please enter the patient's name.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item for the report.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call a PDF generation service
    // For now, we'll just show a success message
    toast({
      title: "Report Generated",
      description: `Report for ${patient.name} has been created successfully!`
    });
    
    console.log({
      patient,
      selectedItems: items.filter(item => selectedItems.includes(item.id)),
      additionalNotes,
      settings
    });
  };

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Patient Info */}
              <div className="lg:col-span-1">
                <PatientInfoForm 
                  patient={patient}
                  onPatientInfoChange={handlePatientInfoChange}
                />
                
                <NotesField
                  notes={additionalNotes}
                  onChange={setAdditionalNotes}
                />
                
                <Button 
                  className="w-full mt-6 bg-medical-700 hover:bg-medical-800 text-lg py-6"
                  onClick={handleGenerateReport}
                >
                  Generate PDF Report
                </Button>
              </div>
              
              {/* Right Column - Report Items */}
              <div className="lg:col-span-2">
                <ReportItemsSelector
                  items={items}
                  activeCategory={activeCategory}
                  selectedItems={selectedItems}
                  onCategoryChange={setActiveCategory}
                  onToggleItem={handleToggleItem}
                  isLoading={isLoading}
                  subcategories={subcategories}
                />
                
                <ReportPreview
                  patient={patient}
                  items={items}
                  selectedItems={selectedItems}
                  additionalNotes={additionalNotes}
                  subcategories={subcategories}
                  settings={settings}
                />
              </div>
            </div>
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
