
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReportItem, CategoryType } from "@/types";
import { ItemFormContent } from "./ItemFormContent";

interface ItemFormDialogProps {
  activeCategory: CategoryType;
  onSaveItem: (item: Partial<ReportItem> | ReportItem) => void;
  editingItem: ReportItem | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  isSubmitting?: boolean;
  availableSubcategories: {
    id: string;
    name: string;
    parentCategoryId?: string;
    description?: string;
  }[];
}

export const ItemFormDialog = ({
  activeCategory,
  onSaveItem,
  editingItem,
  isDialogOpen,
  setIsDialogOpen,
  isSubmitting = false,
  availableSubcategories,
}: ItemFormDialogProps) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>
        <ItemFormContent
          activeCategory={activeCategory}
          onSaveItem={onSaveItem}
          editingItem={editingItem}
          isSubmitting={isSubmitting}
          availableSubcategories={availableSubcategories}
          setIsDialogOpen={setIsDialogOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
