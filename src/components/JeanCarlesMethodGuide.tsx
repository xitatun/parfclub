import {
  Award,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  Layers,
  Library,
  Lightbulb,
  Scale,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { tr } from '../data/i18n';
import type { AppLanguage } from '../types/perfume';
import type { StarterFormulaSpec } from '../data/starterFormulasData';

interface JeanCarlesMethodGuideProps {
  language: AppLanguage;
  jeanCarlesFormulas?: StarterFormulaSpec[];
  onSelectFormulaInCatalog?: (formulaId: string) => void;
}

type GuideSection = 'overview' | 'training' | 'pyramid' | 'accords' | 'books';

interface AccordSeriesRow {
  materialA: number;
  materialB: number;
  highlight?: boolean;
  label?: Record<AppLanguage, string>;
}

const ACCORD_SERIES_2: AccordSeriesRow[] = [
  { materialA: 9, materialB: 1 },
  { materialA: 8, materialB: 2, highlight: true, label: { ru: 'Доминирует A', en: 'A dominates', it: 'Domina A', es: 'Domina A', de: 'A dominiert' } },
  { materialA: 7, materialB: 3 },
  { materialA: 6, materialB: 4 },
  { materialA: 5, materialB: 5, highlight: true, label: { ru: 'Равный баланс', en: 'Equal balance', it: 'Equilibrio 50/50', es: 'Equilibrio 50/50', de: 'Gleichgewicht 50/50' } },
  { materialA: 4, materialB: 6 },
  { materialA: 3, materialB: 7 },
  { materialA: 2, materialB: 8, highlight: true, label: { ru: 'Доминирует B', en: 'B dominates', it: 'Domina B', es: 'Domina B', de: 'B dominiert' } },
  { materialA: 1, materialB: 9 },
];

export function JeanCarlesMethodGuide({
  language,
  jeanCarlesFormulas: _jeanCarlesFormulas,
  onSelectFormulaInCatalog: _onSelectFormulaInCatalog,
}: JeanCarlesMethodGuideProps) {
  const [activeTab, setActiveTab] = useState<GuideSection>('overview');

  const navItems: { id: GuideSection; label: string; icon: typeof BookOpen }[] = [
    {
      id: 'overview',
      icon: Compass,
      label: tr(language, {
        ru: 'Философия Жана Карля',
        en: 'Jean Carles Philosophy',
        it: 'Filosofia di Jean Carles',
        es: 'Filosofía de Jean Carles',
        de: 'Jean-Carles-Philosophie',
      }),
    },
    {
      id: 'training',
      icon: GraduationCap,
      label: tr(language, {
        ru: '1. Тренировка носа',
        en: '1. Olfactory Study',
        it: '1. Studio Olfattivo',
        es: '1. Estudio Olfativo',
        de: '1. Riechtraining',
      }),
    },
    {
      id: 'pyramid',
      icon: Layers,
      label: tr(language, {
        ru: '2. Таблица летучести (15:30:55)',
        en: '2. Volatility Chart (15:30:55)',
        it: '2. Tabella di Volatilità (15:30:55)',
        es: '2. Tabla de Volatilidad (15:30:55)',
        de: '2. Flüchtigkeitstabelle (15:30:55)',
      }),
    },
    {
      id: 'accords',
      icon: FlaskConical,
      label: tr(language, {
        ru: '3. Метод таблиц аккордов',
        en: '3. Accord Series Charts',
        it: '3. Tabelle degli Accordi',
        es: '3. Tablas de Acordes',
        de: '3. Akkord-Serientabellen',
      }),
    },
    {
      id: 'books',
      icon: Library,
      label: tr(language, {
        ru: 'Литература для новичков',
        en: 'Essential Literature',
        it: 'Letteratura Essenziale',
        es: 'Literatura Esencial',
        de: 'Fachliteratur für Einsteiger',
      }),
    },
  ];

  const trainingStages = [
    {
      step: '01',
      title: tr(language, {
        ru: 'Этап 1: Метод контрастов (9 базовых эталонов)',
        en: 'Stage 1: Contrast Method (9 Reference Materials)',
        it: 'Fase 1: Metodo dei Contrasti (9 Materiali Base)',
        es: 'Etapa 1: Método de Contrastes (9 Materiales Base)',
        de: 'Stufe 1: Kontrastmethode (9 Referenzrohstoffe)',
      }),
      desc: tr(language, {
        ru: 'Начните с максимально непохожих друг на друга веществ в 10% разведении в спирте или DPG: Лимон, Лаванда, Герань, Гвоздика, Иланг-иланг, Пачули, Ветивер, Ванилин, Дубовый мох (Evernyl). Слушайте по парам на подписанных блоттерах, затем угадывайте вслепую.',
        en: 'Start with starkly contrasting materials at 10% dilution in ethanol or DPG: Lemon, Lavender, Geranium, Clove, Ylang-Ylang, Patchouli, Vetiver, Vanillin, and Oakmoss (Evernyl). Smell in pairs on labeled blotters, then test yourself blind.',
        it: 'Inizia con materiali molto diversi tra loro al 10% in etanolo o DPG: Limone, Lavanda, Geranio, Chiodi di Garofano, Ylang-Ylang, Patchouli, Vetiver, Vanillina e Muschio di Quercia (Evernyl). Annusa a coppie su mouillette firmate, poi alla cieca.',
        es: 'Comienza con materiales muy contrastados al 10% en etanol o DPG: Limón, Lavanda, Geranio, Clavo, Ylang-Ylang, Pachulí, Vetiver, Vainillina y Musgo de Roble (Evernyl). Huele por parejas en secantes rotulados y luego a ciegas.',
        de: 'Beginnen Sie mit stark kontrastierenden Stoffen in 10%-Verdünnung in Ethanol oder DPG: Zitrone, Lavendel, Geranie, Nelke, Ylang-Ylang, Patchouli, Vetiver, Vanillin und Eichenmoos (Evernyl). Erst paarweise auf beschrifteten Streifen, dann blind testen.',
      }),
    },
    {
      step: '02',
      title: tr(language, {
        ru: 'Этап 2: Изучение внутри одного семейства',
        en: 'Stage 2: Intra-Family Study & Comparison',
        it: 'Fase 2: Studio all’Interno della Stessa Famiglia',
        es: 'Etapa 2: Estudio Dentro de una Misma Familia',
        de: 'Stufe 2: Vergleich innerhalb einer Duftfamilie',
      }),
      desc: tr(language, {
        ru: 'Когда вы безошибочно узнаёте контрастные ноты, сравнивайте материалы внутри одной группы: например, все цитрусовые (Лимон, Бергамот, Сладкий апельсин, Горький апельсин, Мандарин, Петитгрейн, Нероли) или все розовые спирты (Гераниол, Цитронеллол, Нерол, Фенилэтиловый спирт).',
        en: 'Once contrasting notes are mastered, compare materials within one family: e.g., all citrus oils (Lemon, Bergamot, Sweet Orange, Bitter Orange, Mandarin, Petitgrain, Neroli) or rose alcohols (Geraniol, Citronellol, Nerol, Phenylethyl Alcohol).',
        it: 'Una volta padroneggiate le note contrastanti, confronta i materiali della stessa famiglia: es. tutti gli agrumi (Limone, Bergamotto, Arancia dolce/amara, Mandarino, Petitgrain, Neroli) o gli alcoli rosati (Geraniolo, Citronellolo, Nerolo, PEA).',
        es: 'Una vez dominados los contrastes, compara materiales de una misma familia: p. ej., todos los cítricos (Limón, Bergamota, Naranja dulce/amarga, Mandarina, Petitgrain, Neroli) o alcoholes de rosa (Geraniol, Citronelol, Nerol, PEA).',
        de: 'Vergleichen Sie danach Rohstoffe derselben Familie: z. B. alle Zitrusöle (Zitrone, Bergamotte, Süß-/Bitterorange, Mandarine, Petitgrain, Neroli) oder Rosenalkohole (Geraniol, Citronellol, Nerol, Phenylethylalkohol).',
      }),
    },
    {
      step: '03',
      title: tr(language, {
        ru: 'Этап 3: Кривая испарения от 0 минут до 7 дней',
        en: 'Stage 3: Evaporation Curve from 0 Minutes to 7 Days',
        it: 'Fase 3: Curva di Evaporazione da 0 Minuti a 7 Giorni',
        es: 'Etapa 3: Curva de Evaporación de 0 Minutos a 7 Días',
        de: 'Stufe 3: Verdunstungskurve von 0 Minuten bis 7 Tage',
      }),
      desc: tr(language, {
        ru: 'Никогда не оценивайте вещество только в первые 5 минут! Нанесите каплю на блоттер и записывайте запах через 15 минут, 1 час, 3 часа, 6 часов, 24 часа и через неделю. Именно так Жан Карль разделил все вещества на Верхние, Модификаторы (Сердце) и Базовые ноты.',
        en: 'Never judge a material only in the first 5 minutes! Dip a blotter and record observations at 15 min, 1 hour, 3 hours, 6 hours, 24 hours, and 7 days. This is how Jean Carles classified every material into Top Notes, Modifiers (Heart), and Base Notes.',
        it: 'Non giudicare mai una materia prima solo nei primi 5 minuti! Immergi la mouillette e annota l’odore dopo 15 min, 1 ora, 3 ore, 6 ore, 24 ore e 7 giorni. Così Jean Carles ha classificato Testa, Modificatori (Cuore) e Fondo.',
        es: '¡Nunca juzgues una materia prima solo en los primeros 5 minutos! Moja el secante y anota el olor a los 15 min, 1 h, 3 h, 6 h, 24 h y 7 días. Así clasificó Jean Carles cada material en Salida, Modificadores (Corazón) y Fondo.',
        de: 'Beurteilen Sie einen Rohstoff nie nur in den ersten 5 Minuten! Notieren Sie den Duft auf dem Riechstreifen nach 15 Min., 1 Std., 3 Std., 6 Std., 24 Std. und 7 Tagen. So teilte Jean Carles alle Stoffe in Kopf-, Herz- und Basisnoten ein.',
      }),
    },
    {
      step: '04',
      title: tr(language, {
        ru: 'Этап 4: Ежедневный ритуал «Утренний слепой затест»',
        en: 'Stage 4: Daily Morning Blind Smelling Ritual',
        it: 'Fase 4: Rituale Quotidiano del Test alla Cieca Mattutino',
        es: 'Etapa 4: Ritual Diario de Cata a Ciegas Matinal',
        de: 'Stufe 4: Tägliches Blind-Riechritual am Morgen',
      }),
      desc: tr(language, {
        ru: 'Лучшее время для работы носом — утро, когда рецепторы не утомлены. Подготовьте с вечера 5 блоттеров (коды напишите на обороте), а утром определите вещество и стадию его раскрытия.',
        en: 'The sharpest time for olfactory work is early morning when receptors are fresh. Prepare 5 coded blotters the evening before, then identify both the material and its drydown stage in the morning.',
        it: 'Il momento migliore per il naso è il mattino, quando i recettori sono riposati. Prepara la sera prima 5 mouillette codificate sul retro e al mattino identifica la materia prima e la sua fase di evoluzione.',
        es: 'El mejor momento para el olfato es por la mañana, con los receptores descansados. Prepara la noche anterior 5 secantes codificados al dorso y por la mañana identifica el material y su fase de secado.',
        de: 'Die beste Zeit für die Nase ist der Morgen, wenn die Rezeptoren ausgeruht sind. Bereiten Sie abends 5 codierte Riechstreifen vor und bestimmen Sie morgens Rohstoff und Entwicklungsstadium.',
      }),
    },
  ];

  const volatilityColumns = [
    {
      badge: '15–25%',
      badgeClass: 'bg-[#FFF4CE] text-[#5C4300]',
      headerClass: 'bg-[#FFFDF5]',
      title: tr(language, {
        ru: '1. Верхние ноты (Голова)',
        en: '1. Top Notes (Head)',
        it: '1. Note di Testa',
        es: '1. Notas de Salida (Cabeza)',
        de: '1. Kopfnoten (Auftakt)',
      }),
      subtitle: tr(language, {
        ru: 'Очень летучие (1–3 часа). Дают первое впечатление и свежесть старта.',
        en: 'Highly volatile (1–3 hours). Create the immediate opening impression and sparkle.',
        it: 'Molto volatili (1–3 ore). Creano la prima impressione e la freschezza iniziale.',
        es: 'Muy volátiles (1–3 horas). Crean la primera impresión y el frescor inicial.',
        de: 'Sehr flüchtig (1–3 Stunden). Sorgen für den ersten Eindruck und frischen Auftakt.',
      }),
      items: tr(language, {
        ru: [
          'Бергамот, Лимон, Лайм, Мандарин, Сладкий и горький апельсин',
          'Лаванда, Лавандин, Розмарин, Эстрагон, Базилик, Мята',
          'Петитгрейн, Нероли, Кориандр, Кардамон, Розовый перец',
          'Линалоол, Линалилацетат, Дигидромирценол',
          'Бензилацетат, Цис-3-гексенол (свежескошенная трава)',
          'Альдегиды C-8, C-9, C-10, C-11, C-12 MNA (в 1% разведении)',
        ],
        en: [
          'Bergamot, Lemon, Lime, Mandarin, Sweet & Bitter Orange',
          'Lavender, Lavandin, Rosemary, Tarragon, Basil, Peppermint',
          'Petitgrain, Neroli, Coriander, Cardamom, Pink Pepper',
          'Linalool, Linalyl Acetate, Dihydromyrcenol',
          'Benzyl Acetate, Cis-3-Hexenol (freshly cut grass)',
          'Aldehydes C-8, C-9, C-10, C-11, C-12 MNA (at 1% dilution)',
        ],
        it: [
          'Bergamotto, Limone, Lime, Mandarino, Arancia dolce e amara',
          'Lavanda, Lavandino, Rosmarino, Dragoncello, Basilico, Menta',
          'Petitgrain, Neroli, Coriandolo, Cardamomo, Pepe Rosa',
          'Linalolo, Acetato di Linalile, Diidromircenolo',
          'Acetato di Benzile, Cis-3-Esenolo (erba appena tagliata)',
          'Aldeidi C-8, C-9, C-10, C-11, C-12 MNA (diluite all’1%)',
        ],
        es: [
          'Bergamota, Limón, Lima, Mandarina, Naranja dulce y amarga',
          'Lavanda, Lavandín, Romero, Estragón, Albahaca, Menta',
          'Petitgrain, Neroli, Cilantro, Cardamomo, Pimienta Rosa',
          'Linalol, Acetato de Linalilo, Dihidromircenol',
          'Acetato de Bencilo, Cis-3-Hexenol (hierba recién cortada)',
          'Aldehídos C-8, C-9, C-10, C-11, C-12 MNA (al 1%)',
        ],
        de: [
          'Bergamotte, Zitrone, Limette, Mandarine, Süß- & Bitterorange',
          'Lavendel, Lavandin, Rosmarin, Estragon, Basilikum, Minze',
          'Petitgrain, Neroli, Koriander, Kardamom, Rosa Pfeffer',
          'Linalool, Linalylacetat, Dihydromyrcenol',
          'Benzylacetat, Cis-3-Hexenol (frisch geschnittenes Gras)',
          'Aldehyde C-8, C-9, C-10, C-11, C-12 MNA (1% verdünnt)',
        ],
      }),
    },
    {
      badge: '30–40%',
      badgeClass: 'bg-[#FDE7E9] text-[#A4262C]',
      headerClass: 'bg-[#FFF9FA]',
      title: tr(language, {
        ru: '2. Модификаторы / Ноты сердца',
        en: '2. Modifiers / Heart Notes',
        it: '2. Modificatori / Note di Cuore',
        es: '2. Modificadores / Notas de Corazón',
        de: '2. Modifikatoren / Herznoten',
      }),
      subtitle: tr(language, {
        ru: 'Средняя летучесть (3–12 часов). Придают характер базовому аккорду и связывают верх с базой.',
        en: 'Intermediate volatility (3–12 hours). Give character to the base accord and bridge top with base.',
        it: 'Media volatilità (3–12 ore). Danno carattere all’accordo di fondo e collegano testa e base.',
        es: 'Volatilidad media (3–12 horas). Aportan carácter al acorde base y unen salida con fondo.',
        de: 'Mittlere Flüchtigkeit (3–12 Stunden). Verleihen dem Basisakkord Charakter und verbinden Kopf und Basis.',
      }),
      items: tr(language, {
        ru: [
          'Роза абсолют и ЭМ, Герань, Иланг-иланг, Жасмин, Флердоранж',
          'Гераниол, Цитронеллол, Фенилэтиловый спирт (PEA), Альфа-терпинеол',
          'Гедион (Hedione), Гидроксицитронеллаль, Цикламен альдегид',
          'Гвоздика (Эвгенол), Корица, Мускатный орех, Шалфей мускатный',
          'Гальбанум, Абсолют листа фиалки, Чёрная смородина (Кассис)',
          'Амилсалицилат, Бензилсалицилат, Персиковый C-14 и Кокосовый C-18',
        ],
        en: [
          'Rose Absolute & EO, Geranium, Ylang-Ylang, Jasmine, Orange Blossom',
          'Geraniol, Citronellol, Phenylethyl Alcohol (PEA), Alpha-Terpineol',
          'Hedione, Hydroxycitronellal, Cyclamen Aldehyde',
          'Clove (Eugenol), Cinnamon, Nutmeg, Clary Sage',
          'Galbanum, Violet Leaf Absolute, Blackcurrant Bud (Cassis)',
          'Amyl Salicylate, Benzyl Salicylate, Peach C-14 & Coconut C-18',
        ],
        it: [
          'Rosa assoluta e OE, Geranio, Ylang-Ylang, Gelsomino, Fiore d’Arancio',
          'Geraniolo, Citronellolo, Alcol Feniletilico (PEA), Alfa-Terpineolo',
          'Hedione, Idrossicitronellale, Aldeide Ciclamino',
          'Chiodi di Garofano (Eugenolo), Cannella, Noce Moscata, Salvia Sclarea',
          'Galbano, Assoluta di Foglia di Violetta, Ribes Nero (Cassis)',
          'Salicilato di Amile, Salicilato di Benzile, Pesca C-14 e Cocco C-18',
        ],
        es: [
          'Rosa absoluto y AE, Geranio, Ylang-Ylang, Jazmín, Azahar',
          'Geraniol, Citronelol, Alcohol Feniletílico (PEA), Alfa-Terpineol',
          'Hedione, Hidroxicitronelal, Aldehído Ciclamen',
          'Clavo (Eugenol), Canela, Nuez Moscada, Salvia Esclarea',
          'Gálbano, Absoluto de Hoja de Violeta, Grosella Negra (Cassis)',
          'Salicilato de Amilo, Salicilato de Bencilo, Melocotón C-14 y Coco C-18',
        ],
        de: [
          'Rose Absolue & ÄÖ, Geranie, Ylang-Ylang, Jasmin, Orangenblüte',
          'Geraniol, Citronellol, Phenylethylalkohol (PEA), Alpha-Terpineol',
          'Hedione, Hydroxycitronellal, Cyclamenaldehyd',
          'Nelke (Eugenol), Zimt, Muskatnuss, Muskatellersalbei',
          'Galbanum, Veilchenblatt Absolue, Schwarze Johannisbeere (Cassis)',
          'Amylsalicylat, Benzylsalicylat, Pfirsich C-14 & Kokos C-18',
        ],
      }),
    },
    {
      badge: '45–55%',
      badgeClass: 'bg-[#EDEBE9] text-[#323130]',
      headerClass: 'bg-[#FAF9F8]',
      title: tr(language, {
        ru: '3. Базовые ноты (Фундамент)',
        en: '3. Base Notes (Foundation)',
        it: '3. Note di Fondo (Fondamenta)',
        es: '3. Notas de Fondo (Cimiento)',
        de: '3. Basisnoten (Fundament)',
      }),
      subtitle: tr(language, {
        ru: 'Низкая летучесть (от 24 часов до 7+ дней). Задают главную тему, глубину и стойкость духов.',
        en: 'Low volatility (24 hours to 7+ days). Define the core theme, depth, and tenacity of the perfume.',
        it: 'Bassa volatilità (da 24 ore a 7+ giorni). Definiscono il tema principale, la profondità e la tenuta.',
        es: 'Baja volatilidad (de 24 horas a 7+ días). Definen el tema principal, la profundidad y la fijación.',
        de: 'Geringe Flüchtigkeit (24 Stunden bis 7+ Tage). Bestimmen Hauptthema, Tiefe und Haltbarkeit.',
      }),
      items: tr(language, {
        ru: [
          'Дубовый мох / Evernyl (Veramoss), Пачули, Ветивер Гаити и Ява',
          'Сандал (или Sandalore / Javanol / Bacdanol), Кедр Атласский и Вирджиния',
          'Лабданум (Цистус), Бензоин Сиам, Перуанский и Толуанский бальзамы, Ладан',
          'Ванилин, Этилванилин, Кумарин, Гелиотропин',
          'Иононы и Ироны (Фиалка / Ирис), Iso E Super, Амброксан (Ambroxan)',
          'Мускусы: Галаксолид, Этилбрассилат, Амбреттолид, Хабанолид',
        ],
        en: [
          'Oakmoss / Evernyl (Veramoss), Patchouli, Haitian & Java Vetiver',
          'Sandalwood (or Sandalore / Javanol / Bacdanol), Atlas & Virginian Cedar',
          'Labdanum (Cistus), Benzoin Siam, Peru & Tolu Balsams, Frankincense',
          'Vanillin, Ethyl Vanillin, Coumarin, Heliotropin',
          'Ionones & Irones (Violet / Orris), Iso E Super, Ambroxan',
          'Musks: Galaxolide, Ethylene Brassylate, Ambrettolide, Habanolide',
        ],
        it: [
          'Muschio di Quercia / Evernyl (Veramoss), Patchouli, Vetiver Haiti e Giava',
          'Sandalo (o Sandalore / Javanol / Bacdanol), Cedro Atlante e Virginia',
          'Labdano (Cisto), Benzoino Siam, Balsamo del Perù e di Tolù, Incenso',
          'Vanillina, Etilvanillina, Cumarina, Eliotropina',
          'Iononi e Ironi (Violetta / Iris), Iso E Super, Ambroxan',
          'Muschi: Galaxolide, Etilene Brassilato, Ambrettolide, Habanolide',
        ],
        es: [
          'Musgo de Roble / Evernyl (Veramoss), Pachulí, Vetiver Haití y Java',
          'Sándalo (o Sandalore / Javanol / Bacdanol), Cedro del Atlas y Virginia',
          'Lábdano (Cistus), Benjuí Siam, Bálsamo del Perú y de Tolú, Incienso',
          'Vainillina, Etilvainillina, Cumarina, Heliotropina',
          'Iononas e Ironas (Violeta / Iris), Iso E Super, Ambroxan',
          'Almizcles: Galaxolide, Brassilato de Etileno, Ambrettolide, Habanolide',
        ],
        de: [
          'Eichenmoos / Evernyl (Veramoss), Patchouli, Haiti- & Java-Vetiver',
          'Sandelholz (oder Sandalore / Javanol / Bacdanol), Atlas- & Virginiazeder',
          'Labdanum (Cistus), Benzoe Siam, Peru- & Tolubalsam, Weihrauch',
          'Vanillin, Ethylvanillin, Cumarin, Heliotropin',
          'Ionone & Irone (Veilchen / Iris), Iso E Super, Ambroxan',
          'Moschusstoffe: Galaxolide, Ethylenbrassylat, Ambrettolid, Habanolide',
        ],
      }),
    },
  ];

  const classicAccords = [
    {
      title: tr(language, {
        ru: '1. Базовый Шипровый аккорд (по Жану Карлю)',
        en: '1. Classic Chypre Base Accord (Jean Carles)',
        it: '1. Accordo Base Chypre Classico (Jean Carles)',
        es: '1. Acorde Base Chipre Clásico (Jean Carles)',
        de: '1. Klassischer Chypre-Basisakkord (Jean Carles)',
      }),
      recipe: tr(language, {
        ru: 'База: 6 частей Дубового мха (Evernyl 10%) + 4 части Лабданума (Амбра) + 1–2 части Пачули / Ветивера. Модификаторы: Роза, Жасмин, Метилионон. Верх: много Бергамота.',
        en: 'Base: 6 parts Oakmoss (Evernyl 10%) + 4 parts Labdanum (Amber) + 1–2 parts Patchouli / Vetiver. Modifiers: Rose, Jasmine, Methyl Ionone. Top: generous Bergamot.',
        it: 'Fondo: 6 parti Muschio di Quercia (Evernyl 10%) + 4 parti Labdano (Ambra) + 1–2 parti Patchouli / Vetiver. Modificatori: Rosa, Gelsomino, Metilionone. Testa: abbondante Bergamotto.',
        es: 'Fondo: 6 partes Musgo de Roble (Evernyl 10%) + 4 partes Lábdano (Ámbar) + 1–2 partes Pachulí / Vetiver. Modificadores: Rosa, Jazmín, Metilionona. Salida: abundante Bergamota.',
        de: 'Basis: 6 Teile Eichenmoos (Evernyl 10%) + 4 Teile Labdanum (Amber) + 1–2 Teile Patchouli / Vetiver. Herz: Rose, Jasmin, Methylionon. Kopf: reichlich Bergamotte.',
      }),
    },
    {
      title: tr(language, {
        ru: '2. Базовый Фужерный аккорд (Fougère)',
        en: '2. Classic Fougère Base Accord',
        it: '2. Accordo Base Fougère Classico',
        es: '2. Acorde Base Fougère Clásico',
        de: '2. Klassischer Fougère-Basisakkord',
      }),
      recipe: tr(language, {
        ru: 'База: 5 частей Кумарина (10%) + 3 части Дубового мха (Evernyl 10%) + 2 части Ветивера или Мускуса. Модификаторы: Герань + Амилсалицилат (клевер). Верх: Лаванда + Бергамот.',
        en: 'Base: 5 parts Coumarin (10%) + 3 parts Oakmoss (Evernyl 10%) + 2 parts Vetiver or Musk. Modifiers: Geranium + Amyl Salicylate (clover). Top: Lavender + Bergamot.',
        it: 'Fondo: 5 parti Cumarina (10%) + 3 parti Muschio di Quercia (Evernyl 10%) + 2 parti Vetiver o Muschio. Modificatori: Geranio + Salicilato di Amile. Testa: Lavanda + Bergamotto.',
        es: 'Fondo: 5 partes Cumarina (10%) + 3 partes Musgo de Roble (Evernyl 10%) + 2 partes Vetiver o Almizcle. Modificadores: Geranio + Salicilato de Amilo. Salida: Lavanda + Bergamota.',
        de: 'Basis: 5 Teile Cumarin (10%) + 3 Teile Eichenmoos (Evernyl 10%) + 2 Teile Vetiver oder Moschus. Herz: Geranie + Amylsalicylat. Kopf: Lavendel + Bergamotte.',
      }),
    },
    {
      title: tr(language, {
        ru: '3. Классический Амбровый аккорд (Ambre 83)',
        en: '3. Classic Amber Accord (Ambre 83)',
        it: '3. Accordo Ambrato Classico (Ambre 83)',
        es: '3. Acorde Ámbar Clásico (Ambre 83)',
        de: '3. Klassischer Amber-Akkord (Ambre 83)',
      }),
      recipe: tr(language, {
        ru: 'Бинарная серия Лабданум резиноид + Ванилин (в пропорции 5:5 или 6:4) с добавлением Бензоина Сиам. Даёт тёплый смолисто-бальзамический фундамент для восточных духов.',
        en: 'Binary series of Labdanum Resinoid + Vanillin (at 5:5 or 6:4 ratio) rounded with Benzoin Siam. Creates a warm resinous-balsamic foundation for oriental perfumes.',
        it: 'Serie binaria di Resinoide di Labdano + Vanillina (in rapporto 5:5 o 6:4) arrotondata con Benzoino Siam. Crea un caldo fondo resinoso-balsamico per profumi orientali.',
        es: 'Serie binaria de Resinoide de Lábdano + Vainillina (en proporción 5:5 o 6:4) redondeada con Benjuí Siam. Crea un cálido fondo resinoso-balsámico para perfumes orientales.',
        de: 'Binäre Serie aus Labdanum-Resinoid + Vanillin (im Verhältnis 5:5 oder 6:4), abgerundet mit Benzoe Siam. Bildet ein warmes harzig-balsamisches Fundament.',
      }),
    },
    {
      title: tr(language, {
        ru: '4. Современный аккорд «Объятия» (Grojsman Accord)',
        en: '4. Modern “Hug Me” Accord (Grojsman Accord)',
        it: '4. Accordo Moderno “Hug Me” (Accordo Grojsman)',
        es: '4. Acorde Moderno “Hug Me” (Acorde Grojsman)',
        de: '4. Moderner „Hug Me“-Akkord (Grojsman-Akkord)',
      }),
      recipe: tr(language, {
        ru: 'Наследие табличного метода Карля в современной парфюмерии (София Гройсман): равные части (по 25%) Iso E Super, Галаксолида, Метилионона Гамма и Гедиона.',
        en: 'The modern evolution of Carles’ proportional method (Sophia Grojsman): equal parts (25% each) of Iso E Super, Galaxolide, Methyl Ionone Gamma, and Hedione.',
        it: 'L’evoluzione moderna del metodo proporzionale di Carles (Sophia Grojsman): parti uguali (25% ciascuno) di Iso E Super, Galaxolide, Metilionone Gamma e Hedione.',
        es: 'La evolución moderna del método proporcional de Carles (Sophia Grojsman): partes iguales (25% cada uno) de Iso E Super, Galaxolide, Metilionona Gamma y Hedione.',
        de: 'Die moderne Weiterentwicklung von Carles’ Tabellenmethode (Sophia Grojsman): gleiche Teile (je 25%) Iso E Super, Galaxolide, Methylionon Gamma und Hedione.',
      }),
    },
  ];

  const pencilSteps = [
    {
      dotClass: 'bg-[#181917]',
      title: tr(language, {
        ru: '1. Чёрный карандаш — Базовый аккорд (~55%)',
        en: '1. Black Pencil — Base Accord (~55%)',
        it: '1. Matita Nera — Accordo di Fondo (~55%)',
        es: '1. Lápiz Negro — Acorde de Fondo (~55%)',
        de: '1. Schwarzer Stift — Basisakkord (~55%)',
      }),
      text: tr(language, {
        ru: 'Запишите 2–4 базовых материала в пропорции из вашей лучшей пробы таблицы (например: 6 частей Дубового мха + 4 части Амбры/Лабданума + 2 части Ветивера).',
        en: 'Write down 2–4 base materials in the ratio selected from your best accord series trial (e.g., 6 parts Oakmoss + 4 parts Amber/Labdanum + 2 parts Vetiver).',
        it: 'Scrivi 2–4 materiali di fondo nella proporzione scelta dalla tua migliore prova della tabella (es. 6 parti Muschio di Quercia + 4 parti Ambra/Labdano + 2 parti Vetiver).',
        es: 'Anota 2–4 materiales de fondo en la proporción elegida de tu mejor prueba de la tabla (p. ej., 6 partes Musgo de Roble + 4 partes Ámbar/Lábdano + 2 partes Vetiver).',
        de: 'Notieren Sie 2–4 Basisstoffe im Verhältnis Ihres besten Tabellenversuchs (z. B. 6 Teile Eichenmoos + 4 Teile Amber/Labdanum + 2 Teile Vetiver).',
      }),
    },
    {
      dotClass: 'bg-[#D13438]',
      title: tr(language, {
        ru: '2. Красный карандаш — Модификаторы сердца (~30%)',
        en: '2. Red Pencil — Heart Modifiers (~30%)',
        it: '2. Matita Rossa — Modificatori di Cuore (~30%)',
        es: '2. Lápiz Rojo — Modificadores de Corazón (~30%)',
        de: '2. Roter Stift — Herz-Modifikatoren (~30%)',
      }),
      text: tr(language, {
        ru: 'Добавьте цветочные и пряные ноты средней летучести, которые скруглят базу и придадут ей индивидуальность (Роза, Жасмин, Гедион, Изобутилхинолин, Гвоздика).',
        en: 'Add floral and spicy notes of medium volatility to round out the base and give it individuality (Rose, Jasmine, Hedione, Isobutyl Quinoline, Carnation/Clove).',
        it: 'Aggiungi note floreali e speziate di media volatilità per arrotondare il fondo e dargli personalità (Rosa, Gelsomino, Hedione, Isobutilchinolina, Garofano).',
        es: 'Añade notas florales y especiadas de volatilidad media para redondear el fondo y darle personalidad (Rosa, Jazmín, Hedione, Isobutilquinoleína, Clavel/Clavo).',
        de: 'Ergänzen Sie blumige und würzige Herznoten mittlerer Flüchtigkeit, die die Basis abrunden (Rose, Jasmin, Hedione, Isobutylchinolin, Nelke).',
      }),
    },
    {
      dotClass: 'bg-[var(--theme-accent)]',
      title: tr(language, {
        ru: '3. Синий карандаш — Верхние ноты (~15%)',
        en: '3. Blue Pencil — Top Notes (~15%)',
        it: '3. Matita Blu — Note di Testa (~15%)',
        es: '3. Lápiz Azul — Notas de Salida (~15%)',
        de: '3. Blauer Stift — Kopfnoten (~15%)',
      }),
      text: tr(language, {
        ru: 'Завершите формулу летучими цитрусами, травами или альдегидами (Бергамот, Сладкий апельсин, Лаванда, Альдегид C-11), чтобы аромат искрился с первых секунд.',
        en: 'Finish the formula with volatile citruses, herbs, or aldehydes (Bergamot, Sweet Orange, Lavender, Aldehyde C-11) so the fragrance sparkles from the very first spray.',
        it: 'Completa la formula con agrumi volatili, erbe o aldeidi (Bergamotto, Arancia dolce, Lavanda, Aldeide C-11) affinché il profumo brilli fin dai primi secondi.',
        es: 'Completa la fórmula con cítricos volátiles, hierbas o aldehídos (Bergamota, Naranja dulce, Lavanda, Aldehído C-11) para que el perfume brille desde el primer segundo.',
        de: 'Vollenden Sie die Formel mit flüchtigen Zitrusnoten, Kräutern oder Aldehyden (Bergamotte, Süßorange, Lavendel, Aldehyd C-11) für einen strahlenden Auftakt.',
      }),
    },
  ];

  const booksList = [
    {
      badge: tr(language, {
        ru: 'Книга №1 · Обязательно к прочтению',
        en: 'Book #1 · Mandatory Reading',
        it: 'Libro n. 1 · Lettura Fondamentale',
        es: 'Libro n.º 1 · Lectura Imprescindible',
        de: 'Buch Nr. 1 · Pflichtlektüre',
      }),
      badgeClass: 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]',
      author: tr(language, {
        ru: 'Жан Карль (Jean Carles, 1961–1962)',
        en: 'Jean Carles (1961–1962)',
        it: 'Jean Carles (1961–1962)',
        es: 'Jean Carles (1961–1962)',
        de: 'Jean Carles (1961–1962)',
      }),
      title: tr(language, {
        ru: 'Метод создания ароматов (A Method of Creation in Perfumery)',
        en: 'A Method of Creation in Perfumery',
        it: 'Un Metodo di Creazione in Profumeria (A Method of Creation in Perfumery)',
        es: 'Un Método de Creación en Perfumería (A Method of Creation in Perfumery)',
        de: 'Eine Methode der Parfümkreation (A Method of Creation in Perfumery)',
      }),
      desc: tr(language, {
        ru: 'Серия статей в журнале Recherches (выпуски 11–12, Roure Bertrand Dupont). Полный разбор тренировки обоняния, таблиц летучести и построения шипровых, фужерных и цветочных баз.',
        en: 'Series of articles in Recherches (issues 11–12, Roure Bertrand Dupont). Complete guide to olfactory training, volatility charts, and constructing chypre, fougère, and floral bases.',
        it: 'Serie di articoli nella rivista Recherches (numeri 11–12, Roure Bertrand Dupont). Guida completa all’allenamento olfattivo, alle tabelle di volatilità e alla creazione di basi chypre, fougère e floreali.',
        es: 'Serie de artículos en la revista Recherches (números 11–12, Roure Bertrand Dupont). Guía completa de entrenamiento olfativo, tablas de volatilidad y construcción de bases chipre, fougère y florales.',
        de: 'Artikelserie in der Zeitschrift Recherches (Ausgaben 11–12, Roure Bertrand Dupont). Vollständiger Leitfaden zu Riechtraining, Flüchtigkeitstabellen und dem Aufbau von Chypre-, Fougère- und Blütenbasen.',
      }),
      linkLabel: 'icpf.online/method-creation',
      linkUrl: 'https://www.icpf.online/method-creation',
    },
    {
      badge: tr(language, {
        ru: 'Книга №2 · Лучший учебник для старта',
        en: 'Book #2 · Best Beginner Textbook',
        it: 'Libro n. 2 · Miglior Manuale per Iniziare',
        es: 'Libro n.º 2 · Mejor Manual de Iniciación',
        de: 'Buch Nr. 2 · Bestes Einsteiger-Lehrbuch',
      }),
      badgeClass: 'bg-[#E6F4EA] text-[#137333]',
      author: tr(language, {
        ru: 'Роберт Калкин и Стивен Джеллинек (R. Calkin & J.S. Jellinek)',
        en: 'Robert R. Calkin & J. Stephan Jellinek',
        it: 'Robert R. Calkin & J. Stephan Jellinek',
        es: 'Robert R. Calkin y J. Stephan Jellinek',
        de: 'Robert R. Calkin & J. Stephan Jellinek',
      }),
      title: tr(language, {
        ru: 'Парфюмерия: практика и принципы (Perfumery: Practice and Principles)',
        en: 'Perfumery: Practice and Principles',
        it: 'Profumeria: Pratica e Principi (Perfumery: Practice and Principles)',
        es: 'Perfumería: Práctica y Principios (Perfumery: Practice and Principles)',
        de: 'Parfümerie: Praxis und Prinzipien (Perfumery: Practice and Principles)',
      }),
      desc: tr(language, {
        ru: 'Пошаговое руководство по современной парфюмерии: как устроены цветочные базы (Роза, Жасмин, Ландыш, Сирень), как работают синтетические мускусы и как модифицировать формулы.',
        en: 'Step-by-step textbook on modern perfumery: how classic floral bases (Rose, Jasmine, Muguet, Lilac) are built, how synthetic musks work, and how to balance formulas.',
        it: 'Manuale passo-passo sulla profumeria moderna: come sono costruite le basi floreali (Rosa, Gelsomino, Mughetto, Lillà), come funzionano i muschi sintetici e come bilanciare le formule.',
        es: 'Manual paso a paso de perfumería moderna: cómo se construyen las bases florales (Rosa, Jazmín, Muguet, Lila), cómo funcionan los almizcles sintéticos y cómo equilibrar fórmulas.',
        de: 'Schritt-für-Schritt-Lehrbuch der modernen Parfümerie: Aufbau klassischer Blütenbasen (Rose, Jasmin, Maiglöckchen, Flieder), Wirkung synthetischer Moschusstoffe und Formelbalance.',
      }),
    },
    {
      badge: tr(language, {
        ru: 'Книга №3 · Библия парфюмерного сырья',
        en: 'Book #3 · Raw Materials Bible',
        it: 'Libro n. 3 · Bibbia delle Materie Prime',
        es: 'Libro n.º 3 · Biblia de Materias Primas',
        de: 'Buch Nr. 3 · Bibel der Riechstoffe',
      }),
      badgeClass: 'bg-[#FFF4CE] text-[#5C4300]',
      author: tr(language, {
        ru: 'Штеффен Арктандер (Steffen Arctander)',
        en: 'Steffen Arctander',
        it: 'Steffen Arctander',
        es: 'Steffen Arctander',
        de: 'Steffen Arctander',
      }),
      title: tr(language, {
        ru: 'Натуральное и синтетическое парфюмерное сырьё (Perfume and Flavor Materials)',
        en: 'Perfume and Flavor Materials of Natural Origin & Chemicals',
        it: 'Materie Prime Naturali e Sintetiche (Perfume and Flavor Materials)',
        es: 'Materias Primas Naturales y Sintéticas (Perfume and Flavor Materials)',
        de: 'Natürliche und synthetische Riechstoffe (Perfume and Flavor Materials)',
      }),
      desc: tr(language, {
        ru: 'Фундаментальный трёхтомник с детальным ольфакторным описанием тысяч эфирных масел, абсолютов, бальзамов и аромахимикатов, их стойкости и сочетаемости.',
        en: 'Monumental three-volume encyclopedia describing thousands of essential oils, absolutes, resins, and aroma chemicals, including substantivity and blending synergies.',
        it: 'Monumentale opera in tre volumi con la descrizione olfattiva dettagliata di migliaia di oli essenziali, assolute, resine e molecole aromatiche, tenuta e abbinamenti.',
        es: 'Monumental obra en tres volúmenes con la descripción olfativa detallada de miles de aceites esenciales, absolutos, resinas y moléculas aromáticas, fijación y sinergias.',
        de: 'Monumentales dreibändiges Standardwerk mit detaillierten Geruchsbeschreibungen tausender ätherischer Öle, Absolues, Harze und Aromachemikalien sowie ihrer Haftfestigkeit.',
      }),
      linkLabel: 'thegoodscentscompany.com',
      linkUrl: 'https://www.thegoodscentscompany.com',
    },
    {
      badge: tr(language, {
        ru: 'Книга №4 · Химия и молекулы',
        en: 'Book #4 · Fragrance Chemistry',
        it: 'Libro n. 4 · Chimica dei Profumi',
        es: 'Libro n.º 4 · Química del Perfume',
        de: 'Buch Nr. 4 · Duftstoffchemie',
      }),
      badgeClass: 'bg-[#F3E8FF] text-[#6B21A8]',
      author: tr(language, {
        ru: 'Чарльз Селл / Royal Society of Chemistry (Charles S. Sell)',
        en: 'Charles S. Sell (Royal Society of Chemistry)',
        it: 'Charles S. Sell (Royal Society of Chemistry)',
        es: 'Charles S. Sell (Royal Society of Chemistry)',
        de: 'Charles S. Sell (Royal Society of Chemistry)',
      }),
      title: tr(language, {
        ru: 'Химия ароматов: от парфюмера к потребителю (The Chemistry of Fragrances)',
        en: 'The Chemistry of Fragrances: From Perfumer to Consumer',
        it: 'La Chimica delle Fragranze: dal Profumiere al Consumatore',
        es: 'La Química de las Fragancias: del Perfumista al Consumidor',
        de: 'Die Chemie der Düfte: Vom Parfümeur zum Verbraucher',
      }),
      desc: tr(language, {
        ru: 'Понятное введение в химию душистых веществ: почему спирты, альдегиды, сложные эфиры, лактоны и кетоны пахнут по-разному и как они ведут себя в спиртовом растворе.',
        en: 'Accessible introduction to fragrance chemistry: why alcohols, aldehydes, esters, lactones, and ketones smell different and how they behave in alcoholic solution.',
        it: 'Introduzione chiara alla chimica delle molecole odorose: perché alcoli, aldeidi, esteri, lattoni e chetoni hanno odori diversi e come si comportano in soluzione alcolica.',
        es: 'Introducción clara a la química aromática: por qué alcoholes, aldehídos, ésteres, lactonas y cetonas huelen distinto y cómo se comportan en solución alcohólica.',
        de: 'Verständliche Einführung in die Riechstoffchemie: warum Alkohole, Aldehyde, Ester, Lactone und Ketone unterschiedlich riechen und wie sie in Ethanol reagieren.',
      }),
    },
    {
      badge: tr(language, {
        ru: 'Книга №5 · Эстетика минимализма',
        en: 'Book #5 · Minimalist Aesthetics',
        it: 'Libro n. 5 · Estetica del Minimalismo',
        es: 'Libro n.º 5 · Estética del Minimalismo',
        de: 'Buch Nr. 5 · Ästhetik des Minimalismus',
      }),
      badgeClass: 'bg-[#FDE7E9] text-[#A4262C]',
      author: tr(language, {
        ru: 'Эдмон Рудницка и Жан-Клод Эллена (E. Roudnitska / J.-C. Ellena)',
        en: 'Edmond Roudnitska & Jean-Claude Ellena',
        it: 'Edmond Roudnitska & Jean-Claude Ellena',
        es: 'Edmond Roudnitska y Jean-Claude Ellena',
        de: 'Edmond Roudnitska & Jean-Claude Ellena',
      }),
      title: tr(language, {
        ru: 'Парфюм и вопросы эстетики / Записки парфюмера',
        en: 'Le Parfum & L’Esthétique en Question / The Diary of a Nose',
        it: 'Il Profumo e l’Estetica in Questione / Diario di un Naso',
        es: 'El Perfume y la Estética en Cuestión / Diario de un Nariz',
        de: 'Das Parfüm und Fragen der Ästhetik / Tagebuch einer Nase',
      }),
      desc: tr(language, {
        ru: 'Продолжение идей Жана Карля: как убирать из формулы всё лишнее и создавать читаемые шедевры (Eau Sauvage, Terre d’Hermès) из коротких лаконичных аккордов.',
        en: 'Continuation of Jean Carles’ philosophy: stripping away excess ingredients to craft legible masterpieces (Eau Sauvage, Terre d’Hermès) from concise accords.',
        it: 'Prosecuzione delle idee di Jean Carles: eliminare il superfluo dalla formula per creare capolavori nitidi (Eau Sauvage, Terre d’Hermès) con accordi essenziali.',
        es: 'Continuación de las ideas de Jean Carles: eliminar lo superfluo de la fórmula para crear obras maestras nítidas (Eau Sauvage, Terre d’Hermès) con acordes concisos.',
        de: 'Fortführung von Jean Carles’ Ideen: Überflüssiges weglassen, um aus klaren, kurzen Akkorden Meisterwerke (Eau Sauvage, Terre d’Hermès) zu schaffen.',
      }),
    },
    {
      badge: tr(language, {
        ru: 'Практикум №6 · База 124 открытых формул',
        en: 'Resource #6 · 124 Open Demo Formulas',
        it: 'Risorsa n. 6 · 124 Formule Demo Aperte',
        es: 'Recurso n.º 6 · 124 Fórmulas Demo Abiertas',
        de: 'Praxis Nr. 6 · 124 offene Demo-Formeln',
      }),
      badgeClass: 'bg-[#EDEBE9] text-[#323130]',
      author: 'Fraterworks & Basenotes DIY Community',
      title: tr(language, {
        ru: 'Открытый архив учебных формул и заметок Fraterworks',
        en: 'Fraterworks Demo Formulas & Perfumery Notes Archive',
        it: 'Archivio Formule Demo e Note di Profumeria Fraterworks',
        es: 'Archivo de Fórmulas Demo y Notas de Perfumería Fraterworks',
        de: 'Fraterworks Archiv für Demo-Formeln & Parfümerie-Notizen',
      }),
      desc: tr(language, {
        ru: 'Открытый каталог исторических и современных учебных скелетов формул (все 124 формулы из PDF уже встроены в раздел «Готовые формулы» нашего приложения).',
        en: 'Open library of historical and modern study formula skeletons (all 124 PDF formulas are built directly into the “Starter Formulas” section of this studio).',
        it: 'Catalogo aperto di strutture storiche e moderne (tutte le 124 formule PDF sono già integrate nella sezione «Formule Pronte» di questa applicazione).',
        es: 'Catálogo abierto de estructuras históricas y modernas (las 124 fórmulas PDF ya están integradas en la sección «Fórmulas Listas» de esta aplicación).',
        de: 'Offenes Archiv historischer und moderner Formelskelette (alle 124 PDF-Formeln sind bereits im Bereich „Fertige Formeln“ dieser App integriert).',
      }),
      linkLabel: 'fraterworks.com/pages/demo-formulas',
      linkUrl: 'https://fraterworks.com/pages/demo-formulas',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-[#E1DFDD] bg-gradient-to-r from-[#FAF9F8] via-white to-[#F3F2F1] p-5 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--theme-accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--theme-accent)]">
              <Award className="h-3.5 w-3.5" />
              <span>
                {tr(language, {
                  ru: 'Академическая база Givaudan / Roure · Учебник для начинающих',
                  en: 'Givaudan / Roure Academic Foundation · Beginner Perfumer Guide',
                  it: 'Base Accademica Givaudan / Roure · Guida per Principianti',
                  es: 'Base Académica Givaudan / Roure · Guía para Principiantes',
                  de: 'Akademische Basis Givaudan / Roure · Leitfaden für Einsteiger',
                })}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#181917]">
              {tr(language, {
                ru: 'Метод Жана Карля (Jean Carles) и литература для новичков',
                en: 'The Jean Carles Method & Essential Perfumery Literature',
                it: 'Il Metodo Jean Carles e Letteratura per Principianti',
                es: 'El Método Jean Carles y Literatura para Principiantes',
                de: 'Die Jean-Carles-Methode & Fachliteratur für Einsteiger',
              })}
            </h2>
            <p className="text-xs leading-relaxed text-[#605E5C]">
              {tr(language, {
                ru: 'По материалам классического труда Жана Карля «A Method of Creation in Perfumery» (Recherches, 1961–1962, школа Roure / Givaudan в Грассе). Пошаговая система тренировки обоняния, классификации сырья по скорости испарения и создания парфюмерных аккордов.',
                en: 'Based on Jean Carles’ classic treatise “A Method of Creation in Perfumery” (Recherches, 1961–1962, Roure / Givaudan Perfumery School in Grasse). A systematic method for olfactory training, volatility classification, and accord construction.',
                it: 'Basato sul trattato classico di Jean Carles «A Method of Creation in Perfumery» (Recherches, 1961–1962, Scuola Roure / Givaudan di Grasse). Un sistema passo-passo per l’allenamento olfattivo, la classificazione della volatilità e la creazione di accordi.',
                es: 'Basado en el tratado clásico de Jean Carles «A Method of Creation in Perfumery» (Recherches, 1961–1962, Escuela Roure / Givaudan de Grasse). Sistema paso a paso de entrenamiento olfativo, clasificación por volatilidad y creación de acordes.',
                de: 'Basierend auf Jean Carles’ klassischem Werk „A Method of Creation in Perfumery“ (Recherches, 1961–1962, Roure / Givaudan Parfümerieschule in Grasse). Das System für Riechtraining, Flüchtigkeitsklassifikation und Akkordaufbau.',
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="https://www.icpf.online/method-creation"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 text-xs font-semibold text-[var(--theme-accent)] shadow-2xs transition-colors hover:bg-[#F3F2F1]"
            >
              <BookMarked className="h-3.5 w-3.5" />
              <span>
                {tr(language, {
                  ru: 'Статья ICPF (Метод Жана Карля)',
                  en: 'ICPF Article (Jean Carles Method)',
                  it: 'Articolo ICPF (Metodo Jean Carles)',
                  es: 'Artículo ICPF (Método Jean Carles)',
                  de: 'ICPF-Artikel (Jean-Carles-Methode)',
                })}
              </span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* Sub-navigation pills */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#EDEBE9] pt-3.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[var(--theme-accent)] text-white shadow-2xs'
                    : 'bg-white text-[#323130] border border-[#E1DFDD] hover:bg-[#F3F2F1]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 0: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-3 lg:col-span-2">
            <div className="flex items-center gap-2 text-[var(--theme-accent)]">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                {tr(language, {
                  ru: 'Почему метод Жана Карля считается фундаментом парфюмерии',
                  en: 'Why the Jean Carles Method Is the Foundation of Perfumery',
                  it: 'Perché il Metodo Jean Carles è il Fondamento della Profumeria',
                  es: 'Por qué el Método Jean Carles es la Base de la Perfumería',
                  de: 'Warum die Jean-Carles-Methode das Fundament der Parfümerie ist',
                })}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[#323130]">
              {tr(language, {
                ru: 'Жан Карль (1892–1966) — легендарный французский парфюмер, создатель Miss Dior (1947), Ma Griffe (Carven), Tabu (Dana) и основатель знаменитой парфюмерной школы Roure (ныне Givaudan). В конце жизни он полностью потерял обоняние, но продолжал создавать шедевры исключительно по памяти — благодаря строгой системе, которую сам разработал для учеников.',
                en: 'Jean Carles (1892–1966) was the legendary French perfumer behind Miss Dior (1947), Ma Griffe (Carven), and Tabu (Dana), and the founder of the famed Roure Perfumery School (now Givaudan). Toward the end of his life he lost his sense of smell completely, yet continued composing masterpieces purely from mental memory using the rigorous system he created for his students.',
                it: 'Jean Carles (1892–1966) è stato il leggendario profumiere francese creatore di Miss Dior (1947), Ma Griffe (Carven) e Tabu (Dana), nonché fondatore della celebre Scuola di Profumeria Roure (oggi Givaudan). Negli ultimi anni perse completamente l’olfatto, ma continuò a creare capolavori a memoria grazie al rigoroso metodo sviluppato per i suoi allievi.',
                es: 'Jean Carles (1892–1966) fue el legendario perfumista francés creador de Miss Dior (1947), Ma Griffe (Carven) y Tabu (Dana), y fundador de la célebre Escuela de Perfumería Roure (hoy Givaudan). Al final de su vida perdió por completo el olfato, pero siguió creando obras maestras de memoria gracias al riguroso sistema que diseñó para sus alumnos.',
                de: 'Jean Carles (1892–1966) war der legendäre französische Parfümeur hinter Miss Dior (1947), Ma Griffe (Carven) und Tabu (Dana) sowie Gründer der berühmten Parfümerieschule Roure (heute Givaudan). Gegen Ende seines Lebens verlor er seinen Geruchssinn vollständig, schuf aber dank seines strengen Systems weiterhin Meisterwerke rein aus dem Gedächtnis.',
              })}
            </p>
            <blockquote className="rounded-lg border-l-4 border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]/20 p-3.5 text-xs italic text-[#323130]">
              {tr(language, {
                ru: '«В парфюмерии не существует привилегированного "дара свыше". Как музыкант учит нотную грамоту и гаммы, так и начинающий парфюмер должен сначала натренировать ольфакторную память и научиться строить чистые простые аккорды из 2–3 веществ.» — Жан Карль',
                en: '“In perfumery there is no mystical gift reserved for a chosen few. Just as a musician learns scales and harmony, a student perfumer must first train olfactory memory and learn to build clean, simple accords of 2 to 3 materials.” — Jean Carles',
                it: '«In profumeria non esiste un dono mistico riservato a pochi eletti. Come un musicista studia le scale e l’armonia, così l’apprendista profumiere deve prima allenare la memoria olfattiva e imparare a costruire accordi semplici e puliti di 2 o 3 materie prime.» — Jean Carles',
                es: '«En perfumería no existe un don místico reservado a unos pocos. Igual que el músico estudia escalas y armonía, el aprendiz de perfumista debe entrenar primero su memoria olfativa y aprender a construir acordes limpios y sencillos de 2 o 3 materias primas.» — Jean Carles',
                de: '„In der Parfümerie gibt es keine mystische Gabe für wenige Auserwählte. Wie ein Musiker Tonleitern und Harmonielehre übt, muss auch der angehende Parfümeur zuerst sein Geruchsgedächtnis schulen und klare, einfache Akkorde aus 2 bis 3 Rohstoffen aufbauen.“ — Jean Carles',
              })}
            </blockquote>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3">
                <div className="text-xs font-bold text-[#181917]">
                  {tr(language, {
                    ru: 'Шаг 1. Память носа',
                    en: 'Step 1. Olfactory Memory',
                    it: 'Passo 1. Memoria Olfattiva',
                    es: 'Paso 1. Memoria Olfativa',
                    de: 'Schritt 1. Geruchsgedächtnis',
                  })}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-[#605E5C]">
                  {tr(language, {
                    ru: 'Изучение сырья сначала по принципу контраста (лимон vs пачули), а затем внутри одного семейства (все цитрусы, все розы).',
                    en: 'Study raw materials first by contrast (lemon vs. patchouli), then within each olfactory family (all citruses, all roses).',
                    it: 'Studio delle materie prime prima per contrasto (limone vs patchouli), poi all’interno della stessa famiglia (tutti gli agrumi, tutte le rose).',
                    es: 'Estudio de materias primas primero por contraste (limón vs. pachulí) y luego dentro de cada familia (todos los cítricos, todas las rosas).',
                    de: 'Studium der Rohstoffe zuerst nach Kontrast (Zitrone vs. Patchouli), dann innerhalb einer Familie (alle Zitrusnoten, alle Rosen).',
                  })}
                </p>
              </div>
              <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3">
                <div className="text-xs font-bold text-[#181917]">
                  {tr(language, {
                    ru: 'Шаг 2. Скорость испарения',
                    en: 'Step 2. Evaporation Curve',
                    it: 'Passo 2. Curva di Evaporazione',
                    es: 'Paso 2. Curva de Evaporación',
                    de: 'Schritt 2. Verdunstungskurve',
                  })}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-[#605E5C]">
                  {tr(language, {
                    ru: 'Деление всех веществ по поведению на блоттере на 3 этажа: Верхние ноты (15–25%), Модификаторы сердца (30–40%) и Базовые ноты (45–55%).',
                    en: 'Classify every material on the blotter into 3 tiers: Top Notes (15–25%), Heart Modifiers (30–40%), and Base Notes (45–55%).',
                    it: 'Classificazione di ogni sostanza su mouillette in 3 livelli: Testa (15–25%), Modificatori di Cuore (30–40%) e Fondo (45–55%).',
                    es: 'Clasificación de cada sustancia en el secante en 3 niveles: Salida (15–25%), Modificadores de Corazón (30–40%) y Fondo (45–55%).',
                    de: 'Einteilung aller Stoffe auf dem Riechstreifen in 3 Ebenen: Kopfnoten (15–25%), Herz-Modifikatoren (30–40%) und Basisnoten (45–55%).',
                  })}
                </p>
              </div>
              <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3">
                <div className="text-xs font-bold text-[#181917]">
                  {tr(language, {
                    ru: 'Шаг 3. Таблицы 9:1 … 1:9',
                    en: 'Step 3. 9:1 … 1:9 Series',
                    it: 'Passo 3. Serie 9:1 … 1:9',
                    es: 'Paso 3. Series 9:1 … 1:9',
                    de: 'Schritt 3. 9:1 … 1:9 Serien',
                  })}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-[#605E5C]">
                  {tr(language, {
                    ru: 'Построение аромата начинается с базового аккорда (2–3 базовых вещества в серии 9:1, 8:2 … 1:9), к которому добавляются модификаторы и верх.',
                    en: 'Every perfume begins with a base accord (2–3 base materials tested in 9:1, 8:2 … 1:9 ratios), then dressed with heart modifiers and top notes.',
                    it: 'Ogni profumo nasce da un accordo di fondo (2–3 basi testate in serie 9:1, 8:2 … 1:9), vestito poi con modificatori di cuore e note di testa.',
                    es: 'Todo perfume nace de un acorde base (2–3 bases probadas en serie 9:1, 8:2 … 1:9), vestido luego con modificadores de corazón y salida.',
                    de: 'Jedes Parfüm beginnt mit einem Basisakkord (2–3 Basisstoffe in der Reihe 9:1, 8:2 … 1:9), ergänzt durch Herz-Modifikatoren und Kopfnoten.',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Golden Rules Box */}
          <div className="rounded-xl border border-[#E1DFDD] bg-[#FAF9F8] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#181917]">
              <Lightbulb className="h-4 w-4 text-[#D97706]" />
              <h3 className="text-sm font-bold">
                {tr(language, {
                  ru: '5 золотых правил для новичка',
                  en: '5 Golden Rules for Beginners',
                  it: '5 Regole d’Oro per Principianti',
                  es: '5 Reglas de Oro para Principiantes',
                  de: '5 Goldene Regeln für Einsteiger',
                })}
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs leading-relaxed text-[#323130]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#107C41]" />
                <span>
                  <b>
                    {tr(language, {
                      ru: 'Стройте снизу вверх:',
                      en: 'Build from the base up:',
                      it: 'Costruisci dal fondo verso l’alto:',
                      es: 'Construye desde el fondo hacia arriba:',
                      de: 'Von der Basis nach oben bauen:',
                    })}
                  </b>{' '}
                  {tr(language, {
                    ru: 'сначала создайте устойчивый базовый аккорд, затем добавляйте сердце (модификаторы) и только в конце — верхние ноты.',
                    en: 'first craft a stable base accord, then add heart modifiers, and only at the end crown it with top notes.',
                    it: 'crea prima un accordo di fondo stabile, poi aggiungi i modificatori di cuore e solo alla fine le note di testa.',
                    es: 'crea primero un acorde de fondo estable, luego añade los modificadores de corazón y solo al final las notas de salida.',
                    de: 'zuerst einen stabilen Basisakkord entwickeln, dann Herz-Modifikatoren und erst zum Schluss die Kopfnoten ergänzen.',
                  })}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#107C41]" />
                <span>
                  <b>
                    {tr(language, {
                      ru: 'Краткость — сестра таланта:',
                      en: 'Simplicity wins:',
                      it: 'La semplicità vince:',
                      es: 'Menos es más:',
                      de: 'Weniger ist mehr:',
                    })}
                  </b>{' '}
                  {tr(language, {
                    ru: 'не смешивайте 30 компонентов сразу. Лучшие учебные формулы состоят из 5–10 точно выверенных веществ.',
                    en: 'do not mix 30 ingredients at once. The best study formulas consist of 5–10 accurately balanced materials.',
                    it: 'non mescolare 30 ingredienti insieme. Le migliori formule didattiche contano 5–10 materie prime ben bilanciate.',
                    es: 'no mezcles 30 ingredientes a la vez. Las mejores fórmulas de estudio constan de 5–10 materias primas bien calibradas.',
                    de: 'mischen Sie nicht 30 Stoffe gleichzeitig. Die besten Lernformeln bestehen aus 5–10 präzise abgestimmten Rohstoffen.',
                  })}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#107C41]" />
                <span>
                  <b>
                    {tr(language, {
                      ru: 'Работайте в разведениях 10% и 1%:',
                      en: 'Work in 10% & 1% dilutions:',
                      it: 'Lavora con diluizioni al 10% e 1%:',
                      es: 'Trabaja con diluciones al 10% y 1%:',
                      de: 'Mit 10%- und 1%-Verdünnungen arbeiten:',
                    })}
                  </b>{' '}
                  {tr(language, {
                    ru: 'мощные вещества (альдегиды, гальбанум, дубовый мох, уд, абсолюты) в чистом виде блокируют рецепторы.',
                    en: 'potent materials (aldehydes, galbanum, oakmoss, oud, absolutes) overwhelm olfactory receptors when smelled neat.',
                    it: 'i materiali potenti (aldeidi, galbano, muschio di quercia, oud, assolute) saturano i recettori se annusati puri.',
                    es: 'los materiales potentes (aldehídos, gálbano, musgo de roble, oud, absolutos) saturan los receptores si se huelen puros.',
                    de: 'starke Stoffe (Aldehyde, Galbanum, Eichenmoos, Oud, Absolues) überfordern unverdünnt sofort die Geruchsrezeptoren.',
                  })}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#107C41]" />
                <span>
                  <b>
                    {tr(language, {
                      ru: 'Меняйте только 1 переменную:',
                      en: 'Change one variable at a time:',
                      it: 'Cambia una sola variabile alla volta:',
                      es: 'Cambia una sola variable cada vez:',
                      de: 'Nur eine Variable pro Versuch ändern:',
                    })}
                  </b>{' '}
                  {tr(language, {
                    ru: 'между пробой №1 и пробой №2 изменяйте дозировку только одного вещества, иначе вы не поймёте причину изменений.',
                    en: 'between Trial #1 and Trial #2 adjust only one ingredient so you clearly understand its exact effect.',
                    it: 'tra la Prova #1 e la Prova #2 modifica un solo ingrediente, altrimenti non capirai cosa ha cambiato il risultato.',
                    es: 'entre la Prueba #1 y la Prueba #2 modifica un solo ingrediente para comprender exactamente su efecto.',
                    de: 'ändern Sie zwischen Test #1 und Test #2 nur einen einzigen Rohstoff, um dessen Wirkung exakt nachzuvollziehen.',
                  })}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#107C41]" />
                <span>
                  <b>
                    {tr(language, {
                      ru: 'Слушайте блоттер через 24 часа:',
                      en: 'Evaluate blotters after 24 hours:',
                      it: 'Valuta la mouillette dopo 24 ore:',
                      es: 'Evalúa el secante tras 24 horas:',
                      de: 'Riechstreifen nach 24 Stunden prüfen:',
                    })}
                  </b>{' '}
                  {tr(language, {
                    ru: 'истинное качество сцепки базы и сердца проявляется только на следующий день после испарения спирта.',
                    en: 'the true marriage of heart and base reveals itself only the next day once all alcohol and top notes have evaporated.',
                    it: 'la vera fusione tra cuore e fondo si rivela solo il giorno successivo, dopo l’evaporazione dell’alcol.',
                    es: 'la verdadera unión entre corazón y fondo se revela al día siguiente, una vez evaporado el alcohol.',
                    de: 'die wahre Verschmelzung von Herz und Basis zeigt sich erst am nächsten Tag nach dem Verdunsten des Alkohols.',
                  })}
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* SECTION 1: TRAINING */}
      {activeTab === 'training' && (
        <div className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#181917]">
              {tr(language, {
                ru: 'Часть 1. Тренировка обоняния и памяти носа',
                en: 'Part 1. Olfactory Study & Memory Training',
                it: 'Parte 1. Studio Olfattivo e Allenamento della Memoria',
                es: 'Parte 1. Estudio Olfativo y Entrenamiento de la Memoria',
                de: 'Teil 1. Riechtraining & Aufbau des Geruchsgedächtnisses',
              })}
            </h3>
            <p className="mt-1 text-xs text-[#605E5C]">
              {tr(language, {
                ru: 'Методика школы Roure / Givaudan: как выстроить в голове безошибочный каталог запахов за 4 этапа.',
                en: 'The Roure / Givaudan curriculum: how to build an unmistakable mental catalog of scents in 4 stages.',
                it: 'Il programma della scuola Roure / Givaudan: come costruire un catalogo mentale infallibile in 4 fasi.',
                es: 'El programa de la escuela Roure / Givaudan: cómo construir un catálogo mental infalible en 4 etapas.',
                de: 'Das Lehrprogramm von Roure / Givaudan: wie Sie in 4 Stufen ein sicheres mentales Duftarchiv aufbauen.',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {trainingStages.map((stage) => (
              <div
                key={stage.step}
                className="rounded-xl border border-[#EDEBE9] bg-[#FAF9F8] p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--theme-accent)] font-mono text-xs font-bold text-white">
                    {stage.step}
                  </span>
                  <h4 className="text-sm font-bold text-[#181917]">{stage.title}</h4>
                </div>
                <p className="text-xs leading-relaxed text-[#323130]">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: VOLATILITY PYRAMID */}
      {activeTab === 'pyramid' && (
        <div className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-[#181917]">
                {tr(language, {
                  ru: 'Часть 2. Классификация сырья по летучести и золотая пропорция 15 : 30 : 55',
                  en: 'Part 2. Volatility Classification & the Golden Ratio 15 : 30 : 55',
                  it: 'Parte 2. Classificazione per Volatilità e Proporzione Aurea 15 : 30 : 55',
                  es: 'Parte 2. Clasificación por Volatilidad y Proporción Áurea 15 : 30 : 55',
                  de: 'Teil 2. Flüchtigkeitsklassifikation & Goldene Proportion 15 : 30 : 55',
                })}
              </h3>
              <p className="mt-1 text-xs text-[#605E5C]">
                {tr(language, {
                  ru: 'Жан Карль рекомендует начинать сборку полноценных духов с классического баланса: 15–20% Верхние ноты · 30% Модификаторы сердца · 50–55% Базовые ноты.',
                  en: 'Jean Carles recommends structuring balanced perfumes around the classic ratio: 15–20% Top Notes · 30% Heart Modifiers · 50–55% Base Notes.',
                  it: 'Jean Carles consiglia di strutturare un profumo equilibrato secondo il rapporto classico: 15–20% Testa · 30% Modificatori di Cuore · 50–55% Fondo.',
                  es: 'Jean Carles recomienda estructurar un perfume equilibrado según la proporción clásica: 15–20% Salida · 30% Modificadores de Corazón · 50–55% Fondo.',
                  de: 'Jean Carles empfiehlt für ausgewogene Parfüms das klassische Verhältnis: 15–20% Kopfnoten · 30% Herz-Modifikatoren · 50–55% Basisnoten.',
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {volatilityColumns.map((col) => (
              <div
                key={col.title}
                className="rounded-xl border border-[#E1DFDD] overflow-hidden flex flex-col"
              >
                <div className={`${col.headerClass} border-b border-[#E1DFDD] p-3.5`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#181917]">
                      {col.title}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${col.badgeClass}`}
                    >
                      {col.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#605E5C]">{col.subtitle}</p>
                </div>
                <div className="p-3.5 space-y-2 text-xs text-[#323130] flex-1 bg-white">
                  <ul className="space-y-1.5 list-disc pl-4">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ACCORD SERIES CHARTS */}
      {activeTab === 'accords' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-4">
            <div className="flex items-center gap-2 text-[var(--theme-accent)]">
              <Scale className="h-4 w-4" />
              <h3 className="text-base font-bold text-[#181917]">
                {tr(language, {
                  ru: 'Часть 3. Метод таблиц аккордов Жана Карля (Бинарные и тройные серии)',
                  en: 'Part 3. Jean Carles Accord Series Charts (Binary & Ternary Matrices)',
                  it: 'Parte 3. Metodo delle Tabelle degli Accordi di Jean Carles (Serie Binarie e Ternarie)',
                  es: 'Parte 3. Método de Tablas de Acordes de Jean Carles (Series Binarias y Ternarias)',
                  de: 'Teil 3. Jean Carles’ Akkord-Serientabellen (Binäre & Ternäre Reihen)',
                })}
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#323130]">
              {tr(language, {
                ru: 'Как найти идеальную пропорцию двух веществ A и B? Жан Карль запрещал смешивать «на глаз». Вместо этого создаётся линейка из 9 проб по 10 капель (или 10 частей): от 9A + 1B до 1A + 9B. На практике для экономии времени и сырья Карль советовал сначала смешать только 3 ключевые точки: 8:2, 5:5 и 2:8.',
                en: 'How do you find the ideal ratio between two materials A and B? Jean Carles forbade guessing by eye. Instead, prepare a series of 9 trials totaling 10 drops (or 10 parts): from 9A + 1B to 1A + 9B. To save time and materials, Carles advised testing the 3 key checkpoints first: 8:2, 5:5, and 2:8.',
                it: 'Come trovare la proporzione ideale tra due materie prime A e B? Jean Carles vietava di mescolare «a occhio». Si prepara invece una serie di 9 prove da 10 gocce (o 10 parti): da 9A + 1B a 1A + 9B. Per risparmiare tempo e materie prime, Carles consigliava di testare prima i 3 punti chiave: 8:2, 5:5 e 2:8.',
                es: '¿Cómo encontrar la proporción ideal entre dos materias primas A y B? Jean Carles prohibía mezclar «a ojo». En su lugar, se prepara una serie de 9 pruebas de 10 gotas (o 10 partes): de 9A + 1B a 1A + 9B. Para ahorrar tiempo y material, Carles aconsejaba probar primero los 3 puntos clave: 8:2, 5:5 y 2:8.',
                de: 'Wie findet man das ideale Verhältnis zweier Rohstoffe A und B? Jean Carles lehnte das Mischen „nach Augenmaß“ ab. Stattdessen wird eine 9er-Reihe zu je 10 Tropfen (oder 10 Teilen) angelegt: von 9A + 1B bis 1A + 9B. Um Zeit und Material zu sparen, empfahl Carles zuerst die 3 Eckpunkte 8:2, 5:5 und 2:8 zu testen.',
              })}
            </p>

            {/* Binary Accord Table */}
            <div className="overflow-x-auto rounded-lg border border-[#E1DFDD]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F3F2F1] border-b border-[#E1DFDD] text-[#323130]">
                    <th className="py-2.5 px-3 font-bold">
                      {tr(language, {
                        ru: 'Вещество / Проба',
                        en: 'Material / Trial',
                        it: 'Materia Prima / Prova',
                        es: 'Materia Prima / Prueba',
                        de: 'Rohstoff / Probe',
                      })}
                    </th>
                    {ACCORD_SERIES_2.map((row, idx) => (
                      <th
                        key={idx}
                        className={`py-2.5 px-2.5 text-center font-mono ${
                          row.highlight ? 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] font-bold' : ''
                        }`}
                      >
                        #{idx + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEBE9]">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-[#181917]">
                      {tr(language, {
                        ru: 'Материал A (например, Дубовый мох 10%)',
                        en: 'Material A (e.g., Oakmoss 10%)',
                        it: 'Materiale A (es. Muschio di Quercia 10%)',
                        es: 'Material A (p. ej., Musgo de Roble 10%)',
                        de: 'Rohstoff A (z. B. Eichenmoos 10%)',
                      })}
                    </td>
                    {ACCORD_SERIES_2.map((row, idx) => (
                      <td
                        key={idx}
                        className={`py-2.5 px-2.5 text-center font-mono ${
                          row.highlight ? 'bg-[var(--theme-accent-soft)] font-bold text-[var(--theme-accent)]' : 'text-[#323130]'
                        }`}
                      >
                        {row.materialA}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-[#181917]">
                      {tr(language, {
                        ru: 'Материал B (например, Лабданум / Амбра 10%)',
                        en: 'Material B (e.g., Labdanum / Amber 10%)',
                        it: 'Materiale B (es. Labdano / Ambra 10%)',
                        es: 'Material B (p. ej., Lábdano / Ámbar 10%)',
                        de: 'Rohstoff B (z. B. Labdanum / Amber 10%)',
                      })}
                    </td>
                    {ACCORD_SERIES_2.map((row, idx) => (
                      <td
                        key={idx}
                        className={`py-2.5 px-2.5 text-center font-mono ${
                          row.highlight ? 'bg-[var(--theme-accent-soft)] font-bold text-[var(--theme-accent)]' : 'text-[#323130]'
                        }`}
                      >
                        {row.materialB}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-[#FAF9F8] text-[10px] text-[#605E5C]">
                    <td className="py-2 px-3 font-medium">
                      {tr(language, {
                        ru: 'Приоритет затеста',
                        en: 'Testing Priority',
                        it: 'Priorità di Test',
                        es: 'Prioridad de Prueba',
                        de: 'Test-Priorität',
                      })}
                    </td>
                    {ACCORD_SERIES_2.map((row, idx) => (
                      <td key={idx} className="py-2 px-2 text-center">
                        {row.label ? row.label[language] : '—'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4 Classic Jean Carles Base Accords */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#605E5C] mb-3">
                {tr(language, {
                  ru: '4 классических учебных аккорда из статьи Жана Карля (можно сразу собрать в проекте)',
                  en: '4 Classic Study Accords from Jean Carles (Ready to Build in Your Project)',
                  it: '4 Accordi Didattici Classici di Jean Carles (Pronti da Creare nel Progetto)',
                  es: '4 Acordes Clásicos de Estudio de Jean Carles (Listos para Crear en tu Proyecto)',
                  de: '4 Klassische Lern-Akkorde nach Jean Carles (Direkt im Projekt aufbaubar)',
                })}
              </h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {classicAccords.map((acc) => (
                  <div
                    key={acc.title}
                    className="rounded-xl border border-[#EDEBE9] bg-[#FAF9F8] p-3.5 space-y-1.5"
                  >
                    <div className="text-xs font-bold text-[#181917]">{acc.title}</div>
                    <p className="text-[11px] leading-relaxed text-[#605E5C]">{acc.recipe}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise of 3 Pencils */}
            <div className="rounded-xl border border-[#D2D0CE] bg-[#FAF9F8] p-4 space-y-2">
              <div className="text-xs font-bold text-[#181917]">
                {tr(language, {
                  ru: 'Упражнение Жана Карля «Три цветных карандаша» (Чёрный, Красный и Синий)',
                  en: 'Jean Carles’ “Three Colored Pencils” Exercise (Black, Red & Blue)',
                  it: 'L’Esercizio delle «Tre Matite Colorate» di Jean Carles (Nero, Rosso e Blu)',
                  es: 'El Ejercicio de los «Tres Lápices de Colores» de Jean Carles (Negro, Rojo y Azul)',
                  de: 'Jean Carles’ Übung der „Drei Farbstifte“ (Schwarz, Rot und Blau)',
                })}
              </div>
              <p className="text-xs leading-relaxed text-[#323130]">
                {tr(language, {
                  ru: 'В школе Roure студенты сдавали формулы на бумаге тремя цветами, чтобы преподаватель с одного взгляда видел архитектуру испарения:',
                  en: 'At the Roure school, students wrote their formulas using three colored pencils so the instructor could verify the evaporation architecture at a glance:',
                  it: 'Alla scuola Roure gli studenti scrivevano le formule con tre matite colorate affinché l’insegnante potesse verificare a colpo d’occhio l’architettura di evaporazione:',
                  es: 'En la escuela Roure los alumnos escribían sus fórmulas con tres lápices de colores para que el profesor viera de un vistazo la arquitectura de evaporación:',
                  de: 'An der Roure-Schule schrieben Studenten ihre Formeln mit drei Farbstiften, damit der Lehrer die Verdunstungsarchitektur auf einen Blick prüfen konnte:',
                })}
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 pt-1">
                {pencilSteps.map((p) => (
                  <div key={p.title} className="rounded-lg bg-white border border-[#E1DFDD] p-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#181917]">
                      <span className={`h-2.5 w-2.5 rounded-full ${p.dotClass}`} />
                      <span>{p.title}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#605E5C]">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: LITERATURE FOR BEGINNERS */}
      {activeTab === 'books' && (
        <div className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#181917]">
              {tr(language, {
                ru: 'Фундаментальная литература и справочники для начинающего парфюмера',
                en: 'Essential Books & Reference Guides for Aspiring Perfumers',
                it: 'Letteratura Fondamentale e Manuali per Aspiranti Profumieri',
                es: 'Literatura Fundamental y Manuales para Perfumistas Principiantes',
                de: 'Grundlegende Fachliteratur & Nachschlagewerke für angehende Parfümeure',
              })}
            </h3>
            <p className="mt-1 text-xs text-[#605E5C]">
              {tr(language, {
                ru: 'Подборка классических книг, учебников и открытых баз данных, с которых начинается обучение в парфюмерных школах.',
                en: 'Curated selection of classic textbooks, raw material encyclopedias, and open databases used in perfumery schools.',
                it: 'Selezione di testi classici, enciclopedie delle materie prime e banche dati aperte utilizzate nelle scuole di profumeria.',
                es: 'Selección de libros clásicos, enciclopedias de materias primas y bases de datos abiertas utilizadas en las escuelas de perfumería.',
                de: 'Auswahl klassischer Lehrbücher, Rohstoff-Enzyklopädien und offener Datenbanken aus der Parfümeursausbildung.',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {booksList.map((book) => (
              <div
                key={book.title}
                className="rounded-xl border border-[#E1DFDD] bg-[#FAF9F8] p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${book.badgeClass}`}
                  >
                    {book.badge}
                  </span>
                  <h4 className="text-sm font-bold text-[#181917]">{book.title}</h4>
                  <div className="text-xs font-medium text-[#605E5C]">{book.author}</div>
                  <p className="text-xs leading-relaxed text-[#323130]">{book.desc}</p>
                </div>
                {book.linkUrl && book.linkLabel && (
                  <a
                    href={book.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--theme-accent)] hover:underline"
                  >
                    <span>{book.linkLabel}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
