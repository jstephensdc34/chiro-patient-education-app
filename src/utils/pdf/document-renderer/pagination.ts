
/**
 * Splits content into pages based on estimated content height
 */
export function paginateContent(bodyContent: string[], contentHeight: number): string[][] {
  // Filter out empty content to avoid empty pages
  const nonEmptyContent = bodyContent.filter(content => content && content.trim() !== '');
  
  // If no content, return empty array
  if (nonEmptyContent.length === 0) {
    return [[]];
  }
  
  // Improved estimation based on content length and HTML tags
  const estimateContentHeight = (content: string): number => {
    const textLength = content.length;
    const headingCount = (content.match(/<h[3-4]/g) || []).length;
    const listItemCount = (content.match(/<li/g) || []).length;
    const paragraphCount = (content.match(/<p/g) || []).length;
    
    // Each heading takes ~25 units, each list item ~20 units, paragraphs ~15 units, text takes 1 unit per 15 chars
    return headingCount * 25 + listItemCount * 20 + paragraphCount * 15 + textLength / 15;
  };
  
  // Improved algorithm that considers content density
  const pages: string[][] = [];
  let currentPage: string[] = [];
  let currentPageHeight = 0;
  
  for (const content of nonEmptyContent) {
    const contentEstimatedHeight = estimateContentHeight(content);
    
    // If adding this content would exceed page height, start a new page
    if (currentPageHeight > 0 && currentPageHeight + contentEstimatedHeight > contentHeight) {
      if (currentPage.length > 0) {
        pages.push(currentPage);
      }
      currentPage = [content];
      currentPageHeight = contentEstimatedHeight;
    } else {
      currentPage.push(content);
      currentPageHeight += contentEstimatedHeight;
    }
  }
  
  // Add the last page if not empty
  if (currentPage.length > 0) {
    pages.push(currentPage);
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
