
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryType, MAIN_CATEGORIES, ReportItem, Subcategory } from "@/types";
import { ItemsList } from "@/components/library/ItemsList";
import { LoadingState } from "@/components/library/LoadingState";
import { SubcategorySelector } from "@/components/library/SubcategorySelector";

interface LibraryContentProps {
  activeCategory: CategoryType;
  setActiveCategory: (category: CategoryType) => void;
  activeSubcategory: string | null;
  onSubcategoryClick: (subcategoryId: string) => void;
  isLoading: boolean;
  items: ReportItem[];
  onEdit: (item: ReportItem) => void;
  onDelete: (id: string) => void;
  getCategoryName: (categoryId: string) => string;
  getSubcategoriesForCategory: (categoryId: string) => Subcategory[];
}

export const LibraryContent = ({
  activeCategory,
  setActiveCategory,
  activeSubcategory,
  onSubcategoryClick,
  isLoading,
  items,
  onEdit,
  onDelete,
  getCategoryName,
  getSubcategoriesForCategory
}: LibraryContentProps) => {
  // Special function to order subcategories for specific categories
  const getOrderedSubcategories = (categoryId: string) => {
    const categorySubs = getSubcategoriesForCategory(categoryId);
    
    // Special ordering for diagnosis subcategories
    if (categoryId === "diagnosis") {
      // Define the desired order
      const diagnosisOrder = [
        "general_diagnosis",
        "cervical_diagnosis",
        "thoracic_diagnosis",
        "lumbopelvic_diagnosis"
      ];
      
      // Sort according to the defined order
      return categorySubs.sort((a, b) => {
        const indexA = diagnosisOrder.indexOf(a.id);
        const indexB = diagnosisOrder.indexOf(b.id);
        return indexA - indexB;
      });
    }
    
    // Special ordering for extremity subcategories
    if (categoryId === "extremity") {
      // Define the desired order
      const extremityOrder = [
        "shoulder",
        "elbow",
        "wrist_hand",
        "hip",
        "knee",
        "ankle_foot"
      ];
      
      // Sort according to the defined order
      return categorySubs.sort((a, b) => {
        const indexA = extremityOrder.indexOf(a.id);
        const indexB = extremityOrder.indexOf(b.id);
        return indexA - indexB;
      });
    }
    
    return categorySubs;
  };

  return (
    <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as CategoryType)}>
      <TabsList className="mb-6 bg-white border border-gray-200">
        {MAIN_CATEGORIES.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className="data-[state=active]:bg-medical-100 data-[state=active]:text-medical-800"
          >
            {getCategoryName(category)}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {MAIN_CATEGORIES.map((category) => (
        <TabsContent key={category} value={category}>
          {(category === "diagnosis" || category === "extremity" || 
            category === "treatment" || category === "homecare" ||
            category === "exercises") && (
            <SubcategorySelector
              subcategories={getOrderedSubcategories(category)}
              activeSubcategory={activeSubcategory}
              onSubcategoryClick={onSubcategoryClick}
            />
          )}
          
          {isLoading ? (
            <LoadingState />
          ) : (
            <ItemsList 
              items={items}
              onEdit={onEdit}
              onDelete={onDelete}
              categoryName={getCategoryName(category)}
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
