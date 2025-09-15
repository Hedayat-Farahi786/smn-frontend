import jsPDF from "jspdf";
import { SignaturePosition } from "../pages/PDFSignaturePage";

export class PDFService {
  /**
   * Creates a new PDF with signatures overlaid
   * This is a simplified implementation - in production, you'd want to use a proper PDF library
   * like PDF-lib or send this to a backend service for proper PDF manipulation
   */
  static async createSignedPDF(
    originalPdfUrl: string,
    signatures: SignaturePosition[],
    fileName: string
  ): Promise<Blob> {
    try {
      // For this demo, we'll create a simple approach
      // In a real application, you'd want to use PDF-lib or a backend service
      await fetch(originalPdfUrl);

      // Create a new PDF document
      const pdf = new jsPDF();

      // Add a page with a message (this is a simplified version)
      pdf.setFontSize(16);
      pdf.text("Signed PDF Document", 20, 30);
      pdf.text(`Original file: ${fileName}`, 20, 50);
      pdf.text(`Signatures added: ${signatures.length}`, 20, 70);

      // Add signature information
      signatures.forEach((signature, index) => {
        const y = 90 + index * 20;
        pdf.text(
          `Signature ${index + 1} on page ${signature.pageNumber}`,
          20,
          y
        );
      });

      // Convert to blob
      return pdf.output("blob");
    } catch (error) {
      console.error("Error creating signed PDF:", error);
      throw new Error("Failed to create signed PDF");
    }
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
