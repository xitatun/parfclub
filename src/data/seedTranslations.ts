import type {
  AppLanguage,
  Ingredient,
  LibraryIngredient,
  PerfumeProject,
  ProjectEstimateItem,
  PurchaseRecord,
  SaleRecord,
} from '../types/perfume';
import {
  SEED_INGREDIENTS,
  SEED_INGREDIENTS_EN,
  SEED_LIBRARY,
  SEED_LIBRARY_EN,
  SEED_PROJECT_ESTIMATES,
  SEED_PROJECT_ESTIMATES_EN,
  SEED_PROJECTS,
  SEED_PROJECTS_EN,
  SEED_PURCHASES,
  SEED_PURCHASES_EN,
  SEED_SALES,
  SEED_SALES_EN,
} from './seedData';
import { getFragranceConservatoryLibrary } from './fragranceConservatoryData';

export interface StudioSeedSnapshot {
  projects: PerfumeProject[];
  ingredients: Ingredient[];
  estimates: ProjectEstimateItem[];
  purchases: PurchaseRecord[];
  sales: SaleRecord[];
  library: LibraryIngredient[];
}

type ExtraLang = 'it' | 'es' | 'de';

interface SeedOverrideBundle {
  ingredients: Record<string, Partial<Pick<Ingredient, 'name' | 'solventNote' | 'longevityLabel' | 'storageLocation' | 'olfactoryNotes' | 'tags'>>>;
  projects: Record<
    string,
    {
      title: string;
      idea: string;
      inspiration: string;
      evaporationNotes?: string;
      components: Record<string, { name: string; note?: string }>;
      notes: Record<string, { name: string; description: string }>;
      journal: Record<
        string,
        {
          trialLabel: string;
          content: string;
          formulaSnapshotSummary?: string;
          evolution?: Record<string, { timeLabel: string; impression?: string }>;
        }
      >;
      macerations: Record<string, { label: string; notes?: string }>;
      revisions?: Record<string, { title: string; notes: string }>;
    }
  >;
  estimates: Record<string, { ingredientName: string; notes?: string }>;
  purchases: Record<string, { ingredientName: string; notes?: string }>;
  sales: Record<string, { fragranceName: string; customerOrOrder?: string; notes?: string }>;
  library: Record<
    string,
    {
      name: string;
      blotterLongevity?: string;
      properties: string;
      scentDescription: string;
      notes: Record<string, string>;
    }
  >;
}

const SEED_OVERRIDES: Record<ExtraLang, SeedOverrideBundle> = {
  it: {
    ingredients: {
      'ing-bergamot': {
        name: 'Bergamotto di Calabria FCF (Senza Bergaptene)',
        solventNote: 'Olio essenziale puro',
        longevityLabel: '1–2 h (apertura volatile)',
        storageLocation: 'Frigorifero, sportello (vetro ambrato, +4°C)',
        olfactoryNotes: 'Scorza frizzante e leggermente amara con un tocco floreale leggero.',
        tags: ['naturale'],
      },
      'ing-iso-e': {
        name: 'Iso E Super (IFF)',
        solventNote: 'Puro 100%',
        longevityLabel: '12–24 h (alta)',
        storageLocation: 'Armadio lab, ripiano A2',
        olfactoryNotes: 'Volume trasparente di cedro vellutato; collega cuore e fondo aumentando la diffusione.',
        tags: ['sintetico', 'fissativo'],
      },
      'ing-ambroxan': {
        name: 'Ambroxan (10% in Etanolo)',
        solventNote: 'Diluizione al 10% in etanolo 96%',
        longevityLabel: '24+ h (estrema)',
        storageLocation: 'Armadio lab, ripiano A1',
        olfactoryNotes: 'Calore salino-minerale di ambra grigia e legno marino; prolunga la scia.',
        tags: ['sintetico', 'fissativo'],
      },
      'ing-cedar-atlas': {
        name: 'Olio Essenziale di Cedro dell’Atlante',
        solventNote: 'Olio essenziale puro',
        longevityLabel: '8–12 h (alta)',
        storageLocation: 'Armadio lab, ripiano B1',
        olfactoryNotes: 'Legno secco e caldo, profondità resinosa e leggera sfumatura balsamica.',
        tags: ['naturale', 'retrò'],
      },
      'ing-galaxolide': {
        name: 'Galaxolide (50% in IPM)',
        solventNote: '50% in isopropil miristato',
        longevityLabel: '16–24 h (fissativo)',
        storageLocation: 'Armadio lab, ripiano A1',
        olfactoryNotes: 'Muschio pulito, morbido e leggermente dolce che arrotonda le transizioni.',
        tags: ['sintetico', 'retrò', 'fissativo'],
      },
      'ing-pink-pepper': {
        name: 'Pepe Rosa Estratto CO2',
        solventNote: 'Estratto CO2 puro',
        longevityLabel: '2–4 h (testa/cuore)',
        storageLocation: 'In arrivo (previsto: frigo)',
        olfactoryNotes: 'Scintilla speziata e vivace con sfumature fruttate di ginepro.',
        tags: ['naturale'],
      },
      'ing-jasmine-sambac': {
        name: 'Assoluta di Gelsomino Sambac (10% in DPG)',
        solventNote: 'Previsto 10% in DPG',
        longevityLabel: '8–10 h (medio-alta)',
        storageLocation: 'Previsto: armadio buio, ripiano B2',
        olfactoryNotes: 'Fiore bianco mielato e verde con ricca morbidezza naturale nel cuore.',
        tags: ['naturale', 'retrò'],
      },
      'ing-galbanum': {
        name: 'Galbano (1% in Etanolo)',
        solventNote: 'Dosaggio facile all’1%',
        longevityLabel: '3–5 h (apertura verde)',
        storageLocation: 'Previsto: armadio lab, ripiano B2',
        olfactoryNotes: 'Stelo verde spezzato e foglia rugiadosa; in microdosi ricrea la foglia di fico.',
        tags: ['naturale', 'retrò'],
      },
      'ing-ethanol': {
        name: 'Etanolo da Profumeria 96% (SDA)',
        solventNote: 'Alcol cosmetico neutro',
        longevityLabel: 'Vettore (evapora in 5 min)',
        storageLocation: 'Armadio inferiore chiuso (al buio)',
        olfactoryNotes: 'Vettore neutro e pulito; evapora senza alterare gli agrumi di testa.',
      },
    },
    projects: {
      'proj-cedar-rain': {
        title: 'Cedro del Mattino e Pioggia',
        idea: 'Un profumo legnoso-minerale trasparente di corteccia di cedro umida dopo un acquazzone notturno. Dolcezza minima, focus su aria fresca, bergamotto e scia vellutata.',
        inspiration: 'Foresta di conifere dopo la pioggia, pietra ardesia bagnata, nebbia mattutina. Stagione: primavera / inizio autunno.',
        evaporationNotes: 'Il bergamotto si apre nei primi 15–20 minuti, poi domina per 3 ore il cuore di cedro e Iso E; il fondo persiste fino a 7 ore.',
        components: {
          'fc-1': { name: 'Bergamotto di Calabria FCF', note: 'Apertura agrumata pulita' },
          'fc-2': { name: 'Iso E Super (IFF)', note: 'Struttura trasparente di cedro' },
          'fc-3': { name: 'Cedro dell’Atlante OE', note: 'Profondità resinosa di corteccia' },
          'fc-4': { name: 'Ambroxan (10% in Etanolo)', note: 'Aria minerale e fissaggio' },
          'fc-5': { name: 'Galaxolide (50% in IPM)', note: 'Ammorbidisce il passaggio agrumi-legno' },
          'fc-6': { name: 'Etanolo da Profumeria 96%', note: 'Base vettore (prova totale ~24 g)' },
        },
        notes: {
          'on-1': { name: 'Bergamotto di Calabria', description: 'Dona freschezza frizzante e scorza amara allo spruzzo iniziale.' },
          'on-2': { name: 'Pepe Rosa CO2', description: 'Solleva il bergamotto aggiungendo una freschezza nitida di pioggia.' },
          'on-3': { name: 'Iso E Super', description: 'Costruisce un volume cedrato trasparente legando testa e fondo.' },
          'on-4': { name: 'Cedro dell’Atlante', description: 'Corteccia secca e resinosa che forma la spina dorsale legnosa.' },
          'on-5': { name: 'Ambroxan', description: 'Sfumatura salina-minerale di pietra bagnata con lunga scia.' },
          'on-6': { name: 'Galaxolide', description: 'Velo muschiato morbido che leviga i bordi più secchi del cedro.' },
        },
        journal: {
          'j-1': {
            trialLabel: 'Prova #1 (appena miscelata)',
            content: 'Subito dopo la miscelazione l’etanolo spinge troppo il bergamotto mentre il cedro dell’Atlante risulta leggermente oleoso e spigoloso. Messo a macerare al buio a +18°C.',
            formulaSnapshotSummary: '24.0 g massa totale · 14.8% concentrato puro',
            evolution: {
              'ev-1-0': { timeLabel: '0m', impression: 'Esplosione netta di etanolo e bergamotto; domina l’agrume.' },
              'ev-1-15': { timeLabel: '15m', impression: 'L’agrume cala in fretta rivelando il cedro grezzo.' },
              'ev-1-60': { timeLabel: '1h', impression: 'Cuore legnoso leggermente oleoso e spigoloso.' },
              'ev-1-180': { timeLabel: '3h', impression: 'Iso E Super regge la struttura; l’ambroxan sembra separato.' },
              'ev-1-360': { timeLabel: '6h', impression: 'Residuo secco di cedro e muschio vicino alla pelle.' },
            },
          },
          'j-2': {
            trialLabel: 'Giorno 11 macerazione (mouillette + pelle)',
            content: 'Il cedro si è arrotondato notevolmente e non contrasta più con il bergamotto. L’Ambroxan rende l’effetto pietra umida. Prossimo test: aggiungere 0.15 g di pepe rosa.',
            formulaSnapshotSummary: '24.0 g massa totale · 14.8% concentrato puro',
            evolution: {
              'ev-2-0': { timeLabel: '0m', impression: 'Bergamotto frizzante e morbido senza morso alcolico.' },
              'ev-2-15': { timeLabel: '15m', impression: 'Transizione fluida verso aghi di pino bagnati e aria di pioggia.' },
              'ev-2-60': { timeLabel: '1h', impression: 'Cuore coeso e vellutato di cedro e Iso E Super.' },
              'ev-2-180': { timeLabel: '3h', impression: 'Ambroxan minerale fuso naturalmente con i legni caldi.' },
              'ev-2-360': { timeLabel: '6h', impression: 'Scia pulita di muschio avvolgente e cedro umido.' },
            },
          },
        },
        macerations: {
          'mac-1': { label: 'Maturazione concentrato (base pura)', notes: 'Riposo iniziale del concentrato legnoso-agrumato prima della diluizione.' },
          'mac-2': { label: 'Macerazione EDP 14.8% in flacone', notes: 'Affinamento della prova da 24 g al buio a +18°C.' },
        },
        revisions: {
          'rev-cr-3': {
            title: 'Cedro ammorbidito, aggiunto Galaxolide',
            notes: 'Aumentato Iso E Super da 1.40 a 1.65 g e aggiunti 0.56 g di Galaxolide per arrotondare il passaggio agrumi-legno. Al giorno 11 l’equilibrio è molto più pulito.',
          },
          'rev-cr-2': {
            title: 'Ridotto bergamotto, alzato Ambroxan',
            notes: 'Apertura di bergamotto troppo tagliente (0.95 g -> 0.72 g). Portato Ambroxan 10% a 2.10 g per l’effetto ardesia bagnata.',
          },
          'rev-cr-1': {
            title: 'Bozza iniziale della formula',
            notes: 'Prima miscela. Il cedro risulta leggermente oleoso e spigoloso; serve un ponte muschiato morbido.',
          },
        },
      },
      'proj-fig-amber': {
        title: 'Fico Caldo e Ambra',
        idea: 'Foglia di fico verde spezzata in apertura che si scalda gradualmente verso un fondo legnoso cremoso e floreale-mielato senza stucchevolezza.',
        inspiration: 'Giardino mediterraneo di fine agosto, pelle scaldata dal sole, ombra sotto un albero di fico.',
        evaporationNotes: 'Bozza formula 10 g. In attesa di galbano e gelsomino prima della prima prova fisica.',
        components: {
          'fc-21': { name: 'Bergamotto di Calabria FCF' },
          'fc-22': { name: 'Galbano (1% in Etanolo)', note: 'Linfa verde croccante di stelo' },
          'fc-23': { name: 'Assoluta di Gelsomino Sambac (10% in DPG)' },
          'fc-24': { name: 'Iso E Super (IFF)' },
          'fc-25': { name: 'Ambroxan (10% in Etanolo)' },
          'fc-26': { name: 'Etanolo da Profumeria 96%' },
        },
        notes: {
          'on-21': { name: 'Galbano 1%', description: 'Stelo verde spezzato e linfa lattiginosa di foglia di fico.' },
          'on-22': { name: 'Bergamotto', description: 'Illumina e solleva l’apertura verde.' },
          'on-23': { name: 'Gelsomino Sambac', description: 'Dona morbidezza floreale mielata e polpa fruttata.' },
          'on-24': { name: 'Iso E Super', description: 'Legnosità chiara e secca che ricorda i rami di fico.' },
          'on-25': { name: 'Ambroxan', description: 'Cuscino ambrato caldo e leggermente salino sulla pelle.' },
        },
        journal: {
          'j-21': {
            trialLabel: 'Bozza Concettuale',
            content: 'Preparato un bilancio preliminare delle materie prime. Da acquistare Galbano 1% e Gelsomino Sambac prima di miscelare una prova da 10 g.',
          },
        },
        macerations: {
          'mac-3': { label: 'Riposo concentrato (test accordo)', notes: 'Monitoraggio dell’accordo verde-ambrato.' },
        },
        revisions: {
          'rev-fa-1': {
            title: 'Bozza accordo fico verde (10 g)',
            notes: 'Impostazione iniziale prima dell’acquisto di Galbano 1% e Gelsomino Sambac. Verificare poi il dosaggio del gelsomino.',
          },
        },
      },
    },
    estimates: {
      'est-1': { ingredientName: 'Bergamotto di Calabria FCF (Senza Bergaptene)', notes: 'Per serie prove AE-01 (~13 lotti)' },
      'est-2': { ingredientName: 'Iso E Super (IFF)' },
      'est-3': { ingredientName: 'Pepe Rosa Estratto CO2', notes: 'Per correggere l’apertura nella Prova #2' },
      'est-4': { ingredientName: 'Flaconi Spray 30 ml (confezione da 5)' },
      'est-5': { ingredientName: 'Assoluta di Gelsomino Sambac (10% in DPG)' },
      'est-6': { ingredientName: 'Galbano (1% in Etanolo)' },
    },
    purchases: {
      'pur-1': { ingredientName: 'Etanolo da Profumeria 96% (SDA)', notes: 'Scorta base dello studio' },
      'pur-2': { ingredientName: 'Bergamotto di Calabria FCF (Senza Bergaptene)' },
      'pur-3': { ingredientName: 'Iso E Super (IFF)' },
      'pur-4': { ingredientName: 'Olio Essenziale di Cedro dell’Atlante' },
      'pur-5': { ingredientName: 'Pepe Rosa Estratto CO2', notes: 'Ordine #418 pagato, in consegna' },
      'pur-6': { ingredientName: 'Flaconi Spray Vetro Spesso 30 ml (Argento)', notes: 'Lotto di prova per AE-01' },
      'pur-7': { ingredientName: 'Bilancia di Precisione 0.001 g (max 50 g)', notes: 'Include peso di calibrazione' },
      'pur-8': { ingredientName: 'Fiale Campionatore 2 ml + Scatole Kraft 30 ml', notes: 'Per discovery set e spedizioni' },
      'pur-0a': { ingredientName: 'Bergamotto di Calabria FCF (Senza Bergaptene)', notes: 'Lotto precedente (prima del rincaro autunnale)' },
      'pur-0b': { ingredientName: 'Olio Essenziale di Cedro dell’Atlante', notes: 'Prima confezione prova da altro fornitore' },
    },
    sales: {
      'sale-1': { fragranceName: 'Cedro del Mattino e Pioggia (EDP 30 ml)', customerOrOrder: 'Ordine #104 · Anna K.', notes: 'Prima micro-tiratura' },
      'sale-2': { fragranceName: 'Cedro del Mattino e Pioggia (EDP 30 ml)', customerOrOrder: 'North Niche Corner' },
      'sale-3': { fragranceName: 'Cedro del Mattino Travel Spray 5 ml', customerOrOrder: 'Fiera Autunnale Profumeria Indie' },
      'sale-4': { fragranceName: 'Fico Caldo e Ambra (Pre-ordine 30 ml)', customerOrOrder: 'Ordine #119' },
    },
    library: {
      'lib-bergamot': {
        name: 'Bergamotto di Calabria FCF',
        blotterLongevity: '1–2 ore',
        properties: 'Alta volatilità. Solubile in etanolo 96% e oli. Il grado FCF (senza bergaptene) è ESENTE dal limite fototossico IFRA dello 0.4% (valido solo per olio espresso classico). Conservare in frigo al buio.',
        scentDescription: 'Apertura agrumata frizzante e nitida con scorza amara nobile, sfumature di tè Earl Grey e lieve tocco floreale di neroli.',
        notes: {
          'libn-1': 'Lega benissimo aperture balsamiche e legnose; con Iso E Super risulta più brillante e pulito.',
          'libn-2': 'Idea futura: abbinare bergamotto calabrese a foglia di fico e tè bianco per una colonia primaverile.',
        },
      },
      'lib-iso-e': {
        name: 'Iso E Super (IFF)',
        blotterLongevity: '150–170 ore (6–7 giorni)',
        properties: 'Crea un effetto "bozzolo vellutato" amplificando i materiali vicini. Uso tipico: 5–45% del concentrato (limite IFRA 51 Cat 4: 20.0% nel prodotto finito).',
        scentDescription: 'Legno di cedro trasparente e vellutato con note di carta asciutta, pelle calda e sottile ambra grigia minerale.',
        notes: { 'libn-3': 'Arrotonda nettamente gli spigoli del cedro dell’Atlante dopo 7–10 giorni di macerazione.' },
      },
      'lib-ambroxan': {
        name: 'Ambroxan',
        blotterLongevity: '48–72 ore (2–3 giorni)',
        properties: 'Polvere cristallina; ideale al 10% in etanolo o DPG (può ricristallizzare al freddo in DPG). Elevata diffusione.',
        scentDescription: 'Aria marina salina-minerale, pietra calda umida, legno alla deriva e scia pulita di ambra e muschio.',
        notes: { 'libn-4': 'All’1–3% puro ricrea la pioggia sulla pietra. Oltre il 5% può appiattire i fiori delicati.' },
      },
      'lib-osmanthus': {
        name: 'Assoluta di Osmanto 10%',
        blotterLongevity: '24–36 ore',
        properties: 'Molto viscosa pura — dosare sempre al 10% in etanolo. Alta sostantività; colora le miscele di ambra scura.',
        scentDescription: 'Buccia di albicocca vellutata matura, camoscio morbido, tè nero caldo e fiori gialli mielati su fondo cuoiato.',
        notes: { 'libn-5': 'Progetto autunnale camoscio-tè: osmanto + zafferano + sandalo + fava tonka.' },
      },
      'lib-vetiver': {
        name: 'Vetiver di Haiti',
        blotterLongevity: '24–48 ore',
        properties: 'Olio essenziale viscoso e ottimo fissativo naturale. Il cuore si apre lentamente e beneficia di 2+ settimane di macerazione.',
        scentDescription: 'Radici umide pulite, terra fresca dopo la pioggia, sfaccettatura di pompelmo e legno secco.',
        notes: { 'libn-6': 'Il vetiver di Haiti è più luminoso e agrumato rispetto a quello di Giava, meno affumicato.' },
      },
    },
  },
  es: {
    ingredients: {
      'ing-bergamot': {
        name: 'Bergamota de Calabria FCF (Sin Bergapteno)',
        solventNote: 'Aceite esencial puro',
        longevityLabel: '1–2 h (salida volátil)',
        storageLocation: 'Nevera, puerta (vidrio ámbar, +4°C)',
        olfactoryNotes: 'Cítrico chispeante y ligeramente amargo con un delicado toque floral sin pesadez.',
        tags: ['natural'],
      },
      'ing-iso-e': {
        name: 'Iso E Super (IFF)',
        solventNote: 'Puro 100%',
        longevityLabel: '12–24 h (alta)',
        storageLocation: 'Armario lab, estante A2',
        olfactoryNotes: 'Volumen de cedro aterciopelado y transparente; une corazón y fondo potenciando la difusión.',
        tags: ['sintético', 'fijador'],
      },
      'ing-ambroxan': {
        name: 'Ambroxan (10% en Etanol)',
        solventNote: 'Dilución al 10% en etanol 96%',
        longevityLabel: '24+ h (extrema)',
        storageLocation: 'Armario lab, estante A1',
        olfactoryNotes: 'Calidez salino-mineral de ámbar gris y madera marina; prolonga notablemente la estela.',
        tags: ['sintético', 'fijador'],
      },
      'ing-cedar-atlas': {
        name: 'Aceite Esencial de Cedro del Atlas',
        solventNote: 'Aceite esencial puro',
        longevityLabel: '8–12 h (alta)',
        storageLocation: 'Armario lab, estante B1',
        olfactoryNotes: 'Madera seca y cálida, profundidad resinosa y un sutil matiz balsámico.',
        tags: ['natural', 'retro'],
      },
      'ing-galaxolide': {
        name: 'Galaxolide (50% en IPM)',
        solventNote: '50% en miristato de isopropilo',
        longevityLabel: '16–24 h (fijador)',
        storageLocation: 'Armario lab, estante A1',
        olfactoryNotes: 'Almizcle limpio, suave y algo dulce que redondea las transiciones.',
        tags: ['sintético', 'retro', 'fijador'],
      },
      'ing-pink-pepper': {
        name: 'Pimienta Rosa Extracto CO2',
        solventNote: 'Extracto CO2 puro',
        longevityLabel: '2–4 h (salida/corazón)',
        storageLocation: 'En tránsito (previsto: nevera)',
        olfactoryNotes: 'Chispa especiada crujiente con un matiz luminoso afrutado de enebro.',
        tags: ['natural'],
      },
      'ing-jasmine-sambac': {
        name: 'Absoluto de Jazmín Sambac (10% en DPG)',
        solventNote: 'Previsto 10% en DPG',
        longevityLabel: '8–10 h (media-alta)',
        storageLocation: 'Previsto: armario oscuro, estante B2',
        olfactoryNotes: 'Flor blanca melosa y verde que aporta textura natural opulenta al corazón.',
        tags: ['natural', 'retro'],
      },
      'ing-galbanum': {
        name: 'Gálbano (1% en Etanol)',
        solventNote: 'Dosificación fácil al 1%',
        longevityLabel: '3–5 h (salida intensa)',
        storageLocation: 'Previsto: armario lab, estante B2',
        olfactoryNotes: 'Tallo verde recién partido y hoja húmeda; en microdosis recrea la hoja de higuera.',
        tags: ['natural', 'retro'],
      },
      'ing-ethanol': {
        name: 'Etanol de Perfumería 96% (SDA)',
        solventNote: 'Alcohol cosmético neutro',
        longevityLabel: 'Vehículo (evapora en 5 min)',
        storageLocation: 'Armario inferior cerrado (sin luz)',
        olfactoryNotes: 'Portador limpio y neutro; se evapora sin distorsionar los cítricos iniciales.',
      },
    },
    projects: {
      'proj-cedar-rain': {
        title: 'Cedro Matinal y Lluvia',
        idea: 'Un aroma amaderado-mineral transparente de corteza de cedro húmeda tras un chaparrón nocturno. Dulzor mínimo, centrado en aire fresco, bergamota y estela aterciopelada.',
        inspiration: 'Bosque de coníferas tras la lluvia, piedra pizarra mojada, niebla matinal. Estación: primavera / inicio de otoño.',
        evaporationNotes: 'La bergamota abre en los primeros 15–20 min, seguida de 3 h de corazón cedro-Iso E; el fondo perdura hasta 7 horas.',
        components: {
          'fc-1': { name: 'Bergamota de Calabria FCF', note: 'Salida cítrica limpia' },
          'fc-2': { name: 'Iso E Super (IFF)', note: 'Esqueleto transparente de cedro' },
          'fc-3': { name: 'AE Cedro del Atlas', note: 'Profundidad resinosa de corteza' },
          'fc-4': { name: 'Ambroxan (10% en Etanol)', note: 'Aire mineral y fijación' },
          'fc-5': { name: 'Galaxolide (50% en IPM)', note: 'Suaviza la transición cítrico-madera' },
          'fc-6': { name: 'Etanol de Perfumería 96%', note: 'Base portadora (prueba ~24 g)' },
        },
        notes: {
          'on-1': { name: 'Bergamota de Calabria', description: 'Aporta frescor chispeante y piel amarga en el primer spray.' },
          'on-2': { name: 'Pimienta Rosa CO2', description: 'Eleva la bergamota y suma un frescor nítido lavado por la lluvia.' },
          'on-3': { name: 'Iso E Super', description: 'Construye volumen transparente de cedro uniendo salida y fondo.' },
          'on-4': { name: 'Cedro del Atlas', description: 'Corteza seca resinosa que forma la columna vertebral amaderada.' },
          'on-5': { name: 'Ambroxan', description: 'Matiz salino-mineral de piedra húmeda con estela duradera.' },
          'on-6': { name: 'Galaxolide', description: 'Velo almizclado suave que pule las aristas más secas del cedro.' },
        },
        journal: {
          'j-1': {
            trialLabel: 'Prueba #1 (recién mezclada)',
            content: 'Justo tras mezclar, el etanol empuja demasiado la bergamota mientras el cedro del Atlas se siente algo aceitoso y cortante. Guardado en armario oscuro a +18°C para macerar.',
            formulaSnapshotSummary: '24.0 g masa total · 14.8% concentrado puro',
            evolution: {
              'ev-1-0': { timeLabel: '0m', impression: 'Estallido intenso de etanol y bergamota; domina el cítrico.' },
              'ev-1-15': { timeLabel: '15m', impression: 'El cítrico cae rápido revelando el cedro crudo.' },
              'ev-1-60': { timeLabel: '1h', impression: 'Corazón amaderado ligeramente aceitoso y angular.' },
              'ev-1-180': { timeLabel: '3h', impression: 'Iso E Super sostiene el marco; el ambroxan se nota separado.' },
              'ev-1-360': { timeLabel: '6h', impression: 'Fondo seco de cedro y almizcle a ras de piel.' },
            },
          },
          'j-2': {
            trialLabel: 'Día 11 de maceración (secante + piel)',
            content: 'El cedro se ha redondeado mucho y ya no choca con la bergamota. Ambroxan logra la sensación exacta de piedra mojada. Siguiente paso: añadir 0.15 g de pimienta rosa.',
            formulaSnapshotSummary: '24.0 g masa total · 14.8% concentrado puro',
            evolution: {
              'ev-2-0': { timeLabel: '0m', impression: 'Bergamota chispeante y suave sin golpe alcohólico.' },
              'ev-2-15': { timeLabel: '15m', impression: 'Transición fluida a agujas de pino húmedas y aire de lluvia.' },
              'ev-2-60': { timeLabel: '1h', impression: 'Corazón cohesionado y aterciopelado de cedro e Iso E Super.' },
              'ev-2-180': { timeLabel: '3h', impression: 'Ambroxan mineral fundido naturalmente con maderas cálidas.' },
              'ev-2-360': { timeLabel: '6h', impression: 'Estela limpia de almizcle envolvente y cedro húmedo.' },
            },
          },
        },
        macerations: {
          'mac-1': { label: 'Maduración del concentrado (base pura)', notes: 'Reposo inicial del concentrado amaderado-cítrico antes de diluir.' },
          'mac-2': { label: 'Maceración EDP 14.8% en frasco', notes: 'Reposo de la prueba de 24 g en armario oscuro a +18°C.' },
        },
        revisions: {
          'rev-cr-3': {
            title: 'Cedro suavizado, añadido Galaxolide',
            notes: 'Subido Iso E Super de 1.40 a 1.65 g y añadidos 0.56 g de Galaxolide para suavizar la transición cítrico-madera. En el día 11 el balance es mucho más limpio.',
          },
          'rev-cr-2': {
            title: 'Reducida bergamota, subido Ambroxan',
            notes: 'La salida de bergamota era demasiado cortante (0.95 g -> 0.72 g). Subido Ambroxan 10% a 2.10 g para el acorde de pizarra mojada.',
          },
          'rev-cr-1': {
            title: 'Boceto inicial de la fórmula',
            notes: 'Primera mezcla. El cedro se percibe algo oleoso y anguloso; hace falta un puente de almizcle suave.',
          },
        },
      },
      'proj-fig-amber': {
        title: 'Higo Cálido y Ámbar',
        idea: 'Hoja verde de higuera recién partida al inicio que se entibia hacia un fondo amaderado cremoso y floral-meloso sin empalagar.',
        inspiration: 'Huerto mediterráneo a finales de agosto, piel tibia al sol, sombra bajo una higuera.',
        evaporationNotes: 'Borrador de 10 g. Esperando entrega de gálbano y jazmín antes de la primera prueba física.',
        components: {
          'fc-21': { name: 'Bergamota de Calabria FCF' },
          'fc-22': { name: 'Gálbano (1% en Etanol)', note: 'Savia verde crujiente de tallo' },
          'fc-23': { name: 'Absoluto de Jazmín Sambac (10% en DPG)' },
          'fc-24': { name: 'Iso E Super (IFF)' },
          'fc-25': { name: 'Ambroxan (10% en Etanol)' },
          'fc-26': { name: 'Etanol de Perfumería 96%' },
        },
        notes: {
          'on-21': { name: 'Gálbano 1%', description: 'Tallo verde partido y savia lechosa de hoja de higuera.' },
          'on-22': { name: 'Bergamota', description: 'Ilumina y eleva la salida verde.' },
          'on-23': { name: 'Jazmín Sambac', description: 'Aporta suavidad floral melosa y plenitud frutal.' },
          'on-24': { name: 'Iso E Super', description: 'Madera pálida y seca que recuerda a las ramas de higuera.' },
          'on-25': { name: 'Ambroxan', description: 'Cojín ambarino cálido y sutilmente salino sobre la piel.' },
        },
        journal: {
          'j-21': {
            trialLabel: 'Borrador Conceptual',
            content: 'Equilibrio preliminar de materias primas listo. Falta comprar Gálbano 1% y Jazmín Sambac antes de formular 10 g de prueba.',
          },
        },
        macerations: {
          'mac-3': { label: 'Reposo del concentrado (prueba acorde)', notes: 'Seguimiento de la mezcla verde-ámbar.' },
        },
        revisions: {
          'rev-fa-1': {
            title: 'Borrador acorde higo verde (10 g)',
            notes: 'Distribución inicial antes de comprar Gálbano 1% y Jazmín Sambac. Probar después la proporción de jazmín.',
          },
        },
      },
    },
    estimates: {
      'est-1': { ingredientName: 'Bergamota de Calabria FCF (Sin Bergapteno)', notes: 'Para serie de pruebas AE-01 (~13 lotes)' },
      'est-2': { ingredientName: 'Iso E Super (IFF)' },
      'est-3': { ingredientName: 'Pimienta Rosa Extracto CO2', notes: 'Para ajuste de salida en Prueba #2' },
      'est-4': { ingredientName: 'Frascos Spray 30 ml (pack de 5)' },
      'est-5': { ingredientName: 'Absoluto de Jazmín Sambac (10% en DPG)' },
      'est-6': { ingredientName: 'Gálbano (1% en Etanol)' },
    },
    purchases: {
      'pur-1': { ingredientName: 'Etanol de Perfumería 96% (SDA)', notes: 'Stock base del taller' },
      'pur-2': { ingredientName: 'Bergamota de Calabria FCF (Sin Bergapteno)' },
      'pur-3': { ingredientName: 'Iso E Super (IFF)' },
      'pur-4': { ingredientName: 'Aceite Esencial de Cedro del Atlas' },
      'pur-5': { ingredientName: 'Pimienta Rosa Extracto CO2', notes: 'Pedido #418 pagado, en reparto' },
      'pur-6': { ingredientName: 'Frascos Vidrio Grueso 30 ml (Atomizador Plata)', notes: 'Lote de prueba para AE-01' },
      'pur-7': { ingredientName: 'Báscula de Precisión 0.001 g (máx. 50 g)', notes: 'Incluye pesa de calibración' },
      'pur-8': { ingredientName: 'Viales Muestra 2 ml + Cajas Kraft 30 ml', notes: 'Para sets de descubrimiento y envíos' },
      'pur-0a': { ingredientName: 'Bergamota de Calabria FCF (Sin Bergapteno)', notes: 'Lote anterior (antes de la subida de otoño)' },
      'pur-0b': { ingredientName: 'Aceite Esencial de Cedro del Atlas', notes: 'Primer envase de prueba con otro proveedor' },
    },
    sales: {
      'sale-1': { fragranceName: 'Cedro Matinal y Lluvia (EDP 30 ml)', customerOrOrder: 'Pedido #104 · Anna K.', notes: 'Primer microlote' },
      'sale-2': { fragranceName: 'Cedro Matinal y Lluvia (EDP 30 ml)', customerOrOrder: 'North Niche Corner' },
      'sale-3': { fragranceName: 'Cedro Matinal Travel Spray 5 ml', customerOrOrder: 'Feria de Perfumería Indie de Otoño' },
      'sale-4': { fragranceName: 'Higo Cálido y Ámbar (Preventa 30 ml)', customerOrOrder: 'Pedido #119' },
    },
    library: {
      'lib-bergamot': {
        name: 'Bergamota de Calabria FCF',
        blotterLongevity: '1–2 horas',
        properties: 'Alta volatilidad. Soluble en etanol 96% y aceites. El grado FCF (sin bergapteno) está EXENTO del límite fototóxico IFRA del 0.4% (aplicable solo al aceite prensado normal). Guardar refrigerado en vidrio ámbar.',
        scentDescription: 'Salida cítrica chispeante y nítida con piel amarga noble, matices de té Earl Grey y delicado toque floral tipo neroli.',
        notes: {
          'libn-1': 'Une muy bien salidas de pino y madera; junto a Iso E Super suena más limpia y luminosa.',
          'libn-2': 'Idea futura: combinar bergamota de Calabria con hoja de higuera y té blanco para una colonia primaveral.',
        },
      },
      'lib-iso-e': {
        name: 'Iso E Super (IFF)',
        blotterLongevity: '150–170 horas (6–7 días)',
        properties: 'Crea un "capullo aterciopelado" y amplifica materiales vecinos. Uso habitual: 5–45% del concentrado (límite IFRA 51 Cat 4: 20.0% en producto final).',
        scentDescription: 'Cedro transparente y aterciopelado con matices de papel seco, piel cálida y ámbar gris mineral sutil.',
        notes: { 'libn-3': 'Redondea visiblemente las aristas del cedro del Atlas tras 7–10 días de maceración.' },
      },
      'lib-ambroxan': {
        name: 'Ambroxan',
        blotterLongevity: '48–72 horas (2–3 días)',
        properties: 'Polvo cristalino; mejor al 10% en etanol o DPG (puede recristalizar en DPG frío). Alta difusión.',
        scentDescription: 'Aire marino salino-mineral, piedra tibia húmeda, madera flotante seca y estela limpia de ámbar y almizcle.',
        notes: { 'libn-4': 'Al 1–3% puro logra un efecto auténtico de lluvia sobre piedra. Por encima del 5% apaga flores suaves.' },
      },
      'lib-osmanthus': {
        name: 'Absoluto de Osmanto 10%',
        blotterLongevity: '24–36 horas',
        properties: 'Muy viscoso puro — dosificar siempre al 10% en etanol. Alta sustantividad; tiñe de ámbar oscuro las mezclas.',
        scentDescription: 'Piel madura y aterciopelada de albaricoque, ante suave, té negro cálido y flores amarillas melosas con fondo de cuero.',
        notes: { 'libn-5': 'Planear composición otoñal ante-té: osmanto + azafrán + sándalo + haba tonka.' },
      },
      'lib-vetiver': {
        name: 'Vetiver de Haití',
        blotterLongevity: '24–48 horas',
        properties: 'Aceite esencial viscoso y potente fijador natural. El corazón abre despacio y agradece 2+ semanas de maceración.',
        scentDescription: 'Raíces húmedas limpias, tierra fresca tras la lluvia, faceta cítrica de pomelo y madera seca.',
        notes: { 'libn-6': 'El vetiver de Haití es más brillante y cítrico que el de Java; menos ahumado y fácil de combinar.' },
      },
    },
  },
  de: {
    ingredients: {
      'ing-bergamot': {
        name: 'Kalabrische Bergamotte FCF (Bergaptenfrei)',
        solventNote: 'Reines ätherisches Öl',
        longevityLabel: '1–2 Std. (flüchtiger Auftakt)',
        storageLocation: 'Kühlschranktür (Braunglas, +4°C)',
        olfactoryNotes: 'Spritzige, leicht herbe Zitrusschale mit zarter floraler Leichtigkeit.',
        tags: ['natürlich'],
      },
      'ing-iso-e': {
        name: 'Iso E Super (IFF)',
        solventNote: 'Rein 100%',
        longevityLabel: '12–24 Std. (hoch)',
        storageLocation: 'Laborschrank, Fach A2',
        olfactoryNotes: 'Transparentes, samtiges Zedernholzvolumen; verbindet Herz und Basis und steigert die Diffusion.',
        tags: ['synthetisch', 'Fixateur'],
      },
      'ing-ambroxan': {
        name: 'Ambroxan (10% in Ethanol)',
        solventNote: '10% Verdünnung in Ethanol 96%',
        longevityLabel: '24+ Std. (extrem)',
        storageLocation: 'Laborschrank, Fach A1',
        olfactoryNotes: 'Salzig-mineralische Ambra-Wärme und Treibholz; verlängert die Sillage deutlich.',
        tags: ['synthetisch', 'Fixateur'],
      },
      'ing-cedar-atlas': {
        name: 'Atlas-Zedernholz ÄÖ',
        solventNote: 'Reines ätherisches Öl',
        longevityLabel: '8–12 Std. (hoch)',
        storageLocation: 'Laborschrank, Fach B1',
        olfactoryNotes: 'Trockenes warmes Holz, harzige Tiefe und feiner balsamischer Unterton.',
        tags: ['natürlich', 'retro'],
      },
      'ing-galaxolide': {
        name: 'Galaxolide (50% in IPM)',
        solventNote: '50% in Isopropylmyristat',
        longevityLabel: '16–24 Std. (Fixateur)',
        storageLocation: 'Laborschrank, Fach A1',
        olfactoryNotes: 'Sauberer, weicher, leicht süßer Moschus, der harte Übergänge abrundet.',
        tags: ['synthetisch', 'retro', 'Fixateur'],
      },
      'ing-pink-pepper': {
        name: 'Rosa Pfeffer CO2-Extrakt',
        solventNote: 'Reiner CO2-Extrakt',
        longevityLabel: '2–4 Std. (Kopf/Herz)',
        storageLocation: 'Im Zulauf (geplant: Kühlschrank)',
        olfactoryNotes: 'Knackig-würziger Funke mit heller fruchtiger Wacholdernote.',
        tags: ['natürlich'],
      },
      'ing-jasmine-sambac': {
        name: 'Jasmin Sambac Absolue (10% in DPG)',
        solventNote: 'Geplant 10% in DPG',
        longevityLabel: '8–10 Std. (mittel-hoch)',
        storageLocation: 'Geplant: dunkler Schrank, Fach B2',
        olfactoryNotes: 'Honigsüß-grüne weiße Blüte für üppige natürliche Textur im Herzen.',
        tags: ['natürlich', 'retro'],
      },
      'ing-galbanum': {
        name: 'Galbanum (1% in Ethanol)',
        solventNote: 'Einfache Dosierung mit 1%',
        longevityLabel: '3–5 Std. (markanter Auftakt)',
        storageLocation: 'Geplant: Laborschrank, Fach B2',
        olfactoryNotes: 'Frisch gebrochener grüner Stängel und taufrisches Blatt; in Mikrodosen wie Feigenblatt.',
        tags: ['natürlich', 'retro'],
      },
      'ing-ethanol': {
        name: 'Parfümeur-Ethanol 96% (SDA)',
        solventNote: 'Neutraler Kosmetikalkohol',
        longevityLabel: 'Träger (verdunstet in 5 Min.)',
        storageLocation: 'Unterer geschlossener Schrank (lichtgeschützt)',
        olfactoryNotes: 'Sauberer neutraler Träger; verdunstet rückstandsfrei ohne Zitrusnoten zu verfälschen.',
      },
    },
    projects: {
      'proj-cedar-rain': {
        title: 'Morgenzeder & Regen',
        idea: 'Ein transparenter holzig-mineralischer Duft von feuchter Zedernrinde nach einem Nachtgewitter. Kaum Süße, Fokus auf kühle Luft, Bergamotte und samtige Holz-Sillage.',
        inspiration: 'Nadelwald nach dem Regen, nasser Schieferstein, Morgennebel. Saison: Frühling / Frühherbst.',
        evaporationNotes: 'Bergamotte öffnet in den ersten 15–20 Minuten, gefolgt von 3 Std. Zeder-Iso E Herz; die Basis hält bis zu 7 Stunden.',
        components: {
          'fc-1': { name: 'Kalabrische Bergamotte FCF', note: 'Sauberer Zitrus-Auftakt' },
          'fc-2': { name: 'Iso E Super (IFF)', note: 'Transparentes Zedern-Gerüst' },
          'fc-3': { name: 'Atlas-Zedernholz ÄÖ', note: 'Harzige Rindentiefe' },
          'fc-4': { name: 'Ambroxan (10% in Ethanol)', note: 'Mineralische Luft und Fixierung' },
          'fc-5': { name: 'Galaxolide (50% in IPM)', note: 'Weicher Übergang von Zitrus zu Holz' },
          'fc-6': { name: 'Parfümeur-Ethanol 96%', note: 'Trägerbasis (~24 g Testansatz)' },
        },
        notes: {
          'on-1': { name: 'Kalabrische Bergamotte', description: 'Sorgt beim ersten Sprühen für spritzige Kühle und herbe Schale.' },
          'on-2': { name: 'Rosa Pfeffer CO2', description: 'Hebt die Bergamotte und bringt klare Regenfrische.' },
          'on-3': { name: 'Iso E Super', description: 'Schafft transparentes Zedernvolumen und verbindet Kopf mit Basis.' },
          'on-4': { name: 'Atlas-Zedernholz', description: 'Trockene harzige Rinde als holziges Rückgrat.' },
          'on-5': { name: 'Ambroxan', description: 'Salzig-mineralische Nassstein-Facette mit langer Sillage.' },
          'on-6': { name: 'Galaxolide', description: 'Weicher Moschusschleier, der die Kanten der Zeder glättet.' },
        },
        journal: {
          'j-1': {
            trialLabel: 'Test #1 (frisch gemischt)',
            content: 'Direkt nach dem Mischen drückt der Alkohol die Bergamotte stark nach vorn, während Atlaszeder etwas ölig und kantig wirkt. Zur Reifung dunkel bei +18°C gelagert.',
            formulaSnapshotSummary: '24.0 g Gesamtmasse · 14.8% reines Konzentrat',
            evolution: {
              'ev-1-0': { timeLabel: '0m', impression: 'Scharfer Alkohol-Bergamotte-Auftakt; Zitrus dominiert sofort.' },
              'ev-1-15': { timeLabel: '15m', impression: 'Zitrus fällt schnell ab, rohes Zedernholz tritt hervor.' },
              'ev-1-60': { timeLabel: '1h', impression: 'Holziges Herz wirkt noch leicht ölig und kantig.' },
              'ev-1-180': { timeLabel: '3h', impression: 'Iso E Super hält das Gerüst; Ambroxan wirkt abgesetzt.' },
              'ev-1-360': { timeLabel: '6h', impression: 'Trockener Zeder-Moschus-Hautduft nah am Handgelenk.' },
            },
          },
          'j-2': {
            trialLabel: 'Tag 11 Reifung (Duftstreifen + Haut)',
            content: 'Zeder ist deutlich runder geworden und beißt sich nicht mehr mit Bergamotte. Ambroxan liefert genau das Nassstein-Gefühl. Nächster Schritt: 0.15 g Rosa Pfeffer ergänzen.',
            formulaSnapshotSummary: '24.0 g Gesamtmasse · 14.8% reines Konzentrat',
            evolution: {
              'ev-2-0': { timeLabel: '0m', impression: 'Sanfte spritzige Bergamotte ohne scharfen Alkoholstich.' },
              'ev-2-15': { timeLabel: '15m', impression: 'Nahtloser Übergang in nasse Kiefernnadeln und Regenluft.' },
              'ev-2-60': { timeLabel: '1h', impression: 'Stimmiges, samtiges Herz aus Zeder und Iso E Super.' },
              'ev-2-180': { timeLabel: '3h', impression: 'Mineralisches Ambroxan verschmilzt natürlich mit warmem Holz.' },
              'ev-2-360': { timeLabel: '6h', impression: 'Saubere einhüllende Moschus- und feuchte Zedern-Sillage.' },
            },
          },
        },
        macerations: {
          'mac-1': { label: 'Konzentrat-Reifung (reine Basis)', notes: 'Erste Ruhephase des holzig-zitrischen Konzentrats vor dem Verdünnen.' },
          'mac-2': { label: 'EDP 14.8% Flakon-Reifung', notes: 'Reifung des 24-g-Tests im dunklen Schrank bei +18°C.' },
        },
        revisions: {
          'rev-cr-3': {
            title: 'Zeder geglättet, Galaxolide ergänzt',
            notes: 'Iso E Super von 1.40 auf 1.65 g erhöht und 0.56 g Galaxolide für einen weicheren Übergang zwischen Bergamotte und Holz ergänzt. An Tag 11 deutlich stimmiger.',
          },
          'rev-cr-2': {
            title: 'Bergamotte reduziert, Ambroxan erhöht',
            notes: 'Der Auftakt mit Bergamotte war zu spitz (0.95 g -> 0.72 g). Ambroxan 10% auf 2.10 g für den feuchten Schiefer-Effekt erhöht.',
          },
          'rev-cr-1': {
            title: 'Erster Formelentwurf',
            notes: 'Erster Ansatz. Zeder wirkt etwas ölig und kantig; eine weiche Moschus-Brücke fehlt.',
          },
        },
      },
      'proj-fig-amber': {
        title: 'Warme Feige & Amber',
        idea: 'Geknicktes grünes Feigenblatt im Auftakt, das langsam in eine cremig-holzige und honigblumige Basis übergeht ohne zu süß zu werden.',
        inspiration: 'Spätsommerlicher Obstgarten im August, sonnenwarme Haut, Schatten unter einem Feigenbaum.',
        evaporationNotes: '10-g-Entwurf. Warten auf Galbanum- und Jasmin-Lieferung vor dem ersten physischen Test.',
        components: {
          'fc-21': { name: 'Kalabrische Bergamotte FCF' },
          'fc-22': { name: 'Galbanum (1% in Ethanol)', note: 'Knackiger grüner Pflanzensaft' },
          'fc-23': { name: 'Jasmin Sambac Absolue (10% in DPG)' },
          'fc-24': { name: 'Iso E Super (IFF)' },
          'fc-25': { name: 'Ambroxan (10% in Ethanol)' },
          'fc-26': { name: 'Parfümeur-Ethanol 96%' },
        },
        notes: {
          'on-21': { name: 'Galbanum 1%', description: 'Frisch gebrochener Stängel und milchiger Saft eines Feigenblatts.' },
          'on-22': { name: 'Bergamotte', description: 'Hellt den grünen Auftakt auf und gibt Auftrieb.' },
          'on-23': { name: 'Jasmin Sambac', description: 'Bringt honig-florale Weichheit und Fruchtfleisch-Fülle.' },
          'on-24': { name: 'Iso E Super', description: 'Trockenes helles Holz, das an Feigenzweige erinnert.' },
          'on-25': { name: 'Ambroxan', description: 'Warmes, leicht salziges Amber-Kissen auf der Haut.' },
        },
        journal: {
          'j-21': {
            trialLabel: 'Konzeptentwurf',
            content: 'Vorläufige Rohstoffbalance erstellt. Galbanum 1% und Jasmin Sambac müssen noch vor dem 10-g-Test beschafft werden.',
          },
        },
        macerations: {
          'mac-3': { label: 'Konzentrat-Ruhephase (Akkordtest)', notes: 'Beobachtung des grün-ambrigen Konzentrats.' },
        },
        revisions: {
          'rev-fa-1': {
            title: 'Entwurf grüner Feigenakkord (10 g)',
            notes: 'Erste Aufteilung vor dem Kauf von Galbanum 1% und Jasmin Sambac. Danach Jasminanteil testen.',
          },
        },
      },
    },
    estimates: {
      'est-1': { ingredientName: 'Kalabrische Bergamotte FCF (Bergaptenfrei)', notes: 'Für AE-01 Testserie (reicht für ~13 Ansätze)' },
      'est-2': { ingredientName: 'Iso E Super (IFF)' },
      'est-3': { ingredientName: 'Rosa Pfeffer CO2-Extrakt', notes: 'Für Auftakt-Anpassung in Test #2' },
      'est-4': { ingredientName: '30 ml Sprühflakons (5er-Pack)' },
      'est-5': { ingredientName: 'Jasmin Sambac Absolue (10% in DPG)' },
      'est-6': { ingredientName: 'Galbanum (1% in Ethanol)' },
    },
    purchases: {
      'pur-1': { ingredientName: 'Parfümeur-Ethanol 96% (SDA)', notes: 'Atelier-Grundbestand' },
      'pur-2': { ingredientName: 'Kalabrische Bergamotte FCF (Bergaptenfrei)' },
      'pur-3': { ingredientName: 'Iso E Super (IFF)' },
      'pur-4': { ingredientName: 'Atlas-Zedernholz ÄÖ' },
      'pur-5': { ingredientName: 'Rosa Pfeffer CO2-Extrakt', notes: 'Bestellung #418 bezahlt, unterwegs' },
      'pur-6': { ingredientName: '30 ml Dickglas-Sprühflakons (Silber-Zerstäuber)', notes: 'Testcharge für AE-01' },
      'pur-7': { ingredientName: '0.001 g Präzisions-Laborwaage (bis 50 g)', notes: 'Inklusive Kalibriergewicht' },
      'pur-8': { ingredientName: '2 ml Glas-Testphiolen + 30 ml Kraftkartons', notes: 'Für Discovery Sets und Versand' },
      'pur-0a': { ingredientName: 'Kalabrische Bergamotte FCF (Bergaptenfrei)', notes: 'Vorherige Erntecharge (vor Preiserhöhung im Herbst)' },
      'pur-0b': { ingredientName: 'Atlas-Zedernholz ÄÖ', notes: 'Erste Testpackung von alternativem Lieferanten' },
    },
    sales: {
      'sale-1': { fragranceName: 'Morgenzeder & Regen (EDP 30 ml)', customerOrOrder: 'Bestellung #104 · Anna K.', notes: 'Erste Kleinstauflage' },
      'sale-2': { fragranceName: 'Morgenzeder & Regen (EDP 30 ml)', customerOrOrder: 'North Niche Corner' },
      'sale-3': { fragranceName: 'Morgenzeder Travel Spray 5 ml', customerOrOrder: 'Herbst-Indie-Parfümmesse' },
      'sale-4': { fragranceName: 'Warme Feige & Amber (Vorbestellung 30 ml)', customerOrOrder: 'Bestellung #119' },
    },
    library: {
      'lib-bergamot': {
        name: 'Kalabrische Bergamotte FCF',
        blotterLongevity: '1–2 Stunden',
        properties: 'Hohe Flüchtigkeit. Gut löslich in Ethanol 96% und Trägerölen. FCF-Qualität (bergaptenfrei) ist vom phototoxischen 0.4%-IFRA-Limit BEFREIT (gilt nur für kaltgepresstes Öl mit Bergapten). Gekühlt im Braunglas lagern.',
        scentDescription: 'Spritziger, klarer Zitrusauftakt mit edler bitterer Schale, Earl-Grey-Tee-Nuancen und zarter Neroli-Blütenfrische.',
        notes: {
          'libn-1': 'Verbindet Nadel- und Holzauftakte mühelos; wirkt mit Iso E Super heller und klarer.',
          'libn-2': 'Idee: Kalabrische Bergamotte mit Feigenblatt und weißem Tee für ein Frühlings-Cologne kombinieren.',
        },
      },
      'lib-iso-e': {
        name: 'Iso E Super (IFF)',
        blotterLongevity: '150–170 Stunden (6–7 Tage)',
        properties: 'Erzeugt einen "Samtkokon" und verstärkt benachbarte Stoffe. Übliche Dosierung: 5–45% des Konzentrats (IFRA 51 Kat. 4 Limit: 20.0% im Endprodukt).',
        scentDescription: 'Transparentes, samtiges Zedernholz mit Nuancen von trockenem Papier, warmer Haut und feiner mineralischer Ambra.',
        notes: { 'libn-3': 'Rundet scharfe Kanten von Atlaszeder nach 7–10 Tagen Reifung deutlich ab.' },
      },
      'lib-ambroxan': {
        name: 'Ambroxan',
        blotterLongevity: '48–72 Stunden (2–3 Tage)',
        properties: 'Kristallines Pulver; am besten als 10%-Verdünnung in Ethanol oder DPG (kann in kaltem DPG auskristallisieren). Starke Diffusion.',
        scentDescription: 'Salzig-mineralische Meeresluft, feuchter warmer Stein, trockenes Treibholz und sauberer Amber-Moschus-Nachhall.',
        notes: { 'libn-4': 'Bei 1–3% rein entsteht ein echter Regen-auf-Stein-Effekt. Über 5% kann es zarte Blüten überdecken.' },
      },
      'lib-osmanthus': {
        name: 'Osmanthus Absolue 10%',
        blotterLongevity: '24–36 Stunden',
        properties: 'Pur sehr zähflüssig — stets als 10%-Verdünnung in Ethanol dosieren. Hohe Haftung; färbt Mischungen dunkelbernsteinfarben.',
        scentDescription: 'Reife samtige Aprikosenschale, geschmeidiges Wildleder, warmer Schwarztee und honigsüße gelbe Blüten auf Lederbasis.',
        notes: { 'libn-5': 'Herbstprojekt Wildleder-Tee planen: Osmanthus + Safran + Sandelholz + Tonkabohne.' },
      },
      'lib-vetiver': {
        name: 'Haiti-Vetiver',
        blotterLongevity: '24–48 Stunden',
        properties: 'Zähflüssiges ätherisches Öl und starker natürlicher Fixateur. Das Herz entfaltet sich langsam und profitiert von 2+ Wochen Reifung.',
        scentDescription: 'Saubere feuchte Wurzeln, kühle Erde nach dem Regen, frische Grapefruitschale und trockenes Nuss-Holz.',
        notes: { 'libn-6': 'Haiti-Vetiver ist heller und zitrischer als Java-Vetiver — weniger rauchig, leichter mit frischen Hölzern kombinierbar.' },
      },
    },
  },
};

function applySeedOverrides(base: StudioSeedSnapshot, ov: SeedOverrideBundle): StudioSeedSnapshot {
  const ingredients = base.ingredients.map((ing) => {
    const patch = ov.ingredients[ing.id];
    return patch ? { ...ing, ...patch } : ing;
  });

  const projects = base.projects.map((p) => {
    const po = ov.projects[p.id];
    if (!po) return p;
    return {
      ...p,
      title: po.title,
      idea: po.idea,
      inspiration: po.inspiration,
      components: p.components.map((c) => {
        const co = po.components[c.id];
        return co ? { ...c, name: co.name, note: co.note ?? c.note } : c;
      }),
      olfactoryMap: {
        ...p.olfactoryMap,
        evaporationNotes: po.evaporationNotes ?? p.olfactoryMap.evaporationNotes,
        topNotes: p.olfactoryMap.topNotes.map((n) => (po.notes[n.id] ? { ...n, ...po.notes[n.id] } : n)),
        heartNotes: p.olfactoryMap.heartNotes.map((n) => (po.notes[n.id] ? { ...n, ...po.notes[n.id] } : n)),
        baseNotes: p.olfactoryMap.baseNotes.map((n) => (po.notes[n.id] ? { ...n, ...po.notes[n.id] } : n)),
      },
      journal: p.journal.map((j) => {
        const jo = po.journal[j.id];
        if (!jo) return j;
        return {
          ...j,
          trialLabel: jo.trialLabel,
          content: jo.content,
          formulaSnapshotSummary: jo.formulaSnapshotSummary ?? j.formulaSnapshotSummary,
          scentEvolution: j.scentEvolution?.map((pt) => {
            const eo = jo.evolution?.[pt.id];
            return eo ? { ...pt, ...eo } : pt;
          }),
        };
      }),
      macerations: (p.macerations || []).map((m) => {
        const mo = po.macerations[m.id];
        return mo ? { ...m, label: mo.label, notes: mo.notes ?? m.notes } : m;
      }),
      revisions: (p.revisions || []).map((r) => {
        const ro = po.revisions?.[r.id];
        return {
          ...r,
          title: ro ? ro.title : r.title,
          notes: ro ? ro.notes : r.notes,
          components: r.components.map((c) => {
            const co = po.components[c.id];
            return co ? { ...c, name: co.name, note: co.note ?? c.note } : c;
          }),
        };
      }),
    };
  });

  const estimates = base.estimates.map((e) => {
    const eo = ov.estimates[e.id];
    return eo ? { ...e, ingredientName: eo.ingredientName, notes: eo.notes ?? e.notes } : e;
  });

  const purchases = base.purchases.map((p) => {
    const po = ov.purchases[p.id];
    return po ? { ...p, ingredientName: po.ingredientName, notes: po.notes ?? p.notes } : p;
  });

  const sales = base.sales.map((s) => {
    const so = ov.sales[s.id];
    return so
      ? {
          ...s,
          fragranceName: so.fragranceName,
          customerOrOrder: so.customerOrOrder ?? s.customerOrOrder,
          notes: so.notes ?? s.notes,
        }
      : s;
  });

  const library = base.library.map((l) => {
    const lo = ov.library[l.id];
    if (!lo) return l;
    return {
      ...l,
      name: lo.name,
      blotterLongevity: lo.blotterLongevity ?? l.blotterLongevity,
      properties: lo.properties,
      scentDescription: lo.scentDescription,
      notes: l.notes.map((n) => (lo.notes[n.id] ? { ...n, text: lo.notes[n.id] } : n)),
    };
  });

  return { projects, ingredients, estimates, purchases, sales, library };
}

export function getSeedSnapshotForLanguage(language: AppLanguage): StudioSeedSnapshot {
  const fcItems = getFragranceConservatoryLibrary(language);
  if (language === 'ru') {
    return {
      projects: structuredClone(SEED_PROJECTS),
      ingredients: structuredClone(SEED_INGREDIENTS),
      estimates: structuredClone(SEED_PROJECT_ESTIMATES),
      purchases: structuredClone(SEED_PURCHASES),
      sales: structuredClone(SEED_SALES),
      library: fcItems,
    };
  }
  const enBase: StudioSeedSnapshot = {
    projects: structuredClone(SEED_PROJECTS_EN),
    ingredients: structuredClone(SEED_INGREDIENTS_EN),
    estimates: structuredClone(SEED_PROJECT_ESTIMATES_EN),
    purchases: structuredClone(SEED_PURCHASES_EN),
    sales: structuredClone(SEED_SALES_EN),
    library: structuredClone(SEED_LIBRARY_EN),
  };
  if (language === 'en') {
    return {
      ...enBase,
      library: fcItems,
    };
  }
  const localized = applySeedOverrides(enBase, SEED_OVERRIDES[language]);
  return {
    ...localized,
    library: fcItems,
  };
}

