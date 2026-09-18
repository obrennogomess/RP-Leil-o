import React from 'react';

interface ComoFuncionaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const ComoFuncionaModal: React.FC<ComoFuncionaModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth
}) => {
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
          background: '#fff',
          borderRadius: '12px',
          maxWidth: '700px',
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
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafafa',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-circle-question" style={{ color: '#5D3A1F', fontSize: '20px' }}></i>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#111' }}>
              Como Funciona o Pátio RP Leilões
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
              color: '#666'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#5D3A1F',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  flexShrink: 0
                }}
              >
                1
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700 }}>Cadastro e Habilitação de Lances</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
                  Crie sua conta gratuitamente em menos de 1 minuto. Para liberação imediata dos seus lances, anexe os 3 documentos (Frente, Verso e Selfie com RG) no site ou envie direto pelo WhatsApp oficial <strong>(54) 92003-6253</strong> com mensagem pré-formatada.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#5D3A1F',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  flexShrink: 0
                }}
              >
                2
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700 }}>Escolha o Lote e Dê Seu Lance</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
                  Explore nosso catálogo completo de veículos, utilitários, motos e pesados. Analise laudos técnicos, fotos em alta definição e envie seu lance online com segurança.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#5D3A1F',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  flexShrink: 0
                }}
              >
                3
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700 }}>Arrematação e Pagamento</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
                  Se seu lance for o vencedor no fechamento do lote, você receberá a nota de arrematação oficial por e-mail e em seu painel, com dados para liquidação via TED ou PIX.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#5D3A1F',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  flexShrink: 0
                }}
              >
                4
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700 }}>Retirada ou Frete em Todo o Brasil</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
                  Retire seu veículo presencialmente em nosso pátio em Ribeirão Preto/SP ou solicite o envio para qualquer cidade do Brasil com transportadora credenciada e seguro de transporte.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Pronto para começar?</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Aproveite lotes com até 60% abaixo da Tabela FIPE.</div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              style={{
                background: '#B8874C',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '6px',
                fontWeight: 700,
                border: 0,
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Criar Conta Grátis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
