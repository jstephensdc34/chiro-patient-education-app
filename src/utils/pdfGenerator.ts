import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PatientInfo, ReportItem, ReportSetting } from '@/types';

interface GeneratePDFParams {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  settings: ReportSetting[];
  subcategories: any[];
}

export const generatePDF = async ({
  patient,
  selectedItems,
  notes,
  settings,
  subcategories
}: GeneratePDFParams): Promise<void> => {
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
    // Get clinic info from settings
    const clinicName = settings.find(s => s.name === "clinic_name")?.value || "Chiropractic Clinic";
    const clinicAddress = settings.find(s => s.name === "clinic_address")?.value || "";
    const clinicPhone = settings.find(s => s.name === "clinic_phone")?.value || "";
    const clinicEmail = settings.find(s => s.name === "clinic_email")?.value || "";
    const clinicWebsite = settings.find(s => s.name === "clinic_website")?.value || "";
    const logoUrl = settings.find(s => s.name === "logo_url")?.value || "";
    
    // Category name mapping
    const categoryNames: Record<string, string> = {
      diagnosis: "Spinal Diagnosis",
      extremity: "Extremity Diagnosis",
      treatment: "Treatment Plan",
      homecare: "Home Care",
      exercises: "Therapeutic Exercises"
    };

    const getSubcategoryName = (subcategoryId: string) => {
      const subcategory = subcategories.find(s => s.id === subcategoryId);
      return subcategory ? subcategory.name : "";
    };

    // Build report HTML content
    let reportHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
          ${logoUrl ? `<img src="${logoUrl}" alt="Clinic Logo" style="max-height: 80px; max-width: 200px;" />` : ''}
          <div style="flex-grow: 1; margin-left: 20px;">
            <h1 style="font-size: 20px; margin: 0; color: #333;">${clinicName}</h1>
            <p style="font-size: 14px; margin: 5px 0; color: #666;">
              ${clinicAddress}<br/>
              ${clinicPhone} | ${clinicEmail} | ${clinicWebsite}
            </p>
          </div>
        </div>
        
        <h2 style="font-size: 18px; margin-bottom: 10px;">${patient.name}</h2>
        <p style="font-size: 14px; margin-bottom: 20px; color: #666;">
          ${patient.age ? `Age: ${patient.age} | ` : ''}
          ${patient.gender ? `Gender: ${patient.gender} | ` : ''}
          Date: ${new Date(patient.date).toLocaleDateString()}
        </p>
    `;
    
    // Group items by category
    const itemsByCategory: Record<string, ReportItem[]> = {};
    selectedItems.forEach(item => {
      if (!itemsByCategory[item.categoryId]) {
        itemsByCategory[item.categoryId] = [];
      }
      itemsByCategory[item.categoryId].push(item);
    });

    // Add each category to the report
    Object.keys(itemsByCategory).forEach(categoryId => {
      const categoryItems = itemsByCategory[categoryId];
      
      reportHTML += `
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; color: #223344; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">
            ${categoryNames[categoryId] || categoryId}
          </h3>
      `;
      
      if (categoryId === "diagnosis" || categoryId === "extremity") {
        // Group items by subcategory for diagnosis and extremity
        const itemsBySubcategory: Record<string, ReportItem[]> = {};
        categoryItems.forEach(item => {
          const subcategoryId = item.subcategoryId || "uncategorized";
          if (!itemsBySubcategory[subcategoryId]) {
            itemsBySubcategory[subcategoryId] = [];
          }
          itemsBySubcategory[subcategoryId].push(item);
        });
        
        // Add each subcategory to the report
        Object.keys(itemsBySubcategory).forEach(subcategoryId => {
          const subcategoryItems = itemsBySubcategory[subcategoryId];
          
          reportHTML += `
            <div style="margin-bottom: 10px;">
              <h4 style="font-size: 15px; margin-bottom: 5px; color: #445566;">
                ${subcategoryId !== "uncategorized" ? getSubcategoryName(subcategoryId) : "Other"}
              </h4>
              <ul style="margin: 0; padding-left: 20px;">
          `;
          
          subcategoryItems.forEach(item => {
            reportHTML += `
              <li style="margin-bottom: 5px;">
                <div style="font-weight: bold;">${item.name}</div>
                ${item.description ? `<div style="font-size: 13px; color: #666; margin-left: 10px;">${item.description}</div>` : ''}
              </li>
            `;
          });
          
          reportHTML += `
              </ul>
            </div>
          `;
        });
      } else {
        // For other categories, just list all items
        reportHTML += `<ul style="margin: 0; padding-left: 20px;">`;
        
        categoryItems.forEach(item => {
          reportHTML += `
            <li style="margin-bottom: 5px;">
              <div style="font-weight: bold;">${item.name}</div>
              ${item.description ? `<div style="font-size: 13px; color: #666; margin-left: 10px;">${item.description}</div>` : ''}
            </li>
          `;
        });
        
        reportHTML += `</ul>`;
      }
      
      reportHTML += `</div>`;
    });
    
    // Add additional notes
    if (notes) {
      reportHTML += `
        <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
          <h3 style="font-size: 16px; color: #223344; margin-bottom: 10px;">Additional Notes</h3>
          <p style="white-space: pre-wrap; font-size: 14px;">${notes}</p>
        </div>
      `;
    }
    
    // Close the main div
    reportHTML += `</div>`;
    
    // Set the HTML content
    reportContainer.innerHTML = reportHTML;
    
    // Wait for images to load
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Convert HTML to canvas
    const canvas = await html2canvas(reportContainer, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Add page numbers if the report is multiple pages
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text(`Page ${i} of ${pageCount}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
    
    // Download the PDF with a clean filename
    const cleanPatientName = patient.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${cleanPatientName}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  } finally {
    // Clean up - remove the temporary div
    if (reportContainer && reportContainer.parentNode) {
      reportContainer.parentNode.removeChild(reportContainer);
    }
  }
};
