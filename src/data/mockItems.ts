
import { ReportItem } from "@/types";

// Mock data - would be replaced with Supabase fetch
export const mockItems: ReportItem[] = [
  { id: "1", name: "Cervical Sprain/Strain", description: "Stretch injury to the ligaments or muscles of the neck", infoLink: "https://www.spine-health.com/conditions/neck-pain/cervical-sprain-and-strain", categoryId: "diagnosis" },
  { id: "2", name: "Lumbar Disc Herniation", description: "Protrusion of the intervertebral disc material in lumbar spine", infoLink: "https://www.spine-health.com/conditions/herniated-disc/lumbar-herniated-disc", categoryId: "diagnosis" },
  { id: "3", name: "Spinal Manipulation", description: "High-velocity, low-amplitude thrust to spinal joints", infoLink: "https://www.spine-health.com/treatment/chiropractic/spinal-manipulation-and-chiropractic-care", categoryId: "treatment" },
  { id: "4", name: "Ice Therapy", description: "Application of ice to reduce inflammation", infoLink: "https://www.spine-health.com/treatment/pain-management/ice-packs-back-pain-relief", categoryId: "homecare" },
  { id: "5", name: "Heat Therapy", description: "Application of heat to relax muscles and increase blood flow", infoLink: "https://www.spine-health.com/treatment/heat-therapy-cold-therapy/heat-therapy-benefits-for-lower-back-pain", categoryId: "homecare" },
  { id: "6", name: "McKenzie Extensions", description: "Extension-based exercises for disc problems", infoLink: "https://www.spine-health.com/treatment/physical-therapy/mckenzie-therapy-mechanical-diagnosis-and-therapy-back-pain", categoryId: "exercises" },
  { id: "7", name: "Cat-Camel Stretch", description: "Flexion and extension movement for the spine", infoLink: "https://www.spine-health.com/wellness/exercise/cat-camel-back-stretch", categoryId: "exercises" }
];
