import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Toggle, InlineLoading } from '@carbon/react';
import { DocumentBlank } from '@carbon/icons-react';
import SentinelOverlay from './SentinelOverlay.jsx';
import FlushButton from './FlushButton.jsx';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export default function DocumentViewer({
  uploadedFile,
  auditFindings,
  reIdEnabled,
  setReIdEnabled,
  onFlush,
  auditState,
}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const isPreparing = auditState === 'uploading' || auditState === 'redacting';
  const showPdf =
    uploadedFile && (auditState === 'auditing' || auditState === 'done');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {auditState === 'done' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid #E0E0E0',
            background: '#F4F4F4',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, color: '#525252', fontWeight: 500 }}>
            {uploadedFile?.name}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Toggle
              id="reid-toggle"
              labelA="Re-ID Off"
              labelB="Re-ID On"
              toggled={reIdEnabled}
              onToggle={(checked) => setReIdEnabled(checked)}
              size="sm"
            />
            <FlushButton onFlush={onFlush} disabled={false} />
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          background: '#E0E0E0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 24,
        }}
      >
        {!uploadedFile && (
          <div style={{ marginTop: 80, textAlign: 'center' }}>
            <DocumentBlank size={64} style={{ color: '#C6C6C6' }} />
            <p style={{ fontSize: 14, color: '#6F6F6F', marginTop: 16 }}>
              No document loaded
            </p>
            <p style={{ fontSize: 12, color: '#A8A8A8' }}>
              Upload a file in Sentinel Intake to begin auditing.
            </p>
          </div>
        )}

        {uploadedFile && isPreparing && (
          <div style={{ marginTop: 80, textAlign: 'center' }}>
            <InlineLoading description="Preparing document…" status="active" />
          </div>
        )}

        {showPdf && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Document
              file={uploadedFile.objectUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              <Page pageNumber={pageNumber} width={600} />
            </Document>
            {auditState === 'done' && (
              <SentinelOverlay
                findings={auditFindings}
                reIdEnabled={reIdEnabled}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
