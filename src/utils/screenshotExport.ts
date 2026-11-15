import { jsPDF } from 'jspdf';
import { domToCanvas } from 'modern-screenshot';

export type ScreenshotOrientation = 'landscape' | 'portrait';

interface SavedStyle {
  el: HTMLElement;
  cssText: string;
}

function getEffectiveBackgroundColor(el: HTMLElement): string {
  const isDark = document.documentElement.classList.contains('dark');
  const computed = window.getComputedStyle(el).backgroundColor;
  if (computed && computed !== 'rgba(0, 0, 0, 0)' && computed !== 'transparent') {
    return computed;
  }
  return isDark ? '#121211' : '#EAE9E7';
}

export async function captureElementScreenshot(targetEl: HTMLElement): Promise<HTMLCanvasElement> {
  const savedStyles: SavedStyle[] = [];
  const prevScrollX = window.scrollX;
  const prevScrollY = window.scrollY;
  const scrollContainers = Array.from(
    targetEl.querySelectorAll<HTMLElement>('[data-capture-scroll="true"]')
  );
  const savedScrollPositions = scrollContainers.map((el) => ({
    el,
    top: el.scrollTop,
    left: el.scrollLeft,
  }));

  const pushStyle = (el: HTMLElement, updates: Partial<CSSStyleDeclaration>) => {
    savedStyles.push({ el, cssText: el.style.cssText });
    Object.assign(el.style, updates);
  };

  try {
    const fixedWidth = Math.max(targetEl.getBoundingClientRect().width, targetEl.scrollWidth, 320);

    if (targetEl.dataset.captureExpand === 'fixed') {
      pushStyle(targetEl, {
        position: 'absolute',
        top: '0',
        left: '0',
        right: 'auto',
        bottom: 'auto',
        width: `${fixedWidth}px`,
        height: 'auto',
        minHeight: '100vh',
        overflow: 'visible',
      });
    } else {
      pushStyle(targetEl, {
        width: `${fixedWidth}px`,
        height: 'auto',
        overflow: 'visible',
      });
    }

    for (const scroller of scrollContainers) {
      pushStyle(scroller, {
        overflow: 'visible',
        overflowX: 'visible',
        overflowY: 'visible',
        height: 'auto',
        maxHeight: 'none',
        flex: 'none',
      });
    }

    // Hide transient UI elements marked with data-capture-ignore="true"
    const ignoredEls = Array.from(
      targetEl.querySelectorAll<HTMLElement>('[data-capture-ignore="true"]')
    );
    for (const ignored of ignoredEls) {
      pushStyle(ignored, { display: 'none' });
    }

    window.scrollTo(0, 0);
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );

    const captureWidth = Math.max(targetEl.scrollWidth, fixedWidth);
    const captureHeight = Math.max(targetEl.scrollHeight, targetEl.getBoundingClientRect().height, 200);
    const maxAllowedPixels = 14000;
    const scale = Math.max(
      1,
      Math.min(2, Math.floor((maxAllowedPixels / Math.max(captureWidth, captureHeight)) * 10) / 10)
    );

    const bgColor = getEffectiveBackgroundColor(targetEl);

    const canvas = await domToCanvas(targetEl, {
      width: captureWidth,
      height: captureHeight,
      scale,
      backgroundColor: bgColor,
      maximumCanvasSize: 16384,
      timeout: 3000,
      font: navigator.onLine ? { preferredFormat: 'woff2' } : false,
      filter: (node) => {
        if (node instanceof HTMLElement && node.dataset.captureIgnore === 'true') {
          return false;
        }
        return true;
      },
    });

    return canvas;
  } finally {
    for (let i = savedStyles.length - 1; i >= 0; i--) {
      const { el, cssText } = savedStyles[i];
      el.style.cssText = cssText;
    }
    for (const item of savedScrollPositions) {
      item.el.scrollTop = item.top;
      item.el.scrollLeft = item.left;
    }
    window.scrollTo(prevScrollX, prevScrollY);
  }
}

export function sliceScreenshotForA4(
  sourceCanvas: HTMLCanvasElement,
  orientation: ScreenshotOrientation
): {
  pages: string[];
  pageWidthMm: number;
  pageHeightMm: number;
  marginMm: number;
  contentWidthMm: number;
  pageCanvasHeightsMm: number[];
} {
  const pageWidthMm = orientation === 'landscape' ? 297 : 210;
  const pageHeightMm = orientation === 'landscape' ? 210 : 297;
  const marginMm = 6;
  const contentWidthMm = pageWidthMm - marginMm * 2;
  const contentHeightMm = pageHeightMm - marginMm * 2;

  const sliceHeightPx = Math.max(
    1,
    Math.floor(sourceCanvas.width * (contentHeightMm / contentWidthMm))
  );

  const pages: string[] = [];
  const pageCanvasHeightsMm: number[] = [];

  let offsetY = 0;
  while (offsetY < sourceCanvas.height) {
    const remainingPx = sourceCanvas.height - offsetY;
    const chunkHeightPx = Math.min(sliceHeightPx, remainingPx);

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = sourceCanvas.width;
    pageCanvas.height = chunkHeightPx;
    const ctx = pageCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(
        sourceCanvas,
        0,
        offsetY,
        sourceCanvas.width,
        chunkHeightPx,
        0,
        0,
        sourceCanvas.width,
        chunkHeightPx
      );
    }

    pages.push(pageCanvas.toDataURL('image/png'));
    pageCanvasHeightsMm.push((chunkHeightPx / sourceCanvas.width) * contentWidthMm);
    offsetY += chunkHeightPx;
  }

  return {
    pages,
    pageWidthMm,
    pageHeightMm,
    marginMm,
    contentWidthMm,
    pageCanvasHeightsMm,
  };
}

export async function exportElementScreenshotToPdf(
  targetEl: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await captureElementScreenshot(targetEl);
  const orientation: ScreenshotOrientation =
    canvas.width >= 760 ? 'landscape' : 'portrait';

  const {
    pages,
    marginMm,
    contentWidthMm,
    pageCanvasHeightsMm,
  } = sliceScreenshotForA4(canvas, orientation);

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  pages.forEach((dataUrl, idx) => {
    if (idx > 0) {
      doc.addPage('a4', orientation);
    }
    doc.addImage(
      dataUrl,
      'PNG',
      marginMm,
      marginMm,
      contentWidthMm,
      pageCanvasHeightsMm[idx],
      undefined,
      'FAST'
    );
  });

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

export async function createPrintScreenshotPages(
  targetEl: HTMLElement
): Promise<{ pages: string[]; orientation: ScreenshotOrientation }> {
  const canvas = await captureElementScreenshot(targetEl);
  const orientation: ScreenshotOrientation =
    canvas.width >= 760 ? 'landscape' : 'portrait';
  const { pages } = sliceScreenshotForA4(canvas, orientation);
  return { pages, orientation };
}
