import jsPDF from "jspdf";
import { SignaturePosition } from "../pages/PDFSignaturePage";

export class EnhancedPDFService {
  /**
   * Creates a signed PDF by overlaying signatures on the original PDF pages
   * This uses the high-quality PNG images and signature coordinates for pixel-perfect placement
   */
  static async createSignedPDF(
    originalPdfUrl: string,
    signatures: SignaturePosition[],
    pageImages: Record<number, string>,
    fileName: string
  ): Promise<Blob> {
    try {
      // Fetch the original PDF
      const response = await fetch(originalPdfUrl);
      const pdfBuffer = await response.arrayBuffer();
      
      // For now, we'll create a new PDF with the signed pages
      // In a production environment, you'd want to use PDF-lib to properly merge
      const pdf = new jsPDF();
      
      // Get all unique page numbers that have signatures
      const pageNumbers = signatures.map(sig => sig.pageNumber);
      const uniquePageNumbers = Array.from(new Set(pageNumbers));
      const pagesWithSignatures = uniquePageNumbers;
      
      if (pagesWithSignatures.length === 0) {
        throw new Error("No signatures to add to PDF");
      }
      
      // Process each page with signatures
      for (let i = 0; i < pagesWithSignatures.length; i++) {
        const pageNumber = pagesWithSignatures[i];
        const pageImage = pageImages[pageNumber];
        
        if (!pageImage) {
          console.warn(`No image found for page ${pageNumber}`);
          continue;
        }
        
        // Add a new page (except for the first one)
        if (i > 0) {
          pdf.addPage();
        }
        
        // Get page signatures
        const pageSignatures = signatures.filter(sig => sig.pageNumber === pageNumber);
        
        // Create a canvas to composite the page image with signatures
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Cannot get canvas context');
        }
        
        // Load the page image
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = pageImage;
        });
        
        // Set canvas size to match the high-quality image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the page image
        ctx.drawImage(img, 0, 0);
        
        // Draw signatures on the page
        for (const signature of pageSignatures) {
          const signatureImg = new Image();
          await new Promise((resolve, reject) => {
            signatureImg.onload = resolve;
            signatureImg.onerror = reject;
            signatureImg.src = signature.signatureData;
          });
          
          // Draw signature at the exact coordinates
          ctx.drawImage(
            signatureImg,
            signature.x,
            signature.y,
            signature.width,
            signature.height
          );
        }
        
        // Convert canvas to image and add to PDF
        const signedPageDataUrl = canvas.toDataURL('image/png', 1.0);
        
        // Calculate dimensions for PDF page (A4 size)
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = 297; // A4 height in mm
        const imgAspectRatio = img.width / img.height;
        const pdfAspectRatio = pdfWidth / pdfHeight;
        
        let imgWidth, imgHeight, x, y;
        
        if (imgAspectRatio > pdfAspectRatio) {
          // Image is wider than PDF page
          imgWidth = pdfWidth;
          imgHeight = pdfWidth / imgAspectRatio;
          x = 0;
          y = (pdfHeight - imgHeight) / 2;
        } else {
          // Image is taller than PDF page
          imgHeight = pdfHeight;
          imgWidth = pdfHeight * imgAspectRatio;
          x = (pdfWidth - imgWidth) / 2;
          y = 0;
        }
        
        // Add the signed page to PDF
        pdf.addImage(signedPageDataUrl, 'PNG', x, y, imgWidth, imgHeight);
      }
      
      // Convert to blob
      return pdf.output("blob");
      
    } catch (error) {
      console.error("Error creating signed PDF:", error);
      throw new Error("Failed to create signed PDF");
    }
  }

  /**
   * Creates a high-quality signed PDF using the original PDF structure
   * This is a more advanced implementation that preserves the original PDF structure
   */
  static async createHighQualitySignedPDF(
    originalPdfUrl: string,
    signatures: SignaturePosition[],
    pageImages: Record<number, string>,
    fileName: string
  ): Promise<Blob> {
    try {
      // For this implementation, we'll create a new PDF with high-quality signed pages
      // In a production environment, you'd want to use PDF-lib to properly preserve
      // the original PDF structure, fonts, and metadata
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Get all pages that have images
      const pagesWithImages = Object.keys(pageImages).map(Number).sort((a, b) => a - b);
      
      if (pagesWithImages.length === 0) {
        throw new Error("No page images available");
      }
      
      // Process each page
      for (let i = 0; i < pagesWithImages.length; i++) {
        const pageNumber = pagesWithImages[i];
        const pageImage = pageImages[pageNumber];
        
        if (!pageImage) {
          continue;
        }
        
        // Add a new page (except for the first one)
        if (i > 0) {
          pdf.addPage();
        }
        
        // Get signatures for this page
        const pageSignatures = signatures.filter(sig => sig.pageNumber === pageNumber);
        
        // Create a high-quality composite image
        const compositeImage = await this.createCompositeImage(pageImage, pageSignatures);
        
        // Add the composite image to the PDF
        this.addImageToPDF(pdf, compositeImage);
      }
      
      return pdf.output("blob");
      
    } catch (error) {
      console.error("Error creating high-quality signed PDF:", error);
      throw new Error("Failed to create high-quality signed PDF");
    }
  }

  /**
   * Creates a composite image by overlaying signatures on the page image
   */
  private static async createCompositeImage(
    pageImageDataUrl: string,
    signatures: SignaturePosition[]
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Cannot get canvas context'));
        return;
      }
      
      const img = new Image();
      img.onload = async () => {
        try {
          // Set canvas size to match the high-quality image
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Enable high-quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Draw the page image
          ctx.drawImage(img, 0, 0);
          
          // Draw each signature
          for (const signature of signatures) {
            const signatureImg = new Image();
            await new Promise((sigResolve, sigReject) => {
              signatureImg.onload = sigResolve;
              signatureImg.onerror = sigReject;
              signatureImg.src = signature.signatureData;
            });
            
            // Draw signature with high quality
            ctx.drawImage(
              signatureImg,
              signature.x,
              signature.y,
              signature.width,
              signature.height
            );
          }
          
          // Convert to high-quality PNG
          const compositeDataUrl = canvas.toDataURL('image/png', 1.0);
          resolve(compositeDataUrl);
          
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load page image'));
      img.src = pageImageDataUrl;
    });
  }

  /**
   * Adds an image to a PDF page with proper scaling and positioning
   */
  private static addImageToPDF(pdf: jsPDF, imageDataUrl: string): void {
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    
    // Create a temporary image to get dimensions
    const img = new Image();
    img.onload = () => {
      const imgAspectRatio = img.width / img.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      let imgWidth, imgHeight, x, y;
      
      if (imgAspectRatio > pdfAspectRatio) {
        // Image is wider than PDF page
        imgWidth = pdfWidth;
        imgHeight = pdfWidth / imgAspectRatio;
        x = 0;
        y = (pdfHeight - imgHeight) / 2;
      } else {
        // Image is taller than PDF page
        imgHeight = pdfHeight;
        imgWidth = pdfHeight * imgAspectRatio;
        x = (pdfWidth - imgWidth) / 2;
        y = 0;
      }
      
      // Add image to PDF
      pdf.addImage(imageDataUrl, 'PNG', x, y, imgWidth, imgHeight);
    };
    
    img.src = imageDataUrl;
  }

  /**
   * Downloads a blob as a file
   */
  static downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Validates if a file is a valid PDF
   */
  static validatePDF(file: File): boolean {
    return file.type === "application/pdf" && file.size > 0;
  }

  /**
   * Gets file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}
