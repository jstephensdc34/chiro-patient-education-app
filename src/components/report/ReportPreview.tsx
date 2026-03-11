
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
      <CardHeader className="bg-gray-100 border-b border-gray-200">
        <CardTitle className="text-gray-800 text-lg">Report Preview</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {selectedItems.length > 0 ? (
          <div className="space-y-6 max-w-[210mm] mx-auto">
            {/* Page Container - simulating the PDF page layout */}
            <div className="bg-white p-6 border border-gray-200 shadow-sm mx-auto" 
                 style={{ padding: '15mm', boxSizing: 'border-box' }}>
              {/* Report Header */}
              <ReportHeader settings={settings} loading={settingsLoading} />
              
              {/* Patient Information */}
              <PatientInfoDisplay patient={patient} />
              
              <div className="space-y-8">
                {/* Render categories in the same order as MAIN_CATEGORIES */}
                {MAIN_CATEGORIES.filter(category => hasSelectedItemsInCategory(category)).map((category) => (
                  <ReportCategory
                    key={category}
                    categoryId={category}
                    categoryName={categoryNames[category]}
                    items={getSelectedItems(category)}
                    subcategories={subcategories}
                    getSubcategoryName={getSubcategoryName}
                  />
                ))}
                
                {/* Additional Notes Section */}
                {additionalNotes && (
                  <div className="border-b pb-4">
                    <h3 className="text-medical-700 font-medium text-lg mb-3">
                      Additional Notes
                    </h3>
                    <div className="pl-4">
                      <p className="whitespace-pre-wrap">{additionalNotes}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Page number indicator (for preview only) */}
              <div className="text-center text-xs text-gray-500 mt-8">
                Page 1
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500">
              <p>Note: The PDF will automatically create multiple pages as needed for longer reports.</p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Select items from the categories above to build your report.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
