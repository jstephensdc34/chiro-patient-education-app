
import { Subcategory } from "@/types";
import { Button } from "@/components/ui/button";

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
          <Button
            type="button"
            variant={activeSubcategory === subcategory.id ? "secondary" : "ghost"}
            size="sm"
            key={subcategory.id}
            onClick={() => onSubcategoryClick(subcategory.id)}
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
