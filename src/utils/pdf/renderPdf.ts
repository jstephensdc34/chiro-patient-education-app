
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
    
    // A4 dimensions
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    
    // Define margins (in mm) - 1 inch = 25.4mm
    const marginTop = 25.4; // 1 inch top margin
    const marginBottom = 25.4; // 1 inch bottom margin
    const marginLeft = 0; // No left margin
    
    // Calculate available content area dimensions
    const contentWidth = pageWidth - (marginLeft * 2);
    const contentHeight = pageHeight - marginTop - marginBottom;
    
    // Get image data from canvas
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate image dimensions to fit within content area
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    
    // Calculate how many pages we need
    const pageCount = Math.ceil(imgHeight / contentHeight);
    
    // For each page
    for (let i = 0; i < pageCount; i++) {
      // Add a page (but not for the first one as jsPDF automatically creates the first page)
      if (i > 0) {
        pdf.addPage();
      }
      
      // Calculate which portion of the image to show on this page
      const sourceY = i * (canvas.height / imgHeight) * contentHeight;
      const sourceHeight = Math.min(
        (canvas.height / imgHeight) * contentHeight,
        canvas.height - sourceY
      );
      
      // Calculate destination position and height
      const destY = marginTop; // Start from top margin
      
      // Fix: Use the correct addImage syntax with proper parameters
      // The standard format for jsPDF addImage is:
      // addImage(imageData|canvas, format, x, y, width, height, alias, compression, rotation)
      pdf.addImage(
        imgData,
        'PNG',
        marginLeft,
        destY,
        imgWidth,
        imgHeight,
        undefined,
        'FAST',
        0
      );
      
      // Specify the clipping rectangle to only show the relevant part of the image
      if (i < pageCount - 1) {
        pdf.setPage(i + 1);
        const yPos = (i * contentHeight) - sourceY;
        pdf.internal.write('q');
        pdf.internal.write(`${marginLeft} ${destY} ${imgWidth} ${contentHeight} re`);
        pdf.internal.write('W n');
      }
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
