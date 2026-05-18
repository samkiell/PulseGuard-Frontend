import { useState, useEffect } from "react";
import { EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Finding } from "./AuditResults";

type AuditStateValue =
  | "idle"
  | "selected"
  | "uploading"
  | "redacting"
  | "auditing"
  | "done";

interface DocumentViewerProps {
  auditState: AuditStateValue;
  reIdEnabled: boolean;
  onToggleIdentity: () => void;
  hoveredViolationId: string | null;
  findings: Finding[];
  selectedFile?: File | null;
}

interface FindingSpanProps {
  finding?: Finding;
  fallbackPlaceholder: string;
  fallbackValue: string;
  revealed: boolean;
  hoveredId: string | null;
}

// A span that shows either the redacted token or the original value
// based on `revealed`, and reacts to hover by ringing the finding's id.
function FindingSpan({
  finding,
  fallbackPlaceholder,
  fallbackValue,
  revealed,
  hoveredId,
}: FindingSpanProps) {
  const placeholder = finding?.redactedToken ?? fallbackPlaceholder;
  const realValue = finding?.originalValue ?? fallbackValue;
  const isHovered = finding != null && hoveredId === finding.findingId;

  return (
    <motion.span
      animate={
        isHovered
          ? {
              boxShadow:
                "0 0 0 2px rgba(218,30,40,0.6), 0 0 18px rgba(218,30,40,0.35)",
            }
          : { boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
      }
      transition={{ duration: 0.2 }}
      className={`relative inline-flex items-center justify-center min-w-[60px] h-[1.5em] rounded-sm px-0.5 ${
        isHovered ? "bg-destructive/10" : ""
      }`}
      data-finding-id={finding?.findingId}
    >
      <span
        className={`flex items-center whitespace-nowrap transition-opacity duration-300 ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      >
        {realValue}
      </span>
      <AnimatePresence>
        {!revealed && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute inset-0 bg-[#0F62FE]/10 text-[#0F62FE] flex items-center justify-center font-mono text-[10px] border border-[#0F62FE]/20 rounded-sm px-1.5 overflow-hidden whitespace-nowrap z-10"
          >
            {placeholder}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

export function DocumentViewer({
  auditState,
  reIdEnabled,
  onToggleIdentity,
  hoveredViolationId,
  findings,
  selectedFile,
}: DocumentViewerProps) {
  const isGhosted =
    auditState === "idle" ||
    auditState === "selected" ||
    auditState === "uploading";

  // Map findings by message (per backend data contract) for lookup
  const byMessage = (msg: string) => findings.find((f) => f.message === msg);
  const patientName = byMessage("Patient Name");
  const dob = byMessage("Date of Birth");
  const ssn = byMessage("Social Security Number");
  const npi = byMessage("Provider NPI");

  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setFileUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setFileUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const isPdf = selectedFile?.type === "application/pdf" || selectedFile?.name.toLowerCase().endsWith(".pdf");

  return (
    <div className="flex-1 bg-secondary flex flex-col relative overflow-hidden">
      {/* Viewer Header */}
      <div className="h-14 bg-background border-b border-border flex items-center justify-between px-6 shrink-0 z-10 relative">
        <span className="text-sm font-medium text-muted-foreground">
          {isGhosted
            ? "No document selected"
            : selectedFile
              ? selectedFile.name
              : "patient_record_749.pdf"}
        </span>

        {/* Re-ID Toggle */}
        <div className="flex items-center gap-3">
          <label
            className={`text-sm font-medium flex items-center gap-2 select-none ${
              isGhosted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <span
              className={
                reIdEnabled ? "text-foreground" : "text-muted-foreground"
              }
            >
              Reveal Patient Identity
            </span>
            <button
              type="button"
              onClick={isGhosted ? undefined : onToggleIdentity}
              disabled={isGhosted}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                reIdEnabled ? "bg-primary" : "bg-accent"
              }`}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-4 h-4 rounded-full bg-white shadow-sm ${
                  reIdEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Overlay for Ghosted State */}
      <AnimatePresence>
        {isGhosted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-background/40 backdrop-blur-[1px] pointer-events-none mt-14"
          >
            <div className="text-center text-muted-foreground max-w-sm bg-background/80 p-8 rounded-2xl shadow-xl border border-border backdrop-blur-md">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-4 shadow-sm">
                <EyeOff className="w-8 h-8 opacity-40 text-primary" />
              </div>
              <p className="font-medium text-foreground">No Document Active</p>
              <p className="text-sm mt-1">
                Upload and run an audit to view secured medical records.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Canvas Area */}
      <div
        className={`flex-1 overflow-auto p-8 flex justify-center transition-opacity duration-700 ${
          isGhosted
            ? "opacity-30 blur-[2px] select-none pointer-events-none"
            : "opacity-100"
        }`}
      >
        {fileUrl && isPdf ? (
          <iframe
            src={fileUrl}
            className="w-full max-w-4xl min-h-[800px] h-full bg-white shadow-lg border border-border/50 rounded-sm"
            title="Uploaded PDF Preview"
          />
        ) : (
          <div className="bg-white text-black w-full max-w-2xl h-max min-h-[800px] shadow-lg border border-border/50 rounded-sm p-12 flex flex-col relative">
            {/* Header */}
            <div className="border-b-2 border-gray-200 pb-6 mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-1">
                  CITY GENERAL HOSPITAL
                </h1>
                <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">
                  Patient Medical Record
                </p>
              </div>
              <div className="text-right text-sm text-gray-500 font-mono">
                REC-ID: 749-A2
              </div>
            </div>

            {/* Patient Details Table — finding-driven */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Patient Name:</span>
                <span className="font-medium text-gray-900">
                  <FindingSpan
                    finding={patientName}
                    fallbackPlaceholder="[NAME]"
                    fallbackValue="Johnathan Doe"
                    revealed={reIdEnabled}
                    hoveredId={hoveredViolationId}
                  />
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Date of Birth:</span>
                <span className="font-medium text-gray-900">
                  <FindingSpan
                    finding={dob}
                    fallbackPlaceholder="[DATE]"
                    fallbackValue="05/14/1982"
                    revealed={reIdEnabled}
                    hoveredId={hoveredViolationId}
                  />
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">SSN:</span>
                <span className="font-medium text-gray-900">
                  <FindingSpan
                    finding={ssn}
                    fallbackPlaceholder="[SSN]"
                    fallbackValue="000-00-0000"
                    revealed={reIdEnabled}
                    hoveredId={hoveredViolationId}
                  />
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Attending NPI:</span>
                <span className="font-medium text-gray-900">
                  <FindingSpan
                    finding={npi}
                    fallbackPlaceholder="[NPI]"
                    fallbackValue="NPI-0000000000"
                    revealed={reIdEnabled}
                    hoveredId={hoveredViolationId}
                  />
                </span>
              </div>
            </div>

            {/* Clinical Notes */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                Clinical Notes
              </h3>
              <div className="text-gray-700 leading-relaxed text-sm space-y-4">
                <p>
                  Patient{" "}
                  <FindingSpan
                    finding={patientName}
                    fallbackPlaceholder="[NAME]"
                    fallbackValue="Johnathan Doe"
                    revealed={reIdEnabled}
                    hoveredId={hoveredViolationId}
                  />{" "}
                  (DOB{" "}
                  <FindingSpan
                    finding={dob}
                    fallbackPlaceholder="[DATE]"
                    fallbackValue="05/14/1982"
                    revealed={reIdEnabled}
                    hoveredId={hoveredViolationId}
                  />
                  ) presented to the ER complaining of severe chest pain
                  radiating to the left arm. Initial assessment confirmed
                  elevated troponin levels.
                </p>
                <p>
                  Insurance verification recorded under SSN{" "}
                  <FindingSpan
                    finding={ssn}
                    fallbackPlaceholder="[SSN]"
                    fallbackValue="000-00-0000"
                    revealed={reIdEnabled}
                    hoveredId={hoveredViolationId}
                  />
                  . Emergency cardiac catheterization was performed prior to
                  transfer. The patient's spouse was notified and is currently
                  present.
                </p>
                <p>
                  Follow-up scheduled at the outpatient clinic with attending
                  physician (
                  <FindingSpan
                    finding={npi}
                    fallbackPlaceholder="[NPI]"
                    fallbackValue="NPI-0000000000"
                    revealed={reIdEnabled}
                    hoveredId={hoveredViolationId}
                  />
                  ). Patient advised to avoid strenuous activity for two weeks.
                </p>
              </div>
            </div>

            {/* Signature footer */}
            <div className="mt-auto pt-8 border-t border-gray-200">
              <div className="flex justify-between items-end">
                <div className="w-48">
                  <div className="border-b-2 border-gray-300 h-8 mb-2" />
                  <p className="text-xs text-gray-500 text-center uppercase">
                    Patient Signature
                  </p>
                </div>

                <div className="w-48">
                  <div className="border-b-2 border-gray-300 h-8 mb-2 flex items-end justify-center">
                    <span className="font-serif italic text-xl text-gray-700">
                      Sarah Jenkins, MD
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-center uppercase">
                    Physician Signature
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
