
/**
 * Splits content into pages based on estimated content height
 */
export function paginateContent(bodyContent: string[], contentHeight: number): string[][] {
  // This is a simplified pagination - in a real implementation, 
  // you would need to calculate actual content heights
  const contentPerPage = Math.max(1, Math.floor(contentHeight / 40)); // Rough estimate of content elements per page
  
  const pages: string[][] = [];
  for (let i = 0; i < bodyContent.length; i += contentPerPage) {
    pages.push(bodyContent.slice(i, i + contentPerPage));
  }
  
  // Ensure we have at least one page
  if (pages.length === 0) {
    pages.push([]);
  }
  
  return pages;
}

/**
 * Creates a clean filename for the PDF
 */
export function createPdfFilename(patientName: string): string {
  const cleanPatientName = patientName.replace(/[^a-zA-Z0-9]/g, '_');
  return `${cleanPatientName}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
}
