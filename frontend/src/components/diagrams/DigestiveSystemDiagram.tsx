// DigestiveSystemDiagram.tsx
export default function DigestiveSystemDiagram() {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', background: '#FFF9F5' }}>
      {/* Title */}
      <rect x="80" y="6" width="240" height="26" rx="7" fill="#1F6F50" />
      <text x="200" y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">Human Digestive System</text>

      {/* Mouth */}
      <ellipse cx="200" cy="50" rx="22" ry="12" fill="#FECACA" stroke="#DC2626" strokeWidth="1.5" />
      <text x="200" y="54" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7F1D1D">Mouth</text>
      <text x="238" y="54" fontSize="8" fill="#374151">Chewing + Saliva</text>

      {/* Oesophagus */}
      <rect x="194" y="62" width="12" height="35" rx="5" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1" />
      <text x="220" y="82" fontSize="8" fill="#374151">Oesophagus</text>

      {/* Stomach */}
      <ellipse cx="185" cy="118" rx="35" ry="28" fill="#FB923C" opacity="0.85" stroke="#EA580C" strokeWidth="1.5" />
      <text x="185" y="116" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">Stomach</text>
      <text x="185" y="128" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.9)">Acid + Churning</text>

      {/* Liver */}
      <ellipse cx="270" cy="105" rx="30" ry="20" fill="#A16207" opacity="0.8" stroke="#92400E" strokeWidth="1.5" />
      <text x="270" y="109" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">Liver</text>
      <line x1="242" y1="110" x2="220" y2="120" stroke="#92400E" strokeWidth="1.5" strokeDasharray="3,2" />

      {/* Gall Bladder */}
      <ellipse cx="270" cy="132" rx="15" ry="10" fill="#65A30D" opacity="0.85" stroke="#4D7C0F" strokeWidth="1.5" />
      <text x="270" y="136" textAnchor="middle" fontSize="8" fontWeight="700" fill="white">Gall</text>
      <line x1="256" y1="134" x2="222" y2="130" stroke="#4D7C0F" strokeWidth="1.5" strokeDasharray="3,2" />

      {/* Pancreas */}
      <rect x="110" y="138" width="50" height="16" rx="8" fill="#A78BFA" opacity="0.85" stroke="#7C3AED" strokeWidth="1" />
      <text x="135" y="150" textAnchor="middle" fontSize="8" fontWeight="700" fill="white">Pancreas</text>
      <line x1="160" y1="146" x2="170" y2="146" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="3,2" />

      {/* Small intestine — coiled path */}
      <path
        d="M 185 148 Q 195 165 170 175 Q 145 185 165 200 Q 185 215 165 228 Q 145 242 170 252"
        fill="none" stroke="#F97316" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M 185 148 Q 195 165 170 175 Q 145 185 165 200 Q 185 215 165 228 Q 145 242 170 252"
        fill="none" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
      />
      <text x="125" y="200" fontSize="9" fontWeight="700" fill="#C2410C">Small</text>
      <text x="122" y="212" fontSize="9" fontWeight="700" fill="#C2410C">Intestine</text>
      <text x="118" y="224" fontSize="8" fill="#374151">Nutrients</text>
      <text x="118" y="235" fontSize="8" fill="#374151">absorbed</text>

      {/* Large intestine */}
      <path d="M 170 252 Q 210 260 230 240 Q 250 220 245 190 Q 240 170 235 160 Q 228 148 220 148"
        fill="none" stroke="#92400E" strokeWidth="12" strokeLinecap="round" />
      <path d="M 170 252 Q 210 260 230 240 Q 250 220 245 190 Q 240 170 235 160 Q 228 148 220 148"
        fill="none" stroke="#FDE68A" strokeWidth="7" strokeLinecap="round" />
      <text x="260" y="210" fontSize="9" fontWeight="700" fill="#78350F">Large</text>
      <text x="256" y="222" fontSize="9" fontWeight="700" fill="#78350F">Intestine</text>
      <text x="254" y="234" fontSize="8" fill="#374151">Water</text>
      <text x="252" y="246" fontSize="8" fill="#374151">absorbed</text>

      {/* Rectum / Anus */}
      <rect x="160" y="258" width="26" height="20" rx="6" fill="#92400E" opacity="0.7" stroke="#78350F" strokeWidth="1" />
      <text x="173" y="272" textAnchor="middle" fontSize="8" fontWeight="700" fill="white">Rectum</text>

      {/* Flow arrows */}
      <defs>
        <marker id="ds-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#374151" />
        </marker>
      </defs>
      <line x1="200" y1="62" x2="200" y2="90" stroke="#374151" strokeWidth="1.5" markerEnd="url(#ds-arrow)" />

      {/* Bottom note */}
      <rect x="10" y="288" width="380" height="22" rx="5" fill="#E8F5EF" stroke="#D4E8DC" strokeWidth="1" />
      <text x="200" y="303" textAnchor="middle" fontSize="10" fill="#1F6F50" fontWeight="600">
        Food path: Mouth → Oesophagus → Stomach → Intestines → Rectum
      </text>
    </svg>
  );
}
