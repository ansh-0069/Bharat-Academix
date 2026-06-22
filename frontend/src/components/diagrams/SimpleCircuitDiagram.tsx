// SimpleCircuitDiagram.tsx
export default function SimpleCircuitDiagram() {
  return (
    <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', background: '#FAFAF7' }}>
      <defs>
        <marker id="sc-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#F59E0B" />
        </marker>
      </defs>

      {/* Title */}
      <rect x="100" y="8" width="200" height="28" rx="7" fill="#1F6F50" />
      <text x="200" y="27" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">Simple Electric Circuit</text>

      {/* Circuit wire rectangle */}
      <rect x="60" y="60" width="280" height="160" rx="4" fill="none" stroke="#374151" strokeWidth="3" />

      {/* Battery (left side, center) */}
      {/* Long plate = positive, short = negative */}
      <line x1="60" y1="120" x2="60" y2="108" stroke="#374151" strokeWidth="3" />
      <line x1="60" y1="108" x2="80" y2="108" stroke="#374151" strokeWidth="3" />
      <line x1="80" y1="100" x2="80" y2="116" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
      <line x1="90" y1="104" x2="90" y2="112" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
      <line x1="90" y1="108" x2="110" y2="108" stroke="#374151" strokeWidth="3" />
      <line x1="110" y1="108" x2="110" y2="120" stroke="#374151" strokeWidth="3" />
      {/* Battery label */}
      <rect x="62" y="125" width="50" height="20" rx="4" fill="#FEF9C3" stroke="#D97706" strokeWidth="1" />
      <text x="87" y="139" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400E">Battery</text>
      <text x="76" y="103" fontSize="9" fontWeight="700" fill="#15803D">+</text>
      <text x="94" y="106" fontSize="9" fontWeight="700" fill="#DC2626">−</text>

      {/* Bulb (top center) */}
      <circle cx="200" cy="60" r="18" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />
      <line x1="194" y1="53" x2="206" y2="67" stroke="#D97706" strokeWidth="2" />
      <line x1="206" y1="53" x2="194" y2="67" stroke="#D97706" strokeWidth="2" />
      <text x="200" y="90" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400E">Bulb (Load)</text>

      {/* Switch (right side) */}
      <line x1="340" y1="100" x2="340" y2="120" stroke="#374151" strokeWidth="3" />
      <line x1="340" y1="160" x2="340" y2="180" stroke="#374151" strokeWidth="3" />
      <line x1="340" y1="120" x2="340" y2="152" stroke="#374151" strokeWidth="2.5" strokeDasharray="3,2" transform="rotate(-15 340 120)" />
      <circle cx="340" cy="120" r="5" fill="#374151" />
      <circle cx="340" cy="160" r="5" fill="#374151" />
      <rect x="352" y="128" width="40" height="20" rx="4" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1" />
      <text x="372" y="142" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1D4ED8">Switch</text>

      {/* Resistor (bottom) */}
      <line x1="140" y1="220" x2="160" y2="220" stroke="#374151" strokeWidth="3" />
      <rect x="160" y="210" width="80" height="20" rx="3" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.5" />
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={168 + i * 14} y1="210" x2={168 + i * 14} y2="230" stroke="#DC2626" strokeWidth="1.5" />
      ))}
      <line x1="240" y1="220" x2="260" y2="220" stroke="#374151" strokeWidth="3" />
      <text x="200" y="248" textAnchor="middle" fontSize="10" fontWeight="700" fill="#B91C1C">Resistor (Ω)</text>

      {/* Current flow arrows */}
      <path d="M 170 60 Q 90 60 60 80" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#sc-arrow)" />
      <path d="M 60 155 Q 60 220 140 220" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#sc-arrow)" />
      <path d="M 260 220 Q 340 220 340 180" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#sc-arrow)" />
      <path d="M 340 100 Q 340 60 230 60" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#sc-arrow)" />

      {/* Current label */}
      <text x="90" y="200" fontSize="9" fontWeight="600" fill="#B45309">Current flow</text>
      <text x="90" y="213" fontSize="9" fill="#B45309">(conventional)</text>

      {/* Ohm's law */}
      <rect x="10" y="250" width="380" height="22" rx="6" fill="#E8F5EF" stroke="#D4E8DC" strokeWidth="1" />
      <text x="200" y="265" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1F6F50">
        Ohm's Law: V = I × R &nbsp;|&nbsp; V=Voltage, I=Current, R=Resistance
      </text>
    </svg>
  );
}
