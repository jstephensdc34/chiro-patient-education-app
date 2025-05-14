
import { PatientInfo } from '@/types';

export const createPatientInfo = (patient: PatientInfo): string => {
  return `
    <h2 class="patient-name">${patient.name}</h2>
    <p class="patient-info">
      ${patient.age ? `Age: ${patient.age} | ` : ''}
      ${patient.gender ? `Gender: ${patient.gender} | ` : ''}
      Date: ${new Date(patient.date).toLocaleDateString()}
    </p>
  `;
};
