import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IntakePanel, type AuditState } from "../app/components/IntakePanel";
import { DocumentViewer } from "../app/components/DocumentViewer";
import { AuditResults, type Finding } from "../app/components/AuditResults";
import {
  mockUpload,
  mockAuditResults,
  mockFlush,
} from "../services/api.mock";

export default function DashboardPage() {
  const [auditState, setAuditState] = useState<AuditState>("idle");
  const [reIdEnabled, setReIdEnabled] = useState(false);
  const [hoveredViolationId, setHoveredViolationId] = useState<string | null>(null);
  const [isWiping, setIsWiping] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Called either with a real File (from drop / file picker in IntakePanel)
  // or with no argument (the existing "Select Document" demo path).
  const handleSelectFile = (file?: File) => {
    setUploadError(null);
    setFindings([]);
    if (file) setSelectedFile(file);
    setAuditState("selected");
  };

  const handleRunAudit = async () => {
    if (auditState !== "selected") return;

    setAuditState("uploading");
    setUploadError(null);

    try {
      await mockUpload(selectedFile ?? undefined);
    } catch (err) {
      setAuditState("idle");
      setUploadError(
        err instanceof Error ? err.message : "Upload failed"
      );
      return;
    }

    setAuditState("redacting");
    await new Promise((r) => setTimeout(r, 1500));

    setAuditState("auditing");
    const result = (await mockAuditResults()) as Finding[];
    setFindings(result);
    setAuditState("done");
  };

  const handleRestartAudit = async () => {
    setIsWiping(true);
    await mockFlush();
    setTimeout(() => {
      setAuditState("idle");
      setReIdEnabled(false);
      setHoveredViolationId(null);
      setFindings([]);
      setSelectedFile(null);
      setUploadError(null);
      setIsWiping(false);
    }, 800);
  };

  const handleToggleIdentity = () => {
    setReIdEnabled((prev) => !prev);
  };

  return (
    <>
      <IntakePanel
        auditState={auditState}
        onSelectFile={handleSelectFile}
        onRunAudit={handleRunAudit}
        onRestart={handleRestartAudit}
        selectedFileName={selectedFile?.name}
        uploadError={uploadError}
      />
      <DocumentViewer
        auditState={auditState}
        reIdEnabled={reIdEnabled}
        onToggleIdentity={handleToggleIdentity}
        hoveredViolationId={hoveredViolationId}
        findings={findings}
      />
      <AuditResults
        auditState={auditState}
        findings={findings}
        onHoverViolation={setHoveredViolationId}
      />

      <AnimatePresence>
        {isWiping && (
          <motion.div
            initial={{ scaleY: 0, transformOrigin: "bottom" }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, transformOrigin: "top" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 z-50 bg-primary pointer-events-none"
          />
        )}
      </AnimatePresence>
    </>
  );
}
