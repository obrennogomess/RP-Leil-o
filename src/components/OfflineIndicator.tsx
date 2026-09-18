import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#d97706',
        color: '#ffffff',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 600,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          animation: 'pulse 1.5s infinite'
        }}
      />
      Modo Offline — exibindo dados em cache do Pátio RP.
    </div>
  );
};
