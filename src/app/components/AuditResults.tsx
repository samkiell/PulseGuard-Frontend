import { useState } from "react";
import { AlertCircle, AlertTriangle, Info, FileDown, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Matches backend data contract (findingId / type / message / status)
// plus client-side display extensions pending contract expansion.
export type FindingType = "Critical" | "Warning" | "Info";
export type FindingStatus = "Redacted" | "Flagged" | "Pending";

export type Finding = {
  findingId: string;
  type: FindingType;
  message: string;
  status: FindingStatus;
  // UI display extensions
  description: string;
  location: string;
  redactedToken: string;
  originalValue: string;
  recommendation: string;
};

type AuditStateValue =
  | "idle"
  | "selected"
  | "uploading"
  | "redacting"
  | "auditing"
  | "done";

interface AuditResultsProps {
  auditState: AuditStateValue;
  findings: Finding[];
  onHoverViolation: (id: string | null) => void;
}

const TYPE_ORDER: Record<FindingType, number> = {
  Critical: 0,
  Warning: 1,
  Info: 2,
};

function typeIcon(type: FindingType) {
  if (type === "Critical") return <AlertCircle className="w-5 h-5 text-destructive" />;
  if (type === "Warning") return <AlertTriangle className="w-5 h-5 text-[#F1C21B]" />;
  return <Info className="w-5 h-5 text-primary" />;
}

function typeBorder(type: FindingType) {
  if (type === "Critical") return "border-destructive/30";
  if (type === "Warning") return "border-[#F1C21B]/30";
  return "border-primary/30";
}

function typeChip(type: FindingType) {
  if (type === "Critical") return "bg-destructive/10 text-destructive";
  if (type === "Warning") return "bg-[#F1C21B]/10 text-[#F1C21B]";
  return "bg-primary/10 text-primary";
}

export function AuditResults({ auditState, findings, onHoverViolation }: AuditResultsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (auditState !== "done") {
    const isScanning = auditState === "redacting" || auditState === "auditing";
    return (
      <div className="flex flex-col h-full bg-background border-l border-border w-80 shrink-0">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-xl font-semibold">Audit Findings</h2>
        </div>
        <div className="flex-1 p-6 flex items-center justify-center text-center">
          <p className="text-muted-foreground text-sm">
            {isScanning
              ? "Scanning document for regulatory compliance..."
              : "No active audit. Upload a document to begin."}
          </p>
        </div>
      </div>
    );
  }

  const sorted = [...findings].sort(
    (a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]
  );
  const criticalCount = sorted.filter((f) => f.type === "Critical").length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="flex flex-col h-full bg-background border-l border-border w-80 shrink-0">
      <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between z-10">
        <h2 className="text-xl font-semibold">Audit Findings</h2>
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={
            criticalCount > 0
              ? "bg-destructive/10 text-destructive text-xs font-semibold px-2 py-1 rounded-full"
              : "bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full"
          }
        >
          {sorted.length} Issue{sorted.length === 1 ? "" : "s"}
        </motion.span>
      </div>

      {sorted.length === 0 ? (
        <div className="flex-1 p-6 flex items-center justify-center text-center">
          <p className="text-muted-foreground text-sm">
            No violations detected — this document passed all HIPAA audit checks.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-1 overflow-auto p-4 space-y-4"
        >
          {sorted.map((finding) => {
            const isExpanded = expandedId === finding.findingId;

            return (
              <motion.div
                variants={itemVariants}
                key={finding.findingId}
                onMouseEnter={() => onHoverViolation(finding.findingId)}
                onMouseLeave={() => onHoverViolation(null)}
                className={`border rounded-xl bg-card overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${typeBorder(
                  finding.type
                )} ${isExpanded ? "ring-2 ring-primary/20" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : finding.findingId)}
                  className="w-full text-left p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="mt-0.5 shrink-0">{typeIcon(finding.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <h3 className="font-medium text-sm text-foreground truncate">
                        {finding.message}
                      </h3>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm ${typeChip(
                          finding.type
                        )}`}
                      >
                        {finding.type}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate">
                        {finding.location}
                      </span>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-border/50 bg-secondary/30"
                    >
                      <div className="p-4 pt-3 space-y-3 text-sm text-muted-foreground">
                        <p>{finding.description}</p>

                        <div className="bg-background border border-border rounded p-3 text-xs shadow-inner space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-foreground">Status</span>
                            <span className="font-mono text-[11px] text-primary">
                              {finding.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-foreground">Redacted token</span>
                            <code className="font-mono text-[11px] text-primary">
                              {finding.redactedToken}
                            </code>
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">Recommendation</p>
                            <p className="italic">{finding.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <div className="p-4 border-t border-border bg-muted/30 shrink-0">
        <button
          type="button"
          className="w-full bg-background border border-border text-foreground hover:bg-secondary hover:text-primary transition-colors py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        >
          <FileDown className="w-4 h-4" />
          Download Report
        </button>
      </div>
    </div>
  );
}
