import { CONCENTRATION_TARGET_PERCENT } from '../data/constants';
import {
  FRATERWORKS_REFERENCE_MATERIALS,
  getMaterialScentPassport,
  resolveComponentPassport,
} from '../data/fraterworksProfiles';
import { tr } from '../data/i18n';
import { resolveIfraStandard } from '../data/ifraStandards';
import type {
  AppLanguage,
  FormulaComponent,
  Ingredient,
  IngredientOrigin,
  LibraryIngredient,
  NoteTier,
  OlfactoryFamilyKey,
  PerfumeProject,
  ScentFacetBreakdown,
} from '../types/perfume';
import { getIngredientStockGrams } from './calculations';

export type SuggestionNoteSource = 'desired_top' | 'desired_heart' | 'desired_base' | 'idea';

export interface SuggestedIngredientItem {
  id: string;
  name: string;
  inciOrCas?: string;
  tier: NoteTier;
  family: OlfactoryFamilyKey;
  origin: IngredientOrigin;
  reason: string;
  suggestedPercent: number;
  odorImpact?: number;
  substantivityHours?: number;
  averageUsePercent?: string;
  scentBreakdown?: ScentFacetBreakdown[];
  stockIngredient?: Ingredient;
  inStockGrams: number | null;
  isInStock: boolean;
  libraryItem?: LibraryIngredient;
  score: number;
}

export interface ExtractedNoteGroup {
  id: string;
  label: string;
  tier: 'top' | 'heart' | 'base' | 'concept';
  source: SuggestionNoteSource;
  suggestions: SuggestedIngredientItem[];
}

interface AccordIngredientTemplate {
  name: string;
  synonyms?: string[];
  inciOrCas?: string;
  tier: NoteTier;
  family: OlfactoryFamilyKey;
  origin: IngredientOrigin;
  suggestedPercent: number;
  odorImpact?: number;
  substantivityHours?: number;
  averageUsePercent?: string;
  reason: Record<AppLanguage, string>;
}

interface AccordThesaurusEntry {
  id: string;
  displayLabel: Record<AppLanguage, string>;
  patterns: RegExp[];
  searchKeywords: string[];
  preferredTier: 'top' | 'heart' | 'base' | 'concept';
  ingredients: AccordIngredientTemplate[];
}

const ACCORD_THESAURUS: AccordThesaurusEntry[] = [
  {
    id: 'gunpowder',
    displayLabel: {
      ru: 'Порох и дым',
      en: 'Gunpowder & Smoke',
      it: 'Polvere da sparo e fumo',
      es: 'Pólvora y humo',
      de: 'Schießpulver & Rauch',
    },
    patterns: [/порох/i, /gunpowder/i, /polvere\s+da\s+sparo/i, /p[oó]lvora/i, /schie[ßs]pulver/i, /выстрел/i, /гильз/i, /селитра/i, /cordite/i],
    searchKeywords: ['tar', 'деготь', 'дёготь', 'cade', 'кад', 'guaiac', 'гваяк', 'smoke', 'дым', 'pepper', 'перец', 'quinoline', 'хинолин', 'safraleine', 'leather', 'кожа'],
    preferredTier: 'heart',
    ingredients: [
      {
        name: 'Birch Tar Rectified',
        synonyms: ['Берёзовый дёготь', 'Березовый деготь', 'Betula pendula'],
        inciOrCas: '8001-88-5',
        tier: 'base',
        family: 'leathery',
        origin: 'natural',
        suggestedPercent: 0.3,
        odorImpact: 620,
        substantivityHours: 260,
        averageUsePercent: '0.02% – 0.6%',
        reason: {
          ru: 'Пирогенный дымный остов: создаёт запах гари, сажи и сработавшего капсюля',
          en: 'Pyrogenic smoky core: creates charred soot, ember, and spent cartridge realism',
          it: 'Cuore pirogenico affumicato: ricrea fuliggine e bossolo bruciato',
          es: 'Núcleo pirogénico ahumado: aporta hollín y pólvora quemada',
          de: 'Pyrogener Rauchkern: erzeugt Ruß, Glut und verbrannte Patrone',
        },
      },
      {
        name: 'Cade Oil Rectified',
        synonyms: ['Кад', 'Масло кад', 'Можжевеловый деготь'],
        inciOrCas: '8013-10-3',
        tier: 'base',
        family: 'leathery',
        origin: 'natural',
        suggestedPercent: 0.5,
        odorImpact: 420,
        substantivityHours: 220,
        averageUsePercent: '0.05% – 1%',
        reason: {
          ru: 'Сухой древесно-дымный фенол, мягче дёгтя — имитирует тлеющий фитиль',
          en: 'Dry smoky phenolic wood simulating smoldering fuse and hot barrel',
          it: 'Legno fenolico secco e fumoso per miccia ardente',
          es: 'Madera fenólica seca y ahumada de mecha ardiente',
          de: 'Trocken-rauchiges Phenolholz für glimmende Lunte',
        },
      },
      {
        name: 'Guaiacol',
        synonyms: ['Гваякол', 'Methoxyphenol'],
        inciOrCas: '90-05-1',
        tier: 'heart',
        family: 'spicy',
        origin: 'synthetic',
        suggestedPercent: 0.25,
        odorImpact: 480,
        substantivityHours: 140,
        averageUsePercent: '0.02% – 0.8%',
        reason: {
          ru: 'Жжёный бумажный и дымно-сернистый оттенок вспышки пороха',
          en: 'Burnt paper, toasted ash, and sulfurous gunpowder spark facet',
          it: 'Nota di carta bruciata e scintilla sulfurea',
          es: 'Facetas de papel quemado y chispa sulfurosa',
          de: 'Verbranntes Papier und schwefelige Funkennote',
        },
      },
      {
        name: 'Safraleine (Givaudan)',
        synonyms: ['Сафралеин'],
        inciOrCas: '54440-17-4',
        tier: 'heart',
        family: 'leathery',
        origin: 'synthetic',
        suggestedPercent: 1.0,
        odorImpact: 390,
        substantivityHours: 200,
        averageUsePercent: '0.1% – 3%',
        reason: {
          ru: 'Кожано-шафранная теплота и сухая пряная текстура оружейного футляра',
          en: 'Warm leathery-saffron spice adding dry metallic gunpowder depth',
          it: 'Speziatura cuoio-zafferano per profondità secca e minerale',
          es: 'Especia de cuero y azafrán para profundidad seca de pólvora',
          de: 'Leder-Safran-Würze für trockene Schießpulvertiefe',
        },
      },
      {
        name: 'Isobutyl Quinoline',
        synonyms: ['IBQ', 'Изобутилхинолин'],
        inciOrCas: '65442-31-1',
        tier: 'base',
        family: 'leathery',
        origin: 'synthetic',
        suggestedPercent: 0.4,
        odorImpact: 510,
        substantivityHours: 310,
        averageUsePercent: '0.05% – 1.5%',
        reason: {
          ru: 'Минерально-кремнёвый, горько-зелёный и холодный кожаный контраст',
          en: 'Cold flint-mineral, bitter earthy vetiver-leather contrast',
          it: 'Contrasto minerale di selce e cuoio amaro',
          es: 'Contraste mineral de pedernal y cuero amargo',
          de: 'Kalter Feuerstein-Mineral- und Bitterleder-Kontrast',
        },
      },
      {
        name: 'Black Pepper CO2',
        synonyms: ['Чёрный перец', 'Черный перец', 'Piper nigrum'],
        inciOrCas: '8006-82-4',
        tier: 'top',
        family: 'spicy',
        origin: 'natural',
        suggestedPercent: 2.0,
        odorImpact: 185,
        substantivityHours: 16,
        averageUsePercent: '0.3% – 4%',
        reason: {
          ru: 'Резкий «треск» и сухая искристая перечность в момент выстрела',
          en: 'Sharp dry crackle and peppery burst on initial application',
          it: 'Scintilla speziata secca e vibrante in apertura',
          es: 'Chispa seca y picante en la salida',
          de: 'Scharfes, trockenes Knistern im Auftakt',
        },
      },
      {
        name: 'Aldehyde C-12 MNA (Methyl Nonyl Acetaldehyde)',
        synonyms: ['Альдегид C-12 MNA'],
        inciOrCas: '110-41-8',
        tier: 'top',
        family: 'citrus',
        origin: 'synthetic',
        suggestedPercent: 0.2,
        odorImpact: 780,
        substantivityHours: 120,
        averageUsePercent: '0.02% – 0.8%',
        reason: {
          ru: 'Холодный металлический блеск оружейной стали и озоновый воздух',
          en: 'Cold metallic gunmetal gleam and crisp ozonic lift',
          it: 'Bagliore metallico freddo di acciaio e aria ozonica',
          es: 'Brillo metálico frío de acero y aire ozónico',
          de: 'Kalter Stahlglanz und ozonische Frische',
        },
      },
      {
        name: 'Vetiver Essential Oil (Haiti)',
        synonyms: ['Ветивер Гаити'],
        inciOrCas: '8016-96-4',
        tier: 'base',
        family: 'woody',
        origin: 'natural',
        suggestedPercent: 5.0,
        odorImpact: 175,
        substantivityHours: 320,
        averageUsePercent: '1% – 20%',
        reason: {
          ru: 'Землисто-дымная древесная база, связывающая гарь и минералы',
          en: 'Earthy-smoky root base anchoring soot and mineral facets',
          it: 'Base terrosa e affumicata che lega le note minerali',
          es: 'Base terrosa y ahumada que fija las notas minerales',
          de: 'Erdig-rauchige Wurzelbasis für mineralische Tiefe',
        },
      },
    ],
  },
  {
    id: 'pomegranate',
    displayLabel: {
      ru: 'Гранат',
      en: 'Pomegranate',
      it: 'Melograno',
      es: 'Granada',
      de: 'Granatapfel',
    },
    patterns: [/гранат/i, /pomegranate/i, /melogran/i, /granada/i, /granatapfel/i, /punica/i],
    searchKeywords: ['damascen', 'дамасцен', 'cassis', 'смородин', 'raspberry', 'малин', 'berry', 'ягод', 'pink pepper', 'розовый перец', 'rhubarb', 'ревень', 'grapefruit', 'грейпфрут', 'plum', 'слив', 'galaxolide'],
    preferredTier: 'heart',
    ingredients: [
      {
        name: 'Damascenone Total (Firmenich)',
        synonyms: ['Дамасценон', 'Beta-Damascenone'],
        inciOrCas: '23696-85-7',
        tier: 'heart',
        family: 'floral',
        origin: 'synthetic',
        suggestedPercent: 0.1,
        odorImpact: 850,
        substantivityHours: 140,
        averageUsePercent: '0.01% – 0.2%',
        reason: {
          ru: 'Рубиновая сладко-винно-ягодная глубина спелых зёрен граната',
          en: 'Rich ruby berry wine & jammy depth of ripe pomegranate arils',
          it: 'Profondità fruttata di vino rosso e chicchi di melograno maturi',
          es: 'Profundidad frutal de vino tinto y granos de granada madura',
          de: 'Rubinrote Beeren-Wein-Tiefe reifer Granatapfelkerne',
        },
      },
      {
        name: 'Cassis Base 345B / Oxane',
        synonyms: ['Кассис', 'Чёрная смородина', 'Бутон смородины'],
        inciOrCas: '38462-22-5',
        tier: 'top',
        family: 'gourmand',
        origin: 'base',
        suggestedPercent: 1.5,
        odorImpact: 360,
        substantivityHours: 48,
        averageUsePercent: '0.2% – 4%',
        reason: {
          ru: 'Сочная, чуть терпкая кислинка свежевыжатого гранатового сока',
          en: 'Juicy dark-red tartness and crisp berry skin acidity',
          it: 'Acidità succosa e leggermente astringente del succo di melograno',
          es: 'Acidez jugosa y astringente del zumo de granada',
          de: 'Saftig-herbe Säure frischen Granatapfelsafts',
        },
      },
      {
        name: 'Pink Pepper CO2 Extract (Schinus molle)',
        synonyms: ['Розовый перец CO2'],
        inciOrCas: '68917-52-2',
        tier: 'top',
        family: 'spicy',
        origin: 'natural',
        suggestedPercent: 1.8,
        odorImpact: 210,
        substantivityHours: 16,
        averageUsePercent: '0.3% – 5%',
        reason: {
          ru: 'Искристая розово-ягодная пряность и сухая танинность корочки',
          en: 'Sparkling crimson berry brightness and dry tannic rind nuance',
          it: 'Vivacità di bacche rosa e sfumatura tannica della buccia',
          es: 'Brillo de bayas rojas y matiz tánico de la cáscara',
          de: 'Spritzige rote Beerenfrische und trockene Schalennote',
        },
      },
      {
        name: 'Raspberry Ketone',
        synonyms: ['Малиновый кетон', 'Frambinone'],
        inciOrCas: '5471-51-2',
        tier: 'heart',
        family: 'gourmand',
        origin: 'synthetic',
        suggestedPercent: 0.8,
        odorImpact: 140,
        substantivityHours: 160,
        averageUsePercent: '0.1% – 3%',
        reason: {
          ru: 'Сладкая рубиновая мякоть ягод, смягчающая кислоту цитрусов',
          en: 'Sweet red-berry pulp rounding sharp tart facets',
          it: 'Polpa dolce di frutti rossi che arrotonda l’acidità',
          es: 'Pulpa dulce de frutos rojos que suaviza la acidez',
          de: 'Süßes rotes Fruchtfleisch zum Abrunden der Säure',
        },
      },
      {
        name: 'Styrallyl Acetate (Gardenol)',
        synonyms: ['Стираллилацетат', 'Rhubarb ester'],
        inciOrCas: '93-92-5',
        tier: 'top',
        family: 'green',
        origin: 'synthetic',
        suggestedPercent: 0.4,
        odorImpact: 320,
        substantivityHours: 14,
        averageUsePercent: '0.05% – 1.5%',
        reason: {
          ru: 'Хрустящая ревеневая терпкость белой перегородки плода граната',
          en: 'Crisp tart rhubarb crunch of pomegranate white pith',
          it: 'Freschezza croccante e aspra di rabarbaro della membrana bianca',
          es: 'Crujiente acidez de ruibarbo de la membrana blanca',
          de: 'Knackig-herbe Rhabarberfrische der weißen Fruchthaut',
        },
      },
      {
        name: 'Aldehyde C-16 (Ethyl Methylphenylglycidate)',
        synonyms: ['Альдегид C-16', 'Клубничный альдегид'],
        inciOrCas: '77-83-8',
        tier: 'heart',
        family: 'gourmand',
        origin: 'synthetic',
        suggestedPercent: 0.3,
        odorImpact: 260,
        substantivityHours: 64,
        averageUsePercent: '0.05% – 1%',
        reason: {
          ru: 'Яркий глянцевый рубиново-фруктовый блеск',
          en: 'Bright glossy red-fruit sheen in heart notes',
          it: 'Lucentezza fruttata rossa brillante nel cuore',
          es: 'Brillo frutal rojo luminoso en el corazón',
          de: 'Strahlender roter Fruchtglanz im Herzen',
        },
      },
      {
        name: 'Galaxolide (Abbalide)',
        synonyms: ['Галаксолид'],
        inciOrCas: '1222-05-5',
        tier: 'base',
        family: 'musk',
        origin: 'synthetic',
        suggestedPercent: 6.0,
        odorImpact: 80,
        substantivityHours: 360,
        averageUsePercent: '2% – 20%',
        reason: {
          ru: 'Чистый мускус с естественным оттенком ежевики и красных ягод',
          en: 'Clean white musk with natural blackberry & ruby fruit undertone',
          it: 'Muschio pulito con sfumatura naturale di mora e frutti rossi',
          es: 'Almizcle limpio con matiz natural de mora y frutos rojos',
          de: 'Reiner Moschus mit natürlicher Brombeer- und Beerennote',
        },
      },
      {
        name: 'Rose Oxide (Laevo)',
        synonyms: ['Розеноксид', 'Rose Oxide'],
        inciOrCas: '16409-43-1',
        tier: 'top',
        family: 'floral',
        origin: 'synthetic',
        suggestedPercent: 0.15,
        odorImpact: 640,
        substantivityHours: 24,
        averageUsePercent: '0.02% – 0.4%',
        reason: {
          ru: 'Холодный металлически-цветочный блик на сочной гранатовой кожуре',
          en: 'Cool metallic rosy lift giving crisp jewel-like radiance',
          it: 'Tocco rosato freddo e metallico di grande freschezza',
          es: 'Toque rosado frío y metálico muy luminoso',
          de: 'Kühler metallischer Rosenschimmer',
        },
      },
    ],
  },
  {
    id: 'rain_petrichor',
    displayLabel: {
      ru: 'Дождь и петрикор',
      en: 'Rain & Petrichor',
      it: 'Pioggia e petricore',
      es: 'Lluvia y petricor',
      de: 'Regen & Petrichor',
    },
    patterns: [/дожд/i, /rain/i, /petrichor/i, /петрикор/i, /озон/i, /ozon/i, /гроз/i, /storm/i, /роса/i, /dew/i, /влаг/i],
    searchKeywords: ['calone', 'калон', 'geosmin', 'геосмин', 'violet', 'фиалк', 'moss', 'мох', 'озон', 'marine', 'морск', 'ambroxan', 'cis-3'],
    preferredTier: 'top',
    ingredients: [
      {
        name: 'Geosmin (1% dilution)',
        synonyms: ['Геосмин'],
        inciOrCas: '19700-21-1',
        tier: 'base',
        family: 'aquatic',
        origin: 'synthetic',
        suggestedPercent: 0.2,
        odorImpact: 900,
        substantivityHours: 120,
        averageUsePercent: '0.005% – 0.3%',
        reason: {
          ru: 'Молекула мокрого асфальта и земли сразу после первого дождя',
          en: 'Signature molecule of wet earth and pavement right after rain',
          it: 'Molecola della terra bagnata e dell’asfalto dopo la pioggia',
          es: 'Molécula clave de tierra mojada tras la lluvia',
          de: 'Schlüsselmolekül für nasse Erde nach dem Regen',
        },
      },
      {
        name: 'Calone 1951 (Firmenich)',
        synonyms: ['Калон'],
        inciOrCas: '28940-11-6',
        tier: 'heart',
        family: 'aquatic',
        origin: 'synthetic',
        suggestedPercent: 0.3,
        odorImpact: 640,
        substantivityHours: 168,
        averageUsePercent: '0.02% – 1.5%',
        reason: {
          ru: 'Прохладная прозрачность влажного воздуха и дождевой воды',
          en: 'Cool ozonic transparency and airy rain-washed freshness',
          it: 'Trasparenza fresca di aria umida e acqua piovana',
          es: 'Transparencia fresca de aire húmedo y agua de lluvia',
          de: 'Kühle ozonische Transparenz und Regenfrische',
        },
      },
      {
        name: 'Cis-3-Hexenol (Leaf Alcohol)',
        synonyms: ['Цис-3-гексенол', 'Спирт листьев'],
        inciOrCas: '928-96-1',
        tier: 'top',
        family: 'green',
        origin: 'synthetic',
        suggestedPercent: 0.2,
        odorImpact: 580,
        substantivityHours: 4,
        averageUsePercent: '0.02% – 0.5%',
        reason: {
          ru: 'Свежесть прибитой дождём листвы и травы',
          en: 'Crisp rain-drenched foliage and crushed green leaf burst',
          it: 'Freschezza di foglie e erba bagnate dalla pioggia',
          es: 'Frescor de hojas y hierba mojadas por la lluvia',
          de: 'Frische regenfeuchter Blätter und Gräser',
        },
      },
      {
        name: 'Ambroxan / Ambrox Super',
        synonyms: ['Амброксан'],
        inciOrCas: '6790-58-5',
        tier: 'base',
        family: 'amber',
        origin: 'synthetic',
        suggestedPercent: 4.0,
        odorImpact: 240,
        substantivityHours: 400,
        averageUsePercent: '0.5% – 10%',
        reason: {
          ru: 'Минеральный влажно-каменистый шлейф',
          en: 'Mineral wet-stone sillage and crisp longevity',
          it: 'Scia minerale di pietra bagnata',
          es: 'Estela mineral de piedra húmeda',
          de: 'Mineralischer Nachhall wie nasser Stein',
        },
      },
    ],
  },
  {
    id: 'cedar',
    displayLabel: {
      ru: 'Кедр',
      en: 'Cedarwood',
      it: 'Legno di cedro',
      es: 'Cedro',
      de: 'Zedernholz',
    },
    patterns: [/кедр/i, /cedar/i, /cedr/i, /zeder/i, /хво[йя]/i, /лес/i, /forest/i],
    searchKeywords: ['cedar', 'кедр', 'iso e', 'vertofix', 'вертофикс', 'cypress', 'кипарис', 'pine', 'сосн'],
    preferredTier: 'base',
    ingredients: [
      {
        name: 'Iso E Super (IFF)',
        synonyms: ['Изо Е Супер'],
        inciOrCas: '54464-57-2',
        tier: 'base',
        family: 'woody',
        origin: 'synthetic',
        suggestedPercent: 18.0,
        odorImpact: 65,
        substantivityHours: 172,
        averageUsePercent: '5% – 45%',
        reason: {
          ru: 'Прозрачный бархатистый кедр с объёмной диффузией',
          en: 'Velvety transparent cedarwood giving radiance and lift',
          it: 'Cedro vellutato e trasparente ad alta diffusione',
          es: 'Cedro aterciopelado y transparente con gran difusión',
          de: 'Samtig-transparentes Zedernholz mit großer Strahlkraft',
        },
      },
      {
        name: 'Vertofix Coeur (Methyl Cedryl Ketone)',
        synonyms: ['Вертофикс'],
        inciOrCas: '32388-55-9',
        tier: 'base',
        family: 'woody',
        origin: 'synthetic',
        suggestedPercent: 6.0,
        odorImpact: 120,
        substantivityHours: 280,
        averageUsePercent: '2% – 20%',
        reason: {
          ru: 'Тёплая благородная карандашная древесина и кедровый остов',
          en: 'Warm dry pencil-shaving cedar core with smooth amber depth',
          it: 'Cuore legnoso caldo di cedro con sfumatura ambrata',
          es: 'Núcleo cálido y seco de madera de cedro',
          de: 'Warmer Bleistiftholz-Zedernkern mit tiefer Fixierung',
        },
      },
      {
        name: 'Virginia / Atlas Cedarwood Essential Oil',
        synonyms: ['Кедр Атласский', 'Кедр Вирджиния'],
        inciOrCas: '8000-27-9',
        tier: 'base',
        family: 'woody',
        origin: 'natural',
        suggestedPercent: 5.0,
        odorImpact: 110,
        substantivityHours: 220,
        averageUsePercent: '1% – 15%',
        reason: {
          ru: 'Натуральный смолисто-древесный кедр для плотности звучания',
          en: 'Natural resinous cedar oil adding authentic woody body',
          it: 'Olio essenziale naturale di cedro per corpo legnoso',
          es: 'Aceite esencial natural de cedro para cuerpo amaderado',
          de: 'Natürliches Zedernöl für authentische Holzstruktur',
        },
      },
    ],
  },
  {
    id: 'leather',
    displayLabel: {
      ru: 'Кожа и замша',
      en: 'Leather & Suede',
      it: 'Cuoio e camoscio',
      es: 'Cuero y ante',
      de: 'Leder & Wildleder',
    },
    patterns: [/кож/i, /замш/i, /leather/i, /suede/i, /cuoio/i, /camoscio/i, /cuero/i, /leder/i],
    searchKeywords: ['suederal', 'суедераль', 'leather', 'кожа', 'замш', 'birch tar', 'quinoline', 'safraleine', 'labdanum', 'castoreum'],
    preferredTier: 'base',
    ingredients: [
      {
        name: 'Suederal LT (IFF)',
        synonyms: ['Суедераль'],
        inciOrCas: '68901-15-5',
        tier: 'base',
        family: 'leathery',
        origin: 'base',
        suggestedPercent: 2.5,
        odorImpact: 310,
        substantivityHours: 280,
        averageUsePercent: '0.2% – 5%',
        reason: {
          ru: 'Мягкая перчаточная замша без излишней резкости дёгтя',
          en: 'Supple glove suede leather without harsh smoky edges',
          it: 'Camoscio morbido da guanto senza asprezza',
          es: 'Ante suave de guante sin asperezas',
          de: 'Geschmeidiges Handschuh-Wildleder ohne Schärfe',
        },
      },
      {
        name: 'Labdanum Absolute (Cistus ladanifer)',
        synonyms: ['Лабданум абсолют'],
        inciOrCas: '8016-26-0',
        tier: 'base',
        family: 'amber',
        origin: 'natural',
        suggestedPercent: 2.0,
        odorImpact: 260,
        substantivityHours: 400,
        averageUsePercent: '0.3% – 8%',
        reason: {
          ru: 'Тёплая амбровая и бальзамическая подложка антикварной кожи',
          en: 'Warm resinous-amber backbone for antique saddle leather',
          it: 'Base ambrata balsamica per cuoio antico',
          es: 'Fondo ambarino balsámico para cuero antiguo',
          de: 'Warme balsamische Basis für antikes Leder',
        },
      },
      {
        name: 'Isobutyl Quinoline',
        synonyms: ['IBQ', 'Изобутилхинолин'],
        inciOrCas: '65442-31-1',
        tier: 'base',
        family: 'leathery',
        origin: 'synthetic',
        suggestedPercent: 0.4,
        odorImpact: 510,
        substantivityHours: 310,
        averageUsePercent: '0.05% – 1.5%',
        reason: {
          ru: 'Классическая сухая кожа «русского сапога»',
          en: 'Classic dry green-earthy Cuir de Russie leather character',
          it: 'Carattere classico e secco di Cuir de Russie',
          es: 'Carácter seco clásico de cuero Cuir de Russie',
          de: 'Klassischer trockener Cuir-de-Russie-Ledercharakter',
        },
      },
    ],
  },
  {
    id: 'metal',
    displayLabel: {
      ru: 'Металл и сталь',
      en: 'Metallic & Steel',
      it: 'Metallo e acciaio',
      es: 'Metal y acero',
      de: 'Metall & Stahl',
    },
    patterns: [/метал/i, /стал/i, /желез/i, /кров/i, /metal/i, /steel/i, /iron/i, /blood/i, /acciaio/i, /hierro/i, /eisen/i],
    searchKeywords: ['aldehyde c-12', 'mna', 'rose oxide', 'javanol', 'ambroxan', 'saffron', 'шафран'],
    preferredTier: 'top',
    ingredients: [
      {
        name: 'Rose Oxide (Laevo)',
        synonyms: ['Розеноксид'],
        inciOrCas: '16409-43-1',
        tier: 'top',
        family: 'floral',
        origin: 'synthetic',
        suggestedPercent: 0.25,
        odorImpact: 640,
        substantivityHours: 24,
        averageUsePercent: '0.02% – 0.4%',
        reason: {
          ru: 'Выраженный прохладный металлический, слегка железный отблеск',
          en: 'Distinct cold metallic sheen with crisp geranium-iron facet',
          it: 'Riflesso metallico freddo e leggermente ferroso',
          es: 'Brillo metálico frío con matiz férrico limpio',
          de: 'Kühler metallischer Glanz mit feiner Eisennote',
        },
      },
      {
        name: 'Aldehyde C-12 MNA (Methyl Nonyl Acetaldehyde)',
        synonyms: ['Альдегид C-12 MNA'],
        inciOrCas: '110-41-8',
        tier: 'top',
        family: 'citrus',
        origin: 'synthetic',
        suggestedPercent: 0.25,
        odorImpact: 780,
        substantivityHours: 120,
        averageUsePercent: '0.02% – 0.8%',
        reason: {
          ru: 'Искристая стальная прохлада и альдегидная резкость',
          en: 'Crisp metallic aldehyde clarity and cold steel sharpness',
          it: 'Nitidezza aldeidica e freddezza d’acciaio',
          es: 'Claridad aldehídica fría de acero pulido',
          de: 'Klare Aldehydschärfe wie polierter Stahl',
        },
      },
      {
        name: 'Javanol (Givaudan)',
        synonyms: ['Яванол'],
        inciOrCas: '198404-98-7',
        tier: 'base',
        family: 'woody',
        origin: 'synthetic',
        suggestedPercent: 0.6,
        odorImpact: 720,
        substantivityHours: 400,
        averageUsePercent: '0.1% – 3%',
        reason: {
          ru: 'Молекулярный сандал с характерным розово-металлическим блеском',
          en: 'Radiant sandalwood molecule with bright metallic rose undertone',
          it: 'Sandalo molecolare con brillante sottotono metallico rosato',
          es: 'Sándalo molecular con matiz rosado-metálico brillante',
          de: 'Strahlendes Sandelholz mit metallischem Rosé-Unterton',
        },
      },
    ],
  },
  {
    id: 'citrus_bergamot',
    displayLabel: {
      ru: 'Цитрус и бергамот',
      en: 'Citrus & Bergamot',
      it: 'Agrumi e bergamotto',
      es: 'Cítricos y bergamota',
      de: 'Zitrus & Bergamotte',
    },
    patterns: [/бергамот/i, /лимон/i, /цитрус/i, /апельсин/i, /грейпфрут/i, /мандарин/i, /лайм/i, /bergamot/i, /lemon/i, /citrus/i, /grapefruit/i, /mandarin/i, /yuzu/i, /юдзу/i],
    searchKeywords: ['bergamot', 'бергамот', 'citrus', 'цитрус', 'lemon', 'лимон', 'grapefruit', 'грейпфрут', 'mandarin', 'мандарин', 'ethyl linalool', 'hedione'],
    preferredTier: 'top',
    ingredients: [
      {
        name: 'Bergamot Essential Oil FCF (Calabria)',
        synonyms: ['Бергамот Калабрия'],
        inciOrCas: '89957-91-5',
        tier: 'top',
        family: 'citrus',
        origin: 'natural',
        suggestedPercent: 10.0,
        odorImpact: 100,
        substantivityHours: 6,
        averageUsePercent: '2% – 25%',
        reason: {
          ru: 'Классический искрящийся цитрусовый старт с цветочно-чайным нюансом',
          en: 'Sparkling Calabrian bergamot zest with Earl Grey floral elegance',
          it: 'Scorza frizzante di bergamotto con sfumatura floreale',
          es: 'Ralladura chispeante de bergamota con matiz floral',
          de: 'Spritzige kalabrische Bergamotte mit floraler Eleganz',
        },
      },
      {
        name: 'Ethyl Linalool',
        synonyms: ['Этиллиналоол'],
        inciOrCas: '10339-55-6',
        tier: 'top',
        family: 'floral',
        origin: 'synthetic',
        suggestedPercent: 4.0,
        odorImpact: 110,
        substantivityHours: 18,
        averageUsePercent: '1% – 15%',
        reason: {
          ru: 'Продлевает свежесть цитрусов в сердце формулы без терпеновой резкости',
          en: 'Extends citrus radiance smoothly into the heart',
          it: 'Prolunga la freschezza agrumata nel cuore della formula',
          es: 'Prolonga el frescor cítrico hacia el corazón',
          de: 'Verlängert die Zitrusfrische weich ins Herz',
        },
      },
      {
        name: 'Hedione (Firmenich)',
        synonyms: ['Гедион'],
        inciOrCas: '24851-98-7',
        tier: 'heart',
        family: 'floral',
        origin: 'synthetic',
        suggestedPercent: 12.0,
        odorImpact: 55,
        substantivityHours: 72,
        averageUsePercent: '3% – 35%',
        reason: {
          ru: 'Воздушная жасминово-лимонная прозрачность и сияние верхов',
          en: 'Radiant airy jasmine-citrus lift opening up top notes',
          it: 'Luminosità trasparente di gelsomino e agrumi',
          es: 'Luminosidad aérea de jazmín y cítricos',
          de: 'Strahlende Jasmin-Zitrus-Transparenz',
        },
      },
    ],
  },
  {
    id: 'rose_floral',
    displayLabel: {
      ru: 'Роза и цветы',
      en: 'Rose & Floral',
      it: 'Rosa e fiori',
      es: 'Rosa y flores',
      de: 'Rose & Blüten',
    },
    patterns: [/роз[аеуы]/i, /rose/i, /жасмин/i, /jasmin/i, /цвет/i, /floral/i, /пион/i, /peon/i, /ирис/i, /iris/i, /фиалк/i, /violet/i],
    searchKeywords: ['rose', 'роза', 'hedione', 'гедион', 'damascenone', 'дамасценон', 'jasmine', 'жасмин', 'ethyl linalool', 'ирис', 'iris'],
    preferredTier: 'heart',
    ingredients: [
      {
        name: 'Hedione (Firmenich)',
        synonyms: ['Гедион'],
        inciOrCas: '24851-98-7',
        tier: 'heart',
        family: 'floral',
        origin: 'synthetic',
        suggestedPercent: 14.0,
        odorImpact: 55,
        substantivityHours: 72,
        averageUsePercent: '3% – 35%',
        reason: {
          ru: 'Наполняет цветочный букет объёмом, диффузией и свежестью лепестков',
          en: 'Fills floral accords with radiant petal volume and airiness',
          it: 'Dona volume, aria e luce naturale al bouquet floreale',
          es: 'Aporta volumen, difusión y frescor de pétalos al bouquet',
          de: 'Verleiht Blütenakkorden Volumen, Luftigkeit und Strahlkraft',
        },
      },
      {
        name: 'Damascenone Total (Firmenich)',
        synonyms: ['Дамасценон'],
        inciOrCas: '23696-85-7',
        tier: 'heart',
        family: 'floral',
        origin: 'synthetic',
        suggestedPercent: 0.08,
        odorImpact: 850,
        substantivityHours: 140,
        averageUsePercent: '0.01% – 0.2%',
        reason: {
          ru: 'Роскошный медово-фруктовый оттенок болгарской розы',
          en: 'Velvety honey-fruit depth of rich Bulgarian rose absolute',
          it: 'Ricchezza vellutata e fruttata della rosa bulgara',
          es: 'Profundidad aterciopelada de rosa búlgara',
          de: 'Samtig-fruchtige Tiefe bulgarischer Rose',
        },
      },
    ],
  },
  {
    id: 'amber_vanilla',
    displayLabel: {
      ru: 'Амбра, смолы и ваниль',
      en: 'Amber, Resins & Vanilla',
      it: 'Ambra, resine e vaniglia',
      es: 'Ámbar, resinas y vainilla',
      de: 'Amber, Harze & Vanille',
    },
    patterns: [/амбр/i, /ваниль/i, /ладан/i, /смол/i, /бензоин/i, /мирр/i, /боб[ыа]\s*тонка/i, /amber/i, /vanill/i, /incens/i, /frankincense/i, /resin/i, /tonka/i, /sweet/i, /слад/i, /гурман/i],
    searchKeywords: ['ambroxan', 'амброксан', 'ambrocenide', 'vanillin', 'ванилин', 'maltol', 'мальтол', 'coumarin', 'кумарин', 'labdanum', 'лабданум', 'ладан', 'frankincense'],
    preferredTier: 'base',
    ingredients: [
      {
        name: 'Vanillin',
        synonyms: ['Ванилин'],
        inciOrCas: '121-33-5',
        tier: 'base',
        family: 'gourmand',
        origin: 'synthetic',
        suggestedPercent: 3.0,
        odorImpact: 220,
        substantivityHours: 360,
        averageUsePercent: '0.2% – 8%',
        reason: {
          ru: 'Классическая тёплая сливочно-амбровая сладость и округлость базы',
          en: 'Creamy warm vanilla backbone anchoring oriental & amber bases',
          it: 'Dolcezza calda e cremosa per basi orientali e ambrate',
          es: 'Dulzor cremoso cálido que estructura bases ambarinas',
          de: 'Cremige Vanillewärme für runde Amber-Basen',
        },
      },
      {
        name: 'Labdanum Absolute (Cistus ladanifer)',
        synonyms: ['Лабданум абсолют'],
        inciOrCas: '8016-26-0',
        tier: 'base',
        family: 'amber',
        origin: 'natural',
        suggestedPercent: 2.5,
        odorImpact: 260,
        substantivityHours: 400,
        averageUsePercent: '0.3% – 8%',
        reason: {
          ru: 'Бальзамическая глубина амбры, сближающая ваниль со специями и дымом',
          en: 'Deep balsamic amber resin binding vanilla, wood, and smoke',
          it: 'Resina balsamica profonda per accordi ambrati',
          es: 'Resina balsámica profunda que une vainilla y madera',
          de: 'Tiefe balsamische Harzbasis für echte Amber-Akkorde',
        },
      },
      {
        name: 'Ambroxan / Ambrox Super',
        synonyms: ['Амброксан'],
        inciOrCas: '6790-58-5',
        tier: 'base',
        family: 'amber',
        origin: 'synthetic',
        suggestedPercent: 4.5,
        odorImpact: 240,
        substantivityHours: 400,
        averageUsePercent: '0.5% – 10%',
        reason: {
          ru: 'Современный шлейфовый амбровый каркас без утяжеления',
          en: 'Modern radiant ambergris diffusion without heaviness',
          it: 'Struttura moderna di ambra grigia ad alta scia',
          es: 'Estructura moderna de ámbar gris de larga estela',
          de: 'Moderne Ambergris-Strahlkraft ohne Schwere',
        },
      },
    ],
  },
  {
    id: 'spices_pepper',
    displayLabel: {
      ru: 'Пряности и перец',
      en: 'Spices & Pepper',
      it: 'Spezie e pepe',
      es: 'Especias y pimienta',
      de: 'Gewürze & Pfeffer',
    },
    patterns: [/перец/i, /прян/i, /кардамон/i, /шафран/i, /кориц/i, /гвоздик/i, /имбир/i, /pepper/i, /spic/i, /cardamom/i, /saffron/i, /cinnamon/i, /ginger/i],
    searchKeywords: ['pink pepper', 'перец', 'pepper', 'cardamom', 'кардамон', 'cashmeran', 'кашмеран', 'safraleine', 'шафран'],
    preferredTier: 'top',
    ingredients: [
      {
        name: 'Pink Pepper CO2 Extract (Schinus molle)',
        synonyms: ['Розовый перец CO2'],
        inciOrCas: '68917-52-2',
        tier: 'top',
        family: 'spicy',
        origin: 'natural',
        suggestedPercent: 2.0,
        odorImpact: 210,
        substantivityHours: 16,
        averageUsePercent: '0.3% – 5%',
        reason: {
          ru: 'Искристая верхняя пряность с хвойно-ягодным подтоном',
          en: 'Effervescent top spice with crisp berry-juniper sparkle',
          it: 'Spezia frizzante di apertura con sfumatura di bacche',
          es: 'Especia chispeante de salida con matiz de bayas',
          de: 'Spritzige Kopfgewürznote mit Beerenfrische',
        },
      },
      {
        name: 'Cashmeran (IFF)',
        synonyms: ['Кашмеран'],
        inciOrCas: '33704-61-9',
        tier: 'base',
        family: 'woody',
        origin: 'synthetic',
        suggestedPercent: 3.0,
        odorImpact: 190,
        substantivityHours: 240,
        averageUsePercent: '0.5% – 8%',
        reason: {
          ru: 'Пряный кардамоново-древесный мускус с тёплой текстурой',
          en: 'Spiced cardamom-pine wood musk with warm diffusion',
          it: 'Muschio legnoso caldo con accenti di cardamomo',
          es: 'Almizcle amaderado especiado con matiz de cardamomo',
          de: 'Würziger Kardamom-Holz-Moschus mit weicher Wärme',
        },
      },
    ],
  },
  {
    id: 'green_herbs',
    displayLabel: {
      ru: 'Зелень, травы и чай',
      en: 'Greens, Herbs & Tea',
      it: 'Verde, erbe e tè',
      es: 'Verde, hierbas y té',
      de: 'Grün, Kräuter & Tee',
    },
    patterns: [/зелен/i, /трав/i, /лист/i, /чай/i, /мят/i, /инжир/i, /папорот/i, /green/i, /leaf/i, /herb/i, /tea/i, /mint/i, /fig/i, /grass/i, /мох/i, /moss/i],
    searchKeywords: ['hexenol', 'гексенол', 'tea', 'чай', 'bergamot', 'hedione', 'vetiver', 'moss', 'мох', 'coumarin', 'кумарин'],
    preferredTier: 'top',
    ingredients: [
      {
        name: 'Cis-3-Hexenol (Leaf Alcohol)',
        synonyms: ['Цис-3-гексенол'],
        inciOrCas: '928-96-1',
        tier: 'top',
        family: 'green',
        origin: 'synthetic',
        suggestedPercent: 0.25,
        odorImpact: 580,
        substantivityHours: 4,
        averageUsePercent: '0.02% – 0.5%',
        reason: {
          ru: 'Взрывная свежесть размятых зелёных листьев и сочной травы',
          en: 'Realistic freshly crushed green leaf & cut grass top',
          it: 'Esplosione verde realistica di foglie spezzate',
          es: 'Frescor realista de hojas verdes recién cortadas',
          de: 'Authentisches Grün frisch zerriebener Blätter',
        },
      },
      {
        name: 'Coumarin',
        synonyms: ['Кумарин'],
        inciOrCas: '91-64-5',
        tier: 'base',
        family: 'gourmand',
        origin: 'synthetic',
        suggestedPercent: 2.0,
        odorImpact: 165,
        substantivityHours: 280,
        averageUsePercent: '0.5% – 8%',
        reason: {
          ru: 'Аромат свежескошенного сена и травянисто-фужерная фиксация',
          en: 'Sweet new-mown hay and classic fougère herbal fixation',
          it: 'Fieno tagliato e fissazione erbacea fougère',
          es: 'Heno recién cortado y fijación herbácea fougère',
          de: 'Frisch gemähtes Heu und Fougère-Fixierung',
        },
      },
    ],
  },
  {
    id: 'earth_patchouli',
    displayLabel: {
      ru: 'Земля, лес и пачули',
      en: 'Earth, Forest & Patchouli',
      it: 'Terra, bosco e patchouli',
      es: 'Tierra, bosque y pachulí',
      de: 'Erde, Wald & Patchouli',
    },
    patterns: [/земл/i, /пачул/i, /погреб/i, /гриб/i, /earth/i, /patchouli/i, /soil/i, /wood/i, /дерев/i, /древ/i, /сандал/i, /sandal/i, /ветивер/i, /vetiver/i],
    searchKeywords: ['patchouli', 'пачули', 'vetiver', 'ветивер', 'javanol', 'яванол', 'iso e', 'vertofix'],
    preferredTier: 'base',
    ingredients: [
      {
        name: 'Patchouli Essential Oil (Dark Aged)',
        synonyms: ['Пачули темные'],
        inciOrCas: '8014-09-3',
        tier: 'base',
        family: 'woody',
        origin: 'natural',
        suggestedPercent: 4.5,
        odorImpact: 195,
        substantivityHours: 360,
        averageUsePercent: '0.5% – 18%',
        reason: {
          ru: 'Бархатистая влажная земля, тёмное дерево и природная глубина',
          en: 'Rich damp earth, aged wood, and dark cacao depth',
          it: 'Terra umida vellutata e legno scuro profondo',
          es: 'Tierra húmeda aterciopelada y madera oscura profunda',
          de: 'Samtige feuchte Erde und dunkle Holztiefe',
        },
      },
      {
        name: 'Vetiver Essential Oil (Haiti)',
        synonyms: ['Ветивер Гаити'],
        inciOrCas: '8016-96-4',
        tier: 'base',
        family: 'woody',
        origin: 'natural',
        suggestedPercent: 5.0,
        odorImpact: 175,
        substantivityHours: 320,
        averageUsePercent: '1% – 20%',
        reason: {
          ru: 'Сухие корни, древесный дым и благородная землистость',
          en: 'Dry earthy roots with clean smoky wood clarity',
          it: 'Radici terrose e legno leggermente affumicato',
          es: 'Raíces terrosas secas y madera ahumada',
          de: 'Trockene erdige Wurzeln und klare Holzigkeit',
        },
      },
    ],
  },
  {
    id: 'musk_skin',
    displayLabel: {
      ru: 'Мускус и чистота',
      en: 'Musk & Clean Skin',
      it: 'Muschio e pelle',
      es: 'Almizcle y piel',
      de: 'Moschus & Haut',
    },
    patterns: [/мускус/i, /пудр/i, /кож[аеиу]\s*тела/i, /чистот/i, /musk/i, /powd/i, /skin/i, /clean/i, /кашемир/i, /cashmere/i],
    searchKeywords: ['galaxolide', 'галаксолид', 'cashmeran', 'кашмеран', 'iso e', 'ambroxan', 'musk', 'мускус'],
    preferredTier: 'base',
    ingredients: [
      {
        name: 'Galaxolide (Abbalide)',
        synonyms: ['Галаксолид'],
        inciOrCas: '1222-05-5',
        tier: 'base',
        family: 'musk',
        origin: 'synthetic',
        suggestedPercent: 8.0,
        odorImpact: 80,
        substantivityHours: 360,
        averageUsePercent: '2% – 20%',
        reason: {
          ru: 'Чистый обволакивающий мускус, сглаживающий переходы пирамиды',
          en: 'Clean enveloping white musk smoothing all formula transitions',
          it: 'Muschio pulito e avvolgente che armonizza l’intera piramide',
          es: 'Almizcle limpio y envolvente que une toda la pirámide',
          de: 'Reiner umhüllender Moschus zum Harmonisieren der Formel',
        },
      },
      {
        name: 'Cashmeran (IFF)',
        synonyms: ['Кашмеран'],
        inciOrCas: '33704-61-9',
        tier: 'base',
        family: 'woody',
        origin: 'synthetic',
        suggestedPercent: 3.5,
        odorImpact: 190,
        substantivityHours: 240,
        averageUsePercent: '0.5% – 8%',
        reason: {
          ru: 'Тактильный «кашемировый» тёплый мускус с древесным оттенком',
          en: 'Tactile velvety cashmere-skin musk with warm woody sheen',
          it: 'Muschio tattile effetto cashmere sulla pelle',
          es: 'Almizcle cálido de tacto cachemir sobre la piel',
          de: 'Taktiler Kaschmir-Moschus mit warmer Holznote',
        },
      },
    ],
  },
];

const STOP_WORDS = new Set([
  'и', 'в', 'во', 'на', 'с', 'со', 'к', 'ко', 'по', 'из', 'от', 'до', 'для', 'над', 'под',
  'при', 'про', 'без', 'или', 'но', 'а', 'как', 'что', 'это', 'всё', 'все', 'очень', 'слегка',
  'аромат', 'парфюм', 'композиция', 'нота', 'ноты', 'идея', 'концепция', 'аккорд', 'шлейф',
  'запах', 'духи', 'образ', 'история', 'тема', 'эффект', 'оттенок', 'звучание',
  'the', 'and', 'for', 'with', 'from', 'into', 'note', 'notes', 'scent', 'perfume', 'accord',
  'idea', 'concept', 'hint', 'touch', 'aroma', 'fragrance', 'style', 'vibe', 'like',
]);

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/ё/g, 'е').trim();
}

function findMatchingStockIngredient(
  name: string,
  inciOrCas: string | undefined,
  synonyms: string[] | undefined,
  ingredients: Ingredient[]
): Ingredient | undefined {
  const casClean = inciOrCas ? normalizeText(inciOrCas) : '';
  const nameLower = normalizeText(name);
  const shortName = nameLower.split('(')[0].trim();
  const synLowers = (synonyms || []).map(normalizeText);

  for (const ing of ingredients) {
    if (casClean && ing.inciOrCas && normalizeText(ing.inciOrCas) === casClean) {
      return ing;
    }
    const ingLower = normalizeText(ing.name);
    const ingShort = ingLower.split('(')[0].trim();
    if (
      ingLower === nameLower ||
      (shortName.length >= 4 && (ingShort === shortName || ingLower.includes(shortName) || shortName.includes(ingShort))) ||
      synLowers.some((s) => s.length >= 3 && (ingLower.includes(s) || (ing.synonyms || []).some((isyn) => normalizeText(isyn).includes(s))))
    ) {
      return ing;
    }
  }
  return undefined;
}

function findMatchingLibraryItem(
  name: string,
  inciOrCas: string | undefined,
  synonyms: string[] | undefined,
  library: LibraryIngredient[]
): LibraryIngredient | undefined {
  const casClean = inciOrCas ? normalizeText(inciOrCas) : '';
  const nameLower = normalizeText(name);
  const shortName = nameLower.split('(')[0].trim();
  const synLowers = (synonyms || []).map(normalizeText);

  for (const lib of library) {
    if (casClean && lib.inciOrCas && normalizeText(lib.inciOrCas) === casClean) {
      return lib;
    }
    const libLower = normalizeText(lib.name);
    const libShort = libLower.split('(')[0].trim();
    if (
      libLower === nameLower ||
      (shortName.length >= 4 && (libShort === shortName || libLower.includes(shortName) || shortName.includes(libShort))) ||
      synLowers.some((s) => s.length >= 3 && libLower.includes(s))
    ) {
      return lib;
    }
  }
  return undefined;
}

function buildSuggestionsForTerm(
  rawTerm: string,
  preferredTier: 'top' | 'heart' | 'base' | 'concept',
  matchedThesaurus: AccordThesaurusEntry | undefined,
  ingredients: Ingredient[],
  library: LibraryIngredient[],
  language: AppLanguage
): SuggestedIngredientItem[] {
  const results = new Map<string, SuggestedIngredientItem>();
  const termClean = normalizeText(rawTerm);
  const searchTerms = Array.from(
    new Set([
      termClean,
      ...termClean.split(/\s+/).filter((w) => w.length >= 3 && !STOP_WORDS.has(w)),
      ...(matchedThesaurus?.searchKeywords.map(normalizeText) || []),
    ])
  ).filter(Boolean);

  const addCandidate = (candidate: SuggestedIngredientItem) => {
    const key = normalizeText(candidate.name).split('(')[0].trim();
    const existing = results.get(key);
    if (!existing) {
      results.set(key, candidate);
      return;
    }
    // Prefer higher score or in-stock details
    if (candidate.score > existing.score || (!existing.stockIngredient && candidate.stockIngredient)) {
      results.set(key, {
        ...existing,
        ...candidate,
        score: Math.max(existing.score, candidate.score),
        stockIngredient: candidate.stockIngredient || existing.stockIngredient,
        inStockGrams: candidate.stockIngredient ? candidate.inStockGrams : existing.inStockGrams,
        isInStock: candidate.isInStock || existing.isInStock,
        libraryItem: candidate.libraryItem || existing.libraryItem,
        reason: candidate.reason.length >= existing.reason.length ? candidate.reason : existing.reason,
      });
    }
  };

  // 1. Curated perfumery accord knowledge base (cross-referenced with live Stock & Library!)
  if (matchedThesaurus) {
    matchedThesaurus.ingredients.forEach((tpl, idx) => {
      const stockIng = findMatchingStockIngredient(tpl.name, tpl.inciOrCas, tpl.synonyms, ingredients);
      const libItem = findMatchingLibraryItem(tpl.name, tpl.inciOrCas, tpl.synonyms, library);
      const passport = getMaterialScentPassport({
        name: stockIng?.name || tpl.name,
        inciOrCas: stockIng?.inciOrCas || tpl.inciOrCas,
        synonyms: tpl.synonyms,
        family: stockIng?.family || tpl.family,
        tier: stockIng?.tier || tpl.tier,
        origin: stockIng?.origin || tpl.origin,
        odorImpact: stockIng?.odorImpact ?? tpl.odorImpact,
        substantivityHours: stockIng?.substantivityHours ?? tpl.substantivityHours,
        averageUsePercent: stockIng?.averageUsePercent ?? tpl.averageUsePercent,
        scentBreakdown: stockIng?.scentBreakdown,
        olfactoryNotes: stockIng?.olfactoryNotes,
      });
      const stockVal = stockIng ? getIngredientStockGrams(stockIng) : null;
      const isInStock = Boolean(
        stockIng && stockIng.status === 'in_stock' && (stockVal === null || stockVal > 0)
      );
      addCandidate({
        id: `tpl-${matchedThesaurus.id}-${idx}`,
        name: stockIng?.name || tpl.name,
        inciOrCas: stockIng?.inciOrCas || tpl.inciOrCas,
        tier: stockIng?.tier || tpl.tier,
        family: stockIng?.family || tpl.family,
        origin: stockIng?.origin || tpl.origin,
        reason: tr(language, tpl.reason),
        suggestedPercent: tpl.suggestedPercent,
        odorImpact: passport.odorImpact,
        substantivityHours: passport.substantivityHours,
        averageUsePercent: passport.averageUsePercent,
        scentBreakdown: passport.scentBreakdown,
        stockIngredient: stockIng,
        inStockGrams: stockVal,
        isInStock,
        libraryItem: libItem,
        score: 120 - idx * 4 + (isInStock ? 8 : 0),
      });
    });
  }

  // 2. Live search across Studio Stock / Catalog
  for (const ing of ingredients) {
    if (ing.tier === 'solvent') continue;
    const haystack = normalizeText(
      `${ing.name} ${(ing.synonyms || []).join(' ')} ${ing.bottleLabel || ''} ${ing.olfactoryNotes || ''} ${(ing.tags || []).join(' ')} ${(ing.scentBreakdown || []).map((b) => b.facet).join(' ')}`
    );
    let hits = 0;
    for (const kw of searchTerms) {
      if (kw.length >= 3 && haystack.includes(kw)) {
        hits += kw === termClean ? 3 : 1;
      }
    }
    if (hits > 0) {
      const passport = getMaterialScentPassport(ing);
      const stockVal = getIngredientStockGrams(ing);
      const isInStock = ing.status === 'in_stock' && (stockVal === null || stockVal > 0);
      addCandidate({
        id: `stock-${ing.id}`,
        name: ing.name,
        inciOrCas: ing.inciOrCas,
        tier: ing.tier,
        family: ing.family,
        origin: ing.origin,
        reason:
          ing.olfactoryNotes ||
          passport.scentDescription ||
          tr(language, {
            ru: 'Совпадение по каталогу мастерской',
            en: 'Matched in workshop catalog',
            it: 'Corrispondenza nel catalogo atelier',
            es: 'Coincidencia en el catálogo del taller',
            de: 'Treffer im Atelier-Katalog',
          }),
        suggestedPercent: ing.tier === 'top' ? 3 : ing.tier === 'heart' ? 4 : 5,
        odorImpact: passport.odorImpact,
        substantivityHours: passport.substantivityHours,
        averageUsePercent: passport.averageUsePercent,
        scentBreakdown: passport.scentBreakdown,
        stockIngredient: ing,
        inStockGrams: stockVal,
        isInStock,
        score: 75 + hits * 15 + (isInStock ? 10 : 0) + (preferredTier === ing.tier ? 5 : 0),
      });
    }
  }

  // 3. Live search across Essence Library
  for (const lib of library) {
    if (lib.tier === 'solvent') continue;
    const haystack = normalizeText(
      `${lib.name} ${(lib.synonyms || []).join(' ')} ${lib.scentDescription || ''} ${lib.properties || ''} ${(lib.scentBreakdown || []).map((b) => b.facet).join(' ')}`
    );
    let hits = 0;
    for (const kw of searchTerms) {
      if (kw.length >= 3 && haystack.includes(kw)) {
        hits += kw === termClean ? 3 : 1;
      }
    }
    if (hits > 0) {
      const stockIng = findMatchingStockIngredient(lib.name, lib.inciOrCas, lib.synonyms, ingredients);
      const passport = getMaterialScentPassport(lib);
      const stockVal = stockIng ? getIngredientStockGrams(stockIng) : null;
      const isInStock = Boolean(
        stockIng && stockIng.status === 'in_stock' && (stockVal === null || stockVal > 0)
      );
      addCandidate({
        id: `lib-${lib.id}`,
        name: lib.name,
        inciOrCas: lib.inciOrCas,
        tier: lib.tier,
        family: lib.family,
        origin: lib.origin,
        reason: lib.scentDescription || lib.properties || '',
        suggestedPercent: lib.tier === 'top' ? 3 : lib.tier === 'heart' ? 4 : 5,
        odorImpact: passport.odorImpact,
        substantivityHours: passport.substantivityHours,
        averageUsePercent: passport.averageUsePercent,
        scentBreakdown: passport.scentBreakdown,
        stockIngredient: stockIng,
        inStockGrams: stockVal,
        isInStock,
        libraryItem: lib,
        score: 70 + hits * 14 + (isInStock ? 8 : 0),
      });
    }
  }

  // 4. Live search across Fraterworks Reference Database
  for (const fw of FRATERWORKS_REFERENCE_MATERIALS) {
    const haystack = normalizeText(
      `${fw.name} ${fw.synonyms.join(' ')} ${fw.scentDescription} ${fw.scentBreakdown.map((b) => b.facet).join(' ')}`
    );
    let hits = 0;
    for (const kw of searchTerms) {
      if (kw.length >= 3 && haystack.includes(kw)) {
        hits += kw === termClean ? 3 : 1;
      }
    }
    if (hits > 0) {
      const stockIng = findMatchingStockIngredient(fw.name, fw.inciOrCas, fw.synonyms, ingredients);
      const stockVal = stockIng ? getIngredientStockGrams(stockIng) : null;
      const isInStock = Boolean(
        stockIng && stockIng.status === 'in_stock' && (stockVal === null || stockVal > 0)
      );
      addCandidate({
        id: `fw-${fw.id}`,
        name: fw.name,
        inciOrCas: fw.inciOrCas,
        tier: fw.tier,
        family: fw.family,
        origin: fw.origin,
        reason: fw.scentDescription,
        suggestedPercent: fw.odorImpact >= 450 ? 0.5 : fw.tier === 'top' ? 3 : 5,
        odorImpact: fw.odorImpact,
        substantivityHours: fw.substantivityHours,
        averageUsePercent: fw.averageUsePercent,
        scentBreakdown: fw.scentBreakdown,
        stockIngredient: stockIng,
        inStockGrams: stockVal,
        isInStock,
        score: 65 + hits * 12 + (isInStock ? 8 : 0),
      });
    }
  }

  return Array.from(results.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

export function buildProjectSuggestedNoteGroups(
  project: PerfumeProject | null | undefined,
  ingredients: Ingredient[],
  library: LibraryIngredient[],
  language: AppLanguage
): ExtractedNoteGroup[] {
  if (!project) return [];

  const groups: ExtractedNoteGroup[] = [];
  const seenKeys = new Set<string>();

  const registerGroup = (
    rawLabel: string,
    tier: 'top' | 'heart' | 'base' | 'concept',
    source: SuggestionNoteSource,
    matchedThesaurus?: AccordThesaurusEntry
  ) => {
    const cleanLabel = rawLabel.trim();
    if (!cleanLabel) return;
    const dedupKey = matchedThesaurus ? `acc:${matchedThesaurus.id}` : `txt:${normalizeText(cleanLabel)}`;
    if (seenKeys.has(dedupKey)) return;
    seenKeys.add(dedupKey);

    const suggestions = buildSuggestionsForTerm(
      cleanLabel,
      tier,
      matchedThesaurus,
      ingredients,
      library,
      language
    );

    if (suggestions.length > 0 || source !== 'idea') {
      groups.push({
        id: `${source}-${groups.length}-${dedupKey}`,
        label: cleanLabel.charAt(0).toUpperCase() + cleanLabel.slice(1),
        tier,
        source,
        suggestions,
      });
    }
  };

  // 1. Parse explicit desiredNotes (Top, Heart, Base)
  const desiredBuckets: Array<{
    raw: string | undefined;
    tier: 'top' | 'heart' | 'base';
    source: SuggestionNoteSource;
  }> = [
    { raw: project.desiredNotes?.top, tier: 'top', source: 'desired_top' },
    { raw: project.desiredNotes?.heart, tier: 'heart', source: 'desired_heart' },
    { raw: project.desiredNotes?.base, tier: 'base', source: 'desired_base' },
  ];

  for (const bucket of desiredBuckets) {
    const tokens = (bucket.raw || '')
      .split(/[,;/\n+·]+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 2);
    for (const token of tokens) {
      const matched = ACCORD_THESAURUS.find((entry) =>
        entry.patterns.some((rx) => rx.test(token))
      );
      registerGroup(token, bucket.tier, bucket.source, matched);
    }
  }

  // 2. Parse project idea + inspiration text for accord thesaurus concepts AND explicit comma-separated keywords
  const freeText = `${project.idea || ''}\n${project.inspiration || ''}`.trim();
  if (freeText.length > 0) {
    // Detect known accords mentioned anywhere in idea/inspiration
    for (const entry of ACCORD_THESAURUS) {
      if (entry.patterns.some((rx) => rx.test(freeText))) {
        registerGroup(
          tr(language, entry.displayLabel),
          entry.preferredTier,
          'idea',
          entry
        );
      }
    }

    // Also inspect short tokens in idea/inspiration that match Studio/Library/Fraterworks directly
    const rawTokens = freeText
      .split(/[,;.\n!?:()—–/-]+|\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 4 && !STOP_WORDS.has(normalizeText(s)));

    for (const token of rawTokens) {
      if (groups.length >= 14) break;
      const tokenNorm = normalizeText(token);
      if (seenKeys.has(`txt:${tokenNorm}`)) continue;
      // Check if it already matched a thesaurus pattern
      const matchedAcc = ACCORD_THESAURUS.find((entry) =>
        entry.patterns.some((rx) => rx.test(token))
      );
      if (matchedAcc) {
        if (!seenKeys.has(`acc:${matchedAcc.id}`)) {
          registerGroup(tr(language, matchedAcc.displayLabel), matchedAcc.preferredTier, 'idea', matchedAcc);
        }
        continue;
      }
      // Check if directly hits studio catalog or library or fraterworks by name
      const directHit =
        ingredients.some((i) => normalizeText(i.name).includes(tokenNorm)) ||
        library.some((l) => normalizeText(l.name).includes(tokenNorm)) ||
        FRATERWORKS_REFERENCE_MATERIALS.some(
          (fw) =>
            normalizeText(fw.name).includes(tokenNorm) ||
            fw.synonyms.some((s) => normalizeText(s).includes(tokenNorm))
        );
      if (directHit) {
        registerGroup(token, 'concept', 'idea');
      }
    }
  }

  return groups;
}

export function buildAdHocNoteSuggestions(
  customQuery: string,
  ingredients: Ingredient[],
  library: LibraryIngredient[],
  language: AppLanguage
): ExtractedNoteGroup | null {
  const clean = customQuery.trim();
  if (clean.length < 2) return null;
  const matchedAcc = ACCORD_THESAURUS.find((entry) =>
    entry.patterns.some((rx) => rx.test(clean))
  );
  const suggestions = buildSuggestionsForTerm(
    clean,
    matchedAcc?.preferredTier || 'concept',
    matchedAcc,
    ingredients,
    library,
    language
  );
  return {
    id: `adhoc-${normalizeText(clean)}`,
    label: clean.charAt(0).toUpperCase() + clean.slice(1),
    tier: matchedAcc?.preferredTier || 'concept',
    source: 'idea',
    suggestions,
  };
}

export function isSuggestionInFormula(
  item: SuggestedIngredientItem,
  components: FormulaComponent[]
): boolean {
  const targetShort = normalizeText(item.name).split('(')[0].trim();
  return components.some((c) => {
    if (item.stockIngredient && c.ingredientId === item.stockIngredient.id) return true;
    const compShort = normalizeText(c.name).split('(')[0].trim();
    return (
      compShort === targetShort ||
      (targetShort.length >= 4 && (compShort.includes(targetShort) || targetShort.includes(compShort)))
    );
  });
}

export interface ParsedDosageRange {
  minPct: number;
  recPct: number;
  maxPct: number;
}

export function parseDosageRange(
  averageUsePercent?: string,
  fallbackPct = 3,
  ifraLimitPercent?: number
): ParsedDosageRange {
  let minPct = Math.max(0.05, Number((fallbackPct * 0.4).toFixed(2)));
  let maxPct = Math.min(100, Number((fallbackPct * 2.2).toFixed(2)));
  let recPct = fallbackPct;

  if (averageUsePercent) {
    const nums = averageUsePercent
      .replace(/,/g, '.')
      .match(/\d+(?:\.\d+)?/g)
      ?.map(Number)
      .filter((n) => Number.isFinite(n) && n > 0);
    if (nums && nums.length >= 2) {
      minPct = nums[0];
      maxPct = nums[1];
      recPct = Number(((minPct + maxPct) * 0.35 + minPct * 0.3).toFixed(2));
      if (recPct < minPct) recPct = minPct;
      if (recPct > maxPct) recPct = maxPct;
    } else if (nums && nums.length === 1) {
      minPct = Number((nums[0] * 0.5).toFixed(2));
      recPct = nums[0];
      maxPct = Number((nums[0] * 1.5).toFixed(2));
    }
  }

  if (ifraLimitPercent !== undefined && ifraLimitPercent > 0) {
    maxPct = Math.min(maxPct, ifraLimitPercent);
    if (recPct > maxPct) recPct = maxPct;
    if (minPct > maxPct) minPct = Number((maxPct * 0.5).toFixed(2));
  }

  const clean = (v: number) => (v < 0.1 ? Number(v.toFixed(2)) : Number(v.toFixed(1)));
  return {
    minPct: clean(Math.max(0.01, minPct)),
    recPct: clean(Math.max(0.01, recPct)),
    maxPct: clean(Math.max(0.02, maxPct)),
  };
}

export interface FormulaDosageRecommendation {
  component: FormulaComponent;
  currentPercent: number;
  rangeText: string;
  minPct: number;
  recPct: number;
  maxPct: number;
  ifraLimitPercent?: number;
  odorImpact: number;
  substantivityHours: number;
  status: 'low' | 'optimal' | 'high' | 'ifra_risk';
}

export function buildFormulaDosageRecommendations(
  components: FormulaComponent[],
  targetConcentrateGrams: number,
  ingredients: Ingredient[],
  library: LibraryIngredient[],
  targetConcentration: PerfumeProject['targetConcentration'] = 'EDP'
): FormulaDosageRecommendation[] {
  const baseGrams = targetConcentrateGrams > 0 ? targetConcentrateGrams : 10;
  const concTargetPct =
    (CONCENTRATION_TARGET_PERCENT[targetConcentration] ?? CONCENTRATION_TARGET_PERCENT.EDP)
      .defaultPct || 15;

  return components
    .filter((c) => c.tier !== 'solvent')
    .map((comp) => {
      const passport = resolveComponentPassport(comp, ingredients, library);
      const ifraStd = resolveIfraStandard({
        name: comp.name,
        inciOrCas: passport.inciOrCas,
      });
      const ifraLimitPercent =
        ifraStd !== undefined ? ifraStd.category4LimitPercent : passport.ifraLimitPercent;
      const dilutionFrac = Math.min(100, Math.max(0.1, comp.dilutionPercent || 100)) / 100;

      // Convert finished-product IFRA Cat. 4 limit (% pure in finished perfume)
      // to maximum allowable % of this component (at its dilution) inside the concentrate.
      const maxConcentratePctByIfra =
        ifraLimitPercent !== undefined
          ? ifraLimitPercent <= 0
            ? 0
            : Math.min(
                100,
                Number(((ifraLimitPercent * (100 / concTargetPct)) / dilutionFrac).toFixed(2))
              )
          : undefined;

      const currentPercent = Number(((comp.weightGrams / baseGrams) * 100).toFixed(2));
      const pctInFinished =
        currentPercent * dilutionFrac * (concTargetPct / 100);

      const { minPct, recPct, maxPct } = parseDosageRange(
        passport.averageUsePercent,
        comp.tier === 'top' ? 3 : comp.tier === 'heart' ? 4 : 5,
        maxConcentratePctByIfra
      );

      const isBanned =
        ifraStd?.status === 'prohibited' ||
        ifraStd?.status === 'eu_banned' ||
        ifraLimitPercent === 0;

      let status: FormulaDosageRecommendation['status'] = 'optimal';
      if (isBanned ? comp.weightGrams > 0 : ifraLimitPercent !== undefined && pctInFinished > ifraLimitPercent + 0.001) {
        status = 'ifra_risk';
      } else if (currentPercent > maxPct + 0.05) {
        status = 'high';
      } else if (currentPercent + 0.05 < minPct) {
        status = 'low';
      }

      return {
        component: comp,
        currentPercent,
        rangeText: passport.averageUsePercent || `${minPct}% – ${maxPct}%`,
        minPct,
        recPct,
        maxPct,
        ifraLimitPercent,
        odorImpact: passport.odorImpact,
        substantivityHours: passport.substantivityHours,
        status,
      };
    });
}

