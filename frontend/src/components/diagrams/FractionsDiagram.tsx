// FractionsDiagram.tsx — Pie chart showing fractions with example 3/4
interface Props {
  numerator?: number;
  denominator?: number;
}

export default function FractionsDiagram({ numerator = 3, denominator = 4 }: Props) {
  const cx = 130, cy = 140, r = 90;
  const effectiveDenominator = denominator > 0 ? denominator : 4;
  const effectiveNumerator = Math.max(0, Math.min(numerator, effectiveDenominator));
  const angleSize = 360 / effectiveDenominator;

  // Helper to get arc path for a pie slice
  function slicePath(startAngle: number, endAngle: number, color: string, label: string, labelAngle: number) {
    const toRad = (d: number) => (d - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    const lx = cx + (r * 0.6) * Math.cos(toRad(labelAngle));
    const ly = cy + (r * 0.6) * Math.sin(toRad(labelAngle));
    return { d: `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${large},1 ${x2},${y2} Z`, color, label, lx, ly };
  }

  const slices = Array.from({ length: effectiveDenominator }, (_, index) => {
    const startAngle = index * angleSize;
    const endAngle = (index + 1) * angleSize;
    const filled = index < effectiveNumerator;
    return slicePath(startAngle, endAngle, filled ? '#3AAF82' : '#D1FAE5', `${index + 1}/${effectiveDenominator}`, startAngle + angleSize / 2);
  });
  const fractionText = `${effectiveNumerator}/${effectiveDenominator}`;

  return (
    <svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', background: '#FFFBF5' }}>
      {/* Title */}
      <rect x="10" y="8" width="380" height="34" rx="8" fill="#1F6F50" />
      <text x="200" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">Fractions — Parts of a Whole</text>
      <text x="200" y="36" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.85)">Example: {effectiveNumerator} out of {effectiveDenominator} equal parts = {fractionText}</text>

      {/* Pie slices */}
      {slices.map((s, i) => (
        <g key={i}>
          <path d={s.d} fill={s.color} stroke="white" strokeWidth="2" />
          <text x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="800" fill={i < effectiveNumerator ? 'white' : '#1F6F50'}>{s.label}</text>
        </g>
      ))}

      {/* Highlight shaded slices */}
      {effectiveNumerator > 0 && (
        effectiveNumerator === effectiveDenominator ? (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F5A623" strokeWidth="3" strokeDasharray="6,2" />
        ) : (
          <path
            d={`M ${cx},${cy} L ${cx},${cy - r} A ${r},${r} 0 ${effectiveNumerator * angleSize > 180 ? 1 : 0},1 ${cx + r * Math.cos((effectiveNumerator * angleSize - 90) * (Math.PI / 180))},${cy + r * Math.sin((effectiveNumerator * angleSize - 90) * (Math.PI / 180))} Z`}
            fill="none"
            stroke="#F5A623"
            strokeWidth="3"
            strokeDasharray="6,2"
          />
        )
      )}
      <text x={cx} y={cy + r + 18} textAnchor="middle" fontSize="12" fontWeight="700" fill="#B45309">{effectiveNumerator} shaded slices = {fractionText} (Numerator/Denominator)</text>

      {/* Number line example */}
      <line x1="230" y1="90" x2="390" y2="90" stroke="#374151" strokeWidth="2" />
      {Array.from({ length: effectiveDenominator + 1 }, (_, i) => i).map(i => (
        <g key={i}>
          <line x1={230 + i * (160 / effectiveDenominator)} y1="86" x2={230 + i * (160 / effectiveDenominator)} y2="94" stroke="#374151" strokeWidth="2" />
          <text x={230 + i * (160 / effectiveDenominator)} y="104" textAnchor="middle" fontSize="11" fill="#374151">{i}/{effectiveDenominator}</text>
        </g>
      ))}
      {/* Mark selected fraction */}
      <circle cx={230 + effectiveNumerator * (160 / effectiveDenominator)} cy="90" r="6" fill="#F5A623" />
      <text x={230 + effectiveNumerator * (160 / effectiveDenominator)} y="120" textAnchor="middle" fontSize="11" fontWeight="700" fill="#B45309">{fractionText} here</text>

      {/* Equivalent fractions */}
      <rect x="230" y="135" width="160" height="95" rx="8" fill="#E8F5EF" stroke="#D4E8DC" strokeWidth="1" />
      <text x="310" y="152" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1F6F50">Equivalent Fractions</text>
      <text x="310" y="170" textAnchor="middle" fontSize="13" fontWeight="600" fill="#374151">½ = 2/4 = 4/8</text>
      <text x="310" y="188" textAnchor="middle" fontSize="13" fontWeight="600" fill="#374151">{fractionText} = {effectiveNumerator * 2}/{effectiveDenominator * 2} = {effectiveNumerator * 3}/{effectiveDenominator * 3}</text>
      <text x="310" y="206" textAnchor="middle" fontSize="10" fill="#5A7A6A">Multiply top &amp; bottom by same number</text>

      {/* Labels panel */}
      <text x="240" y="248" fontSize="11" fontWeight="700" fill="#374151">Numerator = top number</text>
      <text x="240" y="264" fontSize="11" fontWeight="700" fill="#374151">Denominator = bottom number</text>
      <rect x="230" y="270" width="160" height="2" fill="#D4E8DC" />
    </svg>
  );
}
