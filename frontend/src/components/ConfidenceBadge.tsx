// ConfidenceBadge.tsx
import { ShieldCheck, Shield, ShieldAlert } from 'lucide-react';

interface Props {
  confidence: 'high' | 'medium' | 'low';
}

const CONFIG = {
  high: { icon: ShieldCheck, label: 'High Confidence', className: 'confidence-badge high' },
  medium: { icon: Shield, label: 'Medium Confidence', className: 'confidence-badge medium' },
  low: { icon: ShieldAlert, label: 'Low Confidence', className: 'confidence-badge low' },
};

export default function ConfidenceBadge({ confidence }: Props) {
  const { icon: Icon, label, className } = CONFIG[confidence] ?? CONFIG.medium;
  return (
    <span className={className} id={`confidence-badge-${confidence}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}
