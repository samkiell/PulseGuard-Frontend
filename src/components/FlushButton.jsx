import { useState } from 'react';
import { Button, InlineLoading } from '@carbon/react';
import { mockFlush } from '../services/api.mock';

export default function FlushButton({ onFlush, disabled }) {
  const [flushing, setFlushing] = useState(false);

  async function handleFlush() {
    setFlushing(true);
    await mockFlush();
    setFlushing(false);
    onFlush();
  }

  if (flushing) {
    return <InlineLoading description="Wiping session…" status="active" />;
  }

  return (
    <Button kind="danger" size="sm" disabled={disabled} onClick={handleFlush}>
      New Audit
    </Button>
  );
}
