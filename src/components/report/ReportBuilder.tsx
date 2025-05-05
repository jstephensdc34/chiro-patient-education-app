
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PatientInfo, ReportItem, CategoryType } from "@/types";
import { PatientInfoForm } from "@/components/report/PatientInfoForm";
import { NotesField } from "@/components/report/NotesField";
import { ReportItemsSelector } from "@/components/report/ReportItemsSelector";
import { ReportPreview } from "@/components/report/ReportPreview";
import { ReportSetting } from "@/services/reportSettingsService";
import { PDFGenerationProgress } from "@/components/report/PDFGenerationProgress";
import { RenderPdfProgress } from "@/utils/pdf";

interface ReportBuilderProps {
  patient: PatientInfo;
  items: ReportItem[];
  selectedItems: string[];
  additionalNotes: string;
  settings: ReportSetting[];
  settingsLoading: boolean;
  isLoading: boolean;
  isGeneratingPDF: boolean;
  pdfProgress: RenderPdfProgress;
  subcategories: any[];
  activeCategory: CategoryType;
  onPatientInfoChange: (key: keyof PatientInfo, value: string | number) => void;
  onToggleItem: (itemId: string) => void;
  onCategoryChange: (category: CategoryType) => void;
  onNotesChange: (notes: string) => void;
  onGeneratePDF: () => void;
}

export const ReportBuilder = ({
  patient,
  items,
  selectedItems,
  additionalNotes,
  settings,
  settingsLoading,
  isLoading,
  isGeneratingPDF,
  pdfProgress,
  subcategories,
  activeCategory,
  onPatientInfoChange,
  onToggleItem,
  onCategoryChange,
  onNotesChange,
  onGeneratePDF,
}: ReportBuilderProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Patient Info */}
      <div className="lg:col-span-1">
        <PatientInfoForm 
          patient={patient}
          onPatientInfoChange={onPatientInfoChange}
        />
        
        <NotesField
          notes={additionalNotes}
          onChange={onNotesChange}
        />
        
        {isGeneratingPDF ? (
          <PDFGenerationProgress progress={pdfProgress} />
        ) : (
          <Button 
            className="w-full mt-6 bg-medical-700 hover:bg-medical-800 text-lg py-6"
            onClick={onGeneratePDF}
            disabled={isGeneratingPDF}
          >
            Generate PDF Report
          </Button>
        )}
      </div>
      
      {/* Right Column - Report Items */}
      <div className="lg:col-span-2">
        <ReportItemsSelector
          items={items}
          activeCategory={activeCategory}
          selectedItems={selectedItems}
          onCategoryChange={onCategoryChange}
          onToggleItem={onToggleItem}
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
          settingsLoading={settingsLoading}
        />
      </div>
    </div>
  );
};
