// PDF Generation utility using html2pdf.js
// This is a client-side solution that converts certificate HTML to PDF

export const generateCertificatePDF = async (
    certificateElement: HTMLElement,
    fileName: string = "certificate.pdf"
): Promise<void> => {
    // We'll use html2pdf.js for client-side PDF generation
    // First, we need to load the library dynamically
    const html2pdf = (await import("html2pdf.js")).default;

    const options = {
        margin: 0,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };

    try {
        await html2pdf().set(options).from(certificateElement).save();
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error("Failed to generate PDF");
    }
};

// Alternative: Generate PDF blob for uploading to server
export const generateCertificatePDFBlob = async (
    certificateElement: HTMLElement
): Promise<Blob> => {
    const html2pdf = (await import("html2pdf.js")).default;

    const options = {
        margin: 0,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };

    try {
        const pdfBlob = await html2pdf()
            .set(options)
            .from(certificateElement)
            .outputPdf("blob");
        return pdfBlob;
    } catch (error) {
        console.error("Error generating PDF blob:", error);
        throw new Error("Failed to generate PDF blob");
    }
};
