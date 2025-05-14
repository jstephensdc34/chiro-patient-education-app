
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from '@/hooks/use-toast';

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
    
    // Create PDF with proper margins
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    
    // Define margins (in mm) - 1 inch = 25.4mm
    const marginTop = 25.4;
    const marginBottom = 25.4;
    const marginLeft = 0; // Keep left margin at 0 as per current design
    
    // Calculate available content area dimensions
    const contentWidth = pageWidth - (marginLeft * 2);
    const contentHeight = pageHeight - marginTop - marginBottom;
    
    // Scale canvas to fit width of content area
    const imgWidth = contentWidth;
    const imgHeight = canvas.height * contentWidth / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 0;
    
    // Add first page
    pdf.addPage();
    
    // Position image with respect to top margin
    position = marginTop;
    pdf.addImage(imgData, 'PNG', marginLeft, position, imgWidth, imgHeight);
    heightLeft -= (contentHeight);
    pageCount = 1;
    
    // Add more pages if needed
    while (heightLeft > 0) {
      // Add a new page
      pdf.addPage();
      pageCount++;
      
      // Calculate position for next portion of the image
      // Move up by the height of content already shown
      position = marginTop - (contentHeight * (pageCount - 1));
      
      // Add the image at the calculated position
      pdf.addImage(imgData, 'PNG', marginLeft, position, imgWidth, imgHeight);
      
      // Reduce remaining height
      heightLeft -= contentHeight;
    }
    
    // Process links in the document and add them to the PDF
    processLinksForPdf(reportContainer, pdf, contentWidth, imgHeight);
    
    // Add page numbers at the bottom of each page (respecting bottom margin)
    for (let i = 1; i <= pdf.getNumberOfPages(); i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      // Position the page number in the center, above the bottom margin
      pdf.text(
        `Page ${i} of ${pdf.getNumberOfPages()}`, 
        pageWidth / 2, 
        pageHeight - (marginBottom / 2), 
        { align: 'center' }
      );
    }
    
    onProgress?.({ status: 'finalizing', percentage: 90 });
    
    // Remove the first blank page that was automatically added
    pdf.deletePage(1);
    
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
