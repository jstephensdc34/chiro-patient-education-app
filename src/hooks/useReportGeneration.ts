
import { useState } from "react";
import { CategoryType, PatientInfo, ReportItem } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { generatePDF, RenderPdfProgress } from "@/utils/pdf";
import { ReportSetting } from "@/services/reportSettingsService";

export const useReportGeneration = (
  items: ReportItem[],
  settings: ReportSetting[],
  subcategories: any[]
) => {
  const { toast } = useToast();
  const [patient, setPatient] = useState<PatientInfo>({
    name: "",
    age: undefined,
    gender: "",
    date: new Date().toISOString().split("T")[0]
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<CategoryType>("diagnosis");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<RenderPdfProgress>({ status: 'preparing', percentage: 0 });

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
  
  const handleGenerateReport = async () => {
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
    
    setIsGeneratingPDF(true);
    setPdfProgress({ status: 'preparing', percentage: 0 });
    
    try {
      const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
      
      // Generate PDF with progress updates
      await generatePDF({
        patient,
        selectedItems: selectedItemsData,
        notes: additionalNotes,
        settings,
        subcategories,
        onProgress: (progress) => {
          setPdfProgress(progress);
        }
      });
      
      toast({
        title: "Report Generated",
        description: `Report for ${patient.name} has been downloaded successfully!`
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return {
    patient,
    selectedItems,
    additionalNotes,
    activeCategory,
    isGeneratingPDF,
    pdfProgress,
    handlePatientInfoChange,
    handleToggleItem,
    handleGenerateReport,
    setAdditionalNotes,
    setActiveCategory
  };
};
