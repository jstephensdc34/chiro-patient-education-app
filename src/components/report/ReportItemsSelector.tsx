
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CategoryType, DIAGNOSIS_SUBCATEGORIES, MAIN_CATEGORIES, ReportItem } from "@/types";
import { mockSubcategories } from "@/services/libraryService";
import { useState } from "react";

// Category name mapping
const categoryNames: Record<string, string> = {
  diagnosis: "Spinal Diagnosis",
  extremity: "Extremity Diagnosis",
  treatment: "Treatment Plan",
  homecare: "Home Care",
  exercises: "Therapeutic Exercises"
};

interface ReportItemsSelectorProps {
  items: ReportItem[];
  activeCategory: CategoryType;
  selectedItems: string[];
  onCategoryChange: (category: CategoryType) => void;
  onToggleItem: (itemId: string) => void;
}

export const ReportItemsSelector = ({
  items,
  activeCategory,
  selectedItems,
  onCategoryChange,
  onToggleItem
}: ReportItemsSelectorProps) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    activeCategory === "diagnosis" ? "general_diagnosis" : null
  );

  // When category changes, reset subcategory if needed
  const handleCategoryChange = (category: CategoryType) => {
    onCategoryChange(category);
    if (category === "diagnosis") {
      setActiveSubcategory("general_diagnosis");
    } else {
      setActiveSubcategory(null);
    }
  };

  // Get subcategories for the active category
  const getSubcategoriesForCategory = (categoryId: string) => {
    return mockSubcategories.filter(subcat => subcat.parentCategoryId === categoryId);
  };

  // Filter items based on subcategory if active
  const getFilteredItems = (categoryId: string) => {
    if (categoryId === "diagnosis" && activeSubcategory) {
      return items.filter(item => 
        item.categoryId === categoryId && 
        item.subcategoryId === activeSubcategory
      );
    }
    return items.filter(item => item.categoryId === categoryId);
  };

  return (
    <Card>
      <CardHeader className="bg-medical-600">
        <CardTitle className="text-white">Report Contents</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeCategory} onValueChange={(value) => handleCategoryChange(value as CategoryType)}>
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
                
                {category === "diagnosis" && (
                  <div className="mb-4">
                    <TabsList className="w-full bg-gray-50 mb-4">
                      {getSubcategoriesForCategory(category).map((subcategory) => (
                        <TabsTrigger
                          key={subcategory.id}
                          value={subcategory.id}
                          onClick={() => setActiveSubcategory(subcategory.id)}
                          className={`flex-1 ${activeSubcategory === subcategory.id ? 'bg-medical-50 text-medical-700' : ''}`}
                        >
                          {subcategory.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                )}
                
                <div className="space-y-3">
                  {getFilteredItems(category)
                    .map(item => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-md">
                        <Checkbox
                          id={item.id}
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => onToggleItem(item.id)}
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
                
                {getFilteredItems(category).length === 0 && (
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
  );
};
