
/**
 * Functions related to creating and managing the temporary HTML container for PDF rendering
 */

/**
 * Creates a temporary container to render the HTML for PDF conversion
 * @returns The created HTML div element
 */
export const createTemporaryContainer = (): HTMLDivElement => {
  const reportContainer = document.createElement('div');
  reportContainer.id = 'report-container';
  reportContainer.style.width = '800px';
  reportContainer.style.padding = '20px';
  reportContainer.style.position = 'absolute';
  reportContainer.style.left = '-9999px';
  reportContainer.style.backgroundColor = 'white';
  document.body.appendChild(reportContainer);
  return reportContainer;
};

/**
 * Removes the temporary container from the DOM
 * @param container The container element to remove
 */
export const removeTemporaryContainer = (container: HTMLElement): void => {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
};

/**
 * Waits for all images in the container to load
 * @param container The container element containing images
 * @returns Promise that resolves when all images are loaded
 */
export const loadContainerImages = async (container: HTMLElement): Promise<void> => {
  const imgElements = container.querySelectorAll('img');
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
};
