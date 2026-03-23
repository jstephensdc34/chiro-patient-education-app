
import { ReportItem as ReportItemType } from "@/types";
import { ReportSubcategory } from "./ReportSubcategory";
import { getOrderedSubcategories } from "@/utils/categoryUtils";
import { ReportItem } from "./ReportItem";

const sectionStyles: Record<string, { bg: string; border: string; headerBg: string; headerText: string }> = {
  diagnosis: { bg: "bg-blue-50", border: "border-blue-200", headerBg: "bg-blue-600", headerText: "text-white" },
  extremity: { bg: "bg-indigo-50", border: "border-indigo-200", headerBg: "bg-indigo-600", headerText: "text-white" },
  treatment: { bg: "bg-emerald-50", border: "border-emerald-200", headerBg: "bg-emerald-600", headerText: "text-white" },
  homecare: { bg: "bg-rose-50", border: "border-rose-200", headerBg: "bg-rose-600", headerText: "text-white" },
  exercises: { bg: "bg-purple-50", border: "border-purple-200", headerBg: "bg-purple-600", headerText: "text-white" },
};

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
  const style = sectionStyles[categoryId] || sectionStyles.diagnosis;

  const renderSubcategoryItems = () => {
    const orderedSubcategories = getOrderedSubcategories(categoryId, subcategories);
    
    return (
      <div className="space-y-3">
        {orderedSubcategories.map(subcategory => {
          const subcategoryItems = items.filter(
            item => item.subcategoryId === subcategory.id
          );
          
          return (
            <ReportSubcategory 
              key={subcategory.id} 
              title={getSubcategoryName(subcategory.id)}
              items={subcategoryItems}
              style={style}
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
              style={style}
            />
          ) : null;
        })()}

        {customTreatmentGoals && (
          <div className={`rounded-lg border ${style.border} ${style.bg} overflow-hidden shadow-sm`}>
            <div className={`px-4 py-2 ${style.headerBg}`}>
              <h4 className={`font-semibold text-sm ${style.headerText}`}>Custom Treatment Goal</h4>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm font-bold text-foreground/80">• {customTreatmentGoals}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div className={`rounded-lg px-4 py-2.5 ${style.headerBg} mb-3`}>
        <h3 className={`font-bold text-base ${style.headerText}`}>{categoryName}</h3>
      </div>
      {renderSubcategoryItems()}
    </div>
  );
};
