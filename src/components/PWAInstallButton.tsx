import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'menu' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as standalone app, don't show prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback for browsers that don't emit beforeinstallprompt yet
      alert('Para instalar o aplicativo do Pátio RP Leilões, acesse as opções do seu navegador e selecione "Adicionar à tela inicial" ou "Instalar Aplicativo".');
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`shc-btn-app-install ${className}`}
          title="Instalar Aplicativo Pátio RP no seu celular ou computador"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#B8874C',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Instalar App</span>
        </button>
      )}

      {variant === 'menu' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={className}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            color: '#0f172a',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            textAlign: 'left',
            marginTop: '8px'
          }}
        >
          <span
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              backgroundColor: '#B8874C',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px'
            }}
          >
            📱
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#0b2c4d' }}>Baixar Aplicativo</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
              Instale na tela de início do seu celular
            </div>
          </div>
        </button>
      )}

      {/* Modal Guia de Instalação iOS */}
      {showIOSGuide && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            padding: '16px'
          }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                borderRadius: '14px',
                backgroundColor: '#0b2c4d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B8874C',
                fontSize: '30px'
              }}
            >
              🏛️
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0b2c4d', margin: '0 0 8px' }}>
              Instalar Pátio RP no iPhone/iPad
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: '0 0 20px' }}>
              Acompanhe leilões e dê lances com um toque diretamente da sua tela de início:
            </p>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
                fontSize: '13px',
                color: '#334155',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 800, color: '#B8874C' }}>1.</span>
                <span>Toque no botão de <strong>Compartilhar</strong> (ícone do quadrado com seta para cima) na barra inferior do Safari.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 800, color: '#B8874C' }}>2.</span>
                <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 800, color: '#B8874C' }}>3.</span>
                <span>Confirme em <strong>Adicionar</strong> no canto superior direito.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              style={{
                width: '100%',
                backgroundColor: '#0b2c4d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
