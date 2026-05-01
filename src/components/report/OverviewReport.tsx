
import { forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportItem, TREATMENT_SUBCATEGORIES } from "@/types";
import { ReportHeader } from "./ReportHeader";
import { PatientInfoDisplay } from "./PatientInfoDisplay";
import { InfoLink } from "./InfoLink";
import { PatientInfo } from "@/types";
import { ReportSetting } from "@/services/reportSettingsService";

// Section color configs using HSL-based tokens
const sectionStyles = {
  diagnosis: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    headerBg: "bg-blue-600",
    headerText: "text-white",
    label: "Diagnosis",
  },
  extremity: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    headerBg: "bg-indigo-600",
    headerText: "text-white",
    label: "Extremity Diagnosis",
  },
  treatment: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    headerBg: "bg-emerald-600",
    headerText: "text-white",
    label: "Treatment Modalities",
  },
  carePlan: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    headerBg: "bg-amber-600",
    headerText: "text-white",
    label: "Care Plan",
  },
  homecare: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    headerBg: "bg-rose-600",
    headerText: "text-white",
    label: "Home Care Recommendations",
  },
  exercises: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    headerBg: "bg-purple-600",
    headerText: "text-white",
    label: "Therapeutic Exercises",
  },
};

interface OverviewReportProps {
  patient: PatientInfo;
  items: ReportItem[];
  selectedItems: string[];
  customTreatmentGoals?: string;
  additionalNotes?: string;
  subcategories: any[];
  settings?: ReportSetting[];
  settingsLoading?: boolean;
}

const OverviewCard = ({
  name,
  definition,
  infoLink,
  style,
}: {
  name: string;
  definition?: string;
  infoLink?: string;
  style: typeof sectionStyles.diagnosis;
}) => (
  <div className={`rounded-lg border ${style.border} ${style.bg} overflow-hidden shadow-sm`}>
    <div className={`px-4 py-2 ${style.headerBg} flex items-center gap-2`}>
      <h4 className={`font-semibold text-sm ${style.headerText}`}>{name}</h4>
      {infoLink && <InfoLink link={infoLink} />}
    </div>
    <div className="px-4 py-3 space-y-2">
      <p className="text-sm text-foreground/80">{definition || "No definition provided."}</p>
      {infoLink && (
        <p className="text-xs text-muted-foreground italic">
          For more information: {infoLink}
        </p>
      )}
    </div>
  </div>
);

const SectionHeader = ({ label, style }: { label: string; style: typeof sectionStyles.diagnosis }) => (
  <div className={`rounded-lg px-4 py-2.5 ${style.headerBg} mb-3`}>
    <h3 className={`font-bold text-base ${style.headerText}`}>{label}</h3>
  </div>
);

export const OverviewReport = forwardRef<HTMLDivElement, OverviewReportProps>(({
  patient,
  items,
  selectedItems,
  customTreatmentGoals = "",
  additionalNotes = "",
  subcategories = [],
  settings = [],
  settingsLoading = false,
}, ref) => {
  const getSelected = (categoryId: string, subcategoryFilter?: string[]) => {
    return items.filter((item) => {
      if (!selectedItems.includes(item.id)) return false;
      if (item.categoryId !== categoryId) return false;
      if (subcategoryFilter) {
        return subcategoryFilter.some((subId) => {
          const sub = subcategories.find((s) => s.id === item.subcategoryId);
          return sub && subcategoryFilter.includes(sub.id);
        });
      }
      return true;
    });
  };

  const getItemsBySubcategoryId = (categoryId: string, subIds: string[]) => {
    return items.filter((item) => {
      if (!selectedItems.includes(item.id)) return false;
      if (item.categoryId !== categoryId) return false;
      // Match by subcategory id directly
      return item.subcategoryId && subIds.includes(item.subcategoryId);
    });
  };

  const getItemsBySubcategoryName = (categoryId: string, subNames: string[]) => {
    const matchingSubIds = subcategories
      .filter((s) => s.parent_category_id === categoryId && subNames.includes(s.id))
      .map((s) => s.id);
    return items.filter((item) => {
      if (!selectedItems.includes(item.id)) return false;
      if (item.categoryId !== categoryId) return false;
      return item.subcategoryId && matchingSubIds.includes(item.subcategoryId);
    });
  };

  // Diagnosis items (diagnosis + extremity)
  const diagnosisItems = items.filter(
    (item) => selectedItems.includes(item.id) && (item.categoryId === "diagnosis")
  );
  const extremityItems = items.filter(
    (item) => selectedItems.includes(item.id) && item.categoryId === "extremity"
  );

  // Treatment - get subcategory IDs for treatment_modalities
  const treatmentModalitySubIds = subcategories
    .filter((s) => s.parent_category_id === "treatment" && s.id === "treatment_modalities")
    .map((s) => s.id);
  const treatmentModalityItems = items.filter(
    (item) =>
      selectedItems.includes(item.id) &&
      item.categoryId === "treatment" &&
      item.subcategoryId === "treatment_modalities"
  );

  // Care plan type items
  const carePlanItems = items.filter(
    (item) =>
      selectedItems.includes(item.id) &&
      item.categoryId === "treatment" &&
      item.subcategoryId === "care_plan_type"
  );

  // Treatment goals items
  const treatmentGoalItems = items.filter(
    (item) =>
      selectedItems.includes(item.id) &&
      item.categoryId === "treatment" &&
      item.subcategoryId === "treatment_goals"
  );

  // Homecare items
  const homecareItems = items.filter(
    (item) => selectedItems.includes(item.id) && item.categoryId === "homecare"
  );

  // Exercises items
  const exerciseItems = items.filter(
    (item) => selectedItems.includes(item.id) && item.categoryId === "exercises"
  );

  const hasContent =
    diagnosisItems.length > 0 ||
    extremityItems.length > 0 ||
    treatmentModalityItems.length > 0 ||
    carePlanItems.length > 0 ||
    treatmentGoalItems.length > 0 ||
    customTreatmentGoals ||
    homecareItems.length > 0 ||
    exerciseItems.length > 0 ||
    !!additionalNotes;

  return (
    <Card className="mt-6">
      <CardHeader className="bg-muted border-b">
        <CardTitle className="text-foreground text-lg">Overview Report Preview</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {hasContent ? (
          <div ref={ref} className="space-y-6 max-w-[210mm] mx-auto bg-white">
            <div className="bg-white p-6 border border-border shadow-sm mx-auto" style={{ padding: "15mm", boxSizing: "border-box" }}>
              <ReportHeader settings={settings} loading={settingsLoading} />
              <PatientInfoDisplay patient={patient} />

              <div className="space-y-8 mt-6">
                {/* Section 1: Diagnosis */}
                {diagnosisItems.length > 0 && (
                  <div>
                    <SectionHeader label={sectionStyles.diagnosis.label} style={sectionStyles.diagnosis} />
                    <div className="grid grid-cols-2 gap-3">
                      {diagnosisItems.map((item) => (
                        <OverviewCard key={item.id} name={item.name} definition={item.definition} infoLink={item.infoLink} style={sectionStyles.diagnosis} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Extremity Diagnosis */}
                {extremityItems.length > 0 && (
                  <div>
                    <SectionHeader label={sectionStyles.extremity.label} style={sectionStyles.extremity} />
                    <div className="grid grid-cols-2 gap-3">
                      {extremityItems.map((item) => (
                        <OverviewCard key={item.id} name={item.name} definition={item.definition} infoLink={item.infoLink} style={sectionStyles.extremity} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 2: Treatment Modalities */}
                {treatmentModalityItems.length > 0 && (
                  <div>
                    <SectionHeader label={sectionStyles.treatment.label} style={sectionStyles.treatment} />
                    <div className="grid grid-cols-2 gap-3">
                      {treatmentModalityItems.map((item) => (
                        <OverviewCard key={item.id} name={item.name} definition={item.definition} infoLink={item.infoLink} style={sectionStyles.treatment} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 3: Care Plan + Treatment Goals */}
                {(carePlanItems.length > 0 || treatmentGoalItems.length > 0 || customTreatmentGoals) && (
                  <div>
                    <SectionHeader label={sectionStyles.carePlan.label} style={sectionStyles.carePlan} />
                    <div className="grid grid-cols-2 gap-3">
                      {/* Care Plan Type cards */}
                      {carePlanItems.map((item) => (
                        <OverviewCard key={item.id} name={item.name} definition={item.definition} infoLink={item.infoLink} style={sectionStyles.carePlan} />
                      ))}

                      {/* Treatment Goals as bullet list card */}
                      {(treatmentGoalItems.length > 0 || customTreatmentGoals) && (
                        <div className={`rounded-lg border ${sectionStyles.carePlan.border} ${sectionStyles.carePlan.bg} overflow-hidden shadow-sm`}>
                          <div className={`px-4 py-2 ${sectionStyles.carePlan.headerBg}`}>
                            <h4 className={`font-semibold text-sm ${sectionStyles.carePlan.headerText}`}>Treatment Goals</h4>
                          </div>
                          <div className="px-4 py-3">
                            <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
                              {treatmentGoalItems.map((item) => (
                                <li key={item.id}>{item.name}</li>
                              ))}
                              {customTreatmentGoals && <li>{customTreatmentGoals}</li>}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section 4: Home Care */}
                {homecareItems.length > 0 && (
                  <div>
                    <SectionHeader label={sectionStyles.homecare.label} style={sectionStyles.homecare} />
                    <div className="grid grid-cols-2 gap-3">
                      {homecareItems.map((item) => (
                        <OverviewCard key={item.id} name={item.name} definition={item.definition} infoLink={item.infoLink} style={sectionStyles.homecare} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 5: Exercises */}
                {exerciseItems.length > 0 && (
                  <div>
                    <SectionHeader label={sectionStyles.exercises.label} style={sectionStyles.exercises} />
                    <div className="grid grid-cols-2 gap-3">
                      {exerciseItems.map((item) => (
                        <OverviewCard key={item.id} name={item.name} definition={item.definition} infoLink={item.infoLink} style={sectionStyles.exercises} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {additionalNotes && (
                  <div>
                    <div className="rounded-lg px-4 py-2.5 bg-gray-600 mb-3">
                      <h3 className="font-bold text-base text-white">Additional Notes</h3>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/50 overflow-hidden shadow-sm">
                      <div className="px-4 py-3">
                        <p className="whitespace-pre-wrap text-sm text-foreground/80">{additionalNotes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center text-xs text-muted-foreground mt-8">Page 1</div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>Select items from the categories above to build your overview report.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

OverviewReport.displayName = "OverviewReport";
