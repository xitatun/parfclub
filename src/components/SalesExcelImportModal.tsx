import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  FileDown,
  FileSpreadsheet,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getSaleChannelLabel } from '../data/constants';
import { tr } from '../data/i18n';
import type { AppCurrency, AppLanguage, PerfumeProject, SaleRecord } from '../types/perfume';
import { formatCurrencyRub } from '../utils/calculations';
import {
  downloadSalesTemplateExcel,
  parseSalesExcelFile,
  type SalesImportParseResult,
} from '../utils/salesExcel';

interface SalesExcelImportModalProps {
  open: boolean;
  onClose: () => void;
  projects: PerfumeProject[];
  language: AppLanguage;
  currency: AppCurrency;
  existingSalesCount: number;
  onImportSales: (records: SaleRecord[], mode: 'append' | 'replace') => void;
}

export function SalesExcelImportModal({
  open,
  onClose,
  projects,
  language,
  currency,
  existingSalesCount,
  onImportSales,
}: SalesExcelImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'import' | 'guide'>('guide');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<SalesImportParseResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const handleFile = async (file: File) => {
    setIsParsing(true);
    setParseError(null);
    setSelectedFileName(file.name);
    try {
      const result = await parseSalesExcelFile(file, projects, language);
      setParseResult(result);
      setActiveTab('import');
    } catch (err) {
      setParseResult(null);
      setParseError(
        err instanceof Error
          ? err.message
          : tr(language, {
              ru: 'Не удалось прочитать таблицу. Проверьте формат файла (.xlsx, .xls, .csv).',
              en: 'Failed to read spreadsheet file.',
              it: 'Impossibile leggere il foglio di calcolo (.xlsx, .xls, .csv).',
              es: 'No se pudo leer la hoja de cálculo (.xlsx, .xls, .csv).',
              de: 'Tabellendatei konnte nicht gelesen werden (.xlsx, .xls, .csv).',
            })
      );
      setActiveTab('import');
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmImport = () => {
    if (!parseResult || parseResult.records.length === 0) return;
    onImportSales(parseResult.records, importMode);
    setParseResult(null);
    setSelectedFileName(null);
    setParseError(null);
    onClose();
  };

  const totalParsedRevenue = parseResult
    ? parseResult.records.reduce((s, r) => s + r.totalRevenue, 0)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={tr(language, {
        ru: 'Импорт продаж из Excel и инструкция',
        en: 'Excel Sales Import & Guide',
        it: 'Importazione Vendite Excel e Guida',
        es: 'Importación de Ventas Excel y Guía',
        de: 'Excel-Verkaufsimport & Anleitung',
      })}
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-[#D2D0CE] bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E1DFDD] bg-[#FAF9F8] px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#107C41]">
              <FileSpreadsheet className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#181917]">
                {tr(language, {
                  ru: 'Импорт продаж из Excel и инструкция по подготовке таблицы',
                  en: 'Import Sales from Excel & Table Preparation Guide',
                  it: 'Importa Vendite da Excel e Guida alla Tabella',
                  es: 'Importar Ventas desde Excel y Guía de Tabla',
                  de: 'Verkäufe aus Excel importieren & Tabellenanleitung',
                })}
              </h2>
              <p className="mt-0.5 text-xs text-[#605E5C]">
                {tr(language, {
                  ru: 'Загрузите личную таблицу (.xlsx, .xls, .csv) или скачайте готовый шаблон с примером заполнения.',
                  en: 'Upload your own .xlsx, .xls, or .csv spreadsheet, or download a ready-to-fill template.',
                  it: 'Carica il tuo file .xlsx, .xls o .csv oppure scarica un modello pronto da compilare.',
                  es: 'Sube tu propia hoja .xlsx, .xls o .csv, o descarga una plantilla lista para rellenar.',
                  de: 'Laden Sie Ihre .xlsx-, .xls- oder .csv-Tabelle hoch oder nutzen Sie die Vorlage.',
                })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#605E5C] hover:bg-[#EDEBE9] hover:text-[#181917]"
            aria-label={tr(language, {
              ru: 'Закрыть',
              en: 'Close',
              it: 'Chiudi',
              es: 'Cerrar',
              de: 'Schließen',
            })}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sub-navigation + Quick Template Download */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E1DFDD] px-5 py-2.5 bg-white">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'guide'
                  ? 'bg-[var(--theme-accent)] text-white'
                  : 'text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>
                {tr(language, {
                  ru: 'Инструкция по таблице',
                  en: 'How to Prepare Table',
                  it: 'Come Preparare la Tabella',
                  es: 'Cómo Preparar la Tabla',
                  de: 'Tabellenanleitung',
                })}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('import')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'import'
                  ? 'bg-[var(--theme-accent)] text-white'
                  : 'text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917]'
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              <span>
                {tr(language, {
                  ru: 'Загрузка и предпросмотр',
                  en: 'Upload & Preview',
                  it: 'Caricamento e Anteprima',
                  es: 'Carga y Vista Previa',
                  de: 'Hochladen & Vorschau',
                })}
                {parseResult && parseResult.records.length > 0
                  ? ` (${parseResult.records.length})`
                  : ''}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => downloadSalesTemplateExcel(projects, language, currency)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#107C41]/30 bg-[#ECFDF5] px-3 py-1.5 text-xs font-medium text-[#15803D] hover:bg-[#D1FAE5] transition-colors"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>
              {tr(language, {
                ru: 'Скачать шаблон (.xlsx)',
                en: 'Download Template (.xlsx)',
                it: 'Scarica Modello (.xlsx)',
                es: 'Descargar Plantilla (.xlsx)',
                de: 'Vorlage herunterladen (.xlsx)',
              })}
            </span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {activeTab === 'guide' && (
            <>
              {/* Key Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3.5 space-y-1">
                  <div className="text-xs font-semibold text-[#181917]">
                    {tr(language, {
                      ru: '1. Структура и форматы файла',
                      en: '1. Table Structure & Formats',
                      it: '1. Struttura e Formati File',
                      es: '1. Estructura y Formatos',
                      de: '1. Tabellenstruktur & Formate',
                    })}
                  </div>
                  <p className="text-xs leading-relaxed text-[#605E5C]">
                    {tr(language, {
                      ru: 'Названия столбцов должны быть в первой строке первого листа. Поддерживаются .xlsx, .xls и .csv (UTF-8). Лишние ваши столбцы не мешают импорту.',
                      en: 'Place column names in row 1 on the first sheet. Supported formats: .xlsx, .xls, and .csv. Extra personal columns are safely ignored.',
                      it: 'Inserisci i nomi delle colonne nella riga 1 del primo foglio. Formati supportati: .xlsx, .xls e .csv. Eventuali colonne extra vengono ignorate.',
                      es: 'Coloca los nombres de columna en la fila 1 de la primera hoja. Admite .xlsx, .xls y .csv. Las columnas adicionales se ignoran sin problema.',
                      de: 'Spaltennamen in Zeile 1 des ersten Blatts eintragen. Unterstützt .xlsx, .xls und .csv. Zusätzliche eigene Spalten werden ignoriert.',
                    })}
                  </p>
                </div>

                <div className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3.5 space-y-1">
                  <div className="text-xs font-semibold text-[#181917]">
                    {tr(language, {
                      ru: '2. Авторасчёт выручки и себестоимости',
                      en: '2. Auto-Calculation of Price & Cost',
                      it: '2. Calcolo Automatico Prezzo e Costo',
                      es: '2. Cálculo Automático de Precio y Coste',
                      de: '2. Automatische Preis- & Kostenberechnung',
                    })}
                  </div>
                  <p className="text-xs leading-relaxed text-[#605E5C]">
                    {tr(language, {
                      ru: 'Можно заполнить только «Цена за шт.» или только «Выручка» — второе посчитается само. Если указать «Код проекта» и оставить себестоимость пустой, программа возьмёт её из формулы.',
                      en: 'Provide either Unit Price or total Revenue — the missing field is computed automatically. If Cost is empty and Project Code matches, formula cost is used.',
                      it: 'Indica Prezzo unitario o Ricavo totale: il campo mancante viene calcolato in automatico. Se il Costo è vuoto e il Codice progetto corrisponde, usa il costo formula.',
                      es: 'Indica Precio unitario o Ingresos totales: el otro campo se calcula solo. Si el Coste está vacío y coincide el Código de proyecto, se usa el coste de fórmula.',
                      de: 'Stückpreis oder Gesamtumsatz angeben — das fehlende Feld wird berechnet. Bei leerem EK und passendem Projektcode gilt der Rezepturpreis.',
                    })}
                  </p>
                </div>
              </div>

              {/* Column Reference Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#605E5C]">
                  {tr(language, {
                    ru: 'Поддерживаемые столбцы вашей таблицы',
                    en: 'Accepted Columns in Your Spreadsheet',
                    it: 'Colonne Supportate nel Foglio',
                    es: 'Columnas Aceptadas en tu Hoja',
                    de: 'Unterstützte Spalten in Ihrer Tabelle',
                  })}
                </h3>
                <div className="overflow-x-auto rounded-lg border border-[#E1DFDD]">
                  <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E1DFDD] bg-[#FAF9F8] text-[11px] font-semibold text-[#605E5C]">
                        <th className="py-2 px-3">
                          {tr(language, {
                            ru: 'Название столбца',
                            en: 'Column Name',
                            it: 'Nome Colonna',
                            es: 'Nombre de Columna',
                            de: 'Spaltenname',
                          })}
                        </th>
                        <th className="py-2 px-3">
                          {tr(language, {
                            ru: 'Обязательность',
                            en: 'Status',
                            it: 'Stato',
                            es: 'Requisito',
                            de: 'Pflichtfeld',
                          })}
                        </th>
                        <th className="py-2 px-3">
                          {tr(language, {
                            ru: 'Пример',
                            en: 'Example',
                            it: 'Esempio',
                            es: 'Ejemplo',
                            de: 'Beispiel',
                          })}
                        </th>
                        <th className="py-2 px-3">
                          {tr(language, {
                            ru: 'Как обрабатывается',
                            en: 'How It Works',
                            it: 'Come Funziona',
                            es: 'Cómo Funciona',
                            de: 'Verarbeitung',
                          })}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDEBE9] text-[#181917]">
                      <tr>
                        <td className="py-2 px-3 font-medium">
                          {tr(language, {
                            ru: 'Аромат / Позиция / Товар',
                            en: 'Fragrance / Item / Name',
                            it: 'Fragranza / Articolo / Nome',
                            es: 'Fragancia / Artículo / Nombre',
                            de: 'Duft / Artikel / Name',
                          })}
                        </td>
                        <td className="py-2 px-3 font-medium text-[var(--theme-accent)]">
                          {tr(language, {
                            ru: 'Обязательно*',
                            en: 'Required*',
                            it: 'Obbligatorio*',
                            es: 'Obligatorio*',
                            de: 'Erforderlich*',
                          })}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-[#605E5C]">
                          {tr(language, {
                            ru: 'Утренний кедр EDP 30 мл',
                            en: 'Morning Cedar EDP 30 ml',
                            it: 'Cedro del Mattino EDP 30 ml',
                            es: 'Cedro Matinal EDP 30 ml',
                            de: 'Morgenzeder EDP 30 ml',
                          })}
                        </td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: '*Если пусто, подставится название проекта по Коду',
                            en: '*Optional only if Project Code is filled',
                            it: '*Opzionale solo se il Codice progetto è compilato',
                            es: '*Opcional solo si se indica el Código de proyecto',
                            de: '*Nur optional, wenn Projektcode ausgefüllt ist',
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">
                          {tr(language, {
                            ru: 'Цена за шт. / Выручка',
                            en: 'Unit Price / Revenue',
                            it: 'Prezzo unitario / Ricavo',
                            es: 'Precio unitario / Ingresos',
                            de: 'Stückpreis / Umsatz',
                          })}
                        </td>
                        <td className="py-2 px-3 font-medium text-[var(--theme-accent)]">
                          {tr(language, {
                            ru: 'Хотя бы одно',
                            en: 'At least one',
                            it: 'Almeno uno',
                            es: 'Al menos uno',
                            de: 'Mind. eines',
                          })}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-[#605E5C]">
                          4500 / 9000
                        </td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: 'Пробелы, запятые и значки валют (₽, $, €) очищаются автоматически',
                            en: 'Spaces, commas & currency symbols are stripped automatically',
                            it: 'Spazi, virgole e simboli di valuta vengono rimossi in automatico',
                            es: 'Espacios, comas y símbolos de moneda se limpian automáticamente',
                            de: 'Leerzeichen, Kommas und Währungssymbole werden automatisch bereinigt',
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">
                          {tr(language, {
                            ru: 'Дата',
                            en: 'Date',
                            it: 'Data',
                            es: 'Fecha',
                            de: 'Datum',
                          })}
                        </td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: 'Желательно',
                            en: 'Recommended',
                            it: 'Consigliato',
                            es: 'Recomendado',
                            de: 'Empfohlen',
                          })}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-[#605E5C]">
                          12.11.2026 / 2026-11-12
                        </td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: 'Понимает даты Excel, ДД.ММ.ГГГГ и ГГГГ-ММ-ДД',
                            en: 'Supports Excel dates, DD.MM.YYYY, and YYYY-MM-DD',
                            it: 'Supporta date Excel, GG.MM.AAAA e AAAA-MM-GG',
                            es: 'Admite fechas de Excel, DD.MM.AAAA y AAAA-MM-DD',
                            de: 'Erkennt Excel-Daten, TT.MM.JJJJ und JJJJ-MM-TT',
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">
                          {tr(language, {
                            ru: 'Код проекта',
                            en: 'Project Code',
                            it: 'Codice Progetto',
                            es: 'Código de Proyecto',
                            de: 'Projektcode',
                          })}
                        </td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: 'Необязательно',
                            en: 'Optional',
                            it: 'Facoltativo',
                            es: 'Opcional',
                            de: 'Optional',
                          })}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-[#605E5C]">
                          {projects[0]?.code || 'AE-01'}
                        </td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: 'Связывает продажу с проектом и считает себестоимость',
                            en: 'Links row to studio project & calculates formula cost',
                            it: 'Collega la riga al progetto e calcola il costo formula',
                            es: 'Vincula la fila al proyecto y calcula el coste de fórmula',
                            de: 'Verknüpft Zeile mit Projekt und berechnet Rezepturkosten',
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">
                          {tr(language, {
                            ru: 'Объём (мл) / Кол-во (шт)',
                            en: 'Bottle (ml) / Qty (pcs)',
                            it: 'Flacone (ml) / Q.tà (pz)',
                            es: 'Volumen (ml) / Cant. (uds)',
                            de: 'Flakon (ml) / Menge (Stk)',
                          })}
                        </td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: 'Необязательно',
                            en: 'Optional',
                            it: 'Facoltativo',
                            es: 'Opcional',
                            de: 'Optional',
                          })}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-[#605E5C]">30 / 2</td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: 'По умолчанию: 30 мл (или объём проекта) и 1 шт.',
                            en: 'Defaults: 30 ml (or project ml) and 1 pc',
                            it: 'Predefinito: 30 ml (o ml del progetto) e 1 pz',
                            es: 'Por defecto: 30 ml (o ml del proyecto) y 1 ud.',
                            de: 'Standard: 30 ml (oder Projekt-ml) und 1 Stk.',
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">
                          {tr(language, {
                            ru: 'Канал продаж',
                            en: 'Sales Channel',
                            it: 'Canale di Vendita',
                            es: 'Canal de Ventas',
                            de: 'Vertriebskanal',
                          })}
                        </td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: 'Необязательно',
                            en: 'Optional',
                            it: 'Facoltativo',
                            es: 'Opcional',
                            de: 'Optional',
                          })}
                        </td>
                        <td className="py-2 px-3 text-[11px] text-[#605E5C]">
                          {tr(language, {
                            ru: 'Прямой, Бутик, Ozon/WB, Ярмарка, Подарок',
                            en: 'Direct, Boutique, Online, Fair, Gift',
                            it: 'Diretto, Boutique, Online, Fiera, Omaggio',
                            es: 'Directo, Boutique, Online, Feria, Regalo',
                            de: 'Direkt, Boutique, Online, Messe, Geschenk',
                          })}
                        </td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: 'Распознаётся по ключевым словам (Ozon, WB, шоурум, ярмарка, промо)',
                            en: 'Auto-recognized by keywords (e.g. Showroom, Online, Gift)',
                            it: 'Riconosciuto da parole chiave (es. Boutique, Online, Omaggio)',
                            es: 'Reconocido por palabras clave (ej. Boutique, Online, Regalo)',
                            de: 'Automatisch nach Schlüsselwörtern erkannt (z. B. Boutique, Online)',
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">
                          {tr(language, {
                            ru: 'Себест. / Клиент / Комментарий',
                            en: 'Unit Cost / Customer / Notes',
                            it: 'Costo / Cliente / Note',
                            es: 'Coste / Cliente / Notas',
                            de: 'EK / Kunde / Notizen',
                          })}
                        </td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: 'Необязательно',
                            en: 'Optional',
                            it: 'Facoltativo',
                            es: 'Opcional',
                            de: 'Optional',
                          })}
                        </td>
                        <td className="py-2 px-3 text-[11px] text-[#605E5C]">
                          {tr(language, {
                            ru: '950 / Заказ №104',
                            en: '950 / Order #104',
                            it: '950 / Ordine n. 104',
                            es: '950 / Pedido #104',
                            de: '950 / Bestellung #104',
                          })}
                        </td>
                        <td className="py-2 px-3 text-[#605E5C]">
                          {tr(language, {
                            ru: 'Ручная себестоимость за 1 шт. перекрывает авторасчёт по проекту',
                            en: 'Manual unit cost overrides automatic project estimate',
                            it: 'Il costo unitario manuale sostituisce il calcolo automatico',
                            es: 'El coste unitario manual reemplaza el cálculo automático',
                            de: 'Manueller Stückkostenpreis überschreibt die Projektberechnung',
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Studio Project Codes Cheat Sheet */}
              {projects.length > 0 && (
                <div className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-4 space-y-2.5">
                  <div className="text-xs font-semibold text-[#181917]">
                    {tr(language, {
                      ru: 'Коды ваших текущих проектов (для столбца «Код проекта»)',
                      en: 'Your Studio Project Codes (use in «Project Code» column)',
                      it: 'Codici dei tuoi progetti (da usare nella colonna «Codice Progetto»)',
                      es: 'Códigos de tus proyectos (para la columna «Código de Proyecto»)',
                      de: 'Ihre Projektcodes (für die Spalte «Projektcode»)',
                    })}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-2 rounded border border-[#E1DFDD] bg-white px-3 py-1.5 text-xs"
                      >
                        <span className="truncate text-[#181917]">{p.title}</span>
                        <span className="font-mono font-semibold text-[var(--theme-accent)] shrink-0">
                          {p.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('import')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>
                    {tr(language, {
                      ru: 'Перейти к загрузке файла',
                      en: 'Proceed to File Upload',
                      it: 'Vai al Caricamento File',
                      es: 'Ir a Subir Archivo',
                      de: 'Zum Datei-Upload',
                    })}
                  </span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'import' && (
            <>
              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFile(file);
                }}
                className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                  dragOver
                    ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]'
                    : 'border-[#D2D0CE] bg-[#FAF9F8]'
                }`}
              >
                <FileSpreadsheet className="mx-auto h-8 w-8 text-[#107C41]" />
                <div className="mt-2 text-sm font-semibold text-[#181917]">
                  {isParsing
                    ? tr(language, {
                        ru: 'Чтение таблицы...',
                        en: 'Reading spreadsheet...',
                        it: 'Lettura del foglio...',
                        es: 'Leyendo hoja de cálculo...',
                        de: 'Tabelle wird gelesen...',
                      })
                    : selectedFileName
                      ? selectedFileName
                      : tr(language, {
                          ru: 'Перетащите файл Excel или CSV сюда',
                          en: 'Drop your Excel or CSV file here',
                          it: 'Trascina qui il tuo file Excel o CSV',
                          es: 'Arrastra aquí tu archivo Excel o CSV',
                          de: 'Excel- oder CSV-Datei hier ablegen',
                        })}
                </div>
                <p className="mt-1 text-xs text-[#605E5C]">
                  {tr(language, {
                    ru: 'Поддерживаются таблицы .xlsx, .xls и .csv, подготовленные по инструкции.',
                    en: 'Supports .xlsx, .xls, and .csv tables prepared according to the guide.',
                    it: 'Supporta file .xlsx, .xls e .csv preparati secondo la guida.',
                    es: 'Admite tablas .xlsx, .xls y .csv preparadas según la guía.',
                    de: 'Unterstützt Tabellen im Format .xlsx, .xls und .csv gemäß Anleitung.',
                  })}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>
                      {tr(language, {
                        ru: 'Выбрать файл',
                        en: 'Choose File',
                        it: 'Scegli File',
                        es: 'Elegir Archivo',
                        de: 'Datei auswählen',
                      })}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('guide')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1DFDD] bg-white px-3.5 py-2 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1]"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-[#605E5C]" />
                    <span>
                      {tr(language, {
                        ru: 'Открыть инструкцию',
                        en: 'View Guide',
                        it: 'Apri Guida',
                        es: 'Ver Guía',
                        de: 'Anleitung öffnen',
                      })}
                    </span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFile(file);
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              {parseError && (
                <div className="flex items-start gap-2.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-xs text-[#B91C1C]">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{parseError}</span>
                </div>
              )}

              {parseResult && (
                <div className="space-y-4">
                  {/* Summary Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3">
                      <div className="text-[11px] text-[#605E5C]">
                        {tr(language, {
                          ru: 'Готово к импорту',
                          en: 'Ready to Import',
                          it: 'Pronte per l’importazione',
                          es: 'Listo para importar',
                          de: 'Importbereit',
                        })}
                      </div>
                      <div className="mt-0.5 font-mono text-lg font-bold text-[#15803D] tabular-nums">
                        {parseResult.records.length}{' '}
                        {tr(language, {
                          ru: 'записей',
                          en: 'rows',
                          it: 'righe',
                          es: 'filas',
                          de: 'Zeilen',
                        })}
                      </div>
                      <div className="text-[11px] text-[#797775]">
                        {tr(language, {
                          ru: 'Лист',
                          en: 'Sheet',
                          it: 'Foglio',
                          es: 'Hoja',
                          de: 'Blatt',
                        })}
                        : {parseResult.sheetName}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3">
                      <div className="text-[11px] text-[#605E5C]">
                        {tr(language, {
                          ru: 'Сумма выручки',
                          en: 'Parsed Revenue',
                          it: 'Ricavo rilevato',
                          es: 'Ingresos leídos',
                          de: 'Erfasster Umsatz',
                        })}
                      </div>
                      <div className="mt-0.5 font-mono text-lg font-bold text-[#181917] tabular-nums">
                        {formatCurrencyRub(totalParsedRevenue, language, currency)}
                      </div>
                      <div className="text-[11px] text-[#797775] tabular-nums">
                        {tr(language, {
                          ru: 'Связано с проектами',
                          en: 'Matched to projects',
                          it: 'Collegati ai progetti',
                          es: 'Vinculados a proyectos',
                          de: 'Mit Projekten verknüpft',
                        })}
                        : {parseResult.matchedProjectCount}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3">
                      <div className="text-[11px] text-[#605E5C]">
                        {tr(language, {
                          ru: 'Пропущено строк',
                          en: 'Skipped Rows',
                          it: 'Righe ignorate',
                          es: 'Filas omitidas',
                          de: 'Übersprungene Zeilen',
                        })}
                      </div>
                      <div
                        className={`mt-0.5 font-mono text-lg font-bold tabular-nums ${
                          parseResult.skippedRows.length > 0 ? 'text-[#B45309]' : 'text-[#181917]'
                        }`}
                      >
                        {parseResult.skippedRows.length}
                      </div>
                      <div className="text-[11px] text-[#797775]">
                        {parseResult.skippedRows.length === 0
                          ? tr(language, {
                              ru: 'Все строки распознаны',
                              en: 'All rows recognized',
                              it: 'Tutte le righe riconosciute',
                              es: 'Todas las filas reconocidas',
                              de: 'Alle Zeilen erkannt',
                            })
                          : tr(language, {
                              ru: 'Причины указаны ниже',
                              en: 'See details below',
                              it: 'Vedi dettagli sotto',
                              es: 'Ver detalles abajo',
                              de: 'Details siehe unten',
                            })}
                      </div>
                    </div>
                  </div>

                  {/* Import Mode */}
                  <div className="rounded-lg border border-[#E1DFDD] bg-white p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-xs font-semibold text-[#181917]">
                      {tr(language, {
                        ru: 'Режим импорта:',
                        en: 'Import Mode:',
                        it: 'Modalità importazione:',
                        es: 'Modo de importación:',
                        de: 'Importmodus:',
                      })}
                    </span>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-[#181917]">
                        <input
                          type="radio"
                          name="sales-import-mode"
                          checked={importMode === 'append'}
                          onChange={() => setImportMode('append')}
                          className="accent-[var(--theme-accent)]"
                        />
                        <span>
                          {tr(language, {
                            ru: `Добавить к текущим (${existingSalesCount})`,
                            en: `Append to existing (${existingSalesCount})`,
                            it: `Aggiungi agli esistenti (${existingSalesCount})`,
                            es: `Añadir a los existentes (${existingSalesCount})`,
                            de: `Zu bestehenden hinzufügen (${existingSalesCount})`,
                          })}
                        </span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer text-[#181917]">
                        <input
                          type="radio"
                          name="sales-import-mode"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="accent-[var(--theme-accent)]"
                        />
                        <span>
                          {tr(language, {
                            ru: 'Заменить текущий журнал',
                            en: 'Replace existing sales journal',
                            it: 'Sostituisci registro vendite esistente',
                            es: 'Reemplazar registro de ventas actual',
                            de: 'Bestehendes Verkaufsjournal ersetzen',
                          })}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Skipped Warnings */}
                  {parseResult.skippedRows.length > 0 && (
                    <div className="rounded-lg border border-[#FCD34D] bg-[#FFFBEB] p-3.5 text-xs text-[#92400E] space-y-1">
                      <div className="font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>
                          {tr(language, {
                            ru: 'Некоторые строки не были импортированы:',
                            en: 'Some rows could not be imported:',
                            it: 'Alcune righe non sono state importate:',
                            es: 'Algunas filas no se pudieron importar:',
                            de: 'Einige Zeilen konnten nicht importiert werden:',
                          })}
                        </span>
                      </div>
                      <ul className="list-disc pl-5 space-y-0.5">
                        {parseResult.skippedRows.slice(0, 6).map((sk) => (
                          <li key={sk.rowNumber}>
                            {tr(language, {
                              ru: `Строка ${sk.rowNumber}`,
                              en: `Row ${sk.rowNumber}`,
                              it: `Riga ${sk.rowNumber}`,
                              es: `Fila ${sk.rowNumber}`,
                              de: `Zeile ${sk.rowNumber}`,
                            })}
                            : {sk.reason}
                          </li>
                        ))}
                        {parseResult.skippedRows.length > 6 && (
                          <li>
                            {tr(language, {
                              ru: `...и ещё ${parseResult.skippedRows.length - 6}`,
                              en: `...and ${parseResult.skippedRows.length - 6} more`,
                              it: `...e altre ${parseResult.skippedRows.length - 6}`,
                              es: `...y ${parseResult.skippedRows.length - 6} más`,
                              de: `...und ${parseResult.skippedRows.length - 6} weitere`,
                            })}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Preview Table */}
                  {parseResult.records.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-[#E1DFDD]">
                      <table className="w-full min-w-[620px] border-collapse text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#E1DFDD] bg-[#FAF9F8] text-[11px] font-semibold text-[#605E5C]">
                            <th className="py-2 px-3">
                              {tr(language, {
                                ru: 'Дата',
                                en: 'Date',
                                it: 'Data',
                                es: 'Fecha',
                                de: 'Datum',
                              })}
                            </th>
                            <th className="py-2 px-3">
                              {tr(language, {
                                ru: 'Аромат',
                                en: 'Fragrance',
                                it: 'Fragranza',
                                es: 'Fragancia',
                                de: 'Duft',
                              })}
                            </th>
                            <th className="py-2 px-3">
                              {tr(language, {
                                ru: 'Канал',
                                en: 'Channel',
                                it: 'Canale',
                                es: 'Canal',
                                de: 'Kanal',
                              })}
                            </th>
                            <th className="py-2 px-3 text-right">
                              {tr(language, {
                                ru: 'Объём',
                                en: 'Format',
                                it: 'Formato',
                                es: 'Formato',
                                de: 'Größe',
                              })}
                            </th>
                            <th className="py-2 px-3 text-right">
                              {tr(language, {
                                ru: 'Кол-во',
                                en: 'Qty',
                                it: 'Q.tà',
                                es: 'Cant.',
                                de: 'Menge',
                              })}
                            </th>
                            <th className="py-2 px-3 text-right">
                              {tr(language, {
                                ru: 'Выручка',
                                en: 'Revenue',
                                it: 'Ricavo',
                                es: 'Ingresos',
                                de: 'Umsatz',
                              })}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EDEBE9]">
                          {parseResult.records.slice(0, 8).map((rec) => (
                            <tr key={rec.id} className="hover:bg-[#FAF9F8]">
                              <td className="py-2 px-3 font-mono tabular-nums text-[#605E5C]">
                                {rec.date}
                              </td>
                              <td className="py-2 px-3 font-medium text-[#181917]">
                                {rec.fragranceName}
                              </td>
                              <td className="py-2 px-3 text-[#605E5C]">
                                {getSaleChannelLabel(rec.channel, language)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono tabular-nums text-[#605E5C]">
                                {rec.bottleMl}{' '}
                                {tr(language, {
                                  ru: 'мл',
                                  en: 'ml',
                                  it: 'ml',
                                  es: 'ml',
                                  de: 'ml',
                                })}
                              </td>
                              <td className="py-2 px-3 text-right font-mono tabular-nums text-[#181917]">
                                {rec.quantity}{' '}
                                {tr(language, {
                                  ru: 'шт',
                                  en: 'pcs',
                                  it: 'pz',
                                  es: 'uds',
                                  de: 'Stk',
                                })}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-semibold tabular-nums text-[#181917]">
                                {formatCurrencyRub(rec.totalRevenue, language, currency)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {parseResult.records.length > 8 && (
                        <div className="border-t border-[#EDEBE9] bg-[#FAF9F8] px-3 py-2 text-[11px] text-[#605E5C]">
                          {tr(language, {
                            ru: `Показаны первые 8 из ${parseResult.records.length} записей`,
                            en: `Showing first 8 of ${parseResult.records.length} rows`,
                            it: `Mostrate le prime 8 di ${parseResult.records.length} righe`,
                            es: `Mostrando las primeras 8 de ${parseResult.records.length} filas`,
                            de: `Erste 8 von ${parseResult.records.length} Zeilen angezeigt`,
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E1DFDD] bg-[#FAF9F8] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E1DFDD] bg-white px-4 py-2 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1]"
          >
            {tr(language, {
              ru: 'Закрыть',
              en: 'Close',
              it: 'Chiudi',
              es: 'Cerrar',
              de: 'Schließen',
            })}
          </button>

          {parseResult && parseResult.records.length > 0 && (
            <button
              type="button"
              onClick={handleConfirmImport}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>
                {tr(language, {
                  ru: `Импортировать продажи (${parseResult.records.length})`,
                  en: `Import Sales (${parseResult.records.length})`,
                  it: `Importa Vendite (${parseResult.records.length})`,
                  es: `Importar Ventas (${parseResult.records.length})`,
                  de: `Verkäufe importieren (${parseResult.records.length})`,
                })}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
