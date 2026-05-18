import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

interface AirLockScannerProps {
  onComplete: () => void;
}

export function AirLockScanner({ onComplete }: AirLockScannerProps) {
  return (
    <div className="fixed inset-0 bg-[#0B0E14] bg-opacity-95 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#00D1FF] to-[#2EB872] flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Shield className="w-12 h-12 text-[#0B0E14]" />
        </motion.div>

        <div className="space-y-4 mb-8">
          <motion.div
            className="text-lg text-[#00D1FF] font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Veea Proxy: Filtering Identifiers...
          </motion.div>

          <div className="w-80 h-1 bg-[#1F2937] rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00D1FF] to-[#2EB872]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              onAnimationComplete={onComplete}
              style={{
                boxShadow: '0 0 12px rgba(0, 209, 255, 0.8)',
              }}
            />
          </div>

          <motion.div
            className="text-sm text-[#9CA3AF] font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            18/18 Identifiers Secured
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-[#9CA3AF] font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2EB872] animate-pulse" />
            <span>PHI Redacted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2EB872] animate-pulse" />
            <span>Tokens Generated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2EB872] animate-pulse" />
            <span>Audit Initiated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
