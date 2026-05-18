import { UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";

export type AuditState =
  | "idle"
  | "selected"
  | "uploading"
  | "redacting"
  | "auditing"
  | "done";

interface IntakePanelProps {
  auditState: AuditState;
  onSelectFile: (file?: File) => void;
  onRunAudit: () => void;
  onRestart: () => void;
  selectedFileName?: string;
  uploadError?: string | null;
}

const REDACTING_STEPS = [
  "Intercepting Proxy...",
  "Applying Regex Redaction...",
];

const AUDITING_STEPS = [
  "Mapping PII Tokens...",
  "Checking HIPAA RAG Index...",
];

export function IntakePanel({
  auditState,
  onSelectFile,
  onRunAudit,
  onRestart,
  selectedFileName,
  uploadError,
}: IntakePanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [redactStep, setRedactStep] = useState(0);
  const [auditStep, setAuditStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (auditState === "redacting") {
      setRedactStep(0);
      const t = setTimeout(() => setRedactStep(1), 800);
      return () => clearTimeout(t);
    }
  }, [auditState]);

  useEffect(() => {
    if (auditState === "auditing") {
      setAuditStep(0);
      const t = setTimeout(() => setAuditStep(1), 1000);
      return () => clearTimeout(t);
    }
  }, [auditState]);

  const handlePickClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onSelectFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    onSelectFile(file);
  };

  const displayName = selectedFileName ?? "patient_record_749.pdf";

  const hasFile =
    auditState === "selected" ||
    auditState === "uploading" ||
    auditState === "redacting" ||
    auditState === "auditing" ||
    auditState === "done";

  const buttonLabel =
    auditState === "idle"
      ? "Awaiting Upload"
      : auditState === "selected"
        ? "Run Audit"
        : auditState === "uploading"
          ? "Synchronizing..."
          : auditState === "redacting"
            ? "Redacting PHI..."
            : auditState === "auditing"
              ? "Auditing via .NET Orchestrator..."
              : "Restart Audit";

  const buttonActive = auditState === "selected" || auditState === "done";

  return (
    <div className="flex flex-col h-full bg-background border-r border-border p-6 w-80 shrink-0 relative z-10">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">New Compliance Audit</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Upload your medical records here. PulseGuard will automatically secure the file.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        aria-label="Upload document for audit"
        title="Upload document for audit"
        onChange={handleInputChange}
      />

      <div
        className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center transition-colors mb-6 relative overflow-hidden ${
          auditState !== "idle"
            ? "border-primary bg-primary/5"
            : isDragging
              ? "border-[#0F62FE] bg-[#0F62FE]/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {auditState === "idle" && (
          <>
            <motion.div
              animate={{ y: isDragging ? -10 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary"
            >
              <UploadCloud className="w-8 h-8" />
            </motion.div>
            <p className="font-medium mb-1">Drag & drop file</p>
            <p className="text-xs text-muted-foreground mb-4">PDF, JPG, PNG up to 50MB</p>
            <motion.button
              type="button"
              animate={!isDragging ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              onClick={handlePickClick}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity w-full"
            >
              Select Document
            </motion.button>
            {uploadError && (
              <div className="mt-4 w-full flex items-start gap-2 text-left rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </>
        )}

        {hasFile && (
          <div className="flex flex-col items-center w-full h-full justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <FileText className="w-8 h-8" />
            </div>
            <p className="font-medium text-sm mb-1 truncate w-full">{displayName}</p>
            <p className="text-xs text-muted-foreground mb-6">
              {auditState === "done" ? "Audit complete" : "Awaiting audit"}
            </p>

            {auditState === "uploading" && (
              <div className="w-full space-y-2 mt-auto mb-4">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, ease: "linear" }}
                    className="h-full bg-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground animate-pulse">Synchronizing Secure Bridge...</p>
              </div>
            )}

            {auditState === "redacting" && (
              <StepList
                steps={REDACTING_STEPS}
                activeIndex={redactStep}
              />
            )}

            {auditState === "auditing" && (
              <StepList
                steps={AUDITING_STEPS}
                activeIndex={auditStep}
              />
            )}

            {auditState === "done" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 text-green-600 dark:text-green-500 font-medium text-sm mt-auto mb-4"
              >
                <CheckCircle2 className="w-4 h-4" />
                Audit Complete
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={auditState === "done" ? onRestart : onRunAudit}
          disabled={!buttonActive}
          className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
            buttonActive
              ? "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_4px_20px_rgba(15,98,254,0.25)]"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

function StepList({ steps, activeIndex }: { steps: string[]; activeIndex: number }) {
  return (
    <div className="w-full space-y-4 mt-auto mb-2">
      <div className="flex flex-col gap-3">
        {steps.map((text, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 text-xs font-medium transition-opacity duration-300 ${
              idx <= activeIndex
                ? "opacity-100 text-primary"
                : "opacity-40 text-muted-foreground"
            }`}
          >
            {idx < activeIndex ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : idx === activeIndex ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-current opacity-50" />
            )}
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
