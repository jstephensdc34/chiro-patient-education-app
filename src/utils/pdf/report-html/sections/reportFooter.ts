
export const createReportFooter = (
  phone: string,
  email: string,
  website: string
): string => {
  return `
    <div class="footer">
      <div class="footer-content">
        ${phone ? `<span class="footer-item"><strong>Phone:</strong> ${phone}</span>` : ''}
        ${email ? `<span class="footer-item"><strong>Email:</strong> ${email}</span>` : ''}
        ${website ? `<span class="footer-item"><strong>Web:</strong> ${website}</span>` : ''}
      </div>
    </div>
  `;
};
