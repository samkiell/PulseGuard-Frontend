import { AlertTriangle, XOctagon, Info, ChevronRight } from 'lucide-react';

interface Violation {
  id: string;
  severity: 'critical' | 'warning' | 'advisory';
  title: string;
  description: string;
  citation: string;
}

interface ViolationFeedProps {
  onViolationClick: (violation: Violation) => void;
  selectedId?: string;
}

const violations: Violation[] = [
  {
    id: 'v1',
    severity: 'critical',
    title: 'Unsigned Medical Necessity Form',
    description: 'Authorization form lacks required physician signature per HIPAA § 164.508',
    citation: 'HIPAA § 164.508',
  },
  {
    id: 'v2',
    severity: 'critical',
    title: 'Unencrypted PHI in Transit',
    description: 'Patient identifiers transmitted without end-to-end encryption',
    citation: 'HIPAA § 164.312(e)(1)',
  },
  {
    id: 'v3',
    severity: 'warning',
    title: 'Incomplete Minimum Necessary Justification',
    description: 'Disclosure rationale does not meet minimum necessary standard',
    citation: 'HIPAA § 164.502(b)',
  },
  {
    id: 'v4',
    severity: 'warning',
    title: 'Missing Business Associate Agreement',
    description: 'Third-party vendor reference without documented BAA on file',
    citation: 'HIPAA § 164.308(b)(1)',
  },
  {
    id: 'v5',
    severity: 'advisory',
    title: 'Outdated Privacy Notice Reference',
    description: 'Document cites 2019 privacy notice; current version is 2025',
    citation: 'HIPAA § 164.520',
  },
];

export function ViolationFeed({ onViolationClick, selectedId }: ViolationFeedProps) {
  return (
    <div className="h-full flex flex-col bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden backdrop-blur-sm bg-opacity-80">
      <div className="px-4 py-3 border-b border-[#30363D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse" />
          <div className="text-sm text-[#E5E7EB] font-mono">Gemini 1.5 Pro: Auditing...</div>
        </div>
        <div className="text-[10px] text-[#9CA3AF] font-mono">
          {violations.filter(v => v.severity === 'critical').length} CRITICAL
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {violations.map((violation) => {
          const Icon = violation.severity === 'critical' ? XOctagon : violation.severity === 'warning' ? AlertTriangle : Info;
          const severityColor =
            violation.severity === 'critical' ? '#FF4C4C' :
            violation.severity === 'warning' ? '#FFB800' : '#00D1FF';

          return (
            <button
              key={violation.id}
              onClick={() => onViolationClick(violation)}
              className={`w-full text-left p-4 rounded-lg border transition-all group ${
                selectedId === violation.id
                  ? 'bg-[#1F2937] border-[#00D1FF] shadow-[0_0_12px_rgba(0,209,255,0.2)]'
                  : 'bg-[#0B0E14] border-[#30363D] hover:border-[#9CA3AF] hover:bg-[#161B22]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 rounded-lg p-2 flex-shrink-0"
                  style={{
                    backgroundColor: `${severityColor}20`,
                    border: `1px solid ${severityColor}`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: severityColor }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm text-[#E5E7EB]">{violation.title}</h4>
                    <ChevronRight className={`w-4 h-4 text-[#9CA3AF] flex-shrink-0 transition-transform ${
                      selectedId === violation.id ? 'rotate-90 text-[#00D1FF]' : 'group-hover:translate-x-0.5'
                    }`} />
                  </div>

                  <p className="text-xs text-[#9CA3AF] mb-3 leading-relaxed">{violation.description}</p>

                  <div className="flex items-center gap-2">
                    <div
                      className="inline-flex items-center px-2 py-1 rounded text-[10px] font-mono"
                      style={{
                        backgroundColor: `${severityColor}15`,
                        color: severityColor,
                      }}
                    >
                      {violation.citation}
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] font-mono uppercase">
                      {violation.severity}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { Violation };
