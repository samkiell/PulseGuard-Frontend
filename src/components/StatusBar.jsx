import { useEffect, useState } from 'react';
import { Tag } from '@carbon/react';
import { checkProxyStatus } from '../services/api.mock';

export default function StatusBar() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    checkProxyStatus().then((ok) => {
      if (cancelled) return;
      setStatus(ok ? 'online' : 'offline');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const { type, label } = STATUS_MAP[status];

  return (
    <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center' }}>
      <Tag type={type}>{label}</Tag>
    </div>
  );
}

const STATUS_MAP = {
  checking: { type: 'gray', label: 'Checking proxy…' },
  online: { type: 'green', label: 'Veea Secure — Online' },
  offline: { type: 'red', label: 'Veea Proxy — Offline' },
};
