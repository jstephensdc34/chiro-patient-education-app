
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
  // Render subcategories and their items in the correct order
  const renderSubcategoryItems = () => {
    const orderedSubcategories = getOrderedSubcategories(categoryId, subcategories);
    
    return (
      <div className="space-y-4 pl-4">
        {/* Render items by subcategory */}
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
        
        {/* Render uncategorized items */}
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

        {/* Custom treatment goals inline */}
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
    </div>
  );
};
