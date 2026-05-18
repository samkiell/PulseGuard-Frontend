const CHIP_STYLES = {
  CRITICAL: {
    background: '#FFF1F1',
    border: '1px solid #DA1E28',
    color: '#DA1E28',
  },
  WARNING: {
    background: '#FFF8E1',
    border: '1px solid #F1C21B',
    color: '#825200',
  },
  INFO: {
    background: '#EDF5FF',
    border: '1px solid #0F62FE',
    color: '#0043CE',
  },
};

export default function SentinelOverlay({ findings, reIdEnabled }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 260,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: '#6F6F6F',
          marginBottom: 4,
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}
      >
        Sentinel Findings
      </div>

      {findings.map((finding) => {
        const chipStyle = CHIP_STYLES[finding.severity];
        const token = reIdEnabled ? finding.originalValue : finding.redactedToken;
        return (
          <div
            key={finding.id}
            style={{
              ...chipStyle,
              borderRadius: 4,
              padding: '6px 10px',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'Courier New, monospace',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 11 }}>
              {finding.severity[0]}
            </span>
            <span>{token}</span>
          </div>
        );
      })}
    </div>
  );
}
