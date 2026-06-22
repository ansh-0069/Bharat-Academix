// WaterCycleDiagram.tsx
export default function WaterCycleDiagram() {
  return (
    <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', background: '#EEF6FF' }}>
      <defs>
        <marker id="wc-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#2563EB" />
        </marker>
        <marker id="wc-arrow-w" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#7C3AED" />
        </marker>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="400" height="200" fill="#DBEAFE" rx="4" />
      {/* Ground */}
      <rect x="0" y="200" width="400" height="80" fill="#A3C87A" />
      {/* Lake/Sea */}
      <ellipse cx="320" cy="205" rx="75" ry="18" fill="#60A5FA" />
      <text x="320" y="209" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1E40AF">Sea / Lake</text>

      {/* Sun */}
      <circle cx="50" cy="40" r="25" fill="#FDE047" />
      <text x="50" y="45" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400E">Sun</text>

      {/* Cloud */}
      <ellipse cx="200" cy="60" rx="55" ry="25" fill="white" />
      <ellipse cx="175" cy="70" rx="30" ry="22" fill="white" />
      <ellipse cx="225" cy="70" rx="30" ry="22" fill="white" />
      <text x="200" y="68" textAnchor="middle" fontSize="10" fontWeight="700" fill="#374151">Cloud</text>

      {/* Evaporation arrow: lake → cloud */}
      <path d="M280 190 Q230 120 220 85" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#wc-arrow)" />
      <text x="235" y="140" fontSize="9" fill="#EF4444" fontWeight="600" transform="rotate(-55 235 140)">Evaporation</text>

      {/* Condensation label */}
      <text x="158" y="56" fontSize="9" fill="#1D4ED8" fontWeight="600">Condensation</text>

      {/* Precipitation (rain) */}
      {[170,185,200,215,230].map((x, i) => (
        <line key={i} x1={x} y1={90} x2={x - 5} y2={115} stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      ))}
      <text x="200" y="128" textAnchor="middle" fontSize="9" fill="#2563EB" fontWeight="600">Precipitation (Rain)</text>

      {/* Runoff arrow */}
      <path d="M190 200 Q260 210 295 208" fill="none" stroke="#2563EB" strokeWidth="2" markerEnd="url(#wc-arrow)" />
      <text x="240" y="220" fontSize="9" fill="#2563EB" fontWeight="600">Runoff</text>

      {/* Mountains */}
      <polygon points="50,200 90,140 130,200" fill="#6B7280" />
      <polygon points="80,200 120,150 160,200" fill="#9CA3AF" />
      <polygon points="85,200 120,157" stroke="white" strokeWidth="1.5" fill="none" />
      {/* Snow cap */}
      <polygon points="90,140 100,155 80,155" fill="white" opacity="0.8" />
      <text x="105" y="215" fontSize="9" fontWeight="700" fill="#374151">Mountains</text>

      {/* Transpiration from trees */}
      <rect x="30" y="180" width="8" height="20" fill="#92400E" />
      <circle cx="34" cy="175" r="12" fill="#22C55E" />
      <line x1="34" y1="162" x2="40" y2="140" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#wc-arrow)" />
      <text x="12" y="155" fontSize="8" fill="#15803D" fontWeight="600">Transpiration</text>
    </svg>
  );
}
