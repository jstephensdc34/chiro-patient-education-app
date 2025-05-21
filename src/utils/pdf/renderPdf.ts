
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from '@/components/ui/use-toast';

export interface RenderPdfProgress {
  status: 'preparing' | 'rendering' | 'generating' | 'finalizing' | 'complete';
  percentage: number;
}

export const renderPdfFromHtml = async (
  htmlContent: string,
  patientName: string,
  onProgress?: (progress: RenderPdfProgress) => void
): Promise<void> => {
  // Create a temporary div to render the report
  const reportContainer = document.createElement('div');
  reportContainer.id = 'report-container';
  reportContainer.style.position = 'absolute';
  reportContainer.style.left = '-9999px';
  reportContainer.style.backgroundColor = 'white';
  document.body.appendChild(reportContainer);
  
  try {
    // Update progress
    onProgress?.({ status: 'preparing', percentage: 10 });
    
    // Set the HTML content
    reportContainer.innerHTML = htmlContent;
    
    // Get all page containers
    const pageContainers = reportContainer.querySelectorAll('.page-container');
    
    if (pageContainers.length === 0) {
      throw new Error('No page containers found in the report');
    }
    
    // Wait for images to load and report progress
    onProgress?.({ status: 'rendering', percentage: 20 });
    
    // Load all images in the container
    const imgElements = reportContainer.querySelectorAll('img');
    if (imgElements.length > 0) {
      await Promise.all(
        Array.from(imgElements).map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = () => resolve();
                img.onerror = () => {
                  console.error(`Failed to load image: ${img.src}`);
                  // Replace with placeholder or continue without the image
                  img.src = '/placeholder.svg';
                  resolve();
                };
              }
            })
        )
      );
    }
    
    // Final preparation before canvas rendering
    await new Promise((resolve) => setTimeout(resolve, 500));
    onProgress?.({ status: 'rendering', percentage: 30 });
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Process each page container
    let pageIndex = 0;
    
    for (const pageContainer of Array.from(pageContainers)) {
      // Update progress based on page processing
      const progressPercentage = 30 + Math.floor((pageIndex / pageContainers.length) * 50);
      onProgress?.({ 
        status: 'generating', 
        percentage: Math.min(progressPercentage, 80) 
      });
      
      // Add a new page for all but the first page
      if (pageIndex > 0) {
        pdf.addPage();
      }
      
      // Convert page to canvas
      const canvas = await html2canvas(pageContainer as HTMLElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      }).catch(error => {
        console.error(`HTML to canvas conversion failed for page ${pageIndex + 1}:`, error);
        throw new Error(`Failed to render page ${pageIndex + 1}. Please try again.`);
      });
      
      // Add image of the page to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 dimensions in mm
      
      // Process links in this page
      processLinksForPage(pageContainer as HTMLElement, pdf, pageIndex);
      
      pageIndex++;
    }
    
    onProgress?.({ status: 'finalizing', percentage: 90 });
    
    // Download the PDF with a clean filename
    const cleanPatientName = patientName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${cleanPatientName}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    
    try {
      pdf.save(filename);
      onProgress?.({ status: 'complete', percentage: 100 });
    } catch (error) {
      console.error('PDF save failed:', error);
      throw new Error('Failed to download the PDF. Please try again.');
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  } finally {
    // Clean up - remove the temporary div
    if (reportContainer && reportContainer.parentNode) {
      reportContainer.parentNode.removeChild(reportContainer);
    }
  }
};

// Function to process links for a specific page
const processLinksForPage = (
  pageContainer: HTMLElement, 
  pdf: jsPDF,
  pageIndex: number
) => {
  // Get all links in the page
  const links = pageContainer.querySelectorAll('a');
  
  // Calculate the scale factor between HTML and PDF dimensions
  const rect = pageContainer.getBoundingClientRect();
  
  // A4 size in mm
  const pdfWidth = 210; 
  const pdfHeight = 297;
  
  // Process each link
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Get link position relative to the page container
    const linkRect = link.getBoundingClientRect();
    const containerRect = pageContainer.getBoundingClientRect();
    
    // Calculate position in PDF coordinates (mm)
    const x = (linkRect.left - containerRect.left) * (pdfWidth / rect.width);
    const y = (linkRect.top - containerRect.top) * (pdfHeight / rect.height);
    const width = linkRect.width * (pdfWidth / rect.width);
    const height = linkRect.height * (pdfHeight / rect.height);
    
    // Add link annotation to the PDF
    pdf.link(x, y, width, height, { url: href });
  });
};
