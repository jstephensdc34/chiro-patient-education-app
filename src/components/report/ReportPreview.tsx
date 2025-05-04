
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryType, MAIN_CATEGORIES, PatientInfo, ReportItem } from "@/types";
import { ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReportHeader } from "./ReportHeader";
import { ReportSetting } from "@/services/reportSettingsService";

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
  subcategories: any[];
  settings?: ReportSetting[];
}

export const ReportPreview = ({
  patient,
  items,
  selectedItems,
  additionalNotes,
  subcategories = [],
  settings = []
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

  const groupItemsBySubcategory = (items: ReportItem[]) => {
    const grouped: Record<string, ReportItem[]> = {};
    
    items.forEach(item => {
      if (item.subcategoryId) {
        if (!grouped[item.subcategoryId]) {
          grouped[item.subcategoryId] = [];
        }
        grouped[item.subcategoryId].push(item);
      } else {
        if (!grouped["uncategorized"]) {
          grouped["uncategorized"] = [];
        }
        grouped["uncategorized"].push(item);
      }
    });
    
    return grouped;
  };
  
  const hasSelectedItemsInCategory = (categoryId: string) => {
    return items.some(item => 
      item.categoryId === categoryId && selectedItems.includes(item.id)
    );
  };

  const InfoLink = ({ link }: { link: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center ml-2 text-medical-600 hover:text-medical-800"
          >
            <ExternalLink size={14} />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>View more information</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="mt-6">
      <CardHeader className="bg-gray-100 border-b border-gray-200">
        <CardTitle className="text-gray-800 text-lg">Report Preview</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {selectedItems.length > 0 ? (
          <div className="space-y-6">
            {/* Report Header */}
            <ReportHeader settings={settings} />
            
            {patient.name && (
              <div className="pb-2 border-b border-gray-200">
                <h2 className="text-lg font-bold">{patient.name}</h2>
                <div className="text-sm text-gray-600 flex gap-x-4">
                  {patient.age && <span>Age: {patient.age}</span>}
                  {patient.gender && <span>Gender: {patient.gender}</span>}
                  <span>Date: {new Date(patient.date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-8">
              {MAIN_CATEGORIES.filter(category => hasSelectedItemsInCategory(category)).map((category) => (
                <div key={category} className="border-b pb-4">
                  <h3 className="text-medical-700 font-medium text-lg mb-3">
                    {categoryNames[category]}
                  </h3>
                  
                  {category === "diagnosis" || category === "extremity" ? (
                    <div className="space-y-4 pl-4">
                      {Object.entries(groupItemsBySubcategory(getSelectedItems(category))).map(([subcategoryId, items]) => (
                        <div key={subcategoryId} className="ml-2">
                          <h4 className="font-medium text-medical-600 mb-2">
                            {subcategoryId !== "uncategorized" ? getSubcategoryName(subcategoryId) : "Other"}
                          </h4>
                          <ul className="space-y-3 ml-4">
                            {items.map(item => (
                              <li key={item.id} className="ml-4">
                                <div className="font-medium">
                                  • {item.name}
                                  {item.infoLink && <InfoLink link={item.infoLink} />}
                                </div>
                                {item.description && (
                                  <div className="text-gray-600 mt-1 ml-4 text-sm">{item.description}</div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-3 ml-8">
                      {getSelectedItems(category).map(item => (
                        <li key={item.id} className="ml-4">
                          <div className="font-medium">
                            • {item.name}
                            {item.infoLink && <InfoLink link={item.infoLink} />}
                          </div>
                          {item.description && (
                            <div className="text-gray-600 mt-1 ml-4 text-sm">{item.description}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              
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
