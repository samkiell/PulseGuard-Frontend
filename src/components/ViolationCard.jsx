import { Tag, Tile } from '@carbon/react';

const SEVERITY_CONFIG = {
  CRITICAL: { tagType: 'red', label: 'Critical' },
  WARNING: { tagType: 'warm-gray', label: 'Warning' },
  INFO: { tagType: 'blue', label: 'Info' },
};

export default function ViolationCard({ finding }) {
  const config = SEVERITY_CONFIG[finding.severity];

  return (
    <Tile style={{ marginBottom: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <Tag type={config.tagType} size="sm">
          {config.label}
        </Tag>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#161616' }}>
          {finding.category}
        </span>
      </div>

      <p
        style={{
          fontSize: 13,
          color: '#525252',
          margin: '0 0 8px 0',
          lineHeight: 1.5,
        }}
      >
        {finding.description}
      </p>

      <p
        style={{
          fontSize: 12,
          color: '#8D8D8D',
          fontStyle: 'italic',
          margin: '0 0 12px 0',
        }}
      >
        {finding.location}
      </p>

      <hr
        style={{
          border: 'none',
          borderTop: '1px solid #E0E0E0',
          margin: '0 0 12px 0',
        }}
      />

      <p style={{ margin: 0 }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: '#161616' }}>
          Recommendation:{' '}
        </span>
        <span style={{ fontSize: 13, color: '#525252' }}>
          {finding.recommendation}
        </span>
      </p>
    </Tile>
  );
}
