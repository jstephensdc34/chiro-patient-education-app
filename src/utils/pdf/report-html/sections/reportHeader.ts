
export const createReportHeader = (
  clinicName: string,
  clinicWebsite: string,
  logoUrl: string
): string => {
  return `
    <div class="header">
      <div class="header-container">
        <div class="logo-container">
          ${logoUrl 
            ? `<img src="${logoUrl}" alt="Clinic Logo" class="logo" />` 
            : `<div class="logo-placeholder"><span>Logo</span></div>`
          }
        </div>
        <div class="header-content">
          <h1 class="clinic-name">${clinicName}</h1>
          <p class="clinic-website">${clinicWebsite}</p>
        </div>
      </div>
    </div>
  `;
};
