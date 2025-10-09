/**
 * Utility functions for coordinate conversion between screen and image coordinates
 * accounting for object-fit: contain scaling and centering
 */

export interface ImageDisplayInfo {
  displayWidth: number;
  displayHeight: number;
  offsetX: number;
  offsetY: number;
  rect: DOMRect;
}

/**
 * Calculate the actual displayed image dimensions and position within a container
 * when using object-fit: contain
 */
export function getImageDisplayInfo(
  imageElement: HTMLImageElement,
  imageDimensions: { width: number; height: number }
): ImageDisplayInfo | null {
  if (!imageElement) return null;

  const rect = imageElement.getBoundingClientRect();

  // Calculate the actual displayed size (considering object-fit: contain)
  const imgAspectRatio = imageDimensions.width / imageDimensions.height;
  const containerAspectRatio = rect.width / rect.height;

  let displayWidth: number;
  let displayHeight: number;
  let offsetX: number;
  let offsetY: number;

  if (imgAspectRatio > containerAspectRatio) {
    // Image is wider than container - fit by width
    displayWidth = rect.width;
    displayHeight = rect.width / imgAspectRatio;
    offsetX = 0;
    offsetY = (rect.height - displayHeight) / 2;
  } else {
    // Image is taller than container - fit by height
    displayHeight = rect.height;
    displayWidth = rect.height * imgAspectRatio;
    offsetX = (rect.width - displayWidth) / 2;
    offsetY = 0;
  }

  return {
    displayWidth,
    displayHeight,
    offsetX,
    offsetY,
    rect
  };
}

/**
 * Convert screen coordinates to image coordinates
 */
export function screenToImageCoords(
  screenX: number,
  screenY: number,
  imageElement: HTMLImageElement,
  imageDimensions: { width: number; height: number }
): { x: number; y: number } {
  const displayInfo = getImageDisplayInfo(imageElement, imageDimensions);
  if (!displayInfo) return { x: 0, y: 0 };

  const { displayWidth, displayHeight, offsetX, offsetY, rect } = displayInfo;

  // Convert to relative coordinates within the displayed image
  const relativeX = (screenX - rect.left - offsetX) / displayWidth;
  const relativeY = (screenY - rect.top - offsetY) / displayHeight;

  // Convert to actual image coordinates
  const imageX = Math.max(0, Math.min(imageDimensions.width, relativeX * imageDimensions.width));
  const imageY = Math.max(0, Math.min(imageDimensions.height, relativeY * imageDimensions.height));

  return { x: imageX, y: imageY };
}

/**
 * Convert image coordinates to screen coordinates
 */
export function imageToScreenCoords(
  imageX: number,
  imageY: number,
  imageElement: HTMLImageElement,
  imageDimensions: { width: number; height: number }
): { x: number; y: number } {
  const displayInfo = getImageDisplayInfo(imageElement, imageDimensions);
  if (!displayInfo) return { x: 0, y: 0 };

  const { displayWidth, displayHeight, offsetX, offsetY, rect } = displayInfo;

  // Convert to relative coordinates
  const relativeX = imageX / imageDimensions.width;
  const relativeY = imageY / imageDimensions.height;

  // Convert to screen coordinates
  const screenX = rect.left + offsetX + (relativeX * displayWidth);
  const screenY = rect.top + offsetY + (relativeY * displayHeight);

  return { x: screenX, y: screenY };
}

/**
 * Convert image dimensions to screen dimensions
 */
export function imageToScreenDimensions(
  imageWidth: number,
  imageHeight: number,
  imageElement: HTMLImageElement,
  imageDimensions: { width: number; height: number }
): { width: number; height: number } {
  const displayInfo = getImageDisplayInfo(imageElement, imageDimensions);
  if (!displayInfo) return { width: 0, height: 0 };

  const { displayWidth, displayHeight } = displayInfo;

  const relativeWidth = imageWidth / imageDimensions.width;
  const relativeHeight = imageHeight / imageDimensions.height;

  return {
    width: relativeWidth * displayWidth,
    height: relativeHeight * displayHeight
  };
}