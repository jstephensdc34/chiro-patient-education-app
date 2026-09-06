
import { Subcategory } from "@/types";

interface SubcategorySelectorProps {
  subcategories: Subcategory[];
  activeSubcategory: string | null;
  onSubcategoryClick: (subcategoryId: string) => void;
}

export const SubcategorySelector = ({
  subcategories,
  activeSubcategory,
  onSubcategoryClick
}: SubcategorySelectorProps) => {
  if (subcategories.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 bg-muted/50 p-2 rounded-md">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            onClick={() => onSubcategoryClick(subcategory.id)}
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
