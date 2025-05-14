
export const createReportHeader = (
  clinicName: string,
  clinicWebsite: string,
  logoUrl: string
): string => {
  return `
    <div class="header">
      ${logoUrl ? `<img src="${logoUrl}" alt="Clinic Logo" class="logo" />` : ''}
      <div class="header-content">
        <h1 class="clinic-name">${clinicName}</h1>
        <p class="clinic-info">${clinicWebsite}</p>
      </div>
    </div>
  `;
};
