
export interface RenderPdfProgress {
  status: 'preparing' | 'rendering' | 'generating' | 'finalizing' | 'complete';
  percentage: number;
}

/**
 * Reports progress during PDF generation
 * @param status Current status of the PDF generation process
 * @param percentage Completion percentage (0-100)
 * @param callback Optional callback function to report progress
 */
export const reportProgress = (
  status: RenderPdfProgress['status'],
  percentage: number,
  callback?: (progress: RenderPdfProgress) => void
): void => {
  if (callback) {
    callback({
      status,
      percentage: Math.min(100, Math.max(0, percentage)) // Ensure between 0-100
    });
  }
};
