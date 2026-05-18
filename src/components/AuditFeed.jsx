import { SkeletonText, InlineNotification } from '@carbon/react';
import { Shield } from '@carbon/icons-react';
import ViolationCard from './ViolationCard.jsx';

const SEVERITY_ORDER = { CRITICAL: 0, WARNING: 1, INFO: 2 };

export default function AuditFeed({ findings, auditState }) {
  const isProcessing =
    auditState === 'uploading' ||
    auditState === 'redacting' ||
    auditState === 'auditing';

  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;

  const sorted = [...findings].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          borderBottom: '1px solid #E0E0E0',
          paddingBottom: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: '#161616' }}>
          Audit Feed
        </div>
        {auditState === 'done' && findings.length > 0 && (
          <div style={{ fontSize: 12, marginTop: 4 }}>
            <span style={{ color: '#6F6F6F' }}>{findings.length} findings — </span>
            <span style={{ color: '#DA1E28' }}>{criticalCount} Critical</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {auditState === 'idle' && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Shield size={48} color="#C6C6C6" />
            <p style={{ fontSize: 14, color: '#6F6F6F', marginTop: 12 }}>
              No document loaded
            </p>
            <p style={{ fontSize: 12, color: '#A8A8A8' }}>
              Drop a file in Sentinel Intake to begin.
            </p>
          </div>
        )}

        {isProcessing &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                borderRadius: 4,
                border: '1px solid #E0E0E0',
                padding: 16,
                marginBottom: 12,
              }}
            >
              <SkeletonText paragraph lineCount={3} />
            </div>
          ))}

        {auditState === 'done' && findings.length === 0 && (
          <InlineNotification
            kind="success"
            title="No violations detected"
            subtitle="This document passed all HIPAA audit checks."
            hideCloseButton={true}
          />
        )}

        {auditState === 'done' &&
          findings.length > 0 &&
          sorted.map((f) => (
            <div key={f.id} style={{ marginBottom: 12 }}>
              <ViolationCard finding={f} />
            </div>
          ))}
      </div>
    </div>
  );
}
