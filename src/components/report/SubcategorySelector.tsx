
import { CategoryType } from "@/types";
import { getOrderedSubcategories } from "@/utils/categoryUtils";

interface SubcategorySelectorProps {
  category: CategoryType;
  activeSubcategory: string | null;
  subcategories: any[];
  onSubcategoryClick: (subcategoryId: string, event: React.MouseEvent) => void;
}

export const SubcategorySelector = ({
  category,
  activeSubcategory,
  subcategories,
  onSubcategoryClick,
}: SubcategorySelectorProps) => {
  const orderedSubcategories = getOrderedSubcategories(category, subcategories);
  
  if (orderedSubcategories.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 bg-muted/50 p-2 rounded-md">
        {orderedSubcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            onClick={(e) => onSubcategoryClick(subcategory.id, e)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              activeSubcategory === subcategory.id 
                ? 'bg-primary-soft text-primary' 
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            {subcategory.name}
          </button>
        ))}
      </div>
    </div>
  );
};
