
import { PatientInfo } from "@/types";

interface PatientInfoDisplayProps {
  patient: PatientInfo;
}

export const PatientInfoDisplay = ({ patient }: PatientInfoDisplayProps) => {
  if (!patient.name) return null;
  
  return (
    <div className="pb-2 border-b border-gray-200">
      <h2 className="text-lg font-bold">{patient.name}</h2>
      <div className="text-sm text-gray-600 flex gap-x-4">
        {patient.age && <span>Age: {patient.age}</span>}
        {patient.gender && <span>Gender: {patient.gender}</span>}
        <span>Date: {new Date(patient.date).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
