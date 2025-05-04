
import { CategoryType } from "@/types";
import { useLibraryData } from "@/hooks/useLibraryData";
import { useLibraryActions } from "@/hooks/useLibraryActions";

export const useLibrary = (initialCategory: CategoryType = "diagnosis") => {
  const {
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory,
    items,
    setItems,
    categories,
    subcategories,
    isLoading,
    getCategoryName,
    getSubcategoriesForCategory
  } = useLibraryData(initialCategory);

  const {
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    setEditingItem,
    isSubmitting,
    handleSaveItem,
    handleDeleteItem,
    handleEditItem,
    handleAddNewItem
  } = useLibraryActions(items, setItems, activeCategory, activeSubcategory, getCategoryName);

  const handleSubcategoryClick = (subcategoryId: string) => {
    setActiveSubcategory(subcategoryId);
  };

  return {
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    items,
    categories,
    subcategories,
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    setEditingItem,
    isLoading,
    isSubmitting,
    handleSaveItem,
    handleDeleteItem,
    handleEditItem,
    handleSubcategoryClick,
    getCategoryName,
    getSubcategoriesForCategory,
    handleAddNewItem
  };
};
