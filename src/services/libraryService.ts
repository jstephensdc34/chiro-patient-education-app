
import { ReportItem, Category, CategoryType, Subcategory } from "@/types";

// Mock data - would be replaced with Supabase fetch
export const mockItems: ReportItem[] = [
  { id: "1", name: "Cervical Sprain/Strain", description: "Stretch injury to the ligaments or muscles of the neck", infoLink: "https://www.spine-health.com/conditions/neck-pain/cervical-sprain-and-strain", categoryId: "diagnosis", subcategoryId: "cervical_diagnosis" },
  { id: "2", name: "Lumbar Disc Herniation", description: "Protrusion of the intervertebral disc material in lumbar spine", infoLink: "https://www.spine-health.com/conditions/herniated-disc/lumbar-herniated-disc", categoryId: "diagnosis", subcategoryId: "lumbopelvic_diagnosis" },
  { id: "3", name: "Spinal Manipulation", description: "High-velocity, low-amplitude thrust to spinal joints", infoLink: "https://www.spine-health.com/treatment/chiropractic/spinal-manipulation-and-chiropractic-care", categoryId: "treatment" },
  { id: "4", name: "Ice Therapy", description: "Application of ice to reduce inflammation", infoLink: "https://www.spine-health.com/treatment/pain-management/ice-packs-back-pain-relief", categoryId: "homecare" },
  { id: "5", name: "McKenzie Extensions", description: "Extension-based exercises for disc problems", infoLink: "https://www.spine-health.com/treatment/physical-therapy/mckenzie-therapy-mechanical-diagnosis-and-therapy-back-pain", categoryId: "exercises" },
  { id: "8", name: "Carpal Tunnel Syndrome", description: "Compression of the median nerve in the wrist causing numbness and pain", infoLink: "https://orthoinfo.aaos.org/en/diseases--conditions/carpal-tunnel-syndrome/", categoryId: "extremity", subcategoryId: "wrist_hand" },
  { id: "9", name: "Tennis Elbow", description: "Inflammation of the tendons on the outside of the elbow", infoLink: "https://www.mayoclinic.org/diseases-conditions/tennis-elbow/symptoms-causes/syc-20351987", categoryId: "extremity", subcategoryId: "elbow" },
  { id: "10", name: "Vertebral Subluxation", description: "Misalignment of vertebrae causing neural interference", infoLink: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1208927/", categoryId: "diagnosis", subcategoryId: "general_diagnosis" },
  { id: "11", name: "Thoracic Facet Syndrome", description: "Irritation of thoracic facet joints causing mid-back pain", infoLink: "https://www.spine-health.com/conditions/spine-anatomy/thoracic-spine-anatomy-and-upper-back-pain", categoryId: "diagnosis", subcategoryId: "thoracic_diagnosis" }
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
  { id: "ankle_foot", name: "Ankle & Foot", parentCategoryId: "extremity", description: "Ankle and foot conditions" }
];
