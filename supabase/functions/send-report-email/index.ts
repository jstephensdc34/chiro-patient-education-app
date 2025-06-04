
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailReportRequest {
  patient: {
    name: string;
    age?: number;
    gender?: string;
    date: string;
  };
  selectedItems: Array<{
    id: string;
    name: string;
    description: string;
    infoLink?: string;
    categoryId: string;
    subcategoryId?: string;
  }>;
  notes: string;
  settings: Array<{
    name: string;
    value: string;
  }>;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
  recipientEmail: string;
  subject?: string;
  message?: string;
}

const generateEmailHtml = (data: EmailReportRequest): string => {
  const { patient, selectedItems, notes, settings, subcategories, message } = data;
  
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

  // Build category sections
  const categories = ['diagnosis', 'extremity', 'treatment', 'homecare', 'exercises'];
  let categorySections = '';
  
  categories.forEach(categoryId => {
    const categoryItems = selectedItems.filter(item => item.categoryId === categoryId);
    
    if (categoryItems.length > 0) {
      const categoryName = categoryNames[categoryId] || categoryId;
      
      categorySections += `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="background-color: #3b82f6; color: #ffffff; padding: 12px 20px; font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
              ${categoryName}
            </td>
          </tr>
      `;
      
      // Group items by subcategory
      const itemsBySubcategory: Record<string, any[]> = {};
      const itemsWithoutSubcategory: any[] = [];
      
      categoryItems.forEach(item => {
        if (item.subcategoryId) {
          if (!itemsBySubcategory[item.subcategoryId]) {
            itemsBySubcategory[item.subcategoryId] = [];
          }
          itemsBySubcategory[item.subcategoryId].push(item);
        } else {
          itemsWithoutSubcategory.push(item);
        }
      });
      
      // Render items without subcategory first
      itemsWithoutSubcategory.forEach(item => {
        categorySections += `
          <tr>
            <td style="padding: 15px 20px; border-bottom: 1px solid #f3f4f6;">
              <h4 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">${item.name}</h4>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">${item.description}</p>
              ${item.infoLink ? `
                <a href="${item.infoLink}" target="_blank" style="display: inline-block; color: #3b82f6; text-decoration: none; font-size: 13px; padding: 6px 12px; background-color: #eff6ff; border-radius: 4px; border: 1px solid #dbeafe;">
                  More Information
                </a>
              ` : ''}
            </td>
          </tr>
        `;
      });
      
      // Render items grouped by subcategory
      Object.keys(itemsBySubcategory).forEach(subcategoryId => {
        const subcategoryName = getSubcategoryName(subcategoryId);
        const items = itemsBySubcategory[subcategoryId];
        
        if (subcategoryName) {
          categorySections += `
            <tr>
              <td style="background-color: #e5e7eb; color: #374151; padding: 10px 20px; font-size: 16px; font-weight: 600; border-left: 4px solid #3b82f6;">
                ${subcategoryName}
              </td>
            </tr>
          `;
        }
        
        items.forEach(item => {
          categorySections += `
            <tr>
              <td style="padding: 15px 20px; border-bottom: 1px solid #f3f4f6;">
                <h4 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">${item.name}</h4>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">${item.description}</p>
                ${item.infoLink ? `
                  <a href="${item.infoLink}" target="_blank" style="display: inline-block; color: #3b82f6; text-decoration: none; font-size: 13px; padding: 6px 12px; background-color: #eff6ff; border-radius: 4px; border: 1px solid #dbeafe;">
                    More Information
                  </a>
                ` : ''}
              </td>
            </tr>
          `;
        });
      });
      
      categorySections += `</table>`;
    }
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Medical Report - ${patient.name}</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #ffffff; color: #374151;">
      <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
        <tr>
          <td>
            ${message ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #374151; line-height: 1.6; font-size: 14px; white-space: pre-line;">${message}</p>
                  </td>
                </tr>
              </table>
            ` : ''}
            
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
              <tr>
                <td style="text-align: center; padding: 20px; background-color: #f8f9fa; border-bottom: 3px solid #2563eb;">
                  ${logoUrl ? `<img src="${logoUrl}" alt="Clinic Logo" style="max-height: 80px; margin-bottom: 15px;" />` : ''}
                  <h1 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: bold;">${clinicName}</h1>
                  <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
                    ${clinicAddress}<br/>
                    ${clinicPhone} | ${clinicEmail} | ${clinicWebsite}
                  </p>
                </td>
              </tr>
            </table>
            
            <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0; text-align: center;">${patient.name}</h2>
            <p style="color: #6b7280; text-align: center; margin: 0 0 30px 0; font-size: 16px;">
              ${patient.age ? `Age: ${patient.age} | ` : ''}
              ${patient.gender ? `Gender: ${patient.gender} | ` : ''}
              Date: ${new Date(patient.date).toLocaleDateString()}
            </p>
            
            ${categorySections}
            
            ${notes ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #3b82f6;">
                    <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Additional Notes</h3>
                    <p style="margin: 0; color: #374151; line-height: 1.6; font-size: 14px;">${notes}</p>
                  </td>
                </tr>
              </table>
            ` : ''}
            
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <tr>
                <td style="text-align: center; color: #9ca3af; font-size: 12px;">
                  <p style="margin: 0;">This is a confidential medical report. Please handle accordingly.</p>
                  <p style="margin: 10px 0 0 0;">Generated by ${clinicName} on ${new Date().toLocaleDateString()}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const emailData: EmailReportRequest = await req.json();
    
    // Validate required fields
    if (!emailData.recipientEmail || !emailData.patient.name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Generate HTML content
    const htmlContent = generateEmailHtml(emailData);
    
    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Medical Reports <reports@resend.dev>",
      to: [emailData.recipientEmail],
      subject: emailData.subject || `Medical Report for ${emailData.patient.name}`,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id,
        message: "Email sent successfully" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error: any) {
    console.error("Error in send-report-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send email",
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
