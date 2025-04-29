import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CategoryType, MAIN_CATEGORIES, ReportItem, PatientInfo } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { useToast } from "@/components/ui/use-toast";

// Mock data - would be replaced with Supabase fetch
const mockItems: ReportItem[] = [
  { id: "1", name: "Cervical Sprain/Strain", description: "Stretch injury to the ligaments or muscles of the neck", infoLink: "https://www.spine-health.com/conditions/neck-pain/cervical-sprain-and-strain", categoryId: "diagnosis" },
  { id: "2", name: "Lumbar Disc Herniation", description: "Protrusion of the intervertebral disc material in lumbar spine", infoLink: "https://www.spine-health.com/conditions/herniated-disc/lumbar-herniated-disc", categoryId: "diagnosis" },
  { id: "3", name: "Spinal Manipulation", description: "High-velocity, low-amplitude thrust to spinal joints", infoLink: "https://www.spine-health.com/treatment/chiropractic/spinal-manipulation-and-chiropractic-care", categoryId: "treatment" },
  { id: "4", name: "Ice Therapy", description: "Application of ice to reduce inflammation", infoLink: "https://www.spine-health.com/treatment/pain-management/ice-packs-back-pain-relief", categoryId: "homecare" },
  { id: "5", name: "Heat Therapy", description: "Application of heat to relax muscles and increase blood flow", infoLink: "https://www.spine-health.com/treatment/heat-therapy-cold-therapy/heat-therapy-benefits-for-lower-back-pain", categoryId: "homecare" },
  { id: "6", name: "McKenzie Extensions", description: "Extension-based exercises for disc problems", infoLink: "https://www.spine-health.com/treatment/physical-therapy/mckenzie-therapy-mechanical-diagnosis-and-therapy-back-pain", categoryId: "exercises" },
  { id: "7", name: "Cat-Camel Stretch", description: "Flexion and extension movement for the spine", infoLink: "https://www.spine-health.com/wellness/exercise/cat-camel-back-stretch", categoryId: "exercises" }
];

// Category name mapping
const categoryNames: Record<string, string> = {
  diagnosis: "Diagnosis",
  treatment: "Treatment Plan",
  homecare: "Home Care",
  exercises: "Therapeutic Exercises"
};

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
            <Card>
              <CardHeader className="bg-medical-600">
                <CardTitle className="text-white">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="patientName">Patient Name*</Label>
                    <Input
                      id="patientName"
                      value={patient.name}
                      onChange={(e) => handlePatientInfoChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="patientAge">Age</Label>
                    <Input
                      id="patientAge"
                      type="number"
                      value={patient.age || ""}
                      onChange={(e) => handlePatientInfoChange("age", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="patientGender">Gender</Label>
                    <select
                      id="patientGender"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={patient.gender}
                      onChange={(e) => handlePatientInfoChange("gender", e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reportDate">Report Date</Label>
                    <Input
                      id="reportDate"
                      type="date"
                      value={patient.date}
                      onChange={(e) => handlePatientInfoChange("date", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader className="bg-medical-600">
                <CardTitle className="text-white">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea 
                  className="min-h-[150px]" 
                  placeholder="Enter any additional notes or instructions here..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Button 
              className="w-full mt-6 bg-medical-700 hover:bg-medical-800 text-lg py-6"
              onClick={handleGenerateReport}
            >
              Generate PDF Report
            </Button>
          </div>
          
          {/* Right Column - Report Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="bg-medical-600">
                <CardTitle className="text-white">Report Contents</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as CategoryType)}>
                  <TabsList className="w-full bg-gray-100 mb-6">
                    {MAIN_CATEGORIES.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="flex-1 data-[state=active]:bg-medical-100 data-[state=active]:text-medical-800"
                      >
                        {categoryNames[category]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {MAIN_CATEGORIES.map((category) => (
                    <TabsContent key={category} value={category}>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Select {categoryNames[category]}:</h3>
                        
                        <div className="space-y-3">
                          {mockItems
                            .filter(item => item.categoryId === category)
                            .map(item => (
                              <div key={item.id} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-md">
                                <Checkbox
                                  id={item.id}
                                  checked={selectedItems.includes(item.id)}
                                  onCheckedChange={() => handleToggleItem(item.id)}
                                />
                                <Label
                                  htmlFor={item.id}
                                  className="font-medium cursor-pointer"
                                >
                                  {item.name}
                                </Label>
                              </div>
                            ))}
                        </div>
                        
                        {mockItems.filter(item => item.categoryId === category).length === 0 && (
                          <div className="p-4 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-md">
                            <p>No items available in this category. Add items in the Library.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            
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
                        mockItems.some(item => 
                          item.categoryId === category && selectedItems.includes(item.id)
                        )
                      ).map((category) => (
                        <AccordionItem key={category} value={category}>
                          <AccordionTrigger className="text-medical-700 hover:text-medical-800">
                            {categoryNames[category]}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 ml-4">
                              {mockItems
                                .filter(item => 
                                  item.categoryId === category && selectedItems.includes(item.id)
                                )
                                .map(item => (
                                  <li key={item.id} className="list-disc ml-4">
                                    <span className="font-medium">{item.name}:</span> {item.description}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
