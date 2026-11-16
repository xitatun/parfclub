import {
  AppLanguage,
  FormulaComponent,
  Ingredient,
  IngredientOrigin,
  LibraryIngredient,
  NoteTier,
  OlfactoryFamilyKey,
  ScentFacetBreakdown,
} from '../types/perfume';
import {
  resolveIfraStandard,
  type IfraStandardStatus,
} from './ifraStandards';

export interface FraterworksMaterialPassport {
  id: string;
  name: string;
  inciOrCas?: string;
  synonyms: string[];
  family: OlfactoryFamilyKey;
  tier: NoteTier;
  origin: IngredientOrigin;
  /** Relative odor strength (10-1000). 100 = standard Bergamot EO */
  odorImpact: number;
  /** Longevity on blotter in hours (1 - 400h) */
  substantivityHours: number;
  /** Recommended usage range in perfume concentrate */
  averageUsePercent: string;
  ifraLimitPercent?: number;
  ifraStatus?: IfraStandardStatus;
  ifraNote?: string;
  /** Multi-facet scent breakdown summing to 100% */
  scentBreakdown: ScentFacetBreakdown[];
  scentDescription: string;
  volatilityLabel: 'High (Top)' | 'Medium (Heart)' | 'Low (Base)' | 'Fixative (Ultra-Base)';
}

export const FRATERWORKS_REFERENCE_MATERIALS: FraterworksMaterialPassport[] = [
  {
    id: 'fw-iso-e-super',
    name: 'Iso E Super (IFF)',
    inciOrCas: '54464-57-2',
    synonyms: ['Patchouli Ethanone', 'Timbersilk', 'Orbitone', 'Sylvamber', 'Изо Е Супер'],
    family: 'woody',
    tier: 'base',
    origin: 'synthetic',
    odorImpact: 65,
    substantivityHours: 172,
    averageUsePercent: '5% – 45%',
    ifraLimitPercent: 20.0,
    scentBreakdown: [
      { facet: 'Velvety Cedarwood', family: 'woody', percent: 55 },
      { facet: 'Dry Ambergris', family: 'amber', percent: 30 },
      { facet: 'Skin Musk / Iris', family: 'musk', percent: 15 },
    ],
    scentDescription: 'Бархатистый, прозрачный кедрово-амбровый материал с эффектом «второй кожи». Придает объем, диффузию и связывает верхние и базовые ноты.',
    volatilityLabel: 'Low (Base)',
  },
  {
    id: 'fw-hedione',
    name: 'Hedione (Firmenich)',
    inciOrCas: '24851-98-7',
    synonyms: ['Methyl Dihydrojasmonate', 'Kharismal', 'Hedione HC', 'Гедион'],
    family: 'floral',
    tier: 'heart',
    origin: 'synthetic',
    odorImpact: 55,
    substantivityHours: 72,
    averageUsePercent: '3% – 35%',
    scentBreakdown: [
      { facet: 'Transparent Jasmine', family: 'floral', percent: 60 },
      { facet: 'Radiant Citrus Lift', family: 'citrus', percent: 25 },
      { facet: 'Dewy Green Tea', family: 'green', percent: 15 },
    ],
    scentDescription: 'Сияющий, прозрачный жасминово-цитрусовый модификатор. Наполняет композицию светом, воздухом и естественным шлейфом.',
    volatilityLabel: 'Medium (Heart)',
  },
  {
    id: 'fw-ambroxan',
    name: 'Ambroxan / Ambrox Super',
    inciOrCas: '6790-58-5',
    synonyms: ['Ambroxide', 'Cetalox', 'Ambrofix', 'Orcanox', 'Амброксан'],
    family: 'amber',
    tier: 'base',
    origin: 'synthetic',
    odorImpact: 240,
    substantivityHours: 400,
    averageUsePercent: '0.5% – 10%',
    scentBreakdown: [
      { facet: 'Mineral Ambergris', family: 'amber', percent: 50 },
      { facet: 'Dry Driftwood', family: 'woody', percent: 30 },
      { facet: 'Clean Skin Musk', family: 'musk', percent: 15 },
      { facet: 'Saline Marine', family: 'aquatic', percent: 5 },
    ],
    scentDescription: 'Ключевой одорант натуральной серой амбры. Сухой, минеральный, бархатисто-древесный с невероятной стойкостью на блоттере и коже.',
    volatilityLabel: 'Fixative (Ultra-Base)',
  },
  {
    id: 'fw-bergamot-fcf',
    name: 'Bergamot Essential Oil FCF (Calabria)',
    inciOrCas: '89957-91-5',
    synonyms: ['Citrus bergamia', 'Бергамот Калабрия', 'Bergamote'],
    family: 'citrus',
    tier: 'top',
    origin: 'natural',
    odorImpact: 100,
    substantivityHours: 6,
    averageUsePercent: '2% – 25%',
    scentBreakdown: [
      { facet: 'Sparkling Bergamot Zest', family: 'citrus', percent: 65 },
      { facet: 'Lavender / Linalyl Floral', family: 'floral', percent: 20 },
      { facet: 'Bitter Petitgrain Leaf', family: 'green', percent: 10 },
      { facet: 'Earl Grey Spice', family: 'spicy', percent: 5 },
    ],
    scentDescription: 'Эталон свежести: искристый цитрус с характерным цветочно-чайным оттенком линалилацетата и легкой травянистой горчинкой.',
    volatilityLabel: 'High (Top)',
  },
  {
    id: 'fw-galaxolide',
    name: 'Galaxolide (Abbalide)',
    inciOrCas: '1222-05-5',
    synonyms: ['Musk G', 'HHCB', 'Галаксолид'],
    family: 'musk',
    tier: 'base',
    origin: 'synthetic',
    odorImpact: 80,
    substantivityHours: 360,
    averageUsePercent: '2% – 20%',
    scentBreakdown: [
      { facet: 'Clean White Musk', family: 'musk', percent: 65 },
      { facet: 'Powdery Floral Violet', family: 'floral', percent: 20 },
      { facet: 'Sweet Blackberry Fruit', family: 'gourmand', percent: 15 },
    ],
    scentDescription: 'Классический чистый, пудрово-сладковатый полициклический мускус с оттенками фиалки и ежевики. Округляет и смягчает формулу.',
    volatilityLabel: 'Fixative (Ultra-Base)',
  },
  {
    id: 'fw-ethyl-linalool',
    name: 'Ethyl Linalool',
    inciOrCas: '10339-55-6',
    synonyms: ['Этиллиналоол'],
    family: 'floral',
    tier: 'top',
    origin: 'synthetic',
    odorImpact: 110,
    substantivityHours: 18,
    averageUsePercent: '1% – 15%',
    scentBreakdown: [
      { facet: 'Fresh Floral Muguet / Lavender', family: 'floral', percent: 55 },
      { facet: 'Bergamot / Petitgrain Citrus', family: 'citrus', percent: 30 },
      { facet: 'Rosewood Bark', family: 'woody', percent: 15 },
    ],
    scentDescription: 'Более мягкая, цветочная и стойкая альтернатива классическому линалоолу без резких камфорно-терпеновых граней.',
    volatilityLabel: 'High (Top)',
  },
  {
    id: 'fw-cashmeran',
    name: 'Cashmeran (IFF)',
    inciOrCas: '33704-61-9',
    synonyms: ['DPMI', 'Кашмеран', 'Cashmere Wood'],
    family: 'woody',
    tier: 'base',
    origin: 'synthetic',
    odorImpact: 190,
    substantivityHours: 240,
    averageUsePercent: '0.5% – 8%',
    ifraLimitPercent: 3.8,
    scentBreakdown: [
      { facet: 'Warm Cashmere Musk', family: 'musk', percent: 35 },
      { facet: 'Coniferous Pine Wood', family: 'woody', percent: 30 },
      { facet: 'Spiced Cardamom / Pepper', family: 'spicy', percent: 20 },
      { facet: 'Solar Amber / Fruit', family: 'amber', percent: 15 },
    ],
    scentDescription: 'Многогранный диффузный мускусно-древесный материал с тактильной текстурой кашемира, пряно-хвойными и фруктово-амбровыми тонами.',
    volatilityLabel: 'Low (Base)',
  },
  {
    id: 'fw-javanol',
    name: 'Javanol (Givaudan)',
    inciOrCas: '198404-98-7',
    synonyms: ['Яванол', 'Sandalwood Super'],
    family: 'woody',
    tier: 'base',
    origin: 'synthetic',
    odorImpact: 720,
    substantivityHours: 400,
    averageUsePercent: '0.1% – 3%',
    scentBreakdown: [
      { facet: 'Creamy Mysore Sandalwood', family: 'woody', percent: 65 },
      { facet: 'Metallic Rose / Grapefruit', family: 'floral', percent: 20 },
      { facet: 'Lactonic Milky Skin', family: 'gourmand', percent: 15 },
    ],
    scentDescription: 'Ультра-мощный сандаловый одорант нового поколения. Сливочный, сияющий, с тонким розово-грейпфрутовым обертоном и огромной диффузией.',
    volatilityLabel: 'Fixative (Ultra-Base)',
  },
  {
    id: 'fw-ambrocenide',
    name: 'Ambrocenide (Symrise)',
    inciOrCas: '211299-54-6',
    synonyms: ['Амброценид'],
    family: 'amber',
    tier: 'base',
    origin: 'synthetic',
    odorImpact: 950,
    substantivityHours: 400,
    averageUsePercent: '0.01% – 0.5%',
    scentBreakdown: [
      { facet: 'Radiant Dry Wood-Amber', family: 'amber', percent: 60 },
      { facet: 'Sharp Cedar / Oud Smoke', family: 'woody', percent: 30 },
      { facet: 'Animalic Leather Nuance', family: 'leathery', percent: 10 },
    ],
    scentDescription: 'Экстремально мощный древесно-амбровый бустер. Даже в следовых дозах придает взрывной шлейф и стержень цитрусовым и древесным аккордам.',
    volatilityLabel: 'Fixative (Ultra-Base)',
  },
  {
    id: 'fw-damascenone',
    name: 'Damascenone Total (Firmenich)',
    inciOrCas: '23696-85-7',
    synonyms: ['Beta-Damascenone', 'Dorinone', 'Дамасценон'],
    family: 'floral',
    tier: 'heart',
    origin: 'synthetic',
    odorImpact: 850,
    substantivityHours: 140,
    averageUsePercent: '0.01% – 0.2%',
    ifraLimitPercent: 0.043,
    scentBreakdown: [
      { facet: 'Rich Bulgarian Rose', family: 'floral', percent: 45 },
      { facet: 'Stewed Plum / Berry Jam', family: 'gourmand', percent: 35 },
      { facet: 'Pipe Tobacco / Tea Leaf', family: 'spicy', percent: 20 },
    ],
    scentDescription: 'Невероятно насыщенная фруктово-розовая молекула с оттенками чернослива, трубочного табака, меда и черного чая.',
    volatilityLabel: 'Medium (Heart)',
  },
  {
    id: 'fw-vanillin',
    name: 'Vanillin',
    inciOrCas: '121-33-5',
    synonyms: ['Ванилин', 'Methyl Protocatechuic Aldehyde'],
    family: 'gourmand',
    tier: 'base',
    origin: 'synthetic',
    odorImpact: 220,
    substantivityHours: 360,
    averageUsePercent: '0.2% – 8%',
    scentBreakdown: [
      { facet: 'Sweet Creamy Vanilla', family: 'gourmand', percent: 70 },
      { facet: 'Balsamic Benzoin', family: 'amber', percent: 20 },
      { facet: 'Powdery Heliotrope', family: 'floral', percent: 10 },
    ],
    scentDescription: 'Фундаментальный гурманский и амбровый фиксатор со сладким, сливочно-пудровым ванильным профилем.',
    volatilityLabel: 'Fixative (Ultra-Base)',
  },
  {
    id: 'fw-ethyl-maltol',
    name: 'Ethyl Maltol (Veltol Plus)',
    inciOrCas: '4940-11-8',
    synonyms: ['Этилмальтол', 'Corps Praline'],
    family: 'gourmand',
    tier: 'base',
    origin: 'synthetic',
    odorImpact: 520,
    substantivityHours: 300,
    averageUsePercent: '0.05% – 2%',
    scentBreakdown: [
      { facet: 'Spun Sugar / Caramel', family: 'gourmand', percent: 80 },
      { facet: 'Cooked Strawberry Jam', family: 'floral', percent: 10 },
      { facet: 'Toasted Warm Amber', family: 'amber', percent: 10 },
    ],
    scentDescription: 'Интенсивный аромат жженого сахара, пралине, сахарной ваты и клубничного джема. В 4-6 раз сильнее обычного мальтола.',
    volatilityLabel: 'Low (Base)',
  },
  {
    id: 'fw-vetiver-haiti',
    name: 'Vetiver Essential Oil (Haiti)',
    inciOrCas: '8016-96-4',
    synonyms: ['Chrysopogon zizanioides', 'Ветивер Гаити'],
    family: 'woody',
    tier: 'base',
    origin: 'natural',
    odorImpact: 175,
    substantivityHours: 320,
    averageUsePercent: '1% – 20%',
    scentBreakdown: [
      { facet: 'Earthy Root & Dry Wood', family: 'woody', percent: 60 },
      { facet: 'Smoky Leather / Vetiverol', family: 'leathery', percent: 20 },
      { facet: 'Bitter Grapefruit Peel', family: 'citrus', percent: 10 },
      { facet: 'Damp Mossy Green', family: 'green', percent: 10 },
    ],
    scentDescription: 'Благородный землисто-древесный профиль с дымными, кожаными и неожиданными грейпфрутово-зелеными верхами.',
    volatilityLabel: 'Fixative (Ultra-Base)',
  },
  {
    id: 'fw-patchouli-dark',
    name: 'Patchouli Essential Oil (Dark Aged)',
    inciOrCas: '8014-09-3',
    synonyms: ['Pogostemon cablin', 'Пачули темные'],
    family: 'woody',
    tier: 'base',
    origin: 'natural',
    odorImpact: 195,
    substantivityHours: 360,
    averageUsePercent: '0.5% – 18%',
    scentBreakdown: [
      { facet: 'Camphoraceous Earthy Wood', family: 'woody', percent: 55 },
      { facet: 'Dark Cocoa / Wine Cellar', family: 'gourmand', percent: 20 },
      { facet: 'Rich Amber Resin', family: 'amber', percent: 15 },
      { facet: 'Herbal Green Leaf', family: 'green', percent: 10 },
    ],
    scentDescription: 'Глубокий, бархатисто-землистый, древесный материал с тонами горького шоколада, влажной листвы и старого винного погреба.',
    volatilityLabel: 'Fixative (Ultra-Base)',
  },
  {
    id: 'fw-coumarin',
    name: 'Coumarin',
    inciOrCas: '91-64-5',
    synonyms: ['Кумарин', 'Tonka Bean Camphor'],
    family: 'gourmand',
    tier: 'base',
    origin: 'synthetic',
    odorImpact: 165,
    substantivityHours: 280,
    averageUsePercent: '0.5% – 8%',
    ifraLimitPercent: 1.5,
    scentBreakdown: [
      { facet: 'Tonka Bean / Marzipan', family: 'gourmand', percent: 50 },
      { facet: 'New-Mown Sweet Hay', family: 'green', percent: 25 },
      { facet: 'Warm Fougère Amber', family: 'amber', percent: 25 },
    ],
    scentDescription: 'Краеугольный камень фужерных и восточных композиций: аромат свежескошенного сена, бобов тонка, миндаля и табака.',
    volatilityLabel: 'Low (Base)',
  },
  {
    id: 'fw-vertofix',
    name: 'Vertofix Coeur (Methyl Cedryl Ketone)',
    inciOrCas: '32388-55-9',
    synonyms: ['Acetyl Cedrene', 'Lignofix', 'Вертофикс'],
    family: 'woody',
    tier: 'base',
    origin: 'synthetic',
    odorImpact: 120,
    substantivityHours: 280,
    averageUsePercent: '2% – 20%',
    scentBreakdown: [
      { facet: 'Warm Pencil Cedarwood', family: 'woody', percent: 60 },
      { facet: 'Vetiver-Amber Undertone', family: 'amber', percent: 25 },
      { facet: 'Soft Suede Leather', family: 'leathery', percent: 15 },
    ],
    scentDescription: 'Теплый, благородный кедрово-ветиверовый материал с мягким кожано-мускусным подтоном и отличной фиксацией.',
    volatilityLabel: 'Low (Base)',
  },
  {
    id: 'fw-calone',
    name: 'Calone 1951 (Firmenich)',
    inciOrCas: '28940-11-6',
    synonyms: ['Methylbenzodioxepinone', 'Watermelon Ketone', 'Калон'],
    family: 'aquatic',
    tier: 'heart',
    origin: 'synthetic',
    odorImpact: 640,
    substantivityHours: 168,
    averageUsePercent: '0.02% – 1.5%',
    scentBreakdown: [
      { facet: 'Ocean Breeze & Oyster Shell', family: 'aquatic', percent: 65 },
      { facet: 'Fresh Watermelon / Melon Rind', family: 'green', percent: 25 },
      { facet: 'Lily of the Valley Floral', family: 'floral', percent: 10 },
    ],
    scentDescription: 'Легендарный морской одорант: свежий океанический бриз, устричная прохлада и сочная арбузно-дынная корка.',
    volatilityLabel: 'Medium (Heart)',
  },
  {
    id: 'fw-aldehyde-c12-mna',
    name: 'Aldehyde C-12 MNA (Methyl Nonyl Acetaldehyde)',
    inciOrCas: '110-41-8',
    synonyms: ['Альдегид C-12 MNA', '2-Methylundecanal'],
    family: 'citrus',
    tier: 'top',
    origin: 'synthetic',
    odorImpact: 780,
    substantivityHours: 120,
    averageUsePercent: '0.02% – 0.8%',
    scentBreakdown: [
      { facet: 'Metallic Sparkling Citrus Zest', family: 'citrus', percent: 45 },
      { facet: 'Cool Frankincense / Pine', family: 'amber', percent: 35 },
      { facet: 'Clean Soapy Floral', family: 'floral', percent: 20 },
    ],
    scentDescription: 'Хрустящий, искрящийся альдегид с оттенками мандариновой цедры, холодного ладана и горного воздуха.',
    volatilityLabel: 'High (Top)',
  },
  {
    id: 'fw-cis-3-hexenol',
    name: 'Cis-3-Hexenol (Leaf Alcohol)',
    inciOrCas: '928-96-1',
    synonyms: ['Цис-3-гексенол', 'Спирт листьев'],
    family: 'green',
    tier: 'top',
    origin: 'synthetic',
    odorImpact: 580,
    substantivityHours: 4,
    averageUsePercent: '0.02% – 0.5%',
    scentBreakdown: [
      { facet: 'Crushed Fresh Cut Grass', family: 'green', percent: 85 },
      { facet: 'Unripe Green Banana / Apple', family: 'citrus', percent: 15 },
    ],
    scentDescription: 'Абсолютно реалистичный взрывной запах свежескошенной газонной травы и размятых зеленых листьев.',
    volatilityLabel: 'High (Top)',
  },
  {
    id: 'fw-suederal',
    name: 'Suederal LT (IFF)',
    inciOrCas: '68901-15-5',
    synonyms: ['Суедераль', 'Fine Suede Base'],
    family: 'leathery',
    tier: 'base',
    origin: 'base',
    odorImpact: 310,
    substantivityHours: 280,
    averageUsePercent: '0.2% – 5%',
    scentBreakdown: [
      { facet: 'Soft Glove Suede Leather', family: 'leathery', percent: 70 },
      { facet: 'Phenolic Birch / Osmathus', family: 'woody', percent: 20 },
      { facet: 'Animalic Musk Skin', family: 'musk', percent: 10 },
    ],
    scentDescription: 'Изысканная парфюмерная база с профилем тонкой перчаточной замши, идеально сочетающаяся с ирисом, османтусом и древесиной.',
    volatilityLabel: 'Low (Base)',
  },
  {
    id: 'fw-pink-pepper-co2',
    name: 'Pink Pepper CO2 Extract (Schinus molle)',
    inciOrCas: '68917-52-2',
    synonyms: ['Розовый перец CO2', 'Baies Roses'],
    family: 'spicy',
    tier: 'top',
    origin: 'natural',
    odorImpact: 210,
    substantivityHours: 16,
    averageUsePercent: '0.3% – 5%',
    scentBreakdown: [
      { facet: 'Effervescent Pink Berry Spice', family: 'spicy', percent: 55 },
      { facet: 'Juniper / Phellandrene Wood', family: 'woody', percent: 20 },
      { facet: 'Blood Orange / Citrus Peel', family: 'citrus', percent: 15 },
      { facet: 'Rosy Fruity Nuance', family: 'floral', percent: 10 },
    ],
    scentDescription: 'Яркий, шипучий пряно-ягодный старт с оттенками можжевельника, красного апельсина и свежей розы.',
    volatilityLabel: 'High (Top)',
  },
  {
    id: 'fw-labdanum-abs',
    name: 'Labdanum Absolute (Cistus ladanifer)',
    inciOrCas: '8016-26-0',
    synonyms: ['Лабданум абсолют', 'Ciste Absolue', 'Ambreine'],
    family: 'amber',
    tier: 'base',
    origin: 'natural',
    odorImpact: 260,
    substantivityHours: 400,
    averageUsePercent: '0.3% – 8%',
    scentBreakdown: [
      { facet: 'Resinous Balsamic Amber', family: 'amber', percent: 60 },
      { facet: 'Warm Antique Leather', family: 'leathery', percent: 20 },
      { facet: 'Dried Plum / Honeyed Wine', family: 'gourmand', percent: 10 },
      { facet: 'Dry Cedar / Incense', family: 'woody', percent: 10 },
    ],
    scentDescription: 'Сердце любого амбрового и шипрового аккорда: густая бальзамическая смола с кожаными, медово-винными и древесными гранями.',
    volatilityLabel: 'Fixative (Ultra-Base)',
  },
];

const SECONDARY_FAMILY_KEYWORDS: Array<{
  regex: RegExp;
  family: OlfactoryFamilyKey;
  facet: string;
}> = [
  { regex: /citrus|bergamot|lemon|orange|mandarin|grapefruit|lime|yuzu|citral|цитрус|бергамот|лимон|апельсин|грейпфрут|мандарин/i, family: 'citrus', facet: 'Citrus Zest' },
  { regex: /floral|rose|jasmin|violet|iris|orris|lily|muguet|neroli|ylang|orange blossom|peony|роза|жасмин|фиалк|ирис|ландыш|цветоч|нероли|иланг/i, family: 'floral', facet: 'Floral Nuance' },
  { regex: /wood|cedar|sandal|vetiver|patchouli|oud|guaiac|pine|cypress|древес|кедр|сандал|ветивер|пачули|уд|хвойн/i, family: 'woody', facet: 'Woody Core' },
  { regex: /spic|pepper|cardamom|cinnamon|clove|nutmeg|ginger|saffron|прян|перец|кардамон|кориц|гвоздик|имбир|шафран/i, family: 'spicy', facet: 'Warm Spice' },
  { regex: /amber|balsam|resin|incense|frankincense|myrrh|labdanum|benzoin|амбр|смол|бальзам|ладан|мирр|бензоин/i, family: 'amber', facet: 'Balsamic Amber' },
  { regex: /green|grass|leaf|herb|galbanum|fig|mint|tea|bamboo|зелен|трав|лист|гальбанум|инжир|мят|чай/i, family: 'green', facet: 'Green Foliage' },
  { regex: /musk|powdery|clean|skin|cashmere|ambrette|мускус|пудр|чист|кож/i, family: 'musk', facet: 'Soft Musk' },
  { regex: /gourmand|vanilla|caramel|sweet|coffee|cocoa|chocolate|honey|tonka|almond|berry|fruit|peach|plum|гурман|ванил|карамел|сладк|кофе|шоколад|мед|фрукт|ягод|персик|слив/i, family: 'gourmand', facet: 'Sweet / Fruity' },
  { regex: /aquatic|marine|sea|ocean|ozone|water|melon|акватик|морск|океан|озон|водн|арбуз/i, family: 'aquatic', facet: 'Marine / Ozone' },
  { regex: /leather|suede|smoke|birch|tobacco|animal|castoreum|civet|кожа|замш|дым|табак|животн|деготь/i, family: 'leathery', facet: 'Leather & Smoke' },
];

const DEFAULT_PRIMARY_FACET_LABEL: Record<OlfactoryFamilyKey, string> = {
  citrus: 'Fresh Citrus Peel',
  floral: 'Radiant Floral Heart',
  woody: 'Dry Wood Structure',
  spicy: 'Aromatic Spice',
  amber: 'Warm Resinous Amber',
  green: 'Crisp Green Leaf',
  musk: 'Velvety Skin Musk',
  gourmand: 'Sweet Gourmand Note',
  aquatic: 'Fresh Marine Breeze',
  leathery: 'Smoky Suede Leather',
};

const COMPLEMENTARY_FAMILY_MAP: Record<OlfactoryFamilyKey, { family: OlfactoryFamilyKey; facet: string }> = {
  citrus: { family: 'green', facet: 'Petitgrain / Zesty Green' },
  floral: { family: 'musk', facet: 'Soft Powdery Trail' },
  woody: { family: 'amber', facet: 'Dry Amber Undertone' },
  spicy: { family: 'woody', facet: 'Warm Woody Bark' },
  amber: { family: 'woody', facet: 'Resinous Cedar' },
  green: { family: 'citrus', facet: 'Crisp Dewy Lift' },
  musk: { family: 'floral', facet: 'Clean Powdery Violet' },
  gourmand: { family: 'amber', facet: 'Balsamic Vanilla Warmth' },
  aquatic: { family: 'citrus', facet: 'Sparkling Ozonic Air' },
  leathery: { family: 'woody', facet: 'Smoky Birch Wood' },
};

function parseLongevityHours(raw?: string, tier?: NoteTier): number {
  if (raw) {
    const lower = raw.toLowerCase();
    const numMatch = lower.match(/(\d+(?:[.,]\d+)?)/);
    if (numMatch) {
      const val = parseFloat(numMatch[1].replace(',', '.'));
      if (lower.includes('нед') || lower.includes('week')) return Math.min(400, Math.round(val * 168));
      if (lower.includes('дн') || lower.includes('сут') || lower.includes('day')) return Math.min(400, Math.round(val * 24));
      if (lower.includes('мес') || lower.includes('month')) return 400;
      return Math.max(1, Math.min(400, Math.round(val)));
    }
  }
  if (tier === 'top') return 8;
  if (tier === 'heart') return 48;
  if (tier === 'base') return 200;
  return 12;
}

export function getVolatilityLabel(hours: number, tier: NoteTier): FraterworksMaterialPassport['volatilityLabel'] {
  if (hours >= 240) return 'Fixative (Ultra-Base)';
  if (hours >= 96 || tier === 'base') return 'Low (Base)';
  if (hours >= 18 || tier === 'heart') return 'Medium (Heart)';
  return 'High (Top)';
}

const REF_BY_CAS = new Map<string, FraterworksMaterialPassport>();
const REF_BY_NAME = new Map<string, FraterworksMaterialPassport>();
const REF_BY_SHORT_NAME = new Map<string, FraterworksMaterialPassport>();
const REF_BY_SYNONYM = new Map<string, FraterworksMaterialPassport>();

for (const ref of FRATERWORKS_REFERENCE_MATERIALS) {
  if (ref.inciOrCas) REF_BY_CAS.set(ref.inciOrCas.toLowerCase(), ref);
  const lower = ref.name.toLowerCase();
  REF_BY_NAME.set(lower, ref);
  const shortLower = lower.split(' (')[0].trim();
  if (shortLower.length >= 4) REF_BY_SHORT_NAME.set(shortLower, ref);
  for (const syn of ref.synonyms) {
    REF_BY_SYNONYM.set(syn.toLowerCase(), ref);
  }
}

const PASSPORT_OBJECT_CACHE = new WeakMap<object, FraterworksMaterialPassport>();

function findReferencePassport(nameClean: string, casClean: string): FraterworksMaterialPassport | undefined {
  if (casClean) {
    const byCas = REF_BY_CAS.get(casClean);
    if (byCas) return byCas;
  }
  if (!nameClean) return undefined;
  const exact = REF_BY_NAME.get(nameClean) || REF_BY_SHORT_NAME.get(nameClean) || REF_BY_SYNONYM.get(nameClean);
  if (exact) return exact;
  if (nameClean.length >= 4) {
    for (const ref of FRATERWORKS_REFERENCE_MATERIALS) {
      const refNameLower = ref.name.toLowerCase();
      if (refNameLower.includes(nameClean) || nameClean.includes(refNameLower.split(' (')[0])) {
        return ref;
      }
    }
  }
  return undefined;
}

/**
 * Resolves a complete Fraterworks-style Scent Passport for any ingredient, library item, or formula component.
 */
export function getMaterialScentPassport(item: {
  id?: string;
  name: string;
  inciOrCas?: string;
  synonyms?: string[];
  family: OlfactoryFamilyKey;
  tier: NoteTier;
  origin?: IngredientOrigin;
  odorImpact?: number;
  substantivityHours?: number;
  averageUsePercent?: string;
  scentBreakdown?: ScentFacetBreakdown[];
  ifraLimitPercent?: number;
  longevityLabel?: string;
  blotterLongevity?: string;
  sillage?: 'intimate' | 'moderate' | 'strong';
  olfactoryNotes?: string;
  scentDescription?: string;
  properties?: string;
}): FraterworksMaterialPassport {
  const cached = PASSPORT_OBJECT_CACHE.get(item);
  if (cached) return cached;

  const casClean = (item.inciOrCas || '').trim().toLowerCase();
  const nameClean = (item.name || '').trim().toLowerCase();

  // 1. Check reference database match by CAS or exact/partial name
  const refMatch = findReferencePassport(nameClean, casClean);
  const ifraStd = resolveIfraStandard({
    name: item.name,
    inciOrCas: item.inciOrCas || refMatch?.inciOrCas,
    synonyms: item.synonyms || refMatch?.synonyms,
  });

  if (refMatch) {
    const hours = item.substantivityHours ?? refMatch.substantivityHours;
    const resolvedIfraLimit =
      ifraStd
        ? ifraStd.status === 'exempt_fcf' || ifraStd.status === 'unrestricted'
          ? undefined
          : ifraStd.category4LimitPercent
        : (item.ifraLimitPercent ?? refMatch.ifraLimitPercent);
    const resolved: FraterworksMaterialPassport = {
      ...refMatch,
      id: item.id || refMatch.id,
      name: item.name || refMatch.name,
      odorImpact: item.odorImpact ?? refMatch.odorImpact,
      substantivityHours: hours,
      averageUsePercent: item.averageUsePercent ?? refMatch.averageUsePercent,
      scentBreakdown: item.scentBreakdown && item.scentBreakdown.length > 0 ? item.scentBreakdown : refMatch.scentBreakdown,
      ifraLimitPercent: resolvedIfraLimit,
      ifraStatus: ifraStd?.status,
      volatilityLabel: getVolatilityLabel(hours, item.tier || refMatch.tier),
    };
    PASSPORT_OBJECT_CACHE.set(item, resolved);
    return resolved;
  }

  // 2. Infer substantivity hours
  const substantivityHours =
    item.substantivityHours ??
    parseLongevityHours(item.longevityLabel || item.blotterLongevity, item.tier);

  // 3. Infer Odor Impact (10 - 1000)
  let odorImpact = item.odorImpact;
  const combinedText = `${item.name} ${item.olfactoryNotes || ''} ${item.scentDescription || ''} ${item.properties || ''}`.toLowerCase();

  if (odorImpact === undefined) {
    if (item.tier === 'solvent') {
      odorImpact = 1;
    } else if (/aldehyde|альдегид|damascen|дамасцен|pyrazine|пиразин|javanol|ambrocenide|civet|castoreum|calone|калон|geosmin|геосмин|safraleine|акро|indol|индол|skatole|oxide|оксид/i.test(combinedText)) {
      odorImpact = 550;
    } else if (/absolute|абсолют|co2|cinnamon|кориц|clove|гвоздик|patchouli|пачули|oud|уд|maltol|мальтол|vanillin|ванилин|ionone|ионон|lactone|лактон|coumarin|кумарин|oakmoss|дубовый мох/i.test(combinedText)) {
      odorImpact = 220;
    } else if (item.sillage === 'strong') {
      odorImpact = 240;
    } else if (item.sillage === 'intimate') {
      odorImpact = 70;
    } else {
      odorImpact = item.tier === 'top' ? 115 : item.tier === 'heart' ? 130 : 150;
    }
  }

  // 4. Infer average use %
  let averageUsePercent = item.averageUsePercent;
  if (!averageUsePercent) {
    if (odorImpact >= 450) averageUsePercent = '0.02% – 0.8%';
    else if (odorImpact >= 220) averageUsePercent = '0.2% – 5%';
    else if (odorImpact >= 120) averageUsePercent = '1% – 15%';
    else averageUsePercent = '3% – 30%';
  }

  // 5. Infer multi-facet scentBreakdown
  let scentBreakdown = item.scentBreakdown;
  if (!scentBreakdown || scentBreakdown.length === 0) {
    const detectedSecondary: Array<{ family: OlfactoryFamilyKey; facet: string }> = [];
    for (const rule of SECONDARY_FAMILY_KEYWORDS) {
      if (rule.family !== item.family && rule.regex.test(combinedText)) {
        detectedSecondary.push({ family: rule.family, facet: rule.facet });
        if (detectedSecondary.length >= 2) break;
      }
    }

    const primaryLabel = DEFAULT_PRIMARY_FACET_LABEL[item.family] || 'Primary Accord';
    if (detectedSecondary.length === 2) {
      scentBreakdown = [
        { facet: primaryLabel, family: item.family, percent: 65 },
        { facet: detectedSecondary[0].facet, family: detectedSecondary[0].family, percent: 22 },
        { facet: detectedSecondary[1].facet, family: detectedSecondary[1].family, percent: 13 },
      ];
    } else if (detectedSecondary.length === 1) {
      const fallback = COMPLEMENTARY_FAMILY_MAP[item.family];
      if (fallback && fallback.family !== detectedSecondary[0].family) {
        scentBreakdown = [
          { facet: primaryLabel, family: item.family, percent: 65 },
          { facet: detectedSecondary[0].facet, family: detectedSecondary[0].family, percent: 25 },
          { facet: fallback.facet, family: fallback.family, percent: 10 },
        ];
      } else {
        scentBreakdown = [
          { facet: primaryLabel, family: item.family, percent: 75 },
          { facet: detectedSecondary[0].facet, family: detectedSecondary[0].family, percent: 25 },
        ];
      }
    } else {
      const fallback = COMPLEMENTARY_FAMILY_MAP[item.family];
      scentBreakdown = [
        { facet: primaryLabel, family: item.family, percent: 80 },
        { facet: fallback.facet, family: fallback.family, percent: 20 },
      ];
    }
  }

  const resolvedIfraLimit =
    ifraStd
      ? ifraStd.status === 'exempt_fcf' || ifraStd.status === 'unrestricted'
        ? undefined
        : ifraStd.category4LimitPercent
      : item.ifraLimitPercent;

  const resolved: FraterworksMaterialPassport = {
    id: item.id || `auto-${nameClean}`,
    name: item.name,
    inciOrCas: item.inciOrCas,
    synonyms: item.synonyms || [],
    family: item.family,
    tier: item.tier,
    origin: item.origin || 'synthetic',
    odorImpact,
    substantivityHours,
    averageUsePercent,
    ifraLimitPercent: resolvedIfraLimit,
    ifraStatus: ifraStd?.status,
    scentBreakdown,
    scentDescription: item.olfactoryNotes || item.scentDescription || '',
    volatilityLabel: getVolatilityLabel(substantivityHours, item.tier),
  };
  PASSPORT_OBJECT_CACHE.set(item, resolved);
  return resolved;
}

const INGREDIENTS_INDEX_CACHE = new WeakMap<
  Ingredient[],
  { byId: Map<string, Ingredient>; byName: Map<string, Ingredient> }
>();
const LIBRARY_INDEX_CACHE = new WeakMap<LibraryIngredient[], Map<string, LibraryIngredient>>();

function getIngredientsIndex(ingredients: Ingredient[]) {
  let cached = INGREDIENTS_INDEX_CACHE.get(ingredients);
  if (cached) return cached;
  const byId = new Map<string, Ingredient>();
  const byName = new Map<string, Ingredient>();
  for (const ing of ingredients) {
    byId.set(ing.id, ing);
    byName.set(ing.name.toLowerCase(), ing);
  }
  cached = { byId, byName };
  INGREDIENTS_INDEX_CACHE.set(ingredients, cached);
  return cached;
}

function getLibraryIndex(library: LibraryIngredient[]) {
  let cached = LIBRARY_INDEX_CACHE.get(library);
  if (cached) return cached;
  const byName = new Map<string, LibraryIngredient>();
  for (const lib of library) {
    byName.set(lib.name.toLowerCase(), lib);
  }
  LIBRARY_INDEX_CACHE.set(library, byName);
  return byName;
}

export function resolveComponentPassport(
  comp: FormulaComponent,
  ingredients: Ingredient[],
  library: LibraryIngredient[] = []
): FraterworksMaterialPassport {
  const ingIdx = getIngredientsIndex(ingredients);
  const compNameLower = comp.name.toLowerCase();
  const ing = comp.ingredientId
    ? ingIdx.byId.get(comp.ingredientId) || ingIdx.byName.get(compNameLower)
    : ingIdx.byName.get(compNameLower);

  if (ing) {
    if (
      comp.odorImpact === undefined &&
      comp.substantivityHours === undefined &&
      comp.scentBreakdown === undefined
    ) {
      return getMaterialScentPassport(ing);
    }
    return getMaterialScentPassport({
      ...ing,
      odorImpact: comp.odorImpact ?? ing.odorImpact,
      substantivityHours: comp.substantivityHours ?? ing.substantivityHours,
      scentBreakdown: comp.scentBreakdown ?? ing.scentBreakdown,
    });
  }

  if (library.length > 0) {
    const lib = getLibraryIndex(library).get(compNameLower);
    if (lib) {
      if (
        comp.odorImpact === undefined &&
        comp.substantivityHours === undefined &&
        comp.scentBreakdown === undefined
      ) {
        return getMaterialScentPassport(lib);
      }
      return getMaterialScentPassport({
        ...lib,
        odorImpact: comp.odorImpact ?? lib.odorImpact,
        substantivityHours: comp.substantivityHours ?? lib.substantivityHours,
        scentBreakdown: comp.scentBreakdown ?? lib.scentBreakdown,
      });
    }
  }

  return getMaterialScentPassport({
    id: comp.id,
    name: comp.name,
    family: comp.family,
    tier: comp.tier,
    odorImpact: comp.odorImpact,
    substantivityHours: comp.substantivityHours,
    scentBreakdown: comp.scentBreakdown,
    olfactoryNotes: comp.note,
  });
}

const FACET_TRANSLATIONS: Record<string, Record<AppLanguage, string>> = {
  "Animalic Leather Nuance": { ru: "Анималистично-кожаный нюанс", en: "Animalic Leather Nuance", it: "Sfumatura animale cuoiata", es: "Matiz animal de cuero", de: "Animalische Ledernuance" },
  "Animalic Musk Skin": { ru: "Анималистичный мускус кожи", en: "Animalic Musk Skin", it: "Muschio animale pelle", es: "Almizcle animal de piel", de: "Animalischer Hautmoschus" },
  "Balsamic Amber": { ru: "Бальзамическая амбра", en: "Balsamic Amber", it: "Ambra balsamica", es: "Ámbar balsámico", de: "Balsamischer Bernstein" },
  "Balsamic Benzoin": { ru: "Бальзамический бензоин", en: "Balsamic Benzoin", it: "Benzoino balsamico", es: "Benjuí balsámico", de: "Balsamisches Benzoe" },
  "Balsamic Vanilla Warmth": { ru: "Бальзамическое тепло ванили", en: "Balsamic Vanilla Warmth", it: "Calore vanigliato balsamico", es: "Calidez balsámica de vainilla", de: "Balsamische Vanillewärme" },
  "Bergamot / Petitgrain Citrus": { ru: "Бергамот / петитгрейн", en: "Bergamot / Petitgrain Citrus", it: "Agrumi bergamotto e petitgrain", es: "Cítrico bergamota y petitgrain", de: "Bergamotte- / Petitgrain-Zitrus" },
  "Bitter Grapefruit Peel": { ru: "Горькая цедра грейпфрута", en: "Bitter Grapefruit Peel", it: "Scorza amara di pompelmo", es: "Piel amarga de pomelo", de: "Herbe Grapefruitschale" },
  "Bitter Petitgrain Leaf": { ru: "Горький лист петитгрейна", en: "Bitter Petitgrain Leaf", it: "Foglia amara di petitgrain", es: "Hoja amarga de petitgrain", de: "Herbes Petitgrainblatt" },
  "Blood Orange / Citrus Peel": { ru: "Кровавый апельсин / цедра", en: "Blood Orange / Citrus Peel", it: "Arancia rossa e scorza", es: "Naranja sanguina y piel", de: "Blutorange / Zitrusschale" },
  "Camphoraceous Earthy Wood": { ru: "Камфорно-землистое дерево", en: "Camphoraceous Earthy Wood", it: "Legno canforato terroso", es: "Madera alcanforada terrosa", de: "Kampferartiges erdiges Holz" },
  "Citrus Zest": { ru: "Цитрусовая цедра", en: "Citrus Zest", it: "Scorza di agrumi", es: "Ralladura de cítricos", de: "Zitrusabrieb" },
  "Clean Powdery Violet": { ru: "Чистая пудровая фиалка", en: "Clean Powdery Violet", it: "Violetta talcata pulita", es: "Violeta empolvada limpia", de: "Sauberes pudriges Veilchen" },
  "Clean Skin Musk": { ru: "Чистый мускус «второй кожи»", en: "Clean Skin Musk", it: "Muschio pulito seconda pelle", es: "Almizcle limpio segunda piel", de: "Sauberer Hautmoschus" },
  "Clean Soapy Floral": { ru: "Чистый мыльно-цветочный тон", en: "Clean Soapy Floral", it: "Floreale pulito e saponoso", es: "Floral limpio y jabonoso", de: "Saubere seifige Blüten" },
  "Clean White Musk": { ru: "Чистый белый мускус", en: "Clean White Musk", it: "Muschio bianco pulito", es: "Almizcle blanco limpio", de: "Sauberer weißer Moschus" },
  "Coniferous Pine Wood": { ru: "Хвойная сосновая древесина", en: "Coniferous Pine Wood", it: "Legno di pino resinoso", es: "Madera de pino conífera", de: "Nadelholz-Kiefer" },
  "Cooked Strawberry Jam": { ru: "Клубничное варенье", en: "Cooked Strawberry Jam", it: "Confettura di fragole", es: "Mermelada de fresa", de: "Erdbeerkonfitüre" },
  "Cool Frankincense / Pine": { ru: "Прохладный ладан / сосна", en: "Cool Frankincense / Pine", it: "Incenso fresco e pino", es: "Incienso fresco y pino", de: "Kühler Weihrauch / Kiefer" },
  "Creamy Mysore Sandalwood": { ru: "Кремовый майсурский сандал", en: "Creamy Mysore Sandalwood", it: "Sandalo Mysore cremoso", es: "Sándalo Mysore cremoso", de: "Cremiges Mysore-Sandelholz" },
  "Crisp Dewy Lift": { ru: "Свежая росистая нота", en: "Crisp Dewy Lift", it: "Slancio fresco e rugiadoso", es: "Impulso fresco y húmedo", de: "Taufrischer Auftrieb" },
  "Crushed Fresh Cut Grass": { ru: "Скошенная зелёная трава", en: "Crushed Fresh Cut Grass", it: "Erba appena tagliata", es: "Hierba recién cortada", de: "Frisch geschnittenes Gras" },
  "Damp Mossy Green": { ru: "Влажная мшистая зелень", en: "Damp Mossy Green", it: "Verde umido e muschioso", es: "Verde húmedo de musgo", de: "Feuchtes moosiges Grün" },
  "Dark Cocoa / Wine Cellar": { ru: "Тёмное какао / винный погреб", en: "Dark Cocoa / Wine Cellar", it: "Cacao fondente e cantina", es: "Cacao oscuro y bodega", de: "Dunkler Kakao / Weinkeller" },
  "Dewy Green Tea": { ru: "Росистый зелёный чай", en: "Dewy Green Tea", it: "Tè verde rugiadoso", es: "Té verde húmedo", de: "Taufrischer grüner Tee" },
  "Dried Plum / Honeyed Wine": { ru: "Чернослив / медовое вино", en: "Dried Plum / Honeyed Wine", it: "Prugna secca e vino mielato", es: "Ciruela seca y vino meloso", de: "Getrocknete Pflaume / Honigwein" },
  "Dry Amber Undertone": { ru: "Сухой амбровый подтон", en: "Dry Amber Undertone", it: "Sottofondo ambrato secco", es: "Subtono ambarino seco", de: "Trockener Amber-Unterton" },
  "Dry Ambergris": { ru: "Сухая серая амбра", en: "Dry Ambergris", it: "Ambra grigia secca", es: "Ámbar gris seco", de: "Trockene Ambra" },
  "Dry Cedar / Incense": { ru: "Сухой кедр / ладан", en: "Dry Cedar / Incense", it: "Cedro secco e incenso", es: "Cedro seco e incienso", de: "Trockene Zeder / Weihrauch" },
  "Dry Driftwood": { ru: "Сухое морское дерево", en: "Dry Driftwood", it: "Legno marino secco", es: "Madera marina seca", de: "Trockenes Treibholz" },
  "Earl Grey Spice": { ru: "Пряный чай Эрл Грей", en: "Earl Grey Spice", it: "Spezie da tè Earl Grey", es: "Especia de té Earl Grey", de: "Earl-Grey-Gewürz" },
  "Earthy Root & Dry Wood": { ru: "Землистые корни и сухое дерево", en: "Earthy Root & Dry Wood", it: "Radici terrose e legno secco", es: "Raíces terrosas y madera seca", de: "Erdige Wurzeln & trockenes Holz" },
  "Effervescent Pink Berry Spice": { ru: "Искристые ягоды розового перца", en: "Effervescent Pink Berry Spice", it: "Pepe rosa frizzante", es: "Chispa de bayas de pimienta rosa", de: "Prickelnder rosa Pfeffer" },
  "Floral Nuance": { ru: "Цветочный нюанс", en: "Floral Nuance", it: "Nuance floreale", es: "Matiz floral", de: "Blumige Nuance" },
  "Fresh Floral Muguet / Lavender": { ru: "Свежий ландыш / лаванда", en: "Fresh Floral Muguet / Lavender", it: "Mughetto e lavanda freschi", es: "Muguet y lavanda frescos", de: "Frisches Maiglöckchen / Lavendel" },
  "Fresh Watermelon / Melon Rind": { ru: "Свежий арбуз / корка дыни", en: "Fresh Watermelon / Melon Rind", it: "Anguria fresca e scorza di melone", es: "Sandía fresca y corteza de melón", de: "Frische Wassermelone / Melonenschale" },
  "Green Foliage": { ru: "Зелёная листва", en: "Green Foliage", it: "Fogliame verde", es: "Follaje verde", de: "Grünes Laub" },
  "Herbal Green Leaf": { ru: "Травянистый зелёный лист", en: "Herbal Green Leaf", it: "Foglia verde erbacea", es: "Hoja verde herbácea", de: "Kräuteriges grünes Blatt" },
  "Juniper / Phellandrene Wood": { ru: "Можжевельник / фелландрен", en: "Juniper / Phellandrene Wood", it: "Ginepro e legno fellandrene", es: "Enebro y madera felandreno", de: "Wacholder / Phellandren-Holz" },
  "Lactonic Milky Skin": { ru: "Лактонно-молочная мягкость", en: "Lactonic Milky Skin", it: "Morbidezza lattonica cremosa", es: "Suavidad lactónica cremosa", de: "Lactonische Milchnote" },
  "Lavender / Linalyl Floral": { ru: "Лаванда / линалиловый цвет", en: "Lavender / Linalyl Floral", it: "Lavanda e sfaccettatura linalile", es: "Lavanda y faceta de linalilo", de: "Lavendel / Linalyl-Blüte" },
  "Leather & Smoke": { ru: "Кожа и лёгкий дым", en: "Leather & Smoke", it: "Cuoio e fumo", es: "Cuero y humo", de: "Leder & Rauch" },
  "Lily of the Valley Floral": { ru: "Цветок ландыша", en: "Lily of the Valley Floral", it: "Fiore di mughetto", es: "Flor de muguet", de: "Maiglöckchen-Blüte" },
  "Marine / Ozone": { ru: "Морской озон", en: "Marine / Ozone", it: "Ozono marino", es: "Ozono marino", de: "Meeresozon" },
  "Metallic Rose / Grapefruit": { ru: "Металлическая роза / грейпфрут", en: "Metallic Rose / Grapefruit", it: "Rosa metallica e pompelmo", es: "Rosa metálica y pomelo", de: "Metallische Rose / Grapefruit" },
  "Metallic Sparkling Citrus Zest": { ru: "Искрящаяся металлическая цедра", en: "Metallic Sparkling Citrus Zest", it: "Scorza agrumata frizzante metallica", es: "Ralladura metálica chispeante", de: "Metallisch-spritzige Zitrusschale" },
  "Mineral Ambergris": { ru: "Минеральная серая амбра", en: "Mineral Ambergris", it: "Ambra grigia minerale", es: "Ámbar gris mineral", de: "Mineralische Ambra" },
  "New-Mown Sweet Hay": { ru: "Сладкое свежескошенное сено", en: "New-Mown Sweet Hay", it: "Fieno dolce appena falciato", es: "Heno dulce recién segado", de: "Frisch gemähtes süßes Heu" },
  "Ocean Breeze & Oyster Shell": { ru: "Океанский бриз и ракушка", en: "Ocean Breeze & Oyster Shell", it: "Brezza oceanica e conchiglia", es: "Brisa marina y concha", de: "Meeresbrise & Muschelschale" },
  "Petitgrain / Zesty Green": { ru: "Петитгрейн / зелёная цедра", en: "Petitgrain / Zesty Green", it: "Petitgrain e verde agrumato", es: "Petitgrain y verde cítrico", de: "Petitgrain / herbes Grün" },
  "Phenolic Birch / Osmathus": { ru: "Берёзовый дёготь / османтус", en: "Phenolic Birch / Osmathus", it: "Betulla fenolica e osmanto", es: "Abedul fenólico y osmanto", de: "Phenolische Birke / Osmanthus" },
  "Pipe Tobacco / Tea Leaf": { ru: "Трубочный табак / чайный лист", en: "Pipe Tobacco / Tea Leaf", it: "Tabacco da pipa e foglia di tè", es: "Tabaco de pipa y hoja de té", de: "Pfeifentabak / Teeblatt" },
  "Powdery Floral Violet": { ru: "Пудровая фиалка", en: "Powdery Floral Violet", it: "Violetta talcata", es: "Violeta empolvada", de: "Pudriges Veilchen" },
  "Powdery Heliotrope": { ru: "Пудровый гелиотроп", en: "Powdery Heliotrope", it: "Eliotropio talcato", es: "Heliotropo empolvado", de: "Pudriges Heliotrop" },
  "Radiant Citrus Lift": { ru: "Сияющий цитрусовый подъём", en: "Radiant Citrus Lift", it: "Slancio agrumato radioso", es: "Impulso cítrico radiante", de: "Strahlender Zitrus-Auftrieb" },
  "Radiant Dry Wood-Amber": { ru: "Сияющее сухое амбродерево", en: "Radiant Dry Wood-Amber", it: "Ambrolegno secco radioso", es: "Madera-ámbar seca radiante", de: "Strahlendes trockenes Holz-Amber" },
  "Resinous Balsamic Amber": { ru: "Смолистая бальзамическая амбра", en: "Resinous Balsamic Amber", it: "Ambra resinosa balsamica", es: "Ámbar resinoso balsámico", de: "Harziger Balsam-Amber" },
  "Resinous Cedar": { ru: "Смолистый атласский кедр", en: "Resinous Cedar", it: "Cedro resinoso", es: "Cedro resinoso", de: "Harzige Zeder" },
  "Rich Amber Resin": { ru: "Богатая амбровая смола", en: "Rich Amber Resin", it: "Resina ambrata ricca", es: "Rica resina ambarina", de: "Reiches Bernsteinharz" },
  "Rich Bulgarian Rose": { ru: "Богатая болгарская роза", en: "Rich Bulgarian Rose", it: "Rosa bulgara opulenta", es: "Rosa búlgara rica", de: "Reiche bulgarische Rose" },
  "Rosewood Bark": { ru: "Кора розового дерева", en: "Rosewood Bark", it: "Corteccia di palissandro", es: "Corteza de palo de rosa", de: "Rosenholz-Rinde" },
  "Rosy Fruity Nuance": { ru: "Розово-фруктовый нюанс", en: "Rosy Fruity Nuance", it: "Nuance fruttata di rosa", es: "Matiz frutal de rosa", de: "Fruchtige Rosen-Nuance" },
  "Saline Marine": { ru: "Солоновато-морской акцент", en: "Saline Marine", it: "Accento marino salino", es: "Acento salino marino", de: "Salzig-marine Note" },
  "Sharp Cedar / Oud Smoke": { ru: "Кедр и дымный уд", en: "Sharp Cedar / Oud Smoke", it: "Cedro netto e fumo di oud", es: "Cedro nítido y humo de oud", de: "Scharfe Zeder / Oud-Rauch" },
  "Skin Musk / Iris": { ru: "Мускус кожи и нежный ирис", en: "Skin Musk / Iris", it: "Muschio pelle e iris", es: "Almizcle de piel e iris", de: "Hautmoschus / Iris" },
  "Smoky Birch Wood": { ru: "Дымная берёзовая древесина", en: "Smoky Birch Wood", it: "Legno di betulla affumicato", es: "Madera de abedul ahumada", de: "Rauchiges Birkenholz" },
  "Smoky Leather / Vetiverol": { ru: "Дымная кожа и ветиверол", en: "Smoky Leather / Vetiverol", it: "Cuoio affumicato e vetiverolo", es: "Cuero ahumado y vetiverol", de: "Rauchiges Leder / Vetiverol" },
  "Soft Glove Suede Leather": { ru: "Мягкая перчаточная замша", en: "Soft Glove Suede Leather", it: "Pelle scamosciata morbida", es: "Ante suave de guante", de: "Weiches Handschuh-Wildleder" },
  "Soft Musk": { ru: "Мягкий мускус", en: "Soft Musk", it: "Muschio morbido", es: "Almizcle suave", de: "Weicher Moschus" },
  "Soft Powdery Trail": { ru: "Мягкий пудровый шлейф", en: "Soft Powdery Trail", it: "Scia talcata morbida", es: "Estela suave empolvada", de: "Weicher pudriger Nachhall" },
  "Soft Suede Leather": { ru: "Мягкая замшевая кожа", en: "Soft Suede Leather", it: "Morbida pelle scamosciata", es: "Piel de ante suave", de: "Weiches Veloursleder" },
  "Solar Amber / Fruit": { ru: "Солнечная амбра и фрукты", en: "Solar Amber / Fruit", it: "Ambra solare e frutta", es: "Ámbar solar y fruta", de: "Sonniger Amber / Frucht" },
  "Sparkling Bergamot Zest": { ru: "Искристая цедра бергамота", en: "Sparkling Bergamot Zest", it: "Scorza frizzante di bergamotto", es: "Piel chispeante de bergamota", de: "Spritzige Bergamotteschale" },
  "Sparkling Ozonic Air": { ru: "Искрящийся озоновый воздух", en: "Sparkling Ozonic Air", it: "Aria ozonica frizzante", es: "Aire ozónico chispeante", de: "Prickelnde Ozonluft" },
  "Spiced Cardamom / Pepper": { ru: "Пряный кардамон и перец", en: "Spiced Cardamom / Pepper", it: "Cardamomo speziato e pepe", es: "Cardamomo especiado y pimienta", de: "Würziger Kardamom & Pfeffer" },
  "Spun Sugar / Caramel": { ru: "Сахарная вата / карамель", en: "Spun Sugar / Caramel", it: "Zucchero filato e caramello", es: "Algodón de azúcar y caramelo", de: "Zuckerwatte / Karamell" },
  "Stewed Plum / Berry Jam": { ru: "Вяленая слива / ягодный джем", en: "Stewed Plum / Berry Jam", it: "Prugna cotta e confettura", es: "Ciruela cocida y mermelada", de: "Pflaumenkompott / Beerenmarmelade" },
  "Sweet / Fruity": { ru: "Сладкий / фруктовый", en: "Sweet / Fruity", it: "Dolce / fruttato", es: "Dulce / afrutado", de: "Süß / fruchtig" },
  "Sweet Blackberry Fruit": { ru: "Сладкая ежевика", en: "Sweet Blackberry Fruit", it: "Mora dolce", es: "Mora dulce", de: "Süße Brombeere" },
  "Sweet Creamy Vanilla": { ru: "Сладкая сливочная ваниль", en: "Sweet Creamy Vanilla", it: "Vaniglia dolce cremosa", es: "Vainilla dulce cremosa", de: "Süße cremige Vanille" },
  "Toasted Warm Amber": { ru: "Тёплая поджаренная амбра", en: "Toasted Warm Amber", it: "Ambra tostata calda", es: "Ámbar tostado cálido", de: "Gerösteter warmer Amber" },
  "Tonka Bean / Marzipan": { ru: "Бобы тонка / марципан", en: "Tonka Bean / Marzipan", it: "Fava tonka e marzapane", es: "Haba tonka y mazapán", de: "Tonkabohne / Marzipan" },
  "Transparent Jasmine": { ru: "Прозрачный жасмин", en: "Transparent Jasmine", it: "Gelsomino trasparente", es: "Jazmín transparente", de: "Transparenter Jasmin" },
  "Unripe Green Banana / Apple": { ru: "Зелёный банан / кислое яблоко", en: "Unripe Green Banana / Apple", it: "Banana verde acerba e mela", es: "Plátano verde y manzana", de: "Unreife grüne Banane / Apfel" },
  "Velvety Cedarwood": { ru: "Бархатистый кедр", en: "Velvety Cedarwood", it: "Cedro vellutato", es: "Cedro aterciopelado", de: "Samtiges Zedernholz" },
  "Vetiver-Amber Undertone": { ru: "Ветиверово-амбровый подтон", en: "Vetiver-Amber Undertone", it: "Sottofondo vetiver e ambra", es: "Subtono de vetiver y ámbar", de: "Vetiver-Amber-Unterton" },
  "Warm Antique Leather": { ru: "Тёплая антикварная кожа", en: "Warm Antique Leather", it: "Cuoio antico caldo", es: "Cuero antiguo cálido", de: "Warmes antikes Leder" },
  "Warm Cashmere Musk": { ru: "Тёплый кашемировый мускус", en: "Warm Cashmere Musk", it: "Muschio caldo di cashmere", es: "Almizcle cálido de cachemira", de: "Warmer Kaschmirmoschus" },
  "Warm Fougère Amber": { ru: "Тёплая фужерная амбра", en: "Warm Fougère Amber", it: "Ambra fougère calda", es: "Ámbar fougère cálido", de: "Warmer Fougère-Amber" },
  "Warm Pencil Cedarwood": { ru: "Карандашный кедр", en: "Warm Pencil Cedarwood", it: "Legno di cedro da matita", es: "Madera de cedro de lápiz", de: "Warmes Bleistift-Zedernholz" },
  "Warm Spice": { ru: "Тёплые специи", en: "Warm Spice", it: "Spezie calde", es: "Especias cálidas", de: "Warme Gewürze" },
  "Warm Woody Bark": { ru: "Тёплая древесная кора", en: "Warm Woody Bark", it: "Corteccia legnosa calda", es: "Corteza amaderada cálida", de: "Warme Baumrinde" },
  "Woody Core": { ru: "Древесное ядро", en: "Woody Core", it: "Cuore legnoso", es: "Núcleo amaderado", de: "Holziger Kern" },
  "Primary Citrus / Floral": { ru: "Основная цитрусово-цветочная грань", en: "Primary Citrus / Floral", it: "Sfaccettatura primaria agrumi/fiori", es: "Faceta primaria cítrica/floral", de: "Primäre Zitrus-/Blütenfacette" },
  "Secondary Nuance": { ru: "Вторичный зелёный нюанс", en: "Secondary Nuance", it: "Nuance secondaria", es: "Matiz secundario", de: "Sekundäre Nuance" },
};

export function getLocalizedFacetName(facetName: string, language: AppLanguage): string {
  const clean = facetName.trim();
  const entry = FACET_TRANSLATIONS[clean];
  if (entry) return entry[language] || clean;
  return clean;
}

export function getLocalizedVolatilityLabel(volatility: string, language: AppLanguage): string {
  if (language === "ru") {
    if (volatility.startsWith("High")) return "Высокая (Верх)";
    if (volatility.startsWith("Medium")) return "Средняя (Сердце)";
    if (volatility.startsWith("Low")) return "Низкая (База)";
    if (volatility.startsWith("Fixative")) return "Фиксатор (Ультра-база)";
    return volatility;
  }
  if (language === "it") {
    if (volatility.startsWith("High")) return "Alta (Testa)";
    if (volatility.startsWith("Medium")) return "Media (Cuore)";
    if (volatility.startsWith("Low")) return "Bassa (Fondo)";
    if (volatility.startsWith("Fixative")) return "Fissativo (Ultra-fondo)";
    return volatility;
  }
  if (language === "es") {
    if (volatility.startsWith("High")) return "Alta (Salida)";
    if (volatility.startsWith("Medium")) return "Media (Corazón)";
    if (volatility.startsWith("Low")) return "Baja (Fondo)";
    if (volatility.startsWith("Fixative")) return "Fijador (Ultra-fondo)";
    return volatility;
  }
  if (language === "de") {
    if (volatility.startsWith("High")) return "Hoch (Kopf)";
    if (volatility.startsWith("Medium")) return "Mittel (Herz)";
    if (volatility.startsWith("Low")) return "Niedrig (Basis)";
    if (volatility.startsWith("Fixative")) return "Fixateur (Ultra-Basis)";
    return volatility;
  }
  return volatility;
}
