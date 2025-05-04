
import { useState, useEffect } from "react";
import { CategoryType, ReportItem, Category, Subcategory } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthContext";
import { 
  fetchCategories, 
  fetchSubcategories, 
  fetchItemsByCategory,
  createItem,
  updateItem,
  deleteItem
} from "@/services/libraryService";

export const useLibrary = (initialCategory: CategoryType = "diagnosis") => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>(initialCategory);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>("general_diagnosis");
  const [items, setItems] = useState<ReportItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReportItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [fetchedCategories, fetchedSubcategories] = await Promise.all([
          fetchCategories(),
          fetchSubcategories()
        ]);
        
        setCategories(fetchedCategories);
        setSubcategories(fetchedSubcategories);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast({
          title: "Error",
          description: "Failed to load categories and subcategories.",
          variant: "destructive",
        });
      }
    };
    
    loadInitialData();
  }, [toast]);

  // Reset subcategory selection when category changes
  useEffect(() => {
    if (activeCategory === "diagnosis") {
      setActiveSubcategory("general_diagnosis");
    } else if (activeCategory === "extremity") {
      setActiveSubcategory("shoulder");
    } else if (activeCategory === "treatment") {
      setActiveSubcategory("care_plan_type");
    } else if (activeCategory === "homecare") {
      setActiveSubcategory("home_therapy");
    } else if (activeCategory === "exercises") {
      setActiveSubcategory("cervical_exercises");
    } else {
      setActiveSubcategory(null);
    }
  }, [activeCategory]);

  // Fetch items when category or subcategory changes
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const fetchedItems = await fetchItemsByCategory(activeCategory, activeSubcategory || undefined);
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast({
          title: "Error",
          description: "Failed to load library items.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (activeCategory && categories.length > 0) {
      loadItems();
    }
  }, [activeCategory, activeSubcategory, categories, toast]);

  const handleSaveItem = async (item: Partial<ReportItem> | ReportItem) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save items to the library.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if ('id' in item && item.id) {
        // Update existing item
        const updatedItem = await updateItem(item as ReportItem);
        setItems(items.map(existingItem => 
          existingItem.id === updatedItem.id ? updatedItem : existingItem
        ));
        
        toast({
          title: "Item Updated",
          description: `${updatedItem.name} has been updated successfully.`
        });
      } else if (item.name && item.description) {
        // Create new item
        const newItemData: Omit<ReportItem, "id"> = {
          name: item.name,
          description: item.description,
          infoLink: item.infoLink,
          categoryId: activeCategory,
          subcategoryId: (activeCategory === "diagnosis" || activeCategory === "extremity" || 
                          activeCategory === "treatment" || activeCategory === "homecare" ||
                          activeCategory === "exercises") 
            ? item.subcategoryId || activeSubcategory || undefined
            : undefined
        };
        
        const createdItem = await createItem(newItemData);
        setItems([...items, createdItem]);
        
        toast({
          title: "Item Added",
          description: `${createdItem.name} has been added to ${getCategoryName(activeCategory)}.`
        });
      }
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        title: "Error",
        description: "Failed to save the item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setEditingItem(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete items from the library.",
        variant: "destructive",
      });
      return;
    }
    
    const itemToDelete = items.find(item => item.id === id);
    
    try {
      await deleteItem(id);
      setItems(items.filter(item => item.id !== id));
      
      toast({
        title: "Item Deleted",
        description: `${itemToDelete?.name} has been removed.`,
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete the item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (item: ReportItem) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to edit items in the library.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setActiveSubcategory(subcategoryId);
  };

  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(subcat => subcat.parentCategoryId === categoryId);
  };

  const handleAddNewItem = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to the library.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingItem(null);
    setIsDialogOpen(true);
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
