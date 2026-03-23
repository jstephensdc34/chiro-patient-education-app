
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryType, MAIN_CATEGORIES, PatientInfo, ReportItem } from "@/types";
import { ReportHeader } from "./ReportHeader";
import { ReportSetting } from "@/services/reportSettingsService";
import { PatientInfoDisplay } from "./PatientInfoDisplay";
import { ReportCategory } from "./ReportCategory";

// Category name mapping
const categoryNames: Record<string, string> = {
  diagnosis: "Spinal Diagnosis",
  extremity: "Extremity Diagnosis",
  treatment: "Treatment Plan",
  homecare: "Home Care",
  exercises: "Therapeutic Exercises"
};

interface ReportPreviewProps {
  patient: PatientInfo;
  items: ReportItem[];
  selectedItems: string[];
  additionalNotes: string;
  customTreatmentGoals?: string;
  subcategories: any[];
  settings?: ReportSetting[];
  settingsLoading?: boolean;
}

export const ReportPreview = ({
  patient,
  items,
  selectedItems,
  additionalNotes,
  customTreatmentGoals = "",
  subcategories = [],
  settings = [],
  settingsLoading = false
}: ReportPreviewProps) => {
  const getSelectedItems = (categoryId: string) => {
    return items.filter(item => 
      item.categoryId === categoryId && selectedItems.includes(item.id)
    );
  };

  const getSubcategoryName = (subcategoryId: string) => {
    const subcategory = subcategories.find(s => s.id === subcategoryId);
    return subcategory ? subcategory.name : "";
  };

  const hasSelectedItemsInCategory = (categoryId: string) => {
    return items.some(item => 
      item.categoryId === categoryId && selectedItems.includes(item.id)
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader className="bg-muted border-b">
        <CardTitle className="text-foreground text-lg">Report Preview</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {selectedItems.length > 0 ? (
          <div className="space-y-6 max-w-[210mm] mx-auto">
            {/* Page Container - simulating the PDF page layout */}
            <div className="bg-white p-6 border border-border shadow-sm mx-auto" 
                 style={{ padding: '15mm', boxSizing: 'border-box' }}>
              {/* Report Header */}
              <ReportHeader settings={settings} loading={settingsLoading} />
              
              {/* Patient Information */}
              <PatientInfoDisplay patient={patient} />
              
              <div className="space-y-8">
                {/* Render categories in the same order as MAIN_CATEGORIES */}
                {MAIN_CATEGORIES.filter(category => hasSelectedItemsInCategory(category) || (category === "treatment" && customTreatmentGoals)).map((category) => (
                  <ReportCategory
                    key={category}
                    categoryId={category}
                    categoryName={categoryNames[category]}
                    items={getSelectedItems(category)}
                    subcategories={subcategories}
                    getSubcategoryName={getSubcategoryName}
                    customTreatmentGoals={category === "treatment" ? customTreatmentGoals : undefined}
                  />
                ))}
                
                {/* Additional Notes Section */}
                {additionalNotes && (
                  <div className="rounded-lg border border-border bg-muted/50 overflow-hidden shadow-sm">
                    <div className="px-4 py-2 bg-gray-600">
                      <h4 className="font-semibold text-sm text-white">Additional Notes</h4>
                    </div>
                    <div className="px-4 py-3">
                      <p className="whitespace-pre-wrap text-sm text-foreground/80">{additionalNotes}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Page number indicator (for preview only) */}
              <div className="text-center text-xs text-muted-foreground mt-8">
                Page 1
              </div>
            </div>
            
            <div className="text-center text-xs text-muted-foreground">
              <p>Note: The PDF will automatically create multiple pages as needed for longer reports.</p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>Select items from the categories above to build your report.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
