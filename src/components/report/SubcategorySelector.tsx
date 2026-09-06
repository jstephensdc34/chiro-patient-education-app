
import { CategoryType, Subcategory } from "@/types";
import { getOrderedSubcategories } from "@/utils/categoryUtils";
import { Button } from "@/components/ui/button";

interface SubcategorySelectorProps {
  category: CategoryType;
  activeSubcategory: string | null;
  subcategories: Subcategory[];
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
          <Button
            type="button"
            variant={activeSubcategory === subcategory.id ? "secondary" : "ghost"}
            size="sm"
            key={subcategory.id}
            onClick={(e) => onSubcategoryClick(subcategory.id, e)}
            aria-pressed={activeSubcategory === subcategory.id}
            className={`px-4 ${
              activeSubcategory === subcategory.id 
                ? 'bg-primary-soft text-primary' 
                : 'bg-card text-muted-foreground'
            }`}
          >
            {subcategory.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
