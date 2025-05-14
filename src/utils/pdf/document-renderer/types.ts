
export interface DocumentContent {
  header: string;
  body: string[];
  footer: string;
  clinicInfo: {
    name: string;
    website: string;
    phone: string;
    email: string;
    logoUrl: string;
  };
  patientName: string;
  options: PdfRenderingOptions;
}

export interface PdfRenderingOptions {
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  pageSize: {
    width: number;
    height: number;
  };
}
