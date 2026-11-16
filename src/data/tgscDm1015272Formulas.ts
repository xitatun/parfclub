import { EMPTY_PROFILE } from "./constants";
import type {
  ConcentrationType,
  OlfactoryFamilyKey,
} from "../types/perfume";
import type {
  StarterFormulaComponentSpec,
  StarterFormulaDifficulty,
  StarterFormulaKind,
  StarterFormulaSpec,
} from "./starterFormulasData";

const DM1015272_URL = "https://www.thegoodscentscompany.com/demos/dm1015272.html";

const TIER_MAP = {
  t: "top",
  h: "heart",
  b: "base",
} as const;

const TIER_NOTE_RU: Record<"t" | "h" | "b", string> = {
  t: "Верхняя нота по спецификации TGSC",
  h: "Нота сердца по спецификации TGSC",
  b: "Базовый материал / носитель по TGSC",
};

const TIER_NOTE_EN: Record<"t" | "h" | "b", string> = {
  t: "Top note per TGSC demo formula",
  h: "Heart material per TGSC demo formula",
  b: "Base material / carrier per TGSC demo formula",
};

interface CompactTgscEntry {
  id: string;
  te: string;
  tr: string;
  sd: string;
  fa: OlfactoryFamilyKey;
  kd: StarterFormulaKind;
  df: StarterFormulaDifficulty;
  co: ConcentrationType;
  de: string;
  dr: string;
  pr: Partial<Record<OlfactoryFamilyKey, number>>;
  it: [string, number, "t" | "h" | "b", OlfactoryFamilyKey, number][];
}

const RAW_DM1015272_ENTRIES: CompactTgscEntry[] = [
  {
    "id": "tgsc-dm1015272-001",
    "te": "Agrestic sea chypre multipurpose perfume base",
    "tr": "Полевой морской шипр (универсальная парфюмерная база)",
    "sd": "TGSC (dm1015272) · Patent 5,525,589",
    "fa": "aquatic",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,525,589 Cyclic compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Полевой морской шипр (универсальная парфюмерная база)». Формула из патента 5,525,589. Ключевые материалы структуры: DIPG, benzyl salicylate, tropional, hedione.",
    "pr": {
      "floral": 50,
      "citrus": 4,
      "green": 40,
      "aquatic": 3,
      "musk": 1,
      "amber": 1,
      "woody": 4
    },
    "it": [
      [
        "3-tert-butylcyclohex-1-enyl)-acetonitrile",
        34.68,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-12 mna",
        11.56,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde mandarin",
        11.56,
        "t",
        "citrus",
        100
      ],
      [
        "armoise oil",
        17.34,
        "t",
        "green",
        100
      ],
      [
        "calone",
        5.78,
        "h",
        "aquatic",
        100
      ],
      [
        "cashmeran",
        5.78,
        "b",
        "musk",
        100
      ],
      [
        "clonal",
        34.68,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        5.78,
        "b",
        "amber",
        100
      ],
      [
        "DIPG",
        427.75,
        "b",
        "aquatic",
        0
      ],
      [
        "evernyl",
        23.12,
        "b",
        "woody",
        100
      ],
      [
        "florhydral",
        11.56,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        63.58,
        "h",
        "floral",
        100
      ],
      [
        "homofuronol 20% PG",
        1.16,
        "h",
        "gourmand",
        20
      ],
      [
        "2-isobutyl quinoline",
        2.31,
        "b",
        "leathery",
        100
      ],
      [
        "methyl octine carbonate",
        1.16,
        "t",
        "green",
        100
      ],
      [
        "rose oxide 10%",
        11.56,
        "h",
        "floral",
        10
      ],
      [
        "benzyl salicylate",
        196.53,
        "t",
        "green",
        100
      ],
      [
        "tagete oil",
        1.16,
        "h",
        "floral",
        100
      ],
      [
        "thyme essence",
        5.78,
        "t",
        "green",
        100
      ],
      [
        "tropional",
        115.61,
        "h",
        "floral",
        100
      ],
      [
        "(E,Z)-1,3,5-undecatriene",
        11.56,
        "h",
        "aquatic",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-002",
    "te": "Accord N° 208690 Amber floral (Firmenich)",
    "tr": "Аккорд №208690 · амбровый цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "amber",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · 1% of FIXOBOIS BASE 66606 harmonises the Phenolic notes of Thyme and Myrrh to create a floral, ambre, woody theme with a distinctive personality..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208690 · амбровый цветочный (Firmenich)». Ключевые материалы структуры: AMBROX® DL (Firmenich) 10%, MAYOL® (Firmenich), FLOROL® (Firmenich), HEXYLCINNAMIC ALDEHYDE.",
    "pr": {
      "amber": 19,
      "floral": 50,
      "citrus": 9,
      "green": 2,
      "woody": 9
    },
    "it": [
      [
        "AMBROX® DL (Firmenich) 10%",
        200,
        "b",
        "amber",
        10
      ],
      [
        "CIS-JASMONE",
        20,
        "h",
        "floral",
        100
      ],
      [
        "FARENAL (Symrise) 10%",
        50,
        "h",
        "floral",
        10
      ],
      [
        "FLOROL® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        90,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "LINALOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        145,
        "h",
        "floral",
        100
      ],
      [
        "MYRRH ESSENCE",
        15,
        "b",
        "amber",
        100
      ],
      [
        "PARMANTHEME K (Firmenich) 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "ROSE OXIDE 10%",
        40,
        "h",
        "floral",
        10
      ],
      [
        "THYME RED",
        25,
        "t",
        "green",
        100
      ],
      [
        "FIXOBOIS BASE 66606 (Firmenich) 10%",
        100,
        "b",
        "woody",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-003",
    "te": "Accord N° 208416 Amber powdery floral (Firmenich)",
    "tr": "Аккорд №208416 · амбровый пудровый цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "amber",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · CETALOX gives a warmth to what is, without the CETALOX, an oversweet lactonic character..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208416 · амбровый пудровый цветочный (Firmenich)». Ключевые материалы структуры: BERGAMOTE SYNTH, IRALIA® TOTAL (Firmenich), HEDIONE® (Firmenich), COUMARIN.",
    "pr": {
      "citrus": 47,
      "amber": 33,
      "floral": 50,
      "musk": 13,
      "woody": 10,
      "gourmand": 1
    },
    "it": [
      [
        "BERGAMOTE SYNTH",
        305,
        "t",
        "citrus",
        100
      ],
      [
        "COUMARIN",
        100,
        "b",
        "amber",
        100
      ],
      [
        "ETHYL VANILLIN 10%",
        50,
        "b",
        "amber",
        10
      ],
      [
        "FLOREX® (Firmenich)",
        12,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        87,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        125,
        "h",
        "floral",
        100
      ],
      [
        "HELIOTROPIN",
        25,
        "b",
        "amber",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        188,
        "h",
        "floral",
        100
      ],
      [
        "SANDALWOOD BASE 77125 B (Firmenich)",
        62,
        "b",
        "woody",
        100
      ],
      [
        "UNDECALACTONE GAMMA",
        6,
        "h",
        "gourmand",
        100
      ],
      [
        "CETALOX® (Firmenich) 10%",
        40,
        "b",
        "amber",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-004",
    "te": "Anisic fruity spicy",
    "tr": "Анисово-фруктовый пряный аккорд",
    "sd": "TGSC (dm1015272) · Patent 8,080,691",
    "fa": "spicy",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,080,691 Organoleptic compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Анисово-фруктовый пряный аккорд». Формула из патента 8,080,691. Ключевые материалы структуры: dimethyl benzyl carbinyl butyrate, applelide, benzyl alcohol, citronellol.",
    "pr": {
      "floral": 50,
      "citrus": 6,
      "musk": 5,
      "gourmand": 4,
      "aquatic": 1
    },
    "it": [
      [
        "acalea",
        37,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-8",
        1.4,
        "t",
        "citrus",
        100
      ],
      [
        "applelide",
        68.9,
        "b",
        "musk",
        100
      ],
      [
        "benzyl acetate",
        34.5,
        "h",
        "floral",
        100
      ],
      [
        "benzyl alcohol",
        68.9,
        "h",
        "floral",
        100
      ],
      [
        "benzyl propionate",
        34.5,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        68.9,
        "h",
        "floral",
        100
      ],
      [
        "cyclaprop",
        10.3,
        "h",
        "floral",
        100
      ],
      [
        "cyclemax",
        6.9,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl butyrate",
        82.7,
        "h",
        "floral",
        100
      ],
      [
        "3-pentylbicyclo[3.2.1]oct-6-en-2-one",
        50,
        "h",
        "floral",
        100
      ],
      [
        "ethyl caproate",
        6.9,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl vanillin",
        0.7,
        "b",
        "amber",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        1.4,
        "h",
        "gourmand",
        100
      ],
      [
        "floralozone",
        13.8,
        "h",
        "aquatic",
        100
      ],
      [
        "geranyl acetate",
        20.7,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        1.4,
        "h",
        "aquatic",
        100
      ],
      [
        "hexalon",
        6.9,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        2.8,
        "t",
        "green",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        41.3,
        "t",
        "citrus",
        100
      ],
      [
        "hexyl salicylate",
        0.7,
        "t",
        "green",
        100
      ],
      [
        "isocyclemone E",
        4.1,
        "t",
        "citrus",
        100
      ],
      [
        "kharismal",
        43.5,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        68.9,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        55.1,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        13.8,
        "t",
        "citrus",
        100
      ],
      [
        "methyl cinnamate",
        6.9,
        "h",
        "spicy",
        100
      ],
      [
        "methyl ionone alpha, iso",
        3.4,
        "h",
        "floral",
        100
      ],
      [
        "muguesia",
        20.7,
        "h",
        "floral",
        100
      ],
      [
        "nerol",
        34.5,
        "h",
        "floral",
        100
      ],
      [
        "neryl acetate",
        1.4,
        "h",
        "floral",
        100
      ],
      [
        "ocimene",
        0.7,
        "h",
        "floral",
        100
      ],
      [
        "orange peel oil decolorized",
        27.6,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        17.2,
        "h",
        "floral",
        100
      ],
      [
        "styralyl acetate",
        0.7,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        13.8,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        6.9,
        "h",
        "gourmand",
        100
      ],
      [
        "verdox",
        51.7,
        "h",
        "gourmand",
        100
      ],
      [
        "vertenex",
        68.5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-005",
    "te": "Accord Number 1242 - Green Apple (IFF)",
    "tr": "Аккорд №1242 · зелёный яблоко (IFF)",
    "sd": "TGSC (dm1015272) · IFF",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring CITRONELLAL 10%, DIHYDRO MYRCENOL, MANDARIN ALDEHYDE 10 % CITR (IFF) 10%, CIS-3 HEXENOL.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №1242 · зелёный яблоко (IFF)». Ключевые материалы структуры: ISO E SUPER® (IFF), DIPG, METHYL DH JASMONATE, APPLELIDE (IFF).",
    "pr": {
      "citrus": 7,
      "floral": 39,
      "spicy": 1,
      "gourmand": 17,
      "woody": 50,
      "musk": 18
    },
    "it": [
      [
        "CITRONELLAL 10%",
        1.5,
        "t",
        "citrus",
        10
      ],
      [
        "DIHYDRO MYRCENOL",
        20,
        "h",
        "floral",
        100
      ],
      [
        "MANDARIN ALDEHYDE 10 % CITR (IFF) 10%",
        7.3,
        "t",
        "citrus",
        10
      ],
      [
        "CIS-3 HEXENOL",
        1,
        "t",
        "green",
        100
      ],
      [
        "ANISYL ACETATE",
        3.5,
        "h",
        "spicy",
        100
      ],
      [
        "DAMASCOL (IFF)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "DIMETHYL BENZYL CARBINYL ACETATE",
        10,
        "h",
        "floral",
        100
      ],
      [
        "METHYL DH JASMONATE",
        145,
        "h",
        "floral",
        100
      ],
      [
        "TETRAHYDRO LINALYL ACETATE",
        32.5,
        "t",
        "citrus",
        100
      ],
      [
        "CASSIS BASE",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "CYCLOHEXYL ETHYL ACETATE (IFF)",
        3.5,
        "h",
        "floral",
        100
      ],
      [
        "DECALACTONE, GAMMA 10%",
        4.5,
        "h",
        "gourmand",
        10
      ],
      [
        "ETHYL BUTYRATE 1%",
        4.5,
        "h",
        "gourmand",
        1
      ],
      [
        "ETHYL HEPTOATE 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "ETHYL-2-METHYL BUTYRATE 10%",
        15,
        "h",
        "gourmand",
        10
      ],
      [
        "GERANYL ACETATE (IFF)",
        12,
        "h",
        "floral",
        100
      ],
      [
        "MANZANATE (Givaudan)",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "NONALACTONE, DELTA 10%",
        4.5,
        "h",
        "gourmand",
        10
      ],
      [
        "RASPBERRY KETONE",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "UNDECALACTONE GAMMA COEUR (IFF) 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "VERDOX™ (IFF)",
        35,
        "h",
        "gourmand",
        100
      ],
      [
        "CIS-3-HEXENYL BENZOATE (IFF)",
        1,
        "t",
        "green",
        100
      ],
      [
        "DIMETHYL BENZYL CARBINYL BUTYRATE",
        20,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER® (IFF)",
        290,
        "b",
        "woody",
        100
      ],
      [
        "APPLELIDE (IFF)",
        72.5,
        "b",
        "musk",
        100
      ],
      [
        "MUSCENONE™ (Firmenich) 10%",
        30,
        "b",
        "musk",
        10
      ],
      [
        "DIPG",
        235.7,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-006",
    "te": "Apple fragrance",
    "tr": "Яблоко аромат",
    "sd": "TGSC (dm1015272) · Patent 7,517,840",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,517,840 Optimized perfumery for rinse-off products.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Яблоко аромат». Формула из патента 7,517,840. Ключевые материалы структуры: hedione, DIPG, galaxolide 50 IPM, benzyl salicylate.",
    "pr": {
      "citrus": 12,
      "gourmand": 11,
      "floral": 50,
      "green": 15,
      "woody": 8,
      "musk": 15,
      "aquatic": 1
    },
    "it": [
      [
        "dextro-limonene",
        34.19,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        5.13,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl butyrate",
        0.85,
        "h",
        "gourmand",
        100
      ],
      [
        "styrallyl acetate",
        10.26,
        "h",
        "gourmand",
        100
      ],
      [
        "manzanate",
        2.56,
        "h",
        "gourmand",
        100
      ],
      [
        "hexyl acetate",
        6.84,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        42.74,
        "t",
        "citrus",
        100
      ],
      [
        "allyl caproate",
        3.42,
        "h",
        "gourmand",
        100
      ],
      [
        "linalool",
        38.46,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        22.22,
        "h",
        "floral",
        100
      ],
      [
        "tricyclodecenyl propionate",
        8.55,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        12.82,
        "t",
        "citrus",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        2.56,
        "t",
        "green",
        100
      ],
      [
        "citronellol",
        6.84,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        1.71,
        "t",
        "green",
        100
      ],
      [
        "verdox",
        49.57,
        "h",
        "gourmand",
        100
      ],
      [
        "fructone",
        1.28,
        "h",
        "gourmand",
        100
      ],
      [
        "lilial",
        42.74,
        "h",
        "floral",
        100
      ],
      [
        "aphermate",
        0.85,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        4.27,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        5.13,
        "h",
        "floral",
        100
      ],
      [
        "allyl cyclohexyl propionate",
        8.55,
        "h",
        "gourmand",
        100
      ],
      [
        "florol",
        30.77,
        "h",
        "floral",
        100
      ],
      [
        "phenoxyethyl isobutyrate",
        51.28,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        47.01,
        "b",
        "woody",
        100
      ],
      [
        "dynascone",
        0.26,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone",
        0.85,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-undecalactone",
        2.56,
        "h",
        "gourmand",
        100
      ],
      [
        "galaxolide 50 IPM",
        111.11,
        "b",
        "musk",
        50
      ],
      [
        "helional",
        8.55,
        "h",
        "aquatic",
        100
      ],
      [
        "hedione",
        162.39,
        "h",
        "floral",
        100
      ],
      [
        "vertofix",
        12.82,
        "b",
        "woody",
        100
      ],
      [
        "bacdanol",
        2.56,
        "b",
        "woody",
        100
      ],
      [
        "benzyl salicylate",
        105.56,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        4.27,
        "t",
        "green",
        100
      ],
      [
        "vanillin",
        0.85,
        "b",
        "amber",
        100
      ],
      [
        "DIPG",
        147.61,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-007",
    "te": "Apricot Accord",
    "tr": "Абрикос Аккорд",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Абрикос Аккорд». Ключевые материалы структуры: benzyl benzoate, DIPG, linalool, alpha-amyl cinnamaldehyde.",
    "pr": {
      "gourmand": 7,
      "citrus": 19,
      "green": 3,
      "floral": 50
    },
    "it": [
      [
        "allyl heptanoate",
        0.86,
        "h",
        "gourmand",
        100
      ],
      [
        "alpha-amyl cinnamaldehyde",
        77.59,
        "t",
        "citrus",
        100
      ],
      [
        "amyl salicylate",
        2.59,
        "t",
        "green",
        100
      ],
      [
        "benzyl acetate",
        8.62,
        "h",
        "floral",
        100
      ],
      [
        "benzyl benzoate",
        131.03,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        25.86,
        "t",
        "green",
        100
      ],
      [
        "BHT",
        38.79,
        "h",
        "floral",
        100
      ],
      [
        "buchu leaf oil 1%",
        2.59,
        "h",
        "gourmand",
        1
      ],
      [
        "citral",
        8.62,
        "t",
        "citrus",
        100
      ],
      [
        "cuminaldehyde 10%",
        0.86,
        "t",
        "citrus",
        10
      ],
      [
        "cyclacet",
        1.72,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        8.62,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-damascone",
        2.59,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-decalactone",
        1.72,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        2.59,
        "t",
        "citrus",
        100
      ],
      [
        "gamma-dodecalactone",
        0.86,
        "h",
        "gourmand",
        100
      ],
      [
        "DIPG",
        96.55,
        "b",
        "aquatic",
        0
      ],
      [
        "ethyl acetate 10%",
        0.86,
        "h",
        "floral",
        10
      ],
      [
        "geraniol",
        68.97,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        3.45,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        2.59,
        "h",
        "floral",
        100
      ],
      [
        "(E)-2-hexenal 10%",
        1.72,
        "h",
        "floral",
        10
      ],
      [
        "cis-3-hexenyl acetate 10%",
        1.72,
        "t",
        "green",
        10
      ],
      [
        "cis-3-hexenyl isobutyrate 10%",
        0.86,
        "t",
        "green",
        10
      ],
      [
        "hexyl acetate",
        6.9,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        68.97,
        "t",
        "citrus",
        100
      ],
      [
        "hexyl salicylate",
        2.59,
        "t",
        "green",
        100
      ],
      [
        "hydroxycitronellal",
        8.62,
        "t",
        "citrus",
        100
      ],
      [
        "indoflor",
        1.72,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        2.59,
        "h",
        "floral",
        100
      ],
      [
        "isoamyl acetate",
        4.31,
        "h",
        "floral",
        100
      ],
      [
        "isodamascone 10%",
        4.31,
        "h",
        "gourmand",
        10
      ],
      [
        "lilial",
        25.86,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        86.21,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        12.93,
        "t",
        "citrus",
        100
      ],
      [
        "nerol",
        51.72,
        "h",
        "floral",
        100
      ],
      [
        "neryl acetate",
        3.45,
        "h",
        "floral",
        100
      ],
      [
        "gamma-nonalactone",
        12.93,
        "h",
        "gourmand",
        100
      ],
      [
        "oxane 0.01%",
        17.24,
        "h",
        "floral",
        0.01
      ],
      [
        "phenyl acetaldehyde dimethyl acetal",
        3.45,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl acetate",
        3.45,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        4.31,
        "h",
        "gourmand",
        100
      ],
      [
        "tangerine oil",
        25.86,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-terpinyl acetate",
        51.72,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        5.17,
        "t",
        "green",
        100
      ],
      [
        "gamma-undecalactone",
        17.24,
        "h",
        "gourmand",
        100
      ],
      [
        "vertenex",
        51.72,
        "h",
        "floral",
        100
      ],
      [
        "apritone",
        34.48,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-008",
    "te": "Aromatic shampoo with a fresh connotation",
    "tr": "Ароматическая отдушка для шампуня со свежим звучанием",
    "sd": "TGSC (dm1015272) · Patent EP1229032",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent EP1229032 B1 1,3-oxathianes as perfuming and flavouring ingredients.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Ароматическая отдушка для шампуня со свежим звучанием». Формула из патента EP1229032. Ключевые материалы структуры: laevo-carvone, linalool, hedione, alpha-hexyl cinnamaldehyde.",
    "pr": {
      "floral": 50,
      "green": 21,
      "citrus": 12,
      "spicy": 1,
      "musk": 1,
      "aquatic": 1,
      "gourmand": 1,
      "amber": 1
    },
    "it": [
      [
        "isobornyl acetate",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        21.67,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        23.33,
        "t",
        "green",
        10
      ],
      [
        "citronellyl acetate",
        11.67,
        "h",
        "floral",
        100
      ],
      [
        "nopyl acetate",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        66.67,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-11 undecylenic 10%",
        3.33,
        "t",
        "citrus",
        10
      ],
      [
        "aldehyde C-14 10%",
        3.33,
        "t",
        "citrus",
        10
      ],
      [
        "bergamot imitation 20",
        33.33,
        "t",
        "citrus",
        100
      ],
      [
        "eugenol",
        11.67,
        "h",
        "spicy",
        100
      ],
      [
        "geraniol",
        6.67,
        "h",
        "floral",
        100
      ],
      [
        "habanolide",
        13.33,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        93.33,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        10,
        "h",
        "aquatic",
        100
      ],
      [
        "lilial",
        46.67,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        100,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "cyclosal",
        6.67,
        "h",
        "floral",
        100
      ],
      [
        "crystal moss 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "orange oil brazil",
        31.67,
        "t",
        "citrus",
        100
      ],
      [
        "laevo-carvone",
        110,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        33.33,
        "t",
        "green",
        100
      ],
      [
        "citral",
        1.67,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "allyl cyclohexyl propionate 10%",
        8.33,
        "h",
        "gourmand",
        10
      ],
      [
        "cornmint oil",
        66.67,
        "t",
        "green",
        100
      ],
      [
        "eucalyptol",
        20,
        "t",
        "green",
        100
      ],
      [
        "borneol",
        13.33,
        "t",
        "green",
        100
      ],
      [
        "camphor",
        50,
        "t",
        "green",
        100
      ],
      [
        "phenethyl alcohol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol 10%",
        10,
        "t",
        "green",
        10
      ],
      [
        "terpineol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        21.67,
        "t",
        "green",
        100
      ],
      [
        "vanillin 10%",
        16.67,
        "b",
        "amber",
        10
      ],
      [
        "vert de lilas",
        3.33,
        "h",
        "floral",
        100
      ],
      [
        "ylang ylang oil",
        6.67,
        "h",
        "floral",
        100
      ],
      [
        "2-(2,4-dimethyl-3-cyclohexene-1-yl)-4,4-dimethyl-1,3-oxathiane 10%",
        33.33,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-009",
    "te": "Accord N° 207988 Aromatic woody citrus floral (Firmenich)",
    "tr": "Аккорд №207988 · ароматический древесный цитрусовый цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · LIMBWOOD 109289 B confers to this accord a much more pronounced masculine woody note which is visible on top note and on dry down..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207988 · ароматический древесный цитрусовый цветочный (Firmenich)». Ключевые материалы структуры: HEDIONE® (Firmenich), PATCHOULI OIL, LINALYL ACETATE, VERTOFIX® COEUR (IFF).",
    "pr": {
      "citrus": 29,
      "floral": 50,
      "amber": 4,
      "musk": 8,
      "green": 6,
      "woody": 46,
      "aquatic": 1
    },
    "it": [
      [
        "BERGAMOT OIL",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "CITRAL",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "CIVETTE SYNTH 50%",
        5,
        "h",
        "floral",
        50
      ],
      [
        "COUMARIN",
        20,
        "b",
        "amber",
        100
      ],
      [
        "ETHYL LINALOL",
        30,
        "h",
        "floral",
        100
      ],
      [
        "EXALTOLIDE® TOTAL (Firmenich) 50%",
        35,
        "b",
        "musk",
        50
      ],
      [
        "GERANIUM SYNTH",
        10,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        200,
        "h",
        "floral",
        100
      ],
      [
        "LAVANDIN OIL",
        40,
        "t",
        "green",
        100
      ],
      [
        "LEMON OIL",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "LEVOCITROL",
        30,
        "h",
        "floral",
        100
      ],
      [
        "LINALYL ACETATE",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "LYRAL® (IFF)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "MUSCONE (Firmenich)",
        20,
        "b",
        "musk",
        100
      ],
      [
        "OAKMOSS 50 % DIPG",
        10,
        "b",
        "woody",
        50
      ],
      [
        "PATCHOULI OIL",
        140,
        "b",
        "woody",
        100
      ],
      [
        "SANDALWOOD BASE 77125 B (Firmenich)",
        10,
        "b",
        "woody",
        100
      ],
      [
        "TAMARINE BASE 41310 G (Firmenich)",
        10,
        "h",
        "aquatic",
        100
      ],
      [
        "VANILLIN",
        5,
        "b",
        "amber",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        80,
        "b",
        "woody",
        100
      ],
      [
        "LIMBWOOD 109289 B (Firmenich)",
        70,
        "b",
        "woody",
        100
      ],
      [
        "DIPG",
        30,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-010",
    "te": "Bamboo and cucumber fragrance",
    "tr": "Аромат бамбука и свежего огурца",
    "sd": "TGSC (dm1015272) · Patent 7,517,840",
    "fa": "aquatic",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,517,840 Optimized perfumery for rinse-off products.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат бамбука и свежего огурца». Формула из патента 7,517,840. Ключевые материалы структуры: hedione, galaxolide 50 IPM, lilial, phenoxyethyl isobutyrate.",
    "pr": {
      "citrus": 13,
      "gourmand": 5,
      "floral": 50,
      "green": 4,
      "aquatic": 1,
      "musk": 16,
      "woody": 2
    },
    "it": [
      [
        "dextro-limonene",
        42.8,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        4.1,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl butyrate",
        0.9,
        "h",
        "gourmand",
        100
      ],
      [
        "styrallyl acetate",
        14.7,
        "h",
        "gourmand",
        100
      ],
      [
        "hexyl acetate",
        3.5,
        "h",
        "floral",
        100
      ],
      [
        "cyclacet",
        7.7,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        38.4,
        "t",
        "citrus",
        100
      ],
      [
        "allyl caproate",
        4.5,
        "h",
        "gourmand",
        100
      ],
      [
        "benzyl acetate",
        33.3,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        20.5,
        "t",
        "citrus",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        4.5,
        "t",
        "green",
        100
      ],
      [
        "verdox",
        16.6,
        "h",
        "gourmand",
        100
      ],
      [
        "citronellol",
        9.6,
        "h",
        "floral",
        100
      ],
      [
        "tricyclodecenyl propionate",
        7,
        "h",
        "floral",
        100
      ],
      [
        "melonal",
        0.6,
        "h",
        "aquatic",
        100
      ],
      [
        "triplal",
        2.6,
        "t",
        "green",
        100
      ],
      [
        "methyl pamplemousse",
        2.9,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalol",
        5.8,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        128,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        26.9,
        "h",
        "floral",
        100
      ],
      [
        "benzaldehyde",
        0.3,
        "t",
        "citrus",
        100
      ],
      [
        "aphermate",
        1.3,
        "h",
        "floral",
        100
      ],
      [
        "(E,Z)-2,6-nonadienal",
        0.3,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        43.5,
        "t",
        "citrus",
        100
      ],
      [
        "phenoxyethyl isobutyrate",
        76.8,
        "h",
        "floral",
        100
      ],
      [
        "allyl cyclohexyl propionate",
        10.2,
        "h",
        "gourmand",
        100
      ],
      [
        "florhydral",
        4.5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        1.3,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        7.7,
        "h",
        "floral",
        100
      ],
      [
        "(E,Z)-2,6-nonadien-1-ol",
        0.4,
        "h",
        "floral",
        100
      ],
      [
        "cis-jasmone",
        0.6,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl butyrate",
        7.7,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        224.7,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        172.8,
        "b",
        "musk",
        50
      ],
      [
        "damascenone",
        0.9,
        "h",
        "floral",
        100
      ],
      [
        "dynascone",
        0.4,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        7,
        "h",
        "aquatic",
        100
      ],
      [
        "magnolan",
        2.6,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        1.3,
        "h",
        "gourmand",
        100
      ],
      [
        "vertofix",
        16,
        "b",
        "woody",
        100
      ],
      [
        "bacdanol",
        3.2,
        "b",
        "woody",
        100
      ],
      [
        "dihydroisojasmonate",
        3.8,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        30.7,
        "t",
        "green",
        100
      ],
      [
        "muscone",
        0.6,
        "b",
        "musk",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        5.1,
        "t",
        "green",
        100
      ],
      [
        "alpha-sinensal",
        0.1,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        1.3,
        "b",
        "amber",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-011",
    "te": "Base perfuming composition",
    "tr": "Базовая парфюмерная композиция",
    "sd": "TGSC (dm1015272) · Patent 5,219,836",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,219,836 Use of tetrahydro-4-methyl-2-phenyl-2H-pyran as perfuming ingredient.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Базовая парфюмерная композиция». Формула из патента 5,219,836. Ключевые материалы структуры: exolide, bergamot oil bergaptene reduced, vertofix, dihydromyrcenol.",
    "pr": {
      "amber": 4,
      "citrus": 50,
      "aquatic": 6,
      "gourmand": 5,
      "floral": 47,
      "green": 10,
      "woody": 25
    },
    "it": [
      [
        "ambrox DL",
        16.67,
        "b",
        "amber",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "calone 10%",
        8.89,
        "h",
        "aquatic",
        10
      ],
      [
        "alpha-damascone 10%",
        16.67,
        "h",
        "gourmand",
        10
      ],
      [
        "dihydromyrcenol",
        83.33,
        "t",
        "citrus",
        100
      ],
      [
        "exolide",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "florol",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "galbanum oil 10%",
        16.67,
        "t",
        "green",
        10
      ],
      [
        "galbex 183",
        44.44,
        "h",
        "floral",
        100
      ],
      [
        "geranium oil china",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        5.56,
        "h",
        "floral",
        100
      ],
      [
        "ocean propanal 10%",
        8.89,
        "h",
        "floral",
        10
      ],
      [
        "hydroxycitronellal",
        11.11,
        "t",
        "citrus",
        100
      ],
      [
        "iso e super",
        27.78,
        "b",
        "woody",
        100
      ],
      [
        "juniper berry oil",
        13.33,
        "h",
        "gourmand",
        100
      ],
      [
        "labdanum resinoid 50%",
        11.11,
        "b",
        "amber",
        50
      ],
      [
        "lavandin oil",
        33.33,
        "t",
        "green",
        100
      ],
      [
        "linalool",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        55.56,
        "t",
        "citrus",
        100
      ],
      [
        "melonal 1%",
        27.78,
        "h",
        "aquatic",
        1
      ],
      [
        "methyl anthranilate 10%",
        5.56,
        "h",
        "floral",
        10
      ],
      [
        "oranger crystals 10%",
        27.78,
        "t",
        "citrus",
        10
      ],
      [
        "aldehyde C-12 mna 10%",
        3.33,
        "t",
        "citrus",
        10
      ],
      [
        "veramoss",
        5.56,
        "b",
        "woody",
        100
      ],
      [
        "hedione",
        61.11,
        "h",
        "floral",
        100
      ],
      [
        "orange oil florida",
        22.22,
        "t",
        "citrus",
        100
      ],
      [
        "polysantol",
        22.22,
        "b",
        "woody",
        100
      ],
      [
        "clary sage oil",
        8.89,
        "t",
        "green",
        100
      ],
      [
        "spearmint oil",
        4.44,
        "t",
        "green",
        100
      ],
      [
        "vertofix",
        88.89,
        "b",
        "woody",
        100
      ],
      [
        "vetiver oil haiti",
        13.33,
        "b",
        "woody",
        100
      ],
      [
        "2,4-ivy carbaldehyde 10%",
        16.67,
        "t",
        "citrus",
        10
      ],
      [
        "DIPG",
        66.67,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-012",
    "te": "Red berries fragrance for use in shampoo",
    "tr": "Аромат красных ягод для шампуня",
    "sd": "TGSC (dm1015272) · Patent 7,632,790",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,632,790 Trisubstituted furans suitable for the preparation of fragrance compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат красных ягод для шампуня». Формула из патента 7,632,790. Ключевые материалы структуры: phenoxyethyl isobutyrate, hexyl salicylate, DIPG, green acetate.",
    "pr": {
      "gourmand": 9,
      "citrus": 4,
      "amber": 1,
      "green": 23,
      "woody": 6,
      "floral": 50,
      "musk": 4
    },
    "it": [
      [
        "allyl hexanoate",
        0.4,
        "h",
        "gourmand",
        100
      ],
      [
        "allyl pentyloxyacetate",
        0.5,
        "h",
        "gourmand",
        100
      ],
      [
        "benzaldehyde",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "heliotropin",
        6,
        "b",
        "amber",
        100
      ],
      [
        "green acetate",
        70,
        "t",
        "green",
        100
      ],
      [
        "woody acetate",
        1,
        "b",
        "woody",
        100
      ],
      [
        "2-cyclohexyl-2-phenyl acetonitrile",
        5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "decanal",
        0.6,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-18",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "cyclal C",
        4,
        "h",
        "floral",
        100
      ],
      [
        "lemonile",
        0.2,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl linalool",
        60,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl butyrate",
        3,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        117.91,
        "b",
        "aquatic",
        0
      ],
      [
        "ambroxan",
        0.1,
        "b",
        "amber",
        100
      ],
      [
        "ethyl acetate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "ethyl acetoacetate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "ethyl butyrate",
        0.2,
        "h",
        "gourmand",
        100
      ],
      [
        "rose carboxylate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "ethyl heptanoate",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl maltol",
        0.1,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "3-ethyl-6-ethyl-6-octen-1-ol",
        5,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-16",
        7,
        "t",
        "citrus",
        100
      ],
      [
        "(E)-coconut decanone ethyl 1%",
        2,
        "h",
        "floral",
        1
      ],
      [
        "ethyl vanillin",
        0.05,
        "b",
        "amber",
        100
      ],
      [
        "galaxolide 50 IPM",
        40,
        "b",
        "musk",
        50
      ],
      [
        "hexyl salicylate",
        140,
        "t",
        "green",
        100
      ],
      [
        "raspberry ketone",
        70,
        "h",
        "gourmand",
        100
      ],
      [
        "beta-ionone",
        28,
        "h",
        "floral",
        100
      ],
      [
        "isoamyl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        50,
        "b",
        "woody",
        100
      ],
      [
        "laevo-menthol",
        0.5,
        "h",
        "floral",
        100
      ],
      [
        "verdyl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde",
        0.5,
        "t",
        "citrus",
        100
      ],
      [
        "raspberry ketone methyl ether",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "methyl anthranilate",
        0.2,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        0.2,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        1.3,
        "t",
        "citrus",
        100
      ],
      [
        "anapear",
        0.3,
        "h",
        "gourmand",
        100
      ],
      [
        "13-methyl-10-oxacyclopentadecen-2-one",
        5,
        "h",
        "floral",
        100
      ],
      [
        "cis-galbanum oxathiane 50%",
        0.09,
        "t",
        "green",
        50
      ],
      [
        "phenoxyethyl isobutyrate",
        243,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "prenyl acetate",
        0.3,
        "h",
        "floral",
        100
      ],
      [
        "labienoxime 1%/IPM-TEC",
        0.5,
        "h",
        "floral",
        1
      ],
      [
        "1-(2,6,6-rimethyl-2-cyclohexen-1-ylhepta-1,6-dien-3-one",
        0.05,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "2-(3',3'-dimethylcyclohexyl)-2,5-dimethyl-2,5-dihydrofuran",
        10,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-013",
    "te": "cassis type",
    "tr": "Чёрная смородина (кассис) (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring citronellol, benzyl benzoate, alpha-amyl cinnamaldehyde, hydroxycitronellol.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Чёрная смородина (кассис) (тип)». Ключевые материалы структуры: cassis cyclohexene, citronellol, benzyl benzoate, alpha-amyl cinnamaldehyde.",
    "pr": {
      "floral": 50,
      "citrus": 7,
      "gourmand": 27
    },
    "it": [
      [
        "citronellol",
        200,
        "h",
        "floral",
        100
      ],
      [
        "benzyl benzoate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "alpha-amyl cinnamaldehyde",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "hydroxycitronellol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "ylang ylang oil",
        60,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        60,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        40,
        "h",
        "floral",
        100
      ],
      [
        "phenoxyethyl propionate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone 1%",
        20,
        "h",
        "gourmand",
        1
      ],
      [
        "linalool",
        20,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cassis cyclohexene",
        300,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-014",
    "te": "Chypre base",
    "tr": "Шипр парфюмерная база",
    "sd": "TGSC (dm1015272) · Patent 3,962,147",
    "fa": "woody",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 3,962,147 Perfume composition containing 6,10 dimethyl - spiro [4.5]decane-type compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Шипр парфюмерная база». Формула из патента 3,962,147. Ключевые материалы структуры: bergamot oil replacer, undecanal 10%, benzyl acetate, coumarin.",
    "pr": {
      "gourmand": 4,
      "floral": 50,
      "citrus": 34,
      "amber": 9,
      "musk": 7,
      "woody": 5,
      "green": 1,
      "leathery": 2
    },
    "it": [
      [
        "styrallyl acetate",
        33.33,
        "h",
        "gourmand",
        100
      ],
      [
        "undecanal 10%",
        111.11,
        "h",
        "floral",
        10
      ],
      [
        "aldehyde C-12 mna 10%",
        22.22,
        "t",
        "citrus",
        10
      ],
      [
        "coumarin",
        66.67,
        "b",
        "amber",
        100
      ],
      [
        "vanillin",
        5.56,
        "b",
        "amber",
        100
      ],
      [
        "musk ketone",
        61.11,
        "b",
        "musk",
        100
      ],
      [
        "cyclopentadecanone 10%",
        33.33,
        "h",
        "floral",
        10
      ],
      [
        "alpha-isomethyl ionone (70% min.)",
        66.67,
        "h",
        "floral",
        70
      ],
      [
        "oakmoss absolute",
        22.22,
        "b",
        "woody",
        100
      ],
      [
        "labdanum absolute",
        11.11,
        "b",
        "amber",
        100
      ],
      [
        "galbanum oil replacer",
        11.11,
        "t",
        "green",
        100
      ],
      [
        "castoreum absolute replacer",
        22.22,
        "b",
        "leathery",
        100
      ],
      [
        "methyl dihydrojasmonate",
        55.56,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        11.11,
        "h",
        "floral",
        10
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        55.56,
        "t",
        "citrus",
        100
      ],
      [
        "rose absolute replacer",
        55.56,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        22.22,
        "b",
        "woody",
        100
      ],
      [
        "bergamot oil replacer",
        222.22,
        "t",
        "citrus",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-015",
    "te": "Chypre perfume base (Patent 4,657,700)",
    "tr": "Шипр парфюм парфюмерная база (Патент 4,657,700)",
    "sd": "TGSC (dm1015272) · Patent 4,657,700",
    "fa": "woody",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,657,700 Fragrance compositions containing benzyl ethers.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Шипр парфюм парфюмерная база (Патент 4,657,700)». Формула из патента 4,657,700. Ключевые материалы структуры: isoraldeine, DIPG, musk ketone, phenethyl alcohol.",
    "pr": {
      "floral": 50,
      "musk": 11,
      "citrus": 17,
      "woody": 13,
      "spicy": 3,
      "gourmand": 2,
      "green": 2,
      "leathery": 2,
      "amber": 1
    },
    "it": [
      [
        "isoraldeine",
        200,
        "h",
        "floral",
        100
      ],
      [
        "musk ketone",
        100,
        "b",
        "musk",
        100
      ],
      [
        "phenethyl alcohol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        70,
        "t",
        "citrus",
        100
      ],
      [
        "treemoss absolute",
        50,
        "h",
        "floral",
        100
      ],
      [
        "vetiveryl acetate",
        50,
        "b",
        "woody",
        100
      ],
      [
        "methyl dihydrojasmonate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "patchouli oil",
        30,
        "b",
        "woody",
        100
      ],
      [
        "rhodinol ex geranium",
        30,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        30,
        "h",
        "spicy",
        100
      ],
      [
        "sandela",
        30,
        "h",
        "floral",
        100
      ],
      [
        "cedarwood oil virginia",
        30,
        "b",
        "woody",
        100
      ],
      [
        "styrallyl acetate",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "galbanum oil",
        10,
        "t",
        "green",
        100
      ],
      [
        "neroli oil",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "castoreum absolute 10%",
        10,
        "b",
        "leathery",
        10
      ],
      [
        "isobutyl quinoline 10%",
        10,
        "b",
        "leathery",
        10
      ],
      [
        "armoise oil",
        10,
        "t",
        "green",
        100
      ],
      [
        "aldehyde C-11 undecylenic 10%",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "citral",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-14",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "cistus twig/leaf oil",
        5,
        "b",
        "amber",
        100
      ],
      [
        "DIPG",
        105,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-016",
    "te": "Chypre perfume base (Patent 4,544,714)",
    "tr": "Шипр парфюм парфюмерная база (Патент 4,544,714)",
    "sd": "TGSC (dm1015272) · Patent 4,544,714",
    "fa": "woody",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,544,714 Odorant oximes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Шипр парфюм парфюмерная база (Патент 4,544,714)». Формула из патента 4,544,714. Ключевые материалы структуры: DIPG, hydroxycitronellal, bergamot oil bergaptene reduced, methyl dihydrojasmonate.",
    "pr": {
      "citrus": 44,
      "floral": 50,
      "woody": 13,
      "musk": 7,
      "gourmand": 1
    },
    "it": [
      [
        "hydroxycitronellal",
        111.11,
        "t",
        "citrus",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        88.89,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        88.89,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        88.89,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        88.89,
        "h",
        "floral",
        100
      ],
      [
        "treemoss absolute (colourless)",
        44.44,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        44.44,
        "b",
        "woody",
        100
      ],
      [
        "linalool",
        44.44,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        44.44,
        "h",
        "floral",
        100
      ],
      [
        "musk ketone",
        44.44,
        "b",
        "musk",
        100
      ],
      [
        "vetiver oil haiti",
        22.22,
        "b",
        "woody",
        100
      ],
      [
        "sandalwood oil",
        22.22,
        "b",
        "woody",
        100
      ],
      [
        "benzyl acetate",
        22.22,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        5.56,
        "h",
        "gourmand",
        100
      ],
      [
        "aldehyde C-14",
        5.56,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-11 undecylic 10%",
        5.56,
        "t",
        "citrus",
        10
      ],
      [
        "civet oil 10%",
        5.56,
        "h",
        "floral",
        10
      ],
      [
        "DIPG",
        222.22,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-017",
    "te": "Chypre perfume composition",
    "tr": "Шипр парфюм композиция",
    "sd": "TGSC (dm1015272) · Patent 4,485,036",
    "fa": "woody",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,485,036 Odorant compositions containing megastigma-5(11),8-dien-4,7-oxides and tetra-substituted-7-oxa-bicyclo[3.3.0]-octanes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Шипр парфюм композиция». Формула из патента 4,485,036. Ключевые материалы структуры: madrox, alpha-hexyl cinnamaldehyde, bergamot oil bergaptene reduced, methyl dihydrojasmonate.",
    "pr": {
      "floral": 46,
      "citrus": 50,
      "woody": 10,
      "spicy": 2,
      "musk": 2,
      "gourmand": 1
    },
    "it": [
      [
        "madrox",
        200,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        80,
        "h",
        "floral",
        100
      ],
      [
        "vetiveryl acetate",
        60,
        "b",
        "woody",
        100
      ],
      [
        "alpha-ionone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "coriander seed oil",
        20,
        "h",
        "spicy",
        100
      ],
      [
        "benzyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "rhodinol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "ethylene brassylate",
        20,
        "b",
        "musk",
        100
      ],
      [
        "8.alpha.,12-oxido-13,14,15,16-tetranorlabdane",
        10,
        "h",
        "floral",
        100
      ],
      [
        "wormseed oil replacer",
        10,
        "h",
        "floral",
        100
      ],
      [
        "corps cassis",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "3,5-ivy carbaldehyde 10%",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "treemoss absolute 50%",
        20,
        "h",
        "floral",
        50
      ],
      [
        "patchouli oil",
        20,
        "b",
        "woody",
        100
      ],
      [
        "DIPG",
        80,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-018",
    "te": "citrus bergamot lemon type",
    "tr": "Цитрусовый бергамот лимон (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring camphor, galbanum oil, alpha-hexyl cinnamaldehyde, iso e super.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цитрусовый бергамот лимон (тип)». Ключевые материалы структуры: DIPG, alpha-hexyl cinnamaldehyde, methyl dihydrojasmonate, woody acetate.",
    "pr": {
      "green": 5,
      "citrus": 50,
      "woody": 32,
      "floral": 40
    },
    "it": [
      [
        "camphor",
        20,
        "t",
        "green",
        100
      ],
      [
        "galbanum oil",
        1,
        "t",
        "green",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        150,
        "t",
        "citrus",
        100
      ],
      [
        "iso e super",
        50,
        "b",
        "woody",
        100
      ],
      [
        "lemon oil c.p. california",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "lime oil",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        150,
        "h",
        "floral",
        100
      ],
      [
        "oranger crystals",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "nerolin bromelia",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "patchouli oil",
        3,
        "b",
        "woody",
        100
      ],
      [
        "petitgrain oil paraguay",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "woody acetate",
        150,
        "b",
        "woody",
        100
      ],
      [
        "rosemary oil",
        10,
        "t",
        "green",
        100
      ],
      [
        "alpha-terpinyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "muguet nitrile",
        5,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        191,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-019",
    "te": "Accord N° 208699 Citrus floral green (Firmenich)",
    "tr": "Аккорд №208699 · цитрусовый цветочный зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.20% · This accord can be used as a base to give dry freshness to many perfumes from fougere to feminine florals..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208699 · цитрусовый цветочный зелёный (Firmenich)». Ключевые материалы структуры: PETITGRAIN SYNTH, MAYOL® (Firmenich), ALDEHYDE C 10 10%, GALBANOLENE SUPER (Firmenich) 10%.",
    "pr": {
      "citrus": 50,
      "floral": 28
    },
    "it": [
      [
        "ACETALDEHYDE PHENYL ETHYL PROPYL ACETAL",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "ALDEHYDE C 10 10%",
        100,
        "t",
        "citrus",
        10
      ],
      [
        "HEDIONE® (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        20,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        200,
        "h",
        "floral",
        100
      ],
      [
        "PETITGRAIN SYNTH",
        500,
        "t",
        "citrus",
        100
      ],
      [
        "GALBANOLENE SUPER (Firmenich) 10%",
        100,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-020",
    "te": "Citrus floral perfume",
    "tr": "Цитрусовый цветочный парфюм",
    "sd": "TGSC (dm1015272) · Patent 7,585,833",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,585,833 Malodor covering perfumery.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цитрусовый цветочный парфюм». Формула из патента 7,585,833. Ключевые материалы структуры: dextro-limonene, dihydromyrcenol, benzyl acetate, phenethyl alcohol.",
    "pr": {
      "floral": 45,
      "gourmand": 4,
      "woody": 8,
      "green": 4,
      "citrus": 50,
      "musk": 5,
      "aquatic": 2
    },
    "it": [
      [
        "alpha-terpineol",
        35,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "bacdanol",
        25,
        "b",
        "woody",
        100
      ],
      [
        "benzyl acetate",
        150,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        25,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        1,
        "t",
        "green",
        100
      ],
      [
        "citronellol",
        15,
        "h",
        "floral",
        100
      ],
      [
        "fructone",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "dextro-limonene",
        220,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        4,
        "h",
        "gourmand",
        100
      ],
      [
        "galaxolide 50 IPM",
        44,
        "b",
        "musk",
        50
      ],
      [
        "gamma-undecalactone",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-decalactone",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "geranyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        45,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        20,
        "h",
        "aquatic",
        100
      ],
      [
        "iso e super",
        30,
        "b",
        "woody",
        100
      ],
      [
        "isoamyl isovalerate",
        2,
        "h",
        "floral",
        100
      ],
      [
        "manzanate",
        4,
        "h",
        "gourmand",
        100
      ],
      [
        "amyl vinyl carbinol",
        15,
        "h",
        "floral",
        100
      ],
      [
        "nopyl acetate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        12,
        "b",
        "woody",
        100
      ],
      [
        "phenethyl alcohol",
        49,
        "h",
        "floral",
        100
      ],
      [
        "rose oxide",
        5,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        5,
        "t",
        "green",
        100
      ],
      [
        "liffarome",
        10,
        "h",
        "floral",
        100
      ],
      [
        "neoproxen",
        5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-021",
    "te": "citrus floral type",
    "tr": "Цитрусовый цветочный (тип)",
    "sd": "TGSC (dm1015272) · Patent 7,494,968",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,494,968 on-cyclic hindered ketones as perfuming ingredient.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цитрусовый цветочный (тип)». Формула из патента 7,494,968. Ключевые материалы структуры: dipentene, linalool, lime oil, aldehyde C-8 10%.",
    "pr": {
      "floral": 50,
      "green": 2,
      "citrus": 11,
      "gourmand": 5
    },
    "it": [
      [
        "benzyl acetate",
        7.69,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        15.38,
        "t",
        "green",
        10
      ],
      [
        "acetophenone 10%",
        17.31,
        "h",
        "floral",
        10
      ],
      [
        "aldehyde C-10 10%",
        19.23,
        "t",
        "citrus",
        10
      ],
      [
        "aldehyde C-12 lauric 10%",
        11.54,
        "t",
        "citrus",
        10
      ],
      [
        "aldehyde C-8 10%",
        38.46,
        "t",
        "citrus",
        10
      ],
      [
        "aldehyde C-9 10%",
        3.85,
        "t",
        "citrus",
        10
      ],
      [
        "allyl caproate",
        7.69,
        "h",
        "gourmand",
        100
      ],
      [
        "laevo-carvone 10%",
        5.77,
        "h",
        "floral",
        10
      ],
      [
        "cis-3-hexenol 10%",
        11.54,
        "t",
        "green",
        10
      ],
      [
        "citral",
        1.92,
        "t",
        "citrus",
        100
      ],
      [
        "coranol",
        30.77,
        "h",
        "floral",
        100
      ],
      [
        "allyl cyclohexyl propionate 10%",
        1.92,
        "h",
        "gourmand",
        10
      ],
      [
        "beta-damascone 10%",
        7.69,
        "h",
        "gourmand",
        10
      ],
      [
        "gamma-decalactone 10%",
        30.77,
        "h",
        "gourmand",
        10
      ],
      [
        "dihydro-beta-ionone",
        7.69,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        3.85,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        38.46,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        9.62,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl isobutyrate",
        3.85,
        "h",
        "floral",
        100
      ],
      [
        "lime oil",
        46.15,
        "t",
        "citrus",
        100
      ],
      [
        "dipentene",
        423.08,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        153.85,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        30.77,
        "t",
        "citrus",
        100
      ],
      [
        "gamma-nonalactone",
        3.85,
        "h",
        "gourmand",
        100
      ],
      [
        "phenoxyethanol",
        21.15,
        "h",
        "floral",
        100
      ],
      [
        "buchu mercaptan 0.01%",
        15.38,
        "h",
        "gourmand",
        0.01
      ],
      [
        "terpineol",
        11.54,
        "h",
        "floral",
        100
      ],
      [
        "2,4-ivy carbaldehyde",
        9.62,
        "t",
        "citrus",
        100
      ],
      [
        "vert de fleur d'oranger 115 10%",
        3.85,
        "t",
        "citrus",
        10
      ],
      [
        "DIPG",
        5.77,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-022",
    "te": "Citrus floral with a delayed fig note",
    "tr": "Цитрусово-цветочный аромат с раскрывающейся нотой инжира",
    "sd": "TGSC (dm1015272) · Patent 7,517,840",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,517,840 Optimized perfumery for rinse-off products.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цитрусово-цветочный аромат с раскрывающейся нотой инжира». Формула из патента 7,517,840. Ключевые материалы структуры: benzyl salicylate, phenoxyethyl isobutyrate, hedione, pyroprunat.",
    "pr": {
      "citrus": 15,
      "gourmand": 1,
      "floral": 50,
      "green": 20,
      "aquatic": 2
    },
    "it": [
      [
        "orange oil terpenes",
        71.7,
        "t",
        "citrus",
        100
      ],
      [
        "lemon oil",
        57.4,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl butyrate",
        1.1,
        "h",
        "gourmand",
        100
      ],
      [
        "hexyl acetate",
        3.5,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        44.1,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        88.3,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        2,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        3,
        "t",
        "green",
        100
      ],
      [
        "citronellyl nitrile",
        6.4,
        "h",
        "floral",
        100
      ],
      [
        "phenoxyethyl isobutyrate",
        200,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        11,
        "h",
        "gourmand",
        100
      ],
      [
        "pyroprunat",
        100,
        "h",
        "floral",
        100
      ],
      [
        "delta-damascone",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "dimethyl benzyl carbinyl butyrate",
        44.1,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate",
        4.4,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        22.1,
        "h",
        "aquatic",
        100
      ],
      [
        "hedione",
        110.4,
        "h",
        "floral",
        100
      ],
      [
        "nectaryl",
        4.4,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        217.7,
        "t",
        "green",
        100
      ],
      [
        "ethyl vanillin",
        4.4,
        "b",
        "amber",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-023",
    "te": "citrus fragrance",
    "tr": "Цитрусовый аромат",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring ambroxan, bornafix, citronellyl nitrile, methyl cedryl ketone replacer.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цитрусовый аромат». Ключевые материалы структуры: dihydromyrcenol, citrus specialty, linalyl acetate, phenoxanol.",
    "pr": {
      "amber": 1,
      "floral": 33,
      "musk": 4,
      "citrus": 50,
      "woody": 2
    },
    "it": [
      [
        "ambroxan",
        10,
        "b",
        "amber",
        100
      ],
      [
        "bornafix",
        30,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl nitrile",
        10,
        "h",
        "floral",
        100
      ],
      [
        "methyl cedryl ketone replacer",
        25,
        "h",
        "floral",
        100
      ],
      [
        "celestolide",
        40,
        "b",
        "musk",
        100
      ],
      [
        "citrus specialty",
        120,
        "h",
        "floral",
        100
      ],
      [
        "cyclacet",
        30,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        400,
        "t",
        "citrus",
        100
      ],
      [
        "fleuranil",
        10,
        "h",
        "floral",
        100
      ],
      [
        "geranium oil replacer",
        5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        45,
        "t",
        "citrus",
        100
      ],
      [
        "iso e super",
        25,
        "b",
        "woody",
        100
      ],
      [
        "kharismal",
        40,
        "h",
        "floral",
        100
      ],
      [
        "koavone",
        15,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "phenoxanol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "precyclemone B",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "pseudolinalyl acetate",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "styralyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "vigoflor",
        10,
        "h",
        "floral",
        100
      ],
      [
        "zenolide",
        10,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-024",
    "te": "citrus fruity type",
    "tr": "Цитрусовый фруктовый (тип)",
    "sd": "TGSC (dm1015272) · Patent 7,494,968",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,494,968 on-cyclic hindered ketones as perfuming ingredient.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цитрусовый фруктовый (тип)». Формула из патента 7,494,968. Ключевые материалы структуры: dihydromyrcenol, benzyl acetate, alpha-hexyl cinnamaldehyde, woody acetate.",
    "pr": {
      "floral": 50,
      "green": 8,
      "gourmand": 3,
      "citrus": 39,
      "spicy": 3,
      "woody": 12,
      "musk": 6
    },
    "it": [
      [
        "benzyl acetate",
        125,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        12.5,
        "t",
        "green",
        100
      ],
      [
        "styrallyl acetate",
        17.5,
        "h",
        "gourmand",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "armoise oil",
        25,
        "t",
        "green",
        100
      ],
      [
        "methyl benzoate",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "camphor",
        20,
        "t",
        "green",
        100
      ],
      [
        "laevo-carvone",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl nitrile",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "estragol",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "eucalyptus oil",
        20,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        20,
        "h",
        "spicy",
        100
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "allyl heptanoate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "phenoxyethyl isobutyrate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        65,
        "h",
        "floral",
        100
      ],
      [
        "methyl octine carbonate 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "para-methyl anisole",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "woody acetate",
        100,
        "b",
        "woody",
        100
      ],
      [
        "romandolide",
        50,
        "b",
        "musk",
        100
      ],
      [
        "sclareolate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "terpineol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "2,4-ivy carbaldehyde",
        20,
        "t",
        "citrus",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-025",
    "te": "citrus grapefruit type (#25)",
    "tr": "Цитрусовый грейпфрут (тип) (#25)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring aldehyde C-10, aldehyde C-8, allyl caproate, ambroxan.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цитрусовый грейпфрут (тип) (#25)». Ключевые материалы структуры: orange oil c.p. valencia, DIPG, linalool, lemon oil italy.",
    "pr": {
      "citrus": 50,
      "floral": 13
    },
    "it": [
      [
        "aldehyde C-10",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-8",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "allyl caproate",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "ambroxan",
        0.3,
        "b",
        "amber",
        100
      ],
      [
        "cis-3-hexenol",
        2,
        "t",
        "green",
        100
      ],
      [
        "citral",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "floropal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "geranium oil",
        1,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "lemon oil italy",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "orange oil c.p. valencia",
        420,
        "t",
        "citrus",
        100
      ],
      [
        "spearmint oil",
        1,
        "t",
        "green",
        100
      ],
      [
        "muguet nitrile",
        5,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        377.7,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-026",
    "te": "citrus grapefruit type (#26)",
    "tr": "Цитрусовый грейпфрут (тип) (#26)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring isobornyl acetate, geranyl acetate, fenchyl alcohol, aldehyde C-10.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цитрусовый грейпфрут (тип) (#26)». Ключевые материалы структуры: geraniol, phenethylol, beta-ionone, iso e super.",
    "pr": {
      "floral": 50,
      "citrus": 5,
      "gourmand": 1,
      "green": 3,
      "spicy": 3,
      "woody": 5
    },
    "it": [
      [
        "isobornyl acetate",
        7.69,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        7.69,
        "h",
        "floral",
        100
      ],
      [
        "fenchyl alcohol",
        1.54,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-10",
        6.15,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-8",
        9.23,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-9",
        4.62,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 mna",
        3.08,
        "t",
        "citrus",
        100
      ],
      [
        "lemon oil",
        15.38,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        15.38,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl nitrile",
        30.77,
        "h",
        "floral",
        100
      ],
      [
        "citronella oil ceylon",
        4.62,
        "h",
        "floral",
        100
      ],
      [
        "damascenone",
        1.54,
        "h",
        "floral",
        100
      ],
      [
        "delphone",
        9.23,
        "h",
        "floral",
        100
      ],
      [
        "delta-damascone",
        9.23,
        "h",
        "gourmand",
        100
      ],
      [
        "doremox",
        6.15,
        "h",
        "floral",
        100
      ],
      [
        "eucalyptol",
        33.85,
        "t",
        "green",
        100
      ],
      [
        "eugenol",
        4.62,
        "h",
        "spicy",
        100
      ],
      [
        "geraniol",
        192.31,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        53.85,
        "h",
        "floral",
        100
      ],
      [
        "hivernal neo",
        4.62,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        76.92,
        "b",
        "woody",
        100
      ],
      [
        "methyl heptenone",
        4.62,
        "h",
        "floral",
        100
      ],
      [
        "oranger crystals",
        3.08,
        "t",
        "citrus",
        100
      ],
      [
        "nectaryl",
        6.15,
        "h",
        "floral",
        100
      ],
      [
        "galbascone 10%",
        6.15,
        "h",
        "floral",
        10
      ],
      [
        "para-cymene",
        6.15,
        "h",
        "floral",
        100
      ],
      [
        "phenethylol",
        184.62,
        "h",
        "floral",
        100
      ],
      [
        "clover nitrile",
        38.46,
        "h",
        "spicy",
        100
      ],
      [
        "sclareolate",
        38.46,
        "h",
        "floral",
        100
      ],
      [
        "(Z)-4-dodecenal 10%",
        6.15,
        "h",
        "floral",
        10
      ],
      [
        "orange oil",
        30.77,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-terpineol",
        46.15,
        "h",
        "floral",
        100
      ],
      [
        "terpinolene",
        15.38,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        107.69,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        7.69,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-027",
    "te": "Accord N° 207657 Citrus green (Firmenich)",
    "tr": "Аккорд №207657 · цитрусовый зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Light duty liquid: 0.20% ; Shampoo: 0.50% · This light fresh citrus accord is given a wonderful natural green and flowery character by the presence of GALBEX 183..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207657 · цитрусовый зелёный (Firmenich)». Ключевые материалы структуры: ORANGE OIL, DIMYRCETOL (IFF), CEDRENE, LINALOL.",
    "pr": {
      "citrus": 33,
      "floral": 50
    },
    "it": [
      [
        "ALDEHYDE C 9 10%",
        50,
        "t",
        "citrus",
        10
      ],
      [
        "AMBRE 150 SA (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "CEDRENE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "DIMYRCETOL (IFF)",
        200,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "ORANGE OIL",
        300,
        "t",
        "citrus",
        100
      ],
      [
        "PETITGRAIN SYNTH",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "GALBEX® 183 (Firmenich)",
        100,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-028",
    "te": "Citrus herbaceous cologne for men",
    "tr": "Цитрусово-травяной мужской одеколон",
    "sd": "TGSC (dm1015272) · Patent EP1229032",
    "fa": "green",
    "kd": "perfume",
    "df": "intermediate",
    "co": "Cologne",
    "de": "Reference formula from The Good Scents Company (dm1015272): The cologne base imparted to the latter a very nice and natural herbaceous note, reinforcing the thujonic aspect of the composition. Patent EP1229032 B1 1,3-oxathianes as perfuming and flavouring ingredients.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цитрусово-травяной мужской одеколон». Формула из патента EP1229032. Ключевые материалы структуры: iso e super, dihydromyrcenol, patchouli oil, habanolide.",
    "pr": {
      "citrus": 34,
      "floral": 31,
      "amber": 5,
      "woody": 50,
      "leathery": 3,
      "green": 2,
      "musk": 14,
      "spicy": 2
    },
    "it": [
      [
        "linalyl acetate",
        43.33,
        "t",
        "citrus",
        100
      ],
      [
        "isobornyl acetate",
        23.33,
        "h",
        "floral",
        100
      ],
      [
        "ethyl acetoacetate",
        3.33,
        "h",
        "floral",
        100
      ],
      [
        "ambrox",
        3.33,
        "b",
        "amber",
        100
      ],
      [
        "indole 10%",
        3.33,
        "h",
        "floral",
        10
      ],
      [
        "iso e super",
        200,
        "b",
        "woody",
        100
      ],
      [
        "isobutyl quinoline 10%",
        23.33,
        "b",
        "leathery",
        10
      ],
      [
        "spearmint oil",
        6.67,
        "t",
        "green",
        100
      ],
      [
        "wormwood oil",
        20,
        "b",
        "woody",
        100
      ],
      [
        "cashmeran",
        10,
        "b",
        "musk",
        100
      ],
      [
        "lemon oil italy",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "coranol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        33.33,
        "b",
        "amber",
        100
      ],
      [
        "dihydromyrcenol",
        180,
        "t",
        "citrus",
        100
      ],
      [
        "eugenol",
        13.33,
        "h",
        "spicy",
        100
      ],
      [
        "habanolide",
        86.67,
        "b",
        "musk",
        100
      ],
      [
        "hedione HC",
        66.67,
        "h",
        "floral",
        100
      ],
      [
        "veramoss 10%",
        16.67,
        "b",
        "woody",
        10
      ],
      [
        "patchouli oil",
        116.67,
        "b",
        "woody",
        100
      ],
      [
        "pimento leaf oil",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "pine needle oil dwarf",
        13.33,
        "h",
        "floral",
        100
      ],
      [
        "rosemary oil",
        10,
        "t",
        "green",
        100
      ],
      [
        "aldehyde C-14 10%",
        6.67,
        "t",
        "citrus",
        10
      ],
      [
        "vert de lilas",
        6.67,
        "h",
        "floral",
        100
      ],
      [
        "ylang ylang oil",
        6.67,
        "h",
        "floral",
        100
      ],
      [
        "zestover 10%",
        36.67,
        "h",
        "floral",
        10
      ],
      [
        "2-ethyl-4,4-dimethyl-1,3-oxathiane",
        3.33,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-029",
    "te": "Accord N° 207870 Citrus herbal (Firmenich)",
    "tr": "Аккорд №207870 · цитрусовый травянистый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Detergent powder: 0.15% ; Heavy duty liquid: 0.30% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.30% · The addition of VERT DE CITRON BASE 66265 gives a lovely freshness that combines the citrus herbal note to give a verbena effect..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207870 · цитрусовый травянистый (Firmenich)». Ключевые материалы структуры: BENZYL SALICYLATE, HEXYLCINNAMIC ALDEHYDE, TRICYCLODECENYL ACETATE, CITRONELLOL.",
    "pr": {
      "green": 13,
      "floral": 50,
      "musk": 7,
      "citrus": 13
    },
    "it": [
      [
        "BENZYL SALICYLATE",
        160,
        "t",
        "green",
        100
      ],
      [
        "CITRONELLOL",
        110,
        "h",
        "floral",
        100
      ],
      [
        "FLOROL® (Firmenich)",
        55,
        "h",
        "floral",
        100
      ],
      [
        "GERANYL NITRILE (links to potential substitute)",
        55,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        85,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        110,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        160,
        "t",
        "citrus",
        100
      ],
      [
        "PHENYLHEXANOL (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "TRICYCLODECENYL ACETATE",
        160,
        "h",
        "floral",
        100
      ],
      [
        "VELOUTONE (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "VERT DE CITRON BASE 66265 (Firmenich)",
        55,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-030",
    "te": "Accord N° 208206 Citrus woody (Firmenich)",
    "tr": "Аккорд №208206 · цитрусовый древесный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Soap: 0.50% · To this masculine citrus woody fragrance, the addition of 4% TEAK 109955 enhances the woody note, as well on top note as on body note. It gives overall an increased impact and radiance to the fragrance..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208206 · цитрусовый древесный (Firmenich)». Ключевые материалы структуры: VERTOFIX® COEUR (IFF), DIHYDROMYRCENOL, LEMON OIL, BERGAMOTE SYNTH.",
    "pr": {
      "citrus": 50,
      "floral": 30,
      "amber": 5,
      "gourmand": 2,
      "musk": 12,
      "woody": 35
    },
    "it": [
      [
        "ALDEHYDE MANDARINE 10% CITR (Firmenich) 10%",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "AMBRINOL (Firmenich) 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "BERGAMOTE SYNTH",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "CETALOX® (Firmenich)",
        10,
        "b",
        "amber",
        100
      ],
      [
        "COUMARIN",
        20,
        "b",
        "amber",
        100
      ],
      [
        "DAMASCONE ALPHA 10%",
        15,
        "h",
        "gourmand",
        10
      ],
      [
        "DIHYDROESTRAGOLE",
        5,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        140,
        "t",
        "citrus",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "GERANIUM SYNTH",
        25,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        90,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        90,
        "h",
        "floral",
        100
      ],
      [
        "LEMON OIL",
        125,
        "t",
        "citrus",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "POLYSANTOL® (Firmenich)",
        10,
        "b",
        "woody",
        100
      ],
      [
        "VANILLIN",
        5,
        "b",
        "amber",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        250,
        "b",
        "woody",
        100
      ],
      [
        "TEAK",
        40,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-031",
    "te": "Cologne composition",
    "tr": "Одеколон композиция",
    "sd": "TGSC (dm1015272) · Patent 4,570,648",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "Cologne",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,570,648 Flavorants containing esters of 2,3,6,6-tetramethylcyclohexenyl carboxylic acids.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Одеколон композиция». Формула из патента 4,570,648. Ключевые материалы структуры: bergamot oil bergaptene reduced, methyl dihydrojasmonate, alpha-hexyl cinnamaldehyde, lemon oil italy.",
    "pr": {
      "floral": 19,
      "amber": 1,
      "citrus": 50,
      "green": 3,
      "spicy": 3
    },
    "it": [
      [
        "indole 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "coumarin",
        10,
        "b",
        "amber",
        100
      ],
      [
        "ylang ylang oil",
        20,
        "h",
        "floral",
        100
      ],
      [
        "neroli oil",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "lavandin oil",
        40,
        "t",
        "green",
        100
      ],
      [
        "benzyl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        40,
        "h",
        "spicy",
        100
      ],
      [
        "citral",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "lemon oil italy",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        360,
        "t",
        "citrus",
        100
      ],
      [
        "givescone",
        80,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-032",
    "te": "Accord Number 1332 – Natural Currant (IFF)",
    "tr": "Аккорд №1332 · Натуральная смородина (IFF)",
    "sd": "TGSC (dm1015272) · IFF",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring POMELENE 1%, ETHYL LINALOOL, HEXENYL SALICYLATE CIS 3- (IFF), VERDURAL EXTRA (IFF).",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №1332 · Натуральная смородина (IFF)». Ключевые материалы структуры: DIPG, METHYL DH JASMONATE, GALAXOLIDE® 50% (IFF), LILIAL (Givaudan).",
    "pr": {
      "floral": 50,
      "green": 5,
      "aquatic": 5,
      "citrus": 2,
      "musk": 17
    },
    "it": [
      [
        "POMELENE 1%",
        5.02,
        "h",
        "floral",
        1
      ],
      [
        "ETHYL LINALOOL",
        30.12,
        "h",
        "floral",
        100
      ],
      [
        "HEXENYL SALICYLATE CIS 3- (IFF)",
        45.18,
        "t",
        "green",
        100
      ],
      [
        "VERDURAL EXTRA (IFF)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLOL 950 (IFF)",
        10.04,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLYL ACETATE (IFF)",
        5.02,
        "h",
        "floral",
        100
      ],
      [
        "CYCLAMAL (IFF)",
        5.02,
        "h",
        "floral",
        100
      ],
      [
        "CYCLEMAX (IFF)",
        20.08,
        "h",
        "floral",
        100
      ],
      [
        "FLOROSA (Givaudan)",
        24.1,
        "h",
        "floral",
        100
      ],
      [
        "HELIONAL™ (IFF)",
        45.18,
        "h",
        "aquatic",
        100
      ],
      [
        "HYDROXYCITRONELLAL",
        20.08,
        "t",
        "citrus",
        100
      ],
      [
        "LILIAL (Givaudan)",
        70.28,
        "h",
        "floral",
        100
      ],
      [
        "LYRAL® (IFF)",
        50.2,
        "h",
        "floral",
        100
      ],
      [
        "METHYL DH JASMONATE",
        200.8,
        "h",
        "floral",
        100
      ],
      [
        "PETITGRAIN BIGARADE OIL TUNISIA (IFF)",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "PHENOXANOL® (IFF)",
        3.01,
        "h",
        "floral",
        100
      ],
      [
        "PHENYL ETHYL ALCOHOL (IFF)",
        16.06,
        "h",
        "floral",
        100
      ],
      [
        "ROSE ABS DAMASCENA PURE (IFF) 10%",
        1,
        "h",
        "floral",
        10
      ],
      [
        "STYRALYL ACETATE",
        1,
        "h",
        "floral",
        100
      ],
      [
        "CASSIFFIX® (IFF)",
        50.2,
        "h",
        "floral",
        100
      ],
      [
        "DELTA DAMASCONE",
        2.01,
        "h",
        "gourmand",
        100
      ],
      [
        "DIMETHYL BENZYL CARBINYL ACETATE",
        1,
        "h",
        "floral",
        100
      ],
      [
        "FLORALOZONE (IFF)",
        1,
        "h",
        "aquatic",
        100
      ],
      [
        "PHENYL ETHYL ACETATE",
        2.01,
        "h",
        "floral",
        100
      ],
      [
        "AMBRETTOLIDE (IFF)",
        15.06,
        "b",
        "musk",
        100
      ],
      [
        "ETHYLENE BRASSYLATE (IFF)",
        50.2,
        "b",
        "musk",
        100
      ],
      [
        "GALAXOLIDE® 50% (IFF)",
        100.4,
        "b",
        "musk",
        50
      ],
      [
        "AMBROXAN",
        1,
        "b",
        "amber",
        100
      ],
      [
        "METHYL IONONE GAMMA COEUR (IFF)",
        2.01,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        220.88,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-033",
    "te": "Declaration Accord",
    "tr": "Аккорд в стиле Déclaration",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "woody",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд в стиле Déclaration». Ключевые материалы структуры: iso e super, hedione, cedarwood oil virginia, DIPG.",
    "pr": {
      "green": 1,
      "citrus": 13,
      "floral": 27,
      "spicy": 4,
      "woody": 50,
      "amber": 1
    },
    "it": [
      [
        "armoise oil 10%",
        3,
        "t",
        "green",
        10
      ],
      [
        "bergamot oil bergaptene reduced",
        35,
        "t",
        "citrus",
        100
      ],
      [
        "BHT",
        2,
        "h",
        "floral",
        100
      ],
      [
        "birch tar oil 1%",
        3,
        "b",
        "leathery",
        1
      ],
      [
        "black pepper oil",
        1,
        "h",
        "spicy",
        100
      ],
      [
        "cardamom seed oil",
        13,
        "h",
        "spicy",
        100
      ],
      [
        "cedarwood oil virginia",
        105,
        "b",
        "woody",
        100
      ],
      [
        "cetalox 10%",
        5,
        "b",
        "amber",
        10
      ],
      [
        "cetone V",
        3,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        16,
        "h",
        "floral",
        100
      ],
      [
        "coriander seed oil",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "coumarin",
        1,
        "b",
        "amber",
        100
      ],
      [
        "ethyl anthranilate 10%",
        2.5,
        "h",
        "floral",
        10
      ],
      [
        "cumin seed oil 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "DIPG",
        86,
        "b",
        "aquatic",
        0
      ],
      [
        "ethyl linalool",
        38,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "hedione",
        145,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        16,
        "t",
        "citrus",
        100
      ],
      [
        "indole 1%",
        2,
        "h",
        "floral",
        1
      ],
      [
        "beta-ionone",
        30,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        360,
        "b",
        "woody",
        100
      ],
      [
        "juniper berry oil",
        0.5,
        "h",
        "gourmand",
        100
      ],
      [
        "linalyl acetate",
        29,
        "t",
        "citrus",
        100
      ],
      [
        "mandarin oil italy",
        7,
        "t",
        "citrus",
        100
      ],
      [
        "oakmoss absolute 50%",
        6,
        "b",
        "woody",
        50
      ],
      [
        "muscone",
        1,
        "b",
        "musk",
        100
      ],
      [
        "nutmeg oil",
        7,
        "h",
        "spicy",
        100
      ],
      [
        "orange oil",
        8,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        9,
        "h",
        "floral",
        100
      ],
      [
        "vetiver oil haiti",
        6,
        "b",
        "woody",
        100
      ],
      [
        "cardamom aldehyde 1%",
        30,
        "t",
        "citrus",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-034",
    "te": "Deodorant fragrance",
    "tr": "Дезодорант аромат",
    "sd": "TGSC (dm1015272) · Patent 6,441,052",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,441,052 Cyclopentylalkyl-nitriles.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Дезодорант аромат». Формула из патента 6,441,052. Ключевые материалы структуры: hydro rose C (rose oil reconstitution), DIPG, iso e super, bergamot base.",
    "pr": {
      "floral": 50,
      "citrus": 8,
      "green": 3,
      "woody": 11,
      "gourmand": 2,
      "spicy": 1
    },
    "it": [
      [
        "5-cyclopentylhexanal 10%",
        30,
        "h",
        "floral",
        10
      ],
      [
        "bergamot base",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "cedryl acetate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "cepionate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "cyclohexyl salicylate",
        12,
        "t",
        "green",
        100
      ],
      [
        "DIPG",
        113,
        "b",
        "aquatic",
        0
      ],
      [
        "dynascone 10",
        15,
        "h",
        "floral",
        100
      ],
      [
        "elemi oil",
        5,
        "h",
        "floral",
        100
      ],
      [
        "fixambrene",
        5,
        "h",
        "floral",
        100
      ],
      [
        "folrosia",
        6,
        "h",
        "floral",
        100
      ],
      [
        "hydro rose C (rose oil reconstitution)",
        300,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        85,
        "b",
        "woody",
        100
      ],
      [
        "juniper berry oil",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "kephalis",
        30,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil italy",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "mate absolute 10%",
        35,
        "h",
        "floral",
        10
      ],
      [
        "metambrate",
        45,
        "h",
        "floral",
        100
      ],
      [
        "methyl pamplemousse",
        8,
        "h",
        "floral",
        100
      ],
      [
        "nutmeg oil",
        8,
        "h",
        "spicy",
        100
      ],
      [
        "okoumal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        8,
        "b",
        "woody",
        100
      ],
      [
        "sandalore",
        35,
        "b",
        "woody",
        100
      ],
      [
        "spearmint oil 10%",
        20,
        "t",
        "green",
        10
      ],
      [
        "thibetolide",
        30,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-035",
    "te": "Detergent fragrance",
    "tr": "Моющее средство аромат",
    "sd": "TGSC (dm1015272) · Patent 5,990,076",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,990,076 Benzodioxepinone and its use in perfumery.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Моющее средство аромат». Формула из патента 5,990,076. Ключевые материалы структуры: alpha-hexyl cinnamaldehyde, lorysia, habanolide, linalool.",
    "pr": {
      "citrus": 20,
      "amber": 2,
      "green": 2,
      "floral": 50,
      "musk": 8,
      "woody": 17,
      "gourmand": 2
    },
    "it": [
      [
        "alpha-hexyl cinnamaldehyde",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "cetalox",
        15,
        "b",
        "amber",
        100
      ],
      [
        "cis-3-hexenol 10%",
        20,
        "t",
        "green",
        10
      ],
      [
        "citronellyl nitrile",
        5,
        "h",
        "floral",
        100
      ],
      [
        "habanolide",
        80,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        70,
        "h",
        "floral",
        100
      ],
      [
        "indole10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "iralia total",
        70,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        70,
        "b",
        "woody",
        100
      ],
      [
        "linalool",
        80,
        "h",
        "floral",
        100
      ],
      [
        "lorysia",
        120,
        "h",
        "floral",
        100
      ],
      [
        "manzanate10%",
        20,
        "h",
        "gourmand",
        10
      ],
      [
        "mayol",
        60,
        "h",
        "floral",
        100
      ],
      [
        "timber propanol 10%",
        20,
        "b",
        "woody",
        10
      ],
      [
        "rose absolute pentanol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "polysantol",
        15,
        "b",
        "woody",
        100
      ],
      [
        "vertofix",
        60,
        "b",
        "woody",
        100
      ],
      [
        "DIPG",
        10,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-036",
    "te": "dish wash detergent type",
    "tr": "Отдушка для средства для мытья посуды",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring isobornyl acetate, phenethyl acetate, styrallyl acetate, aldehyde C-10.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Отдушка для средства для мытья посуды». Ключевые материалы структуры: dextro-limonene, verdox, isobornyl acetate, linalool.",
    "pr": {
      "floral": 50,
      "gourmand": 17,
      "citrus": 45,
      "spicy": 2,
      "green": 8,
      "musk": 6
    },
    "it": [
      [
        "isobornyl acetate",
        75,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "aldehyde C-10",
        12.5,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-8",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "(E)-anethol",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "manzanate",
        12.5,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl butyrate",
        2.5,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl caproate",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "lemon oil",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "citronellyl nitrile",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "verdyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "eucalyptus oil",
        40,
        "h",
        "floral",
        100
      ],
      [
        "galbanum oil 10%",
        10,
        "t",
        "green",
        10
      ],
      [
        "geraniol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "habanolide",
        50,
        "b",
        "musk",
        100
      ],
      [
        "hivernal neo",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "ocimene",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "isoeugenol",
        2.5,
        "h",
        "spicy",
        100
      ],
      [
        "lime oil",
        45,
        "t",
        "citrus",
        100
      ],
      [
        "dextro-limonene",
        175,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        65,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl anthranilate",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        25,
        "h",
        "floral",
        100
      ],
      [
        "phenethylol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "alpha-pinene",
        25,
        "h",
        "floral",
        100
      ],
      [
        "rose oil replacer",
        15,
        "h",
        "floral",
        100
      ],
      [
        "amyl salicylate",
        45,
        "t",
        "green",
        100
      ],
      [
        "sclareolate",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "terpineol",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "thymol 10%",
        5,
        "h",
        "spicy",
        10
      ],
      [
        "verdox",
        100,
        "h",
        "gourmand",
        100
      ],
      [
        "triplal",
        5,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-037",
    "te": "eau de cologne for men (#37)",
    "tr": "Мужской одеколон (#37)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "Cologne",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring styrallyl acetate, alpha-hexyl cinnamaldehyde, bergamot oil, calone 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужской одеколон (#37)». Ключевые материалы структуры: ocean propanal, hedione, romandolide, hedione HC.",
    "pr": {
      "gourmand": 1,
      "citrus": 7,
      "aquatic": 1,
      "green": 8,
      "spicy": 1,
      "floral": 50,
      "woody": 4,
      "amber": 1,
      "musk": 12
    },
    "it": [
      [
        "styrallyl acetate",
        2.27,
        "h",
        "gourmand",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        15.91,
        "t",
        "citrus",
        100
      ],
      [
        "bergamot oil",
        68.18,
        "t",
        "citrus",
        100
      ],
      [
        "calone 10%",
        2.27,
        "h",
        "aquatic",
        10
      ],
      [
        "cis-3-hexenol 10%",
        11.36,
        "t",
        "green",
        10
      ],
      [
        "coriander seed oil",
        11.36,
        "h",
        "spicy",
        100
      ],
      [
        "dimethyl benzyl carbinyl butyrate",
        2.27,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        181.82,
        "h",
        "floral",
        100
      ],
      [
        "hedione HC",
        113.64,
        "h",
        "floral",
        100
      ],
      [
        "ocean propanal",
        204.55,
        "h",
        "floral",
        100
      ],
      [
        "isobutyl quinoline 10%",
        2.27,
        "b",
        "leathery",
        10
      ],
      [
        "isojasmone 10%",
        9.09,
        "h",
        "floral",
        10
      ],
      [
        "jasmal",
        68.18,
        "h",
        "floral",
        100
      ],
      [
        "melonal 10%",
        4.55,
        "h",
        "aquatic",
        10
      ],
      [
        "(Z)-6-nonen-1-ol 10%",
        4.55,
        "h",
        "floral",
        10
      ],
      [
        "timber propanol",
        4.55,
        "b",
        "woody",
        100
      ],
      [
        "olibanum oil",
        6.82,
        "b",
        "amber",
        100
      ],
      [
        "patchouli oil",
        1.14,
        "b",
        "woody",
        100
      ],
      [
        "romandolide",
        140.91,
        "b",
        "musk",
        100
      ],
      [
        "rose oil bulgaria",
        4.55,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        70.45,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        9.09,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl tiglate",
        3.41,
        "t",
        "green",
        100
      ],
      [
        "gamma-undecalactone 10%",
        11.36,
        "h",
        "gourmand",
        10
      ],
      [
        "vetiver oil bourbon",
        45.45,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-038",
    "te": "eau de cologne for men (#38)",
    "tr": "Мужской одеколон (#38)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "Cologne",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring styrallyl acetate, alpha-hexyl cinnamaldehyde, bergamot oil, calone 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужской одеколон (#38)». Ключевые материалы структуры: ocean propanal, hedione, romandolide, hedione HC.",
    "pr": {
      "gourmand": 1,
      "citrus": 7,
      "aquatic": 1,
      "green": 8,
      "spicy": 1,
      "floral": 50,
      "woody": 4,
      "amber": 1,
      "musk": 12
    },
    "it": [
      [
        "styrallyl acetate",
        2.27,
        "h",
        "gourmand",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        15.91,
        "t",
        "citrus",
        100
      ],
      [
        "bergamot oil",
        68.18,
        "t",
        "citrus",
        100
      ],
      [
        "calone 10%",
        2.27,
        "h",
        "aquatic",
        10
      ],
      [
        "cis-3-hexenol 10%",
        11.36,
        "t",
        "green",
        10
      ],
      [
        "coriander seed oil",
        11.36,
        "h",
        "spicy",
        100
      ],
      [
        "dimethyl benzyl carbinyl butyrate",
        2.27,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        181.82,
        "h",
        "floral",
        100
      ],
      [
        "hedione HC",
        113.64,
        "h",
        "floral",
        100
      ],
      [
        "ocean propanal",
        204.55,
        "h",
        "floral",
        100
      ],
      [
        "isobutyl quinoline 10%",
        2.27,
        "b",
        "leathery",
        10
      ],
      [
        "isojasmone 10%",
        9.09,
        "h",
        "floral",
        10
      ],
      [
        "jasmal",
        68.18,
        "h",
        "floral",
        100
      ],
      [
        "melonal 10%",
        4.55,
        "h",
        "aquatic",
        10
      ],
      [
        "(Z)-6-nonen-1-ol 10%",
        4.55,
        "h",
        "floral",
        10
      ],
      [
        "timber propanol",
        4.55,
        "b",
        "woody",
        100
      ],
      [
        "olibanum oil",
        6.82,
        "b",
        "amber",
        100
      ],
      [
        "patchouli oil",
        1.14,
        "b",
        "woody",
        100
      ],
      [
        "romandolide",
        140.91,
        "b",
        "musk",
        100
      ],
      [
        "rose oil bulgaria",
        4.55,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        70.45,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        9.09,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl tiglate",
        3.41,
        "t",
        "green",
        100
      ],
      [
        "gamma-undecalactone 10%",
        11.36,
        "h",
        "gourmand",
        10
      ],
      [
        "vetiver oil bourbon",
        45.45,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-039",
    "te": "Eau de cologne for men (Firmenich)",
    "tr": "Мужской одеколон (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "Cologne",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution · The addition of Sclareolate® imparted to the original cologne a fruity freshness which married very well with the lavandin and which was very different from the note provided by the use of ethyl 2-actoxyoypropanoate, which imparts a green-herbaceous connotation..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужской одеколон (Firmenich)». Ключевые материалы структуры: Sclareolate® (Firmenich), Cedroxyde® (Firmenich), Iso E Super® (IFF), Romandolide® (Firmenich).",
    "pr": {
      "citrus": 5,
      "gourmand": 2,
      "floral": 50,
      "musk": 16,
      "woody": 16,
      "green": 7
    },
    "it": [
      [
        "Aldehyde MNA 10% DIPG",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "Allyl amyl glycolate",
        15,
        "h",
        "gourmand",
        100
      ],
      [
        "Cedroxyde® (Firmenich)",
        120,
        "h",
        "floral",
        100
      ],
      [
        "Coumarine",
        5,
        "b",
        "amber",
        100
      ],
      [
        "Damascone Alpha",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "Dihydroestragole",
        3,
        "h",
        "floral",
        100
      ],
      [
        "7-Methyl-2H,4H-1,5-benzodioxepin-3-one 10% DIPG",
        25,
        "h",
        "floral",
        10
      ],
      [
        "Galbex® (Firmenich)",
        45,
        "h",
        "floral",
        100
      ],
      [
        "Geranium essential oil",
        20,
        "h",
        "floral",
        100
      ],
      [
        "Habanolide® (Firmenich)",
        60,
        "b",
        "musk",
        100
      ],
      [
        "Hedione® HC (Firmenich)",
        80,
        "h",
        "floral",
        100
      ],
      [
        "Heliopropanal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "Iso E Super® (IFF)",
        120,
        "b",
        "woody",
        100
      ],
      [
        "Lavandin",
        50,
        "t",
        "green",
        100
      ],
      [
        "Lyral® (IFF)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "Mousse cristal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "Muscenone® Delta (Firmenich)",
        10,
        "b",
        "musk",
        100
      ],
      [
        "Nirvanol® (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "Trans-1-(2,2,6-trimethyl-1-cyclohexyl)-3-hexanol",
        5,
        "h",
        "floral",
        100
      ],
      [
        "1-Methyl-4-(4-methyl-3-pentenyl)-3-cyclohexene-1-carbaldehyde",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "Romandolide® (Firmenich)",
        100,
        "b",
        "musk",
        100
      ],
      [
        "Amyl salicylate",
        20,
        "t",
        "green",
        100
      ],
      [
        "Vertofix® Coeur (IFF)",
        50,
        "b",
        "woody",
        100
      ],
      [
        "2,4-dimethyl-3-cyclohexene-1-carbaldehyde 10% DIPG",
        20,
        "t",
        "citrus",
        10
      ],
      [
        "Sclareolate® (Firmenich)",
        140,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-040",
    "te": "Eau de cologne perfumery base",
    "tr": "Парфюмерная база одеколона",
    "sd": "TGSC (dm1015272) · Patent 4,567,291",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "Cologne",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,567,291 2-Methyl-2-buten-1-yl tiglate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Парфюмерная база одеколона». Формула из патента 4,567,291. Ключевые материалы структуры: bergamot oil bergaptene reduced, lemon oil, alpha-hexyl cinnamaldehyde, methyl dihydrojasmonate.",
    "pr": {
      "citrus": 50,
      "floral": 16,
      "green": 4,
      "spicy": 3,
      "woody": 3
    },
    "it": [
      [
        "bergamot oil bergaptene reduced",
        404,
        "t",
        "citrus",
        100
      ],
      [
        "lemon oil",
        120,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        60,
        "h",
        "floral",
        100
      ],
      [
        "basil oil",
        50,
        "t",
        "green",
        100
      ],
      [
        "rhodinol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        40,
        "h",
        "spicy",
        100
      ],
      [
        "neroli oil",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "patchouli oil",
        20,
        "b",
        "woody",
        100
      ],
      [
        "treemoss absolute 50%",
        20,
        "h",
        "floral",
        50
      ],
      [
        "vetiveryl acetate",
        20,
        "b",
        "woody",
        100
      ],
      [
        "ylang ylang oil",
        20,
        "h",
        "floral",
        100
      ],
      [
        "tiglyl tiglate",
        6,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-041",
    "te": "eau de toilette for man type",
    "tr": "Мужская туалетная вода (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDT",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring hexyl acetate, citronellyl acetate, geranyl acetate, aldehyde C-10 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужская туалетная вода (тип)». Ключевые материалы структуры: iso e super, dihydromyrcenol, bergamot oil, linalool.",
    "pr": {
      "floral": 43,
      "citrus": 50,
      "gourmand": 5,
      "aquatic": 2,
      "musk": 16,
      "amber": 3,
      "woody": 46,
      "green": 11
    },
    "it": [
      [
        "hexyl acetate",
        3.03,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate",
        3.03,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        6.06,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-10 10%",
        6.06,
        "t",
        "citrus",
        10
      ],
      [
        "manzanate 10%",
        6.06,
        "h",
        "gourmand",
        10
      ],
      [
        "gamma-undecalactone 10%",
        6.06,
        "h",
        "gourmand",
        10
      ],
      [
        "bergamot oil",
        60.61,
        "t",
        "citrus",
        100
      ],
      [
        "boisambrene forte",
        4.55,
        "h",
        "floral",
        100
      ],
      [
        "calone 10%",
        9.09,
        "h",
        "aquatic",
        10
      ],
      [
        "cashmeran",
        3.03,
        "b",
        "musk",
        100
      ],
      [
        "cedroxyde",
        12.12,
        "h",
        "floral",
        100
      ],
      [
        "coranol",
        30.3,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl butyrate",
        3.03,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        7.58,
        "b",
        "amber",
        100
      ],
      [
        "alpha-damascone 10%",
        12.12,
        "h",
        "gourmand",
        10
      ],
      [
        "dihydromyrcenol",
        172.73,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl maltol",
        3.03,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl vanillin",
        3.03,
        "b",
        "amber",
        100
      ],
      [
        "exaltolide",
        15.15,
        "b",
        "musk",
        100
      ],
      [
        "floralozone",
        3.03,
        "h",
        "aquatic",
        100
      ],
      [
        "canthoxal",
        7.58,
        "h",
        "floral",
        100
      ],
      [
        "guaiacwood oil",
        3.03,
        "b",
        "woody",
        100
      ],
      [
        "geraniol",
        6.06,
        "h",
        "floral",
        100
      ],
      [
        "habanolide",
        15.15,
        "b",
        "musk",
        100
      ],
      [
        "hivernal neo",
        30.3,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        242.42,
        "b",
        "woody",
        100
      ],
      [
        "cis-3-hexenyl isobutyrate",
        1.52,
        "t",
        "green",
        100
      ],
      [
        "lavender oil",
        36.36,
        "t",
        "green",
        100
      ],
      [
        "linalool",
        60.61,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        12.12,
        "t",
        "citrus",
        100
      ],
      [
        "muscenone delta",
        12.12,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        30.3,
        "h",
        "floral",
        100
      ],
      [
        "santol pentenol",
        3.03,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        15.15,
        "b",
        "woody",
        100
      ],
      [
        "orange oil",
        30.3,
        "t",
        "citrus",
        100
      ],
      [
        "romandolide",
        45.45,
        "b",
        "musk",
        100
      ],
      [
        "amyl salicylate",
        15.15,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        3.03,
        "t",
        "green",
        100
      ],
      [
        "sandela",
        9.09,
        "h",
        "floral",
        100
      ],
      [
        "sclareolate",
        18.18,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        9.09,
        "h",
        "floral",
        100
      ],
      [
        "trimofix O",
        3.03,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        1.52,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        6.06,
        "b",
        "amber",
        100
      ],
      [
        "green acetate",
        6.06,
        "t",
        "green",
        100
      ],
      [
        "violettyne MIP 10%",
        3.03,
        "h",
        "floral",
        10
      ],
      [
        "triplal",
        1.52,
        "t",
        "green",
        100
      ],
      [
        "DIPG",
        3.03,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-042",
    "te": "eau de toilette for men type",
    "tr": "Мужская туалетная вода (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDT",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring dimethyl benzyl carbinyl acetate, cinnamyl acetate, geranyl acetate, cinnamic alcohol.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужская туалетная вода (тип)». Ключевые материалы структуры: siam benzoin resinoid 50%, clove bud oil, cedarwood oil virginia, benzyl benzoate.",
    "pr": {
      "floral": 50,
      "spicy": 31,
      "amber": 36,
      "woody": 15,
      "green": 9,
      "citrus": 1
    },
    "it": [
      [
        "dimethyl benzyl carbinyl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "cinnamyl acetate",
        1.25,
        "h",
        "spicy",
        100
      ],
      [
        "geranyl acetate",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "cinnamic alcohol",
        37.5,
        "h",
        "spicy",
        100
      ],
      [
        "3-phenyl propyl alcohol",
        37.5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ambrinol 10%",
        18.75,
        "h",
        "floral",
        10
      ],
      [
        "siam benzoin resinoid 50%",
        175,
        "b",
        "amber",
        50
      ],
      [
        "benzyl benzoate",
        75,
        "h",
        "floral",
        100
      ],
      [
        "methyl benzoate 10%",
        3.75,
        "h",
        "floral",
        10
      ],
      [
        "cinnamon bark oil",
        7.5,
        "h",
        "spicy",
        100
      ],
      [
        "cardamom seed oil",
        32.5,
        "h",
        "spicy",
        100
      ],
      [
        "cedarwood oil virginia",
        81.25,
        "b",
        "woody",
        100
      ],
      [
        "cetalox 10%",
        7.5,
        "b",
        "amber",
        10
      ],
      [
        "cis-3-hexenol 10%",
        2.5,
        "t",
        "green",
        10
      ],
      [
        "cistus twig/leaf absolute 10%",
        37.5,
        "b",
        "amber",
        10
      ],
      [
        "citronellol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "copaiba balsam oil",
        15,
        "b",
        "amber",
        100
      ],
      [
        "coumarin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "cuminaldehyde 10%",
        7.5,
        "t",
        "citrus",
        10
      ],
      [
        "cypress oil",
        17.5,
        "b",
        "woody",
        100
      ],
      [
        "fennel seed oil sweet 10%",
        5,
        "h",
        "spicy",
        10
      ],
      [
        "guaiacwood oil",
        5,
        "b",
        "woody",
        100
      ],
      [
        "geraniol",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "clove bud oil",
        110,
        "h",
        "spicy",
        100
      ],
      [
        "hedione",
        25,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        10,
        "b",
        "amber",
        100
      ],
      [
        "hivernal neo",
        5,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        2.5,
        "h",
        "floral",
        10
      ],
      [
        "beta-ionone 10%",
        6.25,
        "h",
        "floral",
        10
      ],
      [
        "lavender oil",
        62.5,
        "t",
        "green",
        100
      ],
      [
        "methyl ionone gamma supreme",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "nutmeg oil",
        25,
        "h",
        "spicy",
        100
      ],
      [
        "patchouli oil",
        2.5,
        "b",
        "woody",
        100
      ],
      [
        "phenethylol",
        45,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl phenyl acetate",
        13.75,
        "h",
        "floral",
        100
      ],
      [
        "ethyl phenyl acetate 10%",
        2.5,
        "h",
        "floral",
        10
      ],
      [
        "rose oil bulgaria",
        5,
        "h",
        "floral",
        100
      ],
      [
        "rose acetate",
        18.75,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        1.25,
        "b",
        "amber",
        100
      ],
      [
        "firsantol",
        50,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-043",
    "te": "Eau de Toilette for Women",
    "tr": "Женская туалетная вода",
    "sd": "TGSC (dm1015272) · Patent 5,332,725",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDT",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,332,725 Odorants.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Женская туалетная вода». Формула из патента 5,332,725. Ключевые материалы структуры: 6-(1-ethoxy-vinyl)-1,1,2,4,4,7-hexamethyl-tetralin, alpha-hexyl cinnamaldehyde, phenethyl alcohol, hydroxycitronellal.",
    "pr": {
      "floral": 50,
      "citrus": 32,
      "woody": 5,
      "spicy": 1,
      "green": 6
    },
    "it": [
      [
        "6-(1-ethoxy-vinyl)-1,1,2,4,4,7-hexamethyl-tetralin",
        150,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        80,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        120,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        140,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-11 undecylic 1%",
        2,
        "t",
        "citrus",
        1
      ],
      [
        "phenyl acetaldehyde",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "bergamot essence",
        70,
        "t",
        "citrus",
        100
      ],
      [
        "cedarwood oil virginia",
        50,
        "b",
        "woody",
        100
      ],
      [
        "evernyl",
        3,
        "b",
        "woody",
        100
      ],
      [
        "geraniol",
        60,
        "h",
        "floral",
        100
      ],
      [
        "clove bud oil",
        8,
        "h",
        "spicy",
        100
      ],
      [
        "hedione",
        80,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "hydroxycitronellal",
        110,
        "t",
        "citrus",
        100
      ],
      [
        "isoraldeine 95",
        30,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl salicylate",
        50,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        10,
        "t",
        "green",
        100
      ],
      [
        "tropional",
        15,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-044",
    "te": "Fabric conditioner LR1007 /2 (Givaudan)",
    "tr": "Кондиционер для белья LR1007 /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: For fabric Softener at 1%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Кондиционер для белья LR1007 /2 (Givaudan)». Ключевые материалы структуры: DIPROPYLENE GLYCOL, HEXYL CINNAMIC ALDEHYDE, NECTARYL (Givaudan), HEDIONE (Firmenich).",
    "pr": {
      "floral": 50,
      "woody": 3,
      "citrus": 11,
      "gourmand": 4,
      "spicy": 1,
      "musk": 4
    },
    "it": [
      [
        "ROSYRANE SUPER (Givaudan)",
        0.1,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCENONE",
        0.2,
        "h",
        "floral",
        100
      ],
      [
        "BENZOPHENONE",
        0.7,
        "h",
        "floral",
        100
      ],
      [
        "JAVANOL (Givaudan)",
        0.8,
        "b",
        "woody",
        100
      ],
      [
        "ALDEHYDE C 10 DECYLIC @10%",
        1.5,
        "t",
        "citrus",
        10
      ],
      [
        "ALLYL CAPROATE",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "FRUTONILE (Givaudan) @10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "ISOBUTAVAN (Givaudan)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "METHYL LAITONE 10%/TEC (Givaudan)",
        2,
        "h",
        "floral",
        10
      ],
      [
        "HEXENOL-3-CIS",
        3,
        "t",
        "green",
        100
      ],
      [
        "OCTALACTONE GAMMA",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "AZARBRE (Givaudan)",
        4,
        "h",
        "floral",
        100
      ],
      [
        "METHYL CINNAMATE",
        7,
        "h",
        "spicy",
        100
      ],
      [
        "HEXYL ACETATE",
        10,
        "h",
        "floral",
        100
      ],
      [
        "IONONE BETA (Givaudan)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDRO MYRCENOL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER (IFF)",
        40,
        "b",
        "woody",
        100
      ],
      [
        "DECALACTONE GAMMA",
        50,
        "h",
        "gourmand",
        100
      ],
      [
        "GALAXOLIDE (IFF)",
        60,
        "b",
        "musk",
        100
      ],
      [
        "GERANIOL INTERMEDIATE 60",
        60,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE (Firmenich)",
        70,
        "h",
        "floral",
        100
      ],
      [
        "JASMACYCLENE (Givaudan)",
        70,
        "h",
        "floral",
        100
      ],
      [
        "NECTARYL (Givaudan)",
        80,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL CINNAMIC ALDEHYDE",
        150,
        "t",
        "citrus",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "DIPROPYLENE GLYCOL",
        301.7,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-045",
    "te": "fabric softener type",
    "tr": "Отдушка для кондиционера для белья",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, dimethyl benzyl carbinyl acetate, para-anisaldehyde, aldehyde C-12 lauric 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Отдушка для кондиционера для белья». Ключевые материалы структуры: phenylhexanol, hedione, phenethylol, coranol.",
    "pr": {
      "floral": 50,
      "citrus": 12,
      "gourmand": 2,
      "amber": 5,
      "woody": 3,
      "musk": 2,
      "green": 5
    },
    "it": [
      [
        "benzyl acetate",
        37.5,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 lauric 10%",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "aldehyde C-8 10%",
        5,
        "t",
        "citrus",
        10
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        37.5,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 mna 10%",
        7.5,
        "t",
        "citrus",
        10
      ],
      [
        "methyl anthranilate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "manzanate 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "gamma-undecalactone",
        12.5,
        "h",
        "gourmand",
        100
      ],
      [
        "benzophenone",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "cetalox",
        10,
        "b",
        "amber",
        100
      ],
      [
        "lemon oil",
        12.5,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        37.5,
        "h",
        "floral",
        100
      ],
      [
        "coranol",
        55,
        "h",
        "floral",
        100
      ],
      [
        "verdyl propionate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        37.5,
        "b",
        "amber",
        100
      ],
      [
        "cyclamen aldehyde",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-damascone",
        2.5,
        "h",
        "gourmand",
        100
      ],
      [
        "sandalrome",
        12.5,
        "b",
        "woody",
        100
      ],
      [
        "dihydromyrcenol",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl vanillin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "habanolide",
        25,
        "b",
        "musk",
        100
      ],
      [
        "heliotropin",
        12.5,
        "b",
        "amber",
        100
      ],
      [
        "iralia total",
        30,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        50,
        "h",
        "floral",
        100
      ],
      [
        "isopropyl 2-methyl butyrate",
        2.5,
        "h",
        "gourmand",
        100
      ],
      [
        "oranger crystals",
        7.5,
        "t",
        "citrus",
        100
      ],
      [
        "veramoss 10%",
        15,
        "b",
        "woody",
        10
      ],
      [
        "muscenone delta",
        5,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        62.5,
        "h",
        "floral",
        100
      ],
      [
        "galbascone 10%",
        2.5,
        "h",
        "floral",
        10
      ],
      [
        "santol pentenol",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        5,
        "b",
        "woody",
        100
      ],
      [
        "peonile",
        50,
        "h",
        "floral",
        100
      ],
      [
        "phenethylol",
        62.5,
        "h",
        "floral",
        100
      ],
      [
        "phenylhexanol",
        112.5,
        "h",
        "floral",
        100
      ],
      [
        "orange oil",
        12.5,
        "t",
        "citrus",
        100
      ],
      [
        "hexyl salicylate",
        12.5,
        "t",
        "green",
        100
      ],
      [
        "benzyl salicylate",
        50,
        "t",
        "green",
        100
      ],
      [
        "terpineol",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        5,
        "h",
        "floral",
        100
      ],
      [
        "yara yara",
        5,
        "h",
        "floral",
        100
      ],
      [
        "2,4-ivy carbaldehyde",
        5,
        "t",
        "citrus",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-046",
    "te": "Feminine composition for toiletries",
    "tr": "Женская косметическая композиция",
    "sd": "TGSC (dm1015272) · Patent 6,184,419",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,184,419 alpha., .beta.-unsaturated ketones.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Женская косметическая композиция». Формула из патента 6,184,419. Ключевые материалы структуры: cepionate, galaxolide 50 IPM, alpha-hexyl cinnamaldehyde, bergamot oil bergaptene reduced.",
    "pr": {
      "floral": 50,
      "citrus": 11,
      "aquatic": 1,
      "musk": 17,
      "woody": 3
    },
    "it": [
      [
        "adoxal 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "ambrofix",
        3,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "calone 1951 10%",
        10,
        "h",
        "aquatic",
        10
      ],
      [
        "cepionate",
        200,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "damascenone 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "ethyl linalool",
        40,
        "h",
        "floral",
        100
      ],
      [
        "florhydral",
        5,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        200,
        "b",
        "musk",
        50
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "iso e super",
        40,
        "b",
        "woody",
        100
      ],
      [
        "isoraldeine 95",
        50,
        "h",
        "floral",
        100
      ],
      [
        "cis-jasmone 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "lilial",
        50,
        "h",
        "floral",
        100
      ],
      [
        "melonal 10%",
        5,
        "h",
        "aquatic",
        10
      ],
      [
        "methyl anthranilate 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "methyl pamplemousse",
        20,
        "h",
        "floral",
        100
      ],
      [
        "nectaryl",
        2,
        "h",
        "floral",
        100
      ],
      [
        "radjanol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "tropional",
        15,
        "h",
        "floral",
        100
      ],
      [
        "tricyclal 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "vanillin 10%",
        5,
        "b",
        "amber",
        10
      ],
      [
        "viridine 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "ylang ylang oil",
        10,
        "h",
        "floral",
        100
      ],
      [
        "pharaone 10%/DPG",
        10,
        "h",
        "floral",
        10
      ],
      [
        "DIPG",
        30,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-047",
    "te": "Feminine FG1006 /2 (Givaudan)",
    "tr": "Женский FG1006 /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: For Women's Cologne at 15% alc. 90.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Женский FG1006 /2 (Givaudan)». Ключевые материалы структуры: TRIETHYL CITRATE, HEDIONE (Firmenich), GALAXOLIDE (IFF), ISO E SUPER (IFF).",
    "pr": {
      "floral": 50,
      "spicy": 1,
      "musk": 19,
      "aquatic": 2,
      "citrus": 14,
      "woody": 16
    },
    "it": [
      [
        "HEXENYL-3-CIS ACETATE",
        0.5,
        "t",
        "green",
        100
      ],
      [
        "TRIPLAL (IFF)",
        0.5,
        "t",
        "green",
        100
      ],
      [
        "FLORHYDRAL (Givaudan)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "HEXENOL-3-CIS",
        1,
        "t",
        "green",
        100
      ],
      [
        "LIFFAROME (IFF)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "RASPBERRY KETONE @10%",
        2,
        "h",
        "gourmand",
        10
      ],
      [
        "DAMASCENONE @10%",
        3,
        "h",
        "floral",
        10
      ],
      [
        "SPIROGALBANONE PURE (Givaudan) @10%",
        3,
        "h",
        "floral",
        10
      ],
      [
        "CARDAMOM SEED OIL @10%",
        4,
        "h",
        "spicy",
        10
      ],
      [
        "METHYL PAMPLEMOUSSE (Givaudan)",
        4,
        "h",
        "floral",
        100
      ],
      [
        "ETHYL ACETOACETATE",
        5,
        "h",
        "floral",
        100
      ],
      [
        "GERANODYLE (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "AMBROFIX (Givaudan)",
        6,
        "h",
        "floral",
        100
      ],
      [
        "AMBRETTOLIDE (Givaudan)",
        8,
        "b",
        "musk",
        100
      ],
      [
        "IRISONE ALPHA (Givaudan)",
        8,
        "h",
        "floral",
        100
      ],
      [
        "PHENYL ETHYL ALCOHOL",
        10,
        "h",
        "floral",
        100
      ],
      [
        "COSMONE (Givaudan)",
        15,
        "h",
        "floral",
        100
      ],
      [
        "HELIONAL (IFF)",
        15,
        "h",
        "aquatic",
        100
      ],
      [
        "BERGAMOT OIL ITALY",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "ETHYL LINALYL ACETATE (Givaudan)",
        35,
        "t",
        "citrus",
        100
      ],
      [
        "ETHYL LINALOOL (Givaudan)",
        35,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "ORANGE OIL SWEET ITALIAN TAROCCO",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "ISO E SUPER (IFF)",
        110,
        "b",
        "woody",
        100
      ],
      [
        "GALAXOLIDE (IFF)",
        120,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE (Firmenich)",
        200,
        "h",
        "floral",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        8,
        "h",
        "floral",
        100
      ],
      [
        "TRIETHYL CITRATE",
        300,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-048",
    "te": "Feminine FM1006 /2 (Givaudan)",
    "tr": "Женский FM1006 /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: For Women's Cologne at 15% alc. 90.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Женский FM1006 /2 (Givaudan)». Ключевые материалы структуры: HEDIONE (Firmenich), ISO E SUPER (IFF), DIPROPYLENE GLYCOL, ETHYLENE BRASSYLATE.",
    "pr": {
      "floral": 50,
      "musk": 8,
      "woody": 11,
      "amber": 1,
      "green": 1,
      "citrus": 3
    },
    "it": [
      [
        "AMBROFIX (Givaudan)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "CALONE",
        1,
        "h",
        "aquatic",
        100
      ],
      [
        "DAMASCENONE",
        1,
        "h",
        "floral",
        100
      ],
      [
        "HYDROXY ETHYL METHYL THIAZOL @10%",
        1,
        "h",
        "floral",
        10
      ],
      [
        "JUNIPER OIL",
        1,
        "h",
        "floral",
        100
      ],
      [
        "AMBRETTOLIDE (Givaudan)",
        2,
        "b",
        "musk",
        100
      ],
      [
        "DAMASCONE ALPHA @10%",
        2,
        "h",
        "gourmand",
        10
      ],
      [
        "DEWFRUIT TEC AB2927R (Givaudan)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "FLORHYDRAL (Givaudan)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "GERANIUM OIL EGYPT",
        2,
        "h",
        "floral",
        100
      ],
      [
        "LIFFAROME (IFF)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "MANZANATE (Givaudan) @10%",
        2,
        "h",
        "gourmand",
        10
      ],
      [
        "DIMETHYL ANTHRANILATE (Givaudan) @10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "JAVANOL (Givaudan) @1%",
        3,
        "b",
        "woody",
        1
      ],
      [
        "NECTARYL (Givaudan)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "ROSE OXIDE @1%",
        3,
        "h",
        "floral",
        1
      ],
      [
        "DIMETHYL BENZYL CARBINYL BUTYRATE",
        5,
        "h",
        "floral",
        100
      ],
      [
        "COUMARIN PURE",
        5,
        "b",
        "amber",
        100
      ],
      [
        "PHENOXY ETHYL ISOBUTYRATE",
        5,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLOL",
        10,
        "h",
        "floral",
        100
      ],
      [
        "COSMONE (Givaudan)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "VANILLIN",
        10,
        "b",
        "amber",
        100
      ],
      [
        "HEXENYL-3-CIS SALICYLATE",
        15,
        "t",
        "green",
        100
      ],
      [
        "GRAPEFRUIT OIL",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "METHYL PAMPLEMOUSSE (Givaudan)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "ORANGE OIL FLORIDA",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "CANTHOXAL (IFF)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "FLOROSA (Givaudan)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "ETHYL LINALOOL (Givaudan)",
        75,
        "h",
        "floral",
        100
      ],
      [
        "ETHYLENE BRASSYLATE",
        100,
        "b",
        "musk",
        100
      ],
      [
        "THIBETOLIDE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE (Firmenich)",
        150,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER (IFF)",
        150,
        "b",
        "woody",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "DIPROPYLENE GLYCOL",
        135,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-049",
    "te": "Feminine type fragrance",
    "tr": "Женская парфюмерная композиция",
    "sd": "TGSC (dm1015272) · Patent 5,118,865",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,118,865 Cyclic ketones and their use as perfuming ingredients.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Женская парфюмерная композиция». Формула из патента 5,118,865. Ключевые материалы структуры: vertofix, hedione, phenethyl alcohol, vetiveryl acetate.",
    "pr": {
      "floral": 50,
      "gourmand": 6,
      "woody": 32,
      "citrus": 9,
      "musk": 1,
      "amber": 2,
      "green": 6
    },
    "it": [
      [
        "decanol",
        20.2,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        4.04,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        12.12,
        "h",
        "gourmand",
        100
      ],
      [
        "vetiveryl acetate",
        56.57,
        "b",
        "woody",
        100
      ],
      [
        "aldehyde C-11 undecylenic 10%",
        8.08,
        "t",
        "citrus",
        10
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        8.08,
        "t",
        "citrus",
        100
      ],
      [
        "isoambrettolide 10%",
        10.1,
        "b",
        "musk",
        10
      ],
      [
        "allyl alpha-ionone",
        8.08,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-undecalactone",
        16.16,
        "h",
        "gourmand",
        100
      ],
      [
        "raspberry ketone",
        8.08,
        "h",
        "gourmand",
        100
      ],
      [
        "cassis bud absolute",
        10.1,
        "h",
        "gourmand",
        100
      ],
      [
        "coumarin 10%",
        14.14,
        "b",
        "amber",
        10
      ],
      [
        "hydroxycitronellal",
        50.51,
        "t",
        "citrus",
        100
      ],
      [
        "galbanum oil",
        6.06,
        "t",
        "green",
        100
      ],
      [
        "clove bud oil",
        2.02,
        "h",
        "spicy",
        100
      ],
      [
        "isobutyl quinoline 10%",
        4.04,
        "b",
        "leathery",
        10
      ],
      [
        "phenoxyethyl isobutyrate",
        2.02,
        "h",
        "floral",
        100
      ],
      [
        "jasmin absolute",
        24.24,
        "h",
        "floral",
        100
      ],
      [
        "levocitrol",
        44.44,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        4.04,
        "h",
        "floral",
        100
      ],
      [
        "ethyl linalool",
        14.14,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        26.26,
        "h",
        "floral",
        100
      ],
      [
        "iralia total",
        46.46,
        "h",
        "floral",
        100
      ],
      [
        "oakmoss absolute 50%",
        32.32,
        "b",
        "woody",
        50
      ],
      [
        "hedione",
        115.15,
        "h",
        "floral",
        100
      ],
      [
        "neroli oil",
        12.12,
        "t",
        "citrus",
        100
      ],
      [
        "patchouli oil",
        4.04,
        "b",
        "woody",
        100
      ],
      [
        "phenethyl alcohol",
        76.77,
        "h",
        "floral",
        100
      ],
      [
        "orange oil brazil",
        8.08,
        "t",
        "citrus",
        100
      ],
      [
        "Polywood",
        16.16,
        "b",
        "woody",
        100
      ],
      [
        "rose absolute morocco",
        12.12,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        44.44,
        "t",
        "green",
        100
      ],
      [
        "sandalwood oil",
        26.26,
        "b",
        "woody",
        100
      ],
      [
        "stemone",
        6.06,
        "t",
        "green",
        100
      ],
      [
        "tonalid 10%",
        13.13,
        "h",
        "floral",
        10
      ],
      [
        "vanillin 1%",
        5.05,
        "b",
        "amber",
        1
      ],
      [
        "vertofix",
        165.66,
        "b",
        "woody",
        100
      ],
      [
        "ylang ylang oil",
        14.14,
        "h",
        "floral",
        100
      ],
      [
        "hyacinth absolute replacer",
        16.16,
        "h",
        "floral",
        100
      ],
      [
        "rose absolute replacer",
        32.32,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-050",
    "te": "Fine fragrance",
    "tr": "Аромат высокой парфюмерии",
    "sd": "TGSC (dm1015272) · Patent 5,703,250",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,703,250 Odorants.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат высокой парфюмерии». Формула из патента 5,703,250. Ключевые материалы структуры: hedione, galaxolide 50 IPM, bergamot essence, linalool.",
    "pr": {
      "floral": 50,
      "citrus": 22,
      "aquatic": 1,
      "musk": 12
    },
    "it": [
      [
        "belembre",
        14.29,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        21.43,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate 10%",
        4.29,
        "h",
        "floral",
        10
      ],
      [
        "bergamot essence",
        114.29,
        "t",
        "citrus",
        100
      ],
      [
        "calone 1951 10%",
        7.14,
        "h",
        "aquatic",
        10
      ],
      [
        "lemon essence (oil phase)",
        14.29,
        "t",
        "citrus",
        100
      ],
      [
        "cyclogalbanate",
        2.86,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        78.57,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl linalool",
        14.29,
        "h",
        "floral",
        100
      ],
      [
        "fixolide",
        42.86,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        142.86,
        "b",
        "musk",
        50
      ],
      [
        "geraniol",
        7.14,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        285.71,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        35.71,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        21.43,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        100,
        "h",
        "floral",
        100
      ],
      [
        "mandarin essence",
        21.43,
        "t",
        "citrus",
        100
      ],
      [
        "orange essence oil",
        28.57,
        "t",
        "citrus",
        100
      ],
      [
        "tropional",
        35.71,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        7.14,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-051",
    "te": "Fine fragrance accord",
    "tr": "Аккорд высокой парфюмерии",
    "sd": "TGSC (dm1015272) · Patent 6,326,349",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,326,349 Methylcyclotetradec-5-en-1-ones.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд высокой парфюмерии». Формула из патента 6,326,349. Ключевые материалы структуры: hedione, ethylene brassylate, lilial, DIPG.",
    "pr": {
      "floral": 50,
      "citrus": 5,
      "musk": 8,
      "spicy": 1
    },
    "it": [
      [
        "cosmone",
        50,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "ethyl acetoacetate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "ethyl phenyl acetate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        70,
        "t",
        "citrus",
        100
      ],
      [
        "ambrettolide",
        10,
        "b",
        "musk",
        100
      ],
      [
        "ambrofix",
        2,
        "h",
        "floral",
        100
      ],
      [
        "ethylene brassylate",
        100,
        "b",
        "musk",
        100
      ],
      [
        "citronellol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "cyclogalbanate",
        4,
        "h",
        "floral",
        100
      ],
      [
        "cyclohexal",
        20,
        "h",
        "floral",
        100
      ],
      [
        "oxyoctaline formate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "gardenol",
        2,
        "h",
        "floral",
        100
      ],
      [
        "givescone",
        15,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        300,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "isoraldeine 95",
        35,
        "h",
        "floral",
        100
      ],
      [
        "cis-jasmone",
        3,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        80,
        "h",
        "floral",
        100
      ],
      [
        "methyl pamplemousse",
        20,
        "h",
        "floral",
        100
      ],
      [
        "black pepper oil",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "tricyclal",
        2,
        "h",
        "floral",
        100
      ],
      [
        "tropional",
        30,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        80,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-052",
    "te": "Fine fragrance for men",
    "tr": "Мужской аромат высокой парфюмерии",
    "sd": "TGSC (dm1015272) · Patent 6,441,052",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,441,052 Cyclopentylalkyl-nitriles.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужской аромат высокой парфюмерии». Формула из патента 6,441,052. Ключевые материалы структуры: bergamot oil bergaptene reduced, laurine, magnolione, cepionate.",
    "pr": {
      "floral": 50,
      "amber": 8,
      "citrus": 25
    },
    "it": [
      [
        "5-Cyclopentylhexan-1-ol 10%",
        30,
        "h",
        "floral",
        10
      ],
      [
        "amyris oil",
        50,
        "h",
        "floral",
        100
      ],
      [
        "siam benzoin resinoid 50%",
        50,
        "b",
        "amber",
        50
      ],
      [
        "bergamot oil bergaptene reduced",
        175,
        "t",
        "citrus",
        100
      ],
      [
        "cepionate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "damascenone 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "dihydrolinalool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl isobutyrate",
        6,
        "h",
        "floral",
        100
      ],
      [
        "dimetol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "fennaldehyde",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "fixambrene",
        4,
        "h",
        "floral",
        100
      ],
      [
        "florhydral",
        5,
        "h",
        "floral",
        100
      ],
      [
        "florol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "gardenol",
        5,
        "h",
        "floral",
        100
      ],
      [
        "laurine",
        80,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil italy",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "magnolione",
        80,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil italy green",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "olibanum resinoid 50%",
        45,
        "b",
        "amber",
        50
      ],
      [
        "orange oil florida",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "thibetolide",
        10,
        "h",
        "floral",
        100
      ],
      [
        "tricyclal 10%",
        25,
        "h",
        "floral",
        10
      ],
      [
        "tropional",
        40,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        15,
        "h",
        "floral",
        100
      ],
      [
        "velvione",
        20,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-053",
    "te": "Fresh Floral",
    "tr": "Свежий цветочный",
    "sd": "TGSC (dm1015272) · Patent 8,399,399",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,399,399 3- and 4-methyl dodecenal and their use in fragrance and flavour compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Свежий цветочный». Формула из патента 8,399,399. Ключевые материалы структуры: DIPG, hedione, linalool, dihydrofarnesal.",
    "pr": {
      "citrus": 13,
      "green": 8,
      "floral": 50,
      "woody": 8
    },
    "it": [
      [
        "lemon oil italy",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        3,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenol",
        2,
        "t",
        "green",
        100
      ],
      [
        "linalool",
        70,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "gardenol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "rhodinol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        35,
        "h",
        "floral",
        100
      ],
      [
        "dihydro-beta-ionone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        30,
        "h",
        "floral",
        100
      ],
      [
        "dihydrofarnesal",
        60,
        "h",
        "floral",
        100
      ],
      [
        "nerolidol",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "lilial",
        30,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl benzoate",
        30,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        20,
        "t",
        "green",
        100
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "sandalore",
        35,
        "b",
        "woody",
        100
      ],
      [
        "iso e super",
        50,
        "b",
        "woody",
        100
      ],
      [
        "thibetolide",
        25,
        "h",
        "floral",
        100
      ],
      [
        "nirvanolide",
        35,
        "h",
        "floral",
        100
      ],
      [
        "benzyl benzoate",
        55,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        30,
        "t",
        "green",
        100
      ],
      [
        "DIPG",
        170,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-054",
    "te": "Accord N° 207563 Floral (Firmenich)",
    "tr": "Аккорд №207563 · цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · In this accord HEDIONE helps to harmonise the distinctive Cetylia base note and gives the blend greater diffusion and radiance..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207563 · цветочный (Firmenich)». Ключевые материалы структуры: CETYLIA® BASE (Firmenich), DIPG, VERTOFIX® COEUR (IFF), HEDIONE® (Firmenich).",
    "pr": {
      "citrus": 1,
      "floral": 50,
      "woody": 8
    },
    "it": [
      [
        "ALDEHYDE C11 UNDECYLENIC 50%",
        10,
        "t",
        "citrus",
        50
      ],
      [
        "CETYLIA® BASE (Firmenich)",
        500,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        100,
        "b",
        "woody",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        240,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-055",
    "te": "Accord N° 208691 Floral (Firmenich)",
    "tr": "Аккорд №208691 · цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Detergent powder: 0.10% ; Soap: 1.00% · With this accord we have tried to show the effects that HEDIONE can have to subdue and floralise the rather chemical character of Tricyclodecenyl propionate and Tricyclodecenyl acetate.This type of accord has interest for the heavy duty detergent powders and liquids..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208691 · цветочный (Firmenich)». Ключевые материалы структуры: TERPINEOL, GERANIOL, TRICYCLODECENYL PROPIONATE, CIS-JASMONE 10%.",
    "pr": {
      "floral": 50,
      "citrus": 2,
      "musk": 5
    },
    "it": [
      [
        "CIS-JASMONE 10%",
        100,
        "h",
        "floral",
        10
      ],
      [
        "DIHYDROMYRCENOL",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "GERANIOL",
        160,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® 50 DIPG (Firmenich)",
        80,
        "b",
        "musk",
        50
      ],
      [
        "LILIAL® (Givaudan)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "TERPINEOL",
        240,
        "h",
        "floral",
        100
      ],
      [
        "TRICYCLODECENYL ACETATE",
        80,
        "h",
        "floral",
        100
      ],
      [
        "TRICYCLODECENYL PROPIONATE",
        160,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-056",
    "te": "Accord N° 207913 Floral (Firmenich)",
    "tr": "Аккорд №207913 · цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Detergent powder: 0.15% ; Shampoo: 0.50% ; Soap: 1.00% · The floral character develops a lovely fresh vitality by the addition of CITROASIS BASE 129022..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207913 · цветочный (Firmenich)». Ключевые материалы структуры: HEXYL SALICYLATE, HEDIONE® (Firmenich), IRALIA® TOTAL (Firmenich), BENZYL ACETATE.",
    "pr": {
      "floral": 50,
      "spicy": 2,
      "green": 18,
      "gourmand": 1
    },
    "it": [
      [
        "ALDEHYDE C11 UNDECYLENIC 10%",
        5,
        "t",
        "citrus",
        10
      ],
      [
        "BENZYL ACETATE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "CETYVER SA (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "EUGENOL",
        30,
        "h",
        "spicy",
        100
      ],
      [
        "EXALTEX® (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        150,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        250,
        "t",
        "green",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        130,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLHEXANOL (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "CITROASIS BASE 129022 (Firmenich)",
        25,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-057",
    "te": "Accord N° 207888 Floral (Firmenich) (#57)",
    "tr": "Аккорд №207888 · цветочный (Firmenich) (#57)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Detergent powder: 0.15% ; Shampoo: 0.50% ; Soap: 1.00% · This floral woody accord is given a lovely cool clean freshness by the addition of TAMARINE BASE 41310 G..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207888 · цветочный (Firmenich) (#57)». Ключевые материалы структуры: HEXYL SALICYLATE, LILIAL® (Givaudan), MAYOL® (Firmenich), HEDIONE® (Firmenich).",
    "pr": {
      "floral": 50,
      "citrus": 4,
      "green": 40,
      "woody": 1,
      "aquatic": 2
    },
    "it": [
      [
        "CEDROXYDE® (Firmenich)",
        6,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        85,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        412,
        "t",
        "green",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        210,
        "h",
        "floral",
        100
      ],
      [
        "LYRAL® (IFF)",
        85,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        125,
        "h",
        "floral",
        100
      ],
      [
        "PATCHOULI OIL",
        12,
        "b",
        "woody",
        100
      ],
      [
        "TAMARINE BASE 41310 G (Firmenich)",
        25,
        "h",
        "aquatic",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-058",
    "te": "Accord N° 207888 Floral (Firmenich) (#58)",
    "tr": "Аккорд №207888 · цветочный (Firmenich) (#58)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Detergent powder: 0.15% ; Shampoo: 0.50% ; Soap: 1.00% · This floral woody accord is given a lovely cool clean freshness by the addition of TAMARINE BASE 41310 G..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207888 · цветочный (Firmenich) (#58)». Ключевые материалы структуры: HEXYL SALICYLATE, LILIAL® (Givaudan), MAYOL® (Firmenich), HEDIONE® (Firmenich).",
    "pr": {
      "floral": 50,
      "citrus": 4,
      "green": 40,
      "woody": 1,
      "aquatic": 2
    },
    "it": [
      [
        "CEDROXYDE® (Firmenich)",
        6,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        85,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        412,
        "t",
        "green",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        210,
        "h",
        "floral",
        100
      ],
      [
        "LYRAL® (IFF)",
        85,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        125,
        "h",
        "floral",
        100
      ],
      [
        "PATCHOULI OIL",
        12,
        "b",
        "woody",
        100
      ],
      [
        "TAMARINE BASE 41310 G (Firmenich)",
        25,
        "h",
        "aquatic",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-059",
    "te": "Accord N° 208705 Floral (Firmenich)",
    "tr": "Аккорд №208705 · цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% · Once again we see how TUBEREUSE 41286 SA is able to fill out and give a natural floral sweetness to an accord. With the VERT DE FLEUR D'ORANGER 115 SA it achieve an interesting twist in the direction of honeysuckle and jonquille..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208705 · цветочный (Firmenich)». Ключевые материалы структуры: AMYLCINNAMIC ALDEHYDE, BENZYL BENZOATE, MUGUET BASE 41315 B (Firmenich), TRICYCLODECENYL PROPIONATE.",
    "pr": {
      "citrus": 18,
      "floral": 50
    },
    "it": [
      [
        "AMYLCINNAMIC ALDEHYDE",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "BENZYL BENZOATE",
        200,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "DIPROPYLENE GLYCOL",
        90,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "MUGUET BASE 41315 B (Firmenich)",
        200,
        "h",
        "floral",
        100
      ],
      [
        "TRICYCLODECENYL PROPIONATE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "VERT DE FLEUR D'ORANGER 115 SA (Firmenich)",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "YLANG SYNTH",
        60,
        "h",
        "floral",
        100
      ],
      [
        "TUBEREUSE 41286 SA (Firmenich)",
        40,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-060",
    "te": "Accord N° 207709 Floral (Firmenich)",
    "tr": "Аккорд №207709 · цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Detergent powder: 0.15% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.30% · A large amount of DELPHONE gives this accord a rich and natural sweetness related to the white flower effect of Gardenia..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207709 · цветочный (Firmenich)». Ключевые материалы структуры: PHENYLETHYL ALCOHOL, HEDIONE® (Firmenich), DELPHONE (Firmenich), CYCLAMEN ALDEHYDE.",
    "pr": {
      "citrus": 14,
      "floral": 50,
      "spicy": 4,
      "green": 2,
      "gourmand": 7
    },
    "it": [
      [
        "ALDEHYDE C12 LAURIC 10%",
        25,
        "t",
        "citrus",
        10
      ],
      [
        "CYCLAMEN ALDEHYDE",
        75,
        "t",
        "citrus",
        100
      ],
      [
        "CYCLOPIDENE (Firmenich)",
        25,
        "h",
        "floral",
        100
      ],
      [
        "DIMETHYL BENZYL CARBINYL ACETATE",
        25,
        "h",
        "floral",
        100
      ],
      [
        "ISOEUGENOL",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "EUGENOL",
        20,
        "h",
        "spicy",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        150,
        "h",
        "floral",
        100
      ],
      [
        "HYDRATROPIC ALDEHYDE 10%",
        60,
        "t",
        "citrus",
        10
      ],
      [
        "METHYL OCTINE CARBONATE 10%",
        20,
        "t",
        "green",
        10
      ],
      [
        "METHYL SALICYLATE",
        10,
        "t",
        "green",
        100
      ],
      [
        "METHYLISOEUGENOL",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "NONALACTONE DELTA",
        60,
        "h",
        "gourmand",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        350,
        "h",
        "floral",
        100
      ],
      [
        "SCHIFF BASE (HYDROXYCITRONELLAL/ANTHRANILATE)",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "STYRALLYL ACETATE",
        30,
        "h",
        "gourmand",
        100
      ],
      [
        "DELPHONE (Firmenich)",
        100,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-061",
    "te": "Accord N° 208193 Floral (Firmenich)",
    "tr": "Аккорд №208193 · цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Detergent powder: 0.30% ; Fabric softner: 0.50% ; Soap: 1.00% · The addition of small amount of MUSCENONE to this functional fragrance makes it bloom. The fragrance becomes richer, fuller and the floral note is enhanced..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208193 · цветочный (Firmenich)». Ключевые материалы структуры: DIHYDROMYRCENOL, IRALIA® TOTAL (Firmenich), PHENYLHEXANOL (Firmenich), BENZOPHENONE.",
    "pr": {
      "citrus": 18,
      "floral": 50,
      "spicy": 3,
      "amber": 4,
      "musk": 11,
      "woody": 4
    },
    "it": [
      [
        "ALDEHYDE C12 LAURIC 50%",
        50,
        "t",
        "citrus",
        50
      ],
      [
        "ANISIC ALDEHYDE",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "BENZOPHENONE",
        90,
        "h",
        "floral",
        100
      ],
      [
        "CINNAMIC ALCOHOL",
        30,
        "h",
        "spicy",
        100
      ],
      [
        "COUMARIN",
        20,
        "b",
        "amber",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        140,
        "t",
        "citrus",
        100
      ],
      [
        "HABANOLIDE® 50 DIPG (Firmenich)",
        90,
        "b",
        "musk",
        50
      ],
      [
        "HEDIONE® (Firmenich)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "HELIOTROPIN",
        30,
        "b",
        "amber",
        100
      ],
      [
        "IONONE ALPHA",
        40,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        140,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLHEXANOL (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "POLYSANTOL® (Firmenich)",
        40,
        "b",
        "woody",
        100
      ],
      [
        "ROSE OXIDE",
        10,
        "h",
        "floral",
        100
      ],
      [
        "TRICYCLODECENYL ACETATE",
        50,
        "h",
        "floral",
        100
      ],
      [
        "YLANG SYNTH",
        70,
        "h",
        "floral",
        100
      ],
      [
        "MUSCENONE™ (Firmenich) 10%",
        30,
        "b",
        "musk",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-062",
    "te": "Accord N° 208702 Floral (Firmenich)",
    "tr": "Аккорд №208702 · цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · This floral cosmetic blend is given a fresh natural lift by the addition of MYROXYDE..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208702 · цветочный (Firmenich)». Ключевые материалы структуры: CETYLIA® BASE B (Firmenich), LINALOL, IRALIA® TOTAL (Firmenich), HEDIONE® (Firmenich).",
    "pr": {
      "citrus": 3,
      "floral": 50,
      "musk": 2,
      "gourmand": 2
    },
    "it": [
      [
        "ANISIC ALDEHYDE",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "CETYLIA® BASE B (Firmenich)",
        200,
        "h",
        "floral",
        100
      ],
      [
        "CETYVER SA (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "EXALTOLIDE® TOTAL (Firmenich) 50%",
        40,
        "b",
        "musk",
        50
      ],
      [
        "HEDIONE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "IONONE BETA",
        60,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        160,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        200,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE",
        40,
        "h",
        "gourmand",
        100
      ],
      [
        "MYROXYDE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-063",
    "te": "Accord N° 208084 Floral aldehydic woody green (Firmenich)",
    "tr": "Аккорд №208084 · цветочный альдегидный древесный зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Soap: 1.00% · The balance of the aldehyde and the GALBANOLENE SUPER allows the strength of these materials to lift the accord in a dynamic way..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208084 · цветочный альдегидный древесный зелёный (Firmenich)». Ключевые материалы структуры: PHENYLETHYL ALCOHOL, TETRAHYDROLINALOL, BENZYL SALICYLATE, HEXYLCINNAMIC ALDEHYDE.",
    "pr": {
      "citrus": 13,
      "green": 11,
      "floral": 50
    },
    "it": [
      [
        "ALDEHYDE SUPRA (Firmenich) 10%",
        20,
        "t",
        "citrus",
        10
      ],
      [
        "BENZYL SALICYLATE",
        150,
        "t",
        "green",
        100
      ],
      [
        "CEDROXYDE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        110,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        150,
        "t",
        "citrus",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        200,
        "h",
        "floral",
        100
      ],
      [
        "TETRAHYDROLINALOL",
        200,
        "h",
        "floral",
        100
      ],
      [
        "GALBANOLENE SUPER (Firmenich) 10%",
        20,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-064",
    "te": "Accord N° 208045 Floral aldehydic woody musk (Firmenich)",
    "tr": "Аккорд №208045 · цветочный альдегидный древесный мускусный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "woody",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Soap: 1.00% · This accord demonstrates well the impact AMBROX DL has on other products. In particular, the floral and woody aspects are clearly boosted..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208045 · цветочный альдегидный древесный мускусный (Firmenich)». Ключевые материалы структуры: BENZYL ACETATE, CYCLOMETHYLENE CITRONELLOL, HEXYLCINNAMIC ALDEHYDE, IRALIA® TOTAL (Firmenich).",
    "pr": {
      "citrus": 12,
      "floral": 50,
      "gourmand": 2,
      "musk": 4,
      "woody": 10,
      "amber": 2
    },
    "it": [
      [
        "ALDEHYDE C11 UNDECYLENIC 10%",
        25,
        "t",
        "citrus",
        10
      ],
      [
        "ALDEHYDE C12 LAURIC 10%",
        25,
        "t",
        "citrus",
        10
      ],
      [
        "BENZYL ACETATE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "CYCLOMETHYLENE CITRONELLOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCONE ALPHA (Firmenich) 10%",
        25,
        "h",
        "gourmand",
        10
      ],
      [
        "DYNASCONE® 10 (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "EXALTOLIDE® TOTAL (Firmenich) 50%",
        50,
        "b",
        "musk",
        50
      ],
      [
        "HEDIONE® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "LORYSIA® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "PATCHOULI OIL",
        50,
        "b",
        "woody",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "VANILLIN 10%",
        20,
        "b",
        "amber",
        10
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        80,
        "b",
        "woody",
        100
      ],
      [
        "AMBROX® DL (Firmenich)",
        5,
        "b",
        "amber",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-065",
    "te": "Floral ambery feminine accord",
    "tr": "Цветочно-амбровый женский аккорд",
    "sd": "TGSC (dm1015272) · Patent 6,284,929",
    "fa": "amber",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,284,929 Odorants.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочно-амбровый женский аккорд». Формула из патента 6,284,929. Ключевые материалы структуры: hedione, galaxolide 50 IPM, DIPG, bergamot oil bergaptene reduced.",
    "pr": {
      "floral": 50,
      "green": 7,
      "citrus": 24,
      "gourmand": 1,
      "amber": 4,
      "woody": 11,
      "musk": 28
    },
    "it": [
      [
        "cardamom seed oil",
        2,
        "h",
        "spicy",
        100
      ],
      [
        "indolene 10%",
        3,
        "h",
        "floral",
        10
      ],
      [
        "stemone",
        3,
        "t",
        "green",
        100
      ],
      [
        "aldehyde C-11 undecylic 10%",
        3,
        "t",
        "citrus",
        10
      ],
      [
        "allyl amyl glycolate",
        4,
        "h",
        "gourmand",
        100
      ],
      [
        "cassione 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "coumarin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "citronellyl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "cyclal C 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "cis-jasmone 10%",
        6,
        "h",
        "floral",
        10
      ],
      [
        "geraniol",
        8,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        20,
        "t",
        "green",
        100
      ],
      [
        "patchouli oil",
        25,
        "b",
        "woody",
        100
      ],
      [
        "vanillin",
        25,
        "b",
        "amber",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        30,
        "t",
        "green",
        100
      ],
      [
        "linalyl acetate",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "iso e super",
        40,
        "b",
        "woody",
        100
      ],
      [
        "phenethyl alcohol",
        45,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil replacer",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        60,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "galaxolide 50 IPM",
        200,
        "b",
        "musk",
        50
      ],
      [
        "hedione",
        210,
        "h",
        "floral",
        100
      ],
      [
        "javanol",
        10,
        "b",
        "woody",
        100
      ],
      [
        "DIPG",
        106,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-066",
    "te": "Floral baby powder accord",
    "tr": "Цветочный аккорд детской присыпки",
    "sd": "TGSC (dm1015272) · Patent 7,838,487",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,838,487 Macrocyclic musk.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный аккорд детской присыпки». Формула из патента 7,838,487. Ключевые материалы структуры: DIPG, lilial, methyl ionone gamma supreme, iso e super.",
    "pr": {
      "floral": 50,
      "amber": 8,
      "citrus": 8,
      "woody": 7
    },
    "it": [
      [
        "santaliff",
        24,
        "h",
        "floral",
        100
      ],
      [
        "phenoxanol",
        32,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        28,
        "b",
        "amber",
        100
      ],
      [
        "cyclamal extra",
        1,
        "h",
        "floral",
        100
      ],
      [
        "ethyl vanillin",
        7,
        "b",
        "amber",
        100
      ],
      [
        "geranyl acetate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        60,
        "h",
        "floral",
        100
      ],
      [
        "alpha-amyl cinnamaldehyde",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "heliotropin",
        17,
        "b",
        "amber",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        16,
        "t",
        "citrus",
        100
      ],
      [
        "beta-ionone",
        6,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        70,
        "b",
        "woody",
        100
      ],
      [
        "lyral",
        16,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        160,
        "h",
        "floral",
        100
      ],
      [
        "lilianth",
        20,
        "h",
        "floral",
        100
      ],
      [
        "methyl ionone gamma supreme",
        73,
        "h",
        "floral",
        100
      ],
      [
        "veramoss",
        2,
        "b",
        "woody",
        100
      ],
      [
        "peru balsam oil",
        3,
        "b",
        "amber",
        100
      ],
      [
        "prenyl acetate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "methyl cedryl ketone",
        40,
        "h",
        "floral",
        100
      ],
      [
        "methyl phenyl acetate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde",
        4,
        "t",
        "citrus",
        100
      ],
      [
        "siam benzoin resinoid",
        10,
        "b",
        "amber",
        100
      ],
      [
        "cedrol",
        3,
        "b",
        "woody",
        100
      ],
      [
        "citronellol",
        3,
        "h",
        "floral",
        100
      ],
      [
        "geraniol coeur",
        4,
        "h",
        "floral",
        100
      ],
      [
        "methyl cinnamate",
        3,
        "h",
        "spicy",
        100
      ],
      [
        "styrax oil",
        2,
        "b",
        "amber",
        100
      ],
      [
        "vanillin",
        12,
        "b",
        "amber",
        100
      ],
      [
        "cananga oil",
        5,
        "h",
        "floral",
        100
      ],
      [
        "8-cyclohexadecenone + 7,9-cyclohexadecadien-1-one",
        66,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        250,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-067",
    "te": "floral balsam amber fragrance",
    "tr": "Цветочно-бальзамический амбровый аромат",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "amber",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring triplal, benzyl salicylate, bourgeonal, citronellol.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочно-бальзамический амбровый аромат». Ключевые материалы структуры: alpha-hexyl cinnamaldehyde, lilial, methyl dihydrojasmonate, dihydromyrcenol.",
    "pr": {
      "green": 13,
      "floral": 50,
      "citrus": 28,
      "amber": 1,
      "musk": 3
    },
    "it": [
      [
        "triplal",
        5,
        "t",
        "green",
        100
      ],
      [
        "benzyl salicylate",
        55,
        "t",
        "green",
        100
      ],
      [
        "bourgeonal",
        30,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        15,
        "h",
        "floral",
        100
      ],
      [
        "cyclamal extra",
        10,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        75,
        "t",
        "citrus",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        35,
        "h",
        "floral",
        100
      ],
      [
        "fleuramone",
        8,
        "h",
        "floral",
        100
      ],
      [
        "floralozone",
        4,
        "h",
        "aquatic",
        100
      ],
      [
        "ambroxan",
        10,
        "b",
        "amber",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        15,
        "t",
        "green",
        100
      ],
      [
        "hexyl salicylate",
        60,
        "t",
        "green",
        100
      ],
      [
        "lilial",
        200,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        85,
        "h",
        "floral",
        100
      ],
      [
        "muskalactone",
        30,
        "b",
        "musk",
        100
      ],
      [
        "orange oil",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "tetrahydromyrcenol",
        75,
        "h",
        "floral",
        100
      ],
      [
        "undecanal",
        3,
        "h",
        "floral",
        100
      ],
      [
        "zenolide",
        65,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-068",
    "te": "Accord N° 208425 Floral chypre (Firmenich)",
    "tr": "Аккорд №208425 · цветочный шипр (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "woody",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · This accord shows the effect of MUSCENONE to enhance the woody amber aspect in a fine fragrance accord..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208425 · цветочный шипр (Firmenich)». Ключевые материалы структуры: HEXYLCINNAMIC ALDEHYDE, CITRONELLOL, IRALIA® TOTAL (Firmenich), COUMARIN.",
    "pr": {
      "amber": 24,
      "floral": 50,
      "citrus": 26,
      "woody": 9,
      "aquatic": 4,
      "musk": 7
    },
    "it": [
      [
        "CETALOX® (Firmenich) 10%",
        30,
        "b",
        "amber",
        10
      ],
      [
        "CETYVER SA (Firmenich)",
        43,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLOL",
        145,
        "h",
        "floral",
        100
      ],
      [
        "COUMARIN",
        115,
        "b",
        "amber",
        100
      ],
      [
        "ETHYL VANILLIN 10%",
        58,
        "b",
        "amber",
        10
      ],
      [
        "HEDIONE® HC (Firmenich)",
        115,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        217,
        "t",
        "citrus",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        116,
        "h",
        "floral",
        100
      ],
      [
        "OAKMOSS SYNTH 10%",
        43,
        "b",
        "woody",
        10
      ],
      [
        "PATCHOULI OIL",
        30,
        "b",
        "woody",
        100
      ],
      [
        "TAMARINE BASE 41310 G (Firmenich)",
        30,
        "h",
        "aquatic",
        100
      ],
      [
        "MUSCENONE™ (Firmenich) 10%",
        58,
        "b",
        "musk",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-069",
    "te": "Accord N° 207779 Floral citrus (Firmenich)",
    "tr": "Аккорд №207779 · цветочный цитрусовый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.20% · The THIOXAN BASE 38375 D gives a lovely flowery petal effect and helps to freshness the citrus character..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207779 · цветочный цитрусовый (Firmenich)». Ключевые материалы структуры: BENZYL ACETATE, HEXYLCINNAMIC ALDEHYDE, BENZYL SALICYLATE, LINALOL.",
    "pr": {
      "citrus": 12,
      "floral": 50,
      "green": 7,
      "musk": 1,
      "gourmand": 1
    },
    "it": [
      [
        "ALCOHOL C8 10%",
        10,
        "b",
        "aquatic",
        0
      ],
      [
        "ALDEHYDE C 10",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "BENZYL ACETATE",
        150,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        100,
        "t",
        "green",
        100
      ],
      [
        "CITRONELLOL",
        10,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "DIMETHYL BENZYL CARBINOL",
        20,
        "h",
        "floral",
        100
      ],
      [
        "GALBEX® 183 (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "GERANIOL",
        60,
        "h",
        "floral",
        100
      ],
      [
        "GLYCOMEL (Firmenich) 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "HABANOLIDE® (Firmenich)",
        20,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        120,
        "t",
        "citrus",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        80,
        "h",
        "floral",
        100
      ],
      [
        "METHYL CYCLOGERANIATE (Firmenich) 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "PARA TERT BUTYL CYCLOHEXYL ACETATE",
        40,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "TERPINEOL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "TRICHLOROMETHYL PHENYL CARBINYL ACETATE",
        40,
        "h",
        "floral",
        100
      ],
      [
        "THIOXAN BASE 38375 D (Firmenich) 10%",
        30,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-070",
    "te": "Floral fragrance",
    "tr": "Цветочный аромат",
    "sd": "TGSC (dm1015272) · Patent 7,517,840",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,517,840 Optimized perfumery for rinse-off products.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный аромат». Формула из патента 7,517,840. Ключевые материалы структуры: benzyl acetate, linalool, linalyl acetate, hedione.",
    "pr": {
      "floral": 50,
      "citrus": 8,
      "green": 2
    },
    "it": [
      [
        "mayol",
        50.3,
        "h",
        "floral",
        100
      ],
      [
        "cyclacet",
        49.5,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        330.6,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        262.5,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        56,
        "t",
        "citrus",
        100
      ],
      [
        "linalyl acetate",
        81.9,
        "t",
        "citrus",
        100
      ],
      [
        "cis-3-hexenol",
        10.4,
        "t",
        "green",
        100
      ],
      [
        "triplal",
        14.3,
        "t",
        "green",
        100
      ],
      [
        "rose oxide",
        0.6,
        "h",
        "floral",
        100
      ],
      [
        "canthoxal",
        5.7,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        36,
        "h",
        "floral",
        100
      ],
      [
        "liffarome",
        0.8,
        "h",
        "floral",
        100
      ],
      [
        "galbanolene super",
        1.2,
        "h",
        "floral",
        100
      ],
      [
        "neofolione",
        5.1,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        5.9,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl benzoate",
        7,
        "t",
        "green",
        100
      ],
      [
        "muguet carbinol",
        1.3,
        "h",
        "floral",
        100
      ],
      [
        "mugetanol",
        11.8,
        "h",
        "floral",
        100
      ],
      [
        "beta-damascone fab",
        1.2,
        "h",
        "gourmand",
        100
      ],
      [
        "methyl anthranilate",
        3,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        64.9,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-071",
    "te": "Floral fragrance composition (Patent 7,790,668)",
    "tr": "Цветочный аромат композиция (Патент 7,790,668)",
    "sd": "TGSC (dm1015272) · Patent 7,790,668",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,790,668 2-methoxy-2,6-dimethyloctanal and its use as a fragrance ingredient.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный аромат композиция (Патент 7,790,668)». Формула из патента 7,790,668. Ключевые материалы структуры: hedione, cepionate, DIPG, linalool.",
    "pr": {
      "floral": 50,
      "green": 3,
      "citrus": 2,
      "musk": 2,
      "gourmand": 1
    },
    "it": [
      [
        "linalool",
        30,
        "h",
        "floral",
        100
      ],
      [
        "mayol",
        25,
        "h",
        "floral",
        100
      ],
      [
        "dihydro-beta-ionone",
        8,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        8,
        "h",
        "floral",
        100
      ],
      [
        "cepionate",
        250,
        "h",
        "floral",
        100
      ],
      [
        "cyclohexal",
        20,
        "h",
        "floral",
        100
      ],
      [
        "dihydrofarnesal",
        20,
        "h",
        "floral",
        100
      ],
      [
        "farnesol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl benzoate",
        25,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        25,
        "t",
        "green",
        100
      ],
      [
        "hydroxycitronellal",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "dimetol",
        8,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        300,
        "h",
        "floral",
        100
      ],
      [
        "musk ketone",
        4,
        "b",
        "musk",
        100
      ],
      [
        "cassis base 345 B",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "indolene 10%",
        12,
        "h",
        "floral",
        10
      ],
      [
        "allyl amyl glycolate 10%",
        2,
        "h",
        "gourmand",
        10
      ],
      [
        "raspberry ketone 10%",
        5,
        "h",
        "gourmand",
        10
      ],
      [
        "alpha-damascone 10%",
        8,
        "h",
        "gourmand",
        10
      ],
      [
        "ethyl linalool",
        25,
        "h",
        "floral",
        100
      ],
      [
        "citral dimethyl acetal",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "cis-jasmone",
        5,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        20,
        "b",
        "musk",
        50
      ],
      [
        "phenoxanol",
        3,
        "h",
        "floral",
        100
      ],
      [
        "para-cresyl isobutyrate 1%",
        2,
        "h",
        "floral",
        1
      ],
      [
        "DIPG",
        130,
        "b",
        "aquatic",
        0
      ],
      [
        "6-methoxy-2,6-dimethyl octanal",
        10,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-072",
    "te": "Floral fragrance composition (Patent 7,790,668)",
    "tr": "Цветочный аромат композиция (Патент 7,790,668)",
    "sd": "TGSC (dm1015272) · Patent 7,790,668",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,790,668 2-methoxy-2,6-dimethyloctanal and its use as a fragrance ingredient.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный аромат композиция (Патент 7,790,668)». Формула из патента 7,790,668. Ключевые материалы структуры: hedione, cepionate, DIPG, linalool.",
    "pr": {
      "floral": 50,
      "green": 3,
      "citrus": 2,
      "musk": 2,
      "gourmand": 1
    },
    "it": [
      [
        "linalool",
        30,
        "h",
        "floral",
        100
      ],
      [
        "mayol",
        25,
        "h",
        "floral",
        100
      ],
      [
        "dihydro-beta-ionone",
        8,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        8,
        "h",
        "floral",
        100
      ],
      [
        "cepionate",
        250,
        "h",
        "floral",
        100
      ],
      [
        "cyclohexal",
        20,
        "h",
        "floral",
        100
      ],
      [
        "dihydrofarnesal",
        20,
        "h",
        "floral",
        100
      ],
      [
        "farnesol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl benzoate",
        25,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        25,
        "t",
        "green",
        100
      ],
      [
        "hydroxycitronellal",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "dimetol",
        8,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        300,
        "h",
        "floral",
        100
      ],
      [
        "musk ketone",
        4,
        "b",
        "musk",
        100
      ],
      [
        "cassis base 345 B",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "indolene 10%",
        12,
        "h",
        "floral",
        10
      ],
      [
        "allyl amyl glycolate 10%",
        2,
        "h",
        "gourmand",
        10
      ],
      [
        "raspberry ketone 10%",
        5,
        "h",
        "gourmand",
        10
      ],
      [
        "alpha-damascone 10%",
        8,
        "h",
        "gourmand",
        10
      ],
      [
        "ethyl linalool",
        25,
        "h",
        "floral",
        100
      ],
      [
        "citral dimethyl acetal",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "cis-jasmone",
        5,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        20,
        "b",
        "musk",
        50
      ],
      [
        "phenoxanol",
        3,
        "h",
        "floral",
        100
      ],
      [
        "para-cresyl isobutyrate 1%",
        2,
        "h",
        "floral",
        1
      ],
      [
        "DIPG",
        130,
        "b",
        "aquatic",
        0
      ],
      [
        "6-methoxy-2,6-dimethyl octanal",
        10,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-073",
    "te": "Floral fruity (Patent 7,820,616)",
    "tr": "Цветочный фруктовый (Патент 7,820,616)",
    "sd": "TGSC (dm1015272) · Patent 7,820,616",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,820,616 Cyclic acetal compounds and their use in perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный фруктовый (Патент 7,820,616)». Формула из патента 7,820,616. Ключевые материалы структуры: lyral, hedione, kharismal, lilial.",
    "pr": {
      "citrus": 4,
      "gourmand": 3,
      "musk": 3,
      "aquatic": 1,
      "floral": 50,
      "green": 1,
      "woody": 3
    },
    "it": [
      [
        "aldehyde C-10",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-9",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "allyl amyl glycolate",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "ambrettolide",
        10,
        "b",
        "musk",
        100
      ],
      [
        "ambroxan",
        1,
        "b",
        "amber",
        100
      ],
      [
        "calone 10%",
        15,
        "h",
        "aquatic",
        10
      ],
      [
        "cashmeran",
        2,
        "b",
        "musk",
        100
      ],
      [
        "citronellol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cyclacet",
        50,
        "h",
        "floral",
        100
      ],
      [
        "diola",
        10,
        "h",
        "floral",
        100
      ],
      [
        "dipropylene glycol",
        79,
        "h",
        "floral",
        100
      ],
      [
        "ethyl acetoacetate",
        3,
        "h",
        "floral",
        100
      ],
      [
        "floriffol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "1,4-diethyl-6,8-dioxabicyclo(3.2.1)octane",
        20,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 100%",
        30,
        "b",
        "musk",
        100
      ],
      [
        "cyclogalbaniff 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        5,
        "t",
        "green",
        100
      ],
      [
        "hexyl salicylate",
        10,
        "t",
        "green",
        100
      ],
      [
        "hydroxycitronellal",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "indole 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "iso e super",
        50,
        "b",
        "woody",
        100
      ],
      [
        "jasmal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "kharismal",
        100,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        100,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        10,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        200,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "orange oil florida",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "rosalva",
        20,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        3,
        "h",
        "floral",
        100
      ],
      [
        "verdox",
        50,
        "h",
        "gourmand",
        100
      ],
      [
        "zenolide",
        10,
        "h",
        "floral",
        100
      ],
      [
        "zestoril 1%",
        1,
        "h",
        "floral",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-074",
    "te": "Floral fruity (Patent 7,820,616)",
    "tr": "Цветочный фруктовый (Патент 7,820,616)",
    "sd": "TGSC (dm1015272) · Patent 7,820,616",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,820,616 Cyclic acetal compounds and their use in perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный фруктовый (Патент 7,820,616)». Формула из патента 7,820,616. Ключевые материалы структуры: lyral, hedione, kharismal, lilial.",
    "pr": {
      "citrus": 4,
      "gourmand": 3,
      "musk": 3,
      "aquatic": 1,
      "floral": 50,
      "green": 1,
      "woody": 3
    },
    "it": [
      [
        "aldehyde C-10",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-9",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "allyl amyl glycolate",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "ambrettolide",
        10,
        "b",
        "musk",
        100
      ],
      [
        "ambroxan",
        1,
        "b",
        "amber",
        100
      ],
      [
        "calone 10%",
        15,
        "h",
        "aquatic",
        10
      ],
      [
        "cashmeran",
        2,
        "b",
        "musk",
        100
      ],
      [
        "citronellol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cyclacet",
        50,
        "h",
        "floral",
        100
      ],
      [
        "diola",
        10,
        "h",
        "floral",
        100
      ],
      [
        "dipropylene glycol",
        79,
        "h",
        "floral",
        100
      ],
      [
        "ethyl acetoacetate",
        3,
        "h",
        "floral",
        100
      ],
      [
        "floriffol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "1,4-diethyl-6,8-dioxabicyclo(3.2.1)octane",
        20,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 100%",
        30,
        "b",
        "musk",
        100
      ],
      [
        "cyclogalbaniff 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        5,
        "t",
        "green",
        100
      ],
      [
        "hexyl salicylate",
        10,
        "t",
        "green",
        100
      ],
      [
        "hydroxycitronellal",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "indole 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "iso e super",
        50,
        "b",
        "woody",
        100
      ],
      [
        "jasmal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "kharismal",
        100,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        100,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        10,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        200,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "orange oil florida",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "rosalva",
        20,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        3,
        "h",
        "floral",
        100
      ],
      [
        "verdox",
        50,
        "h",
        "gourmand",
        100
      ],
      [
        "zenolide",
        10,
        "h",
        "floral",
        100
      ],
      [
        "zestoril 1%",
        1,
        "h",
        "floral",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-075",
    "te": "floral fruity fragrance",
    "tr": "Цветочный фруктовый аромат",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, phenethyl alcohol, cyclamen aldehyde, bourgeonal.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный фруктовый аромат». Ключевые материалы структуры: phenethyl alcohol, DIPG, centifolyl, phenethyl salicylate.",
    "pr": {
      "floral": 50,
      "citrus": 1,
      "spicy": 2,
      "amber": 1,
      "green": 19
    },
    "it": [
      [
        "benzyl acetate",
        15.56,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        222.22,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        3.33,
        "t",
        "citrus",
        100
      ],
      [
        "bourgeonal",
        3.33,
        "h",
        "floral",
        100
      ],
      [
        "centifolyl",
        88.89,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl cinnamate",
        27.78,
        "h",
        "spicy",
        100
      ],
      [
        "citronellol",
        27.78,
        "h",
        "floral",
        100
      ],
      [
        "2-phenyl propionaldehyde dimethyl acetal",
        8.89,
        "t",
        "citrus",
        100
      ],
      [
        "musk indenofuran 10%",
        3.33,
        "b",
        "musk",
        10
      ],
      [
        "gardenol",
        5.56,
        "h",
        "floral",
        100
      ],
      [
        "oxyoctaline formate",
        2.22,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        77.78,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        4.44,
        "b",
        "amber",
        100
      ],
      [
        "indolene",
        1.11,
        "h",
        "floral",
        100
      ],
      [
        "isoraldeine 70",
        27.78,
        "h",
        "floral",
        100
      ],
      [
        "methyl diantilis",
        27.78,
        "h",
        "floral",
        100
      ],
      [
        "neroline",
        1.11,
        "t",
        "citrus",
        100
      ],
      [
        "patchouli oil",
        2.22,
        "b",
        "woody",
        100
      ],
      [
        "peche pure",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "pharaone 10% 1% DIPG",
        8.89,
        "h",
        "floral",
        10
      ],
      [
        "pomarose 10%",
        3.33,
        "h",
        "floral",
        10
      ],
      [
        "rose oxide",
        7.78,
        "h",
        "floral",
        100
      ],
      [
        "cyclohexyl salicylate",
        50,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        61.11,
        "t",
        "green",
        100
      ],
      [
        "hexyl salicylate",
        22.22,
        "t",
        "green",
        100
      ],
      [
        "phenethyl salicylate",
        88.89,
        "t",
        "green",
        100
      ],
      [
        "vanillin",
        5.56,
        "b",
        "amber",
        100
      ],
      [
        "viridine",
        3.33,
        "h",
        "floral",
        100
      ],
      [
        "ylang ylang oil",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        142.22,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-076",
    "te": "Floral fruity green female fragrance",
    "tr": "Цветочно-фруктовый зелёный женский аромат",
    "sd": "TGSC (dm1015272) · Patent 6,723,313",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,723,313 2-,5-,6-,7-,8-substituted oct-2-en-4-ones.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочно-фруктовый зелёный женский аромат». Формула из патента 6,723,313. Ключевые материалы структуры: galaxolide 50 IPM, hedione, DIPG, lilial.",
    "pr": {
      "floral": 50,
      "citrus": 11,
      "aquatic": 2,
      "musk": 13,
      "green": 3,
      "woody": 7
    },
    "it": [
      [
        "adoxal",
        3,
        "h",
        "floral",
        100
      ],
      [
        "ambrofix 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "benzyl acetate",
        6,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "calone 1951",
        4,
        "h",
        "aquatic",
        100
      ],
      [
        "cedryl methyl ether",
        5,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        35,
        "h",
        "floral",
        100
      ],
      [
        "dimetol",
        2,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        94,
        "b",
        "aquatic",
        0
      ],
      [
        "estragol",
        1,
        "h",
        "floral",
        100
      ],
      [
        "ethyl linalool",
        35,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-16",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "eugenol",
        3,
        "h",
        "spicy",
        100
      ],
      [
        "floralozone 10%",
        4,
        "h",
        "aquatic",
        10
      ],
      [
        "floropal",
        3,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        140,
        "b",
        "musk",
        50
      ],
      [
        "gardenol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        120,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        17,
        "t",
        "green",
        10
      ],
      [
        "cis-3-hexenyl salicylate",
        9,
        "t",
        "green",
        100
      ],
      [
        "iso e super",
        60,
        "b",
        "woody",
        100
      ],
      [
        "isoraldeine 70",
        35,
        "h",
        "floral",
        100
      ],
      [
        "lavender oil",
        7,
        "t",
        "green",
        100
      ],
      [
        "lilial",
        90,
        "h",
        "floral",
        100
      ],
      [
        "melonal 10%",
        12,
        "h",
        "aquatic",
        10
      ],
      [
        "canthoxal",
        6,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        9,
        "h",
        "floral",
        100
      ],
      [
        "sandalore",
        15,
        "b",
        "woody",
        100
      ],
      [
        "tagete oil",
        3,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "tropional",
        48,
        "h",
        "floral",
        100
      ],
      [
        "viridine",
        1,
        "h",
        "floral",
        100
      ],
      [
        "ylang ylang oil",
        2,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil italy",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "pomarose 10%",
        50,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-077",
    "te": "Accord N° 208096 Floral fruity green musk (Firmenich)",
    "tr": "Аккорд №208096 · цветочный фруктовый зелёный мускусный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Detergent powder: 0.20% ; Fabric Softner: 0.30% ; Shampoo: 0.50% ; Soap: 1.00% · GALBANOLENE SUPER adds a natural green-floral note to this accord. It blends with Isopentyrate to give freshness and character..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208096 · цветочный фруктовый зелёный мускусный (Firmenich)». Ключевые материалы структуры: TETRAHYDROLINALOL, CITRONELLOL, CYCLOMETHYLENE CITRONELLOL, HEDIONE® (Firmenich).",
    "pr": {
      "green": 4,
      "floral": 50,
      "musk": 4
    },
    "it": [
      [
        "CIS-3-HEXENYL SALICYLATE",
        20,
        "t",
        "green",
        100
      ],
      [
        "CITRONELLOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "CYCLOMETHYLENE CITRONELLOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "CYCLOPIDENE (Firmenich) 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        25,
        "h",
        "floral",
        100
      ],
      [
        "FLOROL® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        70,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        50,
        "t",
        "green",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "ISOPENTYRATE (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "TETRAHYDROLINALOL",
        150,
        "h",
        "floral",
        100
      ],
      [
        "VELOUTONE (Firmenich)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "GALBANOLENE SUPER (Firmenich) 10%",
        15,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-078",
    "te": "floral fruity type",
    "tr": "Цветочный фруктовый (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring allyl caproate, Levocitrile, cyclaprop, alpha-damascone.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный фруктовый (тип)». Ключевые материалы структуры: hedione, tetrahydrolinalool, DIPG, alpha-hexyl cinnamaldehyde.",
    "pr": {
      "gourmand": 20,
      "floral": 50,
      "citrus": 18,
      "green": 8
    },
    "it": [
      [
        "allyl caproate",
        17.5,
        "h",
        "gourmand",
        100
      ],
      [
        "Levocitrile",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "cyclaprop",
        37.5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone",
        15,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        12.5,
        "h",
        "gourmand",
        100
      ],
      [
        "aldehyde C-16",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "eugenol",
        2.5,
        "h",
        "spicy",
        100
      ],
      [
        "fruitate",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        125,
        "h",
        "floral",
        100
      ],
      [
        "heliobouquet",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        2.5,
        "t",
        "green",
        100
      ],
      [
        "hexyl acetate",
        37.5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        87.5,
        "t",
        "citrus",
        100
      ],
      [
        "hexyl salicylate",
        62.5,
        "t",
        "green",
        100
      ],
      [
        "hindinol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cis-jasmone",
        1.25,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        12.5,
        "t",
        "citrus",
        100
      ],
      [
        "orange oil",
        62.5,
        "t",
        "citrus",
        100
      ],
      [
        "aurantiol 1%",
        7.5,
        "h",
        "floral",
        1
      ],
      [
        "orbitone",
        25,
        "h",
        "floral",
        100
      ],
      [
        "peonile",
        17.5,
        "h",
        "floral",
        100
      ],
      [
        "phenoxanol",
        25,
        "h",
        "floral",
        100
      ],
      [
        "raspberry ketone",
        45,
        "h",
        "gourmand",
        100
      ],
      [
        "rholiate 1%",
        5,
        "h",
        "floral",
        1
      ],
      [
        "tetrahydrolinalool",
        125,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        5,
        "t",
        "green",
        100
      ],
      [
        "gamma-undecalactone",
        25,
        "h",
        "gourmand",
        100
      ],
      [
        "verdox",
        75,
        "h",
        "gourmand",
        100
      ],
      [
        "yara yara",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        98.75,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-079",
    "te": "floral fruity violet type",
    "tr": "Цветочный фруктовый фиалка (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, cinnamyl acetate, citronellyl acetate, geranyl acetate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный фруктовый фиалка (тип)». Ключевые материалы структуры: galaxolide 50 IPM, hedione, habanolide, lilial.",
    "pr": {
      "floral": 50,
      "spicy": 2,
      "green": 2,
      "citrus": 2,
      "musk": 41,
      "amber": 1,
      "woody": 1
    },
    "it": [
      [
        "benzyl acetate",
        7.06,
        "h",
        "floral",
        100
      ],
      [
        "cinnamyl acetate",
        3.53,
        "h",
        "spicy",
        100
      ],
      [
        "citronellyl acetate",
        3.53,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        3.53,
        "h",
        "floral",
        100
      ],
      [
        "para-cresyl acetate 1%",
        9.41,
        "h",
        "floral",
        1
      ],
      [
        "phenethyl acetate",
        14.12,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        2.35,
        "t",
        "green",
        10
      ],
      [
        "hexyl acetate",
        3.53,
        "h",
        "floral",
        100
      ],
      [
        "cinnamic alcohol",
        2.35,
        "h",
        "spicy",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        11.76,
        "t",
        "citrus",
        100
      ],
      [
        "isoambrettolide",
        7.06,
        "b",
        "musk",
        100
      ],
      [
        "anethol",
        1.18,
        "h",
        "spicy",
        100
      ],
      [
        "benzyl benzoate",
        5.88,
        "h",
        "floral",
        100
      ],
      [
        "methyl benzoate",
        1.18,
        "h",
        "floral",
        100
      ],
      [
        "muguet carbinol",
        5.88,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        11.76,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        2.35,
        "b",
        "amber",
        100
      ],
      [
        "cyclamen aldehyde",
        3.53,
        "t",
        "citrus",
        100
      ],
      [
        "estragol 10%",
        4.71,
        "h",
        "floral",
        10
      ],
      [
        "eugenol",
        4.71,
        "h",
        "spicy",
        100
      ],
      [
        "exaltolide",
        23.53,
        "b",
        "musk",
        100
      ],
      [
        "florol",
        23.53,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl formate 10%",
        3.53,
        "h",
        "floral",
        10
      ],
      [
        "galaxolide 50 IPM",
        235.29,
        "b",
        "musk",
        50
      ],
      [
        "geraniol",
        5.88,
        "h",
        "floral",
        100
      ],
      [
        "habanolide",
        94.12,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        176.47,
        "h",
        "floral",
        100
      ],
      [
        "helvetolide",
        23.53,
        "b",
        "musk",
        100
      ],
      [
        "dupical 10%",
        5.88,
        "h",
        "floral",
        10
      ],
      [
        "iralia total",
        4.71,
        "h",
        "floral",
        100
      ],
      [
        "methyl jasmonate",
        3.53,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        70.59,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        58.82,
        "h",
        "floral",
        100
      ],
      [
        "methyl isoeugenol",
        4.71,
        "h",
        "spicy",
        100
      ],
      [
        "oranger crystals 10%",
        3.53,
        "t",
        "citrus",
        10
      ],
      [
        "para-methyl anisole 10%",
        2.35,
        "h",
        "spicy",
        10
      ],
      [
        "muscenone delta",
        23.53,
        "b",
        "musk",
        100
      ],
      [
        "muscone",
        5.88,
        "b",
        "musk",
        100
      ],
      [
        "santol pentenol",
        2.35,
        "h",
        "floral",
        100
      ],
      [
        "gamma-nonalactone 10%",
        1.18,
        "h",
        "gourmand",
        10
      ],
      [
        "cis-3-hexenol 10%",
        2.35,
        "t",
        "green",
        10
      ],
      [
        "benzyl propionate 10%",
        7.06,
        "h",
        "floral",
        10
      ],
      [
        "rose oil bulgaria",
        5.88,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        18.82,
        "t",
        "green",
        100
      ],
      [
        "sclareolate",
        5.88,
        "h",
        "floral",
        100
      ],
      [
        "tonalid",
        58.82,
        "h",
        "floral",
        100
      ],
      [
        "2,4-ivy carbaldehyde 10%",
        2.35,
        "t",
        "citrus",
        10
      ],
      [
        "vanillin",
        4.71,
        "b",
        "amber",
        100
      ],
      [
        "vertofix",
        11.76,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-080",
    "te": "Accord N° 208700 Floral green (Firmenich)",
    "tr": "Аккорд №208700 · цветочный зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Softner: 0.20% · A small amount of JACINTHEME 135 SA can have a big effect. In this rich floral accord it gives an immediate impact of a diffusive fresh green note..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208700 · цветочный зелёный (Firmenich)». Ключевые материалы структуры: LIMONENE, HEDIONE® (Firmenich), HEXYLCINNAMIC ALDEHYDE, EXALTOLIDE® TOTAL (Firmenich).",
    "pr": {
      "citrus": 50,
      "musk": 10,
      "floral": 23
    },
    "it": [
      [
        "ALDEHYDE CITRON 66019 (Firmenich)",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "EXALTOLIDE® TOTAL (Firmenich)",
        100,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        220,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        220,
        "t",
        "citrus",
        100
      ],
      [
        "LIMONENE",
        330,
        "t",
        "citrus",
        100
      ],
      [
        "MUSCENONE™ (Firmenich)",
        20,
        "b",
        "musk",
        100
      ],
      [
        "MYROXYDE® (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "JACINTHEME 135 SA (Firmenich)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        20,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-081",
    "te": "Accord N° 207872 Floral green (Firmenich)",
    "tr": "Аккорд №207872 · цветочный зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Detergent powder: 0.15% ; Shampoo: 0.50% ; Soap: 1.00%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207872 · цветочный зелёный (Firmenich)». Ключевые материалы структуры: BENZYL SALICYLATE, ROSE BASE, HEXYLCINNAMIC ALDEHYDE, BENZYL ACETATE.",
    "pr": {
      "floral": 50,
      "green": 15,
      "gourmand": 1,
      "musk": 4,
      "citrus": 10
    },
    "it": [
      [
        "BENZYL ACETATE",
        124,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        185,
        "t",
        "green",
        100
      ],
      [
        "DAMASCONE ALPHA (Firmenich) 10%",
        4,
        "h",
        "gourmand",
        10
      ],
      [
        "GALBEX® 183 (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        50,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        75,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        125,
        "t",
        "citrus",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "ROSE BASE",
        185,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE",
        12,
        "h",
        "gourmand",
        100
      ],
      [
        "THIOXAN BASE 38375 D (Firmenich) 10%",
        40,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-082",
    "te": "Accord N° 203435 Floral green (Firmenich)",
    "tr": "Аккорд №203435 · цветочный зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Detergent powder: 0.20% · In this accord the Aldehyde Supra gives a freshness in the fruity citrus direction, and boosts the Galbanum character. The overall effect is powerful, fresh and clean..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №203435 · цветочный зелёный (Firmenich)». Ключевые материалы структуры: HEXYLCINNAMIC ALDEHYDE, HABANOLIDE® (Firmenich), HEDIONE® (Firmenich), TRICYCLODECENYL ACETATE.",
    "pr": {
      "green": 10,
      "amber": 1,
      "gourmand": 4,
      "floral": 50,
      "musk": 13,
      "citrus": 22
    },
    "it": [
      [
        "BENZYL SALICYLATE",
        60,
        "t",
        "green",
        100
      ],
      [
        "CIS-3-HEXENYL ACETATE 10%",
        15,
        "t",
        "green",
        10
      ],
      [
        "COUMARIN",
        10,
        "b",
        "amber",
        100
      ],
      [
        "DAMASCONE ALPHA (Firmenich) 10%",
        15,
        "h",
        "gourmand",
        10
      ],
      [
        "DELPHONE (Firmenich) 10%",
        20,
        "h",
        "floral",
        10
      ],
      [
        "DYNASCONE® (Firmenich) 1%",
        20,
        "h",
        "floral",
        1
      ],
      [
        "FLOROL® (Firmenich)",
        15,
        "h",
        "floral",
        100
      ],
      [
        "GERANIOL",
        30,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        100,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        25,
        "t",
        "green",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        150,
        "t",
        "citrus",
        100
      ],
      [
        "LINALOL",
        25,
        "h",
        "floral",
        100
      ],
      [
        "LORYSIA® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "MUSCENONE™ (Firmenich) 10%",
        30,
        "b",
        "musk",
        10
      ],
      [
        "NONALACTONE GAMMA 10%",
        15,
        "h",
        "gourmand",
        10
      ],
      [
        "ORANGE BRAZIL",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "PARMANTHEME K (Firmenich) 1%",
        10,
        "h",
        "floral",
        1
      ],
      [
        "PHENYLACETALDEHYDE DIMETHYLACETAL",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        20,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLHEXANOL (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "SCENTENAL® (Firmenich)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "TRICHLOROMETHYL PHENYL CARBINYL ACETATE",
        10,
        "h",
        "floral",
        100
      ],
      [
        "TRICYCLODECENYL ACETATE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "UNDECALACTONE GAMMA",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "ALDEHYDE SUPRA (Firmenich) 10%",
        10,
        "t",
        "citrus",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-083",
    "te": "Accord N° 207998 Floral green (Firmenich)",
    "tr": "Аккорд №207998 · цветочный зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Shower gel: 1.00% · DYNASCONE 10 harmonizes well with the green and mossy notes to give a diffusive effect to this floral green accord..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207998 · цветочный зелёный (Firmenich)». Ключевые материалы структуры: FLOROL® (Firmenich), LINALOL, HEDIONE® (Firmenich), HEXYLCINNAMIC ALDEHYDE.",
    "pr": {
      "floral": 50,
      "citrus": 15,
      "green": 6,
      "spicy": 2,
      "woody": 3
    },
    "it": [
      [
        "BENZYL ACETATE",
        45,
        "h",
        "floral",
        100
      ],
      [
        "BERGAMOT SYNTH",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "CIS-3-HEXENOL 10%",
        30,
        "t",
        "green",
        10
      ],
      [
        "CITRONELLOL",
        60,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLYL ACETATE",
        30,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        45,
        "t",
        "citrus",
        100
      ],
      [
        "EUGENOL",
        30,
        "h",
        "spicy",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        45,
        "h",
        "floral",
        100
      ],
      [
        "FLOROL® (Firmenich)",
        185,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        90,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        45,
        "t",
        "green",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        90,
        "t",
        "citrus",
        100
      ],
      [
        "LINALOL",
        130,
        "h",
        "floral",
        100
      ],
      [
        "OAKMOSS SYNTH 10%",
        45,
        "b",
        "woody",
        10
      ],
      [
        "PHENYLACETALDEHYDE DIMETHYLACETAL 10%",
        45,
        "t",
        "citrus",
        10
      ],
      [
        "PHENYLETHYL ALCOHOL",
        60,
        "h",
        "floral",
        100
      ],
      [
        "TAMARINE BASE 41310 G (Firmenich)",
        5,
        "h",
        "aquatic",
        100
      ],
      [
        "DYNASCONE® 10 (Firmenich)",
        5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-084",
    "te": "Accord N° 208001 Floral green citrus (Firmenich)",
    "tr": "Аккорд №208001 · цветочный зелёный цитрусовый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Detergent powder: 0.20% ; Soap: 1.00% ; Softner: 0.30% · The citrus fruity character of CITROASIS BASE 129022 gives a clean, fresh and lively effect to this floral accord..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208001 · цветочный зелёный цитрусовый (Firmenich)». Ключевые материалы структуры: HEXYL SALICYLATE, HEDIONE® (Firmenich), IRALIA® TOTAL (Firmenich), LILIAL® (Givaudan).",
    "pr": {
      "spicy": 3,
      "floral": 50,
      "musk": 4,
      "green": 21,
      "woody": 4,
      "gourmand": 2
    },
    "it": [
      [
        "EUGENOL",
        30,
        "h",
        "spicy",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "FLOROL® (Firmenich)",
        70,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        50,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        150,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        250,
        "t",
        "green",
        100
      ],
      [
        "INTRELEVEN ALDEHYDE (IFF) 10%",
        5,
        "t",
        "citrus",
        10
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        130,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER® (IFF)",
        50,
        "b",
        "woody",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "CITROASIS BASE 129022 (Firmenich)",
        25,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-085",
    "te": "Accord N° 208035 Floral green citrus bergamot (Firmenich)",
    "tr": "Аккорд №208035 · цветочный зелёный цитрусовый бергамот (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Detergent powder: 0.20% ; Shampoo: 0.50% · CYCLOMETHYLENE CITRONELLOL develops the fresh green floral note of the accord through a bergamot-like effect..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208035 · цветочный зелёный цитрусовый бергамот (Firmenich)». Ключевые материалы структуры: DIHYDROMYRCENOL, HEDIONE® (Firmenich), CITRON 171 (Firmenich), LINALOL.",
    "pr": {
      "gourmand": 3,
      "floral": 50,
      "amber": 3,
      "citrus": 25,
      "musk": 8,
      "woody": 6
    },
    "it": [
      [
        "ALLYL AMYL GLYCOLATE",
        15,
        "h",
        "gourmand",
        100
      ],
      [
        "BENZYL ACETATE",
        20,
        "h",
        "floral",
        100
      ],
      [
        "CETALOX® (Firmenich) 10%",
        5,
        "b",
        "amber",
        10
      ],
      [
        "CITRON 171 (Firmenich)",
        80,
        "h",
        "floral",
        100
      ],
      [
        "CYCLAMEN ALDEHYDE",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "DAMASCONE ALPHA (Firmenich) 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "DIHYDROMYRCENOL",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "EXALTOLIDE® TOTAL (Firmenich)",
        70,
        "b",
        "musk",
        100
      ],
      [
        "GALBEX® 183 (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        140,
        "h",
        "floral",
        100
      ],
      [
        "HELIOTROPIN",
        30,
        "b",
        "amber",
        100
      ],
      [
        "LINALOL",
        80,
        "h",
        "floral",
        100
      ],
      [
        "MUSCENONE™ (Firmenich) 10%",
        10,
        "b",
        "musk",
        10
      ],
      [
        "OAKMOSS SYNTH",
        5,
        "b",
        "woody",
        100
      ],
      [
        "ORANGE OIL",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "TERPENYL ACETATE",
        80,
        "h",
        "floral",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        60,
        "b",
        "woody",
        100
      ],
      [
        "CYCLOMETHYLENE CITRONELLOL",
        50,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-086",
    "te": "Accord N° 208694 Floral green musk (Firmenich)",
    "tr": "Аккорд №208694 · цветочный зелёный мускусный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Soap: 1.00% · The addition of BUTYLCINNAMIC ALDEHYDE to this cosmetic accord makes it more floral, softer and harmonizes the green and fruity notes..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208694 · цветочный зелёный мускусный (Firmenich)». Ключевые материалы структуры: HABANOLIDE® (Firmenich) 50%, BENZYL SALICYLATE, HEDIONE® (Firmenich), LILIAL® (Givaudan).",
    "pr": {
      "gourmand": 8,
      "green": 30,
      "floral": 50,
      "citrus": 18,
      "musk": 29,
      "amber": 1
    },
    "it": [
      [
        "ALLYL AMYL GLYCOLATE 10%",
        20,
        "h",
        "gourmand",
        10
      ],
      [
        "BENZYL SALICYLATE",
        160,
        "t",
        "green",
        100
      ],
      [
        "CIS-3-HEXENYL SALICYLATE",
        60,
        "t",
        "green",
        100
      ],
      [
        "CITRONELLOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLYL ACETATE",
        25,
        "h",
        "floral",
        100
      ],
      [
        "DAMAROSE ALPHA (Firmenich) 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "DAMASCONE BETA (Firmenich) 10%",
        5,
        "h",
        "gourmand",
        10
      ],
      [
        "DIHYDROMYRCENOL",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "HABANOLIDE® (Firmenich) 50%",
        185,
        "b",
        "musk",
        50
      ],
      [
        "HEDIONE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HELIOTROPIN",
        5,
        "b",
        "amber",
        100
      ],
      [
        "INDOL 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "IONONE BETA",
        35,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        90,
        "h",
        "floral",
        100
      ],
      [
        "LINALYL ACETATE",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "LYRAL® (IFF)",
        25,
        "h",
        "floral",
        100
      ],
      [
        "MENTHOL",
        10,
        "h",
        "floral",
        100
      ],
      [
        "MUSCENONE™ (Firmenich) 10%",
        30,
        "b",
        "musk",
        10
      ],
      [
        "PARMANTHEME K 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "STYRALLYL ACETATE",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "UNDECALACTONE GAMMA 10%",
        15,
        "h",
        "gourmand",
        10
      ],
      [
        "BUTYLCINNAMIC ALDEHYDE (Firmenich)",
        80,
        "t",
        "citrus",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-087",
    "te": "floral green type",
    "tr": "Цветочный зелёный (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, geranyl acetate, neryl acetate, prenyl acetate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный зелёный (тип)». Ключевые материалы структуры: linalool, hedione, habanolide, alpha-hexyl cinnamaldehyde.",
    "pr": {
      "floral": 50,
      "gourmand": 7,
      "green": 7,
      "citrus": 9,
      "amber": 1,
      "musk": 16,
      "woody": 2
    },
    "it": [
      [
        "benzyl acetate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "neryl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "prenyl acetate",
        2,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        4,
        "h",
        "gourmand",
        100
      ],
      [
        "hexyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl 2-methyl butyrate",
        4,
        "t",
        "green",
        100
      ],
      [
        "aldehyde C-11 undecylenic 10%",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "allyl amyl glycolate",
        4,
        "h",
        "gourmand",
        100
      ],
      [
        "manzanate",
        8,
        "h",
        "gourmand",
        100
      ],
      [
        "cetalox",
        10,
        "b",
        "amber",
        100
      ],
      [
        "cis-3-hexenol 10%",
        10,
        "t",
        "green",
        10
      ],
      [
        "coranol",
        24,
        "h",
        "floral",
        100
      ],
      [
        "galbanum oxyacetate",
        12,
        "t",
        "green",
        100
      ],
      [
        "damascenone 10%",
        8,
        "h",
        "floral",
        10
      ],
      [
        "alpha-damascone",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "beta-damascone 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "ethyl 2-methyl butyrate 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "florol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "gamma-decalactone",
        16,
        "h",
        "gourmand",
        100
      ],
      [
        "habanolide",
        90,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "helvetolide",
        10,
        "b",
        "musk",
        100
      ],
      [
        "iso e super",
        20,
        "b",
        "woody",
        100
      ],
      [
        "jasminlactone",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "linalool",
        160,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        40,
        "h",
        "floral",
        100
      ],
      [
        "oakmoss oil",
        4,
        "b",
        "woody",
        100
      ],
      [
        "muscenone delta",
        10,
        "b",
        "musk",
        100
      ],
      [
        "neobutenone alpha 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "phenylhexanol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "romandolide",
        60,
        "b",
        "musk",
        100
      ],
      [
        "benzyl salicylate",
        30,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        20,
        "t",
        "green",
        100
      ],
      [
        "alpha-terpineol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "2,4-ivy carbaldehyde",
        6,
        "t",
        "citrus",
        100
      ],
      [
        "gamma-undecalactone",
        4,
        "h",
        "gourmand",
        100
      ],
      [
        "verdox",
        10,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-088",
    "te": "Floral green woody fruity accord",
    "tr": "Цветочный зелёный древесный фруктовый Аккорд",
    "sd": "TGSC (dm1015272) · Patent 6,177,400",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,177,400 Unsaturated ketones and their use in perfumery.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный зелёный древесный фруктовый Аккорд». Формула из патента 6,177,400. Ключевые материалы структуры: lily of the valley base, synthetic, hedione, habanolide, bergamote base, synthetic.",
    "pr": {
      "floral": 50,
      "gourmand": 1,
      "green": 4,
      "musk": 13,
      "woody": 3,
      "citrus": 10
    },
    "it": [
      [
        "benzyl acetate",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        11.11,
        "h",
        "gourmand",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        27.78,
        "t",
        "green",
        10
      ],
      [
        "gamma-decalactone",
        2.22,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydroeugenol",
        5.56,
        "h",
        "spicy",
        100
      ],
      [
        "galbex",
        5.56,
        "h",
        "floral",
        100
      ],
      [
        "habanolide",
        144.44,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        166.67,
        "h",
        "floral",
        100
      ],
      [
        "iralia",
        50,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        38.89,
        "b",
        "woody",
        100
      ],
      [
        "isopentyrate",
        3.33,
        "h",
        "floral",
        100
      ],
      [
        "lavandin oil",
        16.67,
        "t",
        "green",
        100
      ],
      [
        "liffarome 10%",
        5.56,
        "h",
        "floral",
        10
      ],
      [
        "trifernal 10%",
        5.56,
        "h",
        "floral",
        10
      ],
      [
        "aldehyde C-14",
        5.56,
        "t",
        "citrus",
        100
      ],
      [
        "bergamote base, synthetic",
        111.11,
        "t",
        "citrus",
        100
      ],
      [
        "lily of the valley base, synthetic",
        194.44,
        "h",
        "floral",
        100
      ],
      [
        "wardia",
        100,
        "h",
        "floral",
        100
      ],
      [
        "vert de lilas",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "ylang ylang oil",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        61.11,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-089",
    "te": "Accord N° 208061 Floral green woody musk (Firmenich)",
    "tr": "Аккорд №208061 · цветочный зелёный древесный мускусный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · PALISANDROL 17979 exalts the warmth and richness of the exotic woody notes and reinforces the sensuality of the orris aspects, while adding volume and diffusion to this very feminine and modern accord..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208061 · цветочный зелёный древесный мускусный (Firmenich)». Ключевые материалы структуры: HEDIONE® (Firmenich), EXOLIDE® (Firmenich) (use exolide replacer), LYRAL® (IFF), IRALIA® TOTAL (Firmenich).",
    "pr": {
      "citrus": 3,
      "floral": 50,
      "green": 1,
      "woody": 2,
      "gourmand": 1,
      "amber": 1
    },
    "it": [
      [
        "BERGAMOT SYNTH",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "CITRON 171 (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        120,
        "h",
        "floral",
        100
      ],
      [
        "GALBANUM TOTAL",
        5,
        "t",
        "green",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        270,
        "h",
        "floral",
        100
      ],
      [
        "IONONE BETA",
        30,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        80,
        "h",
        "floral",
        100
      ],
      [
        "IRIS ABS SYNTH",
        20,
        "h",
        "floral",
        100
      ],
      [
        "LYRAL® (IFF)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "METHYL OCTINE CARBONATE 1%",
        10,
        "t",
        "green",
        1
      ],
      [
        "OAKMOSS SYNTH 10%",
        30,
        "b",
        "woody",
        10
      ],
      [
        "PHENYLETHYL ALCOHOL",
        70,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "VANILLIN 10%",
        10,
        "b",
        "amber",
        10
      ],
      [
        "VETYVERYL ACETATE",
        35,
        "h",
        "floral",
        100
      ],
      [
        "WARDIA® (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "YLANG OIL EXTRA",
        30,
        "h",
        "floral",
        100
      ],
      [
        "PALISANDROL 17979 (Firmenich)",
        30,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-090",
    "te": "Floral hesperidic note",
    "tr": "Цветочный гесперидный (цитрусовый) нота",
    "sd": "TGSC (dm1015272) · Patent 6,242,413",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,242,413 Bicyclic aldehyde and ketone odorants.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный гесперидный (цитрусовый) нота». Формула из патента 6,242,413. Ключевые материалы структуры: (r-9',c-10')-1-{9',10'-Dimethylbicyclo[6.4.0]dodec-1'(8')-en-10'-yl}ethan-1-one, cedarwood oil brown virginia, cepionate, DIPG.",
    "pr": {
      "green": 1,
      "citrus": 8,
      "spicy": 1,
      "woody": 13,
      "floral": 50,
      "amber": 1,
      "musk": 1
    },
    "it": [
      [
        "armoise oil 10%",
        6,
        "t",
        "green",
        10
      ],
      [
        "bergamot oil bergaptene reduced",
        70,
        "t",
        "citrus",
        100
      ],
      [
        "cardamom seed oil",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "cedarwood oil brown virginia",
        150,
        "b",
        "woody",
        100
      ],
      [
        "citronellol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "coriander seed oil",
        2,
        "h",
        "spicy",
        100
      ],
      [
        "coumarin",
        2,
        "b",
        "amber",
        100
      ],
      [
        "cumin seed oil 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "cypress oil",
        3,
        "b",
        "woody",
        100
      ],
      [
        "evernyl 10%",
        5,
        "b",
        "woody",
        10
      ],
      [
        "DIPG",
        109,
        "b",
        "aquatic",
        0
      ],
      [
        "ethyl linalool",
        45,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        17,
        "t",
        "citrus",
        100
      ],
      [
        "beta-ionone",
        30,
        "h",
        "floral",
        100
      ],
      [
        "mace oil",
        10,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil italy yellow",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "cepionate",
        120,
        "h",
        "floral",
        100
      ],
      [
        "muscone 10%",
        6,
        "b",
        "musk",
        10
      ],
      [
        "bitter orange peel oil rectified (furo coumarin reduced)",
        10,
        "b",
        "amber",
        100
      ],
      [
        "phenethyl alcohol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "(r-9',c-10')-1-{9',10'-Dimethylbicyclo[6.4.0]dodec-1'(8')-en-10'-yl}ethan-1-one",
        350,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-091",
    "te": "Accord N° 208687 Floral jasmin (Firmenich)",
    "tr": "Аккорд №208687 · цветочный жасмин (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Detergent powder: 0.15% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.20% · The basic idea of this accord is a Jasmin- honeysuckle- Narcissus complex which is given a rich natural rosy freshness by the use of DORINIA SA E. The high percentage of Dimethyl Benzyl Carbinol is skillfully blended..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208687 · цветочный жасмин (Firmenich)». Ключевые материалы структуры: HEXYLCINNAMIC ALDEHYDE, DIMETHYL BENZYL CARBINOL, DORINIA SA E (Firmenich), TERPINEOL.",
    "pr": {
      "floral": 50,
      "citrus": 22
    },
    "it": [
      [
        "DIMETHYL BENZYL CARBINOL",
        158,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        66,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        302,
        "t",
        "citrus",
        100
      ],
      [
        "INDOL 10%",
        66,
        "h",
        "floral",
        10
      ],
      [
        "LINALOL",
        66,
        "h",
        "floral",
        100
      ],
      [
        "PARA CRESOL EXTRA 10%",
        40,
        "h",
        "floral",
        10
      ],
      [
        "PHENYLETHYL ALCOHOL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "TERPINEOL",
        105,
        "h",
        "floral",
        100
      ],
      [
        "YLANG SYNTH",
        26,
        "h",
        "floral",
        100
      ],
      [
        "DORINIA SA E (Firmenich)",
        131,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-092",
    "te": "Accord N° 203436 Floral jasmin green (Firmenich)",
    "tr": "Аккорд №203436 · цветочный жасмин зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · In this feminine note, we again see the effect of Aldehyde Supra giving a very clean fresh impression to the top note. It also blends with the Damascenone Total to give more power to the fragrance's floralcy. In the background there is a hint of added fruityness..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №203436 · цветочный жасмин зелёный (Firmenich)». Ключевые материалы структуры: BENZYL BENZOATE, HEDIONE® (Firmenich), HEDIONE® HC (Firmenich), HEXYLCINNAMIC ALDEHYDE.",
    "pr": {
      "citrus": 11,
      "green": 3,
      "floral": 50,
      "amber": 1,
      "spicy": 1,
      "musk": 3,
      "woody": 3
    },
    "it": [
      [
        "ALDEHYDE MNA 10%",
        5,
        "t",
        "citrus",
        10
      ],
      [
        "AMYL SALICYLATE",
        10,
        "t",
        "green",
        100
      ],
      [
        "BENZYL ACETATE",
        30,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL BENZOATE",
        210,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        20,
        "t",
        "green",
        100
      ],
      [
        "BERGAMOTE 631 (Firmenich)",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "CARBINOL MUGUET (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "CIS-3-HEXENYL SALICYLATE 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "CIVETTE SYNTH CNC SA E (Firmenich) 10%",
        20,
        "h",
        "floral",
        10
      ],
      [
        "COUMARIN",
        20,
        "b",
        "amber",
        100
      ],
      [
        "DAMASCENONE TOTAL (Firmenich) 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "EUGENOL",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "EXALTENONE (Firmenich) 10%",
        20,
        "h",
        "floral",
        10
      ],
      [
        "GALBEX® 183 (Firmenich) 10%",
        20,
        "h",
        "floral",
        10
      ],
      [
        "HABANOLIDE® (Firmenich)",
        20,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® HC (Firmenich)",
        80,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "ISO BUTYL QUINOLEINE 1%",
        5,
        "h",
        "floral",
        1
      ],
      [
        "LINALOL",
        20,
        "h",
        "floral",
        100
      ],
      [
        "LINALYL ACETATE",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "MUSCENONE™ (Firmenich) 10%",
        20,
        "b",
        "musk",
        10
      ],
      [
        "OAKMOSS SYNTH",
        10,
        "b",
        "woody",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "PRUNELLA® (Firmenich)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "TERPINEOL",
        10,
        "h",
        "floral",
        100
      ],
      [
        "TRIPLAL® (IFF) 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        30,
        "b",
        "woody",
        100
      ],
      [
        "VETYVERYL ACETATE",
        10,
        "h",
        "floral",
        100
      ],
      [
        "YLANG SYNTH",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ALDEHYDE SUPRA (Firmenich) 10%",
        20,
        "t",
        "citrus",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-093",
    "te": "Accord N° 207783 Floral jasmin muguet (Firmenich)",
    "tr": "Аккорд №207783 · цветочный жасмин ландыш (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Detergent powder: 0.15% ; Shampoo: 0.50% ; Soap: 1.00% · In this simple jasmin, muguet accord we see how a small amount of TUBEREUSE 41286 SA adds a rich natural flowery sweetness and reduces the sharp synthetic character..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207783 · цветочный жасмин ландыш (Firmenich)». Ключевые материалы структуры: PHENYLETHYL ALCOHOL, BENZYL SALICYLATE, YLANG SYNTH, BENZYL ACETATE.",
    "pr": {
      "floral": 50,
      "green": 8,
      "citrus": 12
    },
    "it": [
      [
        "BENZYL ACETATE",
        85,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        110,
        "t",
        "green",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        85,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        85,
        "t",
        "citrus",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        85,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        70,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        85,
        "h",
        "floral",
        100
      ],
      [
        "LINALYL ACETATE",
        85,
        "t",
        "citrus",
        100
      ],
      [
        "LYRAL® (IFF)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        126,
        "h",
        "floral",
        100
      ],
      [
        "YLANG SYNTH",
        100,
        "h",
        "floral",
        100
      ],
      [
        "TUBEREUSE 41286 SA (Firmenich)",
        14,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-094",
    "te": "Floral marine fruity women's fragrance",
    "tr": "Цветочно-морской фруктовый женский аромат",
    "sd": "TGSC (dm1015272) · Patent 7,235,519",
    "fa": "aquatic",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,235,519 1,2-substituted 2,3-dehydro-1H-5,9-dioxyacyclohepta[f]inden-7-ones and 7-substituted benzo[b]dioxepin-3-ones.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочно-морской фруктовый женский аромат». Формула из патента 7,235,519. Ключевые материалы структуры: galaxolide 50 BB, cyclohexal, iso e super, hedione.",
    "pr": {
      "floral": 50,
      "gourmand": 13,
      "spicy": 5,
      "musk": 37,
      "woody": 19
    },
    "it": [
      [
        "citronellol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "cyclohexal",
        150,
        "h",
        "floral",
        100
      ],
      [
        "beta-damascone 10%",
        2,
        "h",
        "gourmand",
        10
      ],
      [
        "gamma-decalactone",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydro-beta-ionone",
        55,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        76,
        "b",
        "aquatic",
        0
      ],
      [
        "eugenol",
        35,
        "h",
        "spicy",
        100
      ],
      [
        "galaxolide 50 BB",
        275,
        "b",
        "musk",
        50
      ],
      [
        "hedione",
        110,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        145,
        "b",
        "woody",
        100
      ],
      [
        "jasmolactone 1%",
        25,
        "h",
        "gourmand",
        1
      ],
      [
        "linalool",
        30,
        "h",
        "floral",
        100
      ],
      [
        "7-allyl benzo[b][1,4]dioxepin-3-one 10%",
        65,
        "h",
        "gourmand",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-095",
    "te": "Floral maritime perfume composition",
    "tr": "Цветочно-морская парфюмерная композиция",
    "sd": "TGSC (dm1015272) · Patent 6,242,413",
    "fa": "aquatic",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,242,413 Bicyclic aldehyde and ketone odorants.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочно-морская парфюмерная композиция». Формула из патента 6,242,413. Ключевые материалы структуры: cepionate, galaxolide 50 BB, lilial, bergamot oil bergaptene reduced.",
    "pr": {
      "citrus": 11,
      "gourmand": 1,
      "floral": 50,
      "musk": 11
    },
    "it": [
      [
        "bergamot oil bergaptene reduced",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "lemon oil italy",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "allyl cyclohexyl propionate 10%",
        5,
        "h",
        "gourmand",
        10
      ],
      [
        "alpha-damascone 10%",
        3,
        "h",
        "gourmand",
        10
      ],
      [
        "dimetol",
        1,
        "h",
        "floral",
        100
      ],
      [
        "carbinol muguet",
        3,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        90,
        "b",
        "aquatic",
        0
      ],
      [
        "ethyl linalool",
        85,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        1,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 BB",
        140,
        "b",
        "musk",
        50
      ],
      [
        "beta-ionone",
        2,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        35,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "calamus rhizome oil",
        6,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        120,
        "h",
        "floral",
        100
      ],
      [
        "cepionate",
        320,
        "h",
        "floral",
        100
      ],
      [
        "(E,Z)-2,6-nonadienal 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "phenyl acetaldehyde 85%/pea 10%",
        5,
        "t",
        "citrus",
        85
      ],
      [
        "alpha-terpineol",
        2,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "(r-9',c-10')-1-{9',10'-Dimethylbicyclo[6.4.0]dodec-1'(8')-en-10'-yl}ethan-1-one",
        40,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-096",
    "te": "Floral muguet aldehydic",
    "tr": "Цветочный ландыш альдегидный",
    "sd": "TGSC (dm1015272) · Patent 8,633,144",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,633,144 Octahydro-1H-4,7-methano-indene-5-aldehydes and their use in perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный ландыш альдегидный». Формула из патента 8,633,144. Ключевые материалы структуры: cyclal C, dihydro seveniff, cyclacet, iso cyclemone E.",
    "pr": {
      "citrus": 15,
      "woody": 6,
      "floral": 50,
      "gourmand": 1,
      "musk": 8,
      "green": 2
    },
    "it": [
      [
        "aldehyde C-10",
        1.89,
        "t",
        "citrus",
        100
      ],
      [
        "patchouli oil light",
        18.9,
        "b",
        "woody",
        100
      ],
      [
        "dihydro seveniff",
        94.5,
        "h",
        "floral",
        100
      ],
      [
        "allyl amyl glycolate",
        4.73,
        "h",
        "gourmand",
        100
      ],
      [
        "delta-damascone",
        0.95,
        "h",
        "gourmand",
        100
      ],
      [
        "galaxolide 50 BB",
        47.25,
        "b",
        "musk",
        50
      ],
      [
        "clove leaf oil",
        1.89,
        "h",
        "spicy",
        100
      ],
      [
        "polysantol",
        9.45,
        "b",
        "woody",
        100
      ],
      [
        "koavone",
        47.25,
        "h",
        "floral",
        100
      ],
      [
        "cyclacet",
        94.5,
        "h",
        "floral",
        100
      ],
      [
        "iso cyclemone E",
        94.5,
        "t",
        "citrus",
        100
      ],
      [
        "grapefruit oil",
        18.9,
        "t",
        "citrus",
        100
      ],
      [
        "nebulone",
        47.25,
        "h",
        "floral",
        100
      ],
      [
        "peranat",
        4.73,
        "h",
        "floral",
        100
      ],
      [
        "poirenate",
        4.73,
        "h",
        "floral",
        100
      ],
      [
        "verdox",
        9.45,
        "h",
        "gourmand",
        100
      ],
      [
        "benzyl acetate",
        18.9,
        "h",
        "floral",
        100
      ],
      [
        "veridian",
        9.45,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        1.89,
        "b",
        "amber",
        100
      ],
      [
        "lavandin oil grosso",
        28.35,
        "t",
        "green",
        100
      ],
      [
        "dextro-limonene",
        18.9,
        "t",
        "citrus",
        100
      ],
      [
        "vertofix coeur",
        47.25,
        "b",
        "woody",
        100
      ],
      [
        "galaxolide 50 IPM",
        47.25,
        "b",
        "musk",
        50
      ],
      [
        "vertenex HC",
        47.25,
        "h",
        "floral",
        100
      ],
      [
        "octahydro-4,7-methano-1H-indene-5-acetaldehyde + 6-methyl-octahydro-4,7-methano-indene-5-c",
        47.25,
        "t",
        "citrus",
        100
      ],
      [
        "cyclal C",
        138.1,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        94.5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-097",
    "te": "Accord N° 207578 Floral muguet green (Firmenich)",
    "tr": "Аккорд №207578 · цветочный ландыш зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Deo spray: 0.17% ; Detergent powder: 0.15% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.20% · A simple muguet floral blend is modified by Jacintheme 135 SA into a rich modern green floral fantasy. The dry- out of this accord is particularly full- bodied and elegant..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207578 · цветочный ландыш зелёный (Firmenich)». Ключевые материалы структуры: CITRONELLOL, TERPINEOL, DIPG, HEDIONE® (Firmenich).",
    "pr": {
      "floral": 50,
      "citrus": 7
    },
    "it": [
      [
        "CITRONELLOL",
        200,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "ROSE OXIDE 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "TERPINEOL",
        200,
        "h",
        "floral",
        100
      ],
      [
        "JACINTHEME 135 SA (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        150,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-098",
    "te": "floral muguet type",
    "tr": "Цветочный ландыш (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring cis-3-hexenol, citronellol, cyclamen aldehyde, damascenone.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный ландыш (тип)». Ключевые материалы структуры: phenethyl alcohol, methyl dihydrojasmonate, tetrahydrolinalool, citronellol.",
    "pr": {
      "floral": 50,
      "citrus": 10,
      "spicy": 2,
      "aquatic": 3
    },
    "it": [
      [
        "cis-3-hexenol",
        5,
        "t",
        "green",
        100
      ],
      [
        "citronellol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "damascenone",
        0.5,
        "h",
        "floral",
        100
      ],
      [
        "ethyl linalyl acetate",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "eugenol",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "floralozone",
        20,
        "h",
        "aquatic",
        100
      ],
      [
        "helional",
        25,
        "h",
        "aquatic",
        100
      ],
      [
        "isodamascone",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "methyl dihydrojasmonate",
        200,
        "h",
        "floral",
        100
      ],
      [
        "methyl isoeugenol",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "phenethyl alcohol",
        250,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalool",
        150,
        "h",
        "floral",
        100
      ],
      [
        "ylang ylang flower oil I",
        10,
        "h",
        "floral",
        100
      ],
      [
        "muguet nitrile",
        15,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        48.5,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-099",
    "te": "Floral Musk Accord",
    "tr": "Цветочный мускусный Аккорд",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный мускусный Аккорд». Ключевые материалы структуры: methyl dihydrojasmonate, benzyl acetate, phenethyl alcohol, DIPG.",
    "pr": {
      "floral": 50,
      "gourmand": 3,
      "aquatic": 2,
      "green": 3,
      "musk": 3,
      "amber": 1
    },
    "it": [
      [
        "2-isopropyl-4-methyl thiazole 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "allyl amyl glycolate",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "amyl acetate",
        2,
        "h",
        "floral",
        100
      ],
      [
        "aquaflor",
        6,
        "h",
        "aquatic",
        100
      ],
      [
        "benzyl acetate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "beta-damascone",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        40,
        "t",
        "green",
        100
      ],
      [
        "citronellol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "cyclacet",
        40,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl ionone",
        15,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        91,
        "b",
        "aquatic",
        0
      ],
      [
        "gamma-undecalactone",
        15,
        "h",
        "gourmand",
        100
      ],
      [
        "habanolide",
        50,
        "b",
        "musk",
        100
      ],
      [
        "helional",
        20,
        "h",
        "aquatic",
        100
      ],
      [
        "heliotropin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "lilytol",
        70,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        70,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        150,
        "h",
        "floral",
        100
      ],
      [
        "pentalide",
        20,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        15,
        "h",
        "gourmand",
        100
      ],
      [
        "alpha-terpineol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        2,
        "t",
        "green",
        100
      ],
      [
        "cardamom aldehyde 1%",
        5,
        "t",
        "citrus",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-100",
    "te": "Accord N° 208210 Floral musk citrus fruity (Firmenich)",
    "tr": "Аккорд №208210 · цветочный мускусный цитрусовый фруктовый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; All purpose cleaner: 0.20% ; Detergent powder: 0.20% ; Shampoo: 0.50% ; Soap: 0.50% ; Softner: 0.30% · To this functional floral, musky, citrus-fruity accord, the addition of 2% TEAK 109955 increases the overall strength of the fragrance. The citrus-fruity note is enhanced by the presence of TEAK and the woody character given by this product makes thefragrance more sophisticated and richer..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208210 · цветочный мускусный цитрусовый фруктовый (Firmenich)». Ключевые материалы структуры: EXALTOLIDE® TOTAL (Firmenich), DIHYDROMYRCENOL, CITRON 171 (Firmenich), TRICYCLODECENYL PROPIONATE.",
    "pr": {
      "green": 6,
      "citrus": 16,
      "floral": 50,
      "amber": 5,
      "musk": 41,
      "aquatic": 2,
      "woody": 1
    },
    "it": [
      [
        "AMYL SALICYLATE",
        50,
        "t",
        "green",
        100
      ],
      [
        "ANISIC ALDEHYDE",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "ASPIC 41156 SAB (Firmenich)",
        15,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL ACETATE",
        30,
        "h",
        "floral",
        100
      ],
      [
        "CETALOX® (Firmenich) 10%",
        15,
        "b",
        "amber",
        10
      ],
      [
        "CITRON 171 (Firmenich)",
        65,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "COUMARIN",
        10,
        "b",
        "amber",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        70,
        "t",
        "citrus",
        100
      ],
      [
        "EXALTOLIDE® TOTAL (Firmenich)",
        300,
        "b",
        "musk",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HELIOTROPIN",
        15,
        "b",
        "amber",
        100
      ],
      [
        "LINALYL ACETATE",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "MELONAL 1%",
        20,
        "h",
        "aquatic",
        1
      ],
      [
        "MUSCENONE™ (Firmenich) 10%",
        40,
        "b",
        "musk",
        10
      ],
      [
        "PLICATONE (Firmenich)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "POLYSANTOL® (Firmenich)",
        5,
        "b",
        "woody",
        100
      ],
      [
        "SCENTENAL® (Firmenich)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "TRICYCLODECENYL PROPIONATE",
        60,
        "h",
        "floral",
        100
      ],
      [
        "WARDIA® BM SA (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "TEAK",
        20,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-101",
    "te": "floral oriental type",
    "tr": "Цветочный восточный (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "amber",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, para-anisaldehyde, aldehyde C-11 undecylenic, benzyl benzoate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный восточный (тип)». Ключевые материалы структуры: methyl ionone gamma supreme, habanolide, eugenol, hedione.",
    "pr": {
      "floral": 50,
      "citrus": 4,
      "amber": 5,
      "gourmand": 3,
      "spicy": 9,
      "musk": 14,
      "woody": 8
    },
    "it": [
      [
        "benzyl acetate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde",
        2.5,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-11 undecylenic",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl benzoate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "cetalox",
        10,
        "b",
        "amber",
        100
      ],
      [
        "raspberry ketone",
        7.5,
        "h",
        "gourmand",
        100
      ],
      [
        "coranol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        17.5,
        "b",
        "amber",
        100
      ],
      [
        "allyl cyclohexyl propionate",
        2.5,
        "h",
        "gourmand",
        100
      ],
      [
        "tuberose acetate 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "alpha-damascone",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl vanillin",
        12.5,
        "b",
        "amber",
        100
      ],
      [
        "eugenol",
        75,
        "h",
        "spicy",
        100
      ],
      [
        "florex 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "geranyl formate",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "petal pyranone 10%",
        12.5,
        "h",
        "floral",
        10
      ],
      [
        "geraniol",
        25,
        "h",
        "floral",
        100
      ],
      [
        "habanolide",
        100,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        75,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "helvetolide",
        25,
        "b",
        "musk",
        100
      ],
      [
        "hivernal neo",
        5,
        "h",
        "floral",
        100
      ],
      [
        "isoeugenol",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "isopentyrate",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "methyl ionone gamma supreme",
        125,
        "h",
        "floral",
        100
      ],
      [
        "laevo-menthone 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "aldehyde C-12 mna",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "oranger crystals",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "para-methyl anisole",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "oakmoss oil",
        7.5,
        "b",
        "woody",
        100
      ],
      [
        "muscenone delta",
        25,
        "b",
        "musk",
        100
      ],
      [
        "myroxyde",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "neobutenone alpha 10%",
        7.5,
        "h",
        "floral",
        10
      ],
      [
        "rose oxide",
        5,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        75,
        "b",
        "woody",
        100
      ],
      [
        "(E,Z)-2,6-nonadienal 0.1%",
        12.5,
        "h",
        "floral",
        0.1
      ],
      [
        "phenylhexanol",
        25,
        "h",
        "floral",
        100
      ],
      [
        "benzyl propionate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl salicylate",
        5,
        "t",
        "green",
        100
      ],
      [
        "salicynalva",
        35,
        "h",
        "floral",
        100
      ],
      [
        "terpineol",
        5,
        "h",
        "floral",
        100
      ],
      [
        "musk indanone",
        2.5,
        "b",
        "musk",
        100
      ],
      [
        "trifernal",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "2,4-ivy carbaldehyde",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "gamma-undecalactone",
        12.5,
        "h",
        "gourmand",
        100
      ],
      [
        "veloutone",
        5,
        "h",
        "floral",
        100
      ],
      [
        "methyl cedryl ketone",
        62.5,
        "h",
        "floral",
        100
      ],
      [
        "amberketal 10%",
        10,
        "b",
        "amber",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-102",
    "te": "Accord N° 208060 Floral oriental woody (Firmenich)",
    "tr": "Аккорд №208060 · цветочный восточный древесный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "amber",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · FIXOBOIS 66606 adds strength and body to the fragrance while rounding the top note and lending a rich ambery note to the dry down..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208060 · цветочный восточный древесный (Firmenich)». Ключевые материалы структуры: HEDIONE® (Firmenich), BENZYL SALICYLATE, BENZYL ACETATE, FLOROL® (Firmenich).",
    "pr": {
      "floral": 50,
      "green": 33,
      "gourmand": 2,
      "woody": 6
    },
    "it": [
      [
        "BENZYL ACETATE",
        55,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        340,
        "t",
        "green",
        100
      ],
      [
        "CIS-3-HEXENYL ACETATE 1%",
        20,
        "t",
        "green",
        1
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "FLOROL® (Firmenich)",
        45,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        350,
        "h",
        "floral",
        100
      ],
      [
        "INDOL 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "ISOJASMONE 1%",
        30,
        "h",
        "floral",
        1
      ],
      [
        "LINALOL",
        20,
        "h",
        "floral",
        100
      ],
      [
        "METHYL ANTHRANILATE",
        5,
        "h",
        "floral",
        100
      ],
      [
        "METHYL OCTINE CARBONATE 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "UNDECALACTONE GAMMA 10%",
        25,
        "h",
        "gourmand",
        10
      ],
      [
        "VANILLIN",
        5,
        "b",
        "amber",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        40,
        "b",
        "woody",
        100
      ],
      [
        "YLANG SYNTH",
        20,
        "h",
        "floral",
        100
      ],
      [
        "FIXOBOIS BASE 66606 (Firmenich)",
        20,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-103",
    "te": "Floral powdery",
    "tr": "Цветочный пудровый",
    "sd": "TGSC (dm1015272) · Patent 8,709,993",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,709,993 Quinazoline compounds and their use in perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный пудровый». Формула из патента 8,709,993. Ключевые материалы структуры: lilial, methyl ionone gamma supreme, iso e super, hedione.",
    "pr": {
      "floral": 50,
      "amber": 9,
      "citrus": 9,
      "woody": 8
    },
    "it": [
      [
        "santaliff",
        34.29,
        "h",
        "floral",
        100
      ],
      [
        "phenoxanol",
        45.71,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        40,
        "b",
        "amber",
        100
      ],
      [
        "cyclamal extra",
        1.43,
        "h",
        "floral",
        100
      ],
      [
        "ethyl vanillin",
        10,
        "b",
        "amber",
        100
      ],
      [
        "geraniol 980",
        7.14,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        85.71,
        "h",
        "floral",
        100
      ],
      [
        "alpha-amyl cinnamaldehyde",
        85.71,
        "t",
        "citrus",
        100
      ],
      [
        "heliotropin",
        24.29,
        "b",
        "amber",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        22.86,
        "t",
        "citrus",
        100
      ],
      [
        "beta-ionone",
        8.57,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        100,
        "b",
        "woody",
        100
      ],
      [
        "lyral",
        22.86,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        222.86,
        "h",
        "floral",
        100
      ],
      [
        "Lilianth",
        28.57,
        "h",
        "floral",
        100
      ],
      [
        "methyl ionone gamma supreme",
        104.29,
        "h",
        "floral",
        100
      ],
      [
        "veramoss",
        2.86,
        "b",
        "woody",
        100
      ],
      [
        "peru balsam oil",
        4.29,
        "b",
        "amber",
        100
      ],
      [
        "prenyl acetate",
        1.43,
        "h",
        "floral",
        100
      ],
      [
        "methyl cedryl ketone",
        57.14,
        "h",
        "floral",
        100
      ],
      [
        "methyl phenyl acetate",
        1.43,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde",
        5.71,
        "t",
        "citrus",
        100
      ],
      [
        "siam benzoin resinoid",
        14.29,
        "b",
        "amber",
        100
      ],
      [
        "cedrol",
        4.29,
        "b",
        "woody",
        100
      ],
      [
        "citronellol",
        4.29,
        "h",
        "floral",
        100
      ],
      [
        "methyl cinnamate",
        4.29,
        "h",
        "spicy",
        100
      ],
      [
        "styrax oil",
        2.86,
        "b",
        "amber",
        100
      ],
      [
        "vanillin",
        17.14,
        "b",
        "amber",
        100
      ],
      [
        "cananga oil",
        7.14,
        "h",
        "floral",
        100
      ],
      [
        "6,7,8,9-tetrahydro-7,7,8,9,9-pentamethyl-5H-cyclopenta[H]quinazoline",
        28.57,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-104",
    "te": "Accord N° 207714 Floral powdery (Firmenich)",
    "tr": "Аккорд №207714 · цветочный пудровый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.30% · In this accord FLOREX helps to link the floral, powdery and balsamic notes to be more naturally sweet and to give a better product performance..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207714 · цветочный пудровый (Firmenich)». Ключевые материалы структуры: PHENYLACETALDEHYDE DIMETHYLACETAL, BENZYL ACETATE, HEDIONE® (Firmenich), HEXYLCINNAMIC ALDEHYDE.",
    "pr": {
      "citrus": 30,
      "floral": 50,
      "amber": 7,
      "musk": 3
    },
    "it": [
      [
        "ANISIC ALDEHYDE",
        55,
        "t",
        "citrus",
        100
      ],
      [
        "BENZYL ACETATE",
        92,
        "h",
        "floral",
        100
      ],
      [
        "COUMARIN",
        55,
        "b",
        "amber",
        100
      ],
      [
        "ETHYL VANILLIN",
        18,
        "b",
        "amber",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        37,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        92,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        92,
        "t",
        "citrus",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        37,
        "h",
        "floral",
        100
      ],
      [
        "LYRAL® (IFF)",
        55,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        4,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLACETALDEHYDE DIMETHYLACETAL",
        187,
        "t",
        "citrus",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        92,
        "h",
        "floral",
        100
      ],
      [
        "RHUBOFIX® (Firmenich)",
        92,
        "h",
        "floral",
        100
      ],
      [
        "TERPINEOL",
        37,
        "h",
        "floral",
        100
      ],
      [
        "TILLEUL BASE 41360 (Firmenich)",
        37,
        "h",
        "floral",
        100
      ],
      [
        "FLOREX® (Firmenich)",
        18,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-105",
    "te": "Accord N° 207796 Floral powdery aldehydic (Firmenich)",
    "tr": "Аккорд №207796 · цветочный пудровый альдегидный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.20% · ISOPENTYRATE gives a more fresh and creamy powdery note to this aldehydic floral accord. The aldehydes are nicely blended in..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207796 · цветочный пудровый альдегидный (Firmenich)». Ключевые материалы структуры: PHENYLETHYL ALCOHOL, BENZYL SALICYLATE, PARA TERT BUTYL CYCLOHEXYL ACETATE, HABANOLIDE® (Firmenich).",
    "pr": {
      "citrus": 2,
      "green": 9,
      "amber": 2,
      "floral": 50,
      "musk": 7,
      "woody": 3
    },
    "it": [
      [
        "ALDEHYDE C11 UNDECYLENIC 50%",
        15,
        "t",
        "citrus",
        50
      ],
      [
        "ALDEHYDE C12 LAURIC 50%",
        15,
        "t",
        "citrus",
        50
      ],
      [
        "BENZYL SALICYLATE",
        120,
        "t",
        "green",
        100
      ],
      [
        "COUMARIN",
        30,
        "b",
        "amber",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        35,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        100,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        75,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        45,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        75,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        75,
        "h",
        "floral",
        100
      ],
      [
        "PARA TERT BUTYL CYCLOHEXYL ACETATE",
        120,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        145,
        "h",
        "floral",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        45,
        "b",
        "woody",
        100
      ],
      [
        "YLANG SYNTH",
        75,
        "h",
        "floral",
        100
      ],
      [
        "ISOPENTYRATE (Firmenich)",
        30,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-106",
    "te": "Floral powdery fragrance",
    "tr": "Цветочный пудровый аромат",
    "sd": "TGSC (dm1015272) · Patent 5,990,076",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,990,076 Benzodioxepinone and its use in perfumery.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный пудровый аромат». Формула из патента 5,990,076. Ключевые материалы структуры: lorysia, hexyl salicylate, benzyl acetate, verdyl acetate.",
    "pr": {
      "floral": 50,
      "citrus": 7,
      "amber": 2,
      "musk": 4,
      "woody": 8,
      "green": 13
    },
    "it": [
      [
        "benzyl acetate",
        80,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "verdyl acetate",
        80,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "undecanal 50%",
        20,
        "h",
        "floral",
        50
      ],
      [
        "cetalox 10%",
        20,
        "b",
        "amber",
        10
      ],
      [
        "cyclamen aldehyde",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "dihydromyrcenol",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "habanolide",
        45,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "iralia total",
        40,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        80,
        "b",
        "woody",
        100
      ],
      [
        "lilial",
        60,
        "h",
        "floral",
        100
      ],
      [
        "lorysia",
        220,
        "h",
        "floral",
        100
      ],
      [
        "methyl octine carbonate 10%",
        10,
        "t",
        "green",
        10
      ],
      [
        "polysantol",
        10,
        "b",
        "woody",
        100
      ],
      [
        "hexyl salicylate",
        150,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-107",
    "te": "floral powdery type (#107)",
    "tr": "Цветочный пудровый (тип) (#107)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring alpha-hexyl cinnamaldehyde, methyl anthranilate, cetalox, citronellol.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный пудровый (тип) (#107)». Ключевые материалы структуры: alpha-hexyl cinnamaldehyde, hedione, iralia total, lilial.",
    "pr": {
      "citrus": 50,
      "floral": 26,
      "amber": 1,
      "musk": 1,
      "woody": 4
    },
    "it": [
      [
        "alpha-hexyl cinnamaldehyde",
        615.38,
        "t",
        "citrus",
        100
      ],
      [
        "methyl anthranilate",
        7.69,
        "h",
        "floral",
        100
      ],
      [
        "cetalox",
        7.69,
        "b",
        "amber",
        100
      ],
      [
        "citronellol",
        38.46,
        "h",
        "floral",
        100
      ],
      [
        "coranol",
        30.77,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        76.92,
        "h",
        "floral",
        100
      ],
      [
        "musk dimethyl indane",
        7.69,
        "b",
        "musk",
        100
      ],
      [
        "indole 10%",
        7.69,
        "h",
        "floral",
        10
      ],
      [
        "iralia total",
        76.92,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        53.85,
        "h",
        "floral",
        100
      ],
      [
        "terpineol",
        23.08,
        "h",
        "floral",
        100
      ],
      [
        "vertofix",
        53.85,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-108",
    "te": "floral powdery type (#108)",
    "tr": "Цветочный пудровый (тип) (#108)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, citronellyl acetate, verdyl acetate, para-anisaldehyde.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный пудровый (тип) (#108)». Ключевые материалы структуры: lorysia, hexyl salicylate, benzyl acetate, verdyl acetate.",
    "pr": {
      "floral": 50,
      "citrus": 7,
      "amber": 2,
      "musk": 4,
      "woody": 8,
      "green": 13
    },
    "it": [
      [
        "benzyl acetate",
        80,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "verdyl acetate",
        80,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "undecanal 50%",
        20,
        "h",
        "floral",
        50
      ],
      [
        "cetalox 10%",
        20,
        "b",
        "amber",
        10
      ],
      [
        "cyclamen aldehyde",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "dihydromyrcenol",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "habanolide",
        45,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "iralia total",
        40,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        80,
        "b",
        "woody",
        100
      ],
      [
        "lilial",
        60,
        "h",
        "floral",
        100
      ],
      [
        "lorysia",
        220,
        "h",
        "floral",
        100
      ],
      [
        "methyl octine carbonate 10%",
        10,
        "t",
        "green",
        10
      ],
      [
        "polysantol",
        10,
        "b",
        "woody",
        100
      ],
      [
        "hexyl salicylate",
        150,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-109",
    "te": "Accord N° 207877 Floral powdery woody aldehydic (Firmenich)",
    "tr": "Аккорд №207877 · цветочный пудровый древесный альдегидный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "woody",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Antiperspirant roll-on: 0.30% ; Detergent powder: 0.15% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.30% · A woody- floral complex is developed by the addition of LIMBWOOD BASE 109289 B to this accord..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207877 · цветочный пудровый древесный альдегидный (Firmenich)». Ключевые материалы структуры: DIHYDROMYRCENOL, BENZYL SALICYLATE, EXALTOLIDE® TOTAL (Firmenich) 50%, CITRONELLOL.",
    "pr": {
      "citrus": 13,
      "floral": 50,
      "green": 9,
      "amber": 4,
      "musk": 9,
      "woody": 4
    },
    "it": [
      [
        "ALDEHYDE C 10 10%",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "ALDEHYDE C11 UNDECYLENIC 50%",
        10,
        "t",
        "citrus",
        50
      ],
      [
        "BENZYL ACETATE",
        30,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        100,
        "t",
        "green",
        100
      ],
      [
        "CITRONELLOL",
        90,
        "h",
        "floral",
        100
      ],
      [
        "COUMARIN",
        15,
        "b",
        "amber",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        130,
        "t",
        "citrus",
        100
      ],
      [
        "ETHYL VANILLIN 10%",
        25,
        "b",
        "amber",
        10
      ],
      [
        "EXALTOLIDE® TOTAL (Firmenich) 50%",
        100,
        "b",
        "musk",
        50
      ],
      [
        "FARENAL® (Symrise) 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "FLOROL® (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "PARA TERT BUTYL CYCLOHEXYL ACETATE",
        90,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        70,
        "h",
        "floral",
        100
      ],
      [
        "SANDELA® (Givaudan)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "YLANG SYNTH",
        30,
        "h",
        "floral",
        100
      ],
      [
        "LIMBWOOD 109289 B (Firmenich)",
        40,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-110",
    "te": "Accord N° 207607 Floral rose (Firmenich)",
    "tr": "Аккорд №207607 · цветочный роза (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · This accord shows the tremendous power of DAMASCENIA 185 SA and its ability to develop dynamic and original top note effects. Even the most diffusive of fragrances can be given greater lift and character with a small addition of DAMASCENIA 185 SA..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207607 · цветочный роза (Firmenich)». Ключевые материалы структуры: HEDIONE® (Firmenich), PHENYLETHYL ALCOHOL, FLOROL® (Firmenich), GERANIOL.",
    "pr": {
      "floral": 50,
      "woody": 1
    },
    "it": [
      [
        "CEDROXYDE® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "FLOROL® (Firmenich)",
        210,
        "h",
        "floral",
        100
      ],
      [
        "GERANIOL",
        175,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        260,
        "h",
        "floral",
        100
      ],
      [
        "OAKMOSS SYNTH",
        15,
        "b",
        "woody",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        260,
        "h",
        "floral",
        100
      ],
      [
        "WARDIA® (Firmenich)",
        25,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCENIA 185 SA (Firmenich)",
        5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-111",
    "te": "floral rose accord",
    "tr": "Цветочный роза Аккорд",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring hexyl acetate, phenethyl acetate, styrallyl acetate, verdyl acetate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный роза Аккорд». Ключевые материалы структуры: dihydromyrcenol, hexyl salicylate, hedione, vertofix.",
    "pr": {
      "floral": 50,
      "gourmand": 1,
      "citrus": 13,
      "amber": 1,
      "spicy": 2,
      "green": 14,
      "woody": 11
    },
    "it": [
      [
        "hexyl acetate",
        16.84,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl acetate",
        42.11,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        8.42,
        "h",
        "gourmand",
        100
      ],
      [
        "verdyl acetate",
        21.05,
        "h",
        "floral",
        100
      ],
      [
        "empetal",
        4.21,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde",
        4.21,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 mna",
        8.42,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl acetone",
        21.05,
        "h",
        "floral",
        100
      ],
      [
        "cetalox",
        8.42,
        "b",
        "amber",
        100
      ],
      [
        "citronellol",
        31.58,
        "h",
        "floral",
        100
      ],
      [
        "coranol",
        52.63,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        5.26,
        "b",
        "amber",
        100
      ],
      [
        "damascenone",
        4.21,
        "h",
        "floral",
        100
      ],
      [
        "dihydroeugenol",
        8.42,
        "h",
        "spicy",
        100
      ],
      [
        "dihydromyrcenol",
        126.32,
        "t",
        "citrus",
        100
      ],
      [
        "doremox",
        10.53,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        42.11,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        105.26,
        "h",
        "floral",
        100
      ],
      [
        "hivernal neo",
        9.47,
        "h",
        "floral",
        100
      ],
      [
        "isoeugenol",
        10.53,
        "h",
        "spicy",
        100
      ],
      [
        "lavandin oil grosso",
        21.05,
        "t",
        "green",
        100
      ],
      [
        "lemonile",
        4.21,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        84.21,
        "h",
        "floral",
        100
      ],
      [
        "chrysanthemum oxide",
        4.21,
        "h",
        "floral",
        100
      ],
      [
        "para-methyl anisole",
        4.21,
        "h",
        "spicy",
        100
      ],
      [
        "phenethylol",
        21.05,
        "h",
        "floral",
        100
      ],
      [
        "woody acetate",
        10.53,
        "b",
        "woody",
        100
      ],
      [
        "hexyl salicylate",
        126.32,
        "t",
        "green",
        100
      ],
      [
        "salicynalva",
        52.63,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        4.21,
        "t",
        "green",
        100
      ],
      [
        "undecavertol",
        21.05,
        "h",
        "floral",
        100
      ],
      [
        "vertofix",
        105.26,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-112",
    "te": "Floral Rose Fruity Fragrance Composition",
    "tr": "Цветочный роза фруктовый аромат композиция",
    "sd": "TGSC (dm1015272) · Patent 9,440,097",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 9,440,097 Organic compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный роза фруктовый аромат композиция». Формула из патента 9,440,097. Ключевые материалы структуры: phenethyl alcohol, hedione, phenethyl benzoate, phenethyl cinnamate.",
    "pr": {
      "floral": 50,
      "spicy": 4,
      "amber": 1
    },
    "it": [
      [
        "benzyl acetate",
        24.24,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        242.42,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl benzoate",
        157.58,
        "h",
        "floral",
        100
      ],
      [
        "centifolyl",
        54.55,
        "h",
        "floral",
        100
      ],
      [
        "cinnamyl cinnamate",
        12.12,
        "h",
        "spicy",
        100
      ],
      [
        "phenethyl cinnamate",
        63.03,
        "h",
        "spicy",
        100
      ],
      [
        "citronellol",
        54.55,
        "h",
        "floral",
        100
      ],
      [
        "dihydrofarnesal",
        24.24,
        "h",
        "floral",
        100
      ],
      [
        "florhydral",
        3.64,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        181.82,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl isobutyrate",
        30.3,
        "h",
        "floral",
        100
      ],
      [
        "isoraldeine 70",
        54.55,
        "h",
        "floral",
        100
      ],
      [
        "methyl diantilis",
        54.55,
        "h",
        "floral",
        100
      ],
      [
        "peche pure",
        12.12,
        "h",
        "floral",
        100
      ],
      [
        "rose oxide",
        12.12,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        18.18,
        "b",
        "amber",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-113",
    "te": "Accord N° 207564 Floral rose woody (Firmenich)",
    "tr": "Аккорд №207564 · цветочный роза древесный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "woody",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Cream: 0.30% ; Detergent powder: 0.15% ; Soap: 1.00% · The blending of DORINIA SA E with an aldehydic woody floral complex gives a novel twist to an old theme..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207564 · цветочный роза древесный (Firmenich)». Ключевые материалы структуры: DORINIA SA E (Firmenich), HEDIONE® (Firmenich), VERTOFIX® COEUR (IFF), IRALIA® TOTAL (Firmenich).",
    "pr": {
      "citrus": 1,
      "floral": 50,
      "woody": 14
    },
    "it": [
      [
        "ALDEHYDE C11 UNDECYLENIC 50%",
        20,
        "t",
        "citrus",
        50
      ],
      [
        "HEDIONE® (Firmenich)",
        220,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        105,
        "h",
        "floral",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        215,
        "b",
        "woody",
        100
      ],
      [
        "DORINIA SA E (Firmenich)",
        440,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-114",
    "te": "floral tea type",
    "tr": "Цветочный чайный (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring linalool, bergamot oil, phenethyl alcohol, citronellol.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный чайный (тип)». Ключевые материалы структуры: linalool, DIPG, bergamot oil, phenethyl alcohol.",
    "pr": {
      "floral": 50,
      "citrus": 9,
      "green": 4,
      "spicy": 2
    },
    "it": [
      [
        "linalool",
        200,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetone",
        50,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl benzoate",
        50,
        "t",
        "green",
        100
      ],
      [
        "(E)-anethol",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "para-anisaldehyde",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "methyl jasmonate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        15,
        "h",
        "floral",
        100
      ],
      [
        "dihydro beta ionone",
        15,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "phenyl acetaldehyde",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "citral",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "dihydrofarnesal",
        60,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        175,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-115",
    "te": "floral type",
    "tr": "Цветочный (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring aldehyde C-10, patchouli oil, dihydromyrcenol, allyl amyl glycolate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный (тип)». Ключевые материалы структуры: hydroxycitronellal, dihydromyrcenol, cyclacet, isocyclemone E.",
    "pr": {
      "citrus": 47,
      "woody": 10,
      "gourmand": 2,
      "green": 10,
      "floral": 50,
      "musk": 12
    },
    "it": [
      [
        "aldehyde C-10",
        1.89,
        "t",
        "citrus",
        100
      ],
      [
        "patchouli oil",
        18.9,
        "b",
        "woody",
        100
      ],
      [
        "dihydromyrcenol",
        94.5,
        "t",
        "citrus",
        100
      ],
      [
        "allyl amyl glycolate",
        4.73,
        "h",
        "gourmand",
        100
      ],
      [
        "delta-damascone",
        0.95,
        "h",
        "gourmand",
        100
      ],
      [
        "benzyl salicylate",
        47.25,
        "t",
        "green",
        100
      ],
      [
        "clove leaf oil",
        1.89,
        "h",
        "spicy",
        100
      ],
      [
        "polysantol",
        9.45,
        "b",
        "woody",
        100
      ],
      [
        "koavone",
        47.25,
        "h",
        "floral",
        100
      ],
      [
        "cyclacet",
        94.5,
        "h",
        "floral",
        100
      ],
      [
        "isocyclemone E",
        94.5,
        "t",
        "citrus",
        100
      ],
      [
        "grapefruit oil",
        18.9,
        "t",
        "citrus",
        100
      ],
      [
        "ethylene brassylate",
        47.25,
        "b",
        "musk",
        100
      ],
      [
        "peranat",
        4.73,
        "h",
        "floral",
        100
      ],
      [
        "poirenate",
        4.73,
        "h",
        "floral",
        100
      ],
      [
        "verdox",
        9.45,
        "h",
        "gourmand",
        100
      ],
      [
        "benzyl acetate",
        18.9,
        "h",
        "floral",
        100
      ],
      [
        "green carbaldehyde",
        9.45,
        "t",
        "citrus",
        100
      ],
      [
        "vanillin",
        1.89,
        "b",
        "amber",
        100
      ],
      [
        "lavandin oil grosso",
        28.35,
        "t",
        "green",
        100
      ],
      [
        "dipentene",
        18.9,
        "h",
        "floral",
        100
      ],
      [
        "vertofix",
        47.25,
        "b",
        "woody",
        100
      ],
      [
        "galaxolide 50 IPM",
        47.25,
        "b",
        "musk",
        50
      ],
      [
        "vertenex",
        47.25,
        "h",
        "floral",
        100
      ],
      [
        "floral butanal",
        47.25,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        138.1,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        94.5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-116",
    "te": "floral violet powdery type",
    "tr": "Цветочный фиалка пудровый (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring para-anisaldehyde, habanolide, hedione, alpha-ionone.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный фиалка пудровый (тип)». Ключевые материалы структуры: beta-ionone, alpha-ionone, hedione, iso e super.",
    "pr": {
      "citrus": 3,
      "musk": 5,
      "floral": 50,
      "woody": 7,
      "amber": 1
    },
    "it": [
      [
        "para-anisaldehyde",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "habanolide",
        80,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        120,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        200,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        400,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        100,
        "b",
        "woody",
        100
      ],
      [
        "isobornyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "(E,Z)-2,6-nonadien-1-ol 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "DIPG",
        26,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-117",
    "te": "floral violet type (#117)",
    "tr": "Цветочный фиалка (тип) (#117)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring alpha-hexyl cinnamaldehyde, cetalox, delphol, farenal 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный фиалка (тип) (#117)». Ключевые материалы структуры: linalool, alpha-hexyl cinnamaldehyde, hedione, florol.",
    "pr": {
      "citrus": 11,
      "amber": 3,
      "floral": 50,
      "green": 2
    },
    "it": [
      [
        "alpha-hexyl cinnamaldehyde",
        166.67,
        "t",
        "citrus",
        100
      ],
      [
        "cetalox",
        22.22,
        "b",
        "amber",
        100
      ],
      [
        "delphol",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "farenal 10%",
        55.56,
        "h",
        "floral",
        10
      ],
      [
        "florol",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        166.67,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        222.22,
        "h",
        "floral",
        100
      ],
      [
        "mayol",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "myrrh oil",
        16.67,
        "b",
        "amber",
        100
      ],
      [
        "rose oxide 10%",
        44.44,
        "h",
        "floral",
        10
      ],
      [
        "red thyme oil spain",
        27.78,
        "t",
        "green",
        100
      ],
      [
        "parmantheme",
        22.22,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-118",
    "te": "floral violet type (#118)",
    "tr": "Цветочный фиалка (тип) (#118)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring hexyl acetate, benzyl acetate, para-anisaldehyde, aldehyde C-11 undecylenic.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный фиалка (тип) (#118)». Ключевые материалы структуры: lilial, habanolide, hexyl salicylate, hedione.",
    "pr": {
      "floral": 50,
      "citrus": 15,
      "gourmand": 1,
      "spicy": 4,
      "musk": 10,
      "amber": 1,
      "green": 7
    },
    "it": [
      [
        "hexyl acetate",
        22.22,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde",
        16.67,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-11 undecylenic",
        11.11,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 lauric",
        11.11,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        66.67,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 mna",
        11.11,
        "t",
        "citrus",
        100
      ],
      [
        "muguet carbaldehyde 10%",
        16.67,
        "t",
        "citrus",
        10
      ],
      [
        "methyl anthranilate",
        5.56,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        22.22,
        "h",
        "floral",
        100
      ],
      [
        "coranol",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone",
        5.56,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-decalactone",
        11.11,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        33.33,
        "t",
        "citrus",
        100
      ],
      [
        "eugenol",
        50,
        "h",
        "spicy",
        100
      ],
      [
        "geraniol",
        22.22,
        "h",
        "floral",
        100
      ],
      [
        "habanolide",
        83.33,
        "b",
        "musk",
        100
      ],
      [
        "heliotropin",
        5.56,
        "b",
        "amber",
        100
      ],
      [
        "helvetolide",
        27.78,
        "b",
        "musk",
        100
      ],
      [
        "hivernal neo",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "iralia total",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        133.33,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        55.56,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        77.78,
        "h",
        "floral",
        100
      ],
      [
        "galbascone 10%",
        11.11,
        "h",
        "floral",
        10
      ],
      [
        "rose oxide",
        5.56,
        "h",
        "floral",
        100
      ],
      [
        "phenylhexanol",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "hexyl salicylate",
        83.33,
        "t",
        "green",
        100
      ],
      [
        "violiff",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        5.56,
        "b",
        "amber",
        100
      ],
      [
        "alpha-ionone",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "alpha-isomethyl ionone (50% min.)",
        11.11,
        "h",
        "floral",
        50
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-119",
    "te": "floral watery type",
    "tr": "Цветочный акватический (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "aquatic",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring phenyl acetaldehyde 10%, hexadecanolide, dihydro beta ionone, watermelon ketone.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный акватический (тип)». Ключевые материалы структуры: galaxolide 50 IPM, iso e super, lilial, hedione.",
    "pr": {
      "citrus": 1,
      "floral": 50,
      "amber": 1,
      "spicy": 1,
      "musk": 34,
      "woody": 17,
      "aquatic": 1
    },
    "it": [
      [
        "phenyl acetaldehyde 10%",
        2.5,
        "t",
        "citrus",
        10
      ],
      [
        "hexadecanolide",
        5,
        "h",
        "floral",
        100
      ],
      [
        "dihydro beta ionone",
        43.75,
        "h",
        "floral",
        100
      ],
      [
        "watermelon ketone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        37.5,
        "h",
        "floral",
        100
      ],
      [
        "cyclogalbanate",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "gamma-decalactone",
        2.5,
        "h",
        "gourmand",
        100
      ],
      [
        "dimetol",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "ethyl vanillin 10%",
        12.5,
        "b",
        "amber",
        10
      ],
      [
        "eugenol",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "exaltolide",
        45,
        "b",
        "musk",
        100
      ],
      [
        "galaxolide 50 IPM",
        275,
        "b",
        "musk",
        50
      ],
      [
        "hedione",
        125,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        18.75,
        "h",
        "floral",
        10
      ],
      [
        "beta-ionone",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        162.5,
        "b",
        "woody",
        100
      ],
      [
        "lilial",
        143.75,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        33.75,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        31.25,
        "h",
        "floral",
        100
      ],
      [
        "melonal 10%",
        6.25,
        "h",
        "aquatic",
        10
      ],
      [
        "paradisone",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "phenethylol",
        8.75,
        "h",
        "floral",
        100
      ],
      [
        "2,4-ivy carbaldehyde 10%",
        6.25,
        "t",
        "citrus",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-120",
    "te": "Floral woody",
    "tr": "Цветочный древесный",
    "sd": "TGSC (dm1015272) · Patent 8,557,876",
    "fa": "woody",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,557,876 Pyrimidine derivatives and their use in perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный древесный». Формула из патента 8,557,876. Ключевые материалы структуры: kharismal, ethylene brassylate, DIPG, dipropylene glycol.",
    "pr": {
      "floral": 50,
      "musk": 10,
      "citrus": 4,
      "amber": 2
    },
    "it": [
      [
        "kharismal",
        437.5,
        "h",
        "floral",
        100
      ],
      [
        "ethylene brassylate",
        125,
        "b",
        "musk",
        100
      ],
      [
        "dipropylene glycol",
        85,
        "h",
        "floral",
        100
      ],
      [
        "iso gamma super",
        75,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        37.5,
        "t",
        "citrus",
        100
      ],
      [
        "indisan",
        25,
        "h",
        "floral",
        100
      ],
      [
        "amberiff 20% IPM",
        25,
        "b",
        "amber",
        20
      ],
      [
        "laevo-citronellol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        12.5,
        "t",
        "citrus",
        100
      ],
      [
        "ambrettolide",
        7.5,
        "b",
        "musk",
        100
      ],
      [
        "geraniol",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "healingwood",
        2.5,
        "b",
        "woody",
        100
      ],
      [
        "amber xtreme 1% DPG",
        2.5,
        "b",
        "amber",
        1
      ],
      [
        "(cis+trans)-1,1,2,3,3-pentamethyl-2,3,3a,4,5,9b-hexahydro-1H-7,9-diazacyclopenta[a]naphtha",
        25,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        100,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-121",
    "te": "Accord N° 207606 Floral woody (Firmenich)",
    "tr": "Аккорд №207606 · цветочный древесный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "woody",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · In this accord, we see how CETYLIA BASE B gives the blend a floral character; very diffusive and radiant..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207606 · цветочный древесный (Firmenich)». Ключевые материалы структуры: CETYLIA® BASE B (Firmenich), HEDIONE® (Firmenich), VERTOFIX® COEUR (IFF), IRALIA® TOTAL (Firmenich).",
    "pr": {
      "citrus": 1,
      "floral": 50,
      "woody": 14
    },
    "it": [
      [
        "ALDEHYDE C11 UNDECYLENIC 50%",
        20,
        "t",
        "citrus",
        50
      ],
      [
        "HEDIONE® (Firmenich)",
        220,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        105,
        "h",
        "floral",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        215,
        "b",
        "woody",
        100
      ],
      [
        "CETYLIA® BASE B (Firmenich)",
        440,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-122",
    "te": "Accord N° 207667 Floral woody (Firmenich)",
    "tr": "Аккорд №207667 · цветочный древесный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "woody",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Soap: 1.00% · CYCLOPIDENE develops a lovely flowery top note to this accord and combines particularly well with the Ylang..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207667 · цветочный древесный (Firmenich)». Ключевые материалы структуры: PHENYLETHYL ALCOHOL, BERGAMOTE SYNTH, CEDROXYDE® (Firmenich), HEDIONE® (Firmenich).",
    "pr": {
      "floral": 50,
      "citrus": 9,
      "woody": 9
    },
    "it": [
      [
        "BENZYL ACETATE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "BERGAMOTE SYNTH",
        130,
        "t",
        "citrus",
        100
      ],
      [
        "CEDROXYDE® (Firmenich)",
        130,
        "h",
        "floral",
        100
      ],
      [
        "DORINIA SA (Firmenich)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        130,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        200,
        "h",
        "floral",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        130,
        "b",
        "woody",
        100
      ],
      [
        "YLANG SYNTH",
        60,
        "h",
        "floral",
        100
      ],
      [
        "CYCLOPIDENE (Firmenich) 10%",
        40,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-123",
    "te": "Accord N° 203430 Floral woody (Firmenich)",
    "tr": "Аккорд №203430 · цветочный древесный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "woody",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · The presence of EXALTENONE gives this accord a very rich musky effect, which is natural and enhances the rosy aspect of this woody and complex accord..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №203430 · цветочный древесный (Firmenich)». Ключевые материалы структуры: HEDIONE® HC (Firmenich), PATCHOULI OIL, ISO E SUPER® (IFF), LYRAL® (IFF).",
    "pr": {
      "floral": 50,
      "citrus": 5,
      "woody": 20,
      "gourmand": 1
    },
    "it": [
      [
        "CARBINOL MUGUET (Firmenich)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLOL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "GERANIOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® HC (Firmenich)",
        240,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "IONONE ALPHA",
        5,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER® (IFF)",
        120,
        "b",
        "woody",
        100
      ],
      [
        "LYRAL® (IFF)",
        90,
        "h",
        "floral",
        100
      ],
      [
        "OAKMOSS SYNTH",
        5,
        "b",
        "woody",
        100
      ],
      [
        "PATCHOULI OIL",
        140,
        "b",
        "woody",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        70,
        "h",
        "floral",
        100
      ],
      [
        "ROSE BASE",
        30,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "VANILLIN 10%",
        5,
        "b",
        "amber",
        10
      ],
      [
        "VIOLETTYNE MIP (Firmenich) 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "YLANG SYNTH",
        30,
        "h",
        "floral",
        100
      ],
      [
        "EXALTENONE (Firmenich)",
        20,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-124",
    "te": "Accord N° 208089 Floral woody fruity (Firmenich)",
    "tr": "Аккорд №208089 · цветочный древесный фруктовый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Soap: 1.00% · FRUIT SEC 17907 develops a full-bodied note to the accord giving it a more elegant personality..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208089 · цветочный древесный фруктовый (Firmenich)». Ключевые материалы структуры: HEDIONE® (Firmenich), LILIAL® (Givaudan), VERTOFIX® COEUR (IFF), BENZYL ACETATE.",
    "pr": {
      "floral": 50,
      "amber": 3,
      "green": 1,
      "woody": 8,
      "gourmand": 1
    },
    "it": [
      [
        "BENZYL ACETATE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "CETALOX® (Firmenich) 10%",
        30,
        "b",
        "amber",
        10
      ],
      [
        "CIS-3-HEXENYL SALICYLATE",
        20,
        "t",
        "green",
        100
      ],
      [
        "COUMARIN",
        20,
        "b",
        "amber",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        55,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        200,
        "h",
        "floral",
        100
      ],
      [
        "INDOL 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "LILIAL® (Givaudan)",
        200,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "METHYL ANTHRANILATE",
        10,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        70,
        "h",
        "floral",
        100
      ],
      [
        "SANDALWOOD BASE 77125 B (Firmenich)",
        10,
        "b",
        "woody",
        100
      ],
      [
        "STYRALLYL ACETATE",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        120,
        "b",
        "woody",
        100
      ],
      [
        "YLANG SYNTH",
        30,
        "h",
        "floral",
        100
      ],
      [
        "FRUIT SEC 17907 (Firmenich)",
        5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-125",
    "te": "Floral woody herbal fragrance",
    "tr": "Цветочный древесный травянистый аромат",
    "sd": "TGSC (dm1015272) · Patent 5,990,076",
    "fa": "green",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,990,076 Benzodioxepinone and its use in perfumery.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный древесный травянистый аромат». Формула из патента 5,990,076. Ключевые материалы структуры: dihydromyrcenol, linalyl acetate, habanolide, hedione.",
    "pr": {
      "woody": 23,
      "citrus": 50,
      "gourmand": 4,
      "green": 17,
      "spicy": 5,
      "amber": 1,
      "floral": 24,
      "musk": 11
    },
    "it": [
      [
        "wormwood oil",
        50,
        "b",
        "woody",
        100
      ],
      [
        "linalyl acetate",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "intreleven aldehyde 10%",
        2.5,
        "t",
        "citrus",
        10
      ],
      [
        "allyl amyl glycolate",
        25,
        "h",
        "gourmand",
        100
      ],
      [
        "armoise oil",
        17.5,
        "t",
        "green",
        100
      ],
      [
        "cinnamon bark oil",
        2.5,
        "h",
        "spicy",
        100
      ],
      [
        "cardamom seed oil",
        12.5,
        "h",
        "spicy",
        100
      ],
      [
        "coumarin",
        7.5,
        "b",
        "amber",
        100
      ],
      [
        "alpha-damascone",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        225,
        "t",
        "citrus",
        100
      ],
      [
        "estragol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "floropal",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "galbanum oil 10%",
        10,
        "t",
        "green",
        10
      ],
      [
        "clove bud oil",
        20,
        "h",
        "spicy",
        100
      ],
      [
        "habanolide",
        82.5,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        75,
        "h",
        "floral",
        100
      ],
      [
        "iralia total",
        20,
        "h",
        "floral",
        100
      ],
      [
        "isobutyl quinoleine",
        5,
        "h",
        "floral",
        100
      ],
      [
        "lavandin oil",
        37.5,
        "t",
        "green",
        100
      ],
      [
        "mandarin oil",
        35,
        "t",
        "citrus",
        100
      ],
      [
        "veramoss",
        25,
        "b",
        "woody",
        100
      ],
      [
        "rose oxide 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "patchouli oil",
        70,
        "b",
        "woody",
        100
      ],
      [
        "polysantol",
        25,
        "b",
        "woody",
        100
      ],
      [
        "clary sage oil",
        25,
        "t",
        "green",
        100
      ],
      [
        "triplal 10%",
        30,
        "t",
        "green",
        10
      ],
      [
        "galbex 183",
        45,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        15,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-126",
    "te": "floral woody herbal type",
    "tr": "Цветочный древесный травянистый (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, bornyl acetate, linalyl acetate, aldehyde C-10 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный древесный травянистый (тип)». Ключевые материалы структуры: linalyl acetate, bergamot oil, hedione HC, linalool.",
    "pr": {
      "floral": 50,
      "citrus": 43,
      "gourmand": 5,
      "amber": 4,
      "green": 9,
      "spicy": 3,
      "woody": 27
    },
    "it": [
      [
        "benzyl acetate",
        2.94,
        "h",
        "floral",
        100
      ],
      [
        "bornyl acetate",
        2.94,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        132.35,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-10 10%",
        5.88,
        "t",
        "citrus",
        10
      ],
      [
        "aldehyde C-12 mna 10%",
        2.94,
        "t",
        "citrus",
        10
      ],
      [
        "allyl amyl glycolate 10%",
        17.65,
        "h",
        "gourmand",
        10
      ],
      [
        "ambrox",
        2.94,
        "b",
        "amber",
        100
      ],
      [
        "spike lavender oil",
        5.88,
        "t",
        "green",
        100
      ],
      [
        "bergamot oil",
        117.65,
        "t",
        "citrus",
        100
      ],
      [
        "cardamom seed oil 10%",
        14.71,
        "h",
        "spicy",
        10
      ],
      [
        "citral",
        2.94,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        20.59,
        "h",
        "floral",
        100
      ],
      [
        "coranol",
        44.12,
        "h",
        "floral",
        100
      ],
      [
        "coumarin 10%",
        14.71,
        "b",
        "amber",
        10
      ],
      [
        "cyclogalbanate",
        4.41,
        "h",
        "floral",
        100
      ],
      [
        "sandalrome",
        5.88,
        "b",
        "woody",
        100
      ],
      [
        "delta-damascone 1%",
        8.82,
        "h",
        "gourmand",
        1
      ],
      [
        "dihydromyrcenol",
        35.29,
        "t",
        "citrus",
        100
      ],
      [
        "eugenol",
        5.88,
        "h",
        "spicy",
        100
      ],
      [
        "galbanum oil 10%",
        2.94,
        "t",
        "green",
        10
      ],
      [
        "hedione HC",
        117.65,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        5.88,
        "b",
        "amber",
        100
      ],
      [
        "iralia total",
        8.82,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        58.82,
        "b",
        "woody",
        100
      ],
      [
        "lavandin oil grosso",
        2.94,
        "t",
        "green",
        100
      ],
      [
        "liffarome 10%",
        7.35,
        "h",
        "floral",
        10
      ],
      [
        "linalool",
        117.65,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        11.76,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        8.82,
        "t",
        "citrus",
        100
      ],
      [
        "veramoss 10%",
        8.82,
        "b",
        "woody",
        10
      ],
      [
        "patchouli oil",
        38.24,
        "b",
        "woody",
        100
      ],
      [
        "polysantol",
        11.76,
        "b",
        "woody",
        100
      ],
      [
        "basil oil",
        26.47,
        "t",
        "green",
        100
      ],
      [
        "benzyl salicylate",
        14.71,
        "t",
        "green",
        100
      ],
      [
        "sandalwood oil",
        20.59,
        "b",
        "woody",
        100
      ],
      [
        "leafy oxime 10%",
        8.82,
        "h",
        "floral",
        10
      ],
      [
        "triplal 10%",
        11.76,
        "t",
        "green",
        10
      ],
      [
        "vanillin 10%",
        2.94,
        "b",
        "amber",
        10
      ],
      [
        "verdox",
        5.88,
        "h",
        "gourmand",
        100
      ],
      [
        "vertofix",
        50,
        "b",
        "woody",
        100
      ],
      [
        "geranium oil china",
        8.82,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-127",
    "te": "Floral woody musk (IFF)",
    "tr": "Цветочный древесный мускусный (IFF)",
    "sd": "TGSC (dm1015272) · Patent 8,709,993",
    "fa": "woody",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,709,993 Quinazoline compounds and their use in perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный древесный мускусный (IFF)». Формула из патента 8,709,993. Ключевые материалы структуры: kharismal, ethylene brassylate, DIPG, dipropylene glycol.",
    "pr": {
      "floral": 50,
      "musk": 10,
      "citrus": 4,
      "amber": 2
    },
    "it": [
      [
        "kharismal",
        437.5,
        "h",
        "floral",
        100
      ],
      [
        "ethylene brassylate",
        125,
        "b",
        "musk",
        100
      ],
      [
        "dipropylene glycol",
        85,
        "h",
        "floral",
        100
      ],
      [
        "methyl ionone gamma supreme",
        75,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        37.5,
        "t",
        "citrus",
        100
      ],
      [
        "indisan",
        25,
        "h",
        "floral",
        100
      ],
      [
        "amberiff 20% IPM",
        25,
        "b",
        "amber",
        20
      ],
      [
        "laevo-citronellol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        12.5,
        "t",
        "citrus",
        100
      ],
      [
        "ambrettolide",
        7.5,
        "b",
        "musk",
        100
      ],
      [
        "geraniol 980",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "healingwood",
        2.5,
        "b",
        "woody",
        100
      ],
      [
        "Amber Xtreme 1% DPG",
        2.5,
        "b",
        "amber",
        1
      ],
      [
        "(cis+trans)-6,6a,7,8,9,9a-hexahydro-7,7,8,9,9-pentamethyl-5H-cyclopenta[H]quinazoline",
        25,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        100,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-128",
    "te": "Floral ylang woody and chypre",
    "tr": "Цветочно-древесный шипр с иланг-илангом",
    "sd": "TGSC (dm1015272) · Patent EP1791934",
    "fa": "woody",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent EP1791934 B1 Perfuming ingredients with saffron odor.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочно-древесный шипр с иланг-илангом». Формула из патента EP1791934. Ключевые материалы структуры: benzyl salicylate, linalyl acetate, hedione, iralia total.",
    "pr": {
      "floral": 50,
      "citrus": 17,
      "gourmand": 1,
      "musk": 8,
      "woody": 20,
      "green": 23
    },
    "it": [
      [
        "benzyl acetate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "styrallyl acetate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "aldehyde C-11 undecylic",
        4,
        "t",
        "citrus",
        100
      ],
      [
        "cetalox 10%",
        2,
        "b",
        "amber",
        10
      ],
      [
        "lemon oil italy",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl vanillin",
        2,
        "b",
        "amber",
        100
      ],
      [
        "eugenol",
        4,
        "h",
        "spicy",
        100
      ],
      [
        "exaltolide",
        60,
        "b",
        "musk",
        100
      ],
      [
        "geranium oil bourbon",
        40,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "iralia total",
        100,
        "h",
        "floral",
        100
      ],
      [
        "lilyflore",
        4,
        "h",
        "floral",
        100
      ],
      [
        "mousse moss",
        2,
        "h",
        "floral",
        100
      ],
      [
        "muscenone delta",
        4,
        "b",
        "musk",
        100
      ],
      [
        "para-cresol 1%",
        4,
        "h",
        "floral",
        1
      ],
      [
        "phenethylol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "polysantol",
        4,
        "b",
        "woody",
        100
      ],
      [
        "woody acetate",
        100,
        "b",
        "woody",
        100
      ],
      [
        "benzyl salicylate",
        180,
        "t",
        "green",
        100
      ],
      [
        "clary sage oil france",
        10,
        "t",
        "green",
        100
      ],
      [
        "vertofix",
        60,
        "b",
        "woody",
        100
      ],
      [
        "ylang ylang oil",
        40,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-129",
    "te": "Floral-Fruity Fragrance Composition",
    "tr": "Цветочно-фруктовая парфюмерная композиция",
    "sd": "TGSC (dm1015272) · Patent 9,440,097",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 9,440,097 Organic compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочно-фруктовая парфюмерная композиция». Формула из патента 9,440,097. Ключевые материалы структуры: hedione, cis-3-hexenyl salicylate, phenethyl salicylate, cyclohexyl salicylate.",
    "pr": {
      "floral": 50,
      "citrus": 3,
      "musk": 5,
      "green": 26
    },
    "it": [
      [
        "citronellyl acetate",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        3.33,
        "t",
        "citrus",
        100
      ],
      [
        "ambrettolide",
        44.44,
        "b",
        "musk",
        100
      ],
      [
        "ambrofix 10%",
        8.89,
        "h",
        "floral",
        10
      ],
      [
        "bourgeonal",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "centifolyl",
        50,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        8.89,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl linalool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "florol",
        27.78,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        13.33,
        "b",
        "musk",
        50
      ],
      [
        "hedione",
        277.78,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol 10%",
        3.33,
        "t",
        "green",
        10
      ],
      [
        "phenethyl isobutyrate",
        27.78,
        "h",
        "floral",
        100
      ],
      [
        "ethyl 2-methyl butyrate 10%",
        3.33,
        "h",
        "gourmand",
        10
      ],
      [
        "neroline 10%",
        2.22,
        "t",
        "citrus",
        10
      ],
      [
        "orange oil brazil",
        16.67,
        "t",
        "citrus",
        100
      ],
      [
        "pomarose 10%",
        3.33,
        "h",
        "floral",
        10
      ],
      [
        "prunella",
        3.33,
        "h",
        "floral",
        100
      ],
      [
        "cyclohexyl salicylate",
        83.33,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        111.11,
        "t",
        "green",
        100
      ],
      [
        "hexyl salicylate",
        22.22,
        "t",
        "green",
        100
      ],
      [
        "phenethyl salicylate",
        88.89,
        "t",
        "green",
        100
      ],
      [
        "silvial",
        50,
        "h",
        "floral",
        100
      ],
      [
        "tropional",
        44.44,
        "h",
        "floral",
        100
      ],
      [
        "velvione",
        11.11,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-130",
    "te": "Floral, Spicy, Green Fragrance Composition",
    "tr": "Цветочно-пряная зелёная парфюмерная композиция",
    "sd": "TGSC (dm1015272) · Patent 9,440,097",
    "fa": "spicy",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 9,440,097 Organic compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочно-пряная зелёная парфюмерная композиция». Формула из патента 9,440,097. Ключевые материалы структуры: phenethyl salicylate, cis-3-hexenyl salicylate, isoraldeine 70, phenethyl alcohol.",
    "pr": {
      "floral": 50,
      "citrus": 6,
      "green": 20,
      "woody": 5
    },
    "it": [
      [
        "dimethyl benzyl carbinyl acetate",
        26.37,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        73.84,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        79.11,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate",
        3.16,
        "h",
        "floral",
        100
      ],
      [
        "cosmone",
        42.19,
        "h",
        "floral",
        100
      ],
      [
        "florol",
        73.84,
        "h",
        "floral",
        100
      ],
      [
        "galbanum oil",
        36.92,
        "t",
        "green",
        100
      ],
      [
        "gardenol",
        15.82,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        58.02,
        "h",
        "floral",
        100
      ],
      [
        "indole 1%",
        47.47,
        "h",
        "floral",
        1
      ],
      [
        "isoraldeine 70",
        84.39,
        "h",
        "floral",
        100
      ],
      [
        "methyl diantilis",
        47.47,
        "h",
        "floral",
        100
      ],
      [
        "nirvanolide",
        47.47,
        "h",
        "floral",
        100
      ],
      [
        "peche pure",
        3.16,
        "h",
        "floral",
        100
      ],
      [
        "peonile",
        58.02,
        "h",
        "floral",
        100
      ],
      [
        "eugenyl phenyl acetate",
        21.1,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl salicylate",
        105.49,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        105.49,
        "t",
        "green",
        100
      ],
      [
        "vertofix coeur",
        58.02,
        "b",
        "woody",
        100
      ],
      [
        "ylang ylang oil",
        12.66,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-131",
    "te": "Accord Number 1253 - Quintessence Florale (IFF) (#131)",
    "tr": "Аккорд №1253 · Цветочная квинтэссенция (IFF) (#131)",
    "sd": "TGSC (dm1015272) · IFF",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring ALDEHYDE C-12 LAURIC 10%, LEMON OIL, TETRAHYDRO MYRCENOL (IFF), TETRAMERAN (IFF).",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №1253 · Цветочная квинтэссенция (IFF) (#131)». Ключевые материалы структуры: BENZYL SALICYLATE, GALAXOLIDE® UNDILUTED (IFF), LYRAL® (IFF), ISO E SUPER® (IFF).",
    "pr": {
      "citrus": 2,
      "floral": 50,
      "green": 11,
      "gourmand": 1,
      "musk": 9,
      "woody": 6
    },
    "it": [
      [
        "ALDEHYDE C-12 LAURIC 10%",
        2,
        "t",
        "citrus",
        10
      ],
      [
        "LEMON OIL",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "TETRAHYDRO MYRCENOL (IFF)",
        16,
        "h",
        "floral",
        100
      ],
      [
        "TETRAMERAN (IFF)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "ALDEHYDE C-10 10%",
        3,
        "t",
        "citrus",
        10
      ],
      [
        "ALDEHYDE C-11 ULENIC 10%",
        3,
        "t",
        "citrus",
        10
      ],
      [
        "HEXENYL SALICYLATE CIS 3- (IFF)",
        14,
        "t",
        "green",
        100
      ],
      [
        "MONTAVERDI® (IFF)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "GALBASCONE (IFF)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "ACALEA (IFF)",
        36,
        "h",
        "floral",
        100
      ],
      [
        "AMYL BENZOATE",
        1,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL ACETATE",
        69,
        "h",
        "floral",
        100
      ],
      [
        "GERANIOL 980 (IFF)",
        15,
        "h",
        "floral",
        100
      ],
      [
        "KHARISMAL® (IFF)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "LYRAL® (IFF)",
        80,
        "h",
        "floral",
        100
      ],
      [
        "MEIJIFF™ (IFF)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "MELAFLEUR (IFF)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "METHYL BENZOATE",
        1,
        "h",
        "floral",
        100
      ],
      [
        "METHYL DH JASMONATE",
        40,
        "h",
        "floral",
        100
      ],
      [
        "METHYL IONONE GAMMA A (IFF)",
        24,
        "h",
        "floral",
        100
      ],
      [
        "PHENOXANOL® (IFF)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "PHENOXY ETHYL ISO BUTYRATE (IFF)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "PHENYL ACETALDEHYDE 10%",
        3,
        "t",
        "citrus",
        10
      ],
      [
        "PHENYL ETHYL ALCOHOL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "ROSEATE (IFF)",
        1,
        "h",
        "aquatic",
        100
      ],
      [
        "STYRALYL ACETATE",
        6,
        "h",
        "floral",
        100
      ],
      [
        "VIOLIFF (IFF)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCONE DELTA 10% (IFF)",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "DECALACTONE, GAMMA 10%",
        6,
        "h",
        "gourmand",
        10
      ],
      [
        "METHYL ANTHRANILATE",
        14,
        "h",
        "floral",
        100
      ],
      [
        "NECTARATE™ (IFF)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "UNDECALACTONE GAMMA",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "ISO CYCLO GERANIOL (IFF)",
        4,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        128,
        "t",
        "green",
        100
      ],
      [
        "ETHYL VANILLIN",
        5,
        "b",
        "amber",
        100
      ],
      [
        "GALAXOLIDE® UNDILUTED (IFF)",
        116,
        "b",
        "musk",
        100
      ],
      [
        "GRISALVA (IFF)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "BORNAFIX® (IFF)",
        33,
        "h",
        "floral",
        100
      ],
      [
        "CEDRYL ACETATE (IFF)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDRO BETA IONONE (IFF)",
        14,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER® (IFF)",
        74,
        "b",
        "woody",
        100
      ],
      [
        "SANJINOL (IFF)",
        38,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-132",
    "te": "Accord Number 1253 - Quintessence Florale (IFF) (#132)",
    "tr": "Аккорд №1253 · Цветочная квинтэссенция (IFF) (#132)",
    "sd": "TGSC (dm1015272) · IFF",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring ALDEHYDE C-12 LAURIC 10%, LEMON OIL, TETRAHYDRO MYRCENOL (IFF), TETRAMERAN (IFF).",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №1253 · Цветочная квинтэссенция (IFF) (#132)». Ключевые материалы структуры: BENZYL SALICYLATE, GALAXOLIDE® UNDILUTED (IFF), LYRAL® (IFF), ISO E SUPER® (IFF).",
    "pr": {
      "citrus": 2,
      "floral": 50,
      "green": 11,
      "gourmand": 1,
      "musk": 9,
      "woody": 6
    },
    "it": [
      [
        "ALDEHYDE C-12 LAURIC 10%",
        2,
        "t",
        "citrus",
        10
      ],
      [
        "LEMON OIL",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "TETRAHYDRO MYRCENOL (IFF)",
        16,
        "h",
        "floral",
        100
      ],
      [
        "TETRAMERAN (IFF)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "ALDEHYDE C-10 10%",
        3,
        "t",
        "citrus",
        10
      ],
      [
        "ALDEHYDE C-11 ULENIC 10%",
        3,
        "t",
        "citrus",
        10
      ],
      [
        "HEXENYL SALICYLATE CIS 3- (IFF)",
        14,
        "t",
        "green",
        100
      ],
      [
        "MONTAVERDI® (IFF)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "GALBASCONE (IFF)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "ACALEA (IFF)",
        36,
        "h",
        "floral",
        100
      ],
      [
        "AMYL BENZOATE",
        1,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL ACETATE",
        69,
        "h",
        "floral",
        100
      ],
      [
        "GERANIOL 980 (IFF)",
        15,
        "h",
        "floral",
        100
      ],
      [
        "KHARISMAL® (IFF)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "LYRAL® (IFF)",
        80,
        "h",
        "floral",
        100
      ],
      [
        "MEIJIFF™ (IFF)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "MELAFLEUR (IFF)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "METHYL BENZOATE",
        1,
        "h",
        "floral",
        100
      ],
      [
        "METHYL DH JASMONATE",
        40,
        "h",
        "floral",
        100
      ],
      [
        "METHYL IONONE GAMMA A (IFF)",
        24,
        "h",
        "floral",
        100
      ],
      [
        "PHENOXANOL® (IFF)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "PHENOXY ETHYL ISO BUTYRATE (IFF)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "PHENYL ACETALDEHYDE 10%",
        3,
        "t",
        "citrus",
        10
      ],
      [
        "PHENYL ETHYL ALCOHOL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "ROSEATE (IFF)",
        1,
        "h",
        "aquatic",
        100
      ],
      [
        "STYRALYL ACETATE",
        6,
        "h",
        "floral",
        100
      ],
      [
        "VIOLIFF (IFF)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCONE DELTA 10% (IFF)",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "DECALACTONE, GAMMA 10%",
        6,
        "h",
        "gourmand",
        10
      ],
      [
        "METHYL ANTHRANILATE",
        14,
        "h",
        "floral",
        100
      ],
      [
        "NECTARATE™ (IFF)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "UNDECALACTONE GAMMA",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "ISO CYCLO GERANIOL (IFF)",
        4,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        128,
        "t",
        "green",
        100
      ],
      [
        "ETHYL VANILLIN",
        5,
        "b",
        "amber",
        100
      ],
      [
        "GALAXOLIDE® UNDILUTED (IFF)",
        116,
        "b",
        "musk",
        100
      ],
      [
        "GRISALVA (IFF)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "BORNAFIX® (IFF)",
        33,
        "h",
        "floral",
        100
      ],
      [
        "CEDRYL ACETATE (IFF)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDRO BETA IONONE (IFF)",
        14,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER® (IFF)",
        74,
        "b",
        "woody",
        100
      ],
      [
        "SANJINOL (IFF)",
        38,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-133",
    "te": "Floriental Accord",
    "tr": "Восточно-цветочный аккорд (Флориенталь)",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "amber",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Восточно-цветочный аккорд (Флориенталь)». Ключевые материалы структуры: hedione, DIPG, lyral, lilial.",
    "pr": {
      "spicy": 1,
      "floral": 50,
      "amber": 1,
      "aquatic": 2,
      "woody": 3,
      "gourmand": 2
    },
    "it": [
      [
        "cashmeran",
        4,
        "b",
        "musk",
        100
      ],
      [
        "coriander seed oil",
        8,
        "h",
        "spicy",
        100
      ],
      [
        "DIPG",
        120,
        "b",
        "aquatic",
        0
      ],
      [
        "ethyl linalool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "ethyl vanillin",
        10,
        "b",
        "amber",
        100
      ],
      [
        "floralozone",
        2,
        "h",
        "aquatic",
        100
      ],
      [
        "florol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        400,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        30,
        "h",
        "aquatic",
        100
      ],
      [
        "iso e super",
        15,
        "b",
        "woody",
        100
      ],
      [
        "jasmin absolute 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "lactone of cis jasmone",
        7,
        "h",
        "gourmand",
        100
      ],
      [
        "lavender oil 10%",
        6,
        "t",
        "green",
        10
      ],
      [
        "lilial",
        70,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        75,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate 1%",
        5,
        "h",
        "floral",
        1
      ],
      [
        "methyl ionone gamma supreme",
        55,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        3,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "veramoss 10%",
        20,
        "b",
        "woody",
        10
      ],
      [
        "vertofix",
        8,
        "b",
        "woody",
        100
      ],
      [
        "cis-6-nonenol 10%",
        50,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-134",
    "te": "Asian Flower Accord",
    "tr": "Аккорд азиатских цветов",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд азиатских цветов». Ключевые материалы структуры: beta-ionone, gamma-decalactone, dihydro beta ionone, DIPG.",
    "pr": {
      "citrus": 1,
      "gourmand": 13,
      "floral": 50
    },
    "it": [
      [
        "citral",
        8.5,
        "t",
        "citrus",
        100
      ],
      [
        "gamma-decalactone",
        180,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydro beta ionone",
        175,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        139.5,
        "b",
        "aquatic",
        0
      ],
      [
        "geraniol",
        16,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        2,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        30,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        360,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        65,
        "h",
        "floral",
        100
      ],
      [
        "linalool oxide",
        6,
        "h",
        "floral",
        100
      ],
      [
        "nerol",
        2,
        "h",
        "floral",
        100
      ],
      [
        "guavanate 10%",
        16,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-135",
    "te": "Artic Flower Accord",
    "tr": "Аккорд арктических цветов",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд арктических цветов». Ключевые материалы структуры: DIPG, dihydromyrcenol, linalyl acetate, tonalid.",
    "pr": {
      "gourmand": 5,
      "amber": 3,
      "citrus": 50,
      "floral": 35,
      "woody": 16,
      "green": 4
    },
    "it": [
      [
        "allyl amyl glycolate",
        19,
        "h",
        "gourmand",
        100
      ],
      [
        "ambroxan",
        20,
        "b",
        "amber",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "citral",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-damascone 10%",
        16,
        "h",
        "gourmand",
        10
      ],
      [
        "dihydromyrcenol",
        190,
        "t",
        "citrus",
        100
      ],
      [
        "DIPG",
        212,
        "b",
        "aquatic",
        0
      ],
      [
        "geranium oil africa",
        10,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        60,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        30,
        "b",
        "woody",
        100
      ],
      [
        "lavandin oil grosso",
        30,
        "t",
        "green",
        100
      ],
      [
        "limediene 1%",
        30,
        "t",
        "citrus",
        1
      ],
      [
        "linalool",
        38,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        90,
        "t",
        "citrus",
        100
      ],
      [
        "methyl ionone gamma supreme",
        20,
        "h",
        "floral",
        100
      ],
      [
        "precyclemone B",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "tonalid",
        80,
        "h",
        "floral",
        100
      ],
      [
        "vertofix",
        80,
        "b",
        "woody",
        100
      ],
      [
        "tropical dienoate 5%",
        38,
        "h",
        "floral",
        5
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-136",
    "te": "White flower accord for eaux de toilette",
    "tr": "Белоцветочный аккорд для туалетной воды",
    "sd": "TGSC (dm1015272) · Patent 5,264,615",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDT",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,264,615 Schiff bases.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Белоцветочный аккорд для туалетной воды». Формула из патента 5,264,615. Ключевые материалы структуры: alpha-hexyl cinnamaldehyde, hedione, phenethyl alcohol, hydroxycitronellal.",
    "pr": {
      "woody": 5,
      "floral": 50,
      "citrus": 34,
      "green": 8,
      "spicy": 1,
      "amber": 1
    },
    "it": [
      [
        "cedarwood oil virginia",
        50,
        "b",
        "woody",
        100
      ],
      [
        "benzyl acetate",
        80,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "isoraldeine",
        30,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        120,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        120,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl salicylate",
        70,
        "t",
        "green",
        100
      ],
      [
        "hedione",
        150,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "cetonial",
        15,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        15,
        "t",
        "green",
        100
      ],
      [
        "evernyl",
        5,
        "b",
        "woody",
        100
      ],
      [
        "clove bud oil",
        8,
        "h",
        "spicy",
        100
      ],
      [
        "heliotropin",
        8,
        "b",
        "amber",
        100
      ],
      [
        "mandarin oil",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "phenyl acetaldehyde",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-11 undecylenic 1%",
        2,
        "t",
        "citrus",
        1
      ],
      [
        "methyl-N-[(1,1,3,4,4-pentamethyltetralin-6-yl)methylidene]anthranilate/7-Formyl-1,1,2,4,4-pentamethyltetralin",
        60,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-137",
    "te": "Flower Garden Accord",
    "tr": "Аккорд цветочного сада",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд цветочного сада». Ключевые материалы структуры: benzyl acetate, alpha-hexyl cinnamaldehyde, hedione, linalyl acetate.",
    "pr": {
      "floral": 50,
      "spicy": 5,
      "citrus": 23,
      "leathery": 5,
      "gourmand": 5,
      "amber": 1
    },
    "it": [
      [
        "benzyl acetate",
        170,
        "h",
        "floral",
        100
      ],
      [
        "cinnamic alcohol 10%",
        40,
        "h",
        "spicy",
        10
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        80,
        "b",
        "aquatic",
        0
      ],
      [
        "eugenol",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        110,
        "t",
        "citrus",
        100
      ],
      [
        "hydroxycitronellal",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "isobutyl quinoline 0.1%",
        50,
        "b",
        "leathery",
        0.1
      ],
      [
        "indole 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "lactone of cis jasmone",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "linalool",
        40,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        90,
        "t",
        "citrus",
        100
      ],
      [
        "methyl anthranilate 10%",
        20,
        "h",
        "floral",
        10
      ],
      [
        "neryl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "peru balsam oil",
        10,
        "b",
        "amber",
        100
      ],
      [
        "phenoxyethyl isobutyrate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl butyrate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "ylang ylang oil",
        40,
        "h",
        "floral",
        100
      ],
      [
        "honeyflor 1%",
        30,
        "h",
        "gourmand",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-138",
    "te": "Flower Shop Accord",
    "tr": "Аккорд цветочной лавки",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "musk",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд цветочной лавки». Ключевые материалы структуры: ethylene brassylate, iso e super, DIPG, phenethyl alcohol.",
    "pr": {
      "floral": 46,
      "spicy": 2,
      "musk": 50,
      "citrus": 13,
      "woody": 33
    },
    "it": [
      [
        "cananga oil",
        3.98,
        "h",
        "floral",
        100
      ],
      [
        "coriander seed oil",
        9.94,
        "h",
        "spicy",
        100
      ],
      [
        "DIPG",
        139.17,
        "b",
        "aquatic",
        0
      ],
      [
        "ethylene brassylate",
        298.21,
        "b",
        "musk",
        100
      ],
      [
        "florol",
        4.97,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        0.99,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        21.87,
        "t",
        "citrus",
        100
      ],
      [
        "isocyclogeraniol",
        1.99,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        198.81,
        "b",
        "woody",
        100
      ],
      [
        "alpha-isomethyl ionone (50% min.)",
        9.94,
        "h",
        "floral",
        50
      ],
      [
        "lemon oil",
        19.88,
        "t",
        "citrus",
        100
      ],
      [
        "limediene 0.1%",
        9.94,
        "t",
        "citrus",
        0.1
      ],
      [
        "linalool",
        15.9,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        19.88,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        19.88,
        "h",
        "floral",
        100
      ],
      [
        "mayol",
        4.97,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        41.75,
        "h",
        "floral",
        100
      ],
      [
        "nerolidol",
        4.97,
        "t",
        "citrus",
        100
      ],
      [
        "phenoxanol",
        62.62,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        99.4,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        9.94,
        "h",
        "floral",
        100
      ],
      [
        "lactone of cis jasmone",
        0.99,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-139",
    "te": "Fresh flowery bouquet for soaps and body care",
    "tr": "Свежий цветочный букет для мыла и ухода за телом",
    "sd": "TGSC (dm1015272) · Patent 6,043,210",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,043,210 Preparation of thiamacrolide compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Свежий цветочный букет для мыла и ухода за телом». Формула из патента 6,043,210. Ключевые материалы структуры: linalool, alpha-hexyl cinnamaldehyde, woody acetate, isoraldeine 95.",
    "pr": {
      "floral": 50,
      "citrus": 25,
      "woody": 9
    },
    "it": [
      [
        "11-thia-15-pentadecanolide",
        50,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "laevo-bornyl acetate",
        6,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "woody acetate",
        100,
        "b",
        "woody",
        100
      ],
      [
        "verdyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        130,
        "t",
        "citrus",
        100
      ],
      [
        "allyl amyl glycolate",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "cedarwood oil virginia",
        10,
        "b",
        "woody",
        100
      ],
      [
        "damascenone 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "dihydromyrcenol",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "dimethyl octenone",
        7,
        "h",
        "floral",
        100
      ],
      [
        "florhydral",
        4,
        "h",
        "floral",
        100
      ],
      [
        "givescone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "indolene",
        4,
        "h",
        "floral",
        100
      ],
      [
        "isoraldeine 95",
        100,
        "h",
        "floral",
        100
      ],
      [
        "citral",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        200,
        "h",
        "floral",
        100
      ],
      [
        "nectaryl",
        10,
        "h",
        "floral",
        100
      ],
      [
        "okoumal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "tangerinol",
        1,
        "h",
        "floral",
        100
      ],
      [
        "acetyl cedrene",
        100,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-140",
    "te": "Flowery composition (Patent 5,214,160)",
    "tr": "Цветочный композиция (Патент 5,214,160)",
    "sd": "TGSC (dm1015272) · Patent 5,214,160",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,214,160 Acetyl-tri-and-tetramethyl-octahydronaphthalenes and fragrance compositions containing same.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный композиция (Патент 5,214,160)». Формула из патента 5,214,160. Ключевые материалы структуры: phenethyl alcohol, benzyl salicylate, bergamot essence, alpha-isomethyl ionone (50% min.).",
    "pr": {
      "gourmand": 1,
      "floral": 50,
      "spicy": 3,
      "citrus": 14,
      "musk": 9,
      "amber": 2,
      "green": 10
    },
    "it": [
      [
        "styrallyl acetate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "geranyl acetate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "methyl isoeugenol",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "geraniol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "thibetolide",
        20,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        20,
        "h",
        "spicy",
        100
      ],
      [
        "methyl dihydrojasmonate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        40,
        "b",
        "musk",
        50
      ],
      [
        "heliotropin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "benzyl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "cyclohexal",
        40,
        "h",
        "floral",
        100
      ],
      [
        "musk ketone",
        50,
        "b",
        "musk",
        100
      ],
      [
        "alpha-isomethyl ionone (50% min.)",
        80,
        "h",
        "floral",
        50
      ],
      [
        "phenethyl alcohol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        100,
        "t",
        "green",
        100
      ],
      [
        "bergamot essence",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "DIPG",
        80,
        "b",
        "aquatic",
        0
      ],
      [
        "(.+-.)-3.alpha.-acetyl-3.beta.,4.beta.,5,5-tetramethyl-2,3,4,4a.beta.,5,6,7,8-octahydronaphthalene",
        80,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-141",
    "te": "Flowery composition (Patent 5,214,160)",
    "tr": "Цветочный композиция (Патент 5,214,160)",
    "sd": "TGSC (dm1015272) · Patent 5,214,160",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,214,160 Acetyl-tri-and-tetramethyl-octahydronaphthalenes and fragrance compositions containing same.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный композиция (Патент 5,214,160)». Формула из патента 5,214,160. Ключевые материалы структуры: bergamot essence, (.+-.)-3.alpha.-acetyl-3.beta.,4.beta.,5,5-tetramethyl-2,3,4,4a.beta.,5,6,7,8-octahydronaphthalene, methyl cedryl ketone, fixolide.",
    "pr": {
      "green": 3,
      "floral": 50,
      "spicy": 1,
      "amber": 2,
      "woody": 5,
      "citrus": 32,
      "musk": 10
    },
    "it": [
      [
        "triplal",
        1,
        "t",
        "green",
        100
      ],
      [
        "geranium oil bourbon",
        5,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "vanillin 10%",
        5,
        "b",
        "amber",
        10
      ],
      [
        "indole 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "undecavertol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        10,
        "b",
        "amber",
        100
      ],
      [
        "patchouli oil",
        20,
        "b",
        "woody",
        100
      ],
      [
        "isoamyl salicylate",
        30,
        "t",
        "green",
        100
      ],
      [
        "dihydromyrcenol",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "sandalore",
        30,
        "b",
        "woody",
        100
      ],
      [
        "mandarin oil",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "methyl cedryl ketone",
        100,
        "h",
        "floral",
        100
      ],
      [
        "fixolide",
        100,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        100,
        "b",
        "musk",
        50
      ],
      [
        "bergamot essence",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "lilial",
        60,
        "h",
        "floral",
        100
      ],
      [
        "(.+-.)-3.alpha.-acetyl-3.beta.,4.beta.,5,5-tetramethyl-2,3,4,4a.beta.,5,6,7,8-octahydronaphthalene",
        150,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-142",
    "te": "Fresh flowery feminine type",
    "tr": "Свежий цветочный женский (тип)",
    "sd": "TGSC (dm1015272) · Patent 5,837,671",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,837,671 Organoleptic compound and composition.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Свежий цветочный женский (тип)». Формула из патента 5,837,671. Ключевые материалы структуры: hedione, DIPG, galaxolide 50 IPM, bergamot oil bergaptene reduced.",
    "pr": {
      "floral": 50,
      "citrus": 33,
      "aquatic": 1,
      "amber": 1,
      "gourmand": 1,
      "woody": 8,
      "musk": 14,
      "green": 1
    },
    "it": [
      [
        "benzyl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "bergamot oil bergaptene reduced",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "calone 1951 10%",
        5,
        "h",
        "aquatic",
        10
      ],
      [
        "laevo-carvone 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "cetalox",
        5,
        "b",
        "amber",
        100
      ],
      [
        "coumarin",
        3,
        "b",
        "amber",
        100
      ],
      [
        "cyclogalbanate",
        3,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "ebanol",
        5,
        "b",
        "woody",
        100
      ],
      [
        "evernyl",
        5,
        "b",
        "woody",
        100
      ],
      [
        "floralozone 10%",
        5,
        "h",
        "aquatic",
        10
      ],
      [
        "galaxolide 50 IPM",
        110,
        "b",
        "musk",
        50
      ],
      [
        "galbanum oil",
        2,
        "t",
        "green",
        100
      ],
      [
        "hedione",
        200,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        1,
        "t",
        "green",
        100
      ],
      [
        "indole 1%",
        2,
        "h",
        "floral",
        1
      ],
      [
        "beta-ionone",
        25,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        45,
        "b",
        "woody",
        100
      ],
      [
        "cis-jasmone 10%",
        8,
        "h",
        "floral",
        10
      ],
      [
        "lilial",
        20,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        80,
        "h",
        "floral",
        100
      ],
      [
        "orange oil",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "rosoflor",
        5,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        5,
        "t",
        "green",
        100
      ],
      [
        "scentenal 1%",
        2,
        "h",
        "floral",
        1
      ],
      [
        "tropional",
        30,
        "h",
        "floral",
        100
      ],
      [
        "vertofix",
        10,
        "b",
        "woody",
        100
      ],
      [
        "DIPG",
        115,
        "b",
        "aquatic",
        0
      ],
      [
        "anapear",
        5,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-143",
    "te": "Flowery green base",
    "tr": "Цветочный зелёный парфюмерная база",
    "sd": "TGSC (dm1015272) · Patent 4,668,433",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,668,433 Novel derivatives of 6-hydroxyhexanoates as fragrance ingredients.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный зелёный парфюмерная база». Формула из патента 4,668,433. Ключевые материалы структуры: phenoxyethanol, linalool, alpha-terpineol, berryflor.",
    "pr": {
      "floral": 50,
      "musk": 4,
      "citrus": 1,
      "gourmand": 7,
      "spicy": 1
    },
    "it": [
      [
        "phenoxyethanol",
        205,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        150,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl butyrate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        60,
        "b",
        "musk",
        50
      ],
      [
        "hedione",
        60,
        "h",
        "floral",
        100
      ],
      [
        "verdyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "acetal R",
        30,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        15,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde 10%",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "cyclal C 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "phenyl acetaldehyde dimethyl acetal",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "corps cassis 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "eugenol",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "diphenyl oxide",
        5,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "berryflor",
        100,
        "h",
        "gourmand",
        100
      ],
      [
        "DIPG",
        40,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-144",
    "te": "Fresh flowery green fruity composition",
    "tr": "Свежий цветочный зелёный фруктовый композиция",
    "sd": "TGSC (dm1015272) · Patent 5,837,671",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,837,671 Organoleptic compound and composition.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Свежий цветочный зелёный фруктовый композиция». Формула из патента 5,837,671. Ключевые материалы структуры: DIPG, phenethyl alcohol, alpha-hexyl cinnamaldehyde, bergamot oil replacer.",
    "pr": {
      "floral": 50,
      "citrus": 19,
      "spicy": 1,
      "amber": 1,
      "green": 4
    },
    "it": [
      [
        "benzyl acetate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-11 undecylenic",
        0.3,
        "t",
        "citrus",
        100
      ],
      [
        "phenyl acetaldehyde",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "bergamot oil replacer",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "cyclohexal",
        40,
        "h",
        "floral",
        100
      ],
      [
        "fixolide",
        70,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "clove bud oil",
        7,
        "h",
        "spicy",
        100
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        10,
        "b",
        "amber",
        100
      ],
      [
        "isoeugenol",
        2,
        "h",
        "spicy",
        100
      ],
      [
        "isoraldeine 95",
        40,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        40,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-14",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl salicylate",
        40,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        10,
        "t",
        "green",
        100
      ],
      [
        "tropional",
        10,
        "h",
        "floral",
        100
      ],
      [
        "anapear",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "DIPG",
        129.7,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-145",
    "te": "Flowery lily of the valley jasmin composition",
    "tr": "Цветочная композиция ландыша и жасмина",
    "sd": "TGSC (dm1015272) · Patent 5,164,365",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,164,365 1,1,2,3,3,6-hexamethyl-4,5,6,7-tetrahydro-5-indanone and fragrance compositions containing same.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочная композиция ландыша и жасмина». Формула из патента 5,164,365. Ключевые материалы структуры: alpha-hexyl cinnamaldehyde, methyl dihydrojasmonate, phenethyl alcohol, hydroxycitronellal.",
    "pr": {
      "woody": 6,
      "floral": 50,
      "citrus": 38,
      "green": 10,
      "spicy": 1,
      "amber": 1
    },
    "it": [
      [
        "cedarwood oil virginia",
        50,
        "b",
        "woody",
        100
      ],
      [
        "benzyl acetate",
        80,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "isoraldeine 95",
        30,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        120,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        120,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl salicylate",
        70,
        "t",
        "green",
        100
      ],
      [
        "methyl dihydrojasmonate",
        150,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "cetonial",
        15,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        15,
        "t",
        "green",
        100
      ],
      [
        "evernyl",
        5,
        "b",
        "woody",
        100
      ],
      [
        "clove bud oil",
        8,
        "h",
        "spicy",
        100
      ],
      [
        "heliotropin",
        8,
        "b",
        "amber",
        100
      ],
      [
        "mandarin oil",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "phenyl acetaldehyde 85%",
        2,
        "t",
        "citrus",
        85
      ],
      [
        "aldehyde C-11 undecylic 1%",
        2,
        "t",
        "citrus",
        1
      ],
      [
        "DIPG",
        60,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-146",
    "te": "Crisp flowery perfume composition",
    "tr": "Свежий хрустящий цветочный парфюм композиция",
    "sd": "TGSC (dm1015272) · Patent 6,297,211",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,297,211 Odorant compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Свежий хрустящий цветочный парфюм композиция». Формула из патента 6,297,211. Ключевые материалы структуры: DIPG, galaxolide 50 BB, alpha-hexyl cinnamaldehyde, lilial.",
    "pr": {
      "floral": 50,
      "gourmand": 1,
      "aquatic": 1,
      "musk": 18,
      "green": 1,
      "citrus": 13,
      "woody": 2
    },
    "it": [
      [
        "ethyl acetoacetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "cyclogalbanate",
        1.6,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        28,
        "h",
        "floral",
        100
      ],
      [
        "cassis base 345 B",
        4,
        "h",
        "gourmand",
        100
      ],
      [
        "cedryl acetate",
        16,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "thibetolide",
        4,
        "h",
        "floral",
        100
      ],
      [
        "tricyclal",
        3.2,
        "h",
        "floral",
        100
      ],
      [
        "melonal 10%",
        5.6,
        "h",
        "aquatic",
        10
      ],
      [
        "rhodinol",
        28,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        357.2,
        "b",
        "aquatic",
        0
      ],
      [
        "ambrox DL 10%",
        1.6,
        "b",
        "amber",
        10
      ],
      [
        "ethyl linalool",
        40,
        "h",
        "floral",
        100
      ],
      [
        "ethylene brassylate",
        4,
        "b",
        "musk",
        100
      ],
      [
        "floralozone",
        1.6,
        "h",
        "aquatic",
        100
      ],
      [
        "galaxolide 50 BB",
        120,
        "b",
        "musk",
        50
      ],
      [
        "hexyl salicylate",
        4,
        "t",
        "green",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "cyclohexal",
        20,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        2.4,
        "h",
        "floral",
        10
      ],
      [
        "cis-jasmone",
        0.4,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        6.4,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        64,
        "h",
        "floral",
        100
      ],
      [
        "isoraldeine",
        28,
        "h",
        "floral",
        100
      ],
      [
        "florol",
        4,
        "h",
        "floral",
        100
      ],
      [
        "syringa aldehyde 10%",
        12,
        "t",
        "citrus",
        10
      ],
      [
        "phenoxanol",
        8,
        "h",
        "floral",
        100
      ],
      [
        "nerol",
        12,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        16,
        "b",
        "woody",
        100
      ],
      [
        "ambrettolide",
        8.4,
        "b",
        "musk",
        100
      ],
      [
        "gardenol",
        2,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        16,
        "h",
        "floral",
        100
      ],
      [
        "black pepper oil",
        1.6,
        "h",
        "spicy",
        100
      ],
      [
        "rose TW 62/9 norx",
        16,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        4,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-11 undecylenic 1%",
        8,
        "t",
        "citrus",
        1
      ],
      [
        "3,6-Dimethyloct-6-en-1-ol",
        8,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-147",
    "te": "Flowery perfume composition",
    "tr": "Цветочный парфюм композиция",
    "sd": "TGSC (dm1015272) · Patent 4,485,036",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,485,036 Odorant compositions containing megastigma-5(11),8-dien-4,7-oxides and tetra-substituted-7-oxa-bicyclo[3.3.0]-octanes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный парфюм композиция». Формула из патента 4,485,036. Ключевые материалы структуры: phenethyl phenyl acetate, benzyl salicylate, madrox, phenyl acetaldehyde digeranyl acetal.",
    "pr": {
      "floral": 50,
      "green": 13,
      "citrus": 19,
      "woody": 10,
      "musk": 3,
      "spicy": 1
    },
    "it": [
      [
        "phenethyl phenyl acetate",
        150,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        130,
        "t",
        "green",
        100
      ],
      [
        "madrox",
        120,
        "h",
        "floral",
        100
      ],
      [
        "phenyl acetaldehyde digeranyl acetal",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "sandalwood oil",
        100,
        "b",
        "woody",
        100
      ],
      [
        "hydroxycitronellal",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "ethylene brassylate",
        30,
        "b",
        "musk",
        100
      ],
      [
        "linalool",
        30,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "cyclamen aldehyde",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        40,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-148",
    "te": "Flowery tea spicy herbal accord",
    "tr": "Цветочный чайный пряный травянистый Аккорд",
    "sd": "TGSC (dm1015272) · Patent 5,942,272",
    "fa": "spicy",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,942,272 Organoleptic compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Цветочный чайный пряный травянистый Аккорд». Формула из патента 5,942,272. Ключевые материалы структуры: linalool, DIPG, bergamot oil bergaptene reduced, phenethyl alcohol.",
    "pr": {
      "floral": 50,
      "citrus": 9,
      "green": 4,
      "spicy": 2
    },
    "it": [
      [
        "linalool",
        200,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetone",
        50,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl benzoate",
        50,
        "t",
        "green",
        100
      ],
      [
        "(E)-anethol",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "para-anisaldehyde",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "methyl jasmonate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        15,
        "h",
        "floral",
        100
      ],
      [
        "dihydro-beta-ionone",
        15,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "phenyl acetaldehyde",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "citral",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "(&plusmn;)-2,3-dihydrofarnesol",
        60,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        175,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-149",
    "te": "Fougere aromatic lavender composition for a masculine eau-de-cologne",
    "tr": "Фужерно-лавандовая композиция для мужского одеколона",
    "sd": "TGSC (dm1015272) · Patent 8,445,732",
    "fa": "green",
    "kd": "perfume",
    "df": "intermediate",
    "co": "Cologne",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,445,732 Organic compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фужерно-лавандовая композиция для мужского одеколона». Формула из патента 8,445,732. Ключевые материалы структуры: hedione, fixolide, iso e super, DIPG.",
    "pr": {
      "floral": 50,
      "citrus": 5,
      "green": 7,
      "woody": 10
    },
    "it": [
      [
        "agrumex HC",
        80,
        "h",
        "floral",
        100
      ],
      [
        "allyl amyl glycolate",
        6,
        "h",
        "gourmand",
        100
      ],
      [
        "ambrofix",
        20,
        "h",
        "floral",
        100
      ],
      [
        "anise seed oil",
        2,
        "h",
        "spicy",
        100
      ],
      [
        "bourgeonal",
        6,
        "h",
        "floral",
        100
      ],
      [
        "clove bud oil",
        2,
        "h",
        "spicy",
        100
      ],
      [
        "cyclohexal",
        80,
        "h",
        "floral",
        100
      ],
      [
        "damascenone 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "dimethyl phenyl ethyl carbinol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "fennaldehyde",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "fixolide",
        120,
        "h",
        "floral",
        100
      ],
      [
        "floralozone",
        2,
        "h",
        "aquatic",
        100
      ],
      [
        "hedione",
        160,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        4,
        "t",
        "green",
        100
      ],
      [
        "alpha-irone",
        2,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        120,
        "b",
        "woody",
        100
      ],
      [
        "lavender oil",
        80,
        "t",
        "green",
        100
      ],
      [
        "lemon oil",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "liffarome",
        2,
        "h",
        "floral",
        100
      ],
      [
        "ligustral",
        2,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        14,
        "t",
        "citrus",
        100
      ],
      [
        "methyl cedryl ketone",
        80,
        "h",
        "floral",
        100
      ],
      [
        "radjanol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "spearmint oil",
        2,
        "t",
        "green",
        100
      ],
      [
        "tropional",
        30,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        2,
        "b",
        "amber",
        100
      ],
      [
        "DIPG",
        90,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-150",
    "te": "Fougere hesperidic perfume",
    "tr": "Фужер гесперидный (цитрусовый) парфюм",
    "sd": "TGSC (dm1015272) · Patent 7,078,570",
    "fa": "green",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,078,570 Substituted cyclohexenes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фужер гесперидный (цитрусовый) парфюм». Формула из патента 7,078,570. Ключевые материалы структуры: hedione, DIPG, dihydromyrcenol, bergamot oil bergaptene reduced.",
    "pr": {
      "citrus": 24,
      "gourmand": 1,
      "musk": 2,
      "floral": 50,
      "green": 4,
      "aquatic": 3,
      "amber": 2,
      "woody": 12
    },
    "it": [
      [
        "linalyl acetate",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "allyl amyl glycolate",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "ambrettolide",
        15,
        "b",
        "musk",
        100
      ],
      [
        "ambrofix",
        5,
        "h",
        "floral",
        100
      ],
      [
        "armoise oil",
        5,
        "t",
        "green",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "calone 10%",
        25,
        "h",
        "aquatic",
        10
      ],
      [
        "lemon oil italy",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "coumarin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "cyclohexal",
        15,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        85,
        "t",
        "citrus",
        100
      ],
      [
        "DIPG",
        100,
        "b",
        "aquatic",
        0
      ],
      [
        "ebanol",
        20,
        "b",
        "woody",
        100
      ],
      [
        "ethyl linalool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "evernyl",
        10,
        "b",
        "woody",
        100
      ],
      [
        "fixolide",
        65,
        "h",
        "floral",
        100
      ],
      [
        "florhydral",
        5,
        "h",
        "floral",
        100
      ],
      [
        "geranium oil",
        10,
        "h",
        "floral",
        100
      ],
      [
        "givescone",
        5,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        110,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        65,
        "b",
        "woody",
        100
      ],
      [
        "isoraldeine 95",
        10,
        "h",
        "floral",
        100
      ],
      [
        "labienoxime 10%/IPM-TEC",
        10,
        "h",
        "floral",
        10
      ],
      [
        "lavender oil",
        15,
        "t",
        "green",
        100
      ],
      [
        "methyl pamplemousse",
        65,
        "h",
        "floral",
        100
      ],
      [
        "radjanol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "sandalore",
        15,
        "b",
        "woody",
        100
      ],
      [
        "clary sage oil france",
        5,
        "t",
        "green",
        100
      ],
      [
        "stemone",
        10,
        "t",
        "green",
        100
      ],
      [
        "tricyclal 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "tropional",
        40,
        "h",
        "floral",
        100
      ],
      [
        "1,2,6-trimethyl-6-(3-methyl-but-2-enyl)-cyclohex-2-enol",
        20,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-151",
    "te": "fragrance composition (#151)",
    "tr": "Аромат композиция (#151)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring aldehyde C-10, aldehyde C-9, allyl amyl glycolate, isoambrettolide.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#151)». Ключевые материалы структуры: lyral, hedione, kharismal, lilial.",
    "pr": {
      "citrus": 4,
      "gourmand": 3,
      "musk": 3,
      "aquatic": 1,
      "floral": 50,
      "green": 1,
      "woody": 3
    },
    "it": [
      [
        "aldehyde C-10",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-9",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "allyl amyl glycolate",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "isoambrettolide",
        10,
        "b",
        "musk",
        100
      ],
      [
        "ambroxan",
        1,
        "b",
        "amber",
        100
      ],
      [
        "calone 10%",
        15,
        "h",
        "aquatic",
        10
      ],
      [
        "cashmeran",
        2,
        "b",
        "musk",
        100
      ],
      [
        "citronellol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cyclacet",
        50,
        "h",
        "floral",
        100
      ],
      [
        "diola",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ethyl acetoacetate",
        3,
        "h",
        "floral",
        100
      ],
      [
        "floriffol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "fruity ketal",
        20,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        30,
        "b",
        "musk",
        50
      ],
      [
        "galbascone 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        5,
        "t",
        "green",
        100
      ],
      [
        "hexyl salicylate",
        10,
        "t",
        "green",
        100
      ],
      [
        "hydroxycitronellal",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "indole 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "iso e super",
        50,
        "b",
        "woody",
        100
      ],
      [
        "jasmal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "kharismal",
        100,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        100,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        10,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        200,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "orange oil",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "rosalva",
        20,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        3,
        "h",
        "floral",
        100
      ],
      [
        "verdox",
        50,
        "h",
        "gourmand",
        100
      ],
      [
        "zenolide",
        10,
        "h",
        "floral",
        100
      ],
      [
        "zestoril 1%",
        1,
        "h",
        "floral",
        1
      ],
      [
        "dipropylene glycol",
        79,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-152",
    "te": "fragrance composition (#152)",
    "tr": "Аромат композиция (#152)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring aldehyde C-10, aldehyde C-9, allyl amyl glycolate, isoambrettolide.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#152)». Ключевые материалы структуры: lyral, hedione, kharismal, lilial.",
    "pr": {
      "citrus": 4,
      "gourmand": 3,
      "musk": 3,
      "aquatic": 1,
      "floral": 50,
      "green": 1,
      "woody": 3
    },
    "it": [
      [
        "aldehyde C-10",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-9",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "allyl amyl glycolate",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "isoambrettolide",
        10,
        "b",
        "musk",
        100
      ],
      [
        "ambroxan",
        1,
        "b",
        "amber",
        100
      ],
      [
        "calone 10%",
        15,
        "h",
        "aquatic",
        10
      ],
      [
        "cashmeran",
        2,
        "b",
        "musk",
        100
      ],
      [
        "citronellol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cyclacet",
        50,
        "h",
        "floral",
        100
      ],
      [
        "diola",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ethyl acetoacetate",
        3,
        "h",
        "floral",
        100
      ],
      [
        "floriffol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "fruity ketal",
        20,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        30,
        "b",
        "musk",
        50
      ],
      [
        "galbascone 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        5,
        "t",
        "green",
        100
      ],
      [
        "hexyl salicylate",
        10,
        "t",
        "green",
        100
      ],
      [
        "hydroxycitronellal",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "indole 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "iso e super",
        50,
        "b",
        "woody",
        100
      ],
      [
        "jasmal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "kharismal",
        100,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        100,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        10,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        200,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "orange oil",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "rosalva",
        20,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        3,
        "h",
        "floral",
        100
      ],
      [
        "verdox",
        50,
        "h",
        "gourmand",
        100
      ],
      [
        "zenolide",
        10,
        "h",
        "floral",
        100
      ],
      [
        "zestoril 1%",
        1,
        "h",
        "floral",
        1
      ],
      [
        "dipropylene glycol",
        79,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-153",
    "te": "fragrance composition (#153)",
    "tr": "Аромат композиция (#153)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl isoeugenol, dimethyl benzyl carbinyl acetate, tetrahydrolinalool, tetrahydrolinalyl acetate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#153)». Ключевые материалы структуры: tetrahydrolinalyl acetate, tetrahydrolinalool, phenethyl alcohol, geraniol.",
    "pr": {
      "spicy": 4,
      "floral": 50,
      "citrus": 21,
      "woody": 2
    },
    "it": [
      [
        "benzyl isoeugenol",
        50,
        "h",
        "spicy",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalool",
        150,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalyl acetate",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "citronellyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "phenyl acetaldehyde dimethyl acetal",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "sandalrome",
        20,
        "b",
        "woody",
        100
      ],
      [
        "phenethyl alcohol",
        90,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        60,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        60,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "geraniol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "cedryl acetate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "tagete oil",
        40,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        20,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-154",
    "te": "fragrance composition (#154)",
    "tr": "Аромат композиция (#154)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring citrolate, aldehyde C-10 10%, aldehyde C-11 moa 10%, farenal.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#154)». Ключевые материалы структуры: benzyl salicylate, lilial, lyral, phenethyl alcohol.",
    "pr": {
      "floral": 50,
      "citrus": 14,
      "green": 11,
      "spicy": 1,
      "woody": 1,
      "musk": 1
    },
    "it": [
      [
        "citrolate",
        7.14,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-10 10%",
        7.14,
        "t",
        "citrus",
        10
      ],
      [
        "aldehyde C-11 moa 10%",
        4.29,
        "t",
        "citrus",
        10
      ],
      [
        "farenal",
        4.29,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-11 undecylic 10%",
        7.14,
        "t",
        "citrus",
        10
      ],
      [
        "cyclamen aldehyde 50%",
        2.86,
        "t",
        "citrus",
        50
      ],
      [
        "(E)-2-hexenol 10%",
        2.86,
        "t",
        "green",
        10
      ],
      [
        "vertocitral",
        1.43,
        "t",
        "citrus",
        100
      ],
      [
        "linalyl acetate",
        64.29,
        "t",
        "citrus",
        100
      ],
      [
        "citrylal",
        7.14,
        "h",
        "floral",
        100
      ],
      [
        "mandarin aldehyde 10%",
        5.71,
        "t",
        "citrus",
        10
      ],
      [
        "lilial",
        107.14,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        107.14,
        "h",
        "floral",
        100
      ],
      [
        "profarnesol",
        7.14,
        "h",
        "floral",
        100
      ],
      [
        "nerolidol",
        7.14,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        64.29,
        "h",
        "floral",
        100
      ],
      [
        "geranium oil africa",
        7.14,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        107.14,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        21.43,
        "h",
        "floral",
        100
      ],
      [
        "nerol",
        14.29,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        71.43,
        "t",
        "citrus",
        100
      ],
      [
        "hedione",
        21.43,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        142.86,
        "t",
        "green",
        100
      ],
      [
        "(E,Z)-2,6-nonadien-1-ol 0.1%",
        7.14,
        "h",
        "floral",
        0.1
      ],
      [
        "allyl alpha-ionone",
        4.29,
        "h",
        "gourmand",
        100
      ],
      [
        "methyl ionone gamma supreme",
        107.14,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "cedryl acetate",
        57.14,
        "h",
        "floral",
        100
      ],
      [
        "sandalrome",
        7.14,
        "b",
        "woody",
        100
      ],
      [
        "citral",
        7.14,
        "t",
        "citrus",
        100
      ],
      [
        "muscenone delta",
        7.14,
        "b",
        "musk",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-155",
    "te": "fragrance composition (#155)",
    "tr": "Аромат композиция (#155)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring ocean propanal, sandalrome, bergamot AB 1589, cervolide.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#155)». Ключевые материалы структуры: cervolide, dipropylene glycol, methyl dihydrojasmonate HC, sandalrome.",
    "pr": {
      "floral": 50,
      "woody": 3,
      "citrus": 8
    },
    "it": [
      [
        "ocean propanal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "sandalrome",
        50,
        "b",
        "woody",
        100
      ],
      [
        "bergamot AB 1589",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "cervolide",
        250,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        5,
        "h",
        "floral",
        100
      ],
      [
        "ethyl acetoacetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "geranium oil bourbon",
        5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ligustral 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "magnolan",
        50,
        "h",
        "floral",
        100
      ],
      [
        "paradisamide",
        10,
        "h",
        "floral",
        100
      ],
      [
        "maltol 10%",
        5,
        "h",
        "gourmand",
        10
      ],
      [
        "methyl dihydrojasmonate HC",
        120,
        "h",
        "floral",
        100
      ],
      [
        "methyl pamplemousse",
        5,
        "h",
        "floral",
        100
      ],
      [
        "nerolidol",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "orange oil brazil",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "orange flower AB 2169",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "peomosa",
        25,
        "h",
        "floral",
        100
      ],
      [
        "rhubofix 10%",
        20,
        "h",
        "floral",
        10
      ],
      [
        "rose oxide 1%",
        10,
        "h",
        "floral",
        1
      ],
      [
        "silvanone",
        50,
        "h",
        "floral",
        100
      ],
      [
        "veloutone 10%",
        20,
        "h",
        "floral",
        10
      ],
      [
        "dipropylene glycol",
        205,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-156",
    "te": "fragrance composition (#156)",
    "tr": "Аромат композиция (#156)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring elintaal, canthoxal, citronellol, cyclamen aldehyde.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#156)». Ключевые материалы структуры: DIPG, hedione, tetrahydrolinalool, citronellol.",
    "pr": {
      "floral": 50,
      "citrus": 5,
      "aquatic": 3,
      "green": 5
    },
    "it": [
      [
        "elintaal",
        5,
        "h",
        "floral",
        100
      ],
      [
        "canthoxal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        75,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-damascone",
        1.5,
        "h",
        "gourmand",
        100
      ],
      [
        "floralozone",
        15,
        "h",
        "aquatic",
        100
      ],
      [
        "geraniol",
        25,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        15,
        "h",
        "aquatic",
        100
      ],
      [
        "herbal carbonate",
        50,
        "t",
        "green",
        100
      ],
      [
        "hedione",
        250,
        "h",
        "floral",
        100
      ],
      [
        "(E,Z)-2,6-nonadienal 10%",
        0.5,
        "h",
        "floral",
        10
      ],
      [
        "alpha-terpineol",
        75,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalool",
        100,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "mandaril",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "magnolia decadienal",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        313,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-157",
    "te": "fragrance composition (#157)",
    "tr": "Аромат композиция (#157)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, cinnamyl acetate, cis-3-hexenol, cis-3-hexenyl acetate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#157)». Ключевые материалы структуры: DIPG, florosa, methyl dihydrojasmonate, ethyl linalool.",
    "pr": {
      "floral": 50,
      "citrus": 1
    },
    "it": [
      [
        "benzyl acetate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "cinnamyl acetate",
        3,
        "h",
        "spicy",
        100
      ],
      [
        "cis-3-hexenol",
        0.5,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        1,
        "t",
        "green",
        100
      ],
      [
        "(Z)-4-decenal 1%",
        0.3,
        "h",
        "floral",
        1
      ],
      [
        "dihydrorose oxide",
        1,
        "h",
        "floral",
        100
      ],
      [
        "gamma-decalactone",
        0.3,
        "h",
        "gourmand",
        100
      ],
      [
        "dupical",
        1,
        "h",
        "floral",
        100
      ],
      [
        "ethyl linalool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "floralozone",
        2,
        "h",
        "aquatic",
        100
      ],
      [
        "florosa",
        200,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        3,
        "b",
        "amber",
        100
      ],
      [
        "indole",
        1.5,
        "h",
        "floral",
        100
      ],
      [
        "linalool oxide",
        1,
        "h",
        "floral",
        100
      ],
      [
        "mayol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "methyl benzoate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "phenoxyethyl isobutyrate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "prenyl acetate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "tangerine nitrile",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "magnolia decadienal",
        5,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        602.4,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-158",
    "te": "fragrance composition (#158)",
    "tr": "Аромат композиция (#158)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring allyl amyl glycolate, ambroxan, borneol, camphor.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#158)». Ключевые материалы структуры: tetrahydrolinalool, alpha-hexyl cinnamaldehyde, lavandin oil grosso, methyl dihydrojasmonate.",
    "pr": {
      "amber": 1,
      "green": 28,
      "floral": 50,
      "citrus": 18,
      "musk": 4,
      "woody": 13
    },
    "it": [
      [
        "allyl amyl glycolate",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "ambroxan",
        1,
        "b",
        "amber",
        100
      ],
      [
        "borneol",
        2,
        "t",
        "green",
        100
      ],
      [
        "camphor",
        20,
        "t",
        "green",
        100
      ],
      [
        "citronellol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        10,
        "b",
        "amber",
        100
      ],
      [
        "cyclohexyl salicylate",
        50,
        "t",
        "green",
        100
      ],
      [
        "dihydromyrcenol",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "ethylene brassylate",
        30,
        "b",
        "musk",
        100
      ],
      [
        "eucalyptus oil",
        30,
        "h",
        "floral",
        100
      ],
      [
        "herbavert",
        15,
        "t",
        "green",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "iso e super",
        50,
        "b",
        "woody",
        100
      ],
      [
        "lavandin oil grosso",
        100,
        "t",
        "green",
        100
      ],
      [
        "lavender oil",
        30,
        "t",
        "green",
        100
      ],
      [
        "lemon oil c.p. california",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "lilial",
        30,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "methyl nonyl ketone",
        2,
        "h",
        "floral",
        100
      ],
      [
        "veramoss",
        3,
        "b",
        "woody",
        100
      ],
      [
        "patchouli oil",
        1,
        "b",
        "woody",
        100
      ],
      [
        "poirenate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "green acetate",
        10,
        "t",
        "green",
        100
      ],
      [
        "woody acetate",
        50,
        "b",
        "woody",
        100
      ],
      [
        "alpha-terpinyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalool",
        150,
        "h",
        "floral",
        100
      ],
      [
        "tangerine nitrile",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "magnolia decadienal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        65,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-159",
    "te": "Fragrance composition (Patent EP2307429)",
    "tr": "Аромат композиция (Патент EP2307429)",
    "sd": "TGSC (dm1015272) · Patent EP2307429",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent EP2307429 A1 Substituted butanol derivatives and their use as fragrance and flavor materials.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (Патент EP2307429)». Формула из патента EP2307429. Ключевые материалы структуры: dihydromyrcenol, benzyl acetate, cyclacet, laevo-citronellol.",
    "pr": {
      "floral": 50,
      "citrus": 24,
      "spicy": 1,
      "amber": 1,
      "woody": 4
    },
    "it": [
      [
        "acetyl tetralin",
        37.74,
        "h",
        "floral",
        100
      ],
      [
        "ambretone",
        9.43,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        188.68,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil imitation 1",
        47.17,
        "t",
        "citrus",
        100
      ],
      [
        "citral 10%",
        18.87,
        "t",
        "citrus",
        10
      ],
      [
        "laevo-citronellol",
        75.47,
        "h",
        "floral",
        100
      ],
      [
        "laevo-citronellyl acetate",
        9.43,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl nitrile",
        13.21,
        "h",
        "floral",
        100
      ],
      [
        "cyclacet",
        84.91,
        "h",
        "floral",
        100
      ],
      [
        "trepanol",
        28.3,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        232.08,
        "t",
        "citrus",
        100
      ],
      [
        "dynascone 10%",
        9.43,
        "h",
        "floral",
        10
      ],
      [
        "eugenol",
        9.43,
        "h",
        "spicy",
        100
      ],
      [
        "geranium oil bourbon",
        18.87,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        50.94,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        15.09,
        "b",
        "amber",
        100
      ],
      [
        "hindinol",
        9.43,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        47.17,
        "h",
        "floral",
        100
      ],
      [
        "isobornyl methyl ether",
        47.17,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        47.17,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-160",
    "te": "Fragrance composition (Patent 7,846,887)",
    "tr": "Аромат композиция (Патент 7,846,887)",
    "sd": "TGSC (dm1015272) · Patent 7,846,887",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,846,887 Cysteine derivatives which counteract malodour.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (Патент 7,846,887)». Формула из патента 7,846,887. Ключевые материалы структуры: DIPG, alpha-terpineol, mayol, hedione.",
    "pr": {
      "floral": 50,
      "spicy": 4,
      "citrus": 5,
      "amber": 1
    },
    "it": [
      [
        "benzyl alcohol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "cinnamic alcohol",
        50,
        "h",
        "spicy",
        100
      ],
      [
        "dihydromyrcenol",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "diphenyl oxide",
        25,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        10,
        "b",
        "amber",
        100
      ],
      [
        "citronellyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "indole",
        1,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        57.5,
        "h",
        "floral",
        100
      ],
      [
        "myrascone",
        25,
        "h",
        "floral",
        100
      ],
      [
        "linalyl butyrate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "mayol",
        105,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        166,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        0.5,
        "b",
        "amber",
        100
      ],
      [
        "DIPG",
        250,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-161",
    "te": "Fragrance composition (#161)",
    "tr": "Аромат композиция (#161)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring bergamot oil bergaptene reduced, citronella oil ceylon, citronellyl nitrile, bergamal.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#161)». Ключевые материалы структуры: galaxolide 50 IPM, citronella oil ceylon, bergamal, diphenyl oxide.",
    "pr": {
      "citrus": 9,
      "floral": 50,
      "musk": 10,
      "woody": 4
    },
    "it": [
      [
        "bergamot oil bergaptene reduced",
        45,
        "t",
        "citrus",
        100
      ],
      [
        "citronella oil ceylon",
        110,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl nitrile",
        30,
        "h",
        "floral",
        100
      ],
      [
        "bergamal",
        100,
        "h",
        "floral",
        100
      ],
      [
        "decyl acetate",
        7,
        "h",
        "floral",
        100
      ],
      [
        "diphenyl oxide",
        100,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        130,
        "b",
        "musk",
        50
      ],
      [
        "hedione",
        40,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        60,
        "b",
        "woody",
        100
      ],
      [
        "lemon oil",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "methyl benzoate",
        2,
        "h",
        "floral",
        100
      ],
      [
        "oranger crystals",
        35,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 mna",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "para-methyl anisole",
        6,
        "h",
        "spicy",
        100
      ],
      [
        "phenethyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        90,
        "h",
        "floral",
        100
      ],
      [
        "rose oxide",
        5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "terpinolene",
        100,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-162",
    "te": "Fragrance composition (#162)",
    "tr": "Аромат композиция (#162)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring laevo-carvone, citral propylene glycol acetal, farnesene, farnesol.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#162)». Ключевые материалы структуры: farnesene, galaxolide 50 IPM, helional, iso e super.",
    "pr": {
      "floral": 50,
      "citrus": 7,
      "musk": 11,
      "aquatic": 9,
      "woody": 9
    },
    "it": [
      [
        "laevo-carvone",
        5,
        "h",
        "floral",
        100
      ],
      [
        "citral propylene glycol acetal",
        35,
        "t",
        "citrus",
        100
      ],
      [
        "farnesene",
        200,
        "h",
        "floral",
        100
      ],
      [
        "farnesol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        125,
        "b",
        "musk",
        50
      ],
      [
        "geraniol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "geranyl formate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        65,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        100,
        "h",
        "aquatic",
        100
      ],
      [
        "cis-3-hexenol",
        1,
        "t",
        "green",
        100
      ],
      [
        "iso e super",
        100,
        "b",
        "woody",
        100
      ],
      [
        "linalool",
        90,
        "h",
        "floral",
        100
      ],
      [
        "(E)-methyl geranate",
        38,
        "h",
        "floral",
        100
      ],
      [
        "nerolidol",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "rose oxide",
        1,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "trimofix O",
        5,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        15,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-163",
    "te": "Fragrance composition (#163)",
    "tr": "Аромат композиция (#163)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring allyl amyl glycolate, benzyl acetate, benzyl salicylate, bergamot oil bergaptene reduced.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#163)». Ключевые материалы структуры: galaxolide 50 IPM, hedione, linalool, linalyl acetate.",
    "pr": {
      "gourmand": 3,
      "floral": 50,
      "green": 7,
      "citrus": 11,
      "musk": 10,
      "amber": 7,
      "spicy": 4,
      "aquatic": 1,
      "woody": 16
    },
    "it": [
      [
        "allyl amyl glycolate",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "benzyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        55,
        "t",
        "green",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        35,
        "t",
        "citrus",
        100
      ],
      [
        "cashmeran",
        4,
        "b",
        "musk",
        100
      ],
      [
        "cedrenyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        25,
        "b",
        "amber",
        100
      ],
      [
        "cyclogalbaniff",
        3,
        "h",
        "floral",
        100
      ],
      [
        "cervolide",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "delta-damascone",
        0.4,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl vanillin",
        1,
        "b",
        "amber",
        100
      ],
      [
        "eugenol",
        40,
        "h",
        "spicy",
        100
      ],
      [
        "galaxolide 50 IPM",
        90,
        "b",
        "musk",
        50
      ],
      [
        "galbanum oil",
        0.1,
        "t",
        "green",
        100
      ],
      [
        "geraniol",
        13,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        80,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        6,
        "h",
        "aquatic",
        100
      ],
      [
        "heliotropin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        13,
        "t",
        "green",
        100
      ],
      [
        "beta-ionone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        60,
        "b",
        "woody",
        100
      ],
      [
        "jasmin absolute egypt",
        5,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        40,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        80,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        65,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        40,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate",
        8,
        "h",
        "floral",
        100
      ],
      [
        "methyl ionone gamma supreme",
        55,
        "h",
        "floral",
        100
      ],
      [
        "omega-pentadecalactone",
        25,
        "h",
        "gourmand",
        100
      ],
      [
        "frankincense resinoid replacer",
        6,
        "b",
        "amber",
        100
      ],
      [
        "patchouli oil",
        35,
        "b",
        "woody",
        100
      ],
      [
        "sandalore",
        20,
        "b",
        "woody",
        100
      ],
      [
        "sanjinol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "styralyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        13,
        "b",
        "amber",
        100
      ],
      [
        "veramoss",
        4,
        "b",
        "woody",
        100
      ],
      [
        "vertofix",
        25,
        "b",
        "woody",
        100
      ],
      [
        "ylang ylang oil",
        5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-164",
    "te": "Fragrance composition (#164)",
    "tr": "Аромат композиция (#164)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring allyl cyclohexyl propionate, amyl salicylate, benzyl acetate, benzyl benzoate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#164)». Ключевые материалы структуры: linalool, phenethyl alcohol, hedione, citronellol.",
    "pr": {
      "green": 4,
      "floral": 50,
      "citrus": 11
    },
    "it": [
      [
        "allyl cyclohexyl propionate",
        7.14,
        "h",
        "gourmand",
        100
      ],
      [
        "amyl salicylate",
        55.71,
        "t",
        "green",
        100
      ],
      [
        "benzyl acetate",
        7.14,
        "h",
        "floral",
        100
      ],
      [
        "benzyl benzoate",
        11.43,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil",
        42.86,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        114.29,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate",
        48.57,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        42.86,
        "t",
        "citrus",
        100
      ],
      [
        "eugenol",
        1.43,
        "h",
        "spicy",
        100
      ],
      [
        "hedione",
        118.57,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        4.29,
        "t",
        "green",
        100
      ],
      [
        "indole",
        1.43,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        94.29,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        228.57,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        85.71,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        128.57,
        "h",
        "floral",
        100
      ],
      [
        "marine decadienal",
        3.57,
        "h",
        "aquatic",
        100
      ],
      [
        "DIPG",
        3.57,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-165",
    "te": "Fragrance composition (#165)",
    "tr": "Аромат композиция (#165)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, geranyl acetate, linalyl acetate, cis-3-hexenyl acetate 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#165)». Ключевые материалы структуры: hedione, galaxolide 50 IPM, linalool, benzyl acetate.",
    "pr": {
      "floral": 50,
      "citrus": 11,
      "green": 8,
      "gourmand": 5,
      "amber": 7,
      "woody": 17,
      "musk": 19
    },
    "it": [
      [
        "benzyl acetate",
        51.95,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        5.19,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        33.77,
        "t",
        "citrus",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        12.99,
        "t",
        "green",
        10
      ],
      [
        "styrallyl acetate",
        6.49,
        "h",
        "gourmand",
        100
      ],
      [
        "aldehyde C-12 lauric 1%",
        5.19,
        "t",
        "citrus",
        1
      ],
      [
        "(E)-2-dodecenal 1%",
        2.6,
        "h",
        "floral",
        1
      ],
      [
        "phenyl acetaldehyde 1%",
        10.39,
        "t",
        "citrus",
        1
      ],
      [
        "allyl amyl glycolate",
        2.6,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-undecalactone 10%",
        12.99,
        "h",
        "gourmand",
        10
      ],
      [
        "gamma-nonalactone 10%",
        10.39,
        "h",
        "gourmand",
        10
      ],
      [
        "cetalox 10%",
        10.39,
        "b",
        "amber",
        10
      ],
      [
        "citronellol",
        7.79,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        25.97,
        "b",
        "amber",
        100
      ],
      [
        "damascenone 10%",
        5.19,
        "h",
        "floral",
        10
      ],
      [
        "alpha-damascone 10%",
        10.39,
        "h",
        "gourmand",
        10
      ],
      [
        "sandalrome",
        28.57,
        "b",
        "woody",
        100
      ],
      [
        "delta-damascone",
        2.6,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl vanillin",
        10.39,
        "b",
        "amber",
        100
      ],
      [
        "galaxolide 50 IPM",
        103.9,
        "b",
        "musk",
        50
      ],
      [
        "galbex 183",
        5.19,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        18.18,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        197.4,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        2.6,
        "h",
        "floral",
        10
      ],
      [
        "iralia total",
        12.99,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        25.97,
        "b",
        "woody",
        100
      ],
      [
        "linalool",
        59.74,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        10.39,
        "t",
        "citrus",
        100
      ],
      [
        "methyl octine carbonate 10%",
        2.6,
        "t",
        "green",
        10
      ],
      [
        "oranger crystals 10%",
        14.29,
        "t",
        "citrus",
        10
      ],
      [
        "veramoss 10%",
        14.29,
        "b",
        "woody",
        10
      ],
      [
        "muscenone delta",
        6.49,
        "b",
        "musk",
        100
      ],
      [
        "rose oxide 10%",
        5.19,
        "h",
        "floral",
        10
      ],
      [
        "phenethylol",
        20.78,
        "h",
        "floral",
        100
      ],
      [
        "orange oil",
        18.18,
        "t",
        "citrus",
        100
      ],
      [
        "romandolide",
        51.95,
        "b",
        "musk",
        100
      ],
      [
        "benzyl salicylate",
        36.36,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        15.58,
        "t",
        "green",
        100
      ],
      [
        "sandal pentanol",
        25.97,
        "b",
        "woody",
        100
      ],
      [
        "terpineol",
        15.58,
        "h",
        "floral",
        100
      ],
      [
        "vanillin 10%",
        12.99,
        "b",
        "amber",
        10
      ],
      [
        "vertofix",
        51.95,
        "b",
        "woody",
        100
      ],
      [
        "ylang ylang oil",
        15.58,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-166",
    "te": "Fragrance composition (#166)",
    "tr": "Аромат композиция (#166)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "musk",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring isoeugenyl acetate 10%, cinnamyl acetate 10%, styrallyl acetate, bergamot oil.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция (#166)». Ключевые материалы структуры: hedione, habanolide, romandolide, coranol.",
    "pr": {
      "floral": 40,
      "spicy": 2,
      "gourmand": 2,
      "citrus": 7,
      "amber": 5,
      "musk": 50,
      "woody": 9,
      "green": 3
    },
    "it": [
      [
        "isoeugenyl acetate 10%",
        5.76,
        "h",
        "floral",
        10
      ],
      [
        "cinnamyl acetate 10%",
        8.65,
        "h",
        "spicy",
        10
      ],
      [
        "styrallyl acetate",
        5.76,
        "h",
        "gourmand",
        100
      ],
      [
        "bergamot oil",
        56.2,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl caproate 1%",
        2.88,
        "h",
        "gourmand",
        1
      ],
      [
        "cardamom seed oil 10%",
        11.53,
        "h",
        "spicy",
        10
      ],
      [
        "carvacrol 10%",
        8.65,
        "h",
        "floral",
        10
      ],
      [
        "cetalox 10%",
        23.05,
        "b",
        "amber",
        10
      ],
      [
        "coranol",
        66.28,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone 10%",
        2.88,
        "h",
        "gourmand",
        10
      ],
      [
        "gamma-decalactone",
        1.44,
        "h",
        "gourmand",
        100
      ],
      [
        "delta-damascone 10%",
        2.88,
        "h",
        "gourmand",
        10
      ],
      [
        "ethyl vanillin 10%",
        23.05,
        "b",
        "amber",
        10
      ],
      [
        "exaltolide",
        51.87,
        "b",
        "musk",
        100
      ],
      [
        "geranium oil 10%",
        11.53,
        "h",
        "floral",
        10
      ],
      [
        "habanolide",
        201.73,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        230.55,
        "h",
        "floral",
        100
      ],
      [
        "ocean propanal",
        2.88,
        "h",
        "floral",
        100
      ],
      [
        "helvetolide",
        14.41,
        "b",
        "musk",
        100
      ],
      [
        "2,4-ivy carbaldehyde",
        2.88,
        "t",
        "citrus",
        100
      ],
      [
        "iralia total",
        5.76,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        11.53,
        "b",
        "woody",
        100
      ],
      [
        "muscenone delta",
        8.65,
        "b",
        "musk",
        100
      ],
      [
        "gardenia pentyl acetate",
        4.32,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        28.82,
        "b",
        "woody",
        100
      ],
      [
        "polysantol",
        34.58,
        "b",
        "woody",
        100
      ],
      [
        "reseda acetal",
        2.88,
        "h",
        "floral",
        100
      ],
      [
        "romandolide",
        144.09,
        "b",
        "musk",
        100
      ],
      [
        "rose petal acetate",
        1.44,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        23.05,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-167",
    "te": "Fragrance composition for perfume",
    "tr": "Парфюмерная композиция для духов",
    "sd": "TGSC (dm1015272) · Patent 8,575,086",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,575,086 Flavor and fragrance compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Парфюмерная композиция для духов». Формула из патента 8,575,086. Ключевые материалы структуры: musk T, hedione, beta-pinene, carbitol.",
    "pr": {
      "floral": 50,
      "citrus": 9,
      "gourmand": 2,
      "musk": 17,
      "green": 2
    },
    "it": [
      [
        "alpha-pinene",
        8,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-16",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "allyl amyl glycolate",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "ambrettolide",
        8,
        "b",
        "musk",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "carbitol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "cardamom seed oil",
        3,
        "h",
        "spicy",
        100
      ],
      [
        "laevo-citronellol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "beta-damascone",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "dimethyl octanol 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "DIPG",
        29,
        "b",
        "aquatic",
        0
      ],
      [
        "dynascone 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "ethyl acetate 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "ethyl acetoacetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "galbanum oil 10%",
        10,
        "t",
        "green",
        10
      ],
      [
        "hedione",
        195,
        "h",
        "floral",
        100
      ],
      [
        "heliobouquet",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        2,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        3,
        "t",
        "green",
        10
      ],
      [
        "beta-ionone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "jasmin absolute",
        3,
        "h",
        "floral",
        100
      ],
      [
        "lime oil 10%",
        5,
        "t",
        "citrus",
        10
      ],
      [
        "linalyl acetate",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "buchu mercaptan 10% DPG solution",
        8,
        "h",
        "gourmand",
        10
      ],
      [
        "musk T",
        198,
        "b",
        "musk",
        100
      ],
      [
        "nerolidol",
        46,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        17,
        "h",
        "floral",
        100
      ],
      [
        "beta-pinene",
        117,
        "h",
        "floral",
        100
      ],
      [
        "rhubofix",
        12,
        "h",
        "floral",
        100
      ],
      [
        "rose absolute bulgaria",
        3,
        "h",
        "floral",
        100
      ],
      [
        "rose oil bulgaria 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "rose oxide 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "santalex T",
        40,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        14,
        "t",
        "green",
        100
      ],
      [
        "veloutone",
        12,
        "h",
        "floral",
        100
      ],
      [
        "maltol",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "(Z)-buchu mercaptan 10 ppm DPG solution",
        5,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-168",
    "te": "Fragrance composition for shampoo",
    "tr": "Парфюмерная композиция для шампуня",
    "sd": "TGSC (dm1015272) · Patent 8,575,086",
    "fa": "musk",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,575,086 Flavor and fragrance compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Парфюмерная композиция для шампуня». Формула из патента 8,575,086. Ключевые материалы структуры: galaxolide 50 BB, hedione, benzyl salicylate, nerolidol.",
    "pr": {
      "green": 10,
      "floral": 41,
      "musk": 50,
      "citrus": 24,
      "spicy": 1,
      "gourmand": 3
    },
    "it": [
      [
        "benzyl salicylate",
        55,
        "t",
        "green",
        100
      ],
      [
        "laevo-citronellol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ethyl acetoacetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 BB",
        390,
        "b",
        "musk",
        50
      ],
      [
        "geraniol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        120,
        "h",
        "floral",
        100
      ],
      [
        "heliobouquet",
        8,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol 10%",
        10,
        "t",
        "green",
        10
      ],
      [
        "cis-3-hexenyl acetate 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "beta-ionone",
        17,
        "h",
        "floral",
        100
      ],
      [
        "kovanol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        45,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        45,
        "t",
        "citrus",
        100
      ],
      [
        "nerolidol",
        55,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl cinnamate",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "santalex T",
        35,
        "h",
        "floral",
        100
      ],
      [
        "triplal 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "maltol 1%",
        15,
        "h",
        "gourmand",
        1
      ],
      [
        "(Z)-buchu mercaptan 10 ppm DPG solution",
        5,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-169",
    "te": "Fragrance composition GJG817AGJ",
    "tr": "Аромат композиция GJG817AGJ",
    "sd": "TGSC (dm1015272) · Patent 6,610,648",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,610,648 Malodor counteractant compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат композиция GJG817AGJ». Формула из патента 6,610,648. Ключевые материалы структуры: hedione, iso e super, linalool, dihydromyrcenol.",
    "pr": {
      "floral": 50,
      "citrus": 7,
      "woody": 10
    },
    "it": [
      [
        "allyl amyl glycolate",
        4,
        "h",
        "gourmand",
        100
      ],
      [
        "coumarin",
        5.5,
        "b",
        "amber",
        100
      ],
      [
        "cyclogalbanate",
        4,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        105.5,
        "t",
        "citrus",
        100
      ],
      [
        "ebanol",
        5.5,
        "b",
        "woody",
        100
      ],
      [
        "ethyl linalool",
        19,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        433.5,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        2,
        "t",
        "green",
        100
      ],
      [
        "beta-ionone",
        30.5,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        132.5,
        "b",
        "woody",
        100
      ],
      [
        "lilial",
        28,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        124.5,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        34,
        "h",
        "floral",
        100
      ],
      [
        "tropional",
        41.5,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        30,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-170",
    "te": "Freesia fragrance",
    "tr": "Фрезия аромат",
    "sd": "TGSC (dm1015272) · Patent 6,022,531",
    "fa": "floral",
    "kd": "perfume",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,022,531 Use of 2,5,6-trimethyl-2-heptanol in perfumery and as flavoringingredient.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фрезия аромат». Формула из патента 6,022,531. Ключевые материалы структуры: alpha-terpineol, cis-3-hexenyl isobutyrate 10%, beta-ionone, methyl anthranilate.",
    "pr": {
      "floral": 50,
      "citrus": 3,
      "green": 9
    },
    "it": [
      [
        "methyl anthranilate",
        75,
        "h",
        "floral",
        100
      ],
      [
        "farnesene",
        50,
        "h",
        "floral",
        100
      ],
      [
        "orangeflower absolute 10%",
        50,
        "t",
        "citrus",
        10
      ],
      [
        "geraniol",
        25,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "ocimene 10%",
        50,
        "h",
        "floral",
        10
      ],
      [
        "cis-3-hexenyl isobutyrate 10%",
        150,
        "t",
        "green",
        10
      ],
      [
        "dipentene",
        50,
        "h",
        "floral",
        100
      ],
      [
        "linalool oxide",
        50,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        275,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        25,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        150,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-171",
    "te": "Accord N° 208901 Fruity (Firmenich)",
    "tr": "Аккорд №208901 · фруктовый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): This green tea, citrus accord becomes more powerful, more diffusive, and gains a hint of berry fruitiness with the addition of FRUCTALTE™..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208901 · фруктовый (Firmenich)». Ключевые материалы структуры: HEDIONE® (Firmenich), HEDIONE® HC (Firmenich), BERGAMOT OIL, CORANOL (Firmenich).",
    "pr": {
      "floral": 50,
      "green": 3,
      "citrus": 10,
      "musk": 6
    },
    "it": [
      [
        "ALLYL CYCLOHEXYLPROPIONATE",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "CETALOX® (Firmenich)",
        5,
        "b",
        "amber",
        100
      ],
      [
        "BENZYL ACETATE",
        15,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        25,
        "t",
        "green",
        100
      ],
      [
        "BERGAMOT OIL",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "CIS-3-HEXENYL SALICYLATE",
        10,
        "t",
        "green",
        100
      ],
      [
        "CIS-JASMONE 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "CITRONELLOL",
        25,
        "h",
        "floral",
        100
      ],
      [
        "CORANOL (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCENONE (Firmenich) 10%",
        1,
        "h",
        "floral",
        10
      ],
      [
        "HEDIONE® (Firmenich)",
        350,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® HC (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HELVETOLIDE® (Firmenich)",
        30,
        "b",
        "musk",
        100
      ],
      [
        "HYDROXYCITRONELLAL",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "INDOL 1%",
        5,
        "h",
        "floral",
        1
      ],
      [
        "IONONE BETA",
        5,
        "h",
        "floral",
        100
      ],
      [
        "LEMON OIL",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "LINALOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "METHYL ANTHRANILATE 1%",
        2,
        "h",
        "floral",
        1
      ],
      [
        "OAKMOSS SYNTH 10%",
        2,
        "b",
        "woody",
        10
      ],
      [
        "POLYSANTOL® (Firmenich)",
        5,
        "b",
        "woody",
        100
      ],
      [
        "PORTUGAL FLORIDE DECOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "ROMANDOLIDE® (Firmenich)",
        50,
        "b",
        "musk",
        100
      ],
      [
        "TRIPLAL® (IFF)",
        2,
        "t",
        "green",
        100
      ],
      [
        "FRUCTALATE™ (Firmenich)",
        20,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-172",
    "te": "Accord N° 203438 Fruity apple green (Firmenich)",
    "tr": "Аккорд №203438 · фруктовый яблоко зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · ALDEHYDE SUPRA contributes to the green naturalness of this accord. It boosts the top note and gives strength and diffusion. It adds freshness and a natural \"tangyness\" to the apple note..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №203438 · фруктовый яблоко зелёный (Firmenich)». Ключевые материалы структуры: HABANOLIDE® 50 DIPG (Firmenich), AMYLCINNAMIC ALDEHYDE, DIHYDROMYRCENOL, HEDIONE® (Firmenich).",
    "pr": {
      "floral": 50,
      "citrus": 28,
      "gourmand": 23,
      "green": 5,
      "musk": 26
    },
    "it": [
      [
        "AMYL ACETATE",
        15,
        "h",
        "floral",
        100
      ],
      [
        "AMYLCINNAMIC ALDEHYDE",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "BENZYL ACETATE",
        50,
        "h",
        "floral",
        100
      ],
      [
        "CASSIS BASE 345 B (Firmenich)",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "CIS-3-HEXENYL ACETATE",
        5,
        "t",
        "green",
        100
      ],
      [
        "CIS-3-HEXENYL BUTYRATE 10%",
        20,
        "t",
        "green",
        10
      ],
      [
        "CIS-3-HEXENYL ISOBUTYRATE 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "CIS-3-HEXENYL SALICYLATE",
        10,
        "t",
        "green",
        100
      ],
      [
        "CITROASIS BASE 129022 (Firmenich)",
        15,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCENONE (Firmenich) 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "DAMASCONE ALPHA (Firmenich) 10%",
        15,
        "h",
        "gourmand",
        10
      ],
      [
        "DIHYDROMYRCENOL",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "DYNASCONE® (Firmenich) 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "ETHYL BUTYRATE 1%",
        15,
        "h",
        "gourmand",
        1
      ],
      [
        "ETHYL MALTOL 10%",
        2,
        "h",
        "gourmand",
        10
      ],
      [
        "ETHYL METHYL PHENYL GLYCIDATE",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ETHYLMETHYLBUTYRATE",
        8,
        "h",
        "floral",
        100
      ],
      [
        "EXALTOLIDE® TOTAL (Firmenich)",
        45,
        "b",
        "musk",
        100
      ],
      [
        "FLOROL® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® 50 DIPG (Firmenich)",
        150,
        "b",
        "musk",
        50
      ],
      [
        "HEDIONE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "ISOPENTYRATE (Firmenich)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "METHYLBUTYRIC ACID",
        5,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLHEXANOL (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "UNDECALACTONE GAMMA",
        25,
        "h",
        "gourmand",
        100
      ],
      [
        "VERDOX® (IFF)",
        100,
        "h",
        "gourmand",
        100
      ],
      [
        "ALDEHYDE SUPRA (Firmenich) 10%",
        10,
        "t",
        "citrus",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-173",
    "te": "Fruity berries aldehydic (Patent 8,114,823)",
    "tr": "Фруктово-ягодный альдегидный аккорд (Патент 8,114,823)",
    "sd": "TGSC (dm1015272) · Patent 8,114,823",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,114,823 Isomers of bicyclo[2.2.1]hept-5-ene-2-carboxylic acid, ethyl ester and their use in perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фруктово-ягодный альдегидный аккорд (Патент 8,114,823)». Формула из патента 8,114,823. Ключевые материалы структуры: lyral, galaxolide 50 DPG, applelide, ethyl 2-methyl butyrate.",
    "pr": {
      "green": 2,
      "citrus": 5,
      "gourmand": 16,
      "musk": 25,
      "floral": 50
    },
    "it": [
      [
        "triplal",
        20,
        "t",
        "green",
        100
      ],
      [
        "aldehyde C-10",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "allyl caproate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "applelide",
        100,
        "b",
        "musk",
        100
      ],
      [
        "bornafix",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cashmeran",
        3,
        "b",
        "musk",
        100
      ],
      [
        "endo-ethyl bicyclo(2.2.1)-5-heptene-2-carboxylate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ethyl vanillin",
        3,
        "b",
        "amber",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        100,
        "h",
        "gourmand",
        100
      ],
      [
        "floriffol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 DPG",
        150,
        "b",
        "musk",
        50
      ],
      [
        "alpha-ionone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "kharismal",
        100,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        159,
        "h",
        "floral",
        100
      ],
      [
        "mimosa absolute france",
        3,
        "h",
        "floral",
        100
      ],
      [
        "nebulone",
        60,
        "h",
        "floral",
        100
      ],
      [
        "orange oil florida",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "prenyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "trisamber 1%",
        2,
        "b",
        "amber",
        1
      ],
      [
        "verdox",
        50,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-174",
    "te": "Fruity berries aldehydic (Patent 8,114,823)",
    "tr": "Фруктово-ягодный альдегидный аккорд (Патент 8,114,823)",
    "sd": "TGSC (dm1015272) · Patent 8,114,823",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,114,823 Isomers of bicyclo[2.2.1]hept-5-ene-2-carboxylic acid, ethyl ester and their use in perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фруктово-ягодный альдегидный аккорд (Патент 8,114,823)». Формула из патента 8,114,823. Ключевые материалы структуры: lyral, galaxolide 50 DPG, applelide, ethyl 2-methyl butyrate.",
    "pr": {
      "green": 2,
      "citrus": 5,
      "gourmand": 16,
      "musk": 25,
      "floral": 50
    },
    "it": [
      [
        "triplal",
        20,
        "t",
        "green",
        100
      ],
      [
        "aldehyde C-10",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "allyl caproate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "applelide",
        100,
        "b",
        "musk",
        100
      ],
      [
        "bornafix",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cashmeran",
        3,
        "b",
        "musk",
        100
      ],
      [
        "ethyl bicyclo(2.2.1)-5-heptene-2-carboxylate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ethyl vanillin",
        3,
        "b",
        "amber",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        100,
        "h",
        "gourmand",
        100
      ],
      [
        "floriffol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 DPG",
        150,
        "b",
        "musk",
        50
      ],
      [
        "alpha-ionone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "kharismal",
        100,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        159,
        "h",
        "floral",
        100
      ],
      [
        "mimosa absolute france",
        3,
        "h",
        "floral",
        100
      ],
      [
        "nebulone",
        60,
        "h",
        "floral",
        100
      ],
      [
        "orange oil florida",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "prenyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "trisamber 1%",
        2,
        "b",
        "amber",
        1
      ],
      [
        "verdox",
        50,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-175",
    "te": "Accord N° 208101 Fruity floral (Firmenich)",
    "tr": "Аккорд №208101 · фруктовый цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% · KIWI VERT 66358 B gives a rich exotic note to this fruity floral accord..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208101 · фруктовый цветочный (Firmenich)». Ключевые материалы структуры: ORANGE BRAZIL, AMYLCINNAMIC ALDEHYDE, HEDIONE® (Firmenich), BERGAMOTE SYNTH.",
    "pr": {
      "citrus": 33,
      "floral": 50,
      "woody": 5,
      "gourmand": 2
    },
    "it": [
      [
        "ALDEHYDE C 10 10%",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "ALDEHYDE C11 UNDECYLENIC 10%",
        25,
        "t",
        "citrus",
        10
      ],
      [
        "AMYLCINNAMIC ALDEHYDE",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "BERGAMOTE SYNTH",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "CEDROXYDE® (Firmenich)",
        25,
        "h",
        "floral",
        100
      ],
      [
        "CITRON 171 (Firmenich)",
        75,
        "h",
        "floral",
        100
      ],
      [
        "CYCLOSIA® BASE (Firmenich)",
        55,
        "h",
        "floral",
        100
      ],
      [
        "GERANIUM BOURBON",
        70,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER® (IFF)",
        60,
        "b",
        "woody",
        100
      ],
      [
        "JASMIN ABS SYNTH",
        80,
        "h",
        "floral",
        100
      ],
      [
        "ORANGE BRAZIL",
        150,
        "t",
        "citrus",
        100
      ],
      [
        "PARA TERT BUTYL CYCLOHEXYL ACETATE",
        55,
        "h",
        "floral",
        100
      ],
      [
        "ROSE OXIDE 10%",
        50,
        "h",
        "floral",
        10
      ],
      [
        "UNDECALACTONE GAMMA 10%",
        25,
        "h",
        "gourmand",
        10
      ],
      [
        "YLANG OIL",
        20,
        "h",
        "floral",
        100
      ],
      [
        "KIWI VERT 66358 B",
        20,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-176",
    "te": "Accord N° 207851 Fruity floral (Firmenich)",
    "tr": "Аккорд №207851 · фруктовый цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Heavy duty liquid: 0.30% ; Shampoo: 0.50% ; Soap: 0.50% ; Softner: 0.20% · This accord demonstrates the use of a fruity note so as to give an effect that is fragrant and caring without being too heavy nor edible..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207851 · фруктовый цветочный (Firmenich)». Ключевые материалы структуры: PASSION FRUIT BASE 109223 (Firmenich), HEXYLCINNAMIC ALDEHYDE, AMYL SALICYLATE, BENZYL ACETATE.",
    "pr": {
      "green": 10,
      "floral": 50,
      "amber": 2,
      "musk": 5,
      "citrus": 11
    },
    "it": [
      [
        "AMYL SALICYLATE",
        125,
        "t",
        "green",
        100
      ],
      [
        "BENZYL ACETATE",
        125,
        "h",
        "floral",
        100
      ],
      [
        "COUMARIN",
        6,
        "b",
        "amber",
        100
      ],
      [
        "DAMASCONE BETA (Firmenich) 10%",
        6,
        "h",
        "gourmand",
        10
      ],
      [
        "EXALTEX® (Firmenich)",
        44,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® 50 DIPG (Firmenich)",
        62,
        "b",
        "musk",
        50
      ],
      [
        "HEDIONE® (Firmenich)",
        44,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        138,
        "t",
        "citrus",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "NEROLI SYNTH",
        6,
        "t",
        "citrus",
        100
      ],
      [
        "TERPINEOL",
        75,
        "h",
        "floral",
        100
      ],
      [
        "VANILLIN 10%",
        19,
        "b",
        "amber",
        10
      ],
      [
        "PASSION FRUIT BASE 109223 (Firmenich)",
        250,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-177",
    "te": "Accord N° 208048 Fruity floral (Firmenich)",
    "tr": "Аккорд №208048 · фруктовый цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · In the presence of CYCLOMETHYLENE CITRONELLOL the accord becomes more floral in the rose and freesia direction while being less edible. At the same time, CYCLOMETHYLENE CITRONELLOL blends the flowery and fruity notes and introduces an original apricot skin effect..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208048 · фруктовый цветочный (Firmenich)». Ключевые материалы структуры: HEDIONE® (Firmenich), HEXYL SALICYLATE, CITRONELLOL, PHENYLETHYL ALCOHOL.",
    "pr": {
      "floral": 50,
      "gourmand": 1,
      "green": 13
    },
    "it": [
      [
        "CITRONELLOL",
        120,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCONE ALPHA (Firmenich)",
        4,
        "h",
        "gourmand",
        100
      ],
      [
        "DECALACTONE GAMMA",
        8,
        "h",
        "gourmand",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "GERANIOL",
        60,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        240,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        200,
        "t",
        "green",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        78,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "CYCLOMETHYLENE CITRONELLOL",
        100,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-178",
    "te": "Accord N° 208009 Fruity floral (Firmenich)",
    "tr": "Аккорд №208009 · фруктовый цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% · FLOROL harmonizes well with the floral and mandarin notes. It helps to develop a clean smoothing effect in this accord..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208009 · фруктовый цветочный (Firmenich)». Ключевые материалы структуры: HEXYLCINNAMIC ALDEHYDE, LINALOL, TANGERINE 32842 D (Firmenich), HEXYL SALICYLATE.",
    "pr": {
      "citrus": 35,
      "floral": 50,
      "gourmand": 5,
      "musk": 2,
      "green": 7,
      "woody": 10
    },
    "it": [
      [
        "ALDEHYDE MNA 10%",
        50,
        "t",
        "citrus",
        10
      ],
      [
        "BENZYL ACETATE",
        40,
        "h",
        "floral",
        100
      ],
      [
        "BERGAMOT SYNTH",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "DAMASCONE ALPHA 10%",
        20,
        "h",
        "gourmand",
        10
      ],
      [
        "DIHYDROMYRCENOL",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "FARENAL® (Symrise) 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "GALBEX® 183 (Firmenich) 10%",
        50,
        "h",
        "floral",
        10
      ],
      [
        "HABANOLIDE® (Firmenich)",
        20,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        60,
        "t",
        "green",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        120,
        "t",
        "citrus",
        100
      ],
      [
        "ISO BORNYL ACETATE",
        20,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        110,
        "h",
        "floral",
        100
      ],
      [
        "OAKMOSS SYNTH 10%",
        60,
        "b",
        "woody",
        10
      ],
      [
        "SANDELA® (Givaudan)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "TANGERINE 32842 D (Firmenich)",
        110,
        "t",
        "citrus",
        100
      ],
      [
        "TRIDECEN-2-AL 10%",
        60,
        "h",
        "floral",
        10
      ],
      [
        "UNDECALACTONE GAMMA 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        30,
        "b",
        "woody",
        100
      ],
      [
        "FLOROL® (Firmenich)",
        40,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-179",
    "te": "Accord N° 208899 Fruity floral (Firmenich)",
    "tr": "Аккорд №208899 · фруктовый цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): This fruity peach / apple floral fragrance becomes more natural, complex, and somewhat berry with the addition or Romandolide®. The combination with top note musk Helvetolide® adds boost and diffusion to Romandolide®'s nitromusk like qualities..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208899 · фруктовый цветочный (Firmenich)». Ключевые материалы структуры: HEDIONE® (Firmenich), FLOROL® (Firmenich), ROMANDOLIDE® (Firmenich), ETHYL LINALOL.",
    "pr": {
      "floral": 50,
      "citrus": 6,
      "gourmand": 5,
      "musk": 9,
      "woody": 6
    },
    "it": [
      [
        "ACETATE DE BENZYLE EXTRA",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ALDEHYDE C11 UNDECYLENIC 10%",
        3,
        "t",
        "citrus",
        10
      ],
      [
        "BENZYL PROPIONATE",
        2,
        "h",
        "floral",
        100
      ],
      [
        "CETALOX® (Firmenich)",
        2,
        "b",
        "amber",
        100
      ],
      [
        "CIS-3-HEXENYL ACETATE",
        2,
        "t",
        "green",
        100
      ],
      [
        "CIS-JASMONE 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "CITRONELLYL ACETATE",
        3,
        "h",
        "floral",
        100
      ],
      [
        "CORANOL (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "DIMETHYL BENZYL CARBINYL ACETATE",
        3,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCONE ALPHA (Firmenich)",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "DARTANOL™ (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "DECALACTONE GAMMA",
        30,
        "h",
        "gourmand",
        100
      ],
      [
        "ETHYL LINALOL",
        80,
        "h",
        "floral",
        100
      ],
      [
        "FLOROL® (Firmenich)",
        135,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        280,
        "h",
        "floral",
        100
      ],
      [
        "HELIONAL™ (IFF)",
        2,
        "h",
        "aquatic",
        100
      ],
      [
        "HELVETOLIDE® (Firmenich)",
        10,
        "b",
        "musk",
        100
      ],
      [
        "ISO E SUPER® (IFF)",
        75,
        "b",
        "woody",
        100
      ],
      [
        "LIFFAROME™ (IFF)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        30,
        "h",
        "floral",
        100
      ],
      [
        "LINALYL ACETATE",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "METHYL METHYLANTHRANILATE 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "METHYL PAMPLEMOUSSE (Givaudan)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "OAKMOSS SYNTH 10%",
        2,
        "b",
        "woody",
        10
      ],
      [
        "PHENYLETHYL ALCOHOL",
        23,
        "h",
        "floral",
        100
      ],
      [
        "SANDALORE® LG (Givaudan)",
        3,
        "b",
        "woody",
        100
      ],
      [
        "STYRALLYL ACETATE",
        7,
        "h",
        "gourmand",
        100
      ],
      [
        "TRIPLAL® (IFF) 10%",
        3,
        "t",
        "green",
        10
      ],
      [
        "UNDECALACTONE GAMMA",
        23,
        "h",
        "gourmand",
        100
      ],
      [
        "VELOUTONE™ (Firmenich)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "VERDOX™ (IFF)",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "ROMANDOLIDE® (Firmenich)",
        100,
        "b",
        "musk",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-180",
    "te": "Fruity floral accord for female perfumes",
    "tr": "Фруктово-цветочный аккорд для женских духов",
    "sd": "TGSC (dm1015272) · Patent 7,632,790",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,632,790 Trisubstituted furans suitable for the preparation of fragrance compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фруктово-цветочный аккорд для женских духов». Формула из патента 7,632,790. Ключевые материалы структуры: geraniol, silvial, 2-cyclohexyl-2-phenyl acetonitrile, alpha-hexyl cinnamaldehyde.",
    "pr": {
      "floral": 50,
      "gourmand": 2,
      "citrus": 5
    },
    "it": [
      [
        "benzyl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "2-cyclohexyl-2-phenyl acetonitrile",
        80,
        "h",
        "floral",
        100
      ],
      [
        "damascenone 1%",
        30,
        "h",
        "floral",
        1
      ],
      [
        "gamma-decalactone",
        4,
        "h",
        "gourmand",
        100
      ],
      [
        "citronellol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl butyrate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "ethyl butyrate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl maltol 10%",
        4,
        "h",
        "gourmand",
        10
      ],
      [
        "ethyl 2-methyl butyrate",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "geraniol",
        240,
        "h",
        "floral",
        100
      ],
      [
        "1a,3,3,4,6,6-hexamethyl-1a,2,3,4,5,6,7,7a-octahydronaphtho[2,3-b]oxirene 50%",
        50,
        "h",
        "floral",
        50
      ],
      [
        "cis-3-hexenol",
        4,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        4,
        "t",
        "green",
        100
      ],
      [
        "isojasmone 10%",
        12,
        "h",
        "floral",
        10
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "silvial",
        200,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        80,
        "h",
        "floral",
        100
      ],
      [
        "alpha-isomethyl ionone (90% min.)",
        60,
        "h",
        "floral",
        90
      ],
      [
        "gamma-undecalactone",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "2-tert-butyl-5-methyl-2-propyltetrahydrofuran",
        40,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-181",
    "te": "Fruity floral chypre feminine fine fragrance",
    "tr": "Фруктовый цветочный шипр женский Аромат высокой парфюмерии",
    "sd": "TGSC (dm1015272) · Patent 7,632,791",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,632,791 Spirocyclic ketols and their use.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фруктовый цветочный шипр женский Аромат высокой парфюмерии». Формула из патента 7,632,791. Ключевые материалы структуры: hedione, lilial, ethyl linalool, ethylene brassylate.",
    "pr": {
      "floral": 50,
      "citrus": 4,
      "amber": 1,
      "green": 3,
      "woody": 10,
      "musk": 8
    },
    "it": [
      [
        "benzyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        55,
        "t",
        "citrus",
        100
      ],
      [
        "lilial",
        100,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "alpha-damascone",
        0.5,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl linalool",
        100,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        25,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        8,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        1,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        40,
        "t",
        "green",
        100
      ],
      [
        "beta-ionone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "florol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        30,
        "b",
        "woody",
        100
      ],
      [
        "hedione",
        340,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "ethylene brassylate",
        100,
        "b",
        "musk",
        100
      ],
      [
        "gamma-undecalactone",
        0.5,
        "h",
        "gourmand",
        100
      ],
      [
        "vanillin",
        5,
        "b",
        "amber",
        100
      ],
      [
        "patchouli oil",
        100,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-182",
    "te": "fruity floral composition",
    "tr": "Фруктовый цветочный композиция",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring acalea, aldehyde C-8, applelide, benzyl acetate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фруктовый цветочный композиция». Ключевые материалы структуры: dimethyl benzyl carbinyl butyrate, applelide, benzyl alcohol, citronellol.",
    "pr": {
      "floral": 50,
      "citrus": 6,
      "musk": 5,
      "gourmand": 5,
      "aquatic": 1,
      "spicy": 4
    },
    "it": [
      [
        "acalea",
        37,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-8",
        1.4,
        "t",
        "citrus",
        100
      ],
      [
        "applelide",
        68.9,
        "b",
        "musk",
        100
      ],
      [
        "benzyl acetate",
        34.5,
        "h",
        "floral",
        100
      ],
      [
        "benzyl alcohol",
        68.9,
        "h",
        "floral",
        100
      ],
      [
        "benzyl propionate",
        34.5,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        68.9,
        "h",
        "floral",
        100
      ],
      [
        "cyclamal extra",
        6.9,
        "h",
        "floral",
        100
      ],
      [
        "cyclaprop",
        10.3,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl butyrate",
        82.7,
        "h",
        "floral",
        100
      ],
      [
        "ethyl caproate",
        6.9,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl vanillin",
        0.7,
        "b",
        "amber",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        1.4,
        "h",
        "gourmand",
        100
      ],
      [
        "floralozone",
        13.8,
        "h",
        "aquatic",
        100
      ],
      [
        "para-anisyl phenyl acetate",
        50,
        "h",
        "spicy",
        100
      ],
      [
        "geranyl acetate",
        20.7,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        1.4,
        "h",
        "aquatic",
        100
      ],
      [
        "hexalon",
        6.9,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        2.8,
        "t",
        "green",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        41.3,
        "t",
        "citrus",
        100
      ],
      [
        "hexyl salicylate",
        0.7,
        "t",
        "green",
        100
      ],
      [
        "isocyclemone E",
        4.1,
        "t",
        "citrus",
        100
      ],
      [
        "kharismal",
        43.5,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        68.9,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        55.1,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        13.8,
        "t",
        "citrus",
        100
      ],
      [
        "methyl cinnamate",
        6.9,
        "h",
        "spicy",
        100
      ],
      [
        "methyl ionone alpha, iso",
        3.4,
        "h",
        "floral",
        100
      ],
      [
        "muguesia",
        20.7,
        "h",
        "floral",
        100
      ],
      [
        "nerol",
        34.5,
        "h",
        "floral",
        100
      ],
      [
        "neryl acetate",
        1.4,
        "h",
        "floral",
        100
      ],
      [
        "ocimene",
        0.7,
        "h",
        "floral",
        100
      ],
      [
        "orange peel oil decolorized",
        27.6,
        "t",
        "citrus",
        100
      ],
      [
        "gamma-undecalactone",
        6.9,
        "h",
        "gourmand",
        100
      ],
      [
        "phenethyl alcohol",
        17.2,
        "h",
        "floral",
        100
      ],
      [
        "styralyl acetate",
        0.7,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        13.8,
        "h",
        "floral",
        100
      ],
      [
        "verdox",
        51.7,
        "h",
        "gourmand",
        100
      ],
      [
        "vertenex",
        68.5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-183",
    "te": "Accord N° 207836 Fruity floral green (Firmenich)",
    "tr": "Аккорд №207836 · фруктовый цветочный зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Softner: 0.30% · A lovely fruity- floral complex is developed by the addition of PASSION FRUIT BASE 109223 this accord..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207836 · фруктовый цветочный зелёный (Firmenich)». Ключевые материалы структуры: BENZYL SALICYLATE, HEDIONE® (Firmenich), PHENYLACETIC ALDEHYDE 1%, LILIAL® (Givaudan).",
    "pr": {
      "floral": 50,
      "green": 21,
      "aquatic": 3,
      "citrus": 10,
      "gourmand": 2
    },
    "it": [
      [
        "BENZYL ACETATE",
        75,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        200,
        "t",
        "green",
        100
      ],
      [
        "CEDROXYDE® (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "CIS-3-HEXENYL SALICYLATE",
        20,
        "t",
        "green",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        140,
        "h",
        "floral",
        100
      ],
      [
        "HELIONAL® (IFF)",
        40,
        "h",
        "aquatic",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "JASMIN SYNTH",
        20,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLACETIC ALDEHYDE 1%",
        120,
        "t",
        "citrus",
        1
      ],
      [
        "PHENYLETHYL ALCOHOL",
        30,
        "h",
        "floral",
        100
      ],
      [
        "TRIPLAL® (IFF) 10%",
        25,
        "t",
        "green",
        10
      ],
      [
        "UNDECALACTONE GAMMA",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "PASSION FRUIT BASE 109223 (Firmenich)",
        50,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-184",
    "te": "Accord N° 207874 Fruity floral green (Firmenich)",
    "tr": "Аккорд №207874 · фруктовый цветочный зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.30% · A lovely fruity-floral complex is developed by the addition of PASSION FRUIT BASE 109223 to this accord..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207874 · фруктовый цветочный зелёный (Firmenich)». Ключевые материалы структуры: BENZYL SALICYLATE, HEDIONE® (Firmenich), PHENYLETHYL ALCOHOL, LILIAL® (Givaudan).",
    "pr": {
      "green": 18,
      "floral": 50,
      "aquatic": 3,
      "citrus": 2,
      "gourmand": 2
    },
    "it": [
      [
        "BENZYL SALICYLATE",
        200,
        "t",
        "green",
        100
      ],
      [
        "CEDROXYDE® (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "CIS-3-HEXENYL SALICYLATE",
        20,
        "t",
        "green",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        130,
        "h",
        "floral",
        100
      ],
      [
        "HELIONAL® (IFF)",
        40,
        "h",
        "aquatic",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "JASMIN BASE",
        95,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLACETIC ALDEHYDE 1%",
        30,
        "t",
        "citrus",
        1
      ],
      [
        "PHENYLETHYL ALCOHOL",
        130,
        "h",
        "floral",
        100
      ],
      [
        "TRIPLAL® 10% (IFF)",
        25,
        "t",
        "green",
        10
      ],
      [
        "UNDECALACTONE GAMMA",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "PASSION FRUIT BASE 109223 (Firmenich)",
        50,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-185",
    "te": "Fruity floral perfume",
    "tr": "Фруктовый цветочный парфюм",
    "sd": "TGSC (dm1015272) · Patent 7,585,833",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,585,833 Malodor covering perfumery.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фруктовый цветочный парфюм». Формула из патента 7,585,833. Ключевые материалы структуры: galaxolide 50 IPM, benzyl salicylate, DIPG, hedione.",
    "pr": {
      "gourmand": 20,
      "citrus": 17,
      "green": 19,
      "floral": 50,
      "musk": 28,
      "woody": 2
    },
    "it": [
      [
        "allyl caproate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "alpha-amyl cinnamaldehyde",
        19,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl salicylate",
        122,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenol",
        1,
        "t",
        "green",
        100
      ],
      [
        "cyclacet",
        45,
        "h",
        "floral",
        100
      ],
      [
        "dextro-limonene",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "dynascone 10%",
        7,
        "h",
        "floral",
        10
      ],
      [
        "ethyl 2-methyl butyrate",
        30,
        "h",
        "gourmand",
        100
      ],
      [
        "ethylene brassylate",
        53,
        "b",
        "musk",
        100
      ],
      [
        "florol",
        5,
        "h",
        "floral",
        100
      ],
      [
        "fructone",
        15,
        "h",
        "gourmand",
        100
      ],
      [
        "galaxolide 50 IPM",
        138,
        "b",
        "musk",
        50
      ],
      [
        "gamma-undecalactone",
        25,
        "h",
        "gourmand",
        100
      ],
      [
        "geraniol",
        13,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        58,
        "h",
        "floral",
        100
      ],
      [
        "hexyl acetate",
        9,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-ionone",
        26,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        7,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        12,
        "b",
        "woody",
        100
      ],
      [
        "liffarome",
        17,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        32,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        45,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        10,
        "h",
        "floral",
        100
      ],
      [
        "manzanate",
        15,
        "h",
        "gourmand",
        100
      ],
      [
        "mayol",
        9,
        "h",
        "floral",
        100
      ],
      [
        "alpha-isomethyl ionone (50% min.)",
        18,
        "h",
        "floral",
        50
      ],
      [
        "styrallyl acetate",
        7,
        "h",
        "gourmand",
        100
      ],
      [
        "phenethyl acetate",
        2,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        22,
        "h",
        "floral",
        100
      ],
      [
        "romascone",
        5,
        "h",
        "floral",
        100
      ],
      [
        "tricyclodecenyl propionate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        5,
        "t",
        "green",
        100
      ],
      [
        "undecavertol",
        9,
        "h",
        "floral",
        100
      ],
      [
        "verdox",
        35,
        "h",
        "gourmand",
        100
      ],
      [
        "DIPG",
        74,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-186",
    "te": "Accord N° 207984 Fruity green (Firmenich)",
    "tr": "Аккорд №207984 · фруктовый зелёный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Shower gel: 1.00% · CITROASIS BASE 129022 adds freshness and naturalness to this exotic fruit accord reminiscent of mango..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207984 · фруктовый зелёный (Firmenich)». Ключевые материалы структуры: HEDIONE® (Firmenich), VERDOX® (IFF), ETHYL MALONATE, LINALOL.",
    "pr": {
      "floral": 50,
      "citrus": 2,
      "green": 6,
      "gourmand": 16,
      "amber": 2
    },
    "it": [
      [
        "AMYL ACETATE",
        5,
        "h",
        "floral",
        100
      ],
      [
        "AMYL BUTYRATE",
        10,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL ALDEHYDE 10%",
        30,
        "t",
        "citrus",
        10
      ],
      [
        "CIS-3-HEXENOL 10%",
        40,
        "t",
        "green",
        10
      ],
      [
        "CIS-3-HEXENYL ACETATE 10%",
        20,
        "t",
        "green",
        10
      ],
      [
        "DECALACTONE GAMMA",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "ETHYL MALONATE",
        150,
        "h",
        "floral",
        100
      ],
      [
        "GALBEX® 183 (Firmenich)",
        15,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        180,
        "h",
        "floral",
        100
      ],
      [
        "LINALOL",
        150,
        "h",
        "floral",
        100
      ],
      [
        "LYRAL® (IFF)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "THIOXAN BASE 38375 D (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "TRANS-2-HEXENOL 10%",
        20,
        "t",
        "green",
        10
      ],
      [
        "TRIFERNAL® (Firmenich) 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "UNDECALACTONE GAMMA",
        50,
        "h",
        "gourmand",
        100
      ],
      [
        "VANILLIN 10%",
        20,
        "b",
        "amber",
        10
      ],
      [
        "VELOUTONE (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "VERDOX® (IFF)",
        160,
        "h",
        "gourmand",
        100
      ],
      [
        "CITROASIS BASE 129022 (Firmenich)",
        50,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-187",
    "te": "fruity green violet type",
    "tr": "Фруктовый зелёный фиалка (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring ambroxan, oxyphenylone, allyl amyl glycolate, eugenol 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фруктовый зелёный фиалка (тип)». Ключевые материалы структуры: galaxolide 50 IPM, isoraldeine 70, iso e super, hedione.",
    "pr": {
      "amber": 5,
      "floral": 50,
      "gourmand": 1,
      "spicy": 1,
      "citrus": 4,
      "green": 5,
      "woody": 17,
      "musk": 34
    },
    "it": [
      [
        "ambroxan",
        1,
        "b",
        "amber",
        100
      ],
      [
        "oxyphenylone",
        3,
        "h",
        "floral",
        100
      ],
      [
        "allyl amyl glycolate",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "eugenol 10%",
        5,
        "h",
        "spicy",
        10
      ],
      [
        "damascenone 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "beta-damascone 10%",
        7,
        "h",
        "gourmand",
        10
      ],
      [
        "aldehyde C-14",
        9,
        "t",
        "citrus",
        100
      ],
      [
        "vanillin",
        15,
        "b",
        "amber",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "floramat",
        20,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        25,
        "b",
        "amber",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "cyclohexyl salicylate",
        40,
        "t",
        "green",
        100
      ],
      [
        "troenan",
        45,
        "h",
        "floral",
        100
      ],
      [
        "sandelice",
        50,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        70,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        140,
        "b",
        "woody",
        100
      ],
      [
        "isoraldeine 70",
        190,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        275,
        "b",
        "musk",
        50
      ],
      [
        "DIPG",
        50,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-188",
    "te": "fruity perfume base",
    "tr": "Фруктовый парфюм парфюмерная база",
    "sd": "TGSC (dm1015272) · Patent 4,485,036",
    "fa": "gourmand",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,485,036 Odorant compositions containing megastigma-5(11),8-dien-4,7-oxides and tetra-substituted-7-oxa-bicyclo[3.3.0]-octanes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фруктовый парфюм парфюмерная база». Формула из патента 4,485,036. Ключевые материалы структуры: DIPG, methyl dihydrojasmonate, myraldyl acetate, cyclamen aldehyde.",
    "pr": {
      "floral": 50,
      "citrus": 14,
      "aquatic": 8,
      "gourmand": 8,
      "green": 3
    },
    "it": [
      [
        "DIPG",
        333.33,
        "b",
        "aquatic",
        0
      ],
      [
        "methyl dihydrojasmonate",
        222.22,
        "h",
        "floral",
        100
      ],
      [
        "myraldyl acetate",
        133.33,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        88.89,
        "t",
        "citrus",
        100
      ],
      [
        "melonal 10%",
        66.67,
        "h",
        "aquatic",
        10
      ],
      [
        "fructone",
        66.67,
        "h",
        "gourmand",
        100
      ],
      [
        "(Z)-6-nonen-1-ol 10%",
        44.44,
        "h",
        "floral",
        10
      ],
      [
        "cis-3-hexenyl acetate 10%",
        22.22,
        "t",
        "green",
        10
      ],
      [
        "lemon oil",
        22.22,
        "t",
        "citrus",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-189",
    "te": "fruity type",
    "tr": "Фруктовый (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring gamma-undecalactone 10%, phenethyl alcohol, methyl dihydrojasmonate, 2-ethyl-1-hexanol.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Фруктовый (тип)». Ключевые материалы структуры: gamma-undecalactone 10%, phenethyl alcohol, methyl dihydrojasmonate, 2-ethyl-1-hexanol.",
    "pr": {
      "gourmand": 50,
      "floral": 27,
      "green": 2
    },
    "it": [
      [
        "gamma-undecalactone 10%",
        577.32,
        "h",
        "gourmand",
        10
      ],
      [
        "phenethyl alcohol",
        206.19,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        61.86,
        "h",
        "floral",
        100
      ],
      [
        "2-ethyl-1-hexanol",
        36.08,
        "h",
        "floral",
        100
      ],
      [
        "2-tropical oxathiane 1%",
        30.93,
        "h",
        "floral",
        1
      ],
      [
        "delta-dodecalactone",
        25.77,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-decalactone",
        20.62,
        "h",
        "gourmand",
        100
      ],
      [
        "cis-3-hexenol 10%",
        20.62,
        "t",
        "green",
        10
      ],
      [
        "laevo-menthyl acetate",
        10.31,
        "h",
        "floral",
        100
      ],
      [
        "gamma-nonalactone",
        10.31,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-190",
    "te": "gardenia type",
    "tr": "Гардения (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, cinnamic alcohol, phenethyl alcohol, methyl anthranilate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Гардения (тип)». Ключевые материалы структуры: methyl dihydrojasmonate, benzyl salicylate, lyral, linalool.",
    "pr": {
      "floral": 50,
      "spicy": 1,
      "amber": 1,
      "green": 13,
      "gourmand": 1
    },
    "it": [
      [
        "benzyl acetate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "cinnamic alcohol",
        6,
        "h",
        "spicy",
        100
      ],
      [
        "phenethyl alcohol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "methyl benzoate",
        2,
        "h",
        "floral",
        100
      ],
      [
        "citronellol 98%",
        60,
        "h",
        "floral",
        98
      ],
      [
        "coumarin",
        4,
        "b",
        "amber",
        100
      ],
      [
        "geraniol pure",
        56,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        200,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        8,
        "b",
        "amber",
        100
      ],
      [
        "isoeugenol",
        3,
        "h",
        "spicy",
        100
      ],
      [
        "linalool",
        100,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        130,
        "h",
        "floral",
        100
      ],
      [
        "methyl ionone gamma supreme",
        40,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        200,
        "t",
        "green",
        100
      ],
      [
        "folione",
        5,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "para-methyl anisole 10%",
        6,
        "h",
        "spicy",
        10
      ],
      [
        "delta-dodecalactone",
        10,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-191",
    "te": "gel shower fragrance",
    "tr": "Отдушка для геля для душа",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring triplal, benzophenone, bergamot oil bergaptene reduced, cardamom seed oil.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Отдушка для геля для душа». Ключевые материалы структуры: spearmint oil, phenethyl alcohol, bergamot oil bergaptene reduced, galaxolide 50 IPM.",
    "pr": {
      "green": 28,
      "floral": 50,
      "citrus": 18,
      "spicy": 1,
      "musk": 11,
      "aquatic": 1,
      "woody": 2
    },
    "it": [
      [
        "triplal",
        15,
        "t",
        "green",
        100
      ],
      [
        "benzophenone",
        5,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "cardamom seed oil",
        8,
        "h",
        "spicy",
        100
      ],
      [
        "dihydromyrcenol",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "diphenyl oxide",
        10,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        100,
        "b",
        "musk",
        50
      ],
      [
        "geranium oil",
        12,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        60,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        6,
        "h",
        "aquatic",
        100
      ],
      [
        "lilial",
        100,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        50,
        "h",
        "floral",
        100
      ],
      [
        "melafleur",
        12,
        "h",
        "floral",
        100
      ],
      [
        "laevo-menthol",
        37,
        "h",
        "floral",
        100
      ],
      [
        "nerol",
        45,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        15,
        "b",
        "woody",
        100
      ],
      [
        "peppermint oil",
        40,
        "t",
        "green",
        100
      ],
      [
        "phenethyl alcohol",
        125,
        "h",
        "floral",
        100
      ],
      [
        "spearmint oil",
        200,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-192",
    "te": "Accord Number 1229 - Gourmand (IFF)",
    "tr": "Аккорд №1229 · гурманский (IFF)",
    "sd": "TGSC (dm1015272) · IFF",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring BENZOPHENONE, DIJASMONE 10%, FLORIFFOL (IFF), HEXYL CINNAMIC ALDEHYDE.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №1229 · гурманский (IFF)». Ключевые материалы структуры: GALAXOLIDE® (IFF) UNDILUTED, HEXYL CINNAMIC ALDEHYDE, ISO PROPYL MYRISTATE, TIMBERSILK™ (IFF).",
    "pr": {
      "floral": 44,
      "citrus": 43,
      "gourmand": 4,
      "spicy": 3,
      "woody": 50,
      "green": 3,
      "musk": 47,
      "amber": 2
    },
    "it": [
      [
        "BENZOPHENONE",
        3,
        "h",
        "floral",
        100
      ],
      [
        "DIJASMONE 10%",
        14,
        "h",
        "floral",
        10
      ],
      [
        "FLORIFFOL (IFF)",
        8,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL CINNAMIC ALDEHYDE",
        180,
        "t",
        "citrus",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        8,
        "h",
        "floral",
        100
      ],
      [
        "METHYL DH JASMONATE",
        60,
        "h",
        "floral",
        100
      ],
      [
        "NERYL ACETATE A (IFF) 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "CYCLACET® (IFF) 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "UNDECALACTONE GAMMA COEUR 10%",
        4,
        "h",
        "gourmand",
        10
      ],
      [
        "VERDOX™ (IFF) 10%",
        14,
        "h",
        "gourmand",
        10
      ],
      [
        "CINNAMIC ALCOHOL",
        4,
        "h",
        "spicy",
        100
      ],
      [
        "EUGENOL EX CLOVE BUD",
        12,
        "h",
        "spicy",
        100
      ],
      [
        "ISO EUGENOL",
        3,
        "b",
        "woody",
        100
      ],
      [
        "METHYL CINNAMIC ALDEHYDE,ALPHA 10%",
        5,
        "t",
        "citrus",
        10
      ],
      [
        "DIMETH BENZ CARB BUTYRATE (IFF) 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "HEXYL SALICYLATE",
        16,
        "t",
        "green",
        100
      ],
      [
        "GALAXOLIDE® (IFF) UNDILUTED",
        240,
        "b",
        "musk",
        100
      ],
      [
        "AMYRIS OIL",
        3,
        "h",
        "floral",
        100
      ],
      [
        "BACDANOL®",
        34,
        "b",
        "woody",
        100
      ],
      [
        "BENZALDEHYDE 10%",
        2,
        "t",
        "citrus",
        10
      ],
      [
        "CEDARWOOD WHITE (IFF)",
        10,
        "b",
        "woody",
        100
      ],
      [
        "CEDROL CRYSTALS (IFF)",
        4,
        "b",
        "woody",
        100
      ],
      [
        "ISO CYCLEMONE E (IFF)",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "SANDALORE® (Givaudan)",
        30,
        "b",
        "woody",
        100
      ],
      [
        "TIMBERSILK™ (IFF)",
        118,
        "b",
        "woody",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        56,
        "b",
        "woody",
        100
      ],
      [
        "COUMARIN 10%",
        7,
        "b",
        "amber",
        10
      ],
      [
        "VANILLIN",
        5,
        "b",
        "amber",
        100
      ],
      [
        "ISO PROPYL MYRISTATE",
        120,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-193",
    "te": "gourmand fruity musk type",
    "tr": "Гурманский фруктовый мускусный (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "musk",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, para-anisaldehyde, alpha-hexyl cinnamaldehyde, manzanate 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Гурманский фруктовый мускусный (тип)». Ключевые материалы структуры: helvetolide, alpha-hexyl cinnamaldehyde, hexyl salicylate, benzyl acetate.",
    "pr": {
      "floral": 26,
      "citrus": 50,
      "gourmand": 31,
      "woody": 8,
      "amber": 10,
      "musk": 30,
      "green": 23
    },
    "it": [
      [
        "benzyl acetate",
        116.67,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde",
        96.67,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        150,
        "t",
        "citrus",
        100
      ],
      [
        "manzanate 10%",
        16.67,
        "h",
        "gourmand",
        10
      ],
      [
        "gamma-undecalactone",
        50,
        "h",
        "gourmand",
        100
      ],
      [
        "allyl cyclohexyl propionate",
        3.33,
        "h",
        "gourmand",
        100
      ],
      [
        "delphol",
        6.67,
        "h",
        "floral",
        100
      ],
      [
        "sandalrome",
        16.67,
        "b",
        "woody",
        100
      ],
      [
        "ethyl maltol",
        11.67,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl vanillin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "heliotropin",
        33.33,
        "b",
        "amber",
        100
      ],
      [
        "helvetolide",
        166.67,
        "b",
        "musk",
        100
      ],
      [
        "melonal",
        1.67,
        "h",
        "aquatic",
        100
      ],
      [
        "lily of the valley specialty",
        6.67,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        16.67,
        "h",
        "floral",
        100
      ],
      [
        "gamma-octalactone",
        90,
        "h",
        "gourmand",
        100
      ],
      [
        "orange oil",
        33.33,
        "t",
        "citrus",
        100
      ],
      [
        "hexyl salicylate",
        126.67,
        "t",
        "green",
        100
      ],
      [
        "vertofix",
        30,
        "b",
        "woody",
        100
      ],
      [
        "DIPG",
        6.67,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-194",
    "te": "grapefruit type",
    "tr": "Грейпфрут (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, cis-3-hexenyl acetate 10%, acetophenone 10%, aldehyde C-10.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Грейпфрут (тип)». Ключевые материалы структуры: dextro-limonene, linalool, Limette, coranol.",
    "pr": {
      "floral": 35,
      "green": 6,
      "citrus": 50,
      "gourmand": 7
    },
    "it": [
      [
        "benzyl acetate",
        18.18,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        27.27,
        "t",
        "green",
        10
      ],
      [
        "acetophenone 10%",
        22.73,
        "h",
        "floral",
        10
      ],
      [
        "aldehyde C-10",
        4.55,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 lauric 10%",
        22.73,
        "t",
        "citrus",
        10
      ],
      [
        "aldehyde C-8",
        4.55,
        "t",
        "citrus",
        100
      ],
      [
        "gamma-nonalactone 10%",
        9.09,
        "h",
        "gourmand",
        10
      ],
      [
        "ethyl butyrate 10%",
        9.09,
        "h",
        "gourmand",
        10
      ],
      [
        "laevo-carvone 10%",
        13.64,
        "h",
        "floral",
        10
      ],
      [
        "citral",
        4.55,
        "t",
        "citrus",
        100
      ],
      [
        "cis-3-hexenol 10%",
        22.73,
        "t",
        "green",
        10
      ],
      [
        "coranol",
        45.45,
        "h",
        "floral",
        100
      ],
      [
        "allyl cyclohexyl propionate",
        4.55,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-decalactone",
        4.55,
        "h",
        "gourmand",
        100
      ],
      [
        "beta-damascone 10%",
        13.64,
        "h",
        "gourmand",
        10
      ],
      [
        "allyl heptanoate",
        9.09,
        "h",
        "gourmand",
        100
      ],
      [
        "phenethyl isobutyrate",
        9.09,
        "h",
        "floral",
        100
      ],
      [
        "Limette",
        68.18,
        "t",
        "citrus",
        100
      ],
      [
        "dextro-limonene",
        363.64,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        172.73,
        "h",
        "floral",
        100
      ],
      [
        "tangerine oil",
        45.45,
        "t",
        "citrus",
        100
      ],
      [
        "methyl pamplemousse",
        9.09,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        45.45,
        "h",
        "floral",
        100
      ],
      [
        "buchu mercaptan 1%",
        22.73,
        "h",
        "gourmand",
        1
      ],
      [
        "beta-ionone",
        18.18,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        9.09,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-195",
    "te": "Green ambery masculine accord",
    "tr": "Зелёно-амбровый мужской аккорд",
    "sd": "TGSC (dm1015272) · Patent 6,114,300",
    "fa": "amber",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,114,300 Spirocyclic compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Зелёно-амбровый мужской аккорд». Формула из патента 6,114,300. Ключевые материалы структуры: thibetolide, oxyoctaline formate, bergamot oil bergaptene reduced, cepionate.",
    "pr": {
      "citrus": 15,
      "amber": 2,
      "green": 2,
      "woody": 15,
      "floral": 50,
      "spicy": 1
    },
    "it": [
      [
        "alpha-hexyl cinnamaldehyde",
        70,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 mna",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "ambroxan",
        2,
        "b",
        "amber",
        100
      ],
      [
        "basil oil",
        2,
        "t",
        "green",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "guaiacwood oil",
        40,
        "b",
        "woody",
        100
      ],
      [
        "cepionate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "cyclohexal",
        20,
        "h",
        "floral",
        100
      ],
      [
        "dimetol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        22,
        "b",
        "aquatic",
        0
      ],
      [
        "ebanol",
        30,
        "b",
        "woody",
        100
      ],
      [
        "olibanum oil",
        2,
        "b",
        "amber",
        100
      ],
      [
        "evernyl",
        10,
        "b",
        "woody",
        100
      ],
      [
        "oxyoctaline formate",
        120,
        "h",
        "floral",
        100
      ],
      [
        "galbanum oil",
        2,
        "t",
        "green",
        100
      ],
      [
        "geranium oil africa",
        15,
        "h",
        "floral",
        100
      ],
      [
        "hydrocarboresine SB",
        1,
        "h",
        "floral",
        100
      ],
      [
        "kephalis",
        50,
        "h",
        "floral",
        100
      ],
      [
        "lavandin oil",
        20,
        "t",
        "green",
        100
      ],
      [
        "lilial",
        20,
        "h",
        "floral",
        100
      ],
      [
        "nectaryl",
        8,
        "h",
        "floral",
        100
      ],
      [
        "nutmeg oil",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "patchouli oil",
        30,
        "b",
        "woody",
        100
      ],
      [
        "sandalore",
        60,
        "b",
        "woody",
        100
      ],
      [
        "spirogalbanone",
        2,
        "h",
        "floral",
        100
      ],
      [
        "thibetolide",
        150,
        "h",
        "floral",
        100
      ],
      [
        "tricyclal",
        1,
        "h",
        "floral",
        100
      ],
      [
        "tropional",
        10,
        "h",
        "floral",
        100
      ],
      [
        "vetiver oil haiti",
        2,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-196",
    "te": "Green base",
    "tr": "Зелёный парфюмерная база",
    "sd": "TGSC (dm1015272) · Patent 4,570,648",
    "fa": "green",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,570,648 Flavorants containing esters of 2,3,6,6-tetramethylcyclohexenyl carboxylic acids.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Зелёный парфюмерная база». Формула из патента 4,570,648. Ключевые материалы структуры: linalyl acetate, alpha-hexyl cinnamaldehyde, benzyl salicylate, ethanol (95.degree.).",
    "pr": {
      "citrus": 50,
      "woody": 1,
      "floral": 21,
      "green": 34
    },
    "it": [
      [
        "citral",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "wormwood oil",
        10,
        "b",
        "woody",
        100
      ],
      [
        "mastic absolute",
        20,
        "h",
        "floral",
        100
      ],
      [
        "basil oil",
        80,
        "t",
        "green",
        100
      ],
      [
        "methyl dihydrojasmonate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "ethanol (95.degree.)",
        130,
        "b",
        "aquatic",
        0
      ],
      [
        "linalyl acetate",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl salicylate",
        200,
        "t",
        "green",
        100
      ],
      [
        "givescone",
        50,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-197",
    "te": "Green earthy fruity",
    "tr": "Зелёно-землистый фруктовый аккорд",
    "sd": "TGSC (dm1015272) · Patent 8,357,810",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,357,810 3.2.1-bicyclo-octane compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Зелёно-землистый фруктовый аккорд». Формула из патента 8,357,810. Ключевые материалы структуры: aphermate, galaxolide, floriffol, nebulone.",
    "pr": {
      "floral": 50,
      "citrus": 8,
      "gourmand": 14,
      "musk": 14,
      "amber": 1,
      "woody": 4
    },
    "it": [
      [
        "acalea",
        50,
        "h",
        "floral",
        100
      ],
      [
        "acetaldehyde dimethyl acetal",
        1.2,
        "t",
        "citrus",
        100
      ],
      [
        "decanal",
        4.4,
        "h",
        "floral",
        100
      ],
      [
        "allyl amyl glycolate 0.1% DPG",
        8.8,
        "h",
        "gourmand",
        0.1
      ],
      [
        "allyl cyclohexyl propionate",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "allyl heptanoate",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "applelide",
        50,
        "b",
        "musk",
        100
      ],
      [
        "benzyl acetate",
        4.4,
        "h",
        "floral",
        100
      ],
      [
        "bornafix",
        4.4,
        "h",
        "floral",
        100
      ],
      [
        "cashmeran",
        2,
        "b",
        "musk",
        100
      ],
      [
        "coumarin",
        1.8,
        "b",
        "amber",
        100
      ],
      [
        "aphermate",
        99.4,
        "h",
        "floral",
        100
      ],
      [
        "cyclobutanate",
        1.8,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "2,4,8-trimethyl-5-oxatricyclo(6.2.1.0*2,6*)undecane",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ethyl vanillin",
        0.9,
        "b",
        "amber",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        35,
        "h",
        "gourmand",
        100
      ],
      [
        "fleuranil 10% DPG",
        8.8,
        "h",
        "floral",
        10
      ],
      [
        "floriffol",
        80.6,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide",
        98,
        "b",
        "musk",
        100
      ],
      [
        "galbascone",
        1,
        "h",
        "floral",
        100
      ],
      [
        "grisalva",
        3,
        "h",
        "floral",
        100
      ],
      [
        "hexyl butyrate",
        8.8,
        "h",
        "floral",
        100
      ],
      [
        "ionol",
        0.9,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "isoamyl butyrate",
        2,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        43.8,
        "b",
        "woody",
        100
      ],
      [
        "lemorosa",
        43.8,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        16.1,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        16.1,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        17.5,
        "t",
        "citrus",
        100
      ],
      [
        "mango ester 10% DPG",
        0.1,
        "h",
        "floral",
        10
      ],
      [
        "methyl anthranilate",
        4.4,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "mimosa absolute",
        2,
        "h",
        "floral",
        100
      ],
      [
        "musk Z4",
        10,
        "b",
        "musk",
        100
      ],
      [
        "nebulone",
        60,
        "h",
        "floral",
        100
      ],
      [
        "orange oil",
        17.5,
        "t",
        "citrus",
        100
      ],
      [
        "ozofleur",
        10.7,
        "h",
        "floral",
        100
      ],
      [
        "prenyl acetate",
        26.3,
        "h",
        "floral",
        100
      ],
      [
        "trisamber",
        4.4,
        "b",
        "amber",
        100
      ],
      [
        "gamma-undecalactone",
        8.8,
        "h",
        "gourmand",
        100
      ],
      [
        "undecavertol",
        13.1,
        "h",
        "floral",
        100
      ],
      [
        "verdox",
        53.2,
        "h",
        "gourmand",
        100
      ],
      [
        "vertoliff",
        20,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-198",
    "te": "Accord N° 208012 Green floral (Firmenich)",
    "tr": "Аккорд №208012 · зелёный цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Bath salt: 1.00% ; Shampoo: 0.50% · LIMBWOOD 109289 B adds lift, volume and body to this fresh leafy green note..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208012 · зелёный цветочный (Firmenich)». Ключевые материалы структуры: FEUILLAGE VERT BASE 47062 (Firmenich), HEXYL SALICYLATE, CITRON 171 (Firmenich), HEDIONE® (Firmenich).",
    "pr": {
      "citrus": 7,
      "floral": 50,
      "green": 11,
      "woody": 6
    },
    "it": [
      [
        "ALDEHYDE C 10 10%",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "BERGAMOT SYNTH",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "CITRON 171 (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "FEUILLAGE VERT BASE 47062 (Firmenich)",
        300,
        "h",
        "floral",
        100
      ],
      [
        "GALBEX® 183 (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        150,
        "t",
        "green",
        100
      ],
      [
        "OAKMOSS SYNTH 10%",
        10,
        "b",
        "woody",
        10
      ],
      [
        "PHENYLHEXANOL (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "PLICATONE (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        40,
        "b",
        "woody",
        100
      ],
      [
        "LIMBWOOD 109289 B (Firmenich)",
        30,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-199",
    "te": "Accord N° 207628 Green floral (Firmenich)",
    "tr": "Аккорд №207628 · зелёный цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Detergent powder: 0.15% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.20% · A small amount of CYCLOPIDENE tones down the predominant green note of the accord to give a very fresh clean floral note full of body and power..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207628 · зелёный цветочный (Firmenich)». Ключевые материалы структуры: CITRONELLOL, HEXYLCINNAMIC ALDEHYDE, AMYL SALICYLATE, BENZYL ACETATE.",
    "pr": {
      "green": 13,
      "citrus": 11,
      "floral": 50
    },
    "it": [
      [
        "AMYL SALICYLATE",
        85,
        "t",
        "green",
        100
      ],
      [
        "ANISIC ALDEHYDE",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "BENZYL ACETATE",
        85,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        85,
        "t",
        "green",
        100
      ],
      [
        "CITRONELLOL",
        160,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        127,
        "t",
        "citrus",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL® (Givaudan)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "LYRAL® (IFF)",
        15,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        25,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        85,
        "h",
        "floral",
        100
      ],
      [
        "TRICYCLODECENYL ACETATE",
        30,
        "h",
        "floral",
        100
      ],
      [
        "TUBEREUSE 41286 (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "VELOUTONE (Firmenich)",
        15,
        "h",
        "floral",
        100
      ],
      [
        "ZESTONAL 41107 SA (Firmenich)",
        85,
        "h",
        "floral",
        100
      ],
      [
        "CYCLOPIDENE (Firmenich)",
        8,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-200",
    "te": "Green Floral Accord",
    "tr": "Зелёный цветочный Аккорд",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Зелёный цветочный Аккорд». Ключевые материалы структуры: iso e super, galaxolide 50 BB, tonalid, lemon oil.",
    "pr": {
      "green": 2,
      "spicy": 2,
      "amber": 1,
      "citrus": 24,
      "musk": 16,
      "floral": 28,
      "woody": 50
    },
    "it": [
      [
        "amyl salicylate",
        13,
        "t",
        "green",
        100
      ],
      [
        "clove bud oil",
        0.5,
        "h",
        "spicy",
        100
      ],
      [
        "coumarin",
        10,
        "b",
        "amber",
        100
      ],
      [
        "dihydromyrcenol",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "DIPG",
        26.3,
        "b",
        "aquatic",
        0
      ],
      [
        "galaxolide 50 BB",
        128,
        "b",
        "musk",
        50
      ],
      [
        "geranyl acetate",
        0.5,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        34,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal 10%",
        1,
        "t",
        "citrus",
        10
      ],
      [
        "indole 10%",
        1,
        "h",
        "floral",
        10
      ],
      [
        "beta-ionone",
        0.5,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        260,
        "b",
        "woody",
        100
      ],
      [
        "lemon oil",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        19,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        55,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        45,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "methyl anthranilate 10%",
        1,
        "h",
        "floral",
        10
      ],
      [
        "methyl ionone gamma supreme",
        3,
        "h",
        "floral",
        100
      ],
      [
        "nutmeg oil",
        12,
        "h",
        "spicy",
        100
      ],
      [
        "patchouli oil",
        16,
        "b",
        "woody",
        100
      ],
      [
        "sandalore",
        30,
        "b",
        "woody",
        100
      ],
      [
        "thyme oil white",
        0.3,
        "t",
        "green",
        100
      ],
      [
        "timberol",
        3,
        "b",
        "woody",
        100
      ],
      [
        "tonalid",
        108,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        0.4,
        "t",
        "green",
        100
      ],
      [
        "vertofix",
        90,
        "b",
        "woody",
        100
      ],
      [
        "vionil 1%",
        7.5,
        "h",
        "floral",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-201",
    "te": "green floral magnolia type",
    "tr": "Зелёный цветочный магнолия (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring (E,Z)-2,6-nonadienal, ethyl linalyl acetal, alpha-damascone, canthoxal.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Зелёный цветочный магнолия (тип)». Ключевые материалы структуры: DIPG, methyl dihydrojasmonate, tetrahydrolinalool, citronellol.",
    "pr": {
      "floral": 50,
      "citrus": 4,
      "aquatic": 2
    },
    "it": [
      [
        "(E,Z)-2,6-nonadienal",
        0.5,
        "h",
        "floral",
        100
      ],
      [
        "ethyl linalyl acetal",
        5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone",
        1.5,
        "h",
        "gourmand",
        100
      ],
      [
        "canthoxal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        75,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "floralozone",
        15,
        "h",
        "aquatic",
        100
      ],
      [
        "geraniol",
        25,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        15,
        "h",
        "aquatic",
        100
      ],
      [
        "jasmacyclat",
        50,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        250,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        75,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalool",
        100,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "muguet nitrile",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        315.5,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-202",
    "te": "Green Flowery Perfume Base",
    "tr": "Зелёный цветочный парфюм парфюмерная база",
    "sd": "TGSC (dm1015272) · Patent 4,585,662",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,585,662 Acyclic alcohol odorant and/or flavoring substances.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Зелёный цветочный парфюм парфюмерная база». Формула из патента 4,585,662. Ключевые материалы структуры: hydroxycitronellal, methyl dihydrojasmonate, DIPG, bergamot oil bergaptene reduced.",
    "pr": {
      "citrus": 50,
      "floral": 46,
      "gourmand": 2,
      "green": 2,
      "spicy": 1
    },
    "it": [
      [
        "hydroxycitronellal",
        250,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        250,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        200,
        "b",
        "aquatic",
        0
      ],
      [
        "corps cassis 1%",
        10,
        "h",
        "gourmand",
        1
      ],
      [
        "mandarin oil",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "galbanum oil",
        10,
        "t",
        "green",
        100
      ],
      [
        "jasmine (synthetic)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "palmarosa oil",
        10,
        "h",
        "floral",
        100
      ],
      [
        "mastic absolute",
        5,
        "h",
        "floral",
        100
      ],
      [
        "geranium oil bourbon",
        5,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "coriander seed oil",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "phenoxyethyl isobutyrate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "basil oil",
        3,
        "t",
        "green",
        100
      ],
      [
        "cassis bud absolute",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        65,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-203",
    "te": "Green Fresh Floral Accord",
    "tr": "Зелёный свежий цветочный Аккорд",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Зелёный свежий цветочный Аккорд». Ключевые материалы структуры: hedione, benzyl salicylate, dihydromyrcenol, exaltolide.",
    "pr": {
      "gourmand": 4,
      "floral": 50,
      "green": 20,
      "amber": 1,
      "citrus": 26,
      "musk": 12,
      "woody": 8
    },
    "it": [
      [
        "allyl amyl glycolate",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "benzyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        150,
        "t",
        "green",
        100
      ],
      [
        "boisambrene forte",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cassis base 345 B 10%",
        15,
        "h",
        "gourmand",
        10
      ],
      [
        "coumarin",
        7,
        "b",
        "amber",
        100
      ],
      [
        "gamma-decalactone",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "decatone",
        50,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "exaltolide",
        100,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        175,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        10,
        "t",
        "green",
        100
      ],
      [
        "iso e super",
        50,
        "b",
        "woody",
        100
      ],
      [
        "lemon oil",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "lilial",
        100,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "sandalore",
        15,
        "b",
        "woody",
        100
      ],
      [
        "styralyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        10,
        "t",
        "green",
        100
      ],
      [
        "ylang ylang oil",
        15,
        "h",
        "floral",
        100
      ],
      [
        "limediene",
        13,
        "t",
        "citrus",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-204",
    "te": "Accord N° 207733 Green fruity (Firmenich)",
    "tr": "Аккорд №207733 · зелёный фруктовый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Detergent powder: 0.15% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.20% · A trace is enough! The balance of the green fruity and flowery notes is complete by the use of the DAMASCENONE..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207733 · зелёный фруктовый (Firmenich)». Ключевые материалы структуры: PARA TERT BUTYL CYCLOHEXYL ACETATE, HEXYLCINNAMIC ALDEHYDE, BENZYL SALICYLATE, AMYL SALICYLATE.",
    "pr": {
      "citrus": 11,
      "green": 16,
      "floral": 50,
      "spicy": 3,
      "gourmand": 1
    },
    "it": [
      [
        "ALDEHYDE C12 LAURIC 50%",
        5,
        "t",
        "citrus",
        50
      ],
      [
        "AMYL SALICYLATE",
        89,
        "t",
        "green",
        100
      ],
      [
        "BENZYL ACETATE",
        89,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        112,
        "t",
        "green",
        100
      ],
      [
        "EUGENOL",
        33,
        "h",
        "spicy",
        100
      ],
      [
        "EXALTEX® (Firmenich)",
        33,
        "h",
        "floral",
        100
      ],
      [
        "FEUILLAGE VERT BASE 47062 (Firmenich)",
        22,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        89,
        "h",
        "floral",
        100
      ],
      [
        "HEXYLCINNAMIC ALDEHYDE",
        133,
        "t",
        "citrus",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        33,
        "h",
        "floral",
        100
      ],
      [
        "PARA TERT BUTYL CYCLOHEXYL ACETATE",
        178,
        "h",
        "floral",
        100
      ],
      [
        "PHENYLETHYL ALCOHOL",
        89,
        "h",
        "floral",
        100
      ],
      [
        "RHUBOFIX® (Firmenich)",
        22,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE 1%",
        7,
        "h",
        "gourmand",
        1
      ],
      [
        "TRICYCLODECENYL ACETATE",
        44,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCENONE (Firmenich)",
        22,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-205",
    "te": "Green Herbaceous",
    "tr": "Зелёно-травянистый аккорд",
    "sd": "TGSC (dm1015272) · Patent EP1229032",
    "fa": "green",
    "kd": "perfume",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): An unusual aromatic connotation reminiscent of the odor of chervil leaves. Patent EP1229032 B1 1,3-oxathianes as perfuming and flavouring ingredients.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Зелёно-травянистый аккорд». Формула из патента EP1229032. Ключевые материалы структуры: hedione, para-anisyl propanal, mayol, alpha-hexyl cinnamaldehyde.",
    "pr": {
      "citrus": 13,
      "spicy": 23,
      "floral": 50,
      "green": 1
    },
    "it": [
      [
        "alpha-hexyl cinnamaldehyde",
        150,
        "t",
        "citrus",
        100
      ],
      [
        "para-anisyl propanal",
        260,
        "h",
        "spicy",
        100
      ],
      [
        "hedione",
        300,
        "h",
        "floral",
        100
      ],
      [
        "mayol",
        200,
        "h",
        "floral",
        100
      ],
      [
        "neobutenone alpha",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cis-galbanum oxathiane 10%",
        15,
        "t",
        "green",
        10
      ],
      [
        "veloutone",
        15,
        "h",
        "floral",
        100
      ],
      [
        "2-(2,4-dimethyl-3-cyclohexene-1-yl)-4,4-dimethyl-1,3-oxathiane 10%",
        50,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-206",
    "te": "Green perfume base (Patent 4,544,714)",
    "tr": "Зелёный парфюм парфюмерная база (Патент 4,544,714)",
    "sd": "TGSC (dm1015272) · Patent 4,544,714",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,544,714 Odorant oximes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Зелёный парфюм парфюмерная база (Патент 4,544,714)». Формула из патента 4,544,714. Ключевые материалы структуры: bergamot oil bergaptene reduced, labienone, tetrascone, linalyl acetate.",
    "pr": {
      "citrus": 50,
      "floral": 49,
      "green": 17,
      "gourmand": 1
    },
    "it": [
      [
        "bergamot oil bergaptene reduced",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "labienone",
        200,
        "h",
        "floral",
        100
      ],
      [
        "tetrascone",
        100,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl salicylate",
        100,
        "t",
        "green",
        100
      ],
      [
        "methyl dihydrojasmonate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "basil oil",
        30,
        "t",
        "green",
        100
      ],
      [
        "linalyl anthranilate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "mastic oil",
        10,
        "h",
        "floral",
        100
      ],
      [
        "corps cassis",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "galbanum oil",
        5,
        "t",
        "green",
        100
      ],
      [
        "DIPG",
        70,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-207",
    "te": "Green perfume base (Patent 4,485,036)",
    "tr": "Зелёный парфюм парфюмерная база (Патент 4,485,036)",
    "sd": "TGSC (dm1015272) · Patent 4,485,036",
    "fa": "green",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,485,036 Odorant compositions containing megastigma-5(11),8-dien-4,7-oxides and tetra-substituted-7-oxa-bicyclo[3.3.0]-octanes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Зелёный парфюм парфюмерная база (Патент 4,485,036)». Формула из патента 4,485,036. Ключевые материалы структуры: methyl dihydrojasmonate, bergamot oil bergaptene reduced, alpha-hexyl cinnamaldehyde, DIPG.",
    "pr": {
      "floral": 31,
      "citrus": 50,
      "green": 5,
      "gourmand": 1
    },
    "it": [
      [
        "methyl dihydrojasmonate",
        300,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        300,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "basil oil",
        40,
        "t",
        "green",
        100
      ],
      [
        "linalyl anthranilate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "3,5-ivy carbaldehyde 10%",
        20,
        "t",
        "citrus",
        10
      ],
      [
        "corps cassis",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "galbanum oil",
        10,
        "t",
        "green",
        100
      ],
      [
        "DIPG",
        100,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-208",
    "te": "fresh green type",
    "tr": "Свежий зелёный (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring aldehyde C-11 undecylic, benzyl acetate, cassis specialty, cyclogalbaniff.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Свежий зелёный (тип)». Ключевые материалы структуры: dipropylene glycol, hedione, galaxolide 50 IPM, iso e super.",
    "pr": {
      "citrus": 8,
      "floral": 50,
      "gourmand": 3,
      "musk": 12,
      "green": 1,
      "woody": 5
    },
    "it": [
      [
        "aldehyde C-11 undecylic",
        4.5,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "cassis specialty",
        7.5,
        "h",
        "gourmand",
        100
      ],
      [
        "cyclogalbaniff",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "mayol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "eucalyptus oil",
        10.5,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        149.4,
        "b",
        "musk",
        50
      ],
      [
        "hedione",
        224.4,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        7.5,
        "t",
        "green",
        100
      ],
      [
        "iso e super",
        59.8,
        "b",
        "woody",
        100
      ],
      [
        "lavender oil",
        3,
        "t",
        "green",
        100
      ],
      [
        "lemon oil",
        44.9,
        "t",
        "citrus",
        100
      ],
      [
        "lime oil",
        29.9,
        "t",
        "citrus",
        100
      ],
      [
        "dipentene",
        44.9,
        "h",
        "floral",
        100
      ],
      [
        "laevo-menthone",
        4.5,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "(E,Z)-2,6-nonadienal",
        0.7,
        "h",
        "floral",
        100
      ],
      [
        "orange oil",
        22.4,
        "t",
        "citrus",
        100
      ],
      [
        "sanjinol",
        15,
        "h",
        "floral",
        100
      ],
      [
        "santaliff",
        3,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        1.5,
        "b",
        "amber",
        100
      ],
      [
        "verdox",
        29.9,
        "h",
        "gourmand",
        100
      ],
      [
        "dipropylene glycol",
        269.2,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-209",
    "te": "Herbal fragrance",
    "tr": "Травянистый аромат",
    "sd": "TGSC (dm1015272) · Patent 4,397,789",
    "fa": "green",
    "kd": "perfume",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,397,789 Alkyl-4-cyclooctenyl carbonates and uses thereof in augmenting or enhancing the aroma of perfume compositions, colognes and perfumed articles.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Травянистый аромат». Формула из патента 4,397,789. Ключевые материалы структуры: alpha-amyl cinnamaldehyde, DIPG, juniper berry oil, methyl dihydrojasmonate.",
    "pr": {
      "citrus": 50,
      "green": 46,
      "gourmand": 19,
      "floral": 38
    },
    "it": [
      [
        "alpha-amyl cinnamaldehyde",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "phenyl acetaldehyde dimethyl acetal",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "thyme oil white",
        80,
        "t",
        "green",
        100
      ],
      [
        "clary sage oil france",
        80,
        "t",
        "green",
        100
      ],
      [
        "galbanum oil",
        40,
        "t",
        "green",
        100
      ],
      [
        "juniper berry oil",
        100,
        "h",
        "gourmand",
        100
      ],
      [
        "methyl octine carbonate",
        40,
        "t",
        "green",
        100
      ],
      [
        "linalyl acetate",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "violiff",
        100,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        200,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-210",
    "te": "Herbal green base",
    "tr": "Травянистый зелёный парфюмерная база",
    "sd": "TGSC (dm1015272) · Patent 4,668,433",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,668,433 Novel derivatives of 6-hydroxyhexanoates as fragrance ingredients.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Травянистый зелёный парфюмерная база». Формула из патента 4,668,433. Ключевые материалы структуры: linalyl acetate, linalool, madrox, hedione.",
    "pr": {
      "citrus": 21,
      "floral": 50,
      "woody": 5,
      "musk": 4,
      "gourmand": 10
    },
    "it": [
      [
        "linalyl acetate",
        150,
        "t",
        "citrus",
        100
      ],
      [
        "madrox",
        100,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        150,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "hyssop oil",
        60,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        60,
        "b",
        "woody",
        100
      ],
      [
        "galaxolide 50 IPM",
        40,
        "b",
        "musk",
        50
      ],
      [
        "cetone V",
        20,
        "h",
        "floral",
        100
      ],
      [
        "eugenyl phenyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "acetal E",
        15,
        "h",
        "floral",
        100
      ],
      [
        "cyclal C 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "corps cassis 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "fixateur 505",
        5,
        "h",
        "floral",
        100
      ],
      [
        "berryflor",
        100,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-211",
    "te": "Accord N° 207582 Herbal lavender citrus (Firmenich)",
    "tr": "Аккорд №207582 · травянистый лаванда цитрусовый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.20% · The power of MYROXYDE is harmonised in this lavender citrus accord to give a fresh invigorating naturalness which can be effective for all herbal cologne notes..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207582 · травянистый лаванда цитрусовый (Firmenich)». Ключевые материалы структуры: LAVANDIN OIL, CITRON 171 (Firmenich), HEDIONE® (Firmenich), DIHYDROMYRCENOL.",
    "pr": {
      "floral": 24,
      "citrus": 3,
      "green": 50
    },
    "it": [
      [
        "CITRON 171 (Firmenich)",
        200,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        70,
        "h",
        "floral",
        100
      ],
      [
        "LAVANDIN OIL",
        640,
        "t",
        "green",
        100
      ],
      [
        "THYME RED",
        10,
        "t",
        "green",
        100
      ],
      [
        "MYROXYDE® (Firmenich)",
        40,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-212",
    "te": "Herbal type",
    "tr": "Травянистый (тип)",
    "sd": "TGSC (dm1015272) · Patent 4,458,699",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,458,699 Uses of methyl phenyl pentanol derivatives in augmenting or enhancingthe aroma or taste of smoking tobacco and smoking tobacco articles.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Травянистый (тип)». Формула из патента 4,458,699. Ключевые материалы структуры: benzyl acetate, methyl dihydrojasmonate, musk ketone, linalool.",
    "pr": {
      "woody": 1,
      "floral": 50,
      "amber": 2,
      "musk": 6,
      "citrus": 7,
      "green": 1,
      "gourmand": 1
    },
    "it": [
      [
        "oakmoss absolute 50%",
        20,
        "b",
        "woody",
        50
      ],
      [
        "ocean propanal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "musk ketone",
        80,
        "b",
        "musk",
        100
      ],
      [
        "isocyclocitral 10%",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "galbanum oil 10%",
        6,
        "t",
        "green",
        10
      ],
      [
        "rosemary oil",
        10,
        "t",
        "green",
        100
      ],
      [
        "fir needle oil siberia",
        60,
        "h",
        "floral",
        100
      ],
      [
        "fir balsam absolute 10%",
        10,
        "b",
        "amber",
        10
      ],
      [
        "bergamot oil bergaptene reduced",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "lemon oil",
        14,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl acetate",
        468,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        80,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        6,
        "h",
        "floral",
        10
      ],
      [
        "gamma-undecalactone 10%",
        12,
        "h",
        "gourmand",
        10
      ],
      [
        "grapefruit pentanol",
        12,
        "t",
        "citrus",
        100
      ],
      [
        "DIPG",
        22,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-213",
    "te": "Hesperidic woody musky floral feminine fine fragrance",
    "tr": "Гесперидный (цитрусовый) древесный мускусный цветочный женский Аромат высокой парфюмерии",
    "sd": "TGSC (dm1015272) · Patent 8,703,692",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,703,692 7-(alk-1'enyl)-2H-benzo[B][1,4]dioxepin-3(4H)-ones and their use in fragrance applications.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Гесперидный (цитрусовый) древесный мускусный цветочный женский Аромат высокой парфюмерии». Формула из патента 8,703,692. Ключевые материалы структуры: georgywood, benzyl salicylate, hedione, ethylene brassylate.",
    "pr": {
      "floral": 42,
      "green": 22,
      "musk": 15,
      "woody": 50,
      "citrus": 26
    },
    "it": [
      [
        "ambrofix",
        2.4,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        119,
        "t",
        "green",
        100
      ],
      [
        "citronellyl acetate",
        11.9,
        "h",
        "floral",
        100
      ],
      [
        "citrus essence (Italy)",
        53.6,
        "h",
        "floral",
        100
      ],
      [
        "cyclohexal",
        23.8,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        5.5,
        "b",
        "aquatic",
        0
      ],
      [
        "ethylene brassylate",
        95.2,
        "b",
        "musk",
        100
      ],
      [
        "gardenol",
        6,
        "h",
        "floral",
        100
      ],
      [
        "georgywood",
        297.6,
        "b",
        "woody",
        100
      ],
      [
        "grapefruit essence",
        83.3,
        "t",
        "citrus",
        100
      ],
      [
        "hedione",
        119,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        3.6,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        17.9,
        "t",
        "green",
        100
      ],
      [
        "linalyl acetate",
        53.6,
        "t",
        "citrus",
        100
      ],
      [
        "orange oil brazil",
        29.8,
        "t",
        "citrus",
        100
      ],
      [
        "pepperwood",
        23.8,
        "b",
        "woody",
        100
      ],
      [
        "pomarose",
        0.4,
        "h",
        "floral",
        100
      ],
      [
        "serenolide",
        53.6,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-214",
    "te": "hyacinth type",
    "tr": "Гиацинт (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, cinnamic alcohol, benzyl acetone 1%, tuberose acetate 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Гиацинт (тип)». Ключевые материалы структуры: phenoxyethanol, phenethylol, benzyl acetate, amyl salicylate.",
    "pr": {
      "floral": 50,
      "spicy": 8,
      "citrus": 1,
      "musk": 2,
      "green": 7
    },
    "it": [
      [
        "benzyl acetate",
        116.67,
        "h",
        "floral",
        100
      ],
      [
        "cinnamic alcohol",
        75,
        "h",
        "spicy",
        100
      ],
      [
        "benzyl acetone 1%",
        41.67,
        "h",
        "floral",
        1
      ],
      [
        "tuberose acetate 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "cyclamen aldehyde",
        11.67,
        "t",
        "citrus",
        100
      ],
      [
        "eugenol",
        33.33,
        "h",
        "spicy",
        100
      ],
      [
        "galaxolide 50 IPM",
        25,
        "b",
        "musk",
        50
      ],
      [
        "hedione",
        11.67,
        "h",
        "floral",
        100
      ],
      [
        "methyl isoeugenol",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "phenethylol",
        208.33,
        "h",
        "floral",
        100
      ],
      [
        "phenoxyethanol",
        261.67,
        "h",
        "floral",
        100
      ],
      [
        "phenyl acetaldehyde dimethyl acetal",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "amyl salicylate",
        100,
        "t",
        "green",
        100
      ],
      [
        "methyl salicylate 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "scentenal",
        5,
        "h",
        "floral",
        100
      ],
      [
        "veloutone",
        6.67,
        "h",
        "floral",
        100
      ],
      [
        "indocolore 10%",
        83.33,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-215",
    "te": "Ice Water Accord",
    "tr": "Аккорд ледяной воды",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "aquatic",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд ледяной воды». Ключевые материалы структуры: DIPG, dihydromyrcenol, linalyl acetate, tonalid.",
    "pr": {
      "gourmand": 5,
      "amber": 3,
      "citrus": 50,
      "floral": 30,
      "woody": 16,
      "green": 4
    },
    "it": [
      [
        "allyl amyl glycolate",
        19,
        "h",
        "gourmand",
        100
      ],
      [
        "ambroxan",
        20,
        "b",
        "amber",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "citral",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-damascone 10%",
        16,
        "h",
        "gourmand",
        10
      ],
      [
        "dihydromyrcenol",
        190,
        "t",
        "citrus",
        100
      ],
      [
        "DIPG",
        250,
        "b",
        "aquatic",
        0
      ],
      [
        "geranium oil africa",
        10,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        60,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        30,
        "b",
        "woody",
        100
      ],
      [
        "lavandin oil grosso",
        30,
        "t",
        "green",
        100
      ],
      [
        "linalool",
        38,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        90,
        "t",
        "citrus",
        100
      ],
      [
        "methyl ionone gamma supreme",
        20,
        "h",
        "floral",
        100
      ],
      [
        "precyclemone B",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "tonalid",
        80,
        "h",
        "floral",
        100
      ],
      [
        "vertofix",
        80,
        "b",
        "woody",
        100
      ],
      [
        "limediene 1.0%",
        30,
        "t",
        "citrus",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-216",
    "te": "Jasmin fragrance",
    "tr": "Жасмин аромат",
    "sd": "TGSC (dm1015272) · Patent 4,310,701",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,310,701 Process for the preparation of homologues of methyl dihydrojasmonate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Жасмин аромат». Формула из патента 4,310,701. Ключевые материалы структуры: benzyl acetate, linalool, abietyl alcohol, methyl dihydrojasmonate.",
    "pr": {
      "floral": 50,
      "green": 2,
      "citrus": 2,
      "spicy": 1,
      "gourmand": 1
    },
    "it": [
      [
        "para-cresol",
        1,
        "h",
        "floral",
        100
      ],
      [
        "acetyl methyl anthranilate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "farnesol",
        4,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl benzoate",
        30,
        "t",
        "green",
        100
      ],
      [
        "nerolidol",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "indole",
        15,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        20,
        "h",
        "spicy",
        100
      ],
      [
        "benzyl alcohol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "methyl linoleate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "jasmin lactone",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "methyl jasmonate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        150,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        400,
        "h",
        "floral",
        100
      ],
      [
        "abietyl alcohol",
        150,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        20,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-217",
    "te": "sambac jasmin type",
    "tr": "Самбак жасмин (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring hexyl acetate 10%, benzyl acetate, cinnamyl acetate 10%, cis-3-hexenyl acetate 1%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Самбак жасмин (тип)». Ключевые материалы структуры: farnesene, benzyl acetate, cis-3-hexenyl benzoate, methyl anthranilate.",
    "pr": {
      "floral": 50,
      "spicy": 1,
      "green": 12
    },
    "it": [
      [
        "hexyl acetate 10%",
        3.13,
        "h",
        "floral",
        10
      ],
      [
        "benzyl acetate",
        156.25,
        "h",
        "floral",
        100
      ],
      [
        "cinnamyl acetate 10%",
        6.25,
        "h",
        "spicy",
        10
      ],
      [
        "cis-3-hexenyl acetate 1%",
        15.63,
        "t",
        "green",
        1
      ],
      [
        "geranyl acetate 10%",
        15.63,
        "h",
        "floral",
        10
      ],
      [
        "phenethyl acetate",
        6.25,
        "h",
        "floral",
        100
      ],
      [
        "cinnamic alcohol 50%",
        6.25,
        "h",
        "spicy",
        50
      ],
      [
        "methyl anthranilate",
        112.5,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl benzoate",
        125,
        "t",
        "green",
        100
      ],
      [
        "fenchyl benzoate",
        9.38,
        "h",
        "floral",
        100
      ],
      [
        "methyl benzoate",
        3.13,
        "h",
        "floral",
        100
      ],
      [
        "ethyl benzoate 10%",
        6.25,
        "h",
        "floral",
        10
      ],
      [
        "cis-3-hexenyl butyrate 10%",
        12.5,
        "t",
        "green",
        10
      ],
      [
        "cis-3-hexenyl caproate 10%",
        3.13,
        "t",
        "green",
        10
      ],
      [
        "cis-3-hexenol 10%",
        3.13,
        "t",
        "green",
        10
      ],
      [
        "cis-jasmone 10%",
        9.38,
        "h",
        "floral",
        10
      ],
      [
        "cis-beta-ocimene 10%",
        3.13,
        "h",
        "floral",
        10
      ],
      [
        "farnesene",
        187.5,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        3.13,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        65.63,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl isobutyrate 10%",
        12.5,
        "t",
        "green",
        10
      ],
      [
        "isojasmone 10%",
        6.25,
        "h",
        "floral",
        10
      ],
      [
        "linalool",
        43.75,
        "h",
        "floral",
        100
      ],
      [
        "methyl linoleate",
        62.5,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl 2-methyl butyrate 10%",
        3.13,
        "t",
        "green",
        10
      ],
      [
        "methyl heptenone 10%",
        3.13,
        "h",
        "floral",
        10
      ],
      [
        "para-cresol 1%",
        12.5,
        "h",
        "floral",
        1
      ],
      [
        "phenethylol",
        6.25,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        6.25,
        "t",
        "green",
        100
      ],
      [
        "methyl salicylate",
        3.13,
        "t",
        "green",
        100
      ],
      [
        "ethyl salicylate 10%",
        3.13,
        "t",
        "green",
        10
      ],
      [
        "cis-3-hexenyl butyrate 10%",
        3.13,
        "t",
        "green",
        10
      ],
      [
        "cis-2-hexenal 10%",
        18.75,
        "h",
        "floral",
        10
      ],
      [
        "indocolore 10%",
        62.5,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-218",
    "te": "Feminine fine fragrance jasmin white amber and green apple",
    "tr": "Женский Аромат высокой парфюмерии жасмин белый амбровый и зелёный яблоко",
    "sd": "TGSC (dm1015272) · Patent EP2205581",
    "fa": "amber",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent EP2205581 A1 Macrocyclic lactones as fragrances.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Женский Аромат высокой парфюмерии жасмин белый амбровый и зелёный яблоко». Формула из патента EP2205581. Ключевые материалы структуры: vertofix, benzyl benzoate, Citrus peel oil, (4E,9Z)-13-methyloxacyclopentadeca-4,9-dien-2-one 10%.",
    "pr": {
      "gourmand": 2,
      "amber": 1,
      "floral": 50,
      "musk": 7,
      "woody": 32
    },
    "it": [
      [
        "allyl heptanoate",
        17,
        "h",
        "gourmand",
        100
      ],
      [
        "amberketal 10%IPM",
        10,
        "b",
        "amber",
        10
      ],
      [
        "benzyl benzoate",
        131,
        "h",
        "floral",
        100
      ],
      [
        "cashmeran",
        80,
        "b",
        "musk",
        100
      ],
      [
        "cedryl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "Citrus peel oil",
        130,
        "h",
        "floral",
        100
      ],
      [
        "cosmone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "cyclal C",
        4,
        "h",
        "floral",
        100
      ],
      [
        "givescone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        75,
        "h",
        "floral",
        100
      ],
      [
        "spirambrene",
        10,
        "h",
        "floral",
        100
      ],
      [
        "trimofix O",
        10,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "vertofix",
        350,
        "b",
        "woody",
        100
      ],
      [
        "(4E,9Z)-13-methyloxacyclopentadeca-4,9-dien-2-one 10%",
        100,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-219",
    "te": "Accord Number 1249 - Juicy pulse (IFF)",
    "tr": "Аккорд №1249 · Сочный импульс (IFF)",
    "sd": "TGSC (dm1015272) · IFF",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring BERGAMOT ECO ESS, DIHYDRO MYRCENOL, MANDARIN OIL, ORANGE OIL CP.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №1249 · Сочный импульс (IFF)». Ключевые материалы структуры: KHARISMAL® (IFF), ETHYL LINALOOL, METHYL DH JASMONATE, MANDARIN OIL.",
    "pr": {
      "citrus": 14,
      "floral": 50,
      "gourmand": 1,
      "green": 3,
      "amber": 2,
      "musk": 11,
      "woody": 5
    },
    "it": [
      [
        "BERGAMOT ECO ESS",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "DIHYDRO MYRCENOL",
        3,
        "h",
        "floral",
        100
      ],
      [
        "MANDARIN OIL",
        75,
        "t",
        "citrus",
        100
      ],
      [
        "ORANGE OIL CP",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "ETHYL LINALOOL",
        105,
        "h",
        "floral",
        100
      ],
      [
        "LINALOOL",
        38,
        "h",
        "floral",
        100
      ],
      [
        "LIFFAROME (IFF) 10%",
        2.5,
        "h",
        "floral",
        10
      ],
      [
        "PETITGRAIN SA",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "BENZYL ACETATE",
        3,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCONE ALPHA 10%",
        2.5,
        "h",
        "gourmand",
        10
      ],
      [
        "DELTA DAMASCONE (IFF)",
        1.5,
        "h",
        "gourmand",
        100
      ],
      [
        "IONONE BETA",
        16,
        "h",
        "floral",
        100
      ],
      [
        "KHARISMAL® (IFF)",
        130,
        "h",
        "floral",
        100
      ],
      [
        "METHYL DH JASMONATE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "CASSIS BASE",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "DECALACTONE, GAMMA 10%",
        4,
        "h",
        "gourmand",
        10
      ],
      [
        "ETHYL HEPTOATE 10%",
        3,
        "h",
        "floral",
        10
      ],
      [
        "UNDECALACTONE GAMMA",
        0.5,
        "h",
        "gourmand",
        100
      ],
      [
        "VELTOL PLUS",
        30,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL SALICYLATE",
        30,
        "t",
        "green",
        100
      ],
      [
        "HELIOTROPINE",
        10,
        "b",
        "amber",
        100
      ],
      [
        "VANITROPE",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "ETHYLENE BRASSYLATE",
        50,
        "b",
        "musk",
        100
      ],
      [
        "GALAXOLIDE 50 (IFF)",
        70,
        "b",
        "musk",
        100
      ],
      [
        "GRISALVA (IFF)",
        18,
        "h",
        "floral",
        100
      ],
      [
        "ANDRANE (IFF)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "METHYL IONONE ALPHA, ISO",
        60,
        "h",
        "floral",
        100
      ],
      [
        "MYSANTOL (IFF)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "PATCHOULI OIL LIGHT (IFF)",
        10,
        "b",
        "woody",
        100
      ],
      [
        "VERTOFIX® COEUR (IFF)",
        50,
        "b",
        "woody",
        100
      ],
      [
        "COUMARIN",
        13,
        "b",
        "amber",
        100
      ],
      [
        "VANILLIN EX LIGNIN 10%",
        3,
        "b",
        "amber",
        10
      ],
      [
        "DIPG",
        24.5,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-220",
    "te": "Laundry fragrance",
    "tr": "Отдушка для стирки белья",
    "sd": "TGSC (dm1015272) · Patent 7,446,079",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,446,079 Perfumes for rinse-off systems.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Отдушка для стирки белья». Формула из патента 7,446,079. Ключевые материалы структуры: dextro-limonene, phenoxyethyl isobutyrate, galaxolide 50 IPM, lilial.",
    "pr": {
      "citrus": 27,
      "gourmand": 14,
      "floral": 50,
      "green": 6,
      "musk": 16
    },
    "it": [
      [
        "dextro-limonene",
        212.8,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl butyrate",
        1.5,
        "h",
        "gourmand",
        100
      ],
      [
        "hexyl acetate",
        4.6,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        44.2,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        3.1,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        4.6,
        "t",
        "green",
        100
      ],
      [
        "ethyl acetoacetate",
        11.8,
        "h",
        "floral",
        100
      ],
      [
        "allyl caproate",
        1.5,
        "h",
        "gourmand",
        100
      ],
      [
        "verdox",
        44.2,
        "h",
        "gourmand",
        100
      ],
      [
        "cis-3-hexenol",
        1.5,
        "t",
        "green",
        100
      ],
      [
        "citronellyl nitrile",
        7.2,
        "h",
        "floral",
        100
      ],
      [
        "fructone",
        7.2,
        "h",
        "gourmand",
        100
      ],
      [
        "alpha-terpinyl acetate",
        14.9,
        "h",
        "floral",
        100
      ],
      [
        "neryl acetate",
        7.2,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalol",
        18.5,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        28.8,
        "h",
        "floral",
        100
      ],
      [
        "oxane",
        1.2,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        59.5,
        "h",
        "floral",
        100
      ],
      [
        "phenoxyethyl isobutyrate",
        143.2,
        "h",
        "floral",
        100
      ],
      [
        "allyl cyclohexyl propionate",
        18.5,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-undecalactone",
        28.8,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-decalactone",
        18.5,
        "h",
        "gourmand",
        100
      ],
      [
        "cyclogalbanate",
        12.4,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        140,
        "b",
        "musk",
        50
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        28.3,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        28.3,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        59.5,
        "h",
        "floral",
        100
      ],
      [
        "ebanol",
        2.5,
        "b",
        "woody",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        12.4,
        "t",
        "green",
        100
      ],
      [
        "benzyl salicylate",
        33.3,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-221",
    "te": "Accord N° 208606 Lavender fougere (Firmenich)",
    "tr": "Аккорд №208606 · лаванда фужер (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · The addition of CETALOX to this lavender, fougere accord gives body and richness that is immediately noticed. Harmony is created between the lavender and woody fougere aspect resulting in a much stronger overall identity of the accord..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208606 · лаванда фужер (Firmenich)». Ключевые материалы структуры: LAVANDIN OIL, HABANOLIDE® 50 DIPG (Firmenich), HEDIONE® (Firmenich), BERGAMOTE SYNTH.",
    "pr": {
      "citrus": 11,
      "amber": 4,
      "floral": 50,
      "musk": 17,
      "green": 22,
      "woody": 3,
      "gourmand": 3
    },
    "it": [
      [
        "BERGAMOTE SYNTH",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "COUMARIN",
        30,
        "b",
        "amber",
        100
      ],
      [
        "GERANIOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® 50 DIPG (Firmenich)",
        150,
        "b",
        "musk",
        50
      ],
      [
        "HEDIONE® (Firmenich)",
        120,
        "h",
        "floral",
        100
      ],
      [
        "IONONE BETA",
        10,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "LAVANDIN OIL",
        200,
        "t",
        "green",
        100
      ],
      [
        "PARA TERT BUTYL CYCLOHEXYL ACETATE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "PATCHOULI OIL",
        30,
        "b",
        "woody",
        100
      ],
      [
        "TRICYCLODECENYL PROPIONATE",
        70,
        "h",
        "floral",
        100
      ],
      [
        "UNDECALACTONE GAMMA 10%",
        30,
        "h",
        "gourmand",
        10
      ],
      [
        "CETALOX® (Firmenich) 10%",
        10,
        "b",
        "amber",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-222",
    "te": "Leathery woody masculine perfume",
    "tr": "Кожано-древесный мужской парфюм",
    "sd": "TGSC (dm1015272) · Patent 7,632,791",
    "fa": "leathery",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,632,791 Spirocyclic ketols and their use.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Кожано-древесный мужской парфюм». Формула из патента 7,632,791. Ключевые материалы структуры: patchouli oil, kephalis, benzyl salicylate, ethylene brassylate.",
    "pr": {
      "spicy": 1,
      "green": 10,
      "citrus": 1,
      "floral": 25,
      "woody": 50,
      "musk": 10,
      "amber": 1
    },
    "it": [
      [
        "pepper tree berry oil CO2 extract",
        2,
        "h",
        "spicy",
        100
      ],
      [
        "benzyl salicylate",
        100,
        "t",
        "green",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "carrot seed oil",
        1,
        "h",
        "floral",
        100
      ],
      [
        "cedarwood oil atlas",
        2,
        "b",
        "woody",
        100
      ],
      [
        "cedryl methyl ether",
        10,
        "h",
        "floral",
        100
      ],
      [
        "cinnamyl cinnamate",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "cashmeran",
        2,
        "b",
        "musk",
        100
      ],
      [
        "bacdanol",
        5,
        "b",
        "woody",
        100
      ],
      [
        "vanillyl isobutyrate 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "ambrettolide",
        5,
        "b",
        "musk",
        100
      ],
      [
        "indisan",
        25,
        "h",
        "floral",
        100
      ],
      [
        "kephalis",
        150,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        15,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin 1%",
        5,
        "b",
        "amber",
        1
      ],
      [
        "evernyl",
        5,
        "b",
        "woody",
        100
      ],
      [
        "isobutyl quinoleine 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "ambrox",
        1,
        "b",
        "amber",
        100
      ],
      [
        "ethylene brassylate",
        100,
        "b",
        "musk",
        100
      ],
      [
        "patchouli oil",
        500,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-223",
    "te": "Purple Lilac Accord",
    "tr": "Аккорд пурпурной сирени",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд пурпурной сирени». Ключевые материалы структуры: phenethyl alcohol, methyl dihydrojasmonate, dimethyl benzyl carbinol, heliotropin.",
    "pr": {
      "citrus": 6,
      "spicy": 3,
      "floral": 50,
      "green": 2,
      "amber": 9
    },
    "it": [
      [
        "aldehyde C-10",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "anethol 10%",
        1,
        "h",
        "spicy",
        10
      ],
      [
        "para-anisaldehyde",
        18,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "cinnamic alcohol",
        30,
        "h",
        "spicy",
        100
      ],
      [
        "cis-3-hexenol",
        25,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl formate 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "dimethyl benzyl carbinol",
        120,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        2,
        "b",
        "aquatic",
        0
      ],
      [
        "eugenyl phenyl acetate",
        3,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        150,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        120,
        "b",
        "amber",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "indole",
        6,
        "h",
        "floral",
        100
      ],
      [
        "isoeugenol",
        6,
        "h",
        "spicy",
        100
      ],
      [
        "isoeugenyl acetate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        25,
        "h",
        "floral",
        100
      ],
      [
        "lilytol",
        25,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        5,
        "h",
        "floral",
        100
      ],
      [
        "hyacinth body 1%",
        4,
        "h",
        "floral",
        1
      ],
      [
        "phenyl acetaldehyde dimethyl acetal",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        321,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl phenyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "syringa aldehyde 50%",
        5,
        "t",
        "citrus",
        50
      ],
      [
        "alpha-terpineol",
        15,
        "h",
        "floral",
        100
      ],
      [
        "(E)-2-decenal 1%",
        2,
        "h",
        "floral",
        1
      ],
      [
        "vanillin 1%",
        5,
        "b",
        "amber",
        1
      ],
      [
        "aquaflor",
        5,
        "h",
        "aquatic",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-224",
    "te": "lily of the valley pear type",
    "tr": "Ландыш и груша (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring hexyl acetate, dihydromyrcenol, phenethyl alcohol, linalool.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Ландыш и груша (тип)». Ключевые материалы структуры: phenethyl alcohol, dipropylene glycol, citronellol, lilial.",
    "pr": {
      "floral": 50,
      "citrus": 5,
      "musk": 3
    },
    "it": [
      [
        "hexyl acetate",
        11,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        222,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        67,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        22,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "freskomenthe",
        3,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        33,
        "t",
        "citrus",
        100
      ],
      [
        "lilial",
        110,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-14",
        7,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        45,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        135,
        "h",
        "floral",
        100
      ],
      [
        "terpineol",
        22,
        "h",
        "floral",
        100
      ],
      [
        "heliotropin",
        8,
        "b",
        "amber",
        100
      ],
      [
        "galaxolide 50 IPM",
        55,
        "b",
        "musk",
        50
      ],
      [
        "phenoxanol",
        17,
        "h",
        "floral",
        100
      ],
      [
        "cinnamaldehyde",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        33,
        "t",
        "citrus",
        100
      ],
      [
        "triplal",
        6,
        "t",
        "green",
        100
      ],
      [
        "methyl anthranilate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "cyclopidene",
        11,
        "h",
        "floral",
        100
      ],
      [
        "dipropylene glycol",
        185,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-225",
    "te": "lily of the valley type (#225)",
    "tr": "Ландыш (тип) (#225)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring cis-3-hexenyl acetate, cinnamic alcohol, aldehyde C-10 10%, aldehyde C-11 undecylenic 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Ландыш (тип) (#225)». Ключевые материалы структуры: citronellol, jasmin oil, linalool, hedione.",
    "pr": {
      "spicy": 2,
      "citrus": 5,
      "floral": 50
    },
    "it": [
      [
        "cis-3-hexenyl acetate",
        7.06,
        "t",
        "green",
        100
      ],
      [
        "cinnamic alcohol",
        23.53,
        "h",
        "spicy",
        100
      ],
      [
        "aldehyde C-10 10%",
        9.41,
        "t",
        "citrus",
        10
      ],
      [
        "aldehyde C-11 undecylenic 10%",
        7.06,
        "t",
        "citrus",
        10
      ],
      [
        "aldehyde C-9 10%",
        9.41,
        "t",
        "citrus",
        10
      ],
      [
        "methyl anthranilate",
        4.71,
        "h",
        "floral",
        100
      ],
      [
        "chamomile valerate",
        4.71,
        "h",
        "floral",
        100
      ],
      [
        "carbinol muguet",
        58.82,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl cinnamate",
        11.76,
        "h",
        "spicy",
        100
      ],
      [
        "citronellol",
        164.71,
        "h",
        "floral",
        100
      ],
      [
        "firsantol",
        4.71,
        "h",
        "floral",
        100
      ],
      [
        "geranium oil",
        23.53,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        105.88,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        47.06,
        "t",
        "citrus",
        100
      ],
      [
        "indole 10%",
        9.41,
        "h",
        "floral",
        10
      ],
      [
        "jasmin oil",
        141.18,
        "h",
        "floral",
        100
      ],
      [
        "lilyflore",
        58.82,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        117.65,
        "h",
        "floral",
        100
      ],
      [
        "phenethylol",
        58.82,
        "h",
        "floral",
        100
      ],
      [
        "phenylhexanol",
        51.76,
        "h",
        "floral",
        100
      ],
      [
        "scentenal",
        47.06,
        "h",
        "floral",
        100
      ],
      [
        "phenyl acetaldehyde dimethyl acetal",
        9.41,
        "t",
        "citrus",
        100
      ],
      [
        "ylang ylang oil",
        23.53,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-226",
    "te": "lily of the valley type (#226)",
    "tr": "Ландыш (тип) (#226)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring hexyl acetate, isobornyl acetate, geranyl acetate, phenethyl acetate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Ландыш (тип) (#226)». Ключевые материалы структуры: dihydromyrcenol, isobornyl acetate, alpha-hexyl cinnamaldehyde, habanolide.",
    "pr": {
      "floral": 50,
      "gourmand": 7,
      "citrus": 12,
      "amber": 4,
      "spicy": 1,
      "musk": 6,
      "woody": 5,
      "green": 6
    },
    "it": [
      [
        "hexyl acetate",
        20.62,
        "h",
        "floral",
        100
      ],
      [
        "isobornyl acetate",
        51.55,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        10.31,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl acetate",
        10.31,
        "h",
        "floral",
        100
      ],
      [
        "styrallyl acetate",
        5.15,
        "h",
        "gourmand",
        100
      ],
      [
        "verdyl acetate",
        41.24,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        51.55,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 mna",
        10.31,
        "t",
        "citrus",
        100
      ],
      [
        "allyl amyl glycolate",
        5.15,
        "h",
        "gourmand",
        100
      ],
      [
        "methyl anthranilate",
        5.15,
        "h",
        "floral",
        100
      ],
      [
        "methyl benzoate",
        4.12,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetone",
        25.77,
        "h",
        "floral",
        100
      ],
      [
        "rose butanoate",
        15.46,
        "h",
        "floral",
        100
      ],
      [
        "watermelon ketone",
        1.03,
        "h",
        "floral",
        100
      ],
      [
        "cetalox",
        10.31,
        "b",
        "amber",
        100
      ],
      [
        "raspberry ketone",
        3.09,
        "h",
        "gourmand",
        100
      ],
      [
        "citronellyl nitrile",
        5.15,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        25.77,
        "b",
        "amber",
        100
      ],
      [
        "alpha-damascone",
        3.09,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        61.86,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl vanillin",
        4.12,
        "b",
        "amber",
        100
      ],
      [
        "eugenol",
        10.31,
        "h",
        "spicy",
        100
      ],
      [
        "fructalate",
        30.93,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        41.24,
        "h",
        "gourmand",
        100
      ],
      [
        "geraniol",
        20.62,
        "h",
        "floral",
        100
      ],
      [
        "habanolide",
        51.55,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        41.24,
        "h",
        "floral",
        100
      ],
      [
        "allyl heptanoate",
        10.31,
        "h",
        "gourmand",
        100
      ],
      [
        "beta-ionone",
        10.31,
        "h",
        "floral",
        100
      ],
      [
        "iralia total",
        30.93,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        51.55,
        "b",
        "woody",
        100
      ],
      [
        "lavandin oil grosso",
        10.31,
        "t",
        "green",
        100
      ],
      [
        "timber propanol",
        2.06,
        "b",
        "woody",
        100
      ],
      [
        "chrysanthemum oxide",
        3.09,
        "h",
        "floral",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        5.15,
        "h",
        "gourmand",
        100
      ],
      [
        "para-methyl anisole",
        2.06,
        "h",
        "spicy",
        100
      ],
      [
        "oakmoss oil",
        3.09,
        "b",
        "woody",
        100
      ],
      [
        "muscenone delta",
        10.31,
        "b",
        "musk",
        100
      ],
      [
        "neobutenone alpha",
        2.06,
        "h",
        "floral",
        100
      ],
      [
        "santol pentenol",
        10.31,
        "h",
        "floral",
        100
      ],
      [
        "cis-galbanum oxathiane 10%",
        2.06,
        "t",
        "green",
        10
      ],
      [
        "phenylhexanol",
        30.93,
        "h",
        "floral",
        100
      ],
      [
        "hydrogenated rosin",
        25.77,
        "h",
        "floral",
        100
      ],
      [
        "salicynalva",
        51.55,
        "h",
        "floral",
        100
      ],
      [
        "sclareolate",
        51.55,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        20.62,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl oxyacetaldehyde",
        5.15,
        "t",
        "citrus",
        100
      ],
      [
        "2,4-ivy carbaldehyde",
        5.15,
        "t",
        "citrus",
        100
      ],
      [
        "undecavertol",
        26.8,
        "h",
        "floral",
        100
      ],
      [
        "green acetate",
        51.55,
        "t",
        "green",
        100
      ],
      [
        "yara yara",
        10.31,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-227",
    "te": "lily of the valley type (#227)",
    "tr": "Ландыш (тип) (#227)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, phenethyl alcohol, alpha-hexyl cinnamaldehyde, citronellol 98%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Ландыш (тип) (#227)». Ключевые материалы структуры: phenethyl alcohol, linalool, alpha-hexyl cinnamaldehyde, methyl dihydrojasmonate.",
    "pr": {
      "floral": 50,
      "citrus": 6,
      "gourmand": 1
    },
    "it": [
      [
        "benzyl acetate",
        56,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        445,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol 98%",
        80,
        "h",
        "floral",
        98
      ],
      [
        "methyl dihydrojasmonate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        85,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        105,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        1,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenol 10%",
        6,
        "t",
        "green",
        10
      ],
      [
        "indole 10%",
        6,
        "h",
        "floral",
        10
      ],
      [
        "vanillin 10%",
        6,
        "b",
        "amber",
        10
      ],
      [
        "delta-dodecalactone",
        10,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-228",
    "te": "Lychee Accord (#228)",
    "tr": "Личи Аккорд (#228)",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Личи Аккорд (#228)». Ключевые материалы структуры: phenethyl alcohol, phenoxyethyl isobutyrate, linalool, lemon oil terpenes 100 % Pure.",
    "pr": {
      "musk": 2,
      "floral": 50,
      "citrus": 4
    },
    "it": [
      [
        "ambrettolide",
        23.79,
        "b",
        "musk",
        100
      ],
      [
        "benzyl acetone",
        1.9,
        "h",
        "floral",
        100
      ],
      [
        "benzyl alcohol",
        23.79,
        "h",
        "floral",
        100
      ],
      [
        "black currant bud absolute 1% IPM",
        17.09,
        "h",
        "floral",
        1
      ],
      [
        "citral",
        0.5,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        43.27,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl formate",
        12.39,
        "h",
        "floral",
        100
      ],
      [
        "damascenone",
        2.4,
        "h",
        "floral",
        100
      ],
      [
        "dibutyl sulfide 10% DPG",
        47.57,
        "h",
        "floral",
        10
      ],
      [
        "diphenyl methane",
        1,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        1,
        "h",
        "spicy",
        100
      ],
      [
        "raspberry ketone",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "fructone",
        4.3,
        "h",
        "gourmand",
        100
      ],
      [
        "geraniol",
        11.39,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        4.3,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetone",
        1,
        "h",
        "floral",
        100
      ],
      [
        "geranyl formate",
        5.7,
        "h",
        "floral",
        100
      ],
      [
        "geranyl propionate",
        2.9,
        "h",
        "floral",
        100
      ],
      [
        "geranyl tiglate",
        2.9,
        "h",
        "floral",
        100
      ],
      [
        "geranyl isobutyrate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "hedione HC",
        7.6,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        71.36,
        "h",
        "floral",
        100
      ],
      [
        "alpha-irone",
        4.8,
        "h",
        "floral",
        100
      ],
      [
        "isomenthone",
        8.59,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil terpenes 100 % Pure",
        73.26,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        96.94,
        "h",
        "floral",
        100
      ],
      [
        "laevo-menthone FCC Natural USA",
        1.4,
        "h",
        "floral",
        100
      ],
      [
        "methyl diphenyl ether",
        7.1,
        "h",
        "floral",
        100
      ],
      [
        "muscenone 962191",
        9.49,
        "b",
        "musk",
        100
      ],
      [
        "phenoxyethyl isobutyrate",
        180.69,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        285.23,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl benzoate",
        3.3,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl formate",
        1.9,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl propionate",
        1.4,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl salicylate",
        4.3,
        "t",
        "green",
        100
      ],
      [
        "rose absolute turkey 10 % DPG",
        6.7,
        "h",
        "floral",
        10
      ],
      [
        "laevo-rose oxide",
        5.2,
        "h",
        "floral",
        100
      ],
      [
        "tonalid",
        4.3,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        2.9,
        "t",
        "green",
        100
      ],
      [
        "vanillin",
        2.9,
        "b",
        "amber",
        100
      ],
      [
        "vertenex HC",
        9.49,
        "h",
        "floral",
        100
      ],
      [
        "aquaflor",
        1,
        "h",
        "aquatic",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-229",
    "te": "Lychee Accord (#229)",
    "tr": "Личи Аккорд (#229)",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Личи Аккорд (#229)». Ключевые материалы структуры: phenethyl alcohol, phenoxyethyl isobutyrate, linalool, lemon oil terpenes 100 % Pure.",
    "pr": {
      "musk": 2,
      "floral": 50,
      "citrus": 4
    },
    "it": [
      [
        "ambrettolide",
        23.79,
        "b",
        "musk",
        100
      ],
      [
        "benzyl acetone",
        1.9,
        "h",
        "floral",
        100
      ],
      [
        "benzyl alcohol",
        23.79,
        "h",
        "floral",
        100
      ],
      [
        "black currant bud absolute 1% IPM",
        17.09,
        "h",
        "floral",
        1
      ],
      [
        "citral",
        0.5,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        43.27,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl formate",
        12.39,
        "h",
        "floral",
        100
      ],
      [
        "damascenone",
        2.4,
        "h",
        "floral",
        100
      ],
      [
        "dibutyl sulfide 10% DPG",
        47.57,
        "h",
        "floral",
        10
      ],
      [
        "diphenyl methane",
        1,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        1,
        "h",
        "spicy",
        100
      ],
      [
        "raspberry ketone",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "fructone",
        4.3,
        "h",
        "gourmand",
        100
      ],
      [
        "geraniol",
        11.39,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        4.3,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetone",
        1,
        "h",
        "floral",
        100
      ],
      [
        "geranyl formate",
        5.7,
        "h",
        "floral",
        100
      ],
      [
        "geranyl propionate",
        2.9,
        "h",
        "floral",
        100
      ],
      [
        "geranyl tiglate",
        2.9,
        "h",
        "floral",
        100
      ],
      [
        "geranyl isobutyrate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "hedione HC",
        7.6,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        71.36,
        "h",
        "floral",
        100
      ],
      [
        "alpha-irone",
        4.8,
        "h",
        "floral",
        100
      ],
      [
        "isomenthone",
        8.59,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil terpenes 100 % Pure",
        73.26,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        96.94,
        "h",
        "floral",
        100
      ],
      [
        "laevo-menthone FCC Natural USA",
        1.4,
        "h",
        "floral",
        100
      ],
      [
        "methyl diphenyl ether",
        7.1,
        "h",
        "floral",
        100
      ],
      [
        "muscenone 962191",
        9.49,
        "b",
        "musk",
        100
      ],
      [
        "phenoxyethyl isobutyrate",
        180.69,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        285.23,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl benzoate",
        3.3,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl formate",
        1.9,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl propionate",
        1.4,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl salicylate",
        4.3,
        "t",
        "green",
        100
      ],
      [
        "rose absolute turkey 10 % DPG",
        6.7,
        "h",
        "floral",
        10
      ],
      [
        "laevo-rose oxide",
        5.2,
        "h",
        "floral",
        100
      ],
      [
        "tonalid",
        4.3,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        2.9,
        "t",
        "green",
        100
      ],
      [
        "vanillin",
        2.9,
        "b",
        "amber",
        100
      ],
      [
        "vertenex HC",
        9.49,
        "h",
        "floral",
        100
      ],
      [
        "aquaflor",
        1,
        "h",
        "aquatic",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-230",
    "te": "malodour reducing composition (Patent 7,781,392)",
    "tr": "Композиция для нейтрализации неприятных запахов (Патент 7,781,392)",
    "sd": "TGSC (dm1015272) · Patent 7,781,392",
    "fa": "floral",
    "kd": "perfume",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,781,392 Perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Композиция для нейтрализации неприятных запахов (Патент 7,781,392)». Формула из патента 7,781,392. Ключевые материалы структуры: DIPG, jasmacyclene, methyl dihydrojasmonate, eugenol.",
    "pr": {
      "amber": 2,
      "spicy": 10,
      "floral": 50
    },
    "it": [
      [
        "cetalox",
        16.7,
        "b",
        "amber",
        100
      ],
      [
        "eugenol",
        83.3,
        "h",
        "spicy",
        100
      ],
      [
        "frutonile",
        83.3,
        "h",
        "floral",
        100
      ],
      [
        "jasmacyclene",
        166.7,
        "h",
        "floral",
        100
      ],
      [
        "labienoxime 10%/IPM-TEC",
        16.7,
        "h",
        "floral",
        10
      ],
      [
        "methyl dihydrojasmonate",
        166.7,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        466.6,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-231",
    "te": "malodour reducing composition (Patent 7,781,392)",
    "tr": "Композиция для нейтрализации неприятных запахов (Патент 7,781,392)",
    "sd": "TGSC (dm1015272) · Patent 7,781,392",
    "fa": "floral",
    "kd": "perfume",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,781,392 Perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Композиция для нейтрализации неприятных запахов (Патент 7,781,392)». Формула из патента 7,781,392. Ключевые материалы структуры: DIPG, cyclisone, methyl dihydrojasmonate, bangalol.",
    "pr": {
      "floral": 50,
      "citrus": 2
    },
    "it": [
      [
        "bangalol",
        83.3,
        "h",
        "floral",
        100
      ],
      [
        "cyclisone",
        166.7,
        "h",
        "floral",
        100
      ],
      [
        "dynascone",
        16.7,
        "h",
        "floral",
        100
      ],
      [
        "intreleven aldehyde",
        16.7,
        "t",
        "citrus",
        100
      ],
      [
        "jasmatone",
        83.3,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        166.7,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        466.6,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-232",
    "te": "mandarin composition",
    "tr": "Мандарин композиция",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, aldehyde C-10, aldehyde C-12 lauric, aldehyde C-8.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мандарин композиция». Ключевые материалы структуры: linalool, sclareolate, orange oil terpenes, hedione.",
    "pr": {
      "floral": 50,
      "citrus": 20
    },
    "it": [
      [
        "benzyl acetate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-10",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 lauric",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-8",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-9",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 mna",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde supra",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "citral",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "citronellyl nitrile",
        20,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "allyl heptanoate",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "linalool",
        200,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl anthranilate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "sclareolate",
        200,
        "h",
        "floral",
        100
      ],
      [
        "dipentene",
        20,
        "h",
        "floral",
        100
      ],
      [
        "orange oil terpenes",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "terpineol",
        80,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-233",
    "te": "mandarin type",
    "tr": "Мандарин (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, aldehyde C-10, aldehyde C-12 lauric, aldehyde C-8.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мандарин (тип)». Ключевые материалы структуры: linalool, sclareolate, orange oil terpenes, hedione.",
    "pr": {
      "floral": 50,
      "citrus": 20
    },
    "it": [
      [
        "benzyl acetate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-10",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 lauric",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-8",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-9",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-12 mna",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde supra",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "citral",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "citronellyl nitrile",
        20,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "allyl heptanoate",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "linalool",
        200,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl anthranilate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "sclareolate",
        200,
        "h",
        "floral",
        100
      ],
      [
        "dipentene",
        20,
        "h",
        "floral",
        100
      ],
      [
        "orange oil terpenes",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "terpineol",
        80,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-234",
    "te": "marine note",
    "tr": "Морской нота",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "aquatic",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring calone, canthoxal, gamma-decalactone, dihydro-beta-ionone.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Морской нота». Ключевые материалы структуры: hedione, musk T, orbitone, scentenal.",
    "pr": {
      "aquatic": 1,
      "floral": 50,
      "gourmand": 2,
      "green": 1,
      "musk": 17
    },
    "it": [
      [
        "calone",
        10,
        "h",
        "aquatic",
        100
      ],
      [
        "canthoxal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "gamma-decalactone",
        30,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydro-beta-ionone",
        50,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "hedione",
        250,
        "h",
        "floral",
        100
      ],
      [
        "heliobouquet",
        40,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        15,
        "t",
        "green",
        100
      ],
      [
        "laevo-citronellol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "muscone",
        40,
        "b",
        "musk",
        100
      ],
      [
        "musk T",
        200,
        "b",
        "musk",
        100
      ],
      [
        "orbitone",
        150,
        "h",
        "floral",
        100
      ],
      [
        "thesaron",
        10,
        "h",
        "floral",
        100
      ],
      [
        "scentenal",
        100,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-235",
    "te": "Masculine cologne",
    "tr": "Мужской одеколон",
    "sd": "TGSC (dm1015272) · Patent 8,349,890",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "Cologne",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,349,890 Isolongifolanyl-derivatives suitable as odorants.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужской одеколон». Формула из патента 8,349,890. Ключевые материалы структуры: hedione, bergamot oil bergaptene reduced, iso e super, pepperwood.",
    "pr": {
      "aquatic": 1,
      "floral": 50,
      "musk": 9,
      "woody": 30,
      "citrus": 24,
      "green": 1,
      "spicy": 1
    },
    "it": [
      [
        "calone 1951",
        10,
        "h",
        "aquatic",
        100
      ],
      [
        "calypsone",
        6.25,
        "h",
        "floral",
        100
      ],
      [
        "cashmeran",
        5,
        "b",
        "musk",
        100
      ],
      [
        "cedarwood oil virginia",
        12.5,
        "b",
        "woody",
        100
      ],
      [
        "cetone alpha",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl linalool",
        100,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide",
        75,
        "b",
        "musk",
        100
      ],
      [
        "iso e super",
        125,
        "b",
        "woody",
        100
      ],
      [
        "lavender oil",
        7.5,
        "t",
        "green",
        100
      ],
      [
        "hedione",
        150,
        "h",
        "floral",
        100
      ],
      [
        "methyl pamplemousse",
        20,
        "h",
        "floral",
        100
      ],
      [
        "pepperwood",
        112.5,
        "b",
        "woody",
        100
      ],
      [
        "pharaone 10%/DPG",
        5,
        "h",
        "floral",
        10
      ],
      [
        "radjanol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "serenolide",
        37.5,
        "h",
        "floral",
        100
      ],
      [
        "silvial",
        18.75,
        "h",
        "floral",
        100
      ],
      [
        "tropional",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "white pepper oil",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "zinarine 1%",
        10,
        "h",
        "floral",
        1
      ],
      [
        "bergamot oil bergaptene reduced",
        150,
        "t",
        "citrus",
        100
      ],
      [
        "DIPG",
        25,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-236",
    "te": "Masculine composition",
    "tr": "Мужской композиция",
    "sd": "TGSC (dm1015272) · Patent 5,665,696",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,665,696 Multi-substituted tetrahydrofurans and tetrahydropyrans.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужской композиция». Формула из патента 5,665,696. Ключевые материалы структуры: DIPG, Bergamot 131/2/1C, bergamot oil bergaptene reduced, lemon oil distilled.",
    "pr": {
      "green": 9,
      "citrus": 50,
      "spicy": 2,
      "amber": 2,
      "floral": 34,
      "leathery": 7,
      "woody": 11
    },
    "it": [
      [
        "armoise oil",
        11.11,
        "t",
        "green",
        100
      ],
      [
        "Bergamot 131/2/1C",
        111.11,
        "t",
        "citrus",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        111.11,
        "t",
        "citrus",
        100
      ],
      [
        "clove bud oil",
        13.33,
        "h",
        "spicy",
        100
      ],
      [
        "coumarin",
        11.11,
        "b",
        "amber",
        100
      ],
      [
        "dimetol",
        5.56,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        224.44,
        "b",
        "aquatic",
        0
      ],
      [
        "galbanum coeur 10%",
        33.33,
        "t",
        "green",
        10
      ],
      [
        "hedione",
        77.78,
        "h",
        "floral",
        100
      ],
      [
        "hydrocarboresine SB",
        5.56,
        "h",
        "floral",
        100
      ],
      [
        "isobutyl quinoline 10%",
        22.22,
        "b",
        "leathery",
        10
      ],
      [
        "isopropyl quinoline 1%",
        27.78,
        "b",
        "leathery",
        1
      ],
      [
        "lemon oil distilled",
        111.11,
        "t",
        "citrus",
        100
      ],
      [
        "patchouli oil light",
        72.22,
        "b",
        "woody",
        100
      ],
      [
        "petitgrain oil SA",
        3.33,
        "t",
        "citrus",
        100
      ],
      [
        "reseda body 10%",
        5.56,
        "h",
        "floral",
        10
      ],
      [
        "styralyl acetate",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "tarragon oil",
        12.22,
        "h",
        "floral",
        100
      ],
      [
        "thyme absolute",
        5.56,
        "t",
        "green",
        100
      ],
      [
        "triplal 10%",
        13.33,
        "t",
        "green",
        10
      ],
      [
        "2,4-dimethyl-4-(3,3-dimethylbicyclo[2.2.1]hept-2-yl)tetrahydrofuran",
        111.11,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-237",
    "te": "Masculine fragrance composition",
    "tr": "Мужской аромат композиция",
    "sd": "TGSC (dm1015272) · Patent 7,790,668",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,790,668 2-methoxy-2,6-dimethyloctanal and its use as a fragrance ingredient.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужской аромат композиция». Формула из патента 7,790,668. Ключевые материалы структуры: georgywood, hedione, benzyl salicylate, habanolide.",
    "pr": {
      "gourmand": 2,
      "floral": 50,
      "green": 18,
      "citrus": 32,
      "musk": 16,
      "woody": 40
    },
    "it": [
      [
        "allyl amyl glycolate",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "ambrofix",
        2,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        100,
        "t",
        "green",
        100
      ],
      [
        "citronellyl acetate",
        2,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone 10%",
        9,
        "h",
        "gourmand",
        10
      ],
      [
        "dihydromyrcenol",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        8,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl butyrate",
        3,
        "h",
        "floral",
        100
      ],
      [
        "pharaone 10%/DPG",
        8,
        "h",
        "floral",
        10
      ],
      [
        "geranyl acetate",
        3,
        "h",
        "floral",
        100
      ],
      [
        "grapefruit oil",
        70,
        "t",
        "citrus",
        100
      ],
      [
        "azurone 1%",
        2,
        "h",
        "floral",
        1
      ],
      [
        "habanolide",
        100,
        "b",
        "musk",
        100
      ],
      [
        "georgywood",
        250,
        "b",
        "woody",
        100
      ],
      [
        "cis-3-hexenol",
        3,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        1,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        10,
        "t",
        "green",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        45,
        "t",
        "citrus",
        100
      ],
      [
        "hedione",
        150,
        "h",
        "floral",
        100
      ],
      [
        "citron ess. oil",
        45,
        "h",
        "floral",
        100
      ],
      [
        "cyclohexal",
        20,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        15,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        45,
        "t",
        "citrus",
        100
      ],
      [
        "orange oil",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "oranger crystals 10%",
        2,
        "t",
        "citrus",
        10
      ],
      [
        "gardenol",
        5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        3,
        "h",
        "floral",
        100
      ],
      [
        "cyclal C 10%",
        14,
        "h",
        "floral",
        10
      ],
      [
        "DIPG",
        19,
        "b",
        "aquatic",
        0
      ],
      [
        "6-methoxy-2,6-dimethyl octanal",
        30,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-238",
    "te": "Masculine MG1006 /2 (Givaudan)",
    "tr": "Мужской MG1006 /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "woody",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: For Men's Cologne at 8% Alc. 90.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужской MG1006 /2 (Givaudan)». Ключевые материалы структуры: ISO E SUPER (IFF), HEDIONE (Firmenich), TRIETHYL CITRATE, BENZOIN LAOS 50%.",
    "pr": {
      "floral": 32,
      "woody": 50,
      "citrus": 15,
      "amber": 6,
      "spicy": 1
    },
    "it": [
      [
        "METHYL ANTHRANILATE (Givaudan) @10%",
        1,
        "h",
        "floral",
        10
      ],
      [
        "JAVANOL (Givaudan)",
        1,
        "b",
        "woody",
        100
      ],
      [
        "ALDEHYDE C 12 LAURIC @10%",
        2,
        "t",
        "citrus",
        10
      ],
      [
        "AMBRETTOLIDE (Givaudan)",
        2,
        "b",
        "musk",
        100
      ],
      [
        "EVERNYL",
        2,
        "b",
        "woody",
        100
      ],
      [
        "FLORHYDRAL (Givaudan)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "STYRALLYL ACETATE",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "PHARAONE 10%/DPG (Givaudan)",
        2,
        "h",
        "floral",
        10
      ],
      [
        "SAFRALEINE (Givaudan)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "AMBROFIX (Givaudan)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "GERANIUM OIL EGYPT",
        3,
        "h",
        "floral",
        100
      ],
      [
        "FIR BALSAM OIL CANADA",
        4,
        "b",
        "amber",
        100
      ],
      [
        "PEPPER BLACK OIL MADAGASCAR",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "COSMONE (Givaudan)",
        7,
        "h",
        "floral",
        100
      ],
      [
        "ELEMI OIL",
        7,
        "h",
        "floral",
        100
      ],
      [
        "ETHYL LINALYL ACETATE",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "CITRONELLOL",
        15,
        "h",
        "floral",
        100
      ],
      [
        "LINALOOL",
        15,
        "h",
        "floral",
        100
      ],
      [
        "FLOROSA (Givaudan)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "KEPHALIS (Givaudan)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "PATCHOULI OIL IRONFREE",
        20,
        "b",
        "woody",
        100
      ],
      [
        "VETIVER OIL HAITI DRIED FILTERED",
        20,
        "b",
        "woody",
        100
      ],
      [
        "METHYL PAMPLEMOUSSE (Givaudan)",
        25,
        "h",
        "floral",
        100
      ],
      [
        "SILVANONE SUPRA (Givaudan)",
        25,
        "h",
        "floral",
        100
      ],
      [
        "ORANGE OIL FLORIDA",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "LINALYL ACETATE",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "CEDAR WOOD OIL VIRGINIA",
        40,
        "b",
        "woody",
        100
      ],
      [
        "LEMON OIL ITALY COLOURLESS",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "BENZOIN LAOS 50%",
        50,
        "b",
        "amber",
        50
      ],
      [
        "HEDIONE (Firmenich)",
        120,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER (IFF)",
        350,
        "b",
        "woody",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "TRIETHYL CITRATE",
        100,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-239",
    "te": "Masculine MM1006 /2 (Givaudan)",
    "tr": "Мужской MM1006 /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "woody",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: For Men's Cologne at 8% Alc. 90.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужской MM1006 /2 (Givaudan)». Ключевые материалы структуры: ISO E SUPER (IFF), HEDIONE (Firmenich), DIPROPYLENE GLYCOL, LEMON OIL ITALY.",
    "pr": {
      "floral": 29,
      "woody": 50,
      "amber": 1,
      "citrus": 6
    },
    "it": [
      [
        "PHARAONE 10%/DPG (Givaudan)",
        1,
        "h",
        "floral",
        10
      ],
      [
        "METHYL ANTHRANILATE (Givaudan) @10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "STYRALLYL ACETATE",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "GERANIUM OIL EGYPT",
        2,
        "h",
        "floral",
        100
      ],
      [
        "OAKMOSS GIVCO 214/3 (Givaudan)",
        2,
        "b",
        "woody",
        100
      ],
      [
        "KARANAL (Givaudan) @10%",
        3,
        "b",
        "amber",
        10
      ],
      [
        "FIR BALSAM OIL CANADA",
        3,
        "b",
        "amber",
        100
      ],
      [
        "FLOROSA (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "ROSE OIL BULGARY @10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "CEDAR WOOD OIL ATLAS",
        10,
        "b",
        "woody",
        100
      ],
      [
        "COSMONE (Givaudan)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL",
        10,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLOL",
        15,
        "h",
        "floral",
        100
      ],
      [
        "ORANGE OIL FLORIDA",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "PATCHOULI OIL COLORLESS",
        20,
        "b",
        "woody",
        100
      ],
      [
        "LINALYL ACETATE",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "CEDAR WOOD OIL VIRGINIA",
        25,
        "b",
        "woody",
        100
      ],
      [
        "ETHYL LINALOOL (Givaudan)",
        25,
        "h",
        "floral",
        100
      ],
      [
        "VETIVER OIL HAITI DRIED FILTERED",
        25,
        "b",
        "woody",
        100
      ],
      [
        "LEMON OIL ITALY",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "METHYL PAMPLEMOUSSE (Givaudan)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE (Firmenich)",
        125,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER (IFF)",
        500,
        "b",
        "woody",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "DIPROPYLENE GLYCOL",
        105,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-240",
    "te": "Masculine MR1007 /2 (Givaudan)",
    "tr": "Мужской MR1007 /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: For Men's Cologne at 8% Alc. 90.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужской MR1007 /2 (Givaudan)». Ключевые материалы структуры: DIPROPYLENE GLYCOL, ISO E SUPER (IFF), BERGAMOT OIL ITALY COLOURLESS, HEDIONE (Firmenich).",
    "pr": {
      "citrus": 23,
      "green": 2,
      "floral": 50,
      "woody": 24,
      "musk": 3
    },
    "it": [
      [
        "ALDEHYDE C 10 DECYLIC",
        0.2,
        "t",
        "citrus",
        100
      ],
      [
        "HEXENOL-3-CIS",
        0.2,
        "t",
        "green",
        100
      ],
      [
        "INDOLE PURE",
        0.2,
        "h",
        "floral",
        100
      ],
      [
        "SAFRANAL @10%",
        0.2,
        "h",
        "floral",
        10
      ],
      [
        "JAVANOL (Givaudan)",
        0.4,
        "b",
        "woody",
        100
      ],
      [
        "CARDAMOM SEED OIL",
        0.5,
        "h",
        "spicy",
        100
      ],
      [
        "IRONE ALPHA (Givaudan) @10%",
        0.5,
        "h",
        "floral",
        10
      ],
      [
        "METHYL DIANTILIS (Givaudan) @10%",
        0.5,
        "h",
        "floral",
        10
      ],
      [
        "HEXYL SALICYLATE (Givaudan)",
        1,
        "t",
        "green",
        100
      ],
      [
        "TRIPLAL (IFF)",
        1,
        "t",
        "green",
        100
      ],
      [
        "GERANYL ACETATE",
        2,
        "h",
        "floral",
        100
      ],
      [
        "COSMONE (Givaudan)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "OAKMOSS GIVCO 214 (Givaudan)",
        2,
        "b",
        "woody",
        100
      ],
      [
        "SPIROGALBANONE PURE (Givaudan) @10% (Givaudan)",
        2,
        "h",
        "floral",
        10
      ],
      [
        "NERYL ACETATE",
        3,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDRO IONONE BETA (Givaudan)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "NEROLEX",
        3,
        "h",
        "floral",
        100
      ],
      [
        "ISORALDEINE 95 (Givaudan)",
        4,
        "h",
        "floral",
        100
      ],
      [
        "METHYL PAMPLEMOUSSE (Givaudan)",
        4,
        "h",
        "floral",
        100
      ],
      [
        "CITRAL LEMAROME N (Givaudan)",
        8,
        "t",
        "citrus",
        100
      ],
      [
        "AMBROFIX (Givaudan)",
        9,
        "h",
        "floral",
        100
      ],
      [
        "BOISAMBRENE FORTE",
        14,
        "h",
        "floral",
        100
      ],
      [
        "LILIAL",
        14,
        "h",
        "floral",
        100
      ],
      [
        "CEDROL CRYSTALS",
        15,
        "b",
        "woody",
        100
      ],
      [
        "LAVENDER OIL BARREME",
        20,
        "t",
        "green",
        100
      ],
      [
        "LINALOOL",
        20,
        "h",
        "floral",
        100
      ],
      [
        "ETHYLENE BRASSYLATE",
        25,
        "b",
        "musk",
        100
      ],
      [
        "LEMON OIL ITALY COLOURLESS",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "PATCHOULI OIL IRONFREE",
        30,
        "b",
        "woody",
        100
      ],
      [
        "GRAPEFRUIT OIL",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "MANDARIN OIL ITALY",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "PETITGRAIN OIL PARAGUAY",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "METHYL CEDRYL KETONE",
        50,
        "h",
        "floral",
        100
      ],
      [
        "BERGAMOT OIL ITALY COLOURLESS",
        65,
        "t",
        "citrus",
        100
      ],
      [
        "HEDIONE (Firmenich)",
        65,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER (IFF)",
        190,
        "b",
        "woody",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "DIPROPYLENE GLYCOL",
        290.3,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-241",
    "te": "masculine type",
    "tr": "Мужской (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring bergamot oil, dihydromyrcenol, geranium oil bourbon, linalool.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мужской (тип)». Ключевые материалы структуры: hedione, bergamot oil, linalyl acetate, lime oil.",
    "pr": {
      "citrus": 49,
      "floral": 50,
      "green": 7,
      "gourmand": 1,
      "amber": 9
    },
    "it": [
      [
        "bergamot oil",
        160,
        "t",
        "citrus",
        100
      ],
      [
        "dihydromyrcenol",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "geranium oil bourbon",
        20,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        60,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        120,
        "t",
        "citrus",
        100
      ],
      [
        "lavender oil",
        60,
        "t",
        "green",
        100
      ],
      [
        "galbanolene super",
        20,
        "h",
        "floral",
        100
      ],
      [
        "isodamascone 10%",
        6,
        "h",
        "gourmand",
        10
      ],
      [
        "cyclogalbanate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "brahmanol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "precyclemone B",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "ambroxan",
        40,
        "b",
        "amber",
        100
      ],
      [
        "hedione",
        200,
        "h",
        "floral",
        100
      ],
      [
        "para-anisaldehyde 10%",
        14,
        "t",
        "citrus",
        10
      ],
      [
        "coumarin",
        40,
        "b",
        "amber",
        100
      ],
      [
        "lime oil",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "piconia",
        80,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-242",
    "te": "Melon perfume base",
    "tr": "Дыня парфюм парфюмерная база",
    "sd": "TGSC (dm1015272) · Patent 4,634,548",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,634,548 Novel bicyclic epoxides and compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Дыня парфюм парфюмерная база». Формула из патента 4,634,548. Ключевые материалы структуры: DIPG, myraldyl acetate, cis-3-hexenyl salicylate, methyl dihydrojasmonate.",
    "pr": {
      "floral": 50,
      "green": 12,
      "citrus": 7,
      "spicy": 1
    },
    "it": [
      [
        "myraldyl acetate",
        155.56,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        88.89,
        "t",
        "green",
        100
      ],
      [
        "methyl dihydrojasmonate",
        66.67,
        "h",
        "floral",
        100
      ],
      [
        "ethyl acetoacetate",
        66.67,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        55.56,
        "t",
        "citrus",
        100
      ],
      [
        "verdyl acetate",
        55.56,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "rhodinol",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        5.56,
        "h",
        "spicy",
        100
      ],
      [
        "maltyl isobutyrate 10%",
        5.56,
        "h",
        "floral",
        10
      ],
      [
        "acetanisole",
        5.56,
        "h",
        "spicy",
        100
      ],
      [
        "(Z)-6-nonen-1-ol 10%",
        5.56,
        "h",
        "floral",
        10
      ],
      [
        "DIPG",
        466.67,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-243",
    "te": "Muguet base (Patent 4,755,503)",
    "tr": "Ландыш парфюмерная база (Патент 4,755,503)",
    "sd": "TGSC (dm1015272) · Patent 4,755,503",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,755,503 Fragrance compositions containing 2,4,6-tribromo-3-methylanisole methylanisole.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Ландыш парфюмерная база (Патент 4,755,503)». Формула из патента 4,755,503. Ключевые материалы структуры: citronellol, methyl dihydrojasmonate, lilial, phenethyl alcohol.",
    "pr": {
      "floral": 50,
      "woody": 1
    },
    "it": [
      [
        "phenethyl alcohol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        200,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        200,
        "h",
        "floral",
        100
      ],
      [
        "ylang ylang oil",
        20,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        200,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        100,
        "h",
        "floral",
        100
      ],
      [
        "sandalore",
        10,
        "b",
        "woody",
        100
      ],
      [
        "DIPG",
        13,
        "b",
        "aquatic",
        0
      ],
      [
        "2,4,6-tribromo-3-methyl anisole 10%",
        7,
        "h",
        "spicy",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-244",
    "te": "Muguet base (Patent 4,549,029)",
    "tr": "Ландыш парфюмерная база (Патент 4,549,029)",
    "sd": "TGSC (dm1015272) · Patent 4,549,029",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,549,029 Substituted tetrahydrofurans.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Ландыш парфюмерная база (Патент 4,549,029)». Формула из патента 4,549,029. Ключевые материалы структуры: phenethyl alcohol, benzyl acetate, alpha-terpineol, citronellol.",
    "pr": {
      "floral": 50,
      "citrus": 8,
      "amber": 3,
      "spicy": 1
    },
    "it": [
      [
        "citronellol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        150,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        150,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "rose oxide",
        1,
        "h",
        "floral",
        100
      ],
      [
        "geranium oil bourbon",
        10,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        20,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        150,
        "h",
        "floral",
        100
      ],
      [
        "ylang, synthetic",
        30,
        "h",
        "floral",
        100
      ],
      [
        "para-cresyl phenyl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "heliotropin",
        40,
        "b",
        "amber",
        100
      ],
      [
        "gamma-decalactone",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "citronellyl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "viridine",
        1,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        40,
        "h",
        "floral",
        100
      ],
      [
        "cinnamyl acetate",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "gamma-undecalactone",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "raspberry ketone 1%",
        1,
        "h",
        "gourmand",
        1
      ],
      [
        "methyl anthranilate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        83,
        "b",
        "aquatic",
        0
      ],
      [
        "3-phenyl propyl alcohol",
        30,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-245",
    "te": "Muguet du Bois Accord (#245)",
    "tr": "Аккорд лесного ландыша (#245)",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд лесного ландыша (#245)». Ключевые материалы структуры: hydroxycitronellal, DIPG, dimethyl phenyl ethyl carbinol, methyl dihydrojasmonate.",
    "pr": {
      "gourmand": 2,
      "floral": 40,
      "citrus": 50
    },
    "it": [
      [
        "apritone 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "dimethyl phenyl ethyl carbinol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        268,
        "b",
        "aquatic",
        0
      ],
      [
        "dupical 10%",
        7,
        "h",
        "floral",
        10
      ],
      [
        "florol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        400,
        "t",
        "citrus",
        100
      ],
      [
        "lilytol",
        70,
        "h",
        "floral",
        100
      ],
      [
        "magnolia flower oil 0.1%",
        10,
        "h",
        "floral",
        0.1
      ],
      [
        "methyl dihydrojasmonate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "honeyflor 1%",
        5,
        "h",
        "gourmand",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-246",
    "te": "Muguet Du Bois Accord (#246)",
    "tr": "Аккорд лесного ландыша (#246)",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд лесного ландыша (#246)». Ключевые материалы структуры: hydroxycitronellal, DIPG, dimethyl phenyl ethyl carbinol, hedione.",
    "pr": {
      "gourmand": 1,
      "floral": 44,
      "citrus": 50
    },
    "it": [
      [
        "apritone 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "dimethyl phenyl ethyl carbinol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        223,
        "b",
        "aquatic",
        0
      ],
      [
        "dupical 10%",
        7,
        "h",
        "floral",
        10
      ],
      [
        "florol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        100,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        400,
        "t",
        "citrus",
        100
      ],
      [
        "lilytol",
        70,
        "h",
        "floral",
        100
      ],
      [
        "limediene 0.1%",
        10,
        "t",
        "citrus",
        0.1
      ],
      [
        "magnolia flower oil 0.1%",
        10,
        "h",
        "floral",
        0.1
      ],
      [
        "terrasol 1%",
        10,
        "h",
        "floral",
        1
      ],
      [
        "zestenal 1%",
        30,
        "h",
        "floral",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-247",
    "te": "musk citrus floral fragrance",
    "tr": "Мускусный цитрусовый цветочный аромат",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring isoambrettolide, bicyclononalactone, cashmeran, delta-damascone.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мускусный цитрусовый цветочный аромат». Ключевые материалы структуры: iso e super, ethylene brassylate, methyl dihydrojasmonate, lemon oil.",
    "pr": {
      "musk": 30,
      "gourmand": 4,
      "citrus": 30,
      "floral": 32,
      "amber": 8,
      "woody": 50
    },
    "it": [
      [
        "isoambrettolide",
        40,
        "b",
        "musk",
        100
      ],
      [
        "bicyclononalactone",
        23,
        "h",
        "gourmand",
        100
      ],
      [
        "cashmeran",
        15,
        "b",
        "musk",
        100
      ],
      [
        "delta-damascone",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "ethylene brassylate",
        140,
        "b",
        "musk",
        100
      ],
      [
        "geranium oil africa",
        6,
        "h",
        "floral",
        100
      ],
      [
        "ambroxan",
        50,
        "b",
        "amber",
        100
      ],
      [
        "iso e super",
        325,
        "b",
        "woody",
        100
      ],
      [
        "kohinool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil",
        55,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        15,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "mandarin oil md",
        45,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "orange oil",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "sanjinol",
        40,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-248",
    "te": "Musk powdery feminine creamy warm and comfortable tones (iff)",
    "tr": "Мускусно-пудровый женский аккорд с тёплыми сливочными тонами (IFF)",
    "sd": "TGSC (dm1015272) · Patent 8,859,820",
    "fa": "musk",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,859,820 3-methyl-6-cyclohexadecen-1-one and its use in perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Мускусно-пудровый женский аккорд с тёплыми сливочными тонами (IFF)». Формула из патента 8,859,820. Ключевые материалы структуры: galaxolide 100%, hedione, linalool, linalyl acetate.",
    "pr": {
      "floral": 50,
      "green": 7,
      "citrus": 11,
      "musk": 13,
      "amber": 7,
      "spicy": 4,
      "aquatic": 1,
      "woody": 16
    },
    "it": [
      [
        "allyl amyl glycolate",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "benzyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        55,
        "t",
        "green",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        35,
        "t",
        "citrus",
        100
      ],
      [
        "cashmeran",
        4,
        "b",
        "musk",
        100
      ],
      [
        "cedrenyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        25,
        "b",
        "amber",
        100
      ],
      [
        "cyclogalbaniff",
        3,
        "h",
        "floral",
        100
      ],
      [
        "3-methyl-6-cyclohexadecen-1-one",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "delta-damascone",
        0.4,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl vanillin",
        1,
        "b",
        "amber",
        100
      ],
      [
        "eugenol",
        40,
        "h",
        "spicy",
        100
      ],
      [
        "galaxolide 100%",
        90,
        "b",
        "musk",
        100
      ],
      [
        "galbanum oil",
        0.1,
        "t",
        "green",
        100
      ],
      [
        "geraniol",
        13,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        80,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        6,
        "h",
        "aquatic",
        100
      ],
      [
        "heliotropin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        13,
        "t",
        "green",
        100
      ],
      [
        "beta-ionone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        60,
        "b",
        "woody",
        100
      ],
      [
        "jasmin absolute egypt",
        5,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        40,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        80,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        65,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        40,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate",
        8,
        "h",
        "floral",
        100
      ],
      [
        "methyl ionone gamma supreme",
        55,
        "h",
        "floral",
        100
      ],
      [
        "muskalactone",
        25,
        "b",
        "musk",
        100
      ],
      [
        "Olibanum coeur dep 50 pct",
        6,
        "b",
        "amber",
        100
      ],
      [
        "patchouli oil",
        35,
        "b",
        "woody",
        100
      ],
      [
        "sandalore",
        20,
        "b",
        "woody",
        100
      ],
      [
        "sanjinol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "styralyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        13,
        "b",
        "amber",
        100
      ],
      [
        "veramoss",
        4,
        "b",
        "woody",
        100
      ],
      [
        "vertofix",
        25,
        "b",
        "woody",
        100
      ],
      [
        "ylang ylang oil",
        5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-249",
    "te": "narcisse formulation",
    "tr": "Нарцисс формула",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl alcohol, benzyl benzoate, alpha-terpineol, nerol.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Нарцисс формула». Ключевые материалы структуры: benzyl alcohol, phenethyl alcohol, linalool, DIPG.",
    "pr": {
      "floral": 50,
      "spicy": 3,
      "amber": 5
    },
    "it": [
      [
        "benzyl alcohol",
        125,
        "h",
        "floral",
        100
      ],
      [
        "benzyl benzoate",
        62.5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        75,
        "h",
        "floral",
        100
      ],
      [
        "nerol",
        37.5,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        125,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        125,
        "h",
        "floral",
        100
      ],
      [
        "para-cresyl phenyl acetate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "acetyl isoeugenol",
        50,
        "h",
        "spicy",
        100
      ],
      [
        "heliotropin",
        75,
        "b",
        "amber",
        100
      ],
      [
        "ylang ylang oil",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "para-cresol",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        120,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-250",
    "te": "Odorant composition",
    "tr": "Душистая композиция",
    "sd": "TGSC (dm1015272) · Patent 5,084,440",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,084,440 Odorants.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Душистая композиция». Формула из патента 5,084,440. Ключевые материалы структуры: bergamot essence, lemon essence (oil phase), lavandin essence grosso, carbitol.",
    "pr": {
      "citrus": 50,
      "green": 14,
      "floral": 49,
      "woody": 3,
      "amber": 2,
      "spicy": 6
    },
    "it": [
      [
        "bergamot essence",
        251.26,
        "t",
        "citrus",
        100
      ],
      [
        "lemon essence (oil phase)",
        150.75,
        "t",
        "citrus",
        100
      ],
      [
        "lavandin essence grosso",
        100.5,
        "t",
        "green",
        100
      ],
      [
        "cetone alpha",
        50.25,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        50.25,
        "h",
        "floral",
        100
      ],
      [
        "sandalore",
        20.1,
        "b",
        "woody",
        100
      ],
      [
        "fixolide",
        40.2,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        20.1,
        "b",
        "amber",
        100
      ],
      [
        "nutmeg essence",
        20.1,
        "h",
        "spicy",
        100
      ],
      [
        "clove bud essence",
        20.1,
        "h",
        "spicy",
        100
      ],
      [
        "allyl amyl glycolate",
        2.01,
        "h",
        "gourmand",
        100
      ],
      [
        "evernyl",
        5.03,
        "b",
        "woody",
        100
      ],
      [
        "geranyl acetate",
        50.25,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        40.2,
        "h",
        "floral",
        100
      ],
      [
        "peche pure",
        2.01,
        "h",
        "floral",
        100
      ],
      [
        "isoeugenol",
        5.03,
        "h",
        "spicy",
        100
      ],
      [
        "methyl anthranilate",
        1.01,
        "h",
        "floral",
        100
      ],
      [
        "basil essence",
        10.05,
        "t",
        "green",
        100
      ],
      [
        "carbitol",
        90.45,
        "h",
        "floral",
        100
      ],
      [
        "okoumal",
        70.35,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-251",
    "te": "orangeflower composition",
    "tr": "Флердоранж (цветок апельсина) композиция",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, citronellol, ethyl linalyl acetate, geraniol.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Флердоранж (цветок апельсина) композиция». Ключевые материалы структуры: DIPG, methyl dihydrojasmonate, phenethyl alcohol, geraniol.",
    "pr": {
      "floral": 50,
      "citrus": 10
    },
    "it": [
      [
        "benzyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "ethyl linalyl acetate",
        75,
        "t",
        "citrus",
        100
      ],
      [
        "geraniol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "indole",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        200,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "oranger crystals",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "nerolidol",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        150,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalool",
        75,
        "h",
        "floral",
        100
      ],
      [
        "nerol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        222.5,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-252",
    "te": "orangeflower green composition",
    "tr": "Флердоранж (цветок апельсина) зелёный композиция",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "green",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring alpha-terpinyl acetate, celery seed oil 10%, alpha-damascone 10%, habanolide.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Флердоранж (цветок апельсина) зелёный композиция». Ключевые материалы структуры: lilial, neroli oil, alpha-terpinyl acetate, sclareolate.",
    "pr": {
      "floral": 50,
      "gourmand": 3,
      "musk": 3,
      "woody": 2,
      "citrus": 13,
      "green": 8
    },
    "it": [
      [
        "alpha-terpinyl acetate",
        150,
        "h",
        "floral",
        100
      ],
      [
        "celery seed oil 10%",
        5.56,
        "h",
        "floral",
        10
      ],
      [
        "alpha-damascone 10%",
        41.11,
        "h",
        "gourmand",
        10
      ],
      [
        "habanolide",
        38.89,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "hivernal neo",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        27.78,
        "b",
        "woody",
        100
      ],
      [
        "lilial",
        222.22,
        "h",
        "floral",
        100
      ],
      [
        "neobutenone alpha 10%",
        3.33,
        "h",
        "floral",
        10
      ],
      [
        "neroli oil",
        166.67,
        "t",
        "citrus",
        100
      ],
      [
        "phenethylol",
        27.78,
        "h",
        "floral",
        100
      ],
      [
        "amyl salicylate",
        44.44,
        "t",
        "green",
        100
      ],
      [
        "sclareolate",
        138.89,
        "h",
        "floral",
        100
      ],
      [
        "yara yara",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "triplal",
        55.56,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-253",
    "te": "Accord N° 208305 Oriental citrus (Firmenich)",
    "tr": "Аккорд №208305 · восточный цитрусовый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "amber",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution 5.00%; Shampoo 0.80% · KOUMALACTONE® 10% TEC brings this oriental accord, a new coumarin character, while enhancing the overall warmth of the total fragrance..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208305 · восточный цитрусовый (Firmenich)». Ключевые материалы структуры: BERGAMOT, HEDIONE® HC (Firmenich), LEMON OIL, HABANOLIDE® (Firmenich).",
    "pr": {
      "floral": 36,
      "citrus": 50,
      "musk": 19,
      "aquatic": 6,
      "green": 8,
      "woody": 12,
      "amber": 12,
      "gourmand": 4
    },
    "it": [
      [
        "ARTEMISIA OIL",
        10,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL ACETATE",
        30,
        "h",
        "floral",
        100
      ],
      [
        "BERGAMOT",
        220,
        "t",
        "citrus",
        100
      ],
      [
        "CITRONELLOL",
        30,
        "h",
        "floral",
        100
      ],
      [
        "GALBEX® 183 (Firmenich)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "GERANYL ACETATE",
        15,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        110,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® HC (Firmenich)",
        150,
        "h",
        "floral",
        100
      ],
      [
        "HELIONAL™ (IFF)",
        10,
        "h",
        "aquatic",
        100
      ],
      [
        "INDOL 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "LAVENDER",
        30,
        "t",
        "green",
        100
      ],
      [
        "LEMON OIL",
        120,
        "t",
        "citrus",
        100
      ],
      [
        "MUSCENONE™ (Firmenich)",
        20,
        "b",
        "musk",
        100
      ],
      [
        "OAKMOSS SYNTH",
        10,
        "b",
        "woody",
        100
      ],
      [
        "PATCHOULI OIL",
        50,
        "b",
        "woody",
        100
      ],
      [
        "POLYSANTOL® (Firmenich)",
        20,
        "b",
        "woody",
        100
      ],
      [
        "TAMARINE BASE 41310 G (Firmenich)",
        30,
        "h",
        "aquatic",
        100
      ],
      [
        "TRIPLAL® (IFF) 10%",
        25,
        "t",
        "green",
        10
      ],
      [
        "VANILLIN",
        80,
        "b",
        "amber",
        100
      ],
      [
        "KOUMALACTONE® 10% TEC (Firmenich)",
        30,
        "h",
        "gourmand",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-254",
    "te": "oriental note",
    "tr": "Восточный нота",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "amber",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring vertocitral, galbanum oxyacetate, bergamot oil bergaptene reduced, mandarin oil.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Восточный нота». Ключевые материалы структуры: hedione, linalool, bergamot oil bergaptene reduced, rosaphen.",
    "pr": {
      "citrus": 12,
      "green": 1,
      "floral": 50,
      "amber": 5,
      "woody": 2
    },
    "it": [
      [
        "vertocitral",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "galbanum oxyacetate",
        5,
        "t",
        "green",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "mandarin oil",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "gamma-octalactone",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "profarnesol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        150,
        "h",
        "floral",
        100
      ],
      [
        "phenoxanol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "rosaphen",
        100,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        200,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        13,
        "t",
        "green",
        100
      ],
      [
        "coumarin",
        10,
        "b",
        "amber",
        100
      ],
      [
        "violet propanol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "sandela",
        100,
        "h",
        "floral",
        100
      ],
      [
        "sandalrome",
        30,
        "b",
        "woody",
        100
      ],
      [
        "indole 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "ethyl vanillin isobutyrate",
        50,
        "b",
        "amber",
        100
      ],
      [
        "DIPG",
        100,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-255",
    "te": "Accord N° 208062 Oriental powdery floral musk (Firmenich)",
    "tr": "Аккорд №208062 · восточный пудровый цветочный мускусный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "amber",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · PALISANDROL 17979 increases the diffusion of the amber and sandalwood notes while beautifully linking the white flowers aspects with the rich powdery notes. Furthermore, the overall strength and tenacity has been greatly improved..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208062 · восточный пудровый цветочный мускусный (Firmenich)». Ключевые материалы структуры: EXOLIDE® (Firmenich) (use exolide replacer), HEDIONE® (Firmenich), VANILLIN, BENZYL ACETATE.",
    "pr": {
      "amber": 12,
      "floral": 50,
      "musk": 7,
      "woody": 9,
      "green": 1,
      "gourmand": 1,
      "citrus": 2
    },
    "it": [
      [
        "AMBROX® DL (Firmenich) 10%",
        20,
        "b",
        "amber",
        10
      ],
      [
        "BENZYL ACETATE",
        50,
        "h",
        "floral",
        100
      ],
      [
        "COUMARIN",
        50,
        "b",
        "amber",
        100
      ],
      [
        "ETHYL LINALOL",
        15,
        "h",
        "floral",
        100
      ],
      [
        "ETHYL VANILLIN",
        10,
        "b",
        "amber",
        100
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        165,
        "h",
        "floral",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        50,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        150,
        "h",
        "floral",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER® (IFF)",
        40,
        "b",
        "woody",
        100
      ],
      [
        "LINALOL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "LYRAL® (IFF)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "METHYL OCTINE CARBONATE 1%",
        10,
        "t",
        "green",
        1
      ],
      [
        "MUSCENONE™ (Firmenich)",
        40,
        "b",
        "musk",
        100
      ],
      [
        "NONALACTONE GAMMA 10%",
        15,
        "h",
        "gourmand",
        10
      ],
      [
        "PHENYLETHYL ALCOHOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "SANDALWOOD BASE 77125 B (Firmenich)",
        40,
        "b",
        "woody",
        100
      ],
      [
        "SANDALWOOD OIL",
        30,
        "b",
        "woody",
        100
      ],
      [
        "SCHIFF BASE (HYDROXYCITRONELLAL/ANTHRANILATE)",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "VANILLIN",
        70,
        "b",
        "amber",
        100
      ],
      [
        "YLANG OIL EXTRA",
        5,
        "h",
        "floral",
        100
      ],
      [
        "PALISANDROL 17979 (Firmenich)",
        30,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-256",
    "te": "Osmanthus Accord",
    "tr": "Османтус Аккорд",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Османтус Аккорд». Ключевые материалы структуры: DIPG, beta-ionone, alpha-ionone, ethyl (E,Z)-2,4-decadienoate 10%.",
    "pr": {
      "citrus": 3,
      "gourmand": 7,
      "floral": 50
    },
    "it": [
      [
        "citral 10%",
        28.3,
        "t",
        "citrus",
        10
      ],
      [
        "gamma-decalactone",
        60,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydro-beta-ionone",
        58.3,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        456.7,
        "b",
        "aquatic",
        0
      ],
      [
        "geraniol",
        53.3,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        6.7,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        100,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        120,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        23.3,
        "h",
        "floral",
        100
      ],
      [
        "linalool oxide",
        20,
        "h",
        "floral",
        100
      ],
      [
        "nerol",
        6.7,
        "h",
        "floral",
        100
      ],
      [
        "ethyl (E,Z)-2,4-decadienoate 10%",
        66.7,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-257",
    "te": "ozonic floral type",
    "tr": "Озоновый цветочный (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring phenyl acetaldehyde 1%, beta-ionone, citronellol, gamma-decalactone.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Озоновый цветочный (тип)». Ключевые материалы структуры: iso e super, hedione, lilial, linalool.",
    "pr": {
      "citrus": 2,
      "floral": 50,
      "spicy": 1,
      "woody": 15,
      "green": 4
    },
    "it": [
      [
        "phenyl acetaldehyde 1%",
        20,
        "t",
        "citrus",
        1
      ],
      [
        "beta-ionone",
        50,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "gamma-decalactone",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "eugenol",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "hedione",
        150,
        "h",
        "floral",
        100
      ],
      [
        "ocean propanal",
        50,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "iso e super",
        200,
        "b",
        "woody",
        100
      ],
      [
        "lilial",
        150,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        100,
        "h",
        "floral",
        100
      ],
      [
        "myroxyde",
        40,
        "h",
        "floral",
        100
      ],
      [
        "galbascone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "melon heptenal",
        20,
        "h",
        "floral",
        100
      ],
      [
        "watermelon ketone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "green specialty",
        50,
        "t",
        "green",
        100
      ],
      [
        "DIPG",
        60,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-258",
    "te": "peach type (#258)",
    "tr": "Персик (тип) (#258)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring isoamyl acetate, benzyl acetate, phenethyl alcohol, allyl caproate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Персик (тип) (#258)». Ключевые материалы структуры: tetrahydrolinalool, linalool, hexyl acetate, methyl dihydrojasmonate.",
    "pr": {
      "floral": 50,
      "gourmand": 7
    },
    "it": [
      [
        "isoamyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        65,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "allyl caproate",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "givescone",
        5,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        145,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        4,
        "t",
        "green",
        100
      ],
      [
        "alpha-ionone",
        15,
        "h",
        "floral",
        100
      ],
      [
        "cis-jasmone",
        2,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        175,
        "h",
        "floral",
        100
      ],
      [
        "neofolione",
        1,
        "h",
        "floral",
        100
      ],
      [
        "raspberry ketone",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-nonalactone",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "tetrahydrolinalool",
        260,
        "h",
        "floral",
        100
      ],
      [
        "hexyl acetate",
        155,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        80,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl butyrate 10%",
        5,
        "h",
        "gourmand",
        10
      ],
      [
        "delta-dodecalactone",
        20,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-259",
    "te": "peach type (#259)",
    "tr": "Персик (тип) (#259)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring aldehyde C-14, aldehyde C-16, aurantiol, beta-damascone.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Персик (тип) (#259)». Ключевые материалы структуры: benzyl salicylate, ethylene brassylate, methyl dihydrojasmonate, aldehyde C-14.",
    "pr": {
      "citrus": 39,
      "floral": 50,
      "green": 26,
      "musk": 21
    },
    "it": [
      [
        "aldehyde C-14",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-16",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "aurantiol",
        5,
        "h",
        "floral",
        100
      ],
      [
        "beta-damascone",
        1.5,
        "h",
        "gourmand",
        100
      ],
      [
        "benzyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        150,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenol",
        1.5,
        "t",
        "green",
        100
      ],
      [
        "dimethyl anthranilate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "ethyl butyrate",
        1.5,
        "h",
        "gourmand",
        100
      ],
      [
        "ethylene brassylate",
        150,
        "b",
        "musk",
        100
      ],
      [
        "geraniol",
        15,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "indole",
        0.1,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "triplal",
        3,
        "t",
        "green",
        100
      ],
      [
        "linalool",
        100,
        "h",
        "floral",
        100
      ],
      [
        "linalool oxide",
        3,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        150,
        "h",
        "floral",
        100
      ],
      [
        "orange oil",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "green acetate",
        30,
        "t",
        "green",
        100
      ],
      [
        "prenyl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        1.5,
        "b",
        "amber",
        100
      ],
      [
        "2-tropical oxathiane",
        0.2,
        "h",
        "floral",
        100
      ],
      [
        "magnolia cyclohexanol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        32.7,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-260",
    "te": "pear type accord",
    "tr": "Груша (тип) Аккорд",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring amyl acetate, hexyl acetate, citronellyl acetate, geranyl acetate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Груша (тип) Аккорд». Ключевые материалы структуры: dihydro-alpha-terpinyl acetate, phenoxyethyl isobutyrate, linalool, lilial.",
    "pr": {
      "floral": 50,
      "citrus": 2,
      "musk": 1,
      "gourmand": 10,
      "spicy": 1,
      "green": 3,
      "aquatic": 2
    },
    "it": [
      [
        "amyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "hexyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "dihydro-alpha-terpinyl acetate",
        90,
        "h",
        "floral",
        100
      ],
      [
        "benzaldehyde 10%",
        30,
        "t",
        "citrus",
        10
      ],
      [
        "decanal 50%",
        20,
        "h",
        "floral",
        50
      ],
      [
        "ambrettolide",
        20,
        "b",
        "musk",
        100
      ],
      [
        "manzanate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "raspberry ketone",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl caproate 10%",
        20,
        "h",
        "gourmand",
        10
      ],
      [
        "methyl cinnamate",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "gamma-decalactone",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "beta-damascone 50%",
        20,
        "h",
        "gourmand",
        50
      ],
      [
        "raspberry dicarboxylate",
        30,
        "h",
        "gourmand",
        100
      ],
      [
        "allyl heptanoate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "hexyl isobutyrate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "phenoxyethyl isobutyrate",
        90,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl isobutyrate 10%",
        20,
        "t",
        "green",
        10
      ],
      [
        "isopentyrate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        70,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        80,
        "h",
        "floral",
        100
      ],
      [
        "melonal 1%",
        30,
        "h",
        "aquatic",
        1
      ],
      [
        "ocimene oxirane 10%",
        30,
        "h",
        "floral",
        10
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "(E,Z)-2,6-nonadienal 0.1%",
        40,
        "h",
        "floral",
        0.1
      ],
      [
        "cis-3-hexenol 1%",
        30,
        "t",
        "green",
        1
      ],
      [
        "amyl propionate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "cinnamyl propionate",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "scentenal",
        10,
        "h",
        "floral",
        100
      ],
      [
        "undecavertol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "veloutone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "verdox",
        40,
        "h",
        "gourmand",
        100
      ],
      [
        "poirenate",
        20,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-261",
    "te": "Perfume composition",
    "tr": "Парфюм композиция",
    "sd": "TGSC (dm1015272) · Patent 5,703,250",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,703,250 Odorants.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Парфюм композиция». Формула из патента 5,703,250. Ключевые материалы структуры: ethylene brassylate, hedione, (1R,2S,4R)-2'-isopropyl-1,7,7-trimethyl-spiro[bicyclo-[2.2.1]heptane-2,4'-(1,3-dioxa, lemon essence (oil phase).",
    "pr": {
      "floral": 50,
      "citrus": 34,
      "musk": 34,
      "amber": 1,
      "gourmand": 4,
      "green": 1,
      "woody": 1
    },
    "it": [
      [
        "(1R,2S,4R)-2'-isopropyl-1,7,7-trimethyl-spiro[bicyclo-[2.2.1]heptane-2,4'-(1,3-dioxa",
        100,
        "h",
        "floral",
        100
      ],
      [
        "laevo-bornyl acetate",
        6,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "ambrettolide",
        44,
        "b",
        "musk",
        100
      ],
      [
        "ethylene brassylate",
        200,
        "b",
        "musk",
        100
      ],
      [
        "cetalox",
        3,
        "b",
        "amber",
        100
      ],
      [
        "lemon essence (oil phase)",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "coumarin",
        8,
        "b",
        "amber",
        100
      ],
      [
        "alpha-damascone 10%",
        15,
        "h",
        "gourmand",
        10
      ],
      [
        "beta-damascone 10%",
        7,
        "h",
        "gourmand",
        10
      ],
      [
        "dihydromyrcenol",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "DIPG",
        71,
        "b",
        "aquatic",
        0
      ],
      [
        "fixolide",
        46,
        "h",
        "floral",
        100
      ],
      [
        "galbex 183",
        20,
        "h",
        "floral",
        100
      ],
      [
        "gardenol",
        2,
        "h",
        "floral",
        100
      ],
      [
        "geranium essence",
        16,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        120,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol 10%",
        2,
        "t",
        "green",
        10
      ],
      [
        "lavandin oil",
        6,
        "t",
        "green",
        100
      ],
      [
        "linalool",
        40,
        "h",
        "floral",
        100
      ],
      [
        "mandarin essence",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "muscone",
        9,
        "b",
        "musk",
        100
      ],
      [
        "pimento berry essence",
        4,
        "h",
        "gourmand",
        100
      ],
      [
        "rose oxide 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "thibetolide",
        16,
        "h",
        "floral",
        100
      ],
      [
        "timberol",
        10,
        "b",
        "woody",
        100
      ],
      [
        "tropional",
        3,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-262",
    "te": "Perfume for soap",
    "tr": "Парфюмерная отдушка для мыла",
    "sd": "TGSC (dm1015272) · Patent 5,525,589",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,525,589 Cyclic compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Парфюмерная отдушка для мыла». Формула из патента 5,525,589. Ключевые материалы структуры: benzyl salicylate, phenethyl alcohol, alpha-hexyl cinnamaldehyde, citronellol.",
    "pr": {
      "floral": 50,
      "citrus": 11,
      "amber": 1,
      "spicy": 1,
      "green": 11
    },
    "it": [
      [
        "3-tert.butylcyclohexylideneacetonitrile",
        5,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl benzyl carbinyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        120,
        "h",
        "floral",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-11 undecylenic",
        3,
        "t",
        "citrus",
        100
      ],
      [
        "BHT",
        2,
        "h",
        "floral",
        100
      ],
      [
        "citrus ess. reconstitution",
        70,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        80,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "gamma-decalactone",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        40,
        "t",
        "citrus",
        100
      ],
      [
        "eugenol",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "fixolide",
        50,
        "h",
        "floral",
        100
      ],
      [
        "gardenol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "isoraldeine 70",
        80,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        40,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        30,
        "h",
        "floral",
        100
      ],
      [
        "methyl cedryl ketone",
        60,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        147,
        "t",
        "green",
        100
      ],
      [
        "ylang ylang oil",
        30,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-263",
    "te": "Perfume oil for use in deodorants and antiperspirants",
    "tr": "Парфюмерное масло для дезодорантов и антиперспирантов",
    "sd": "TGSC (dm1015272) · Patent US20090123392",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent US20090123392 A1 Fragrance accords to combat the perception of body odor.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Парфюмерное масло для дезодорантов и антиперспирантов». Формула из патента US20090123392. Ключевые материалы структуры: isopropyl myristate, hedione HC, dihydromyrcenol, tetrahydrolinalol.",
    "pr": {
      "citrus": 18,
      "green": 2,
      "floral": 50,
      "woody": 2,
      "amber": 1,
      "musk": 2
    },
    "it": [
      [
        "aldehyde C-11 undecylenic 10%",
        2,
        "t",
        "citrus",
        10
      ],
      [
        "vertocitral",
        0.5,
        "t",
        "citrus",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        7.5,
        "t",
        "green",
        10
      ],
      [
        "allyl amyl glycolate",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "melonal",
        0.5,
        "h",
        "aquatic",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        70,
        "t",
        "citrus",
        100
      ],
      [
        "dihydromyrcenol",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "cyclogalbanate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpinyl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "litsea cubeba oil",
        2,
        "h",
        "aquatic",
        100
      ],
      [
        "lemon oil",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "orange oil",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "grapefruit oil",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "lavandin oil abrialis",
        10,
        "t",
        "green",
        100
      ],
      [
        "isobornyl acetate",
        3,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        10,
        "h",
        "floral",
        100
      ],
      [
        "calone 1951",
        2,
        "h",
        "aquatic",
        100
      ],
      [
        "florhydral",
        1.5,
        "h",
        "floral",
        100
      ],
      [
        "florol",
        12,
        "h",
        "floral",
        100
      ],
      [
        "tetrahydrolinalol",
        75,
        "h",
        "floral",
        100
      ],
      [
        "geranium oil bourbon",
        5,
        "h",
        "floral",
        100
      ],
      [
        "isodamascone 10%",
        2,
        "h",
        "gourmand",
        10
      ],
      [
        "resedafol",
        1,
        "h",
        "floral",
        100
      ],
      [
        "hedione HC",
        158,
        "h",
        "floral",
        100
      ],
      [
        "laevo-menthyl methyl ether",
        50,
        "h",
        "floral",
        100
      ],
      [
        "jessemal",
        4,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        10,
        "t",
        "green",
        100
      ],
      [
        "(E)-anethol",
        3,
        "h",
        "spicy",
        100
      ],
      [
        "methyl cedryl ketone",
        50,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        25,
        "b",
        "woody",
        100
      ],
      [
        "ambrocenide 1%",
        3,
        "h",
        "floral",
        1
      ],
      [
        "timberol",
        2.5,
        "b",
        "woody",
        100
      ],
      [
        "patchouli oil",
        3.5,
        "b",
        "woody",
        100
      ],
      [
        "evernyl",
        1.5,
        "b",
        "woody",
        100
      ],
      [
        "labdanum absolute 20%",
        2,
        "b",
        "amber",
        20
      ],
      [
        "amber core",
        10,
        "b",
        "amber",
        100
      ],
      [
        "ambraketal",
        1.5,
        "h",
        "floral",
        100
      ],
      [
        "hydroxyambran 50%",
        5,
        "h",
        "floral",
        50
      ],
      [
        "macrolide",
        35,
        "h",
        "floral",
        100
      ],
      [
        "globalide",
        20,
        "b",
        "musk",
        100
      ],
      [
        "globanone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "isopropyl myristate",
        170,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-264",
    "te": "Pomegranate Accord",
    "tr": "Гранат Аккорд",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Гранат Аккорд». Ключевые материалы структуры: fruit specialty, gamma-undecalactone, DIPG, gamma-decalactone.",
    "pr": {
      "floral": 50,
      "gourmand": 44,
      "green": 2
    },
    "it": [
      [
        "2-isopropyl-4-methyl thiazole 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "3-decen-2-one 1%",
        6,
        "h",
        "floral",
        1
      ],
      [
        "raspberry ketone acetate",
        45,
        "h",
        "gourmand",
        100
      ],
      [
        "allyl heptanoate",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "alpha-ionone",
        5,
        "h",
        "floral",
        100
      ],
      [
        "beta-damascone 10%",
        15,
        "h",
        "gourmand",
        10
      ],
      [
        "cerezoate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        3,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        6,
        "t",
        "green",
        10
      ],
      [
        "cis-3-hexenyl isobutyrate 10%",
        3,
        "t",
        "green",
        10
      ],
      [
        "cis-3-hexenyl methyl carbonate 10%",
        2,
        "t",
        "green",
        10
      ],
      [
        "cis-6-nonenal 1%",
        2,
        "h",
        "floral",
        1
      ],
      [
        "cis-rose oxide 1%",
        2,
        "h",
        "floral",
        1
      ],
      [
        "cremefleur",
        1,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        142,
        "b",
        "aquatic",
        0
      ],
      [
        "fruitaleur",
        5,
        "h",
        "floral",
        100
      ],
      [
        "fruit specialty",
        354,
        "h",
        "floral",
        100
      ],
      [
        "gamma-decalactone",
        100,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-nonalactone",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "gamma-undecalactone",
        220,
        "h",
        "gourmand",
        100
      ],
      [
        "geranyl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "hexyl 2-methyl butyrate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "melonal 1%",
        3,
        "h",
        "aquatic",
        1
      ],
      [
        "methyl dihydrojasmonate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "trans-2-cis-6-nonadienol 10%",
        4,
        "h",
        "floral",
        10
      ],
      [
        "vartol",
        1,
        "h",
        "floral",
        100
      ],
      [
        "ethyl (E,Z)-2,4-decadienoate",
        2,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-265",
    "te": "Powdery floral",
    "tr": "Пудровый цветочный",
    "sd": "TGSC (dm1015272) · Patent 7,943,560",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,943,560 Cyclopropanated macrocyclic ketones and lactones.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Пудровый цветочный». Формула из патента 7,943,560. Ключевые материалы структуры: galaxolide 100%, hedione, linalool, linalyl acetate.",
    "pr": {
      "floral": 50,
      "green": 7,
      "citrus": 11,
      "musk": 13,
      "amber": 7,
      "spicy": 4,
      "aquatic": 1,
      "woody": 16
    },
    "it": [
      [
        "allyl amyl glycolate",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "benzyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        55,
        "t",
        "green",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        35,
        "t",
        "citrus",
        100
      ],
      [
        "cashmeran",
        4,
        "b",
        "musk",
        100
      ],
      [
        "cedrenyl acetate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        25,
        "b",
        "amber",
        100
      ],
      [
        "cyclogalbaniff",
        3,
        "h",
        "floral",
        100
      ],
      [
        "9-oxabicyclo(15.1.0)octadecan-8-one",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "delta-damascone",
        0.4,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl vanillin",
        1,
        "b",
        "amber",
        100
      ],
      [
        "eugenol",
        40,
        "h",
        "spicy",
        100
      ],
      [
        "galaxolide 100%",
        90,
        "b",
        "musk",
        100
      ],
      [
        "galbanum oil",
        0.1,
        "t",
        "green",
        100
      ],
      [
        "geraniol",
        13,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        80,
        "h",
        "floral",
        100
      ],
      [
        "helional",
        6,
        "h",
        "aquatic",
        100
      ],
      [
        "heliotropin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        13,
        "t",
        "green",
        100
      ],
      [
        "beta-ionone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        60,
        "b",
        "woody",
        100
      ],
      [
        "jasmin absolute egypt",
        5,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        40,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        80,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        65,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        40,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate",
        8,
        "h",
        "floral",
        100
      ],
      [
        "methyl ionone gamma supreme",
        55,
        "h",
        "floral",
        100
      ],
      [
        "muskalactone",
        25,
        "b",
        "musk",
        100
      ],
      [
        "olibanum resinoid dep 50",
        6,
        "b",
        "amber",
        100
      ],
      [
        "patchouli oil",
        35,
        "b",
        "woody",
        100
      ],
      [
        "sandalore",
        20,
        "b",
        "woody",
        100
      ],
      [
        "sanjinol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "styralyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "vanillin",
        13,
        "b",
        "amber",
        100
      ],
      [
        "veramoss",
        4,
        "b",
        "woody",
        100
      ],
      [
        "vertofix",
        25,
        "b",
        "woody",
        100
      ],
      [
        "ylang ylang oil",
        5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-266",
    "te": "Accord N° 207869 Powdery floral (Firmenich)",
    "tr": "Аккорд №207869 · пудровый цветочный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Antiperspirant roll-on: 0.30% ; Deo spray: 0.30% ; Detergent powder: 0.15% ; Heavy duty liquid: 0.30% ; Shampoo: 0.50% ; Soap: 1.00% ; Softner: 0.30% · The harmony of AMBROX DL with Florexr gives an interesting balsamic, amber, woody blend that is effective at the top of the perfume and right through to the dry out..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207869 · пудровый цветочный (Firmenich)». Ключевые материалы структуры: DIHYDROMYRCENOL, IRALIA® TOTAL (Firmenich), HEDIONE® (Firmenich), COUMARIN.",
    "pr": {
      "amber": 21,
      "citrus": 19,
      "floral": 50,
      "woody": 6,
      "gourmand": 1
    },
    "it": [
      [
        "COUMARIN",
        100,
        "b",
        "amber",
        100
      ],
      [
        "DIHYDROMYRCENOL",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "ETHYL VANILLIN 10%",
        50,
        "b",
        "amber",
        10
      ],
      [
        "EXOLIDE® (Firmenich) (use exolide replacer)",
        90,
        "h",
        "floral",
        100
      ],
      [
        "FLOREX® (Firmenich)",
        12,
        "h",
        "floral",
        100
      ],
      [
        "FLOROL® (Firmenich)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        125,
        "h",
        "floral",
        100
      ],
      [
        "HELIOTROPIN",
        25,
        "b",
        "amber",
        100
      ],
      [
        "IRALIA® TOTAL (Firmenich)",
        190,
        "h",
        "floral",
        100
      ],
      [
        "SANDALWOOD BASE 77125 B (Firmenich)",
        62,
        "b",
        "woody",
        100
      ],
      [
        "UNDECALACTONE GAMMA",
        6,
        "h",
        "gourmand",
        100
      ],
      [
        "AMBROX® DL (Firmenich) 10%",
        40,
        "b",
        "amber",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-267",
    "te": "Accord Number 1341 – Soft Powdery floral (IFF)",
    "tr": "Аккорд №1341 · Мягкий пудрово-цветочный (IFF)",
    "sd": "TGSC (dm1015272) · IFF",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring DIHYDRO MYRCENOL (IFF), ORANGE OIL CP, ETHYL LINALOOL, CIS-3 HEXENOL.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №1341 · Мягкий пудрово-цветочный (IFF)». Ключевые материалы структуры: METHYL DH JASMONATE, GALAXOLIDE® 50% (IFF), ETHYLENE BRASSYLATE (IFF), ETHYL LINALOOL.",
    "pr": {
      "floral": 50,
      "citrus": 5,
      "green": 6,
      "musk": 34,
      "amber": 1
    },
    "it": [
      [
        "DIHYDRO MYRCENOL (IFF)",
        6,
        "h",
        "floral",
        100
      ],
      [
        "ORANGE OIL CP",
        48,
        "t",
        "citrus",
        100
      ],
      [
        "ETHYL LINALOOL",
        60,
        "h",
        "floral",
        100
      ],
      [
        "CIS-3 HEXENOL",
        12,
        "t",
        "green",
        100
      ],
      [
        "HEXENYL SALICYLATE CIS 3- (IFF)",
        46,
        "t",
        "green",
        100
      ],
      [
        "VERTOLIFF (IFF)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLOL 950 (IFF)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLYL ACETATE",
        6,
        "h",
        "floral",
        100
      ],
      [
        "CYCLEMAX™ (IFF)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "FLEURAMONE (IFF) 10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "FLORALOZONE (IFF)",
        2,
        "h",
        "aquatic",
        100
      ],
      [
        "JASMONE CIS RB LRG-1219",
        4,
        "h",
        "floral",
        100
      ],
      [
        "METHYL DH JASMONATE",
        360,
        "h",
        "floral",
        100
      ],
      [
        "PHENOXY ETHYL ISO BUTYRATE (IFF)",
        6,
        "h",
        "floral",
        100
      ],
      [
        "PHENYL ETHYL ALCOHOL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "ROSE ABS DAMASCENA PURE (IFF) 10%",
        6,
        "h",
        "floral",
        10
      ],
      [
        "STYRALYL ACETATE",
        2,
        "h",
        "floral",
        100
      ],
      [
        "DECALACTONE, DELTA",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "DECALACTONE,GAMMA",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "NECTARATE™ (IFF)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "AMBRETTOLIDE (IFF)",
        10,
        "b",
        "musk",
        100
      ],
      [
        "ETHYLENE BRASSYLATE (IFF)",
        62,
        "b",
        "musk",
        100
      ],
      [
        "GALAXOLIDE® 50% (IFF)",
        280,
        "b",
        "musk",
        50
      ],
      [
        "AMBROXAN",
        6,
        "b",
        "amber",
        100
      ],
      [
        "HERBANATE (Givaudan)",
        6,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-268",
    "te": "Accord N° 203688 Powdery floral citrus (Firmenich)",
    "tr": "Аккорд №203688 · пудровый цветочный цитрусовый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "citrus",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% · EXALTOLIDE TOTAL boosts the blooming flowery aspect of this bergamote based accord. In contrast, when EXALTOLIDE TOTAL is replaced with EXALTOLIDE, the powdery side of the accord dominates leaving the flowery bergamote note in the background..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №203688 · пудровый цветочный цитрусовый (Firmenich)». Ключевые материалы структуры: HEDIONE® (Firmenich), ETHYLENE BRASSYLATE, EXALTOLIDE® TOTAL (Firmenich), BERGAMOTE SYNTH.",
    "pr": {
      "citrus": 11,
      "gourmand": 11,
      "musk": 34,
      "floral": 50,
      "woody": 7
    },
    "it": [
      [
        "BERGAMOTE SYNTH",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "CASSIS BASE 345 B (Firmenich)",
        100,
        "h",
        "gourmand",
        100
      ],
      [
        "ETHYLENE BRASSYLATE",
        150,
        "b",
        "musk",
        100
      ],
      [
        "EXALTENONE (Firmenich) 10%",
        50,
        "h",
        "floral",
        10
      ],
      [
        "HEDIONE® (Firmenich)",
        320,
        "h",
        "floral",
        100
      ],
      [
        "METHYL PAMPLEMOUSSE (Givaudan) 10%",
        50,
        "h",
        "floral",
        10
      ],
      [
        "SANDALWOOD BASE 77125 B (Firmenich) 50%",
        60,
        "b",
        "woody",
        50
      ],
      [
        "WARDIA® BM SA (Firmenich)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "EXALTOLIDE® TOTAL (Firmenich)",
        150,
        "b",
        "musk",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-269",
    "te": "quince type",
    "tr": "Айва (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring amyl acetate 10%, ethyl acetate 10%, hexyl acetate 10%, benzyl acetate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Айва (тип)». Ключевые материалы структуры: farnesene, ethyl octanoate, ethyl hexanoate, ethyl decanoate.",
    "pr": {
      "floral": 50,
      "green": 1,
      "gourmand": 3
    },
    "it": [
      [
        "amyl acetate 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "ethyl acetate 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "hexyl acetate 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "benzyl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        20,
        "t",
        "green",
        10
      ],
      [
        "amyl alcohol 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "ethyl hexanoate",
        45,
        "h",
        "floral",
        100
      ],
      [
        "ethyl decanoate",
        35,
        "h",
        "floral",
        100
      ],
      [
        "davana oil",
        7.5,
        "h",
        "floral",
        100
      ],
      [
        "farnesene",
        640,
        "h",
        "floral",
        100
      ],
      [
        "gamma-hexalactone 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "ethyl isobutyrate 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "hedione",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ethyl laurate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "ethyl 2-methyl butyrate 10%",
        12.5,
        "h",
        "gourmand",
        10
      ],
      [
        "gamma-octalactone 1%",
        20,
        "h",
        "gourmand",
        1
      ],
      [
        "ethyl octanoate",
        85,
        "h",
        "floral",
        100
      ],
      [
        "ethyl heptanoate",
        2.5,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl nonanoate 10%",
        15,
        "h",
        "floral",
        10
      ],
      [
        "beta-ionone",
        5,
        "h",
        "floral",
        100
      ],
      [
        "raspberry dicarboxylate",
        12.5,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-270",
    "te": "rice type",
    "tr": "Рис (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "musk",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzaldehyde, aldehyde C-6 10%, cuminaldehyde, caraway seed oil.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Рис (тип)». Ключевые материалы структуры: helvetolide, ethyl maltol 1%, coumarin, coranol.",
    "pr": {
      "citrus": 13,
      "floral": 37,
      "amber": 27,
      "gourmand": 41,
      "musk": 50
    },
    "it": [
      [
        "benzaldehyde",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "aldehyde C-6 10%",
        15,
        "t",
        "citrus",
        10
      ],
      [
        "cuminaldehyde",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "caraway seed oil",
        15,
        "h",
        "floral",
        100
      ],
      [
        "beta-caryophyllene",
        15,
        "h",
        "floral",
        100
      ],
      [
        "coranol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        150,
        "b",
        "amber",
        100
      ],
      [
        "ethyl maltol 1%",
        170,
        "h",
        "gourmand",
        1
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "helvetolide",
        200,
        "b",
        "musk",
        100
      ],
      [
        "koumalactone 10% TEC",
        50,
        "h",
        "gourmand",
        10
      ],
      [
        "methyl heptenone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "methyl amyl ketone 10%",
        25,
        "h",
        "floral",
        10
      ],
      [
        "muscenone delta",
        25,
        "b",
        "musk",
        100
      ],
      [
        "gamma-nonalactone",
        25,
        "h",
        "gourmand",
        100
      ],
      [
        "romandolide",
        75,
        "b",
        "musk",
        100
      ],
      [
        "vanillin 10%",
        10,
        "b",
        "amber",
        10
      ],
      [
        "1-hydroxy-2-butanone 1%",
        5,
        "h",
        "floral",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-271",
    "te": "AP Roll-on UR1007 /2 (Givaudan)",
    "tr": "Роликовый антиперспирант UR1007 /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: For Roll-On at 1%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Роликовый антиперспирант UR1007 /2 (Givaudan)». Ключевые материалы структуры: DIPROPYLENE GLYCOL, DIHYDRO MYRCENOL, P T BUTYL CYCLOHEXYL ACETATE, BASE HERBAL UR.",
    "pr": {
      "floral": 50,
      "green": 9,
      "woody": 2,
      "aquatic": 1,
      "citrus": 4
    },
    "it": [
      [
        "DAMASCONE ALPHA",
        0.5,
        "h",
        "gourmand",
        100
      ],
      [
        "SAFRALEINE (Givaudan)",
        0.5,
        "h",
        "floral",
        100
      ],
      [
        "FLORHYDRAL (Givaudan)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "TRIPLAL (IFF)",
        1,
        "t",
        "green",
        100
      ],
      [
        "HERBOXANE (Givaudan)",
        2,
        "t",
        "green",
        100
      ],
      [
        "JASMATONE (Givaudan)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "TAGETE OIL",
        2,
        "h",
        "floral",
        100
      ],
      [
        "AMBROFIX (Givaudan) @10%",
        3,
        "h",
        "floral",
        10
      ],
      [
        "JAVANOL (Givaudan) @10%",
        3,
        "b",
        "woody",
        10
      ],
      [
        "COSMONE (Givaudan)",
        4,
        "h",
        "floral",
        100
      ],
      [
        "DIMETOL (Givaudan)",
        4,
        "h",
        "floral",
        100
      ],
      [
        "SAGE OFFICINALIS OIL",
        4,
        "t",
        "green",
        100
      ],
      [
        "PHARAONE 10%/DPG (Givaudan)",
        5,
        "h",
        "floral",
        10
      ],
      [
        "SPIROGALBANONE PURE (Givaudan) @10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "GERANIUM GIVCO 222 (Givaudan)",
        6,
        "h",
        "floral",
        100
      ],
      [
        "LAVANDIN GROSSO OIL FRANCE",
        6,
        "t",
        "green",
        100
      ],
      [
        "OAKMOSS GIVCO 214 (Givaudan)",
        6,
        "b",
        "woody",
        100
      ],
      [
        "ROSEMARY OIL NORTH AFRICA",
        10,
        "t",
        "green",
        100
      ],
      [
        "HELIONAL (IFF)",
        10,
        "h",
        "aquatic",
        100
      ],
      [
        "CEDAR WOOD OIL VIRGINIA",
        15,
        "b",
        "woody",
        100
      ],
      [
        "ISORALDEINE 70 (Givaudan)",
        15,
        "h",
        "floral",
        100
      ],
      [
        "CLARY SAGE OIL",
        30,
        "t",
        "green",
        100
      ],
      [
        "ETHYL LINALOOL (Givaudan)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "LINALYL ACETATE",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "METHYL CEDRYL KETONE",
        60,
        "h",
        "floral",
        100
      ],
      [
        "BASE HERBAL UR",
        80,
        "t",
        "green",
        100
      ],
      [
        "P T BUTYL CYCLOHEXYL ACETATE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDRO MYRCENOL",
        150,
        "h",
        "floral",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "DIPROPYLENE GLYCOL",
        320,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-272",
    "te": "Purple Rose Accord",
    "tr": "Аккорд пурпурной розы",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд пурпурной розы». Ключевые материалы структуры: phenethyl alcohol, geraniol, citronellol, aldehyde C-11 undecylenic 10%.",
    "pr": {
      "floral": 50,
      "spicy": 2,
      "citrus": 8,
      "amber": 2,
      "woody": 1,
      "green": 2
    },
    "it": [
      [
        "benzyl acetate",
        17.5,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl acetate",
        25,
        "h",
        "floral",
        100
      ],
      [
        "cinnamic alcohol",
        20,
        "h",
        "spicy",
        100
      ],
      [
        "benzaldehyde 10%",
        10,
        "t",
        "citrus",
        10
      ],
      [
        "bois de rose oil",
        5,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        105,
        "h",
        "floral",
        100
      ],
      [
        "isocyclocitral",
        12.5,
        "t",
        "citrus",
        100
      ],
      [
        "lilial",
        5,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        300,
        "h",
        "floral",
        100
      ],
      [
        "rosinol",
        15,
        "h",
        "floral",
        100
      ],
      [
        "beta-ionone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "rosacene",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil",
        12.5,
        "t",
        "citrus",
        100
      ],
      [
        "styrax oil 10%",
        25,
        "b",
        "amber",
        10
      ],
      [
        "dimethyl benzyl carbinyl formate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "guaiyl acetate",
        12.5,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        5,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-11 undecylenic 10%",
        75,
        "t",
        "citrus",
        10
      ],
      [
        "dimethyl benzyl carbinyl butyrate 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "cyclamen aldehyde",
        2.5,
        "t",
        "citrus",
        100
      ],
      [
        "DIPG",
        67.5,
        "b",
        "aquatic",
        0
      ],
      [
        "eugenol",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "geraniol",
        110,
        "h",
        "floral",
        100
      ],
      [
        "cedarwood oil virginia",
        20,
        "b",
        "woody",
        100
      ],
      [
        "indole 1%",
        10,
        "h",
        "floral",
        1
      ],
      [
        "rose oxide 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "phenethyl phenyl acetate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "methyl phenyl acetate",
        2.5,
        "h",
        "floral",
        100
      ],
      [
        "amyl propionate 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "triplal 10%",
        25,
        "t",
        "green",
        10
      ],
      [
        "9-decenal 10%",
        25,
        "h",
        "floral",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-273",
    "te": "Accord N° 207626 Rose jasmin (Firmenich)",
    "tr": "Аккорд №207626 · роза жасмин (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "floral",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Alcoholic solution: 5.00% ; Cream: 0.20% ; Detergent powder: 0.10% ; Shampoo: 0.50% ; Soap: 1.00% · JACINTHEME 135 SA is very effective in naturalizing the harshness and fatty note of Geranyl Nitrile. This accord has a pleasant floral note useful in many product areas and in which the JACINTHEME 135 SA adds a non-aggressive green note..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №207626 · роза жасмин (Firmenich)». Ключевые материалы структуры: ROSE BASE, HEXYL SALICYLATE, JASMIN SYNTH, HEDIONE® (Firmenich).",
    "pr": {
      "floral": 50,
      "green": 13
    },
    "it": [
      [
        "BENZYL ACETATE",
        40,
        "h",
        "floral",
        100
      ],
      [
        "GERANYL NITRILE (links to potential substitute)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        200,
        "t",
        "green",
        100
      ],
      [
        "IONONE ALPHA",
        40,
        "h",
        "floral",
        100
      ],
      [
        "JASMIN SYNTH",
        160,
        "h",
        "floral",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "ROSE BASE",
        420,
        "h",
        "floral",
        100
      ],
      [
        "JACINTHEME 135 SA (Firmenich)",
        20,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-274",
    "te": "Sage perfume complex",
    "tr": "Парфюмерный комплекс шалфея",
    "sd": "TGSC (dm1015272) · Patent 4,426,321",
    "fa": "floral",
    "kd": "perfume",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,426,321 Odorant alkadienyl ketones, alcohols and oximes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Парфюмерный комплекс шалфея». Формула из патента 4,426,321. Ключевые материалы структуры: DIPG, 2,2,8-trimethyl-7-nonen-3-ol, methyl dihydrojasmonate, bergamot oil bergaptene reduced.",
    "pr": {
      "floral": 50,
      "citrus": 10,
      "gourmand": 4
    },
    "it": [
      [
        "2,2,8-trimethyl-7-nonen-3-ol",
        222.22,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        111.11,
        "t",
        "citrus",
        100
      ],
      [
        "madrox",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "hyssop oil",
        88.89,
        "h",
        "floral",
        100
      ],
      [
        "allyl alpha-ionone",
        33.33,
        "h",
        "gourmand",
        100
      ],
      [
        "corps cassis",
        5.56,
        "h",
        "gourmand",
        100
      ],
      [
        "fixateur 505",
        5.56,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        311.11,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-275",
    "te": "shampoo composition",
    "tr": "Шампунь композиция",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring allyl amyl glycolate, allyl heptanoate, benzyl acetate, damascenone.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Шампунь композиция». Ключевые материалы структуры: methyl dihydrojasmonate, galaxolide 50 BB, lemon oil, lilial.",
    "pr": {
      "gourmand": 6,
      "floral": 50,
      "citrus": 27,
      "musk": 11,
      "green": 11
    },
    "it": [
      [
        "allyl amyl glycolate",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "allyl heptanoate",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "benzyl acetate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "damascenone",
        1,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        6,
        "h",
        "gourmand",
        100
      ],
      [
        "galaxolide 50 BB",
        100,
        "b",
        "musk",
        50
      ],
      [
        "geraniol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        200,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        4,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        20,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenol",
        4,
        "t",
        "green",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        80,
        "t",
        "citrus",
        100
      ],
      [
        "beta-ionone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "lilial",
        100,
        "h",
        "floral",
        100
      ],
      [
        "orbitone",
        60,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "undecavertol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "green acetate",
        80,
        "t",
        "green",
        100
      ],
      [
        "dihydromyrcenyl acetate",
        5,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-276",
    "te": "Shampoo HR1009 /2 (Givaudan)",
    "tr": "Шампунь HR1009 /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: For Shampoo at 0.50%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Шампунь HR1009 /2 (Givaudan)». Ключевые материалы структуры: DIPROPYLENE GLYCOL, HEDIONE (Firmenich), LINALYL ACETATE, TERPENYL ACETATE.",
    "pr": {
      "citrus": 11,
      "gourmand": 1,
      "floral": 50
    },
    "it": [
      [
        "LEMONILE (Givaudan)",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "MANZANATE (Givaudan)",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "HOMOFURONOL 20%/TEC (Givaudan)",
        2,
        "h",
        "gourmand",
        20
      ],
      [
        "PHARAONE 10%/DPG (Givaudan)",
        2,
        "h",
        "floral",
        10
      ],
      [
        "ACETOIN",
        3,
        "h",
        "floral",
        100
      ],
      [
        "COSMONE (Givaudan)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "METHYL LAITONE 10%/TEC (Givaudan)",
        4,
        "h",
        "floral",
        10
      ],
      [
        "AMBRETTOLIDE (Givaudan)",
        5,
        "b",
        "musk",
        100
      ],
      [
        "PETITGRAIN OIL PARAGUAY",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "DIMETHYL OCTENONE (Givaudan)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "FRUCTONE (IFF)",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "CITRAL LEMAROME N (Givaudan)",
        15,
        "t",
        "citrus",
        100
      ],
      [
        "DIMETOL (Givaudan)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "METHYL PAMPLEMOUSSE (Givaudan)",
        20,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDRO MYRCENOL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "TERPINEOL PURE",
        40,
        "h",
        "floral",
        100
      ],
      [
        "TERPENYL ACETATE",
        100,
        "h",
        "floral",
        100
      ],
      [
        "LINALOOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "LINALYL ACETATE",
        150,
        "t",
        "citrus",
        100
      ],
      [
        "HEDIONE (Firmenich)",
        210,
        "h",
        "floral",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "DIPROPYLENE GLYCOL",
        254,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-277",
    "te": "shampoo type",
    "tr": "Шампунь (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring aldehyde C-11 undecylenic 10%, phenethyl 2-methyl butyrate, benzyl acetate, citronellol.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Шампунь (тип)». Ключевые материалы структуры: hexyl salicylate, linalool, hedione, indole 1%.",
    "pr": {
      "citrus": 5,
      "gourmand": 3,
      "floral": 50,
      "green": 20
    },
    "it": [
      [
        "aldehyde C-11 undecylenic 10%",
        2,
        "t",
        "citrus",
        10
      ],
      [
        "phenethyl 2-methyl butyrate",
        30,
        "h",
        "gourmand",
        100
      ],
      [
        "benzyl acetate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        60,
        "h",
        "floral",
        100
      ],
      [
        "damascenone",
        2,
        "h",
        "floral",
        100
      ],
      [
        "gardenol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        120,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        4,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        4,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl cis-3-hexenoate",
        8,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl 2-methyl butyrate",
        8,
        "t",
        "green",
        100
      ],
      [
        "hexyl acetate",
        40,
        "h",
        "floral",
        100
      ],
      [
        "hexyl salicylate",
        180,
        "t",
        "green",
        100
      ],
      [
        "indole 1%",
        70,
        "h",
        "floral",
        1
      ],
      [
        "beta-ionone",
        60,
        "h",
        "floral",
        100
      ],
      [
        "cis-jasmone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "linalool oxide",
        10,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        160,
        "h",
        "floral",
        100
      ],
      [
        "methyl anthranilate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "methyl salicylate 10%",
        4,
        "t",
        "green",
        10
      ],
      [
        "rose oxide 10%",
        8,
        "h",
        "floral",
        10
      ],
      [
        "cis-3-hexenyl salicylate",
        30,
        "t",
        "green",
        100
      ],
      [
        "DIPG",
        70,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-278",
    "te": "shower gel formulation (#278)",
    "tr": "Гель для душа формула (#278)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring maltol 10%, triplal, bergamal, black currant bud absolute 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Гель для душа формула (#278)». Ключевые материалы структуры: cassis cyclohexene, hedione, cyclogalbaniff, raspberry ketone methyl ether.",
    "pr": {
      "gourmand": 50,
      "green": 1,
      "floral": 30
    },
    "it": [
      [
        "maltol 10%",
        5.36,
        "h",
        "gourmand",
        10
      ],
      [
        "triplal",
        5.36,
        "t",
        "green",
        100
      ],
      [
        "bergamal",
        5.36,
        "h",
        "floral",
        100
      ],
      [
        "black currant bud absolute 10%",
        10.73,
        "h",
        "floral",
        10
      ],
      [
        "cassis cyclohexene",
        550.43,
        "h",
        "gourmand",
        100
      ],
      [
        "cis-galbanum oxathiane 10%",
        6.44,
        "t",
        "green",
        10
      ],
      [
        "damascenone",
        5.36,
        "h",
        "floral",
        100
      ],
      [
        "cyclogalbaniff",
        64.38,
        "h",
        "floral",
        100
      ],
      [
        "ethyl butyrate",
        2.68,
        "h",
        "gourmand",
        100
      ],
      [
        "ethyl caproate",
        2.68,
        "h",
        "gourmand",
        100
      ],
      [
        "hedione",
        160.94,
        "h",
        "floral",
        100
      ],
      [
        "isoamyl butyrate",
        3.22,
        "h",
        "floral",
        100
      ],
      [
        "buchu mercaptan 1%",
        5.36,
        "h",
        "gourmand",
        1
      ],
      [
        "laevo-menthyl acetate",
        21.46,
        "h",
        "floral",
        100
      ],
      [
        "raspberry ketone methyl ether",
        53.65,
        "h",
        "gourmand",
        100
      ],
      [
        "phenoxanol",
        53.65,
        "h",
        "floral",
        100
      ],
      [
        "alpha-pinene",
        5.36,
        "h",
        "floral",
        100
      ],
      [
        "beta-pinene",
        26.82,
        "h",
        "floral",
        100
      ],
      [
        "styralyl acetate",
        10.73,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-279",
    "te": "shower gel formulation (#279)",
    "tr": "Гель для душа формула (#279)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring triplal, allyl amyl glycolate, ambroxan, benzyl acetate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Гель для душа формула (#279)». Ключевые материалы структуры: dihydromyrcenol, linalyl acetate, linalool, hedione.",
    "pr": {
      "green": 2,
      "gourmand": 3,
      "floral": 45,
      "citrus": 50
    },
    "it": [
      [
        "triplal",
        2,
        "t",
        "green",
        100
      ],
      [
        "allyl amyl glycolate",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "ambroxan",
        1,
        "b",
        "amber",
        100
      ],
      [
        "benzyl acetate",
        6,
        "h",
        "floral",
        100
      ],
      [
        "cyclogalbaniff",
        6,
        "h",
        "floral",
        100
      ],
      [
        "delta-damascone",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        300,
        "t",
        "citrus",
        100
      ],
      [
        "geranium oil",
        2,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        70,
        "h",
        "floral",
        100
      ],
      [
        "koavone",
        60,
        "h",
        "floral",
        100
      ],
      [
        "lavandin oil",
        5,
        "t",
        "green",
        100
      ],
      [
        "linalool",
        140,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        175,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        60,
        "h",
        "floral",
        100
      ],
      [
        "laevo-menthol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "oranger crystals",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "methyl anthranilate",
        18,
        "h",
        "floral",
        100
      ],
      [
        "methyl octine carbonate 1%",
        12,
        "t",
        "green",
        1
      ],
      [
        "phenethyl alcohol",
        15,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpineol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "precyclemone B",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "styralyl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "alpha-terpinyl acetate",
        15,
        "h",
        "floral",
        100
      ],
      [
        "veramoss",
        3,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-280",
    "te": "Shower gel fragrance",
    "tr": "Гель для душа аромат",
    "sd": "TGSC (dm1015272) · Patent 8,703,692",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,703,692 7-(alk-1'enyl)-2H-benzo[B][1,4]dioxepin-3(4H)-ones and their use in fragrance applications.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Гель для душа аромат». Формула из патента 8,703,692. Ключевые материалы структуры: benzyl salicylate, mefrosol, ethyl linalool, hedione.",
    "pr": {
      "green": 15,
      "musk": 8,
      "floral": 50,
      "gourmand": 1
    },
    "it": [
      [
        "benzyl salicylate",
        200,
        "t",
        "green",
        100
      ],
      [
        "cashmeran",
        5,
        "b",
        "musk",
        100
      ],
      [
        "citronellol",
        60,
        "h",
        "floral",
        100
      ],
      [
        "cristalone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ethyl linalool",
        120,
        "h",
        "floral",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "freskomenthe",
        30,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        120,
        "h",
        "floral",
        100
      ],
      [
        "hexyl acetate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide",
        100,
        "b",
        "musk",
        100
      ],
      [
        "maltyl isobutyrate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "isoraldeine",
        30,
        "h",
        "floral",
        100
      ],
      [
        "lemonile",
        4,
        "t",
        "citrus",
        100
      ],
      [
        "manzanate",
        6,
        "h",
        "gourmand",
        100
      ],
      [
        "mefrosol",
        180,
        "h",
        "floral",
        100
      ],
      [
        "neocaspirene",
        6,
        "h",
        "floral",
        100
      ],
      [
        "petalia",
        70,
        "h",
        "floral",
        100
      ],
      [
        "pharaone 10%/DPG",
        6,
        "h",
        "floral",
        10
      ],
      [
        "radjanol",
        15,
        "h",
        "floral",
        100
      ],
      [
        "rose oxide",
        3,
        "h",
        "floral",
        100
      ],
      [
        "zinarine",
        1,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-281",
    "te": "Shower gel GG1003 /2 (Givaudan)",
    "tr": "Гель для душа GG1003 /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: For Shower Gel at 1%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Гель для душа GG1003 /2 (Givaudan)». Ключевые материалы структуры: ORANGE OIL FLORIDA, DIPROPYLENE GLYCOL, LINALYL ACETATE, DIHYDRO MYRCENOL.",
    "pr": {
      "floral": 50,
      "woody": 1,
      "green": 3,
      "citrus": 25
    },
    "it": [
      [
        "COSMONE (Givaudan)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "ISOPROPYL METHYL-2-BUTYRATE (Givaudan)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "FLORHYDRAL (Givaudan)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "PHARAONE 10%/DPG (Givaudan)",
        3,
        "h",
        "floral",
        10
      ],
      [
        "EUGENOL PURE",
        4,
        "h",
        "spicy",
        100
      ],
      [
        "MELONAL (Givaudan) @10%",
        4,
        "h",
        "aquatic",
        10
      ],
      [
        "FLORANGIA (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL ACETATE",
        5,
        "h",
        "floral",
        100
      ],
      [
        "NECTARYL (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "OKOUMAL (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "HELIOTROPINE",
        6,
        "b",
        "amber",
        100
      ],
      [
        "JAVANOL (Givaudan) @10%",
        6,
        "b",
        "woody",
        10
      ],
      [
        "PATCHOULI OIL IRONFREE",
        8,
        "b",
        "woody",
        100
      ],
      [
        "BENZYL ACETATE",
        30,
        "h",
        "floral",
        100
      ],
      [
        "GERANYL ACETATE",
        30,
        "h",
        "floral",
        100
      ],
      [
        "PHENYL ETHYL ALCOHOL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDRO IONONE BETA (Givaudan)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "FLOROSA (Givaudan)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE (Givaudan)",
        40,
        "t",
        "green",
        100
      ],
      [
        "LINALOOL",
        50,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE (Firmenich)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "LINALYL ACETATE",
        90,
        "t",
        "citrus",
        100
      ],
      [
        "DIHYDRO MYRCENOL",
        90,
        "h",
        "floral",
        100
      ],
      [
        "ORANGE OIL FLORIDA",
        220,
        "t",
        "citrus",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "DIPROPYLENE GLYCOL",
        200,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-282",
    "te": "Shower gel GM1006 /2 (Givaudan)",
    "tr": "Гель для душа GM1006 /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: For Shower Gel at 1%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Гель для душа GM1006 /2 (Givaudan)». Ключевые материалы структуры: DIPROPYLENE GLYCOL, HEDIONE (Firmenich), LINALOOL, ETHYLENE BRASSYLATE.",
    "pr": {
      "aquatic": 1,
      "floral": 50,
      "woody": 1,
      "green": 1,
      "citrus": 2,
      "gourmand": 3,
      "musk": 4
    },
    "it": [
      [
        "CALONE",
        0.5,
        "h",
        "aquatic",
        100
      ],
      [
        "DAMASCENONE",
        0.5,
        "h",
        "floral",
        100
      ],
      [
        "EVERNYL",
        0.5,
        "b",
        "woody",
        100
      ],
      [
        "ETHYL METHYL-2-BUTYRATE (Givaudan)",
        0.5,
        "h",
        "floral",
        100
      ],
      [
        "LIFFAROME (IFF)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "METHYL LAITONE 10%/TEC (Givaudan)",
        1,
        "h",
        "floral",
        10
      ],
      [
        "HEXENYL-3-CIS ACETATE",
        1,
        "t",
        "green",
        100
      ],
      [
        "ALDEHYDE C 10 DECYLIC @10%",
        1,
        "t",
        "citrus",
        10
      ],
      [
        "AMBROFIX (Givaudan)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCONE ALPHA",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "ADOXAL (Givaudan)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "ETHYL BUTYRATE @10%",
        2,
        "h",
        "gourmand",
        10
      ],
      [
        "ALLYL CYCLOHEXYL PROPIONATE",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "HEXENOL-3-CIS",
        2,
        "t",
        "green",
        100
      ],
      [
        "MANZANATE (Givaudan) @10%",
        2,
        "h",
        "gourmand",
        10
      ],
      [
        "RASPBERRY KETONE",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "ROSE OXIDE @10%",
        2,
        "h",
        "floral",
        10
      ],
      [
        "FLORHYDRAL (Givaudan)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "COSMONE (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "DEWFRUIT TEC AB2927R (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "FRUCTONE (IFF)",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "IONONE BETA (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "ALLYL OENANTHATE",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "UNDECAVERTOL (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "BENZYL ACETATE",
        10,
        "h",
        "floral",
        100
      ],
      [
        "AMBRETTOLIDE (Givaudan)",
        10,
        "b",
        "musk",
        100
      ],
      [
        "CITRONELLOL",
        10,
        "h",
        "floral",
        100
      ],
      [
        "HEXENYL-3-CIS SALICYLATE",
        10,
        "t",
        "green",
        100
      ],
      [
        "HELIONAL (IFF)",
        10,
        "h",
        "aquatic",
        100
      ],
      [
        "SANDALORE (Givaudan)",
        20,
        "b",
        "woody",
        100
      ],
      [
        "VERDOX (IFF)",
        25,
        "h",
        "gourmand",
        100
      ],
      [
        "LEMON OIL ITALY",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "DIHYDRO MYRCENOL",
        25,
        "h",
        "floral",
        100
      ],
      [
        "ETHYL LINALOOL (Givaudan)",
        25,
        "h",
        "floral",
        100
      ],
      [
        "FLOROSA (Givaudan)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "ETHYLENE BRASSYLATE",
        50,
        "b",
        "musk",
        100
      ],
      [
        "LINALOOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE (Firmenich)",
        250,
        "h",
        "floral",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "DIPROPYLENE GLYCOL",
        325,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-283",
    "te": "Shower gel with a woody floral character",
    "tr": "Гель для душа с древесно-цветочным характером",
    "sd": "TGSC (dm1015272) · Patent 7,691,802",
    "fa": "woody",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,691,802 Alcohols and ketones of b1- and tricyclic compounds and odorant compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Гель для душа с древесно-цветочным характером». Формула из патента 7,691,802. Ключевые материалы структуры: galaxolide 50 BB, alpha-amyl cinnamaldehyde, hedione, orange oil terpenes.",
    "pr": {
      "floral": 35,
      "citrus": 32,
      "musk": 50,
      "woody": 4,
      "amber": 1
    },
    "it": [
      [
        "cedryl acetate",
        5,
        "h",
        "floral",
        100
      ],
      [
        "citronellyl acetate",
        2,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "agrumex HC",
        20,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "alpha-amyl cinnamaldehyde",
        140,
        "t",
        "citrus",
        100
      ],
      [
        "ambrettolide",
        5,
        "b",
        "musk",
        100
      ],
      [
        "ambrofix",
        4,
        "h",
        "floral",
        100
      ],
      [
        "cedarwood oil virginia",
        20,
        "b",
        "woody",
        100
      ],
      [
        "guaiacwood oil",
        10,
        "b",
        "woody",
        100
      ],
      [
        "damascenone 10%",
        6,
        "h",
        "floral",
        10
      ],
      [
        "DIPG",
        50,
        "b",
        "aquatic",
        0
      ],
      [
        "eucalyptus oil",
        24,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 BB",
        381,
        "b",
        "musk",
        50
      ],
      [
        "hedione",
        80,
        "h",
        "floral",
        100
      ],
      [
        "javanol",
        2,
        "b",
        "woody",
        100
      ],
      [
        "linalool",
        20,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "moxalone",
        40,
        "h",
        "floral",
        100
      ],
      [
        "raspberry ketone",
        1,
        "h",
        "gourmand",
        100
      ],
      [
        "okoumal",
        5,
        "h",
        "floral",
        100
      ],
      [
        "orange oil terpenes",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "rose absolute turkey",
        2,
        "h",
        "floral",
        100
      ],
      [
        "rose absolute bulgaria",
        10,
        "h",
        "floral",
        100
      ],
      [
        "rose oxide 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "super muguet",
        10,
        "h",
        "floral",
        100
      ],
      [
        "vanillin 10%",
        8,
        "b",
        "amber",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-284",
    "te": "Skincare cream CM1006 /2 (Givaudan)",
    "tr": "Крем для ухода за кожей CM1006 /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: For Skincare Cream at 0.30%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Крем для ухода за кожей CM1006 /2 (Givaudan)». Ключевые материалы структуры: ETHYLENE BRASSYLATE, DIPROPYLENE GLYCOL, LINALYL ACETATE, LINALOOL.",
    "pr": {
      "gourmand": 12,
      "floral": 50,
      "citrus": 18,
      "musk": 20
    },
    "it": [
      [
        "HOMOFURONOL 20%/TEC @10% (Givaudan)",
        1,
        "h",
        "gourmand",
        20
      ],
      [
        "ACETOIN",
        2,
        "h",
        "floral",
        100
      ],
      [
        "ISOBUTAVAN (Givaudan)",
        2,
        "h",
        "floral",
        100
      ],
      [
        "ETHYL BENZOATE @10%",
        3,
        "h",
        "floral",
        10
      ],
      [
        "BUCHU LEAF OIL SOUTH AFRICA",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "PATCHOULI OIL IRONFREE",
        3,
        "b",
        "woody",
        100
      ],
      [
        "SAFRALEINE (Givaudan)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "ACETOPHENONE",
        5,
        "h",
        "floral",
        100
      ],
      [
        "ETHYL BUTYRATE",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "COSMONE (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "DAMASCENONE",
        5,
        "h",
        "floral",
        100
      ],
      [
        "GERANIUM OIL EGYPT",
        5,
        "h",
        "floral",
        100
      ],
      [
        "BENZALDEHYDE",
        8,
        "t",
        "citrus",
        100
      ],
      [
        "CITRONELLOL",
        10,
        "h",
        "floral",
        100
      ],
      [
        "DEWFRUIT TEC AB2927R (Givaudan)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "RASPBERRY KETONE",
        10,
        "h",
        "gourmand",
        100
      ],
      [
        "DAMASCONE ALPHA",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "ETHYL MALTOL",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "BUTYL ACETATE",
        25,
        "h",
        "floral",
        100
      ],
      [
        "NECTARYL (Givaudan)",
        25,
        "h",
        "floral",
        100
      ],
      [
        "METHYL LAITONE 10%/TEC (Givaudan)",
        40,
        "h",
        "floral",
        10
      ],
      [
        "HEDIONE (Firmenich)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "STRAWBERRY PURE (Givaudan)",
        60,
        "h",
        "gourmand",
        100
      ],
      [
        "IONONE BETA (Givaudan)",
        60,
        "h",
        "floral",
        100
      ],
      [
        "LEMON OIL DISTILLED",
        70,
        "t",
        "citrus",
        100
      ],
      [
        "LINALYL ACETATE",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "LINALOOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "ETHYLENE BRASSYLATE",
        200,
        "b",
        "musk",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        10,
        "h",
        "floral",
        100
      ],
      [
        "DIPROPYLENE GLYCOL",
        140,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-285",
    "te": "spicy fruity green woody note",
    "tr": "Пряный фруктовый зелёный древесный нота",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "spicy",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring acalea, acetaldehyde dimethyl acetal, decanal, allyl amyl glycolate 1%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Пряный фруктовый зелёный древесный нота». Ключевые материалы структуры: aphermate, galaxolide 50 IPM, floriffol, ethylene brassylate.",
    "pr": {
      "floral": 50,
      "citrus": 9,
      "gourmand": 15,
      "musk": 22,
      "amber": 1,
      "woody": 4
    },
    "it": [
      [
        "acalea",
        50,
        "h",
        "floral",
        100
      ],
      [
        "acetaldehyde dimethyl acetal",
        1.2,
        "t",
        "citrus",
        100
      ],
      [
        "decanal",
        4.4,
        "h",
        "floral",
        100
      ],
      [
        "allyl amyl glycolate 1%",
        8.8,
        "h",
        "gourmand",
        1
      ],
      [
        "allyl cyclohexyl propionate",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "allyl heptanoate",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "applelide",
        50,
        "b",
        "musk",
        100
      ],
      [
        "benzyl acetate",
        4.4,
        "h",
        "floral",
        100
      ],
      [
        "bornafix",
        4.4,
        "h",
        "floral",
        100
      ],
      [
        "cashmeran",
        2,
        "b",
        "musk",
        100
      ],
      [
        "coumarin",
        1.8,
        "b",
        "amber",
        100
      ],
      [
        "aphermate",
        99.4,
        "h",
        "floral",
        100
      ],
      [
        "cyclobutanate",
        1.8,
        "h",
        "floral",
        100
      ],
      [
        "alpha-damascone",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydromyrcenol",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "rose carboxylate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "ethyl vanillin",
        0.9,
        "b",
        "amber",
        100
      ],
      [
        "ethyl 2-methyl butyrate",
        35,
        "h",
        "gourmand",
        100
      ],
      [
        "fleuranil 10%",
        8.8,
        "h",
        "floral",
        10
      ],
      [
        "floriffol",
        80.6,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        98,
        "b",
        "musk",
        50
      ],
      [
        "galbascone",
        1,
        "h",
        "floral",
        100
      ],
      [
        "grisalva",
        3,
        "h",
        "floral",
        100
      ],
      [
        "hexyl butyrate",
        8.8,
        "h",
        "floral",
        100
      ],
      [
        "ionol",
        0.9,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        10,
        "h",
        "floral",
        100
      ],
      [
        "isoamyl butyrate",
        2,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        43.8,
        "b",
        "woody",
        100
      ],
      [
        "citrus propanol",
        43.8,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        16.1,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        16.1,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        17.5,
        "t",
        "citrus",
        100
      ],
      [
        "mango furanone 10%",
        0.1,
        "h",
        "floral",
        10
      ],
      [
        "methyl anthranilate",
        4.4,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "mimosa absolute",
        2,
        "h",
        "floral",
        100
      ],
      [
        "musk Z4",
        10,
        "b",
        "musk",
        100
      ],
      [
        "ethylene brassylate",
        60,
        "b",
        "musk",
        100
      ],
      [
        "orange oil",
        17.5,
        "t",
        "citrus",
        100
      ],
      [
        "ozofleur",
        10.7,
        "h",
        "floral",
        100
      ],
      [
        "prenyl acetate",
        26.3,
        "h",
        "floral",
        100
      ],
      [
        "trisamber",
        4.4,
        "b",
        "amber",
        100
      ],
      [
        "gamma-undecalactone",
        8.8,
        "h",
        "gourmand",
        100
      ],
      [
        "undecavertol",
        13.1,
        "h",
        "floral",
        100
      ],
      [
        "verdox",
        53.2,
        "h",
        "gourmand",
        100
      ],
      [
        "vertoliff",
        20,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-286",
    "te": "Spicy perfume base",
    "tr": "Пряный парфюм парфюмерная база",
    "sd": "TGSC (dm1015272) · Patent 4,457,862",
    "fa": "spicy",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,457,862 Odorant substances.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Пряный парфюм парфюмерная база». Формула из патента 4,457,862. Ключевые материалы структуры: bergamot oil bergaptene reduced, patchouli oil, sandalwood oil, myrascone.",
    "pr": {
      "citrus": 22,
      "woody": 50,
      "floral": 36,
      "green": 3
    },
    "it": [
      [
        "bergamot oil bergaptene reduced",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "patchouli oil",
        200,
        "b",
        "woody",
        100
      ],
      [
        "sandalwood oil",
        200,
        "b",
        "woody",
        100
      ],
      [
        "myrascone",
        100,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        70,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        50,
        "h",
        "floral",
        100
      ],
      [
        "woody acetate",
        50,
        "b",
        "woody",
        100
      ],
      [
        "basil oil",
        30,
        "t",
        "green",
        100
      ],
      [
        "dione",
        100,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-287",
    "te": "Fresh spicy wood accord",
    "tr": "Свежий пряно-древесный аккорд",
    "sd": "TGSC (dm1015272) · Patent 6,043,210",
    "fa": "spicy",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,043,210 Preparation of thiamacrolide compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Свежий пряно-древесный аккорд». Формула из патента 6,043,210. Ключевые материалы структуры: bergamot oil bergaptene reduced, citrus oil, dihydromyrcenol, lavandin oil.",
    "pr": {
      "floral": 50,
      "green": 13,
      "citrus": 37,
      "amber": 3,
      "woody": 12,
      "spicy": 5
    },
    "it": [
      [
        "7-thia-15-pentadecanolide",
        50,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "allyl amyl glycolate",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "methyl anthranilate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "basil oil",
        10,
        "t",
        "green",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "carbitol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "alpha-isomethyl ionone (50% min.)",
        50,
        "h",
        "floral",
        50
      ],
      [
        "citrus oil",
        100,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "dihydromyrcenol",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "tarragon oil",
        5,
        "h",
        "floral",
        100
      ],
      [
        "evernyl",
        3,
        "b",
        "woody",
        100
      ],
      [
        "clove bud oil",
        15,
        "h",
        "spicy",
        100
      ],
      [
        "methyl dihydrojasmonate",
        50,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        50,
        "b",
        "woody",
        100
      ],
      [
        "isoeugenol",
        3,
        "h",
        "spicy",
        100
      ],
      [
        "lavandin oil",
        100,
        "t",
        "green",
        100
      ],
      [
        "methyl cedryl ketone",
        60,
        "h",
        "floral",
        100
      ],
      [
        "nutmeg oil",
        20,
        "h",
        "spicy",
        100
      ],
      [
        "patchouli oil",
        30,
        "b",
        "woody",
        100
      ],
      [
        "aldehyde C-14",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "petitgrain oil SA",
        7,
        "t",
        "citrus",
        100
      ],
      [
        "sandalore",
        20,
        "b",
        "woody",
        100
      ],
      [
        "vanillin",
        2,
        "b",
        "amber",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-288",
    "te": "wild strawberry type",
    "tr": "Лесная земляника (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "gourmand",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring acetaldehyde 10%, alpha-amyl cinnamaldehyde, hexanal, octanal.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Лесная земляника (тип)». Ключевые материалы структуры: aldehyde C-16, alpha-amyl cinnamaldehyde, berry pentadienoate, habanolide.",
    "pr": {
      "citrus": 50,
      "floral": 27,
      "gourmand": 31,
      "musk": 13,
      "green": 1
    },
    "it": [
      [
        "acetaldehyde 10%",
        3.16,
        "t",
        "citrus",
        10
      ],
      [
        "alpha-amyl cinnamaldehyde",
        105.26,
        "t",
        "citrus",
        100
      ],
      [
        "hexanal",
        0.53,
        "h",
        "floral",
        100
      ],
      [
        "octanal",
        1.05,
        "h",
        "floral",
        100
      ],
      [
        "allyl caproate",
        21.05,
        "h",
        "gourmand",
        100
      ],
      [
        "1-octen-3-ol 10%",
        2.11,
        "h",
        "floral",
        10
      ],
      [
        "methyl cinnamate",
        2.63,
        "h",
        "spicy",
        100
      ],
      [
        "ethyl maltol",
        52.63,
        "h",
        "gourmand",
        100
      ],
      [
        "alpha-damascone",
        10.53,
        "h",
        "gourmand",
        100
      ],
      [
        "berry pentadienoate",
        105.26,
        "h",
        "gourmand",
        100
      ],
      [
        "fructalate",
        42.11,
        "h",
        "floral",
        100
      ],
      [
        "furaneol",
        10.53,
        "h",
        "gourmand",
        100
      ],
      [
        "habanolide",
        105.26,
        "b",
        "musk",
        100
      ],
      [
        "iralia total",
        31.58,
        "h",
        "floral",
        100
      ],
      [
        "isopropyl 2-methyl butyrate",
        52.63,
        "h",
        "gourmand",
        100
      ],
      [
        "aldehyde C-16",
        268.42,
        "t",
        "citrus",
        100
      ],
      [
        "hedione",
        105.26,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl sulfide 1%",
        1.05,
        "h",
        "floral",
        1
      ],
      [
        "galbascone",
        5.26,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol",
        10.53,
        "t",
        "green",
        100
      ],
      [
        "terpinolene",
        31.58,
        "h",
        "floral",
        100
      ],
      [
        "2,4-ivy carbaldehyde",
        31.58,
        "t",
        "citrus",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-289",
    "te": "High Tea Accord",
    "tr": "Аккорд благородного чая",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд благородного чая». Ключевые материалы структуры: alpha-hexyl cinnamaldehyde, grapefruit oil, delta-damascone 5%, dihydromyrcenol.",
    "pr": {
      "musk": 1,
      "gourmand": 6,
      "citrus": 50,
      "floral": 10,
      "green": 1
    },
    "it": [
      [
        "ambrettolide",
        15,
        "b",
        "musk",
        100
      ],
      [
        "delta-damascone 5%",
        75,
        "h",
        "gourmand",
        5
      ],
      [
        "dihydromyrcenol",
        75,
        "t",
        "citrus",
        100
      ],
      [
        "DIPG",
        26,
        "b",
        "aquatic",
        0
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        500,
        "t",
        "citrus",
        100
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "alpha-ionone",
        15,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        75,
        "h",
        "floral",
        100
      ],
      [
        "neryl acetate",
        6,
        "h",
        "floral",
        100
      ],
      [
        "grapefruit oil",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "cis-3-hexenol 10%",
        18,
        "t",
        "green",
        10
      ],
      [
        "verdox",
        15,
        "h",
        "gourmand",
        100
      ],
      [
        "limediene 0.1%",
        30,
        "t",
        "citrus",
        0.1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-290",
    "te": "Green Tea fragrance",
    "tr": "Аромат зелёного чая",
    "sd": "TGSC (dm1015272) · Patent 8,153,848",
    "fa": "green",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,153,848 Homoallyl alcohols useful as fragrances.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аромат зелёного чая». Формула из патента 8,153,848. Ключевые материалы структуры: hedione, hedione HC, DIPG, bergamot oil bergaptene reduced.",
    "pr": {
      "citrus": 15,
      "spicy": 1,
      "floral": 50,
      "green": 1,
      "musk": 5,
      "woody": 4
    },
    "it": [
      [
        "allyl alpha-ionone",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "ambroxan",
        4,
        "b",
        "amber",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        98,
        "t",
        "citrus",
        100
      ],
      [
        "black pepper oil",
        1,
        "h",
        "spicy",
        100
      ],
      [
        "cardamom seed oil",
        6,
        "h",
        "spicy",
        100
      ],
      [
        "cedryl acetate crystalline",
        1.2,
        "h",
        "floral",
        100
      ],
      [
        "citron oil Italy",
        3,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        24,
        "h",
        "floral",
        100
      ],
      [
        "clary sage oil france",
        6,
        "t",
        "green",
        100
      ],
      [
        "beta-damascone",
        0.6,
        "h",
        "gourmand",
        100
      ],
      [
        "DIPG",
        160.36,
        "b",
        "aquatic",
        0
      ],
      [
        "ethylene brassylate",
        52,
        "b",
        "musk",
        100
      ],
      [
        "evernyl",
        1.6,
        "b",
        "woody",
        100
      ],
      [
        "geranyl acetate",
        4,
        "h",
        "floral",
        100
      ],
      [
        "habanolide",
        6,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        252,
        "h",
        "floral",
        100
      ],
      [
        "hedione HC",
        180,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl acetate",
        0.06,
        "t",
        "green",
        100
      ],
      [
        "beta-ionone",
        20,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        40,
        "b",
        "woody",
        100
      ],
      [
        "linalool",
        42,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil yellow",
        16,
        "t",
        "citrus",
        100
      ],
      [
        "nutmeg oil",
        8,
        "h",
        "spicy",
        100
      ],
      [
        "orange oil florida",
        48,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl acetate",
        8,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl phenyl acetate",
        10,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        2,
        "h",
        "floral",
        100
      ],
      [
        "tricyclal",
        3,
        "h",
        "floral",
        100
      ],
      [
        "gamma-undecalactone",
        0.18,
        "h",
        "gourmand",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-291",
    "te": "Tea perfume base (Patent 4,634,548)",
    "tr": "Чайный парфюм парфюмерная база (Патент 4,634,548)",
    "sd": "TGSC (dm1015272) · Patent 4,634,548",
    "fa": "green",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,634,548 Novel bicyclic epoxides and compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Чайный парфюм парфюмерная база (Патент 4,634,548)». Формула из патента 4,634,548. Ключевые материалы структуры: linalyl acetate, linalool, hydroxycitronellal, madrox.",
    "pr": {
      "citrus": 44,
      "floral": 50,
      "woody": 8,
      "spicy": 11,
      "green": 3
    },
    "it": [
      [
        "linalyl acetate",
        222.22,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        133.33,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        133.33,
        "t",
        "citrus",
        100
      ],
      [
        "madrox",
        133.33,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        88.89,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        66.67,
        "b",
        "woody",
        100
      ],
      [
        "methyl eugenol",
        44.44,
        "h",
        "spicy",
        100
      ],
      [
        "acetanisole",
        44.44,
        "h",
        "spicy",
        100
      ],
      [
        "basil oil",
        22.22,
        "t",
        "green",
        100
      ],
      [
        "laevo-bornyl acetate",
        22.22,
        "h",
        "floral",
        100
      ],
      [
        "treemoss absolute",
        22.22,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        66.67,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-292",
    "te": "Tea perfume base (Patent 4,544,714)",
    "tr": "Чайный парфюм парфюмерная база (Патент 4,544,714)",
    "sd": "TGSC (dm1015272) · Patent 4,544,714",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,544,714 Odorant oximes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Чайный парфюм парфюмерная база (Патент 4,544,714)». Формула из патента 4,544,714. Ключевые материалы структуры: DIPG, bergamot oil bergaptene reduced, linalool, hydroxycitronellal.",
    "pr": {
      "citrus": 50,
      "floral": 44,
      "woody": 10,
      "green": 6,
      "spicy": 4,
      "musk": 2
    },
    "it": [
      [
        "bergamot oil bergaptene reduced",
        166.67,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        111.11,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        66.67,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        44.44,
        "b",
        "woody",
        100
      ],
      [
        "basil oil",
        33.33,
        "t",
        "green",
        100
      ],
      [
        "methyl eugenol",
        22.22,
        "h",
        "spicy",
        100
      ],
      [
        "beta-ionone",
        22.22,
        "h",
        "floral",
        100
      ],
      [
        "oxyoctaline formate",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 IPM",
        11.11,
        "b",
        "musk",
        50
      ],
      [
        "laevo-bornyl acetate",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "corps lavande",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "treemoss absolute colourless",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil",
        11.11,
        "t",
        "citrus",
        100
      ],
      [
        "vertofix",
        11.11,
        "b",
        "woody",
        100
      ],
      [
        "indole 10%",
        11.11,
        "h",
        "floral",
        10
      ],
      [
        "DIPG",
        333.33,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-293",
    "te": "Tea perfume composition",
    "tr": "Чайный парфюм композиция",
    "sd": "TGSC (dm1015272) · Patent 4,485,036",
    "fa": "green",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,485,036 Odorant compositions containing megastigma-5(11),8-dien-4,7-oxides and tetra-substituted-7-oxa-bicyclo[3.3.0]-octanes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Чайный парфюм композиция». Формула из патента 4,485,036. Ключевые материалы структуры: bergamot oil bergaptene reduced, hydroxycitronellal, methyl dihydrojasmonate, patchouli oil.",
    "pr": {
      "citrus": 50,
      "floral": 45,
      "woody": 11,
      "green": 11,
      "spicy": 13
    },
    "it": [
      [
        "bergamot oil bergaptene reduced",
        240,
        "t",
        "citrus",
        100
      ],
      [
        "hydroxycitronellal",
        120,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        120,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        60,
        "b",
        "woody",
        100
      ],
      [
        "basil oil",
        60,
        "t",
        "green",
        100
      ],
      [
        "cedryl acetate crystalline",
        60,
        "h",
        "floral",
        100
      ],
      [
        "acetanisole",
        40,
        "h",
        "spicy",
        100
      ],
      [
        "beta-ionone",
        40,
        "h",
        "floral",
        100
      ],
      [
        "cervolide",
        40,
        "h",
        "floral",
        100
      ],
      [
        "treemoss absolute 50%",
        20,
        "h",
        "floral",
        50
      ],
      [
        "lemon oil",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "cedarwood acetate",
        20,
        "b",
        "woody",
        100
      ],
      [
        "armoise oil",
        20,
        "t",
        "green",
        100
      ],
      [
        "chamomile flower oil roman 10%",
        20,
        "h",
        "floral",
        10
      ],
      [
        "indole 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "rhodinol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "thibetolide",
        10,
        "h",
        "floral",
        100
      ],
      [
        "spruce needle absolute",
        6,
        "h",
        "floral",
        100
      ],
      [
        "wormseed oil replacer",
        4,
        "h",
        "floral",
        100
      ],
      [
        "methyl eugenol",
        60,
        "h",
        "spicy",
        100
      ],
      [
        "DIPG",
        20,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-294",
    "te": "Tobacco perfume composition",
    "tr": "Табачный парфюм композиция",
    "sd": "TGSC (dm1015272) · Patent 4,485,036",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,485,036 Odorant compositions containing megastigma-5(11),8-dien-4,7-oxides and tetra-substituted-7-oxa-bicyclo[3.3.0]-octanes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Табачный парфюм композиция». Формула из патента 4,485,036. Ключевые материалы структуры: alpha-ionone, green acetate, alpha-hexyl cinnamaldehyde, musk ketone.",
    "pr": {
      "floral": 50,
      "green": 43,
      "citrus": 20,
      "musk": 19,
      "woody": 20,
      "gourmand": 11,
      "amber": 7,
      "leathery": 4
    },
    "it": [
      [
        "alpha-ionone",
        200,
        "h",
        "floral",
        100
      ],
      [
        "green acetate",
        200,
        "t",
        "green",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        110,
        "t",
        "citrus",
        100
      ],
      [
        "musk ketone",
        100,
        "b",
        "musk",
        100
      ],
      [
        "sandalwood oil",
        100,
        "b",
        "woody",
        100
      ],
      [
        "styrallyl acetate",
        60,
        "h",
        "gourmand",
        100
      ],
      [
        "methyl dihydrojasmonate",
        60,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "siam benzoin resinoid",
        20,
        "b",
        "amber",
        100
      ],
      [
        "isobutyl quinoline 10%",
        20,
        "b",
        "leathery",
        10
      ],
      [
        "lavender oil",
        20,
        "t",
        "green",
        100
      ],
      [
        "vetiver oil bourbon",
        10,
        "b",
        "woody",
        100
      ],
      [
        "melilot absolute colourless",
        10,
        "h",
        "floral",
        100
      ],
      [
        "galbanum oil",
        10,
        "t",
        "green",
        100
      ],
      [
        "DIPG",
        60,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-295",
    "te": "tomato leaf formulation",
    "tr": "Композиция листа томата",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring styrallyl acetate, cinnamaldehyde 10%, alpha-hexyl cinnamaldehyde, laevo-carvone 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Композиция листа томата». Ключевые материалы структуры: styrallyl acetate, cinnamaldehyde 10%, isopropyl quinoline, alpha-hexyl cinnamaldehyde.",
    "pr": {
      "gourmand": 44,
      "citrus": 50,
      "floral": 15,
      "amber": 2,
      "green": 7,
      "spicy": 1,
      "leathery": 16
    },
    "it": [
      [
        "styrallyl acetate",
        311.76,
        "h",
        "gourmand",
        100
      ],
      [
        "cinnamaldehyde 10%",
        311.76,
        "t",
        "citrus",
        10
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        58.82,
        "t",
        "citrus",
        100
      ],
      [
        "laevo-carvone 10%",
        5.88,
        "h",
        "floral",
        10
      ],
      [
        "ethyl vanillin 10%",
        11.76,
        "b",
        "amber",
        10
      ],
      [
        "eucalyptol",
        5.88,
        "t",
        "green",
        100
      ],
      [
        "eugenol",
        5.88,
        "h",
        "spicy",
        100
      ],
      [
        "galbanum oil",
        17.65,
        "t",
        "green",
        100
      ],
      [
        "hedione",
        58.82,
        "h",
        "floral",
        100
      ],
      [
        "isopropyl quinoline",
        117.65,
        "b",
        "leathery",
        100
      ],
      [
        "linalool",
        29.41,
        "h",
        "floral",
        100
      ],
      [
        "buchu mercaptan 0.1%",
        11.76,
        "h",
        "gourmand",
        0.1
      ],
      [
        "triplal",
        29.41,
        "t",
        "green",
        100
      ],
      [
        "violettyne MIP",
        17.65,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        5.88,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-296",
    "te": "Tulip perfume base",
    "tr": "Тюльпан парфюм парфюмерная база",
    "sd": "TGSC (dm1015272) · Patent 4,634,548",
    "fa": "floral",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,634,548 Novel bicyclic epoxides and compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Тюльпан парфюм парфюмерная база». Формула из патента 4,634,548. Ключевые материалы структуры: hydroxycitronellal, phenethyl alcohol, myraldyl acetate, methyl dihydrojasmonate.",
    "pr": {
      "floral": 50,
      "citrus": 22,
      "green": 5
    },
    "it": [
      [
        "phenethyl alcohol",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "myraldyl acetate",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "acetal CD",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        177.78,
        "t",
        "citrus",
        100
      ],
      [
        "farnesol",
        44.44,
        "h",
        "floral",
        100
      ],
      [
        "hexyl salicylate",
        33.33,
        "t",
        "green",
        100
      ],
      [
        "alpha-terpineol",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "cyclamen aldehyde",
        22.22,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        22.22,
        "h",
        "floral",
        100
      ],
      [
        "linalyl anthranilate",
        11.11,
        "h",
        "floral",
        100
      ],
      [
        "isoamyl salicylate",
        11.11,
        "t",
        "green",
        100
      ],
      [
        "aldehyde C-11 undecylenic 10%",
        11.11,
        "t",
        "citrus",
        10
      ],
      [
        "benzyl acetate",
        8.89,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenyl benzoate",
        8.89,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl acetate 10%",
        8.89,
        "t",
        "green",
        10
      ],
      [
        "para-cresyl isobutyrate 10%",
        6.67,
        "h",
        "floral",
        10
      ],
      [
        "indole 10%",
        6.67,
        "h",
        "floral",
        10
      ],
      [
        "syringa aldehyde",
        4.44,
        "t",
        "citrus",
        100
      ],
      [
        "hydratropaldehyde dimethyl acetal 10%",
        33.33,
        "t",
        "citrus",
        10
      ],
      [
        "DIPG",
        111.11,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-297",
    "te": "Unisex eau fraiche",
    "tr": "Освежающая вода унисекс",
    "sd": "TGSC (dm1015272) · Patent 6,297,211",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 6,297,211 Odorant compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Освежающая вода унисекс». Формула из патента 6,297,211. Ключевые материалы структуры: methyl dihydrojasmonate, bergamot oil bergaptene reduced, galaxolide 50 IPM, fixambrene 10%.",
    "pr": {
      "floral": 50,
      "citrus": 16,
      "musk": 9,
      "green": 1,
      "woody": 5
    },
    "it": [
      [
        "cyclogalbanate 10%",
        20,
        "h",
        "floral",
        10
      ],
      [
        "bergamot oil bergaptene reduced",
        150,
        "t",
        "citrus",
        100
      ],
      [
        "jasmonyl",
        50,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil italy",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "dimetol",
        35,
        "h",
        "floral",
        100
      ],
      [
        "ethyl linalool",
        50,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        60,
        "b",
        "aquatic",
        0
      ],
      [
        "florhydral10 %",
        5,
        "h",
        "floral",
        10
      ],
      [
        "galaxolide 50 IPM",
        100,
        "b",
        "musk",
        50
      ],
      [
        "cis-3-hexenol 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "beta-ionone",
        35,
        "h",
        "floral",
        100
      ],
      [
        "spearmint oil 10%",
        5,
        "t",
        "green",
        10
      ],
      [
        "mandarin oil italy",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "calone 1951 10%",
        5,
        "h",
        "aquatic",
        10
      ],
      [
        "methyl dihydrojasmonate",
        200,
        "h",
        "floral",
        100
      ],
      [
        "lilial",
        35,
        "h",
        "floral",
        100
      ],
      [
        "ebanol 10%",
        30,
        "b",
        "woody",
        10
      ],
      [
        "georgywood",
        30,
        "b",
        "woody",
        100
      ],
      [
        "fixambrene 10%",
        75,
        "h",
        "floral",
        10
      ],
      [
        "tropional",
        25,
        "h",
        "floral",
        100
      ],
      [
        "3,6-dimethyloct-6-en-1-ol",
        50,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-298",
    "te": "Vert de figue basilic /2 (Givaudan)",
    "tr": "Зелёный инжир и базилик /2 (Givaudan)",
    "sd": "TGSC (dm1015272) · Givaudan",
    "fa": "floral",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Application: Solution 2% Alc..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Зелёный инжир и базилик /2 (Givaudan)». Ключевые материалы структуры: HEXYL SALICYLATE, HEDIONE (Firmenich), ETHYL LINALYL ACETATE (Givaudan), PHENYL ETHYL ALCOHOL.",
    "pr": {
      "floral": 50,
      "green": 21,
      "spicy": 5,
      "citrus": 12,
      "aquatic": 6
    },
    "it": [
      [
        "SPIROGALBANONE PURE (Givaudan)",
        1,
        "h",
        "floral",
        100
      ],
      [
        "HEXENYL-3-CIS BUTYRATE",
        2,
        "t",
        "green",
        100
      ],
      [
        "DAMASCONE DELTA",
        3,
        "h",
        "gourmand",
        100
      ],
      [
        "STEMONE (Givaudan)",
        3,
        "t",
        "green",
        100
      ],
      [
        "METHYL DIANTILIS (Givaudan)",
        3,
        "h",
        "floral",
        100
      ],
      [
        "TOSCANOL (Givaudan)",
        4,
        "h",
        "floral",
        100
      ],
      [
        "HEXENYL-3-CIS ACETATE",
        4,
        "t",
        "green",
        100
      ],
      [
        "FLORHYDRAL (Givaudan)",
        4,
        "h",
        "floral",
        100
      ],
      [
        "COSMONE (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "EUGENOL PURE",
        5,
        "h",
        "spicy",
        100
      ],
      [
        "GERANODYLE (Givaudan)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "VIRIDINE",
        6,
        "h",
        "floral",
        100
      ],
      [
        "HERBANATE (Givaudan)",
        15,
        "t",
        "green",
        100
      ],
      [
        "UNDECAVERTOL (Givaudan)",
        15,
        "h",
        "floral",
        100
      ],
      [
        "CITRONELLYL ACETATE",
        20,
        "h",
        "floral",
        100
      ],
      [
        "DIHYDRO MYRCENOL",
        25,
        "h",
        "floral",
        100
      ],
      [
        "LEMON OIL ITALY",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "PARADISAMIDE (Givaudan)",
        30,
        "h",
        "floral",
        100
      ],
      [
        "ANETHOLE",
        45,
        "h",
        "spicy",
        100
      ],
      [
        "HELIONAL (IFF)",
        60,
        "h",
        "aquatic",
        100
      ],
      [
        "METHYL LAITONE 10%/TEC (Givaudan)",
        80,
        "h",
        "floral",
        10
      ],
      [
        "ETHYL LINALYL ACETATE (Givaudan)",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "PHENYL ETHYL ALCOHOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "ETHYL LINALOOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE (Firmenich)",
        140,
        "h",
        "floral",
        100
      ],
      [
        "HEXYL SALICYLATE",
        200,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-299",
    "te": "watermelon whiteflower type",
    "tr": "Арбуз и белые цветы (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "aquatic",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring osyrol, bacdanol, phenethyl alcohol, bourgeonal.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Арбуз и белые цветы (тип)». Ключевые материалы структуры: lyral, dipropylene glycol, methyl dihydrojasmonate, alpha-isomethyl ionone (90% min.).",
    "pr": {
      "floral": 50,
      "woody": 3,
      "aquatic": 2,
      "citrus": 2,
      "musk": 7
    },
    "it": [
      [
        "osyrol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "bacdanol",
        10,
        "b",
        "woody",
        100
      ],
      [
        "phenethyl alcohol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "bourgeonal",
        2,
        "h",
        "floral",
        100
      ],
      [
        "calone",
        2,
        "h",
        "aquatic",
        100
      ],
      [
        "canthoxal",
        3,
        "h",
        "floral",
        100
      ],
      [
        "cyclogalbanate",
        1,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        220,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        140,
        "h",
        "floral",
        100
      ],
      [
        "alpha-isomethyl ionone (90% min.)",
        62,
        "h",
        "floral",
        90
      ],
      [
        "ethylene brassylate",
        50,
        "b",
        "musk",
        100
      ],
      [
        "helional",
        30,
        "h",
        "aquatic",
        100
      ],
      [
        "galaxolide 50 IPM",
        60,
        "b",
        "musk",
        50
      ],
      [
        "iso e super",
        30,
        "b",
        "woody",
        100
      ],
      [
        "cyclopentadecanolide",
        40,
        "h",
        "floral",
        100
      ],
      [
        "sandela",
        60,
        "h",
        "floral",
        100
      ],
      [
        "cyclopidene",
        1,
        "h",
        "floral",
        100
      ],
      [
        "dipropylene glycol",
        189,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-300",
    "te": "Woody",
    "tr": "Древесный",
    "sd": "TGSC (dm1015272) · Patent 7,838,488",
    "fa": "woody",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,838,488 Propanol and related compounds and their use in perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный». Формула из патента 7,838,488. Ключевые материалы структуры: galaxolide 50 BB, iso e super, bergamot oil bergaptene reduced, lyral.",
    "pr": {
      "green": 6,
      "citrus": 43,
      "spicy": 2,
      "amber": 4,
      "floral": 50,
      "musk": 39,
      "leathery": 2,
      "woody": 47
    },
    "it": [
      [
        "amyl salicylate",
        10,
        "t",
        "green",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "clove bud oil",
        2,
        "h",
        "spicy",
        100
      ],
      [
        "coumarin",
        10,
        "b",
        "amber",
        100
      ],
      [
        "cyclacet",
        30,
        "h",
        "floral",
        100
      ],
      [
        "dihydromyrcenol",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "dipropylene glycol",
        64,
        "h",
        "floral",
        100
      ],
      [
        "2-methyl-1-(5',5',6'-trimethyl bicyclo(2.2.1)hept-2'-yl) propan-2-ol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "galaxolide 50 BB",
        200,
        "b",
        "musk",
        50
      ],
      [
        "hedione",
        50,
        "h",
        "floral",
        100
      ],
      [
        "cis-3-hexenol 10%",
        20,
        "t",
        "green",
        10
      ],
      [
        "beta-ionone",
        5,
        "h",
        "floral",
        100
      ],
      [
        "isobutyl quinoline",
        10,
        "b",
        "leathery",
        100
      ],
      [
        "iso e super",
        200,
        "b",
        "woody",
        100
      ],
      [
        "linalyl acetate",
        10,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        70,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        70,
        "t",
        "citrus",
        100
      ],
      [
        "nutmeg oil",
        10,
        "h",
        "spicy",
        100
      ],
      [
        "orange oil florida",
        25,
        "t",
        "citrus",
        100
      ],
      [
        "trisamber 10%",
        10,
        "b",
        "amber",
        10
      ],
      [
        "undecavertol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "veramoss",
        4,
        "b",
        "woody",
        100
      ],
      [
        "vertofix",
        40,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-301",
    "te": "Sweet Woody Accord",
    "tr": "Сладкий древесный аккорд",
    "sd": "TGSC (dm1015272) · Bedoukian Demo Formula",
    "fa": "woody",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Bedoukian Demo Formula.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Сладкий древесный аккорд». Ключевые материалы структуры: DIPG, methyl dihydrojasmonate, patchouli oil light, linalyl acetate.",
    "pr": {
      "amber": 13,
      "citrus": 26,
      "woody": 32,
      "floral": 50,
      "musk": 8,
      "green": 4
    },
    "it": [
      [
        "siam benzoin resinoid",
        7,
        "b",
        "amber",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "cedarwood oil virginia",
        7,
        "b",
        "woody",
        100
      ],
      [
        "cedramber",
        50,
        "b",
        "amber",
        100
      ],
      [
        "citral",
        1,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "civet synthetic 10%",
        1.5,
        "h",
        "floral",
        10
      ],
      [
        "coumarin",
        15,
        "b",
        "amber",
        100
      ],
      [
        "DIPG",
        207.5,
        "b",
        "aquatic",
        0
      ],
      [
        "galaxolide 50 IPM",
        50,
        "b",
        "musk",
        50
      ],
      [
        "geranium oil africa",
        10,
        "h",
        "floral",
        100
      ],
      [
        "lavender oil",
        25,
        "t",
        "green",
        100
      ],
      [
        "lemon oil",
        11,
        "t",
        "citrus",
        100
      ],
      [
        "linalool",
        30,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        110,
        "t",
        "citrus",
        100
      ],
      [
        "lyral",
        60,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        150,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil light",
        120,
        "b",
        "woody",
        100
      ],
      [
        "terrasol 10%",
        9,
        "h",
        "floral",
        10
      ],
      [
        "vanillin",
        6,
        "b",
        "amber",
        100
      ],
      [
        "vertenex",
        10,
        "h",
        "floral",
        100
      ],
      [
        "vertofix",
        65,
        "b",
        "woody",
        100
      ],
      [
        "vionil 1%",
        7.5,
        "h",
        "floral",
        1
      ],
      [
        "nuezate 1%",
        7.5,
        "h",
        "floral",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-302",
    "te": "Woody amber",
    "tr": "Древесный амбровый",
    "sd": "TGSC (dm1015272) · Patent 4,008,184",
    "fa": "amber",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,008,184 6,10 Dimethyl bicyclo(4,4,0)decane or decene alcohol and ester perfume compositions.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный амбровый». Формула из патента 4,008,184. Ключевые материалы структуры: bergamot oil replacer, undecanal 10%, benzyl acetate, coumarin.",
    "pr": {
      "floral": 50,
      "citrus": 31,
      "amber": 9,
      "musk": 6,
      "woody": 5,
      "green": 1,
      "leathery": 2
    },
    "it": [
      [
        "phenethyl acetate",
        33.33,
        "h",
        "floral",
        100
      ],
      [
        "undecanal 10%",
        111.11,
        "h",
        "floral",
        10
      ],
      [
        "aldehyde C-12 mna 10%",
        22.22,
        "t",
        "citrus",
        10
      ],
      [
        "coumarin",
        66.67,
        "b",
        "amber",
        100
      ],
      [
        "vanillin",
        5.56,
        "b",
        "amber",
        100
      ],
      [
        "musk ketone",
        61.11,
        "b",
        "musk",
        100
      ],
      [
        "cyclopentadecanone 10%",
        33.33,
        "h",
        "floral",
        10
      ],
      [
        "alpha-isomethyl ionone (90% min.)",
        66.67,
        "h",
        "floral",
        90
      ],
      [
        "oakmoss absolute",
        22.22,
        "b",
        "woody",
        100
      ],
      [
        "labdanum absolute",
        11.11,
        "b",
        "amber",
        100
      ],
      [
        "galbanum oil replacer",
        11.11,
        "t",
        "green",
        100
      ],
      [
        "castoreum absolute replacer",
        22.22,
        "b",
        "leathery",
        100
      ],
      [
        "methyl dihydrojasmonate",
        55.56,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "indole 10%",
        11.11,
        "h",
        "floral",
        10
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        55.56,
        "t",
        "citrus",
        100
      ],
      [
        "rose absolute replacer",
        55.56,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        22.22,
        "b",
        "woody",
        100
      ],
      [
        "bergamot oil replacer",
        222.22,
        "t",
        "citrus",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-303",
    "te": "Woody amber masculine eau de toilette",
    "tr": "Древесно-амбровая мужская туалетная вода",
    "sd": "TGSC (dm1015272) · Patent 5,525,589",
    "fa": "amber",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDT",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,525,589 Cyclic compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесно-амбровая мужская туалетная вода». Формула из патента 5,525,589. Ключевые материалы структуры: bergamot oil bergaptene reduced, hedione, patchouli oil, cedryl methyl ether.",
    "pr": {
      "floral": 50,
      "amber": 2,
      "citrus": 17,
      "green": 5,
      "woody": 10
    },
    "it": [
      [
        "3-tert-butyl cyclohexyl acetate",
        30,
        "h",
        "floral",
        100
      ],
      [
        "ambrettolide",
        2,
        "b",
        "musk",
        100
      ],
      [
        "ambroxan",
        2,
        "b",
        "amber",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "cedryl methyl ether",
        80,
        "h",
        "floral",
        100
      ],
      [
        "citric ess.",
        60,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        40,
        "h",
        "floral",
        100
      ],
      [
        "civet absolute",
        1,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        15,
        "b",
        "amber",
        100
      ],
      [
        "cyclohexal",
        70,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        20,
        "b",
        "aquatic",
        0
      ],
      [
        "hedione",
        200,
        "h",
        "floral",
        100
      ],
      [
        "isoraldeine 70",
        50,
        "h",
        "floral",
        100
      ],
      [
        "lavandin oil",
        60,
        "t",
        "green",
        100
      ],
      [
        "methyl cedryl ketone",
        50,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        100,
        "b",
        "woody",
        100
      ],
      [
        "sandalore",
        15,
        "b",
        "woody",
        100
      ],
      [
        "vanillin",
        5,
        "b",
        "amber",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-304",
    "te": "Woody amber tobacco eau de toilette for men",
    "tr": "Древесно-амбровая табачная мужская туалетная вода",
    "sd": "TGSC (dm1015272) · Patent 5,288,701",
    "fa": "amber",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDT",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 5,288,701 Derivatives of dihydrocampholenic aldehyde.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесно-амбровая табачная мужская туалетная вода». Формула из патента 5,288,701. Ключевые материалы структуры: patchouli essence, methyl dihydrojasmonate, linalyl acetate, cedryl methyl ether.",
    "pr": {
      "floral": 50,
      "woody": 20,
      "citrus": 19,
      "green": 5,
      "amber": 3
    },
    "it": [
      [
        "methyl dihydrojasmonate",
        167,
        "h",
        "floral",
        100
      ],
      [
        "patchouli essence",
        170,
        "b",
        "woody",
        100
      ],
      [
        "linalyl acetate",
        120,
        "t",
        "citrus",
        100
      ],
      [
        "cedryl methyl ether",
        110,
        "h",
        "floral",
        100
      ],
      [
        "methyl cedryl ketone",
        85,
        "h",
        "floral",
        100
      ],
      [
        "cyclohexal",
        72,
        "h",
        "floral",
        100
      ],
      [
        "lavandin essence",
        52,
        "t",
        "green",
        100
      ],
      [
        "bergamot essence",
        39,
        "t",
        "citrus",
        100
      ],
      [
        "tangerine essence",
        26,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        20,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        20,
        "b",
        "amber",
        100
      ],
      [
        "DIPG",
        13,
        "b",
        "aquatic",
        0
      ],
      [
        "BHT",
        5,
        "h",
        "floral",
        100
      ],
      [
        "linalool",
        13,
        "h",
        "floral",
        100
      ],
      [
        "cedarwood essence virginia",
        13,
        "b",
        "woody",
        100
      ],
      [
        "fixambrene 10%",
        7,
        "h",
        "floral",
        10
      ],
      [
        "vanillin",
        6,
        "b",
        "amber",
        100
      ],
      [
        "civet absolute 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "ylang ylang essence",
        7,
        "h",
        "floral",
        100
      ],
      [
        "vetiver essence bourbon",
        7,
        "b",
        "woody",
        100
      ],
      [
        "geranium essence",
        6,
        "h",
        "floral",
        100
      ],
      [
        "givescone 10%",
        5,
        "h",
        "floral",
        10
      ],
      [
        "castoreum resinoid 10%",
        5,
        "b",
        "leathery",
        10
      ],
      [
        "fixolide",
        4,
        "h",
        "floral",
        100
      ],
      [
        "lemon essence (water phase)",
        5,
        "t",
        "citrus",
        100
      ],
      [
        "mandarin aldehyde 10%",
        5,
        "t",
        "citrus",
        10
      ],
      [
        "polysantol",
        13,
        "b",
        "woody",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-305",
    "te": "woody amber type",
    "tr": "Древесный амбровый (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "amber",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, eugenol, florol, hedione.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный амбровый (тип)». Ключевые материалы структуры: benzyl salicylate, iralia total, phenethylol, florol.",
    "pr": {
      "floral": 50,
      "spicy": 5,
      "green": 25
    },
    "it": [
      [
        "benzyl acetate",
        70,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        60,
        "h",
        "spicy",
        100
      ],
      [
        "florol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        60,
        "h",
        "floral",
        100
      ],
      [
        "iralia total",
        180,
        "h",
        "floral",
        100
      ],
      [
        "phenethylol",
        150,
        "h",
        "floral",
        100
      ],
      [
        "benzyl salicylate",
        300,
        "t",
        "green",
        100
      ],
      [
        "wardia",
        50,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        30,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-306",
    "te": "Woody animalic",
    "tr": "Древесный анималистичный",
    "sd": "TGSC (dm1015272) · Patent 8,183,200",
    "fa": "woody",
    "kd": "perfume",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 8,183,200 Organoleptic compounds.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный анималистичный». Формула из патента 8,183,200. Ключевые материалы структуры: indisan, methyl dihydrojasmonate, ethylene brassylate, zenolide.",
    "pr": {
      "floral": 50,
      "musk": 9,
      "citrus": 4,
      "gourmand": 1
    },
    "it": [
      [
        "indisan",
        206,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        160,
        "h",
        "floral",
        100
      ],
      [
        "ethylene brassylate",
        134,
        "b",
        "musk",
        100
      ],
      [
        "zenolide",
        123,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        66,
        "h",
        "floral",
        100
      ],
      [
        "4-(3,3-dimethyl bicyclo(2.2.1)hept-2-yl)-1-methyl-2-oxabicyclo(2.2.2)octane",
        66,
        "h",
        "floral",
        100
      ],
      [
        "floriffol",
        56,
        "h",
        "floral",
        100
      ],
      [
        "linalyl acetate",
        56,
        "t",
        "citrus",
        100
      ],
      [
        "phenethyl alcohol",
        23,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        12,
        "h",
        "floral",
        100
      ],
      [
        "phenoxanol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "nerol 10% DPG",
        10,
        "h",
        "floral",
        10
      ],
      [
        "magnolan",
        10,
        "h",
        "floral",
        100
      ],
      [
        "geraniol",
        10,
        "h",
        "floral",
        100
      ],
      [
        "delta-damascone 10% DPG",
        7,
        "h",
        "gourmand",
        10
      ],
      [
        "geranyl acetate 10% DPG",
        5,
        "h",
        "floral",
        10
      ],
      [
        "ethyl vanillin",
        2,
        "b",
        "amber",
        100
      ],
      [
        "gamma-undecalactone",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "dihydro beta ionone",
        2,
        "h",
        "floral",
        100
      ],
      [
        "DIPG",
        40,
        "b",
        "aquatic",
        0
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-307",
    "te": "Woody base (Patent 4,948,781)",
    "tr": "Древесный парфюмерная база (Патент 4,948,781)",
    "sd": "TGSC (dm1015272) · Patent 4,948,781",
    "fa": "woody",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,948,781 Novel odorant and/or flavoring substances.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный парфюмерная база (Патент 4,948,781)». Формула из патента 4,948,781. Ключевые материалы структуры: bergamot oil bergaptene reduced, patchouli oil, sandalwood oil, cedryl acetate.",
    "pr": {
      "citrus": 22,
      "woody": 50,
      "floral": 24,
      "green": 3
    },
    "it": [
      [
        "bergamot oil bergaptene reduced",
        222.22,
        "t",
        "citrus",
        100
      ],
      [
        "patchouli oil",
        222.22,
        "b",
        "woody",
        100
      ],
      [
        "sandalwood oil",
        222.22,
        "b",
        "woody",
        100
      ],
      [
        "cedryl acetate",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        77.78,
        "h",
        "floral",
        100
      ],
      [
        "alpha-isomethyl ionone (50% min.)",
        55.56,
        "h",
        "floral",
        50
      ],
      [
        "woody acetate",
        55.56,
        "b",
        "woody",
        100
      ],
      [
        "basil oil",
        33.33,
        "t",
        "green",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-308",
    "te": "Woody base (Patent 4,426,321)",
    "tr": "Древесный парфюмерная база (Патент 4,426,321)",
    "sd": "TGSC (dm1015272) · Patent 4,426,321",
    "fa": "woody",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,426,321 Odorant alkadienyl ketones, alcohols and oximes.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный парфюмерная база (Патент 4,426,321)». Формула из патента 4,426,321. Ключевые материалы структуры: sandalwood oil, patchouli oil, bergamot oil bergaptene reduced, cedryl acetate crystalline.",
    "pr": {
      "green": 3,
      "floral": 24,
      "woody": 50,
      "citrus": 22
    },
    "it": [
      [
        "basil oil",
        33.33,
        "t",
        "green",
        100
      ],
      [
        "alpha-isomethyl ionone (50% min.)",
        55.56,
        "h",
        "floral",
        50
      ],
      [
        "woody acetate",
        55.56,
        "b",
        "woody",
        100
      ],
      [
        "methyl dihydrojasmonate",
        77.78,
        "h",
        "floral",
        100
      ],
      [
        "cedryl acetate crystalline",
        111.11,
        "h",
        "floral",
        100
      ],
      [
        "sandalwood oil",
        222.22,
        "b",
        "woody",
        100
      ],
      [
        "patchouli oil",
        222.22,
        "b",
        "woody",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        222.22,
        "t",
        "citrus",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-309",
    "te": "Woody base (Patent 4,014,905)",
    "tr": "Древесный парфюмерная база (Патент 4,014,905)",
    "sd": "TGSC (dm1015272) · Patent 4,014,905",
    "fa": "woody",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,014,905 Esters of certain tetramethyl and pentamethyl-1-oxa-spiro [4-5]decan-6-ols with certain alkanoic acids.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный парфюмерная база (Патент 4,014,905)». Формула из патента 4,014,905. Ключевые материалы структуры: bergamot oil replacer, vetiveryl acetate, cedarwood oil texas, hedione.",
    "pr": {
      "citrus": 38,
      "woody": 50,
      "floral": 27
    },
    "it": [
      [
        "bergamot oil replacer",
        333.33,
        "t",
        "citrus",
        100
      ],
      [
        "vetiveryl acetate",
        166.67,
        "b",
        "woody",
        100
      ],
      [
        "cedarwood oil texas",
        133.33,
        "b",
        "woody",
        100
      ],
      [
        "hedione",
        133.33,
        "h",
        "floral",
        100
      ],
      [
        "oakmoss absolute 10%",
        133.33,
        "b",
        "woody",
        10
      ],
      [
        "santall",
        100,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-310",
    "te": "woody citrus type",
    "tr": "Древесный цитрусовый (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "citrus",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring linalyl acetate, bergamot oil bergaptene reduced, cedryl methyl ether, citral.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный цитрусовый (тип)». Ключевые материалы структуры: linalyl acetate, cedryl methyl ether, patchouli oil, vertofix.",
    "pr": {
      "citrus": 28,
      "floral": 50,
      "amber": 5,
      "green": 11,
      "woody": 40,
      "aquatic": 2
    },
    "it": [
      [
        "linalyl acetate",
        133.33,
        "t",
        "citrus",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        66.67,
        "t",
        "citrus",
        100
      ],
      [
        "cedryl methyl ether",
        133.33,
        "h",
        "floral",
        100
      ],
      [
        "citral",
        6.67,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        26.67,
        "h",
        "floral",
        100
      ],
      [
        "coranol",
        50,
        "h",
        "floral",
        100
      ],
      [
        "coumarin",
        26.67,
        "b",
        "amber",
        100
      ],
      [
        "geranium oil",
        10,
        "h",
        "floral",
        100
      ],
      [
        "hedione HC",
        66.67,
        "h",
        "floral",
        100
      ],
      [
        "lavandin oil",
        66.67,
        "t",
        "green",
        100
      ],
      [
        "lyral",
        83.33,
        "h",
        "floral",
        100
      ],
      [
        "oakmoss absolute 50%",
        13.33,
        "b",
        "woody",
        50
      ],
      [
        "patchouli oil",
        133.33,
        "b",
        "woody",
        100
      ],
      [
        "polysantol",
        16.67,
        "b",
        "woody",
        100
      ],
      [
        "clary sage oil",
        13.33,
        "t",
        "green",
        100
      ],
      [
        "vanillin",
        6.67,
        "b",
        "amber",
        100
      ],
      [
        "vertofix",
        133.33,
        "b",
        "woody",
        100
      ],
      [
        "tamarine base 41310",
        13.33,
        "h",
        "aquatic",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-311",
    "te": "Accord N° 208829 Woody herbal (Firmenich)",
    "tr": "Аккорд №208829 · древесный травянистый (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "green",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): The addition of 10 parts of KOUMALACTONE® 10% TEC gives a nice oriental-coumarinic touch..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208829 · древесный травянистый (Firmenich)». Ключевые материалы структуры: ISO E SUPER® (IFF), SCLAREOLATE® (Fir), HEDIONE® (Fir), EXALTOLIDE® TOTAL (Fir).",
    "pr": {
      "gourmand": 2,
      "citrus": 8,
      "amber": 1,
      "floral": 50,
      "musk": 20,
      "woody": 22,
      "green": 1
    },
    "it": [
      [
        "ALLYL AMYL GLYCOLATE",
        5,
        "h",
        "gourmand",
        100
      ],
      [
        "BERGAMOTE 631 LL",
        30,
        "t",
        "citrus",
        100
      ],
      [
        "CETALOX® (Fir)",
        10,
        "b",
        "amber",
        100
      ],
      [
        "CORANOL (Fir)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "DARTANOL™ (Fir)",
        35,
        "h",
        "floral",
        100
      ],
      [
        "DIPROPYLENE GLYCOL",
        40,
        "h",
        "floral",
        100
      ],
      [
        "EXALTOLIDE® TOTAL (Fir)",
        90,
        "b",
        "musk",
        100
      ],
      [
        "HABANOLIDE® (Fir)",
        90,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Fir)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "HEDIONE® HC (Fir)",
        50,
        "h",
        "floral",
        100
      ],
      [
        "ISO E SUPER® (IFF)",
        200,
        "b",
        "woody",
        100
      ],
      [
        "LAVENDER",
        10,
        "t",
        "green",
        100
      ],
      [
        "LINALYL ACETATE",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "METHYLNAPHTYLKETONE BETA",
        5,
        "h",
        "floral",
        100
      ],
      [
        "MUSCENONE™ (Fir)",
        10,
        "b",
        "musk",
        100
      ],
      [
        "NORLIMBANOL™ (Fir)",
        5,
        "h",
        "floral",
        100
      ],
      [
        "PATCHOULI OIL",
        10,
        "b",
        "woody",
        100
      ],
      [
        "SCLAREOLATE® (Fir)",
        200,
        "h",
        "floral",
        100
      ],
      [
        "KOUMALACTONE® 10% TEC (Fir)",
        10,
        "h",
        "gourmand",
        10
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-312",
    "te": "woody musk floral oud type",
    "tr": "Древесно-мускусный цветочный уд (тип)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "woody",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring isoeugenyl acetate, benzyl acetate, aldehyde C-11 undecylenic 10%, alpha-hexyl cinnamaldehyde.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесно-мускусный цветочный уд (тип)». Ключевые материалы структуры: gurjun balsam oil, phenethylol, cypriol oil, sandalwood oil.",
    "pr": {
      "floral": 50,
      "citrus": 3,
      "green": 5,
      "spicy": 1,
      "musk": 5,
      "amber": 9,
      "woody": 15
    },
    "it": [
      [
        "isoeugenyl acetate",
        2,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetate",
        12,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-11 undecylenic 10%",
        4,
        "t",
        "citrus",
        10
      ],
      [
        "alpha-hexyl cinnamaldehyde",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "benzyl benzoate",
        20,
        "h",
        "floral",
        100
      ],
      [
        "benzophenone",
        4,
        "h",
        "floral",
        100
      ],
      [
        "benzyl acetone",
        6,
        "h",
        "floral",
        100
      ],
      [
        "camphor",
        2,
        "t",
        "green",
        100
      ],
      [
        "cedryl methyl ether",
        4,
        "h",
        "floral",
        100
      ],
      [
        "citronellol",
        30,
        "h",
        "floral",
        100
      ],
      [
        "cypriol oil",
        74,
        "h",
        "floral",
        100
      ],
      [
        "dimethyl octanol",
        6,
        "h",
        "floral",
        100
      ],
      [
        "beta-damascone",
        2,
        "h",
        "gourmand",
        100
      ],
      [
        "eugenol",
        2,
        "h",
        "spicy",
        100
      ],
      [
        "exaltolide",
        8,
        "b",
        "musk",
        100
      ],
      [
        "geraniol",
        14,
        "h",
        "floral",
        100
      ],
      [
        "gurjun balsam oil",
        100,
        "b",
        "amber",
        100
      ],
      [
        "helvetolide",
        30,
        "b",
        "musk",
        100
      ],
      [
        "hydroxycitronellal",
        8,
        "t",
        "citrus",
        100
      ],
      [
        "iralia total",
        30,
        "h",
        "floral",
        100
      ],
      [
        "kephalis",
        10,
        "h",
        "floral",
        100
      ],
      [
        "timber propanol",
        2,
        "b",
        "woody",
        100
      ],
      [
        "linalool",
        16,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        10,
        "h",
        "floral",
        100
      ],
      [
        "musk ketone",
        20,
        "b",
        "musk",
        100
      ],
      [
        "nutmeg oil 10%",
        10,
        "h",
        "spicy",
        10
      ],
      [
        "beta-caryophyllene oxide",
        2,
        "h",
        "floral",
        100
      ],
      [
        "hedione",
        70,
        "h",
        "floral",
        100
      ],
      [
        "nerol",
        8,
        "h",
        "floral",
        100
      ],
      [
        "patchouli oil",
        24,
        "b",
        "woody",
        100
      ],
      [
        "phenethylol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "methyl phenyl acetate 10%",
        10,
        "h",
        "floral",
        10
      ],
      [
        "phenethyl phenyl acetate",
        6,
        "h",
        "floral",
        100
      ],
      [
        "rosalva",
        2,
        "h",
        "floral",
        100
      ],
      [
        "rose oil",
        20,
        "h",
        "floral",
        100
      ],
      [
        "rose acetate",
        8,
        "h",
        "floral",
        100
      ],
      [
        "safranal 10%",
        16,
        "h",
        "floral",
        10
      ],
      [
        "ethyl salicylate 10%",
        12,
        "t",
        "green",
        10
      ],
      [
        "benzyl salicylate",
        24,
        "t",
        "green",
        100
      ],
      [
        "cis-3-hexenyl salicylate",
        16,
        "t",
        "green",
        100
      ],
      [
        "sandela",
        36,
        "h",
        "floral",
        100
      ],
      [
        "sandalwood oil",
        72,
        "b",
        "woody",
        100
      ],
      [
        "terpineol",
        8,
        "h",
        "floral",
        100
      ],
      [
        "thymol 10%",
        4,
        "h",
        "spicy",
        10
      ],
      [
        "tonalid",
        8,
        "h",
        "floral",
        100
      ],
      [
        "trimofix O",
        16,
        "h",
        "floral",
        100
      ],
      [
        "phenyl acetaldehyde dimethyl acetal",
        2,
        "t",
        "citrus",
        100
      ],
      [
        "vertofix",
        50,
        "b",
        "woody",
        100
      ],
      [
        "vetiver oil haiti",
        20,
        "b",
        "woody",
        100
      ],
      [
        "3-propyl phenol 1%",
        20,
        "h",
        "floral",
        1
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-313",
    "te": "Woody musk perfume",
    "tr": "Древесный мускусный парфюм",
    "sd": "TGSC (dm1015272) · Patent 7,585,833",
    "fa": "musk",
    "kd": "perfume",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 7,585,833 Malodor covering perfumery.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный мускусный парфюм». Формула из патента 7,585,833. Ключевые материалы структуры: galaxolide 50 IPM, ethylene brassylate, ambroxan, iso e super.",
    "pr": {
      "amber": 18,
      "musk": 50,
      "woody": 18,
      "gourmand": 13,
      "floral": 6
    },
    "it": [
      [
        "ambroxan",
        170,
        "b",
        "amber",
        100
      ],
      [
        "ethylene brassylate",
        180,
        "b",
        "musk",
        100
      ],
      [
        "iso e super",
        110,
        "b",
        "woody",
        100
      ],
      [
        "beta-damascone fab",
        30,
        "h",
        "gourmand",
        100
      ],
      [
        "cashmeran",
        20,
        "b",
        "musk",
        100
      ],
      [
        "manzanate",
        70,
        "h",
        "gourmand",
        100
      ],
      [
        "verdox",
        20,
        "h",
        "gourmand",
        100
      ],
      [
        "hedione HC",
        50,
        "h",
        "floral",
        100
      ],
      [
        "ebanol",
        60,
        "b",
        "woody",
        100
      ],
      [
        "galaxolide 50 IPM",
        280,
        "b",
        "musk",
        50
      ],
      [
        "liffarome",
        10,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-314",
    "te": "Accord N° 208902 Woody oriental (Firmenich)",
    "tr": "Аккорд №208902 · древесный восточный (Firmenich)",
    "sd": "TGSC (dm1015272) · Firmenich",
    "fa": "amber",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): This woody, oriental men's fragrance gains a sparkling topnote and added diffusion / complexity with the addition of FRUCTALATE™. The aromatic notes are enhanced to give depth and complexity to the fragrance..",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Аккорд №208902 · древесный восточный (Firmenich)». Ключевые материалы структуры: ISO E SUPER® (IFF), HEDIONE® (Firmenich), DIHYDROMYRCENOL, CEDRENOL.",
    "pr": {
      "amber": 5,
      "floral": 50,
      "gourmand": 1,
      "citrus": 31,
      "musk": 19,
      "woody": 27,
      "green": 1
    },
    "it": [
      [
        "CETALOX® (Firmenich)",
        10,
        "b",
        "amber",
        100
      ],
      [
        "CEDRENOL",
        100,
        "h",
        "floral",
        100
      ],
      [
        "COUMARIN",
        20,
        "b",
        "amber",
        100
      ],
      [
        "DAMASCONE ALPHA (Firmenich) 10%",
        10,
        "h",
        "gourmand",
        10
      ],
      [
        "DIHYDROMYRCENOL",
        130,
        "t",
        "citrus",
        100
      ],
      [
        "HABANOLIDE® (Firmenich)",
        100,
        "b",
        "musk",
        100
      ],
      [
        "HEDIONE® (Firmenich)",
        160,
        "h",
        "floral",
        100
      ],
      [
        "HELVETOLIDE® (Firmenich)",
        30,
        "b",
        "musk",
        100
      ],
      [
        "ISO E SUPER® (IFF)",
        200,
        "b",
        "woody",
        100
      ],
      [
        "LAVANDIN OIL",
        10,
        "t",
        "green",
        100
      ],
      [
        "LEMON OIL",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "LINALYL ACETATE",
        50,
        "t",
        "citrus",
        100
      ],
      [
        "MAYOL® (Firmenich)",
        40,
        "h",
        "floral",
        100
      ],
      [
        "MUSCENONE™ (Firmenich)",
        10,
        "b",
        "musk",
        100
      ],
      [
        "VANILLIN",
        10,
        "b",
        "amber",
        100
      ],
      [
        "NORLIMBANOL™ 10% MIP (Firmenich)",
        50,
        "h",
        "floral",
        10
      ],
      [
        "FRUCTALATE™ (Firmenich)",
        20,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-315",
    "te": "Woody perfume base (Patent 4,567,291)",
    "tr": "Древесный парфюм парфюмерная база (Патент 4,567,291)",
    "sd": "TGSC (dm1015272) · Patent 4,567,291",
    "fa": "woody",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,567,291 2-Methyl-2-buten-1-yl tiglate.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный парфюм парфюмерная база (Патент 4,567,291)». Формула из патента 4,567,291. Ключевые материалы структуры: phenethyl phenyl acetate, sandalwood oil, benzyl salicylate, madrox.",
    "pr": {
      "floral": 50,
      "citrus": 17,
      "woody": 12,
      "green": 12,
      "musk": 4,
      "spicy": 2
    },
    "it": [
      [
        "phenethyl phenyl acetate",
        170,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        100,
        "h",
        "floral",
        100
      ],
      [
        "phenylacetaldehyde glycerylacetal",
        100,
        "t",
        "citrus",
        100
      ],
      [
        "methyl dihydrojasmonate",
        100,
        "h",
        "floral",
        100
      ],
      [
        "sandalwood oil",
        120,
        "b",
        "woody",
        100
      ],
      [
        "benzyl salicylate",
        120,
        "t",
        "green",
        100
      ],
      [
        "madrox",
        120,
        "h",
        "floral",
        100
      ],
      [
        "hydroxycitronellal",
        60,
        "t",
        "citrus",
        100
      ],
      [
        "ethylene brassylate",
        40,
        "b",
        "musk",
        100
      ],
      [
        "linalool",
        20,
        "h",
        "floral",
        100
      ],
      [
        "eugenol",
        20,
        "h",
        "spicy",
        100
      ],
      [
        "cyclamen aldehyde",
        20,
        "t",
        "citrus",
        100
      ],
      [
        "tiglyl tiglate",
        10,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-316",
    "te": "Woody perfume base (Patent 4,014,905)",
    "tr": "Древесный парфюм парфюмерная база (Патент 4,014,905)",
    "sd": "TGSC (dm1015272) · Patent 4,014,905",
    "fa": "woody",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,014,905 Esters of certain tetramethyl and pentamethyl-1-oxa-spiro [4-5] decan-6-ols with certain alkanoic acids.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный парфюм парфюмерная база (Патент 4,014,905)». Формула из патента 4,014,905. Ключевые материалы структуры: bergamot oil replacer, vetiveryl acetate, cedarwood oil virginia, methyl dihydrojasmonate.",
    "pr": {
      "citrus": 38,
      "woody": 50,
      "floral": 27
    },
    "it": [
      [
        "bergamot oil replacer",
        333.33,
        "t",
        "citrus",
        100
      ],
      [
        "vetiveryl acetate",
        166.67,
        "b",
        "woody",
        100
      ],
      [
        "cedarwood oil virginia",
        133.33,
        "b",
        "woody",
        100
      ],
      [
        "methyl dihydrojasmonate",
        133.33,
        "h",
        "floral",
        100
      ],
      [
        "oakmoss absolute 10%",
        133.33,
        "b",
        "woody",
        10
      ],
      [
        "sandela",
        100,
        "h",
        "floral",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-317",
    "te": "woody type (#317)",
    "tr": "Древесный (тип) (#317)",
    "sd": "TGSC Demo (dm1015272)",
    "fa": "woody",
    "kd": "accord",
    "df": "intermediate",
    "co": "EDP",
    "de": "Reference fragrance demo formula from The Good Scents Company (dm1015272) featuring benzyl acetate, geranyl acetate, aldehyde C-12 mna 10%, ambrox 10%.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный (тип) (#317)». Ключевые материалы структуры: dihydromyrcenol, iso e super, lyral, bergamot oil replacer.",
    "pr": {
      "floral": 50,
      "citrus": 30,
      "spicy": 2,
      "green": 1,
      "woody": 21,
      "musk": 13
    },
    "it": [
      [
        "benzyl acetate",
        25.77,
        "h",
        "floral",
        100
      ],
      [
        "geranyl acetate",
        61.86,
        "h",
        "floral",
        100
      ],
      [
        "aldehyde C-12 mna 10%",
        2.58,
        "t",
        "citrus",
        10
      ],
      [
        "ambrox 10%",
        2.58,
        "b",
        "amber",
        10
      ],
      [
        "bergamot oil replacer",
        77.32,
        "t",
        "citrus",
        100
      ],
      [
        "beta-caryophyllene",
        2.58,
        "h",
        "floral",
        100
      ],
      [
        "lemon oil c.p. california",
        30.93,
        "t",
        "citrus",
        100
      ],
      [
        "citronellol",
        46.39,
        "h",
        "floral",
        100
      ],
      [
        "damascenone 10%",
        10.31,
        "h",
        "floral",
        10
      ],
      [
        "dihydromyrcenol",
        103.09,
        "t",
        "citrus",
        100
      ],
      [
        "eugenol",
        5.15,
        "h",
        "spicy",
        100
      ],
      [
        "watermelon ketone 10%",
        15.46,
        "h",
        "floral",
        10
      ],
      [
        "para-anisyl propanal",
        12.89,
        "h",
        "spicy",
        100
      ],
      [
        "galbanum oil",
        7.73,
        "t",
        "green",
        100
      ],
      [
        "iralia total",
        30.93,
        "h",
        "floral",
        100
      ],
      [
        "iso e super",
        103.09,
        "b",
        "woody",
        100
      ],
      [
        "isocitronellene 10%",
        1.03,
        "h",
        "floral",
        10
      ],
      [
        "lilial",
        41.24,
        "h",
        "floral",
        100
      ],
      [
        "lyral",
        82.47,
        "h",
        "floral",
        100
      ],
      [
        "mandarin oil",
        41.24,
        "t",
        "citrus",
        100
      ],
      [
        "muscenone",
        30.93,
        "b",
        "musk",
        100
      ],
      [
        "hedione",
        77.32,
        "h",
        "floral",
        100
      ],
      [
        "phenethyl alcohol",
        30.93,
        "h",
        "floral",
        100
      ],
      [
        "romandolide",
        77.32,
        "b",
        "musk",
        100
      ],
      [
        "sandal cyclohexanol",
        77.32,
        "b",
        "woody",
        100
      ],
      [
        "vanillin",
        1.55,
        "b",
        "amber",
        100
      ]
    ]
  },
  {
    "id": "tgsc-dm1015272-318",
    "te": "Woody type (Patent 4,570,648)",
    "tr": "Древесный (тип) (Патент 4,570,648)",
    "sd": "TGSC (dm1015272) · Patent 4,570,648",
    "fa": "woody",
    "kd": "accord",
    "df": "beginner",
    "co": "EDP",
    "de": "Reference formula from The Good Scents Company (dm1015272): Patent 4,570,648 Flavorants containing esters of 2,3,6,6-tetramethylcyclohexenyl carboxylic acids.",
    "dr": "Демонстрационная формула из архива TGSC (dm1015272 · Гедион): «Древесный (тип) (Патент 4,570,648)». Формула из патента 4,570,648. Ключевые материалы структуры: sandalwood oil, patchouli oil, bergamot oil bergaptene reduced, cedryl acetate (crystalline).",
    "pr": {
      "green": 4,
      "floral": 46,
      "woody": 50,
      "citrus": 25
    },
    "it": [
      [
        "basil oil",
        30,
        "t",
        "green",
        100
      ],
      [
        "alpha-isomethyl ionone (50% min.)",
        50,
        "h",
        "floral",
        50
      ],
      [
        "lilial",
        50,
        "h",
        "floral",
        100
      ],
      [
        "methyl dihydrojasmonate",
        70,
        "h",
        "floral",
        100
      ],
      [
        "cedryl acetate (crystalline)",
        100,
        "h",
        "floral",
        100
      ],
      [
        "sandalwood oil",
        200,
        "b",
        "woody",
        100
      ],
      [
        "patchouli oil",
        200,
        "b",
        "woody",
        100
      ],
      [
        "bergamot oil bergaptene reduced",
        200,
        "t",
        "citrus",
        100
      ],
      [
        "givescone",
        100,
        "h",
        "floral",
        100
      ]
    ]
  }
]

const TIER_NOTE_IT: Record<"t" | "h" | "b", string> = {
  t: "Nota di testa secondo la formula demo TGSC",
  h: "Nota di cuore secondo la formula demo TGSC",
  b: "Nota di fondo / vettore secondo la formula demo TGSC",
};

const TIER_NOTE_ES: Record<"t" | "h" | "b", string> = {
  t: "Nota de salida según la fórmula demo TGSC",
  h: "Nota de corazón según la fórmula demo TGSC",
  b: "Nota de fondo / portador según la fórmula demo TGSC",
};

const TIER_NOTE_DE: Record<"t" | "h" | "b", string> = {
  t: "Kopfnote gemäß TGSC-Demoformel",
  h: "Herznote gemäß TGSC-Demoformel",
  b: "Basisnote / Träger gemäß TGSC-Demoformel",
};

function localizeTgscTitle(te: string, lang: "it" | "es" | "de"): string {
  let s = te.trim();
  const maps: Record<"it" | "es" | "de", [RegExp, string][]> = {
    it: [
      [/^Accord\s+N°\s*(\d+)\s*[-–]?\s*/i, "Accordo N° $1 · "],
      [/^Accord\s+Number\s*(\d+)\s*[-–]?\s*/i, "Accordo N° $1 · "],
      [/\bPatent\b/gi, "Brevetto"],
      [/\bfragrance\s+composition\b/gi, "Composizione profumata"],
      [/\bperfume\s+composition\b/gi, "Composizione per profumo"],
      [/\bperfume\s+base\b/gi, "Base per profumo"],
      [/\baccord\b/gi, "Accordo"],
      [/\bcomposition\b/gi, "composizione"],
      [/\bfragrance\b/gi, "fragranza"],
      [/\bperfume\b/gi, "profumo"],
      [/\bfloral\b|\bflowery\b/gi, "floreale"],
      [/\bfruity\b/gi, "fruttato"],
      [/\bwoody\b|\bwood\b/gi, "legnoso"],
      [/\bgreen\b/gi, "verde"],
      [/\bcitrus\b/gi, "agrumato"],
      [/\bpowdery\b/gi, "cipriato"],
      [/\bmusk\b|\bmusky\b/gi, "muschiato"],
      [/\bamber\b|\bambery\b/gi, "ambrato"],
      [/\bspicy\b/gi, "speziato"],
      [/\bherbal\b|\bherbaceous\b/gi, "erbaceo"],
      [/\baldehydic\b/gi, "aldeidico"],
      [/\boriental\b/gi, "orientale"],
      [/\bfresh\b/gi, "fresco"],
      [/\bmasculine\b/gi, "maschile"],
      [/\bfeminine\b/gi, "femminile"],
      [/\btype\b/gi, "(tipo)"],
    ],
    es: [
      [/^Accord\s+N°\s*(\d+)\s*[-–]?\s*/i, "Acorde N.° $1 · "],
      [/^Accord\s+Number\s*(\d+)\s*[-–]?\s*/i, "Acorde N.° $1 · "],
      [/\bPatent\b/gi, "Patente"],
      [/\bfragrance\s+composition\b/gi, "Composición aromática"],
      [/\bperfume\s+composition\b/gi, "Composición de perfume"],
      [/\bperfume\s+base\b/gi, "Base de perfume"],
      [/\baccord\b/gi, "Acorde"],
      [/\bcomposition\b/gi, "composición"],
      [/\bfragrance\b/gi, "fragancia"],
      [/\bperfume\b/gi, "perfume"],
      [/\bfloral\b|\bflowery\b/gi, "floral"],
      [/\bfruity\b/gi, "afrutado"],
      [/\bwoody\b|\bwood\b/gi, "amaderado"],
      [/\bgreen\b/gi, "verde"],
      [/\bcitrus\b/gi, "cítrico"],
      [/\bpowdery\b/gi, "empolvado"],
      [/\bmusk\b|\bmusky\b/gi, "almizclado"],
      [/\bamber\b|\bambery\b/gi, "ambarino"],
      [/\bspicy\b/gi, "especiado"],
      [/\bherbal\b|\bherbaceous\b/gi, "herbáceo"],
      [/\baldehydic\b/gi, "aldehídico"],
      [/\boriental\b/gi, "oriental"],
      [/\bfresh\b/gi, "fresco"],
      [/\bmasculine\b/gi, "masculino"],
      [/\bfeminine\b/gi, "femenino"],
      [/\btype\b/gi, "(tipo)"],
    ],
    de: [
      [/^Accord\s+N°\s*(\d+)\s*[-–]?\s*/i, "Akkord Nr. $1 · "],
      [/^Accord\s+Number\s*(\d+)\s*[-–]?\s*/i, "Akkord Nr. $1 · "],
      [/\bfragrance\s+composition\b/gi, "Duftkomposition"],
      [/\bperfume\s+composition\b/gi, "Parfümkomposition"],
      [/\bperfume\s+base\b/gi, "Parfümbasis"],
      [/\baccord\b/gi, "Akkord"],
      [/\bcomposition\b/gi, "Komposition"],
      [/\bfragrance\b/gi, "Duft"],
      [/\bperfume\b/gi, "Parfüm"],
      [/\bfloral\b|\bflowery\b/gi, "blumig"],
      [/\bfruity\b/gi, "fruchtig"],
      [/\bwoody\b|\bwood\b/gi, "holzig"],
      [/\bgreen\b/gi, "grün"],
      [/\bcitrus\b/gi, "zitrisch"],
      [/\bpowdery\b/gi, "pudrig"],
      [/\bmusk\b|\bmusky\b/gi, "Moschus"],
      [/\bamber\b|\bambery\b/gi, "Amber"],
      [/\bspicy\b/gi, "würzig"],
      [/\bherbal\b|\bherbaceous\b/gi, "kräuterig"],
      [/\baldehydic\b/gi, "aldehydisch"],
      [/\boriental\b/gi, "orientalisch"],
      [/\bfresh\b/gi, "frisch"],
      [/\bmasculine\b/gi, "maskulin"],
      [/\bfeminine\b/gi, "feminin"],
      [/\btype\b/gi, "(Typ)"],
    ],
  };
  for (const [re, rep] of maps[lang]) {
    s = s.replace(re, rep);
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const TGSC_DM1015272_FORMULAS: StarterFormulaSpec[] = RAW_DM1015272_ENTRIES.map(
  (entry): StarterFormulaSpec => {
    const titleIt = localizeTgscTitle(entry.te, "it");
    const titleEs = localizeTgscTitle(entry.te, "es");
    const titleDe = localizeTgscTitle(entry.te, "de");
    const topMaterials = [...entry.it]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map((x) => x[0])
      .join(", ");
    return {
      id: entry.id,
      title: {
        ru: entry.tr,
        en: entry.te,
        it: titleIt,
        es: titleEs,
        de: titleDe,
      },
      source: "TGSC",
      sourceDetail: entry.sd,
      sourceUrl: DM1015272_URL,
      difficulty: entry.df,
      kind: entry.kd,
      family: entry.fa,
      targetConcentration: entry.co,
      longevityHours: entry.kd === "accord" ? 8 : 10,
      sillageLevel: "moderate",
      description: {
        ru: entry.dr,
        en: entry.de,
        it: `Formula dimostrativa dall’archivio TGSC (dm1015272 · Hedione): «${titleIt}». Materiali principali della struttura: ${topMaterials}.`,
        es: `Fórmula demostrativa del archivo TGSC (dm1015272 · Hedione): «${titleEs}». Materiales principales de la estructura: ${topMaterials}.`,
        de: `Demonstrationsformel aus dem TGSC-Archiv (dm1015272 · Hedione): „${titleDe}“. Hauptbestandteile der Struktur: ${topMaterials}.`,
      },
      studyTip: {
        ru: "Пропорции нормализованы к 1000 частям по оригинальной таблице TGSC (dm1015272). Носители вроде DIPG/DPG учтены с 0% душистого вещества.",
        en: "Normalized to 1000 parts from TGSC demo archive (dm1015272). Carriers such as DIPG/DPG are treated as 0% pure aromatic oil.",
        it: "Proporzioni normalizzate a 1000 parti dall’archivio TGSC (dm1015272). I solventi come DIPG/DPG sono calcolati allo 0% di sostanza aromatica.",
        es: "Proporciones normalizadas a 1000 partes del archivo TGSC (dm1015272). Los solventes como DIPG/DPG se calculan con 0% de sustancia aromática.",
        de: "Auf 1000 Teile normiert aus dem TGSC-Demoarchiv (dm1015272). Lösungsmittel wie DIPG/DPG werden mit 0% Duftstoffanteil berechnet.",
      },
      profile: { ...EMPTY_PROFILE, ...entry.pr },
      components: entry.it.map(([name, parts, tierKey, family, dilutionPercent]): StarterFormulaComponentSpec => {
        const cleanAlias = name
          .replace(/®|™/g, "")
          .replace(/\([^)]*\)/g, " ")
          .replace(/\b\d+(?:\.\d+)?\s*%.*$/i, "")
          .trim()
          .toLowerCase();
        const isStandaloneDpgCarrier = /^(?:dipg|dpg|dipropylene\s+glycol)$/i.test(name.trim());
        const effectiveTier = isStandaloneDpgCarrier ? "solvent" : TIER_MAP[tierKey];
        const effectiveDilution = isStandaloneDpgCarrier ? 0 : dilutionPercent;
        const noteRu =
          effectiveDilution === 0
            ? "Растворитель / носитель (DPG / DIPG, 0% душистого вещества)"
            : TIER_NOTE_RU[tierKey];
        const noteEn =
          effectiveDilution === 0
            ? "Solvent / carrier (DPG / DIPG, 0% neat aromatic)"
            : TIER_NOTE_EN[tierKey];
        const noteIt =
          effectiveDilution === 0
            ? "Solvente / vettore (DPG / DIPG, 0% sostanza aromatica)"
            : TIER_NOTE_IT[tierKey];
        const noteEs =
          effectiveDilution === 0
            ? "Solvente / portador (DPG / DIPG, 0% sustancia aromática)"
            : TIER_NOTE_ES[tierKey];
        const noteDe =
          effectiveDilution === 0
            ? "Lösungsmittel / Träger (DPG / DIPG, 0% Reinduftstoff)"
            : TIER_NOTE_DE[tierKey];
        return {
          name,
          aliases: isStandaloneDpgCarrier
            ? ["dipg", "dpg", "dipropylene glycol", "дипропиленгликоль", "дпг"]
            : cleanAlias.length >= 3
              ? [cleanAlias]
              : undefined,
          tier: effectiveTier,
          family,
          dilutionPercent: effectiveDilution,
          partsPerThousand: parts,
          costPerGram: isStandaloneDpgCarrier ? 5 : 45,
          note: {
            ru: noteRu,
            en: noteEn,
            it: noteIt,
            es: noteEs,
            de: noteDe,
          },
        };
      }),
    };
  }
);
