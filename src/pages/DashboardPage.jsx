import { useState } from 'react';
import IntakeZone from '../components/IntakeZone.jsx';
import DocumentViewer from '../components/DocumentViewer.jsx';
import AuditFeed from '../components/AuditFeed.jsx';

export default function DashboardPage() {
  const [auditState, setAuditState] = useState('idle');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [auditFindings, setAuditFindings] = useState([]);
  const [reIdEnabled, setReIdEnabled] = useState(false);

  function handleFlush() {
    setAuditState('idle');
    setUploadedFile(null);
    setAuditFindings([]);
    setReIdEnabled(false);
  }

  return (
    <>
      <aside
        style={{
          background: '#F4F4F4',
          borderRight: '1px solid #E0E0E0',
          overflow: 'auto',
          padding: 16,
        }}
      >
        <IntakeZone
          auditState={auditState}
          setAuditState={setAuditState}
          setUploadedFile={setUploadedFile}
          setAuditFindings={setAuditFindings}
        />
      </aside>

      <section
        style={{
          background: '#FFFFFF',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <DocumentViewer
          uploadedFile={uploadedFile}
          auditFindings={auditFindings}
          reIdEnabled={reIdEnabled}
          setReIdEnabled={setReIdEnabled}
          onFlush={handleFlush}
          auditState={auditState}
        />
      </section>

      <aside
        style={{
          background: '#F4F4F4',
          borderLeft: '1px solid #E0E0E0',
          overflow: 'auto',
          padding: 16,
        }}
      >
        <AuditFeed findings={auditFindings} auditState={auditState} />
      </aside>
    </>
  );
}
