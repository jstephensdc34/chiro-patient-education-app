import { useState, useEffect } from "react";
import { CategoryType, Category, Subcategory, ReportItem } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { fetchCategories, fetchSubcategories, fetchItemsByCategory } from "@/services/library";

export const useLibraryData = (initialCategory: CategoryType = "diagnosis") => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>(initialCategory);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>("general_diagnosis");
  const [items, setItems] = useState<ReportItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

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

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(subcat => subcat.parentCategoryId === categoryId);
  };

  return {
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
  };
};
