
export const getEmailStyles = (): string => {
  return `
    <style>
      /* Reset styles for email clients */
      body, table, td, p, a, li, blockquote {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      
      table, td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      
      img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }
      
      /* Email-specific styles */
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      
      .category-section {
        margin-bottom: 25px;
        background-color: #ffffff;
      }
      
      .category-title {
        background-color: #3b82f6;
        color: #ffffff;
        padding: 12px 20px;
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .subcategory-title {
        background-color: #e5e7eb;
        color: #374151;
        padding: 10px 20px;
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        border-left: 4px solid #3b82f6;
      }
      
      .item-container {
        padding: 15px 20px;
        border-bottom: 1px solid #f3f4f6;
      }
      
      .item-name {
        color: #1f2937;
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 8px 0;
      }
      
      .item-description {
        color: #6b7280;
        font-size: 14px;
        line-height: 1.5;
        margin: 0 0 10px 0;
      }
      
      .info-link {
        display: inline-block;
        color: #3b82f6;
        text-decoration: none;
        font-size: 13px;
        padding: 6px 12px;
        background-color: #eff6ff;
        border-radius: 4px;
        border: 1px solid #dbeafe;
      }
      
      .info-link:hover {
        background-color: #dbeafe;
        text-decoration: underline;
      }
      
      /* Mobile responsiveness */
      @media only screen and (max-width: 600px) {
        .email-container {
          width: 100% !important;
        }
        
        .category-title,
        .subcategory-title,
        .item-container {
          padding-left: 15px !important;
          padding-right: 15px !important;
        }
        
        .item-name {
          font-size: 15px !important;
        }
        
        .item-description {
          font-size: 13px !important;
        }
      }
    </style>
  `;
};
