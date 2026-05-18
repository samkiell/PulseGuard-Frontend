import { motion } from 'motion/react';

interface ComplianceGaugeProps {
  score: number;
}

export function ComplianceGauge({ score }: ComplianceGaugeProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#2EB872' : score >= 60 ? '#FFB800' : '#FF4C4C';

  return (
    <div className="relative">
      <svg width="120" height="120" className="transform -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="45"
          stroke="#1F2937"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="60"
          cy="60"
          r="45"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-mono" style={{ color }}>
          {score}%
        </div>
        <div className="text-[10px] text-[#9CA3AF] font-mono uppercase">Compliant</div>
      </div>
    </div>
  );
}
