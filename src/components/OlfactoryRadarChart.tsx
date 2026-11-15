import { OLFACTORY_FAMILIES, getOlfactoryFamilyShort } from '../data/constants';
import { tr } from '../data/i18n';
import type { AppLanguage, OlfactoryFamilyKey } from '../types/perfume';

interface OlfactoryRadarChartProps {
  profile: Record<OlfactoryFamilyKey, number>;
  size?: number;
  language?: AppLanguage;
}

export function OlfactoryRadarChart({
  profile,
  size = 380,
  language = 'ru',
}: OlfactoryRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.26;
  const totalAxes = OLFACTORY_FAMILIES.length;
  const levels = [2, 4, 6, 8, 10];

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const r = (Math.min(10, Math.max(0, value)) / 10) * radius;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    };
  };

  const polygonPoints = OLFACTORY_FAMILIES.map((fam, idx) => {
    const pt = getPoint(idx, profile?.[fam.key] ?? 0);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[380px] select-none overflow-visible"
        role="img"
        aria-label={tr(language, {
          ru: 'Ольфакторный профиль композиции',
          en: 'Olfactory composition profile',
          it: 'Profilo olfattivo della composizione',
          es: 'Perfil olfativo de la composición',
          de: 'Olfaktorisches Kompositionsprofil',
        })}
      >
        {levels.map((level) => {
          const ringPoints = OLFACTORY_FAMILIES.map((_, idx) => {
            const pt = getPoint(idx, level);
            return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
          }).join(' ');
          return (
            <polygon
              key={level}
              points={ringPoints}
              fill="none"
              stroke={level === 10 ? 'var(--radar-ring-outer)' : 'var(--radar-ring-inner)'}
              strokeWidth={1}
            />
          );
        })}

        {OLFACTORY_FAMILIES.map((fam, idx) => {
          const outer = getPoint(idx, 10);
          const labelPt = getPoint(idx, 12.2);
          const val = profile?.[fam.key] ?? 0;

          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (labelPt.x > cx + 10) textAnchor = 'start';
          else if (labelPt.x < cx - 10) textAnchor = 'end';

          return (
            <g key={fam.key}>
              <line
                x1={cx}
                y1={cy}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--radar-axis)"
                strokeWidth={1}
              />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor={textAnchor}
                dominantBaseline="central"
                fill="var(--radar-label)"
                className="text-[10.5px] font-medium"
              >
                {getOlfactoryFamilyShort(fam.key, language)}
                {val > 0 ? ` (${val})` : ''}
              </text>
            </g>
          );
        })}

        <polygon
          points={polygonPoints}
          fill="var(--theme-accent-ink)"
          fillOpacity={0.18}
          stroke="var(--theme-accent-ink)"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {OLFACTORY_FAMILIES.map((fam, idx) => {
          const val = profile?.[fam.key] ?? 0;
          if (val <= 0) return null;
          const pt = getPoint(idx, val);
          return (
            <circle
              key={fam.key}
              cx={pt.x}
              cy={pt.y}
              r={3.5}
              fill="var(--theme-accent-ink)"
              stroke="var(--radar-dot-stroke)"
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
    </div>
  );
}
