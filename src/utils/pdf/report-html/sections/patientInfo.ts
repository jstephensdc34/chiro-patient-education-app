
import { PatientInfo } from '@/types';

export const createPatientInfo = (patient: PatientInfo): string => {
  if (!patient.name) return '';
  
  return `
    <div class="patient-info-container">
      <h2 class="patient-name">${patient.name}</h2>
      <p class="patient-details">
        ${patient.age ? `<span>Age: ${patient.age}</span>` : ''}
        ${patient.gender ? `<span>Gender: ${patient.gender}</span>` : ''}
        <span>Date: ${new Date(patient.date).toLocaleDateString()}</span>
      </p>
    </div>
  `;
};
