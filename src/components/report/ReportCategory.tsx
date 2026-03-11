
import { ReportItem as ReportItemType } from "@/types";
import { ReportSubcategory } from "./ReportSubcategory";
import { getOrderedSubcategories } from "@/utils/categoryUtils";
import { ReportItem } from "./ReportItem";

interface ReportCategoryProps {
  categoryId: string;
  categoryName: string;
  items: ReportItemType[];
  subcategories: any[];
  getSubcategoryName: (id: string) => string;
  customTreatmentGoals?: string;
}

export const ReportCategory = ({ 
  categoryId, 
  categoryName, 
  items, 
  subcategories,
  getSubcategoryName,
  customTreatmentGoals
}: ReportCategoryProps) => {
  const renderSubcategoryItems = () => {
    const orderedSubcategories = getOrderedSubcategories(categoryId, subcategories);
    
    return (
      <div className="space-y-4 pl-4">
        {orderedSubcategories.map(subcategory => {
          const subcategoryItems = items.filter(
            item => item.subcategoryId === subcategory.id
          );
          
          return (
            <ReportSubcategory 
              key={subcategory.id} 
              title={getSubcategoryName(subcategory.id)}
              items={subcategoryItems}
            />
          );
        })}
        
        {(() => {
          const uncategorizedItems = items.filter(
            item => !item.subcategoryId
          );
          
          return uncategorizedItems.length > 0 ? (
            <ReportSubcategory
              title="Other"
              items={uncategorizedItems}
            />
          ) : null;
        })()}

        {customTreatmentGoals && (
          <div className="ml-2">
            <ul className="space-y-3 ml-4">
              <li className="ml-4">
                <div className="font-medium">
                  • {customTreatmentGoals}
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderSimpleList = () => (
    <ul className="space-y-3 ml-8">
      {items.map(item => (
        <ReportItem key={item.id} item={item} />
      ))}
    </ul>
  );

  return (
    <div className="border-b pb-4">
      <h3 className="text-medical-700 font-medium text-lg mb-3">
        {categoryName}
      </h3>
      
      {(categoryId === "diagnosis" || categoryId === "extremity" || 
        categoryId === "treatment" || categoryId === "homecare" || 
        categoryId === "exercises") ? (
        renderSubcategoryItems()
      ) : (
        renderSimpleList()
      )}
    </div>
  );
};
