
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PatientInfo, ReportItem, CategoryType } from "@/types";
import { PatientInfoForm } from "@/components/report/PatientInfoForm";
import { NotesField } from "@/components/report/NotesField";
import { ReportItemsSelector } from "@/components/report/ReportItemsSelector";
import { ReportPreview } from "@/components/report/ReportPreview";
import { ReportSetting } from "@/services/reportSettingsService";
import { PDFGenerationProgress } from "@/components/report/PDFGenerationProgress";
import { EmailReportDialog } from "@/components/report/EmailReportDialog";
import { RenderPdfProgress } from "@/utils/pdf";
import { useEmailDelivery } from "@/hooks/useEmailDelivery";
import { generateEmailHtml } from "@/utils/email";

interface ReportBuilderProps {
  patient: PatientInfo & { email?: string };
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
  onPatientInfoChange: (key: keyof (PatientInfo & { email?: string }), value: string | number) => void;
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
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { emailStatus, sendEmailReport, resetEmailStatus } = useEmailDelivery();

  const handleSendEmail = async (emailData: {
    recipientEmail: string;
    subject: string;
    message: string;
  }) => {
    const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
    
    await sendEmailReport({
      patient,
      selectedItems: selectedItemsData,
      notes: additionalNotes,
      settings,
      subcategories,
      recipientEmail: emailData.recipientEmail,
      subject: emailData.subject,
      message: emailData.message
    });
  };

  const handleEmailDialogClose = () => {
    setShowEmailDialog(false);
    resetEmailStatus();
  };

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
        
        <div className="space-y-3 mt-6">
          {isGeneratingPDF ? (
            <PDFGenerationProgress progress={pdfProgress} />
          ) : (
            <Button 
              className="w-full bg-medical-700 hover:bg-medical-800 text-lg py-6"
              onClick={onGeneratePDF}
              disabled={isGeneratingPDF}
            >
              Generate PDF Report
            </Button>
          )}
          
          <Button 
            variant="outline"
            className="w-full border-medical-600 text-medical-700 hover:bg-medical-50 text-lg py-6"
            onClick={() => setShowEmailDialog(true)}
            disabled={isGeneratingPDF || !patient.name || selectedItems.length === 0}
          >
            Send Email Report
          </Button>
        </div>
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

      <EmailReportDialog
        open={showEmailDialog}
        onOpenChange={handleEmailDialogClose}
        patientName={patient.name}
        defaultEmail={patient.email}
        emailStatus={emailStatus}
        onSendEmail={handleSendEmail}
      />
    </div>
  );
};
