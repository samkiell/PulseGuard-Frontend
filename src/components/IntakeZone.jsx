import { useState } from 'react';
import { InlineLoading, InlineNotification } from '@carbon/react';
import { Checkmark } from '@carbon/icons-react';
import DropZone from './DropZone.jsx';
import { mockUpload, mockAuditResults } from '../services/api.mock';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const STAGE_LABELS = {
  uploading: 'Sending to Veea proxy…',
  redacting: 'Redacting PHI identifiers…',
  auditing: 'AI is auditing document…',
};

export default function IntakeZone({
  auditState,
  setAuditState,
  setUploadedFile,
  setAuditFindings,
}) {
  const [error, setError] = useState(null);
  const [localFile, setLocalFile] = useState(null);
  const [findingCount, setFindingCount] = useState(0);

  async function handleFile(file) {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only PDF or DOCX files are accepted.');
      return;
    }

    setError(null);
    setAuditState('uploading');

    try {
      await mockUpload(file);
      const fileMeta = { name: file.name, objectUrl: URL.createObjectURL(file) };
      setUploadedFile(fileMeta);
      setLocalFile(fileMeta);

      setAuditState('redacting');
      await new Promise((r) => setTimeout(r, 1500));

      setAuditState('auditing');
      const findings = await mockAuditResults();
      setAuditFindings(findings);
      setFindingCount(findings.length);
      setAuditState('done');
    } catch (err) {
      setError(err.message || 'Upload failed. Check that the Veea proxy is running.');
      setAuditState('idle');
    }
  }

  const isProcessing =
    auditState === 'uploading' ||
    auditState === 'redacting' ||
    auditState === 'auditing';

  return (
    <div>
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#161616',
          marginBottom: 12,
        }}
      >
        Sentinel Intake
      </h2>

      {error && (
        <InlineNotification
          kind="error"
          title="Upload failed"
          subtitle={error}
          hideCloseButton={false}
          onClose={() => setError(null)}
        />
      )}

      {auditState === 'idle' && <DropZone onFile={handleFile} disabled={false} />}

      {isProcessing && (
        <InlineLoading status="active" description={STAGE_LABELS[auditState]} />
      )}

      {auditState === 'done' && localFile && (
        <div
          style={{
            background: '#DEFBE6',
            borderRadius: 4,
            padding: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Checkmark size={20} color="#2EB872" />
          <div>
            <div style={{ fontSize: 14, color: '#161616' }}>{localFile.name}</div>
            <div style={{ fontSize: 12, color: '#525252' }}>
              {findingCount} findings detected
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
