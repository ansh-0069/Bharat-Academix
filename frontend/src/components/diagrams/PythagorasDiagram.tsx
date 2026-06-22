// PythagorasDiagram.tsx
export default function PythagorasDiagram() {
  // Right triangle: A(60,220), B(280,220), C(280,60)
  const A = { x: 60, y: 220 };
  const B = { x: 280, y: 220 };
  const C = { x: 280, y: 60 };

  return (
    <svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', background: '#FFFBF5' }}>
      {/* Square on hypotenuse (c²) — rotated square, approximate */}
      <polygon
        points="60,220 280,60 220,0 0,160"
        fill="#FEF9C3" stroke="#F59E0B" strokeWidth="1.5"
      />
      <text x="110" y="105" fontSize="14" fontWeight="700" fill="#B45309" textAnchor="middle">c²</text>

      {/* Square on side a (horizontal, bottom) */}
      <rect x="60" y="220" width="220" height="50" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
      <text x="170" y="252" textAnchor="middle" fontSize="14" fontWeight="700" fill="#15803D">a²</text>

      {/* Square on side b (vertical, right) */}
      <rect x="280" y="60" width="50" height="160" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
      <text x="305" y="148" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1D4ED8">b²</text>

      {/* Triangle */}
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
        fill="#E8F5EF" stroke="#1F6F50" strokeWidth="3"
      />

      {/* Right angle marker */}
      <rect x={B.x - 16} y={B.y - 16} width="14" height="14" fill="none" stroke="#1F6F50" strokeWidth="2" />

      {/* Side labels */}
      <text x={(A.x + B.x) / 2} y={A.y + 16} textAnchor="middle" fontSize="13" fontWeight="700" fill="#15803D">a</text>
      <text x={B.x + 16} y={(B.y + C.y) / 2} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1D4ED8">b</text>
      <text x={(A.x + C.x) / 2 - 16} y={(A.y + C.y) / 2} textAnchor="middle" fontSize="13" fontWeight="700" fill="#B45309">c</text>

      {/* Vertex labels */}
      <text x={A.x - 14} y={A.y + 4} fontSize="13" fontWeight="700" fill="#374151">A</text>
      <text x={B.x + 6} y={B.y + 4} fontSize="13" fontWeight="700" fill="#374151">B</text>
      <text x={C.x + 6} y={C.y - 4} fontSize="13" fontWeight="700" fill="#374151">C</text>

      {/* Theorem box */}
      <rect x="50" y="6" width="200" height="38" rx="8" fill="#1F6F50" />
      <text x="150" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">Pythagoras Theorem</text>
      <text x="150" y="38" textAnchor="middle" fontSize="14" fontWeight="800" fill="#F5A623">a² + b² = c²</text>
    </svg>
  );
}
