import type { AppLanguage } from '../types/perfume';

export type IfraStandardStatus =
  | 'restricted'
  | 'prohibited'
  | 'eu_banned'
  | 'exempt_fcf'
  | 'unrestricted';

export interface IfraStandardEntry {
  id: string;
  materialName: string;
  casNumbers: string[];
  aliases: string[];
  /** IFRA 51st Amendment Category 4 limit (% in finished product). 0 = prohibited; undefined = not restricted / exempt */
  category4LimitPercent?: number;
  status: IfraStandardStatus;
  ifraCode?: string;
  recommendation: Record<AppLanguage, string>;
}

/**
 * Authoritative IFRA 51st Amendment (Category 4: Fine Fragrance, % in finished product)
 * Verified against IFRA 49th–51st Standards & TGSC regulatory data.
 */
export const IFRA_CATEGORY_4_STANDARDS: IfraStandardEntry[] = [
  // === PROHIBITED / EU-BANNED ===
  {
    id: 'ifra-lyral',
    materialName: 'Lyral (HICC / Hydroxyisohexyl 3-Cyclohexene Carboxaldehyde)',
    casNumbers: ['31906-04-4', '51414-25-6'],
    aliases: ['lyral', 'hicc', 'лираль', 'kovanol', 'mugonal'],
    category4LimitPercent: 0,
    status: 'prohibited',
    ifraCode: 'IFRA_STD_044',
    recommendation: {
      ru: 'Запрещён IFRA и в ЕС (0%). Заменить на Lyral Replacer, Florhydral, Mahonial или Majantol.',
      en: 'Prohibited by IFRA & EU (0%). Replace with Mahonial, Florhydral, Majantol, or a Lyral-free muguet base.',
      it: 'Vietato IFRA e UE (0%). Sostituire con Mahonial o Majantol.',
      es: 'Prohibido por IFRA y UE (0%). Sustituir por Mahonial o Majantol.',
      de: 'Verboten laut IFRA & EU (0%). Durch Mahonial oder Majantol ersetzen.',
    },
  },
  {
    id: 'ifra-musk-ambrette',
    materialName: 'Musk Ambrette',
    casNumbers: ['83-66-9'],
    aliases: ['musk ambrette', 'мускус амбретта'],
    category4LimitPercent: 0,
    status: 'prohibited',
    ifraCode: 'IFRA_STD_066',
    recommendation: {
      ru: 'Запрещён IFRA (0%, нейротоксичность и фотоаллергия). Заменить на Ambrettolide или Ethylene Brassylate.',
      en: 'Prohibited by IFRA (0%, neurotoxicity/photoallergy). Replace with Ambrettolide or Ethylene Brassylate.',
      it: 'Vietato IFRA (0%). Sostituire con Ambrettolide.',
      es: 'Prohibido IFRA (0%). Sustituir por Ambrettolide.',
      de: 'Verboten laut IFRA (0%). Durch Ambrettolid ersetzen.',
    },
  },
  {
    id: 'ifra-lilial',
    materialName: 'Lilial (Butylphenyl Methylpropional / p-BMHCA)',
    casNumbers: ['80-54-6'],
    aliases: ['lilial', 'lily aldehyde', 'lysmeral', 'bmhca', 'p-bmhca', 'лилиаль'],
    category4LimitPercent: 0,
    status: 'eu_banned',
    ifraCode: 'IFRA_STD_015',
    recommendation: {
      ru: 'IFRA Cat. 4 допускал до 1.4%, но вещество ЗАПРЕЩЕНО в ЕС и Великобритании (CMR 1B, 0%). Заменить на Nympheal, Mahonial или Silvial.',
      en: 'IFRA Cat. 4 allowed 1.4%, but BANNED in EU & UK (CMR 1B, 0%). Replace with Nympheal, Mahonial, or Starfleur.',
      it: 'IFRA Cat. 4 era 1.4%, ma VIETATO nell’UE (CMR 1B, 0%). Sostituire con Nympheal.',
      es: 'IFRA Cat. 4 era 1.4%, pero PROHIBIDO en UE (CMR 1B, 0%). Sustituir con Nympheal.',
      de: 'IFRA Cat. 4 war 1.4%, jedoch in der EU VERBOTEN (CMR 1B, 0%). Durch Nympheal ersetzen.',
    },
  },

  // === ULTRA-LOW / TRACE RESTRICTED ===
  {
    id: 'ifra-moc',
    materialName: 'Methyl Octine Carbonate (Methyl 2-Nonynoate)',
    casNumbers: ['111-80-8'],
    aliases: ['methyl octine carbonate', 'methyl-2-octynoate', 'methyl 2-nonynoate', 'folione', 'метилоктинкарбонат'],
    category4LimitPercent: 0.01,
    status: 'restricted',
    ifraCode: 'IFRA_STD_064',
    recommendation: {
      ru: 'Жёсткий лимит IFRA 51 Cat. 4: 0.01% в готовом продукте (совокупно с Methyl Heptine Carbonate). Держать в 1% разведении.',
      en: 'Strict IFRA 51 Cat. 4 cap: 0.01% in finished product (aggregate with MHC). Keep at 1% dilution.',
      it: 'Limite IFRA 51 Cat. 4: 0.01% nel prodotto finito (cumulativo con MHC).',
      es: 'Límite IFRA 51 Cat. 4: 0.01% en producto terminado (acumulado con MHC).',
      de: 'Strenges IFRA 51 Cat. 4 Limit: 0.01% im Endprodukt (Summe mit MHC).',
    },
  },
  {
    id: 'ifra-mhc',
    materialName: 'Methyl Heptine Carbonate (Methyl 2-Octynoate)',
    casNumbers: ['111-12-6'],
    aliases: ['methyl heptine carbonate', 'methyl 2-octynoate', 'vert de violette', 'метилгептинкарбонат'],
    category4LimitPercent: 0.01,
    status: 'restricted',
    ifraCode: 'IFRA_STD_063',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.01% (совокупно с MOC ≤ 0.01%). Для безопасного зелёно-фиалкового листа комбинировать с Undecavertol или Violiff.',
      en: 'IFRA 51 Cat. 4 cap: 0.01% (aggregate with MOC ≤ 0.01%). Combine with Undecavertol or Violiff for lift.',
      it: 'Limite IFRA 51 Cat. 4: 0.01% (cumulativo con MOC).',
      es: 'Límite IFRA 51 Cat. 4: 0.01% (acumulado con MOC).',
      de: 'IFRA 51 Cat. 4 Limit: 0.01% (Summe mit MOC).',
    },
  },
  {
    id: 'ifra-tagetes',
    materialName: 'Tagetes Essential Oil / Absolute (Tagetes patula / erecta)',
    casNumbers: ['91722-29-1', '8016-84-0'],
    aliases: ['tagetes', 'marigold oil', 'бархатцы', 'тагетес'],
    category4LimitPercent: 0.01,
    status: 'restricted',
    ifraCode: 'IFRA_STD_097',
    recommendation: {
      ru: 'Фототоксичность! Лимит IFRA 51 Cat. 4: 0.01% в готовом продукте (≈ 0.05–0.06% в 15–20% концентрате).',
      en: 'Phototoxic! IFRA 51 Cat. 4 cap: 0.01% in finished product (≈ 0.05–0.06% in EDP concentrate).',
      it: 'Fototossico! Limite IFRA 51 Cat. 4: 0.01% nel prodotto finito.',
      es: '¡Fototóxico! Límite IFRA 51 Cat. 4: 0.01% en producto final.',
      de: 'Phototoxisch! IFRA 51 Cat. 4 Limit: 0.01% im Endprodukt.',
    },
  },
  {
    id: 'ifra-methyl-eugenol',
    materialName: 'Methyl Eugenol',
    casNumbers: ['93-15-2'],
    aliases: ['methyl eugenol', 'eugenol methyl ether', 'метилэвгенол'],
    category4LimitPercent: 0.016,
    status: 'restricted',
    ifraCode: 'IFRA_STD_100',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.016%. Входит также природно в Rose Otto, Bay, Basil и Pimento — учитывать общий баланс.',
      en: 'IFRA 51 Cat. 4 cap: 0.016% (count natural contributions from Rose Otto, Basil, Pimento, Bay).',
      it: 'Limite IFRA 51 Cat. 4: 0.016% (incluso apporto da Rosa, Basilico).',
      es: 'Límite IFRA 51 Cat. 4: 0.016% (sumar aporte natural de Rosa, Albahaca).',
      de: 'IFRA 51 Cat. 4 Limit: 0.016% (inkl. natürlicher Anteile aus Rosenöl/Basilikum).',
    },
  },
  {
    id: 'ifra-rose-ketones',
    materialName: 'Rose Ketones (Damascenone, Alpha/Beta/Delta-Damascone)',
    casNumbers: ['23696-85-7', '23726-93-4', '24720-09-0', '23726-91-2', '23726-92-3', '57378-68-4', '71048-82-3', '43052-87-5'],
    aliases: ['damascenone', 'beta-damascenone', 'damascone', 'alpha-damascone', 'beta-damascone', 'delta-damascone', 'dorinone', 'дамасценон', 'дамаскон', 'rose ketone'],
    category4LimitPercent: 0.043,
    status: 'restricted',
    ifraCode: 'IFRA_STD_077',
    recommendation: {
      ru: 'Суммарный лимит всех Rose Ketones (Damascenone + α/β/δ-Damascone) по IFRA 51 Cat. 4: 0.043% в готовом продукте (≈ 0.21% в 20% EDP).',
      en: 'Aggregate Rose Ketones limit (Damascenone + α/β/δ-Damascone) under IFRA 51 Cat. 4: 0.043% in finished product.',
      it: 'Limite cumulativo Rose Ketones IFRA 51 Cat. 4: 0.043% nel prodotto finito.',
      es: 'Límite acumulado Rose Ketones IFRA 51 Cat. 4: 0.043% en producto final.',
      de: 'Summen-Limit für Rose Ketones IFRA 51 Cat. 4: 0.043% im Endprodukt.',
    },
  },
  {
    id: 'ifra-cinnamon-bark',
    materialName: 'Cinnamon Bark Essential Oil (Cinnamomum zeylanicum)',
    casNumbers: ['8015-91-6', '84649-98-9'],
    aliases: ['cinnamon bark', 'кора корицы', 'корица кора'],
    category4LimitPercent: 0.05,
    status: 'restricted',
    ifraCode: 'IFRA_STD_016',
    recommendation: {
      ru: 'Сильный сенсибилизатор (60–75% коричного альдегида). Лимит IFRA Cat. 4: ~0.05–0.07% в готовом продукте.',
      en: 'Potent sensitizer (~65% cinnamaldehyde). IFRA 51 Cat. 4 practical ceiling: ~0.05–0.07% finished product.',
      it: 'Sensibilizzante forte: max ~0.05% nel prodotto finito IFRA Cat. 4.',
      es: 'Sensibilizante fuerte: máx ~0.05% en producto final IFRA Cat. 4.',
      de: 'Starker Sensibilisator: max ~0.05% im Endprodukt laut IFRA Cat. 4.',
    },
  },

  // === LOW-THRESHOLD RESTRICTED MATERIALS ===
  {
    id: 'ifra-oakmoss',
    materialName: 'Oakmoss Absolute / Extract (Evernia prunastri)',
    casNumbers: ['90028-68-5', '9000-50-4', '68917-10-2'],
    aliases: ['oakmoss', 'evernia prunastri', 'mousse de chene', 'дубовый мох'],
    category4LimitPercent: 0.1,
    status: 'restricted',
    ifraCode: 'IFRA_STD_069',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.1% в готовом продукте (обязательно низкоатраноловый / IFRA compliant экстракт). Для усиления сочетайте с Evernyl.',
      en: 'IFRA 51 Cat. 4 cap: 0.1% in finished product (low-atranol compliant grade required). Pair with Evernyl (unrestricted).',
      it: 'Limite IFRA 51 Cat. 4: 0.1% (usare estratto a basso atranolo; abbinabile a Evernyl).',
      es: 'Límite IFRA 51 Cat. 4: 0.1% (requiere extracto bajo en atranol; reforzar con Evernyl).',
      de: 'IFRA 51 Cat. 4 Limit: 0.1% (Atranol-armer Extrakt Pflicht; kombinierbar mit Evernyl).',
    },
  },
  {
    id: 'ifra-treemoss',
    materialName: 'Treemoss Absolute / Extract (Evernia furfuracea)',
    casNumbers: ['90028-67-4', '68648-41-9'],
    aliases: ['treemoss', 'evernia furfuracea', 'mousse d’arbre', 'древесный мох'],
    category4LimitPercent: 0.1,
    status: 'restricted',
    ifraCode: 'IFRA_STD_098',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.1% в готовом продукте (обязателен контроль смоляных кислот и атранола).',
      en: 'IFRA 51 Cat. 4 cap: 0.1% in finished product (resinous acid & atranol specs apply).',
      it: 'Limite IFRA 51 Cat. 4: 0.1% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4: 0.1% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit: 0.1% im Endprodukt.',
    },
  },
  {
    id: 'ifra-methyl-n-methylanthranilate',
    materialName: 'Methyl N-Methylanthranilate (Dimethyl Anthranilate)',
    casNumbers: ['85-91-6'],
    aliases: ['methyl n-methylanthranilate', 'dimethyl anthranilate', 'метил-n-метилантранилат', 'диметилантранилат'],
    category4LimitPercent: 0.1,
    status: 'restricted',
    ifraCode: 'IFRA_STD_062',
    recommendation: {
      ru: 'Фототоксичность! Лимит IFRA 51 Cat. 4: 0.1% в готовом продукте (учитывать долю из эфирного масла петитгрейна мандарина).',
      en: 'Phototoxic! IFRA 51 Cat. 4 cap: 0.1% in finished product (also present naturally in mandarin petitgrain).',
      it: 'Fototossico! Limite IFRA 51 Cat. 4: 0.1% nel prodotto finito.',
      es: '¡Fototóxico! Límite IFRA 51 Cat. 4: 0.1% en producto terminado.',
      de: 'Phototoxisch! IFRA 51 Cat. 4 Limit: 0.1% im Endprodukt.',
    },
  },
  {
    id: 'ifra-isoeugenol',
    materialName: 'Isoeugenol',
    casNumbers: ['97-54-1', '5932-68-3'],
    aliases: ['isoeugenol', 'iso-eugenol', 'изоэвгенол'],
    category4LimitPercent: 0.11,
    status: 'restricted',
    ifraCode: 'IFRA_STD_048',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.11% в готовом продукте (≈ 0.55% в 20% EDP). Для более высоких доз гвоздичной пряности заменять частью Eugenol (2.5%) или Isoeugenyl Acetate.',
      en: 'IFRA 51 Cat. 4 cap: 0.11% in finished product (≈ 0.55% in 20% EDP). Extend with Eugenol or Isoeugenyl Acetate.',
      it: 'Limite IFRA 51 Cat. 4: 0.11% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4: 0.11% en producto final.',
      de: 'IFRA 51 Cat. 4 Limit: 0.11% im Endprodukt.',
    },
  },
  {
    id: 'ifra-anisic-aldehyde',
    materialName: 'Anisic Aldehyde (p-Methoxybenzaldehyde / Aubepine)',
    casNumbers: ['123-11-5'],
    aliases: ['anisic aldehyde', 'anisaldehyde', 'p-methoxybenzaldehyde', 'aubepine', 'анисовый альдегид'],
    category4LimitPercent: 0.21,
    status: 'restricted',
    ifraCode: 'IFRA_STD_054',
    recommendation: {
      ru: 'Обновлён в IFRA 49/51! Лимит Cat. 4: 0.21% в готовом продукте (ранее указывались устаревшие 1.4%+). Держать в 10% разведении.',
      en: 'Updated in IFRA 49/51! Cat. 4 cap is 0.21% in finished product (replaces older ~1.4% guidance).',
      it: 'Aggiornato IFRA 49/51: limite Cat. 4 pari a 0.21% nel prodotto finito.',
      es: 'Actualizado IFRA 49/51: límite Cat. 4 de 0.21% en producto terminado.',
      de: 'Aktualisiert in IFRA 49/51: Cat. 4 Limit beträgt 0.21% im Endprodukt.',
    },
  },
  {
    id: 'ifra-benzaldehyde',
    materialName: 'Benzaldehyde',
    casNumbers: ['100-52-7'],
    aliases: ['benzaldehyde', 'бензальдегид'],
    category4LimitPercent: 0.25,
    status: 'restricted',
    ifraCode: 'IFRA_STD_007',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.25% в готовом продукте. При больших дозах миндально-вишнёвого аккорда дополнять Heliotropin, Coumarin или Acetophenone.',
      en: 'IFRA 51 Cat. 4 cap: 0.25% in finished product. Support almond/cherry accords with Heliotropin or Acetophenone.',
      it: 'Limite IFRA 51 Cat. 4: 0.25% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4: 0.25% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit: 0.25% im Endprodukt.',
    },
  },
  {
    id: 'ifra-cinnamal',
    materialName: 'Cinnamal (Cinnamic Aldehyde)',
    casNumbers: ['104-55-2', '14371-10-9'],
    aliases: ['cinnamal', 'cinnamic aldehyde', 'cinnamaldehyde', 'коричный альдегид'],
    category4LimitPercent: 0.25,
    status: 'restricted',
    ifraCode: 'IFRA_STD_018',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.25% в готовом продукте (для пряностей с высокой сенсибилизацией; в 10% разведении работать точнее).',
      en: 'IFRA 51 Cat. 4 cap: 0.25% in finished product. Work from a 10% dilution for accuracy.',
      it: 'Limite IFRA 51 Cat. 4: 0.25% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4: 0.25% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit: 0.25% im Endprodukt.',
    },
  },
  {
    id: 'ifra-phenylacetaldehyde',
    materialName: 'Phenylacetaldehyde',
    casNumbers: ['122-78-1'],
    aliases: ['phenylacetaldehyde', 'phenyl acetaldehyde', 'hyacinthin', 'фенилацетальдегид'],
    category4LimitPercent: 0.25,
    status: 'restricted',
    ifraCode: 'IFRA_STD_072',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.25% в готовом продукте (≈ 1.25% в концентрате EDP 20%).',
      en: 'IFRA 51 Cat. 4 cap: 0.25% in finished product (≈ 1.25% in 20% EDP concentrate).',
      it: 'Limite IFRA 51 Cat. 4: 0.25% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4: 0.25% en producto final.',
      de: 'IFRA 51 Cat. 4 Limit: 0.25% im Endprodukt.',
    },
  },
  {
    id: 'ifra-bergamot-expressed',
    materialName: 'Bergamot Oil Expressed (with Bergapten)',
    casNumbers: ['8007-75-8', '89957-91-5'],
    aliases: ['bergamot expressed', 'bergamot oil', 'bergamot cold pressed', 'бергамот прессованный'],
    category4LimitPercent: 0.4,
    status: 'restricted',
    ifraCode: 'IFRA_STD_012',
    recommendation: {
      ru: 'Фототоксичность бергаптена! Для обычного прессованного масла лимит IFRA Cat. 4: 0.4% в готовом продукте (для версии FCF ограничение 0.4% снимается).',
      en: 'Phototoxicity cap! Expressed bergamot WITH bergapten is capped at 0.4% in finished product (FCF bergapten-free grade is exempt).',
      it: 'Fototossico (bergaptene): 0.4% max per olio espresso (versione FCF esente).',
      es: 'Fototóxico (bergapteno): máx 0.4% aceite prensado (grado FCF sin restricción).',
      de: 'Phototoxisch (Bergapten): max 0.4% bei kaltgepresstem Öl (FCF-Qualität befreit).',
    },
  },
  {
    id: 'ifra-bergamot-fcf',
    materialName: 'Bergamot Oil FCF (Bergapten-Free)',
    casNumbers: [],
    aliases: ['bergamot fcf', 'bergamot essential oil fcf', 'calabrian bergamot fcf', 'бергамот калабрия fcf', 'без бергаптена', 'bergapten-free', 'bergaptene-free', 'bergaptenfrei', 'sin bergapteno', 'senza bergaptene'],
    category4LimitPercent: undefined,
    status: 'exempt_fcf',
    ifraCode: 'IFRA_STD_012_FCF',
    recommendation: {
      ru: 'Версия FCF очищена от фурокумаринов (бергаптена) и ОСВОБОЖДЕНА от фототоксического лимита IFRA 0.4% (возможен свободный ввод 5–25%).',
      en: 'FCF (bergapten-free) grade is furocoumarin-free and EXEMPT from the 0.4% IFRA phototoxicity cap.',
      it: 'Grado FCF privo di bergaptene: esente dal limite fototossico IFRA dello 0.4%.',
      es: 'Grado FCF libre de bergapteno: exento del límite fototóxico IFRA del 0.4%.',
      de: 'FCF-Qualität (bergaptenfrei): vom phototoxischen 0.4%-IFRA-Limit befreit.',
    },
  },
  {
    id: 'ifra-peru-balsam',
    materialName: 'Peru Balsam Oil / Distillate (Myroxylon pereirae)',
    casNumbers: ['8007-00-9'],
    aliases: ['peru balsam', 'balsam peru', 'перуанский бальзам', 'перу бальзам'],
    category4LimitPercent: 0.41,
    status: 'restricted',
    ifraCode: 'IFRA_STD_071',
    recommendation: {
      ru: 'Неочищенный бальзам запрещён. Дистиллят/экстракт допускается в IFRA 51 Cat. 4 до 0.41% в готовом продукте.',
      en: 'Crude Peru balsam is prohibited; IFRA-compliant distillate/extract is capped at 0.41% in Cat. 4 finished product.',
      it: 'Balsamo grezzo vietato; distillato IFRA Cat. 4 max 0.41% nel prodotto finito.',
      es: 'Bálsamo crudo prohibido; destilado IFRA Cat. 4 máx 0.41% en producto final.',
      de: 'Roher Perubalsam verboten; Destillat in IFRA Cat. 4 max 0.41% im Endprodukt.',
    },
  },
  {
    id: 'ifra-bourgeonal',
    materialName: 'Bourgeonal',
    casNumbers: ['18127-01-0'],
    aliases: ['bourgeonal', 'буржеональ'],
    category4LimitPercent: 0.47,
    status: 'restricted',
    ifraCode: 'IFRA_STD_014',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.47% в готовом продукте (ландышевый альдегид, осторожно с суммарной нагрузкой сенсибилизаторов).',
      en: 'IFRA 51 Cat. 4 cap: 0.47% in finished product (muguet aldehyde).',
      it: 'Limite IFRA 51 Cat. 4: 0.47% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4: 0.47% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit: 0.47% im Endprodukt.',
    },
  },
  {
    id: 'ifra-clove-bud',
    materialName: 'Clove Bud / Leaf Essential Oil',
    casNumbers: ['84961-50-2', '8000-34-8'],
    aliases: ['clove bud', 'clove oil', 'clove leaf', 'гвоздика эм', 'масло гвоздики'],
    category4LimitPercent: 0.5,
    status: 'restricted',
    ifraCode: 'IFRA_STD_035_NCS',
    recommendation: {
      ru: 'Содержит 75–85% эвгенола: практический предел IFRA Cat. 4 составляет ~0.5–3.0% (проверять содержание эвгенола/изоэвгенола по сертификату партии).',
      en: 'Rich in eugenol (75–85%); monitor cumulative eugenol ≤ 2.5% and trace isoeugenol (≤ 0.11%) under IFRA 51 Cat. 4.',
      it: 'Ricco di eugenolo: verificare il limite cumulativo di eugenolo/isoeugenolo IFRA Cat. 4.',
      es: 'Rico en eugenol: controlar el acumulado de eugenol/isoeugenol IFRA Cat. 4.',
      de: 'Reich an Eugenol: Summenlimit für Eugenol/Isoeugenol gemäß IFRA Cat. 4 prüfen.',
    },
  },
  {
    id: 'ifra-citral',
    materialName: 'Citral (Neral / Geranial)',
    casNumbers: ['5392-40-5', '141-27-5', '106-26-3'],
    aliases: ['citral', 'lemongrass', 'litsea cubeba', 'verbena', 'цитраль', 'лемонграсс', 'литсея'],
    category4LimitPercent: 0.6,
    status: 'restricted',
    ifraCode: 'IFRA_STD_021',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.6% в готовом продукте (учитывать также цитраль, привносимый Лемоном, Вербеной, Литсеей и Лемонграссом).',
      en: 'IFRA 51 Cat. 4 cap: 0.6% in finished product (cumulative across Lemon, Litsea Cubeba, Lemongrass, Verbena).',
      it: 'Limite IFRA 51 Cat. 4: 0.6% cumulativo nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4: 0.6% acumulado en producto terminado.',
      de: 'IFRA 51 Cat. 4 Summenlimit: 0.6% im Endprodukt.',
    },
  },
  {
    id: 'ifra-opoponax',
    materialName: 'Opoponax Oil / Resinoid (Commiphora erythraea)',
    casNumbers: ['8021-36-1'],
    aliases: ['opoponax', 'oppoponax', 'sweet myrrh', 'опопонакс'],
    category4LimitPercent: 0.6,
    status: 'restricted',
    ifraCode: 'IFRA_STD_070',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.6% в готовом продукте (при использовании IFRA-очищенного экстракта без фототоксичных фракций).',
      en: 'IFRA 51 Cat. 4 cap: 0.6% in finished product.',
      it: 'Limite IFRA 51 Cat. 4: 0.6% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4: 0.6% en producto final.',
      de: 'IFRA 51 Cat. 4 Limit: 0.6% im Endprodukt.',
    },
  },
  {
    id: 'ifra-styrax',
    materialName: 'Styrax Distillate / Pyrogenic Extract (Liquidambar)',
    casNumbers: ['8046-19-3', '8024-01-9'],
    aliases: ['styrax', 'storax', 'liquidambar', 'стиракс'],
    category4LimitPercent: 0.64,
    status: 'restricted',
    ifraCode: 'IFRA_STD_078',
    recommendation: {
      ru: 'Сырой стиракс запрещён. Очищенный/дистиллированный стиракс в IFRA 51 Cat. 4 ограничен до 0.64% в готовом продукте.',
      en: 'Crude styrax is prohibited; rectified/distilled styrax is capped at 0.64% in IFRA 51 Cat. 4 finished product.',
      it: 'Stirace grezzo vietato; distillato IFRA 51 Cat. 4 max 0.64%.',
      es: 'Estoraque crudo prohibido; destilado IFRA 51 Cat. 4 máx 0.64%.',
      de: 'Roher Styrax verboten; rektifiziert in IFRA 51 Cat. 4 max 0.64%.',
    },
  },
  {
    id: 'ifra-lime-expressed',
    materialName: 'Lime Oil Expressed (Citrus aurantifolia)',
    casNumbers: ['8008-26-2', '90063-52-8'],
    aliases: ['lime expressed', 'lime oil expressed', 'лайм прессованный'],
    category4LimitPercent: 0.7,
    status: 'restricted',
    ifraCode: 'IFRA_STD_092',
    recommendation: {
      ru: 'Фототоксичность! Холодно-прессованное масло лайма ограничено 0.7% в Cat. 4 (паро-дистиллированный или FCF лайм не ограничен по фототоксичности).',
      en: 'Phototoxic! Cold-pressed Lime EO is capped at 0.7% in Cat. 4 (steam-distilled / FCF lime is exempt).',
      it: 'Fototossico: Lime espresso max 0.7% (distillato esente).',
      es: 'Fototóxico: Lima prensada máx 0.7% (destilada exenta).',
      de: 'Phototoxisch: Kaltgepresste Limette max 0.7% (destilliert befreit).',
    },
  },
  {
    id: 'ifra-jasmine-grandiflorum',
    materialName: 'Jasmine Grandiflorum Absolute (Jasminum grandiflorum)',
    casNumbers: ['8022-96-6', '84776-64-7'],
    aliases: ['jasmine grandiflorum', 'jasminum grandiflorum', 'jasmine absolute', 'жасмин грандифлорум'],
    category4LimitPercent: 0.7,
    status: 'restricted',
    ifraCode: 'IFRA_STD_050',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4 для Жасмина Грандифлорум: 0.7% в готовом продукте (≈ 3.5% в 20% EDP концентрате). Для более высоких доз использовать Jasmine Sambac (до 3.8%).',
      en: 'IFRA 51 Cat. 4 cap for Jasmine Grandiflorum Abs.: 0.7% finished product (use Jasmine Sambac up to 3.8% for higher doses).',
      it: 'Limite IFRA 51 Cat. 4 Gelsomino Grandiflorum: 0.7% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Jazmín Grandiflorum: 0.7% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit für Jasminum Grandiflorum: 0.7% im Endprodukt.',
    },
  },
  {
    id: 'ifra-ylang',
    materialName: 'Ylang-Ylang Essential Oil / Extra / Complete',
    casNumbers: ['8006-81-3', '83863-30-3'],
    aliases: ['ylang-ylang', 'ylang ylang', 'cananga odorata', 'иланг-иланг', 'иланг'],
    category4LimitPercent: 0.73,
    status: 'restricted',
    ifraCode: 'IFRA_STD_082',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.73% в готовом продукте (≈ 3.65% в 20% EDP). Учитывать вклад Isoeugenol / Farnesol / Benzyl Salicylate.',
      en: 'IFRA 51 Cat. 4 cap: 0.73% in finished product (≈ 3.65% in 20% EDP). Watch cumulative isoeugenol.',
      it: 'Limite IFRA 51 Cat. 4 Ylang-Ylang: 0.73% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Ylang-Ylang: 0.73% en producto final.',
      de: 'IFRA 51 Cat. 4 Limit für Ylang-Ylang: 0.73% im Endprodukt.',
    },
  },
  {
    id: 'ifra-canthoxal',
    materialName: 'Canthoxal (Anisyl Propanal)',
    casNumbers: ['5462-06-6'],
    aliases: ['canthoxal', 'кантоксаль', 'anisyl propanal'],
    category4LimitPercent: 0.82,
    status: 'restricted',
    ifraCode: 'IFRA_STD_057',
    recommendation: {
      ru: 'Обновлён в IFRA 49/51! Лимит Cat. 4: 0.82% в готовом продукте (≈ 4.1% в 20% EDP; старые базы давали 2.5%).',
      en: 'IFRA 51 Cat. 4 cap: 0.82% in finished product (replaces older 2.5% guidance).',
      it: 'Limite IFRA 51 Cat. 4: 0.82% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4: 0.82% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit: 0.82% im Endprodukt.',
    },
  },
  {
    id: 'ifra-cyclamen-aldehyde',
    materialName: 'Cyclamen Aldehyde (2-Methyl-3-(p-isopropylphenyl)propionaldehyde)',
    casNumbers: ['103-95-7'],
    aliases: ['cyclamen aldehyde', 'цикламена альдегид', 'цикламенальдегид'],
    category4LimitPercent: 0.95,
    status: 'restricted',
    ifraCode: 'IFRA_STD_025',
    recommendation: {
      ru: 'Обновлён в IFRA 49/51! Лимит Cat. 4: 0.95% в готовом продукте (ранее указывалось до 5%). Поддерживать цветочную свежесть без превышения можно с Florhydral или Dupical.',
      en: 'Updated in IFRA 49/51! Cat. 4 cap is 0.95% in finished product (replaces outdated 5% references).',
      it: 'Aggiornato IFRA 49/51: limite Cat. 4 pari a 0.95% nel prodotto finito.',
      es: 'Actualizado IFRA 49/51: límite Cat. 4 de 0.95% en producto final.',
      de: 'Aktualisiert in IFRA 49/51: Cat. 4 Limit beträgt 0.95% im Endprodukt.',
    },
  },
  {
    id: 'ifra-citronellal',
    materialName: 'Citronellal',
    casNumbers: ['106-23-0'],
    aliases: ['citronellal', 'цитронеллаль'],
    category4LimitPercent: 1.06,
    status: 'restricted',
    ifraCode: 'IFRA_STD_099',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 1.06% в готовом продукте.',
      en: 'IFRA 51 Cat. 4 cap: 1.06% in finished product.',
      it: 'Limite IFRA 51 Cat. 4: 1.06% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4: 1.06% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit: 1.06% im Endprodukt.',
    },
  },
  {
    id: 'ifra-cinnamic-alcohol',
    materialName: 'Cinnamic Alcohol (Cinnamyl Alcohol)',
    casNumbers: ['104-54-1'],
    aliases: ['cinnamic alcohol', 'cinnamyl alcohol', 'коричный спирт'],
    category4LimitPercent: 1.2,
    status: 'restricted',
    ifraCode: 'IFRA_STD_017',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 1.2% в готовом продукте (обновлён с 0.4% в 48-й поправке до 1.2% — до ~6% в 20% EDP).',
      en: 'IFRA 51 Cat. 4 cap: 1.2% in finished product (raised from older 0.4% cap to 1.2%).',
      it: 'Limite IFRA 51 Cat. 4: 1.2% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4: 1.2% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit: 1.2% im Endprodukt.',
    },
  },
  {
    id: 'ifra-farnesol',
    materialName: 'Farnesol',
    casNumbers: ['4602-84-0'],
    aliases: ['farnesol', 'фарнезол'],
    category4LimitPercent: 1.2,
    status: 'restricted',
    ifraCode: 'IFRA_STD_036',
    recommendation: {
      ru: 'Обновлён в IFRA 49/51! Лимит Cat. 4: 1.2% в готовом продукте (в некоторых базах ошибочно указывалось 10%).',
      en: 'Updated in IFRA 49/51! Cat. 4 cap is 1.2% in finished product (replaces erroneous 10% values).',
      it: 'Aggiornato IFRA 49/51: limite Cat. 4 pari a 1.2% nel prodotto finito.',
      es: 'Actualizado IFRA 49/51: límite Cat. 4 de 1.2% en producto final.',
      de: 'Aktualisiert in IFRA 49/51: Cat. 4 Limit beträgt 1.2% im Endprodukt.',
    },
  },
  {
    id: 'ifra-bitter-orange',
    materialName: 'Bitter Orange Peel Oil Expressed (Citrus aurantium)',
    casNumbers: ['68916-04-1', '72968-50-4'],
    aliases: ['bitter orange', 'orange bigarade', 'горький апельсин', 'померанец'],
    category4LimitPercent: 1.25,
    status: 'restricted',
    ifraCode: 'IFRA_STD_087',
    recommendation: {
      ru: 'Фототоксичность! Лимит IFRA Cat. 4 для холодно-прессованного горького апельсина: 1.25% в готовом продукте (≈ 6.25% в 20% EDP).',
      en: 'Phototoxic! Cold-pressed Bitter Orange EO cap in IFRA Cat. 4: 1.25% in finished product.',
      it: 'Fototossico: Arancia amara espressa max 1.25% nel prodotto finito.',
      es: 'Fototóxico: Naranja amarga prensada máx 1.25% en producto final.',
      de: 'Phototoxisch: Kaltgepresste Bitterorange max 1.25% im Endprodukt.',
    },
  },
  {
    id: 'ifra-coumarin',
    materialName: 'Coumarin',
    casNumbers: ['91-64-5'],
    aliases: ['coumarin', 'кумарин', 'tonka bean camphor'],
    category4LimitPercent: 1.5,
    status: 'restricted',
    ifraCode: 'IFRA_STD_023',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 1.5% в готовом продукте (≈ 7.5% в 20% EDP концентрате). При суммировании с абсолютом бобов тонка учитывать долю кумарина в экстракте.',
      en: 'IFRA 51 Cat. 4 cap: 1.5% in finished product (≈ 7.5% in 20% EDP). Account for tonka absolute coumarin content.',
      it: 'Limite IFRA 51 Cat. 4 Cumarina: 1.5% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Cumarina: 1.5% en producto final.',
      de: 'IFRA 51 Cat. 4 Limit für Cumarin: 1.5% im Endprodukt.',
    },
  },
  {
    id: 'ifra-verbena',
    materialName: 'Verbena Oil / Absolute (Lippia citriodora)',
    casNumbers: ['8024-12-2'],
    aliases: ['verbena', 'lippia citriodora', 'вербена'],
    category4LimitPercent: 0.2,
    status: 'restricted',
    ifraCode: 'IFRA_STD_053',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 0.2% (натуральное масло вербены сильно ограничено; безопасная альтернатива — ректифицированное масло или Citral ≤ 0.6%).',
      en: 'IFRA 51 Cat. 4 cap: 0.2% for Lippia citriodora extract.',
      it: 'Limite IFRA 51 Cat. 4 Verbena: 0.2%.',
      es: 'Límite IFRA 51 Cat. 4 Verbena: 0.2%.',
      de: 'IFRA 51 Cat. 4 Limit für Eisenkraut (Verbena): 0.2%.',
    },
  },
  {
    id: 'ifra-lemon-expressed',
    materialName: 'Lemon Oil Expressed (Citrus limon)',
    casNumbers: ['8008-56-8', '84929-31-7'],
    aliases: ['lemon oil', 'lemon cold pressed', 'lemon expressed', 'лимон эм', 'масло лимона', 'сицилийский лимон'],
    category4LimitPercent: 2.0,
    status: 'restricted',
    ifraCode: 'IFRA_STD_093',
    recommendation: {
      ru: 'Фототоксичность! Холодно-прессованное масло лимона ограничено 2.0% в Cat. 4 (≈ 10% в 20% EDP). Паро-дистиллированный лимон освобождён от 2.0%.',
      en: 'Phototoxic! Cold-pressed Lemon EO cap in Cat. 4: 2.0% (≈ 10% in 20% EDP). Distilled lemon oil is exempt from 2.0%.',
      it: 'Fototossico: Limone espresso max 2.0% nel prodotto finito (distillato esente).',
      es: 'Fototóxico: Limón prensado máx 2.0% en producto final (destilado exento).',
      de: 'Phototoxisch: Kaltgepresstes Zitronenöl max 2.0% im Endprodukt.',
    },
  },
  {
    id: 'ifra-hydroxycitronellal',
    materialName: 'Hydroxycitronellal',
    casNumbers: ['107-75-5'],
    aliases: ['hydroxycitronellal', 'laurine', 'гидроксицитронеллаль'],
    category4LimitPercent: 2.1,
    status: 'restricted',
    ifraCode: 'IFRA_STD_043',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 2.1% в готовом продукте (≈ 10.5% в 20% EDP концентрате). В ЕС требуется декларация аллергена на этикетке > 0.001%.',
      en: 'IFRA 51 Cat. 4 cap: 2.1% in finished product (≈ 10.5% in 20% EDP).',
      it: 'Limite IFRA 51 Cat. 4 Idrossicitronellale: 2.1% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Hidroxicitronelal: 2.1% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit für Hydroxycitronellal: 2.1% im Endprodukt.',
    },
  },
  {
    id: 'ifra-exaltolide',
    materialName: 'Pentadecanolide (Exaltolide / Thibetolide)',
    casNumbers: ['106-02-5'],
    aliases: ['exaltolide', 'pentadecanolide', 'pentadecalactone', 'thibetolide', 'экзальтолид', 'пентадеканолид'],
    category4LimitPercent: 2.4,
    status: 'restricted',
    ifraCode: 'IFRA_STD_026',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4 (введён с 49/51 поправки): 2.4% в готовом продукте (≈ 12% в 20% EDP).',
      en: 'IFRA 51 Cat. 4 cap: 2.4% in finished product (≈ 12% in 20% EDP concentrate).',
      it: 'Limite IFRA 51 Cat. 4 Pentadecalattone / Exaltolide: 2.4% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Exaltolide: 2.4% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit für Exaltolid / Pentadecanolid: 2.4% im Endprodukt.',
    },
  },
  {
    id: 'ifra-eugenol',
    materialName: 'Eugenol',
    casNumbers: ['97-53-0'],
    aliases: ['eugenol', 'эвгенол'],
    category4LimitPercent: 2.5,
    status: 'restricted',
    ifraCode: 'IFRA_STD_035',
    recommendation: {
      ru: 'Актуальный лимит IFRA 51 Cat. 4: 2.5% в готовом продукте (≈ 12.5% в 20% EDP; в старых источниках встречалось 0.5% от 48-й поправки). Учитывать вклад масел гвоздики, корицы и бея.',
      en: 'IFRA 51 Cat. 4 cap: 2.5% in finished product (replaces outdated 0.5% pre-49th guidance). Sum with Clove/Bay.',
      it: 'Limite IFRA 51 Cat. 4 Eugenolo: 2.5% nel prodotto finito (aggiornato dal vecchio 0.5%).',
      es: 'Límite IFRA 51 Cat. 4 Eugenol: 2.5% en producto terminado (actualizado desde 0.5%).',
      de: 'IFRA 51 Cat. 4 Limit für Eugenol: 2.5% im Endprodukt (statt veralteter 0.5%).',
    },
  },
  {
    id: 'ifra-triplal',
    materialName: 'Triplal / Ligustral (2,4-Dimethyl-3-cyclohexene carboxaldehyde)',
    casNumbers: ['68039-49-6', '27939-60-2'],
    aliases: ['triplal', 'ligustral', 'trivertal', 'vertocitral', 'триплаль', 'лигустраль'],
    category4LimitPercent: 2.5,
    status: 'restricted',
    ifraCode: 'IFRA_STD_030',
    recommendation: {
      ru: 'Ограничен по IFRA 51 Cat. 4: до 2.5% в готовом продукте (≈ 12.5% в 20% EDP).',
      en: 'IFRA 51 Cat. 4 cap: 2.5% in finished product (≈ 12.5% in 20% EDP concentrate).',
      it: 'Limite IFRA 51 Cat. 4 Triplal / Ligustral: 2.5% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Triplal: 2.5% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit für Triplal / Ligustral: 2.5% im Endprodukt.',
    },
  },
  {
    id: 'ifra-benzyl-alcohol',
    materialName: 'Benzyl Alcohol',
    casNumbers: ['100-51-6'],
    aliases: ['benzyl alcohol', 'бензиловый спирт'],
    category4LimitPercent: 2.5,
    status: 'restricted',
    ifraCode: 'IFRA_STD_008',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 2.5% в готовом продукте (≈ 12.5% в 20% EDP).',
      en: 'IFRA 51 Cat. 4 cap: 2.5% in finished product.',
      it: 'Limite IFRA 51 Cat. 4 Alcol benzilico: 2.5% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Alcohol bencílico: 2.5% en producto final.',
      de: 'IFRA 51 Cat. 4 Limit für Benzylalkohol: 2.5% im Endprodukt.',
    },
  },
  {
    id: 'ifra-helional',
    materialName: 'Helional (Ocean Propanal / Tropional)',
    casNumbers: ['1205-17-0'],
    aliases: ['helional', 'tropional', 'aquanal', 'гелиональ'],
    category4LimitPercent: 2.6,
    status: 'restricted',
    ifraCode: 'IFRA_STD_059',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 2.6% в готовом продукте (≈ 13% в 20% EDP).',
      en: 'IFRA 51 Cat. 4 cap: 2.6% in finished product (≈ 13% in 20% EDP).',
      it: 'Limite IFRA 51 Cat. 4 Helional: 2.6% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Helional: 2.6% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit für Helional: 2.6% im Endprodukt.',
    },
  },
  {
    id: 'ifra-jasmine-sambac',
    materialName: 'Jasmine Sambac Absolute (Jasminum sambac)',
    casNumbers: ['91770-14-8'],
    aliases: ['jasmine sambac', 'jasminum sambac', 'жасмин самбак'],
    category4LimitPercent: 3.8,
    status: 'restricted',
    ifraCode: 'IFRA_STD_051',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4 для Жасмина Самбак: 3.8% в готовом продукте (≈ 19% в 20% EDP; заметно мягче, чем у Grandiflorum 0.7%).',
      en: 'IFRA 51 Cat. 4 cap for Jasmine Sambac Abs.: 3.8% in finished product.',
      it: 'Limite IFRA 51 Cat. 4 Gelsomino Sambac: 3.8% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Jazmín Sambac: 3.8% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit für Jasmin Sambac: 3.8% im Endprodukt.',
    },
  },
  {
    id: 'ifra-cashmeran',
    materialName: 'Cashmeran (DPMI)',
    casNumbers: ['33704-61-9'],
    aliases: ['cashmeran', 'dpmi', 'кашмеран', 'cashmere wood'],
    category4LimitPercent: 3.8,
    status: 'restricted',
    ifraCode: 'IFRA_STD_028',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 3.8% в готовом продукте (≈ 19% в 20% EDP концентрате). Обычные дозы 0.5–8% концентрата укладываются с запасом.',
      en: 'IFRA 51 Cat. 4 cap: 3.8% in finished product (≈ 19% in 20% EDP concentrate).',
      it: 'Limite IFRA 51 Cat. 4 Cashmeran: 3.8% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Cashmeran: 3.8% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit für Cashmeran: 3.8% im Endprodukt.',
    },
  },
  {
    id: 'ifra-grapefruit-expressed',
    materialName: 'Grapefruit Oil Expressed (Citrus paradisi)',
    casNumbers: ['8016-20-4', '90045-43-5'],
    aliases: ['grapefruit oil', 'grapefruit expressed', 'грейпфрут эм', 'масло грейпфрута'],
    category4LimitPercent: 4.0,
    status: 'restricted',
    ifraCode: 'IFRA_STD_091',
    recommendation: {
      ru: 'Фототоксичность! Холодно-прессованное масло грейпфрута ограничено 4.0% в Cat. 4 (≈ 20% в 20% EDP).',
      en: 'Phototoxic! Expressed Grapefruit EO cap in Cat. 4: 4.0% in finished product.',
      it: 'Fototossico: Pompelmo espresso max 4.0% nel prodotto finito.',
      es: 'Fototóxico: Pomelo prensado máx 4.0% en producto terminado.',
      de: 'Phototoxisch: Kaltgepresste Grapefruit max 4.0% im Endprodukt.',
    },
  },
  {
    id: 'ifra-geraniol',
    materialName: 'Geraniol',
    casNumbers: ['106-24-1'],
    aliases: ['geraniol', 'гераниол'],
    category4LimitPercent: 4.7,
    status: 'restricted',
    ifraCode: 'IFRA_STD_037',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 4.7% в готовом продукте (≈ 23.5% в 20% EDP; при добавлении масла розы/пальмарозы/герани учитывать суммарный гераниол).',
      en: 'IFRA 51 Cat. 4 cap: 4.7% in finished product (sum with Geranium, Rose & Palmarosa EOs).',
      it: 'Limite IFRA 51 Cat. 4 Geraniolo: 4.7% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Geraniol: 4.7% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit für Geraniol: 4.7% im Endprodukt.',
    },
  },
  {
    id: 'ifra-benzyl-benzoate',
    materialName: 'Benzyl Benzoate',
    casNumbers: ['120-51-4'],
    aliases: ['benzyl benzoate', 'бензилбензоат'],
    category4LimitPercent: 4.8,
    status: 'restricted',
    ifraCode: 'IFRA_STD_009',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 4.8% в готовом продукте (≈ 24% в 20% EDP). При использовании как растворителя смол/мускусов учитывать его долю.',
      en: 'IFRA 51 Cat. 4 cap: 4.8% in finished product (account for its weight if used as a resin/musk solvent).',
      it: 'Limite IFRA 51 Cat. 4 Benzil benzoato: 4.8% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Benzoato de bencilo: 4.8% en producto final.',
      de: 'IFRA 51 Cat. 4 Limit für Benzylbenzoat: 4.8% im Endprodukt.',
    },
  },
  {
    id: 'ifra-amyl-cinnamaldehyde',
    materialName: 'Alpha-Amyl Cinnamaldehyde',
    casNumbers: ['122-40-7'],
    aliases: ['amyl cinnamic aldehyde', 'amyl cinnamaldehyde', 'flosal', 'buxine', 'амилкоричный альдегид'],
    category4LimitPercent: 7.0,
    status: 'restricted',
    ifraCode: 'IFRA_STD_005',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 7.0% в готовом продукте (≈ 35% в 20% EDP).',
      en: 'IFRA 51 Cat. 4 cap: 7.0% in finished product.',
      it: 'Limite IFRA 51 Cat. 4 Amil cinnamaldeide: 7.0% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Amil cinamaldehído: 7.0% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit für Amylzimtaldehyd: 7.0% im Endprodukt.',
    },
  },
  {
    id: 'ifra-benzyl-salicylate',
    materialName: 'Benzyl Salicylate',
    casNumbers: ['118-58-1'],
    aliases: ['benzyl salicylate', 'бензилсалицилат'],
    category4LimitPercent: 7.3,
    status: 'restricted',
    ifraCode: 'IFRA_STD_011',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 7.3% в готовом продукте (≈ 36.5% в 20% EDP).',
      en: 'IFRA 51 Cat. 4 cap: 7.3% in finished product.',
      it: 'Limite IFRA 51 Cat. 4 Benzil salicilato: 7.3% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Salicilato de bencilo: 7.3% en producto final.',
      de: 'IFRA 51 Cat. 4 Limit für Benzylsalicylat: 7.3% im Endprodukt.',
    },
  },
  {
    id: 'ifra-hexyl-cinnamaldehyde',
    materialName: 'Alpha-Hexyl Cinnamaldehyde',
    casNumbers: ['101-86-0'],
    aliases: ['hexyl cinnamaldehyde', 'hexyl cinnamic aldehyde', 'hexyl cinnamal', 'гексилкоричный альдегид'],
    category4LimitPercent: 9.9,
    status: 'restricted',
    ifraCode: 'IFRA_STD_040',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 9.9% в готовом продукте (≈ 49.5% в 20% EDP).',
      en: 'IFRA 51 Cat. 4 cap: 9.9% in finished product.',
      it: 'Limite IFRA 51 Cat. 4 Esil cinnamaldeide: 9.9% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Hexil cinamaldehído: 9.9% en producto final.',
      de: 'IFRA 51 Cat. 4 Limit für Hexylzimtaldehyd: 9.9% im Endprodukt.',
    },
  },
  {
    id: 'ifra-citronellol',
    materialName: 'Citronellol',
    casNumbers: ['106-22-9', '7540-51-4'],
    aliases: ['citronellol', 'l-citronellol', 'цитронеллол'],
    category4LimitPercent: 12.0,
    status: 'restricted',
    ifraCode: 'IFRA_STD_022',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 12.0% в готовом продукте (суммировать вклад розового и гераниевого масел).',
      en: 'IFRA 51 Cat. 4 cap: 12.0% in finished product (sum with Rose & Geranium contributions).',
      it: 'Limite IFRA 51 Cat. 4 Citronellolo: 12.0% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Citronelol: 12.0% en producto final.',
      de: 'IFRA 51 Cat. 4 Limit für Citronellol: 12.0% im Endprodukt.',
    },
  },
  {
    id: 'ifra-iso-e-super',
    materialName: 'Iso E Super / OTNE',
    casNumbers: ['54464-57-2', '68155-66-8', '68155-67-9'],
    aliases: ['iso e super', 'otne', 'timbersilk', 'sylvamber', 'orbitone', 'изо е супер'],
    category4LimitPercent: 20.0,
    status: 'restricted',
    ifraCode: 'IFRA_STD_068',
    recommendation: {
      ru: 'Обновлён в IFRA 51 Cat. 4: 20.0% в готовом продукте (уточнён с 21.4% из 49-й поправки). В 20% EDP позволяет вплоть до 100% формулы концентрата.',
      en: 'IFRA 51 Cat. 4 cap: 20.0% in finished product (updated from older 21.4%). At 20% EDP concentration, practically non-limiting.',
      it: 'Limite IFRA 51 Cat. 4 Iso E Super (OTNE): 20.0% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Iso E Super (OTNE): 20.0% en producto final.',
      de: 'IFRA 51 Cat. 4 Limit für Iso E Super (OTNE): 20.0% im Endprodukt.',
    },
  },
  {
    id: 'ifra-methyl-ionone',
    materialName: 'Methyl Ionones (Alpha-Isomethyl Ionone & Isomers)',
    casNumbers: ['127-51-5', '1335-46-2', '127-42-4', '127-43-5'],
    aliases: ['methyl ionone', 'alpha-isomethyl ionone', 'raldeine', 'isoraldeine', 'метилионон'],
    category4LimitPercent: 30.0,
    status: 'restricted',
    ifraCode: 'IFRA_STD_065',
    recommendation: {
      ru: 'Лимит IFRA 51 Cat. 4: 30.0% в готовом продукте (чистота по псевдо-метилиононам < 2%). Практически не ограничивает концентраты.',
      en: 'IFRA 51 Cat. 4 cap: 30.0% in finished product (pseudo-methyl ionone impurities < 2%).',
      it: 'Limite IFRA 51 Cat. 4 Metil iononi: 30.0% nel prodotto finito.',
      es: 'Límite IFRA 51 Cat. 4 Metil iononas: 30.0% en producto terminado.',
      de: 'IFRA 51 Cat. 4 Limit für Methylionone: 30.0% im Endprodukt.',
    },
  },

  // === EXPLICITLY UNRESTRICTED IN IFRA 51 CAT. 4 (prevents false stale limits) ===
  {
    id: 'ifra-unres-ambroxan',
    materialName: 'Ambroxan / Ambroxide / Cetalox',
    casNumbers: ['6790-58-5', '3738-00-9'],
    aliases: ['ambroxan', 'ambroxide', 'ambrofix', 'cetalox', 'ambrox super', 'ambrox dl', 'амброксан', 'амброкс', 'амброфикс'],
    category4LimitPercent: undefined,
    status: 'unrestricted',
    recommendation: {
      ru: 'Не ограничен IFRA 51 в категории 4 (безопасен даже при высоком вводе в нишевых и древесно-амбровых формулах).',
      en: 'Not restricted under IFRA 51 Category 4.',
      it: 'Non limitato secondo IFRA 51 Cat. 4.',
      es: 'No restringido por IFRA 51 Cat. 4.',
      de: 'Nicht beschränkt gemäß IFRA 51 Cat. 4.',
    },
  },
  {
    id: 'ifra-unres-galaxolide',
    materialName: 'Galaxolide (HHCB)',
    casNumbers: ['1222-05-5'],
    aliases: ['galaxolide', 'hhcb', 'abbalide', 'галаксолид'],
    category4LimitPercent: undefined,
    status: 'unrestricted',
    recommendation: {
      ru: 'Не ограничен IFRA 51 в категории 4 (количественного потолка нет; стандартные рабочие дозы — 2–25% концентрата).',
      en: 'Not restricted under IFRA 51 Category 4.',
      it: 'Non limitato secondo IFRA 51 Cat. 4.',
      es: 'No restringido por IFRA 51 Cat. 4.',
      de: 'Nicht beschränkt gemäß IFRA 51 Cat. 4.',
    },
  },
  {
    id: 'ifra-unres-cedar-atlas',
    materialName: 'Atlas Cedarwood Essential Oil',
    casNumbers: ['8000-27-9', '92201-55-3'],
    aliases: ['atlas cedar', 'cedarwood atlas', 'cedrus atlantica', 'кедр атласский'],
    category4LimitPercent: undefined,
    status: 'unrestricted',
    recommendation: {
      ru: 'Не ограничен IFRA 51 в категории 4 (соблюдать чистоту от пероксидов при хранении).',
      en: 'Not restricted under IFRA 51 Category 4 (prevent oxidation/peroxides during storage).',
      it: 'Non limitato secondo IFRA 51 Cat. 4.',
      es: 'No restringido por IFRA 51 Cat. 4.',
      de: 'Nicht beschränkt gemäß IFRA 51 Cat. 4.',
    },
  },
  {
    id: 'ifra-unres-galbanum',
    materialName: 'Galbanum Essential Oil / Resinoid',
    casNumbers: ['8023-91-4', '93165-40-3'],
    aliases: ['galbanum', 'ferula galbaniflua', 'гальбанум'],
    category4LimitPercent: undefined,
    status: 'unrestricted',
    recommendation: {
      ru: 'Не ограничен IFRA 51 в категории 4 (из-за высокой ольфакторной мощи обычно вводят 0.02–0.5%).',
      en: 'Not restricted under IFRA 51 Category 4 (typically dosed at 0.02–0.5% due to high odor strength).',
      it: 'Non limitato secondo IFRA 51 Cat. 4.',
      es: 'No restringido por IFRA 51 Cat. 4.',
      de: 'Nicht beschränkt gemäß IFRA 51 Cat. 4.',
    },
  },
  {
    id: 'ifra-unres-vetiver',
    materialName: 'Vetiver Essential Oil (Haiti / Java / Bourbon)',
    casNumbers: ['8016-96-4', '84238-29-9'],
    aliases: ['vetiver', 'vetiveria', 'chrysopogon zizanioides', 'ветивер'],
    category4LimitPercent: undefined,
    status: 'unrestricted',
    recommendation: {
      ru: 'Само масло ветивера НЕ ограничено IFRA 51 в категории 4 (учитывать лишь возможный следовой furfural < 0.001%, если указан в спецификации партии).',
      en: 'Vetiver EO itself is not restricted under IFRA 51 Cat. 4.',
      it: 'L’olio di Vetiver non è limitato da IFRA 51 Cat. 4.',
      es: 'El aceite esencial de Vetiver no está restringido por IFRA 51 Cat. 4.',
      de: 'Vetiveröl selbst ist unter IFRA 51 Cat. 4 nicht beschränkt.',
    },
  },
  {
    id: 'ifra-unres-evernyl',
    materialName: 'Evernyl / Veramoss (Methyl Beta-Orcinol Carboxylate)',
    casNumbers: ['4707-47-5'],
    aliases: ['evernyl', 'veramoss', 'methyl atrarate', 'эвернил', 'верамосс'],
    category4LimitPercent: undefined,
    status: 'unrestricted',
    recommendation: {
      ru: 'Безопасный IFRA-заменитель дубового мха: НЕ ограничен IFRA 51 (можно использовать без жёсткого потолка 0.1%).',
      en: 'IFRA-friendly oakmoss alternative: NOT restricted under IFRA 51 Category 4.',
      it: 'Alternativa sicura al muschio di quercia: NON limitato IFRA 51 Cat. 4.',
      es: 'Alternativa segura al musgo de roble: NO restringido IFRA 51 Cat. 4.',
      de: 'IFRA-freundlicher Eichenmoos-Ersatz: NICHT beschränkt unter IFRA 51 Cat. 4.',
    },
  },
  {
    id: 'ifra-unres-aldehyde-c12-mna',
    materialName: 'Aldehyde C-12 MNA (2-Methylundecanal)',
    casNumbers: ['110-41-8'],
    aliases: ['aldehyde c-12 mna', 'aldehyde c12 mna', '2-methylundecanal', 'methyl nonyl acetaldehyde', 'альдегид c-12 mna', 'альдегид с-12 ундеканаль'],
    category4LimitPercent: undefined,
    status: 'unrestricted',
    recommendation: {
      ru: 'Не ограничен IFRA 51 в категории 4 (0.01–0.3% — рекомендуемая рабочая дозировка, а не запретный предел IFRA).',
      en: 'Not restricted under IFRA 51 Cat. 4 (0.01–0.3% is typical artistic usage, not an IFRA ceiling).',
      it: 'Non limitato da IFRA 51 Cat. 4.',
      es: 'No restringido por IFRA 51 Cat. 4.',
      de: 'Nicht beschränkt gemäß IFRA 51 Cat. 4.',
    },
  },
  {
    id: 'ifra-unres-muscenone',
    materialName: 'Muscenone (Firmenich)',
    casNumbers: ['82356-51-2'],
    aliases: ['muscenone', 'мусценон'],
    category4LimitPercent: undefined,
    status: 'unrestricted',
    recommendation: {
      ru: 'Не ограничен IFRA 51 в категории 4.',
      en: 'Not restricted under IFRA 51 Category 4.',
      it: 'Non limitato secondo IFRA 51 Cat. 4.',
      es: 'No restringido por IFRA 51 Cat. 4.',
      de: 'Nicht beschränkt gemäß IFRA 51 Cat. 4.',
    },
  },
  {
    id: 'ifra-unres-hedione',
    materialName: 'Hedione / Methyl Dihydrojasmonate',
    casNumbers: ['24851-98-7'],
    aliases: ['hedione', 'methyl dihydrojasmonate', 'kharismal', 'гедион'],
    category4LimitPercent: undefined,
    status: 'unrestricted',
    recommendation: {
      ru: 'Не ограничен IFRA 51 в категории 4 (свободный ввод, обычно 3–35% концентрата).',
      en: 'Not restricted under IFRA 51 Category 4.',
      it: 'Non limitato secondo IFRA 51 Cat. 4.',
      es: 'No restringido por IFRA 51 Cat. 4.',
      de: 'Nicht beschränkt gemäß IFRA 51 Cat. 4.',
    },
  },
  {
    id: 'ifra-unres-pink-pepper',
    materialName: 'Pink Pepper CO2 / Essential Oil (Schinus molle)',
    casNumbers: ['68917-52-2', '94334-31-3', '949619-25-4'],
    aliases: ['pink pepper', 'schinus molle', 'baies roses', 'розовый перец'],
    category4LimitPercent: undefined,
    status: 'unrestricted',
    recommendation: {
      ru: 'Не имеет отдельного ограничения IFRA 51 (ориентироваться только на следовые натуральные составляющие ~28% по сертификату партии).',
      en: 'No standalone IFRA 51 restriction (only NCS trace constituent limits ~28%+ per supplier COA).',
      it: 'Nessuna restrizione autonoma IFRA 51 Cat. 4.',
      es: 'Sin restricción autónoma IFRA 51 Cat. 4.',
      de: 'Keine eigenständige IFRA 51 Cat. 4 Beschränkung.',
    },
  },
  {
    id: 'ifra-unres-dpg',
    materialName: 'DIPG / DPG (Dipropylene Glycol)',
    casNumbers: ['25265-71-8', '110-98-5'],
    aliases: [
      'dipg',
      'dpg',
      'dipropylene glycol',
      'dipropyleneglycol',
      'dpg - dipropylene glycol - dow',
      'dipropylene glycol (fragrance grade) / дипропиленгликоль (дпг)',
      'дипропиленгликоль',
      'дпг',
    ],
    category4LimitPercent: undefined,
    status: 'unrestricted',
    recommendation: {
      ru: 'Не ограничен IFRA 51 в категории 4.',
      en: 'Not restricted under IFRA 51 Category 4.',
      it: 'Non limitato secondo IFRA 51 Cat. 4.',
      es: 'No restringido por IFRA 51 Cat. 4.',
      de: 'Nicht beschränkt gemäß IFRA 51 Cat. 4.',
    },
  },
];

const ENTRY_BY_CAS = new Map<string, IfraStandardEntry>();
const ENTRY_BY_ALIAS = new Map<string, IfraStandardEntry>();

for (const entry of IFRA_CATEGORY_4_STANDARDS) {
  for (const cas of entry.casNumbers) {
    ENTRY_BY_CAS.set(cas.trim().toLowerCase(), entry);
  }
  for (const alias of entry.aliases) {
    ENTRY_BY_ALIAS.set(alias.trim().toLowerCase(), entry);
  }
}

function normalizeCas(raw?: string): string {
  if (!raw) return '';
  const m = raw.match(/\b\d{2,7}-\d{2}-\d\b/);
  return m ? m[0].toLowerCase() : raw.trim().toLowerCase().replace(/^cas\s+/i, '');
}

function isFcfBergamotName(nameLower: string): boolean {
  if (!/bergamot|бергамот|bergamote|bergamott/i.test(nameLower)) return false;
  return /fcf|bergapten[- ]?free|bergaptene[- ]?free|без\s+бергаптен|senza\s+bergaptene|sin\s+bergapteno|bergaptenfrei|furocoumarin[- ]?free/i.test(
    nameLower
  );
}

const SORTED_ALIAS_PATTERNS: Array<{
  alias: string;
  rx: RegExp;
  entry: IfraStandardEntry;
}> = (() => {
  const pairs: Array<{ alias: string; rx: RegExp; entry: IfraStandardEntry }> = [];
  for (const entry of IFRA_CATEGORY_4_STANDARDS) {
    if (entry.id === 'ifra-unres-dpg') continue;
    for (const rawAlias of entry.aliases) {
      const alias = rawAlias.trim().toLowerCase();
      if (alias.length >= 5) {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        pairs.push({
          alias,
          rx: new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, 'iu'),
          entry,
        });
      }
    }
  }
  pairs.sort((a, b) => b.alias.length - a.alias.length);
  return pairs;
})();

const BERGAMOT_FCF_ENTRY = IFRA_CATEGORY_4_STANDARDS.find((e) => e.id === 'ifra-bergamot-fcf');
const EVERNYL_ENTRY = IFRA_CATEGORY_4_STANDARDS.find((e) => e.id === 'ifra-unres-evernyl');
const DPG_ENTRY = IFRA_CATEGORY_4_STANDARDS.find((e) => e.id === 'ifra-unres-dpg');
const RESOLVED_IFRA_CACHE = new Map<string, IfraStandardEntry | undefined>();

/**
 * Resolves authoritative IFRA 51st Category 4 standard & guidance for any material
 * by CAS number, canonical name, or alias.
 */
export function resolveIfraStandard(item: {
  name?: string;
  inciOrCas?: string;
  aliases?: string[];
  synonyms?: string[];
}): IfraStandardEntry | undefined {
  const nameLower = (item.name || '').trim().toLowerCase();
  const cas = normalizeCas(item.inciOrCas);
  const cacheKey = `${nameLower}|${cas || ''}|${(item.aliases || []).join('\u0001')}|${(item.synonyms || []).join('\u0001')}`;
  if (RESOLVED_IFRA_CACHE.has(cacheKey)) {
    return RESOLVED_IFRA_CACHE.get(cacheKey);
  }

  const compute = (): IfraStandardEntry | undefined => {
    if (isFcfBergamotName(nameLower)) {
      return BERGAMOT_FCF_ENTRY;
    }

    if (/evernyl|veramoss|эвернил|верамосс/i.test(nameLower)) {
      return EVERNYL_ENTRY;
    }

    if (
      /bergamot|бергамот|bergamote|bergamott/i.test(nameLower) &&
      /distilled|rectified|фурокумарин|без\s+фото/i.test(nameLower)
    ) {
      return BERGAMOT_FCF_ENTRY;
    }

    const isPureDpgCarrierName =
      /^(?:dipg|dpg|dipropylene\s*glycol|дипропиленгликоль|дпг)(?:\s*(?:\(|\/|-|–|,)\s*(?:dow|fragrance\s*grade|dipropylene\s*glycol|дипропиленгликоль|дпг|cas\s*[\d-]+|\))*)*$/i.test(
        nameLower
      );
    if (isPureDpgCarrierName) {
      return DPG_ENTRY;
    }

    if (cas) {
      const casHit = ENTRY_BY_CAS.get(cas);
      if (casHit) return casHit;
    }

    if (nameLower) {
      const exact = ENTRY_BY_ALIAS.get(nameLower);
      if (exact) return exact;
    }

    const candidateStrings = [nameLower, ...(item.aliases || []), ...(item.synonyms || [])]
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length >= 3);

    for (const cand of candidateStrings) {
      const hit = ENTRY_BY_ALIAS.get(cand);
      if (hit && hit.id !== 'ifra-unres-dpg') return hit;
    }

    for (const cand of candidateStrings) {
      for (const { alias, rx, entry } of SORTED_ALIAS_PATTERNS) {
        if (
          (entry.id === 'ifra-isoeugenol' || entry.id === 'ifra-methyl-eugenol') &&
          cand.includes(alias)
        ) {
          return entry;
        }
        if (rx.test(cand)) {
          return entry;
        }
      }
    }

    return undefined;
  };

  const result = compute();
  RESOLVED_IFRA_CACHE.set(cacheKey, result);
  return result;
}

/**
 * Extracts explicit IFRA numeric % from library property text (handles comma decimals cleanly).
 * Returns undefined if text explicitly says unrestricted / not limited.
 */
export function parseIfraLimitFromProperties(propertiesText?: string): number | undefined {
  if (!propertiesText) return undefined;
  if (/IFRA[^.;]*не\s*огранич|IFRA[^.;]*без\s*огранич|Not\s*restricted\s*under\s*IFRA/i.test(propertiesText)) {
    return undefined;
  }
  const match = propertiesText.match(
    /(?:Ограничение\s+IFRA|IFRA(?:\s+51)?(?:\s+Cat\.?\s*4)?(?:\s+лимит|\s+limit)?)\s*[:—-]?\s*(?:до|<=|≤|up\s+to)?\s*(\d+(?:[.,]\d+)?)\s*%/i
  );
  if (!match) return undefined;
  const parsed = Number(match[1].replace(',', '.'));
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100 ? parsed : undefined;
}
