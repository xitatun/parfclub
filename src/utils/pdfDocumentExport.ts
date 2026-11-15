import { jsPDF } from 'jspdf';
import { domToCanvas } from 'modern-screenshot';

export async function exportPdfHostSheets(
  hostEl: HTMLElement,
  filename: string
): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore font loading timeout
    }
  }

  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );

  const sheetEls = Array.from(
    hostEl.querySelectorAll<HTMLElement>('[data-pdf-sheet="true"]')
  );

  if (sheetEls.length === 0) {
    throw new Error('No PDF sheets rendered');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidthMm = 210;
  const pageHeightMm = 297;

  for (let i = 0; i < sheetEls.length; i++) {
    const sheet = sheetEls[i];
    const width = sheet.offsetWidth || 794;
    const height = sheet.offsetHeight || 1123;

    const canvas = await domToCanvas(sheet, {
      width,
      height,
      scale: 2,
      backgroundColor: '#FFFFFF',
      maximumCanvasSize: 16384,
      timeout: 5000,
      font: navigator.onLine ? { preferredFormat: 'woff2' } : false,
    });

    if (i > 0) {
      doc.addPage('a4', 'portrait');
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.94);
    doc.addImage(imgData, 'JPEG', 0, 0, pageWidthMm, pageHeightMm, undefined, 'FAST');
  }

  const finalName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(finalName);
}
