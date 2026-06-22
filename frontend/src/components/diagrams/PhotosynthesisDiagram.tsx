// PhotosynthesisDiagram.tsx
export default function PhotosynthesisDiagram() {
  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', background: '#F0FBF4' }}>
      {/* Sun */}
      <circle cx="340" cy="50" r="30" fill="#F5A623" opacity="0.9" />
      <text x="340" y="55" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7A4010">Sun</text>
      {/* Sunlight rays */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
        <line key={i}
          x1={340 + 33 * Math.cos(deg * Math.PI / 180)}
          y1={50 + 33 * Math.sin(deg * Math.PI / 180)}
          x2={340 + 44 * Math.cos(deg * Math.PI / 180)}
          y2={50 + 44 * Math.sin(deg * Math.PI / 180)}
          stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {/* Light arrow */}
      <line x1="310" y1="70" x2="200" y2="120" stroke="#F5A623" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arrow-y)" />
      
      {/* Leaf */}
      <ellipse cx="180" cy="150" rx="70" ry="45" fill="#2A8F6A" opacity="0.85" transform="rotate(-15 180 150)" />
      <ellipse cx="180" cy="150" rx="68" ry="43" fill="#3AAF82" opacity="0.7" transform="rotate(-15 180 150)" />
      {/* Leaf vein */}
      <line x1="115" y1="165" x2="245" y2="135" stroke="#1F6F50" strokeWidth="2.5" opacity="0.8" />
      <line x1="155" y1="120" x2="160" y2="165" stroke="#1F6F50" strokeWidth="1.5" opacity="0.6" />
      <line x1="180" y1="115" x2="178" y2="162" stroke="#1F6F50" strokeWidth="1.5" opacity="0.6" />
      <line x1="205" y1="120" x2="200" y2="160" stroke="#1F6F50" strokeWidth="1.5" opacity="0.6" />
      <text x="180" y="155" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">Leaf</text>

      {/* CO2 arrow in */}
      <line x1="40" y1="130" x2="108" y2="148" stroke="#DC2626" strokeWidth="2" markerEnd="url(#arrow-r)" />
      <text x="20" y="122" fontSize="10" fontWeight="700" fill="#DC2626">CO₂</text>
      <text x="15" y="134" fontSize="9" fill="#DC2626">+ H₂O</text>

      {/* O2 arrow out */}
      <line x1="248" y1="148" x2="310" y2="130" stroke="#1F6F50" strokeWidth="2" markerEnd="url(#arrow-g)" />
      <text x="312" y="122" fontSize="10" fontWeight="700" fill="#1F6F50">O₂</text>
      <text x="308" y="134" fontSize="9" fill="#1F6F50">released</text>

      {/* Glucose output */}
      <rect x="120" y="225" width="140" height="35" rx="8" fill="#1F6F50" opacity="0.9" />
      <text x="190" y="240" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">Glucose (C₆H₁₂O₆)</text>
      <text x="190" y="254" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.8)">Food / Energy stored</text>
      <line x1="180" y1="197" x2="180" y2="223" stroke="#1F6F50" strokeWidth="2" strokeDasharray="4,2" markerEnd="url(#arrow-g)" />

      {/* Equation */}
      <rect x="50" y="270" width="300" height="22" rx="6" fill="white" stroke="#D4E8DC" strokeWidth="1" />
      <text x="200" y="285" textAnchor="middle" fontSize="10" fill="#1F6F50" fontWeight="600">
        6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂
      </text>

      {/* Arrow markers */}
      <defs>
        <marker id="arrow-y" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#F5A623" />
        </marker>
        <marker id="arrow-r" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#DC2626" />
        </marker>
        <marker id="arrow-g" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#1F6F50" />
        </marker>
      </defs>
    </svg>
  );
}
