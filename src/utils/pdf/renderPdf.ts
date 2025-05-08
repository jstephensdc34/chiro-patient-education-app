
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
    
    // Apply Tailwind styles by injecting them into the container
    // Note: This doesn't actually work for Tailwind since it uses classes,
    // but we've included actual CSS styles in the HTML itself
    
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
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    // Handle multi-page content
    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 0;
    
    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    pageCount++;
    
    // Add more pages if needed
    while (heightLeft > 0) {
      position = -pageHeight * pageCount;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      pageCount++;
    }
    
    // Add page numbers
    for (let i = 1; i <= pdf.getNumberOfPages(); i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Page ${i} of ${pdf.getNumberOfPages()}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
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
