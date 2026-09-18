import React, { useState } from 'react';
import {
  WHATSAPP_DOCS_FORMATTED,
  generateWhatsAppDocsMessage,
  getWhatsAppDocsUrl,
  UserDocInfo
} from '../utils/whatsappDocs';

interface WhatsAppDocCardProps {
  user?: UserDocInfo | null;
  compact?: boolean;
}

export const WhatsAppDocCard: React.FC<WhatsAppDocCardProps> = ({ user, compact = false }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const message = generateWhatsAppDocsMessage(user);
  const whatsappUrl = getWhatsAppDocsUrl(user);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (compact) {
    return (
      <div
        style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '8px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', color: '#16a34a' }}>
              <i className="fa-brands fa-whatsapp"></i>
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>
              Ou envie pelo WhatsApp oficial: <strong>{WHATSAPP_DOCS_FORMATTED}</strong>
            </span>
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            backgroundColor: '#16a34a',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 700,
            textAlign: 'center'
          }}
        >
          <i className="fa-brands fa-whatsapp"></i>
          Enviar Documentos pelo WhatsApp (Mensagem Pronta)
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#f0fdf4',
        border: '2px solid #86efac',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#16a34a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            flexShrink: 0
          }}
        >
          <i className="fa-brands fa-whatsapp"></i>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, fontSize: '15px', color: '#14532d' }}>
              Envio Rápido via WhatsApp Oficial
            </span>
            <span
              style={{
                backgroundColor: '#dcfce7',
                color: '#15803d',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #bbf7d0'
              }}
            >
              Atendimento Direto
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#166534', lineHeight: 1.4 }}>
            Você também pode enviar as fotos dos seus documentos diretamente para o WhatsApp da equipe de homologação:
            {' '}<strong>{WHATSAPP_DOCS_FORMATTED}</strong>.
          </p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px dashed #86efac',
          padding: '10px 12px',
          marginBottom: '12px',
          fontSize: '12px',
          color: '#15803d'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700 }}>💬 Mensagem já configurada para você:</span>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              background: 'none',
              border: 'none',
              color: '#047857',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {showPreview ? 'Ocultar prévia' : 'Ver mensagem pronta'}
          </button>
        </div>

        {showPreview && (
          <div style={{ marginTop: '8px' }}>
            <pre
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '10px',
                fontSize: '11px',
                color: '#334155',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                margin: '0 0 8px'
              }}
            >
              {message}
            </pre>
            <button
              type="button"
              onClick={handleCopyMessage}
              style={{
                padding: '4px 10px',
                backgroundColor: '#e2e8f0',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              {copied ? '✓ Mensagem copiada!' : '📋 Copiar mensagem'}
            </button>
          </div>
        )}
      </div>

      {/* Main WhatsApp CTA Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          backgroundColor: '#25D366',
          color: '#ffffff',
          padding: '12px 16px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 800,
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
          transition: 'background-color 0.2s',
          boxSizing: 'border-box'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#1eb857';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#25D366';
        }}
      >
        <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i>
        <span>Enviar Documentos pelo WhatsApp: {WHATSAPP_DOCS_FORMATTED}</span>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
        <span style={{ fontSize: '11px', color: '#15803d' }}>
          ✓ Número oficial: <strong>55 54 92003-6253</strong> • Mensagem preenchida automaticamente
        </span>
      </div>
    </div>
  );
};
