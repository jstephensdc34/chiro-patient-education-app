
import { ReportItem } from "@/types";

// Mock data - updated to match data in libraryService.ts
export const mockItems: ReportItem[] = [
  { id: "1", name: "Cervical Sprain/Strain", description: "Stretch injury to the ligaments or muscles of the neck", infoLink: "https://www.spine-health.com/conditions/neck-pain/cervical-sprain-and-strain", categoryId: "diagnosis", subcategoryId: "cervical_diagnosis" },
  { id: "2", name: "Lumbar Disc Herniation", description: "Protrusion of the intervertebral disc material in lumbar spine", infoLink: "https://www.spine-health.com/conditions/herniated-disc/lumbar-herniated-disc", categoryId: "diagnosis", subcategoryId: "lumbopelvic_diagnosis" },
  { id: "3", name: "Spinal Manipulation", description: "High-velocity, low-amplitude thrust to spinal joints", infoLink: "https://www.spine-health.com/treatment/chiropractic/spinal-manipulation-and-chiropractic-care", categoryId: "treatment", subcategoryId: "treatment_modalities" },
  { id: "4", name: "Ice Therapy", description: "Application of ice to reduce inflammation", infoLink: "https://www.spine-health.com/treatment/pain-management/ice-packs-back-pain-relief", categoryId: "homecare", subcategoryId: "home_therapy" },
  { id: "5", name: "McKenzie Extensions", description: "Extension-based exercises for disc problems", infoLink: "https://www.spine-health.com/treatment/physical-therapy/mckenzie-therapy-mechanical-diagnosis-and-therapy-back-pain", categoryId: "exercises", subcategoryId: "lumbopelvic_exercises" },
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
  { id: "18", name: "Hydration Plan", description: "Recommendations for optimal water intake for disc health", infoLink: "https://www.spine-health.com/wellness/nutrition-diet-weight-loss/food-thought-diet-and-nutrition-healthy-spine", categoryId: "homecare", subcategoryId: "wellness" },
  // Sample items for exercise subcategories
  { id: "19", name: "Cervical Retraction", description: "Exercise to strengthen deep neck flexors", infoLink: "https://www.spine-health.com/conditions/neck-pain/neck-strengthening-exercises", categoryId: "exercises", subcategoryId: "cervical_exercises" },
  { id: "20", name: "Thoracic Extension", description: "Exercise to improve mobility in the thoracic spine", infoLink: "https://www.spine-health.com/conditions/upper-back-pain/exercises-upper-back-pain", categoryId: "exercises", subcategoryId: "thoracic_exercises" },
  { id: "21", name: "Bird Dog", description: "Core stabilization exercise for the lower back", infoLink: "https://www.spine-health.com/wellness/exercise/bird-dog-exercise", categoryId: "exercises", subcategoryId: "lumbopelvic_exercises" },
  { id: "22", name: "Theraband Rows", description: "Resistance band exercise for upper back and shoulders", infoLink: "https://www.spine-health.com/wellness/exercise/stretches-and-exercises-upper-back-pain-and-neck", categoryId: "exercises", subcategoryId: "upper_extremity_exercises" },
  { id: "23", name: "Calf Raises", description: "Exercise to strengthen the calf muscles", infoLink: "https://www.spine-health.com/wellness/exercise/calf-raises-exercise", categoryId: "exercises", subcategoryId: "lower_extremity_exercises" }
];
