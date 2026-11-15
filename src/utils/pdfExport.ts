import { jsPDF } from 'jspdf';
import {
  formatUnit,
  getBudgetCategoryLabel,
  getJournalVerdictLabel,
  getNoteTierShort,
  getOlfactoryFamilyLabel,
  getProjectStatusLabel,
  getSillageLabel,
  OLFACTORY_FAMILIES,
} from '../data/constants';
import type {
  AppCurrency,
  AppLanguage,
  PerfumeProject,
  ProjectEstimateItem,
  PurchaseRecord,
} from '../types/perfume';
import {
  calculateFormulaSummary,
  formatCurrencyDecimal,
  formatCurrencyRub,
  formatGrams,
  formatPercent,
} from './calculations';

// A4 at ~150 DPI canvas (1240 x 1754 px) for crisp Cyrillic Roboto rendering
const PAGE_W = 1240;
const PAGE_H = 1754;
const MARGIN_X = 76;
const MARGIN_TOP = 72;
const MARGIN_BOTTOM = 72;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

interface PageDrawer {
  doc: jsPDF;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  y: number;
  pageNum: number;
}

function createCanvasPage(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  return { canvas, ctx };
}

interface PdfText {
  page: (n: number) => string;
  footerTitle: string;
  mlUnit: string;
  gUnit: string;
  hoursUnit: string;
  updated: string;
  untitled: string;
  ideaHeading: string;
  noIdea: string;
  inspiration: string;
  formulaHeading: string;
  concShort: string;
  noFormula: string;
  tableHeaders: [string, string, string, string, string, string, string];
  olfactoryHeading: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  noNotes: string;
  longevity: string;
  sillage: string;
  accordProfile: string;
  journalHeading: string;
  noJournal: string;
  budgetHeading: string;
  noBudget: string;
  need: string;
  plan: string;
  actual: string;
}

const PDF_TEXT: Record<AppLanguage, PdfText> = {
  ru: {
    page: (n) => `Стр. ${n}`,
    footerTitle: 'Ателье Эссенций — Паспорт парфюмерного проекта',
    mlUnit: 'мл',
    gUnit: 'г',
    hoursUnit: 'ч',
    updated: 'Обновлён',
    untitled: 'Без названия',
    ideaHeading: 'Идея и вдохновение',
    noIdea: 'Описание идеи не заполнено.',
    inspiration: 'Вдохновение',
    formulaHeading: 'Состав формулы',
    concShort: 'конц.',
    noFormula: 'Компоненты формулы ещё не добавлены.',
    tableHeaders: ['Компонент', 'Уровень', 'Развед.', 'Масса', '% формулы', '% конц.', 'Стоим.'],
    olfactoryHeading: 'Ольфакторная карта и пирамида',
    topNotes: 'Верхние ноты',
    heartNotes: 'Ноты сердца',
    baseNotes: 'Базовые ноты',
    noNotes: 'Ноты не указаны',
    longevity: 'Стойкость',
    sillage: 'Шлейф',
    accordProfile: 'Профиль аккордов',
    journalHeading: 'Записи и пробы',
    noJournal: 'Записей по проекту пока нет.',
    budgetHeading: 'Смета проекта',
    noBudget: 'Смета проекта не заполнена.',
    need: 'нужно',
    plan: 'План',
    actual: 'Факт',
  },
  en: {
    page: (n) => `Page ${n}`,
    footerTitle: 'Atelier Essences — Perfume Project Brief',
    mlUnit: 'ml',
    gUnit: 'g',
    hoursUnit: 'h',
    updated: 'Updated',
    untitled: 'Untitled',
    ideaHeading: 'Idea & Inspiration',
    noIdea: 'No idea description yet.',
    inspiration: 'Inspiration',
    formulaHeading: 'Formula Composition',
    concShort: 'conc.',
    noFormula: 'No formula components added yet.',
    tableHeaders: ['Component', 'Tier', 'Dilut.', 'Mass', '% formula', '% conc.', 'Cost'],
    olfactoryHeading: 'Olfactory Map & Pyramid',
    topNotes: 'Top Notes',
    heartNotes: 'Heart Notes',
    baseNotes: 'Base Notes',
    noNotes: 'Not specified',
    longevity: 'Longevity',
    sillage: 'Sillage',
    accordProfile: 'Accord profile',
    journalHeading: 'Trials & Notes',
    noJournal: 'No project notes yet.',
    budgetHeading: 'Project Budget',
    noBudget: 'Project budget is empty.',
    need: 'need',
    plan: 'Plan',
    actual: 'Actual',
  },
  it: {
    page: (n) => `Pag. ${n}`,
    footerTitle: 'Atelier Essences — Scheda progetto profumo',
    mlUnit: 'ml',
    gUnit: 'g',
    hoursUnit: 'h',
    updated: 'Aggiornato',
    untitled: 'Senza titolo',
    ideaHeading: 'Idea e ispirazione',
    noIdea: "Descrizione dell'idea non ancora inserita.",
    inspiration: 'Ispirazione',
    formulaHeading: 'Composizione formula',
    concShort: 'conc.',
    noFormula: 'Nessun componente aggiunto alla formula.',
    tableHeaders: ['Componente', 'Livello', 'Diluiz.', 'Massa', '% formula', '% conc.', 'Costo'],
    olfactoryHeading: 'Mappa olfattiva e piramide',
    topNotes: 'Note di testa',
    heartNotes: 'Note di cuore',
    baseNotes: 'Note di fondo',
    noNotes: 'Non specificate',
    longevity: 'Persistenza',
    sillage: 'Scia',
    accordProfile: 'Profilo accordi',
    journalHeading: 'Prove e appunti',
    noJournal: 'Nessuna nota di progetto.',
    budgetHeading: 'Preventivo progetto',
    noBudget: 'Il preventivo del progetto è vuoto.',
    need: 'servono',
    plan: 'Piano',
    actual: 'Effettivo',
  },
  es: {
    page: (n) => `Pág. ${n}`,
    footerTitle: 'Atelier Essences — Ficha de proyecto de perfume',
    mlUnit: 'ml',
    gUnit: 'g',
    hoursUnit: 'h',
    updated: 'Actualizado',
    untitled: 'Sin título',
    ideaHeading: 'Idea e inspiración',
    noIdea: 'Aún no hay descripción de la idea.',
    inspiration: 'Inspiración',
    formulaHeading: 'Composición de la fórmula',
    concShort: 'conc.',
    noFormula: 'Aún no se han añadido componentes a la fórmula.',
    tableHeaders: ['Componente', 'Nivel', 'Diluc.', 'Masa', '% fórmula', '% conc.', 'Costo'],
    olfactoryHeading: 'Mapa olfativo y pirámide',
    topNotes: 'Notas de salida',
    heartNotes: 'Notas de corazón',
    baseNotes: 'Notas de fondo',
    noNotes: 'No especificadas',
    longevity: 'Duración',
    sillage: 'Estela',
    accordProfile: 'Perfil de acordes',
    journalHeading: 'Pruebas y notas',
    noJournal: 'Aún no hay notas del proyecto.',
    budgetHeading: 'Presupuesto del proyecto',
    noBudget: 'El presupuesto del proyecto está vacío.',
    need: 'necesario',
    plan: 'Plan',
    actual: 'Real',
  },
  de: {
    page: (n) => `Seite ${n}`,
    footerTitle: 'Atelier Essences — Parfüm-Projektbrief',
    mlUnit: 'ml',
    gUnit: 'g',
    hoursUnit: 'Std.',
    updated: 'Aktualisiert',
    untitled: 'Ohne Titel',
    ideaHeading: 'Idee & Inspiration',
    noIdea: 'Noch keine Ideenbeschreibung vorhanden.',
    inspiration: 'Inspiration',
    formulaHeading: 'Formelzusammensetzung',
    concShort: 'Konz.',
    noFormula: 'Noch keine Formelkomponenten hinzugefügt.',
    tableHeaders: ['Komponente', 'Ebene', 'Verd.', 'Masse', '% Formel', '% Konz.', 'Kosten'],
    olfactoryHeading: 'Duftprofil & Pyramide',
    topNotes: 'Kopfnoten',
    heartNotes: 'Herznoten',
    baseNotes: 'Basisnoten',
    noNotes: 'Nicht angegeben',
    longevity: 'Haltbarkeit',
    sillage: 'Sillage',
    accordProfile: 'Akkordprofil',
    journalHeading: 'Proben & Notizen',
    noJournal: 'Noch keine Projektnotizen vorhanden.',
    budgetHeading: 'Projektbudget',
    noBudget: 'Das Projektbudget ist leer.',
    need: 'benötigt',
    plan: 'Plan',
    actual: 'Ist',
  },
};

function flushPage(drawer: PageDrawer, isFirst: boolean, lang: AppLanguage) {
  const t = PDF_TEXT[lang];
  // Footer page number
  drawer.ctx.fillStyle = '#797775';
  drawer.ctx.font = '400 18px Roboto, sans-serif';
  drawer.ctx.textAlign = 'right';
  drawer.ctx.fillText(t.page(drawer.pageNum), PAGE_W - MARGIN_X, PAGE_H - 36);
  drawer.ctx.textAlign = 'left';
  drawer.ctx.fillText(t.footerTitle, MARGIN_X, PAGE_H - 36);

  const imgData = drawer.canvas.toDataURL('image/jpeg', 0.94);
  if (!isFirst) drawer.doc.addPage('a4', 'portrait');
  drawer.doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
}

function ensureSpace(drawer: PageDrawer, neededHeight: number, lang: AppLanguage) {
  if (drawer.y + neededHeight <= PAGE_H - MARGIN_BOTTOM) return;
  flushPage(drawer, drawer.pageNum === 1, lang);
  drawer.pageNum += 1;
  const next = createCanvasPage();
  drawer.canvas = next.canvas;
  drawer.ctx = next.ctx;
  drawer.y = MARGIN_TOP;
}

function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const paragraphs = text.split(/\r?\n/);
  const lines: string[] = [];

  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const test = `${current} ${words[i]}`;
      if (ctx.measureText(test).width <= maxWidth) {
        current = test;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
  }
  return lines;
}

function drawSectionHeading(drawer: PageDrawer, title: string, lang: AppLanguage) {
  ensureSpace(drawer, 64, lang);
  drawer.y += 14;
  drawer.ctx.fillStyle = '#185ABD';
  drawer.ctx.font = '700 26px Roboto, sans-serif';
  drawer.ctx.fillText(title, MARGIN_X, drawer.y);
  drawer.y += 12;
  drawer.ctx.strokeStyle = '#D2D0CE';
  drawer.ctx.lineWidth = 2;
  drawer.ctx.beginPath();
  drawer.ctx.moveTo(MARGIN_X, drawer.y);
  drawer.ctx.lineTo(PAGE_W - MARGIN_X, drawer.y);
  drawer.ctx.stroke();
  drawer.y += 28;
}

function drawParagraph(
  drawer: PageDrawer,
  text: string,
  lang: AppLanguage,
  options?: { font?: string; color?: string; lineHeight?: number; indent?: number }
) {
  const font = options?.font || '400 21px Roboto, sans-serif';
  const color = options?.color || '#252423';
  const lineHeight = options?.lineHeight || 30;
  const indent = options?.indent || 0;

  drawer.ctx.font = font;
  const lines = wrapTextLines(drawer.ctx, text, CONTENT_W - indent);
  for (const line of lines) {
    ensureSpace(drawer, lineHeight + 6, lang);
    drawer.ctx.fillStyle = color;
    drawer.ctx.font = font;
    drawer.ctx.fillText(line, MARGIN_X + indent, drawer.y);
    drawer.y += lineHeight;
  }
}

export function exportProjectToPdf(
  project: PerfumeProject,
  estimates: ProjectEstimateItem[],
  purchases: PurchaseRecord[],
  lang: AppLanguage = 'ru',
  currency: AppCurrency = 'RUB'
) {
  const t = PDF_TEXT[lang];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const first = createCanvasPage();
  const drawer: PageDrawer = {
    doc,
    canvas: first.canvas,
    ctx: first.ctx,
    y: MARGIN_TOP,
    pageNum: 1,
  };

  const summary = calculateFormulaSummary(project.components);
  const projectEstimates = estimates.filter((e) => e.projectId === project.id);

  // Header Banner
  drawer.ctx.fillStyle = '#185ABD';
  drawer.ctx.fillRect(MARGIN_X, drawer.y - 20, 8, 68);

  drawer.ctx.fillStyle = '#605E5C';
  drawer.ctx.font = '500 20px Roboto, sans-serif';
  drawer.ctx.fillText(
    `${project.code}  ·  ${getProjectStatusLabel(project.status, lang)}  ·  ${project.targetConcentration} (${project.targetBottleMl} ${t.mlUnit})  ·  ${t.updated} ${project.updatedAt}`,
    MARGIN_X + 24,
    drawer.y + 4
  );

  drawer.y += 42;
  drawer.ctx.fillStyle = '#181917';
  drawer.ctx.font = '700 38px Roboto, sans-serif';
  const titleLines = wrapTextLines(
    drawer.ctx,
    project.title || t.untitled,
    CONTENT_W - 24
  );
  for (const tl of titleLines) {
    drawer.ctx.fillText(tl, MARGIN_X + 24, drawer.y);
    drawer.y += 44;
  }
  drawer.y += 10;

  // Idea & Inspiration
  drawSectionHeading(drawer, t.ideaHeading, lang);
  drawParagraph(drawer, project.idea || t.noIdea, lang);
  if (project.inspiration) {
    drawer.y += 6;
    drawParagraph(drawer, `${t.inspiration}: ${project.inspiration}`, lang, {
      color: '#575955',
    });
  }

  // Formula Summary & Table
  drawSectionHeading(
    drawer,
    `${t.formulaHeading} (${formatGrams(summary.totalWeightGrams, 2, lang)} · ${t.concShort} ${formatPercent(summary.pureConcentrationPercent, 1)} · ${formatCurrencyDecimal(summary.totalFormulaCost, lang, currency)})`,
    lang
  );

  if (project.components.length === 0) {
    drawParagraph(drawer, t.noFormula, lang, { color: '#605E5C' });
  } else {
    const colWidths = [410, 120, 105, 115, 115, 115, 108];
    const headers = t.tableHeaders;

    const drawTableHeader = () => {
      ensureSpace(drawer, 44, lang);
      drawer.ctx.fillStyle = '#F3F2F1';
      drawer.ctx.fillRect(MARGIN_X, drawer.y - 24, CONTENT_W, 36);
      drawer.ctx.strokeStyle = '#D2D0CE';
      drawer.ctx.lineWidth = 1;
      drawer.ctx.strokeRect(MARGIN_X, drawer.y - 24, CONTENT_W, 36);

      drawer.ctx.fillStyle = '#323130';
      drawer.ctx.font = '700 17px Roboto, sans-serif';
      let x = MARGIN_X + 10;
      headers.forEach((h, i) => {
        if (i >= 2) {
          drawer.ctx.textAlign = 'right';
          drawer.ctx.fillText(h, x + colWidths[i] - 18, drawer.y);
        } else {
          drawer.ctx.textAlign = 'left';
          drawer.ctx.fillText(h, x, drawer.y);
        }
        x += colWidths[i];
      });
      drawer.ctx.textAlign = 'left';
      drawer.y += 30;
    };

    drawTableHeader();

    for (const comp of project.components) {
      const pureMass =
        comp.tier === 'solvent'
          ? 0
          : comp.weightGrams * (Math.min(100, Math.max(0, comp.dilutionPercent)) / 100);
      const pctFormula =
        summary.totalWeightGrams > 0 ? (comp.weightGrams / summary.totalWeightGrams) * 100 : 0;
      const pctConc =
        comp.tier !== 'solvent' && summary.pureAromaticGrams > 0
          ? (pureMass / summary.pureAromaticGrams) * 100
          : 0;
      const lineCost = (comp.weightGrams || 0) * (comp.costPerGram || 0);

      if (drawer.y + 38 > PAGE_H - MARGIN_BOTTOM) {
        ensureSpace(drawer, 40, lang);
        drawTableHeader();
      }

      drawer.ctx.font = '500 18px Roboto, sans-serif';
      drawer.ctx.fillStyle = '#252423';
      let x = MARGIN_X + 10;

      // Truncate component name gently if ultra-long
      let nameDisplay = comp.name;
      while (drawer.ctx.measureText(nameDisplay).width > colWidths[0] - 20 && nameDisplay.length > 4) {
        nameDisplay = `${nameDisplay.slice(0, -2)}…`;
      }

      const cells = [
        nameDisplay,
        getNoteTierShort(comp.tier, lang),
        `${comp.dilutionPercent}%`,
        `${comp.weightGrams.toFixed(2)} ${t.gUnit}`,
        formatPercent(pctFormula, 1),
        comp.tier === 'solvent' ? '—' : formatPercent(pctConc, 1),
        formatCurrencyDecimal(lineCost, lang, currency),
      ];

      cells.forEach((val, i) => {
        if (i >= 2) {
          drawer.ctx.textAlign = 'right';
          drawer.ctx.fillText(val, x + colWidths[i] - 18, drawer.y);
        } else {
          drawer.ctx.textAlign = 'left';
          drawer.ctx.fillText(val, x, drawer.y);
        }
        x += colWidths[i];
      });
      drawer.ctx.textAlign = 'left';

      drawer.y += 12;
      drawer.ctx.strokeStyle = '#EDEBE9';
      drawer.ctx.lineWidth = 1;
      drawer.ctx.beginPath();
      drawer.ctx.moveTo(MARGIN_X, drawer.y);
      drawer.ctx.lineTo(PAGE_W - MARGIN_X, drawer.y);
      drawer.ctx.stroke();
      drawer.y += 24;
    }
  }

  // Olfactory Map
  drawSectionHeading(drawer, t.olfactoryHeading, lang);
  const tiers: { title: string; notes: { name: string; percentage: number; description: string }[] }[] = [
    { title: t.topNotes, notes: project.olfactoryMap.topNotes },
    { title: t.heartNotes, notes: project.olfactoryMap.heartNotes },
    { title: t.baseNotes, notes: project.olfactoryMap.baseNotes },
  ];

  for (const tier of tiers) {
    drawParagraph(drawer, tier.title, lang, { font: '700 21px Roboto, sans-serif', color: '#185ABD' });
    if (tier.notes.length === 0) {
      drawParagraph(drawer, t.noNotes, lang, {
        color: '#605E5C',
        indent: 20,
      });
    } else {
      for (const n of tier.notes) {
        const desc = n.description ? ` — ${n.description}` : '';
        drawParagraph(drawer, `• ${n.name} (${n.percentage}%)${desc}`, lang, { indent: 20 });
      }
    }
    drawer.y += 6;
  }

  const activeProfile = OLFACTORY_FAMILIES.filter(
    (f) => (project.olfactoryMap.profile[f.key] || 0) > 0
  )
    .map((f) => `${getOlfactoryFamilyLabel(f.key, lang)}: ${project.olfactoryMap.profile[f.key]}/10`)
    .join(' · ');

  drawParagraph(
    drawer,
    `${t.longevity}: ${project.olfactoryMap.longevityHours} ${t.hoursUnit} · ${t.sillage}: ${getSillageLabel(project.olfactoryMap.sillageLevel, lang)}`,
    lang,
    { font: '500 20px Roboto, sans-serif' }
  );
  if (activeProfile) {
    drawParagraph(drawer, `${t.accordProfile}: ${activeProfile}`, lang, { color: '#323130' });
  }
  if (project.olfactoryMap.evaporationNotes) {
    drawParagraph(drawer, project.olfactoryMap.evaporationNotes, lang, { color: '#575955' });
  }

  // Journal Entries
  drawSectionHeading(drawer, `${t.journalHeading} (${project.journal.length})`, lang);
  if (project.journal.length === 0) {
    drawParagraph(drawer, t.noJournal, lang, {
      color: '#605E5C',
    });
  } else {
    for (const entry of project.journal) {
      drawParagraph(
        drawer,
        `${entry.date} · ${entry.trialLabel} (${getJournalVerdictLabel(entry.verdict, lang)})`,
        lang,
        { font: '700 20px Roboto, sans-serif' }
      );
      drawParagraph(drawer, entry.content, lang, { indent: 16 });
      drawer.y += 8;
    }
  }

  // Project Estimate
  drawSectionHeading(drawer, `${t.budgetHeading} (${projectEstimates.length})`, lang);
  if (projectEstimates.length === 0) {
    drawParagraph(drawer, t.noBudget, lang, {
      color: '#605E5C',
    });
  } else {
    for (const est of projectEstimates) {
      const matched = purchases.filter(
        (p) =>
          p.estimateItemId === est.id ||
          (p.projectId === project.id && est.ingredientId && p.ingredientId === est.ingredientId)
      );
      const boughtSum = matched.reduce((s, p) => s + p.totalCost, 0);
      const plannedSum = est.requiredQuantity * est.estimatedUnitPrice;
      drawParagraph(
        drawer,
        `• ${est.ingredientName} (${getBudgetCategoryLabel(est.category, lang)}): ${t.need} ${est.requiredQuantity} ${formatUnit(est.unit, lang)} · ${t.plan} ${formatCurrencyRub(plannedSum, lang, currency)} · ${t.actual} ${formatCurrencyRub(boughtSum, lang, currency)}`,
        lang
      );
    }
  }

  flushPage(drawer, drawer.pageNum === 1, lang);

  const safeName = (project.title || 'project').replace(/[^\p{L}\p{N}_-]+/gu, '-');
  doc.save(`${project.code}-${safeName}.pdf`);
}
