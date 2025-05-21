
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
  
  // Define PDF margins in mm
  const marginLeft = 15; // 15mm left margin
  const marginRight = 15; // 15mm right margin
  const marginTop = 15; // 15mm top margin
  const marginBottom = 20; // 20mm bottom margin (larger to accommodate page numbers)
  
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
    
    // Create PDF with hyperlink support
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in mm
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    
    // Calculate content dimensions considering margins
    const contentWidth = pdfWidth - marginLeft - marginRight;
    const contentHeight = pdfHeight - marginTop - marginBottom;
    
    // Calculate image scaling to fit within the margins
    const imgWidth = contentWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    // Handle multi-page content
    let heightLeft = imgHeight;
    let pageCount = 1; // Start at page 1
    
    // First page - add image with top margin
    pdf.addImage(imgData, 'PNG', marginLeft, marginTop, imgWidth, imgHeight);
    heightLeft -= contentHeight;
    
    // Add more pages if needed
    while (heightLeft > 0) {
      pdf.addPage();
      pageCount++;
      // Position is negative to show the continuation of the image
      // We need to adjust by the top margin on each page
      const position = -((pageCount - 1) * contentHeight) + marginTop;
      pdf.addImage(imgData, 'PNG', marginLeft, position, imgWidth, imgHeight);
      heightLeft -= contentHeight;
    }
    
    // Process links in the document and add them to the PDF with margin adjustments
    processLinksForPdf(reportContainer, pdf, contentWidth, imgHeight, marginLeft, marginTop);
    
    // Add page numbers with margin consideration
    for (let i = 1; i <= pdf.getNumberOfPages(); i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(
        `Page ${i} of ${pdf.getNumberOfPages()}`, 
        pdfWidth / 2, 
        pdfHeight - (marginBottom / 2), 
        { align: 'center' }
      );
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

// Function to process links and add them to the PDF
const processLinksForPdf = (
  container: HTMLElement, 
  pdf: jsPDF, 
  contentWidth: number, 
  imgHeight: number,
  marginLeft: number,
  marginTop: number
) => {
  // Get all links in the container
  const links = container.querySelectorAll('a');
  
  // Calculate the scale factor between HTML and PDF dimensions
  const rect = container.getBoundingClientRect();
  const scaleX = contentWidth / rect.width;
  const scaleY = imgHeight / rect.height;
  
  // Process each link
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Get link position relative to the container
    const linkRect = link.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate position in PDF coordinates and add margins
    const x = marginLeft + (linkRect.left - containerRect.left) * scaleX;
    const y = marginTop + (linkRect.top - containerRect.top) * scaleY;
    const width = linkRect.width * scaleX;
    const height = linkRect.height * scaleY;
    
    // Add link annotation to the PDF (jsPDF)
    pdf.link(x, y, width, height, { url: href });
  });
};
