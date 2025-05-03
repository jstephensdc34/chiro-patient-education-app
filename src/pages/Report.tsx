
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CategoryType, PatientInfo } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { PatientInfoForm } from "@/components/report/PatientInfoForm";
import { NotesField } from "@/components/report/NotesField";
import { ReportItemsSelector } from "@/components/report/ReportItemsSelector";
import { ReportPreview } from "@/components/report/ReportPreview";
import { mockItems } from "@/services/libraryService";

const Report = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<CategoryType>("diagnosis");
  const [patient, setPatient] = useState<PatientInfo>({
    name: "",
    age: undefined,
    gender: "",
    date: new Date().toISOString().split("T")[0]
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  
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
      selectedItems: mockItems.filter(item => selectedItems.includes(item.id)),
      additionalNotes
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
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
              items={mockItems}
              activeCategory={activeCategory}
              selectedItems={selectedItems}
              onCategoryChange={setActiveCategory}
              onToggleItem={handleToggleItem}
            />
            
            <ReportPreview
              patient={patient}
              items={mockItems}
              selectedItems={selectedItems}
              additionalNotes={additionalNotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
