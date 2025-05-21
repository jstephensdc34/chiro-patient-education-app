
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
  reportContainer.style.width = '800px';
  reportContainer.style.padding = '20px';
  reportContainer.style.position = 'absolute';
  reportContainer.style.left = '-9999px';
  reportContainer.style.backgroundColor = 'white';
  document.body.appendChild(reportContainer);
  
  try {
    // Update progress
    onProgress?.({ status: 'preparing', percentage: 10 });
    
    // Set the HTML content
    reportContainer.innerHTML = htmlContent;
    
    // Wait for images to load and report progress
    onProgress?.({ status: 'rendering', percentage: 30 });
    
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
    onProgress?.({ status: 'rendering', percentage: 50 });
    
    // Convert HTML to canvas with better error handling
    const canvas = await html2canvas(reportContainer, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff', // Ensure white background
      onclone: (doc) => {
        // Additional handling for cloned document if needed
        return Promise.resolve();
      }
    }).catch(error => {
      console.error('HTML to canvas conversion failed:', error);
      throw new Error('Failed to render the report. Please try again.');
    });
    
    onProgress?.({ status: 'generating', percentage: 70 });
    
    // Custom page dimensions: 210mm x 2970mm (A4 width x 10x A4 height)
    const pageWidth = 210; // mm
    const pageHeight = 2970; // mm (10x standard A4 height)
    
    // Create PDF with custom dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pageWidth, pageHeight] // Custom page size
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth; // PDF page width
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    // No need for multi-page content with this extended page height
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Process links in the document and add them to the PDF
    processLinksForPdf(reportContainer, pdf, imgWidth, imgHeight);
    
    // Add page number
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Page 1 of 1`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
    
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

// Function to process links and add them to the PDF
const processLinksForPdf = (
  container: HTMLElement, 
  pdf: jsPDF, 
  pdfWidth: number, 
  pdfHeight: number
) => {
  // Get all links in the container
  const links = container.querySelectorAll('a');
  
  // Calculate the scale factor between HTML and PDF dimensions
  const rect = container.getBoundingClientRect();
  const scaleX = pdfWidth / rect.width;
  const scaleY = pdfHeight / rect.height;
  
  // Process each link
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Get link position relative to the container
    const linkRect = link.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate position in PDF coordinates
    const x = (linkRect.left - containerRect.left) * scaleX;
    const y = (linkRect.top - containerRect.top) * scaleY;
    const width = linkRect.width * scaleX;
    const height = linkRect.height * scaleY;
    
    // Add link annotation to the PDF (jsPDF)
    pdf.link(x, y, width, height, { url: href });
  });
};
