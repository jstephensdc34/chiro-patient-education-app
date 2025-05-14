
export interface ParsedHtmlContent {
  headerContent: string;
  bodyContent: string[];
  footerContent: string;
  clinicInfo: {
    name: string;
    website: string;
    phone: string;
    email: string;
    logoUrl: string;
  };
}

/**
 * Parses HTML content into structured sections for PDF rendering
 */
export function parseHtmlContent(htmlContent: string): ParsedHtmlContent {
  // Create a DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Extract header, content sections, and footer
  const headerNode = doc.querySelector('.header');
  const contentNodes = Array.from(doc.querySelectorAll('.section'));
  const footerNode = doc.querySelector('.footer');
  
  // Extract clinic info
  const clinicName = doc.querySelector('.clinic-name')?.textContent || 'Chiropractic Clinic';
  const clinicWebsite = doc.querySelector('.clinic-website')?.textContent || '';
  const clinicPhone = doc.querySelector('.clinic-phone')?.textContent || '';
  const clinicEmail = doc.querySelector('.clinic-email')?.textContent || '';
  const logoUrl = doc.querySelector('.logo')?.getAttribute('src') || '';
  
  return {
    headerContent: headerNode?.outerHTML || '',
    bodyContent: contentNodes.map(node => node.outerHTML),
    footerContent: footerNode?.outerHTML || '',
    clinicInfo: {
      name: clinicName,
      website: clinicWebsite,
      phone: clinicPhone,
      email: clinicEmail,
      logoUrl: logoUrl,
    }
  };
}
