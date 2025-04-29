
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryType, MAIN_CATEGORIES, PatientInfo, ReportItem } from "@/types";

// Category name mapping
const categoryNames: Record<string, string> = {
  diagnosis: "Diagnosis",
  treatment: "Treatment Plan",
  homecare: "Home Care",
  exercises: "Therapeutic Exercises"
};

interface ReportPreviewProps {
  patient: PatientInfo;
  items: ReportItem[];
  selectedItems: string[];
  additionalNotes: string;
}

export const ReportPreview = ({
  patient,
  items,
  selectedItems,
  additionalNotes
}: ReportPreviewProps) => {
  return (
    <Card className="mt-6">
      <CardHeader className="bg-gray-100 border-b border-gray-200">
        <CardTitle className="text-gray-800 text-lg">Report Preview</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {selectedItems.length > 0 ? (
          <div className="space-y-6">
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
            
            <Accordion type="multiple" className="w-full">
              {MAIN_CATEGORIES.filter(category => 
                items.some(item => 
                  item.categoryId === category && selectedItems.includes(item.id)
                )
              ).map((category) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="text-medical-700 hover:text-medical-800">
                    {categoryNames[category]}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 ml-4">
                      {items
                        .filter(item => 
                          item.categoryId === category && selectedItems.includes(item.id)
                        )
                        .map(item => (
                          <li key={item.id} className="list-disc ml-4">
                            <span className="font-medium">{item.name}</span>
                          </li>
                        ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
              
              {additionalNotes && (
                <AccordionItem value="notes">
                  <AccordionTrigger className="text-medical-700 hover:text-medical-800">
                    Additional Notes
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="whitespace-pre-wrap">{additionalNotes}</p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
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
