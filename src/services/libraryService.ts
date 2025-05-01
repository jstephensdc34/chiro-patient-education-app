
import { ReportItem, Category, CategoryType, Subcategory } from "@/types";

// Mock data - would be replaced with Supabase fetch
export const mockItems: ReportItem[] = [
  { id: "1", name: "Cervical Sprain/Strain", description: "Stretch injury to the ligaments or muscles of the neck", infoLink: "https://www.spine-health.com/conditions/neck-pain/cervical-sprain-and-strain", categoryId: "diagnosis", subcategoryId: "cervical_diagnosis" },
  { id: "2", name: "Lumbar Disc Herniation", description: "Protrusion of the intervertebral disc material in lumbar spine", infoLink: "https://www.spine-health.com/conditions/herniated-disc/lumbar-herniated-disc", categoryId: "diagnosis", subcategoryId: "lumbopelvic_diagnosis" },
  { id: "3", name: "Spinal Manipulation", description: "High-velocity, low-amplitude thrust to spinal joints", infoLink: "https://www.spine-health.com/treatment/chiropractic/spinal-manipulation-and-chiropractic-care", categoryId: "treatment", subcategoryId: "treatment_modalities" },
  { id: "4", name: "Ice Therapy", description: "Application of ice to reduce inflammation", infoLink: "https://www.spine-health.com/treatment/pain-management/ice-packs-back-pain-relief", categoryId: "homecare", subcategoryId: "home_therapy" },
  { id: "5", name: "McKenzie Extensions", description: "Extension-based exercises for disc problems", infoLink: "https://www.spine-health.com/treatment/physical-therapy/mckenzie-therapy-mechanical-diagnosis-and-therapy-back-pain", categoryId: "exercises" },
  { id: "8", name: "Carpal Tunnel Syndrome", description: "Compression of the median nerve in the wrist causing numbness and pain", infoLink: "https://orthoinfo.aaos.org/en/diseases--conditions/carpal-tunnel-syndrome/", categoryId: "extremity", subcategoryId: "wrist_hand" },
  { id: "9", name: "Tennis Elbow", description: "Inflammation of the tendons on the outside of the elbow", infoLink: "https://www.mayoclinic.org/diseases-conditions/tennis-elbow/symptoms-causes/syc-20351987", categoryId: "extremity", subcategoryId: "elbow" },
  { id: "10", name: "Vertebral Subluxation", description: "Misalignment of vertebrae causing neural interference", infoLink: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1208927/", categoryId: "diagnosis", subcategoryId: "general_diagnosis" },
  { id: "11", name: "Thoracic Facet Syndrome", description: "Irritation of thoracic facet joints causing mid-back pain", infoLink: "https://www.spine-health.com/conditions/spine-anatomy/thoracic-spine-anatomy-and-upper-back-pain", categoryId: "diagnosis", subcategoryId: "thoracic_diagnosis" },
  // Sample items for treatment plan subcategories
  { id: "12", name: "Acute Care Plan", description: "Short-term intensive care for recent injuries", infoLink: "https://www.spine-health.com/treatment/chiropractic/what-expect-first-chiropractic-consultation", categoryId: "treatment", subcategoryId: "care_plan_type" },
  { id: "13", name: "Pain Reduction", description: "Focused on decreasing pain levels", infoLink: "https://www.spine-health.com/treatment/chiropractic/chiropractic-treatments-lower-back-pain-relief", categoryId: "treatment", subcategoryId: "treatment_goals" },
  { id: "14", name: "Initial Consultation", description: "Estimated cost for initial evaluation", infoLink: "https://www.spine-health.com/treatment/chiropractic/what-expect-first-chiropractic-consultation", categoryId: "treatment", subcategoryId: "estimated_cost" },
  // Sample items for home care subcategories
  { id: "15", name: "Heat Therapy", description: "Application of heat to relax muscles and increase blood flow", infoLink: "https://www.spine-health.com/treatment/heat-therapy-cold-therapy/heat-therapy-benefits-for-lower-back-pain", categoryId: "homecare", subcategoryId: "home_therapy" },
  { id: "16", name: "Ergonomic Adjustments", description: "Modifications to work and home environments to reduce strain", infoLink: "https://www.spine-health.com/wellness/ergonomics", categoryId: "homecare", subcategoryId: "activity_modification" },
  { id: "17", name: "Proper Lifting Technique", description: "Guidelines for safe lifting to prevent back injury", infoLink: "https://www.spine-health.com/wellness/ergonomics/lifting-techniques-injury-prevention", categoryId: "homecare", subcategoryId: "adls" },
  { id: "18", name: "Hydration Plan", description: "Recommendations for optimal water intake for disc health", infoLink: "https://www.spine-health.com/wellness/nutrition-diet-weight-loss/food-thought-diet-and-nutrition-healthy-spine", categoryId: "homecare", subcategoryId: "wellness" }
];

export const mockCategories: Category[] = [
  { id: "diagnosis", name: "Spinal Diagnosis", description: "Clinical diagnoses" },
  { id: "extremity", name: "Extremity Diagnosis", description: "Diagnoses for extremities" },
  { id: "treatment", name: "Treatment Plan", description: "In-office procedures" },
  { id: "homecare", name: "Home Care", description: "At-home recommendations" },
  { id: "exercises", name: "Therapeutic Exercises", description: "Rehabilitative movements" }
];

export const mockSubcategories: Subcategory[] = [
  { id: "general_diagnosis", name: "General Diagnosis", parentCategoryId: "diagnosis", description: "General spinal conditions" },
  { id: "cervical_diagnosis", name: "Cervical Diagnosis", parentCategoryId: "diagnosis", description: "Neck region conditions" },
  { id: "thoracic_diagnosis", name: "Thoracic Diagnosis", parentCategoryId: "diagnosis", description: "Mid-back conditions" },
  { id: "lumbopelvic_diagnosis", name: "Lumbopelvic Diagnosis", parentCategoryId: "diagnosis", description: "Low back and pelvic conditions" },
  // Extremity subcategories
  { id: "shoulder", name: "Shoulder", parentCategoryId: "extremity", description: "Shoulder conditions" },
  { id: "elbow", name: "Elbow", parentCategoryId: "extremity", description: "Elbow conditions" },
  { id: "wrist_hand", name: "Wrist & Hand", parentCategoryId: "extremity", description: "Wrist and hand conditions" },
  { id: "hip", name: "Hip", parentCategoryId: "extremity", description: "Hip conditions" },
  { id: "knee", name: "Knee", parentCategoryId: "extremity", description: "Knee conditions" },
  { id: "ankle_foot", name: "Ankle & Foot", parentCategoryId: "extremity", description: "Ankle and foot conditions" },
  // Treatment plan subcategories
  { id: "care_plan_type", name: "Care Plan Type", parentCategoryId: "treatment", description: "Types of care plans" },
  { id: "treatment_modalities", name: "Treatment Modalities", parentCategoryId: "treatment", description: "Treatment techniques and approaches" },
  { id: "treatment_goals", name: "Treatment Goals", parentCategoryId: "treatment", description: "Objectives of the treatment" },
  { id: "estimated_cost", name: "Estimated Cost", parentCategoryId: "treatment", description: "Estimated costs for treatment" },
  // Home care subcategories
  { id: "home_therapy", name: "Home Therapy", parentCategoryId: "homecare", description: "Self-administered therapeutic techniques" },
  { id: "adls", name: "ADLs", parentCategoryId: "homecare", description: "Activities of Daily Living modifications" },
  { id: "activity_modification", name: "Activity Modification", parentCategoryId: "homecare", description: "Recommendations for modifying daily activities" },
  { id: "wellness", name: "Wellness", parentCategoryId: "homecare", description: "General health and wellness recommendations" }
];
