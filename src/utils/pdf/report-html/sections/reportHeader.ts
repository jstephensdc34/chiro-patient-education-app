
export const createReportHeader = (
  clinicName: string,
  clinicAddress: string,
  clinicPhone: string,
  clinicEmail: string,
  clinicWebsite: string,
  logoUrl: string
): string => {
  return `
    <div class="header">
      ${logoUrl ? `<img src="${logoUrl}" alt="Clinic Logo" class="logo" />` : ''}
      <div class="header-content">
        <h1 class="clinic-name">${clinicName}</h1>
        <p class="clinic-info">
          ${clinicAddress}<br/>
          ${clinicPhone} | ${clinicEmail} | ${clinicWebsite}
        </p>
      </div>
    </div>
  `;
};
