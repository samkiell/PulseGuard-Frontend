import { useRef, useState } from 'react';
import { Upload } from '@carbon/icons-react';

export default function DropZone({ onFile, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  function handleClick() {
    if (disabled) return;
    fileInputRef.current?.click();
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave() {
    setDragActive(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) onFile(file);
  }

  const style = {
    border: '2px dashed #C6C6C6',
    borderRadius: 4,
    padding: '32px 16px',
    textAlign: 'center',
    background: '#FFFFFF',
    transition: 'border-color 0.15s, background 0.15s',
    cursor: 'pointer',
    ...(dragActive && {
      border: '2px dashed #0F62FE',
      background: '#EDF5FF',
    }),
    ...(disabled && {
      cursor: 'not-allowed',
      opacity: 0.5,
      pointerEvents: 'none',
    }),
  };

  return (
    <div
      style={style}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload
        size={32}
        color="#6F6F6F"
        style={{ marginBottom: 8 }}
      />
      <p style={{ fontSize: 14, color: '#525252', margin: 0 }}>
        Drop a PDF or DOCX here
      </p>
      <p style={{ fontSize: 12, color: '#8D8D8D', marginTop: 4 }}>
        or click to browse
      </p>
      <input
        type="file"
        accept=".pdf,.docx"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
