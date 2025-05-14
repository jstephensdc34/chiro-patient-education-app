
export const createAdditionalNotes = (notes: string): string => {
  return `
    <div class="notes-section">
      <h3 class="notes-title">Additional Notes</h3>
      <p class="notes-content">${notes}</p>
    </div>
  `;
};
