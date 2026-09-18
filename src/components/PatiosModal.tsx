import React from 'react';

interface PatiosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatiosModal: React.FC<PatiosModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          maxWidth: '740px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-warehouse" style={{ color: '#5D3A1F', fontSize: '20px' }}></i>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Pátios & Unidades de Armazenamento
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 0,
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              Os veículos e lotes leiloados no Pátio RP Leilões ficam custodiados em nossas instalações monitoradas com segurança 24 horas por dia, com vistoria cautelar e guarda segurada.
            </p>
          </div>

          {/* Unidade Principal */}
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '20px',
              background: '#ffffff',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1e3a8a' }}>
                Unidade Central de Armazenamento — Ribeirão Preto / SP
              </h4>
              <span
                style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                Pátio Ativo
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '13px', color: '#334155' }}>
              <div>
                <strong style={{ display: 'block', color: '#0f172a', marginBottom: '4px' }}>Endereço:</strong>
                Rua General Câmara, 2930<br />
                Vila Recreio — Ribeirão Preto / SP<br />
                CEP: 14060-030
              </div>

              <div>
                <strong style={{ display: 'block', color: '#0f172a', marginBottom: '4px' }}>Horário de Visitação:</strong>
                Segunda a Sexta-feira: das 08h30 às 17h00<br />
                Sábados: das 08h30 às 12h00<br />
                (Mediante agendamento prévio)
              </div>

              <div>
                <strong style={{ display: 'block', color: '#0f172a', marginBottom: '4px' }}>Canais de Atendimento:</strong>
                Telefone: (16) 3236-4190<br />
                WhatsApp: (16) 99742-8815<br />
                E-mail: contato@patiorpleiloes.com
              </div>

              <div>
                <strong style={{ display: 'block', color: '#0f172a', marginBottom: '4px' }}>Estrutura:</strong>
                Capacidade para +1.200 veículos<br />
                Vistoria Cautelar in loco<br />
                Câmeras CFTV 24h e Seguro Total
              </div>
            </div>
          </div>

          {/* Regras de Visitação */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              Regras e Instruções para Visita Presencial
            </h5>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
              <li>As visitas são liberadas nos 2 dias úteis que antecedem a data do leilão.</li>
              <li>É obrigatória a apresentação de documento de identificação original com foto na portaria.</li>
              <li>Não é permitida a entrada de pessoas com mochilas grandes, alimentos ou animais.</li>
              <li>A vistoria visual é permitida em todos os lotes; o acionamento de motor e teste mecânico ocorre conforme autorização do comitente.</li>
            </ul>
          </div>

          {/* Envio / Cegonha */}
          <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <h5 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: '#1e3a8a' }}>
              Transporte e Frete Cegonha para Todo o Brasil
            </h5>
            <p style={{ margin: 0, fontSize: '13px', color: '#1e40af', lineHeight: '1.5' }}>
              Caso você more em outro estado ou prefira comodidade, disponibilizamos frete com transportadoras conveniadas e seguro de carga de 100% da FIPE até a sua residência ou empresa. Solicite uma cotação rápida com nossa equipe pelo WhatsApp oficial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
