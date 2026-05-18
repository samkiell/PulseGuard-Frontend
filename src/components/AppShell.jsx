import { Outlet } from 'react-router-dom';
import { Header, HeaderName, HeaderGlobalBar } from '@carbon/react';
import { Shield } from '@carbon/icons-react';
import StatusBar from './StatusBar.jsx';

export default function AppShell() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header aria-label="PulseGuard">
        <HeaderName prefix="">
          <Shield size={20} style={{ marginRight: 8 }} />
          PulseGuard
        </HeaderName>
        <HeaderGlobalBar>
          <StatusBar />
        </HeaderGlobalBar>
      </Header>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr 380px',
          height: 'calc(100vh - 48px)',
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
