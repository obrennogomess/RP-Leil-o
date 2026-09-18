import React from 'react';

interface TermosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermosModal: React.FC<TermosModalProps> = ({ isOpen, onClose }) => {
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
            <i className="fa-solid fa-file-contract" style={{ color: '#5D3A1F', fontSize: '20px' }}></i>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Termos e Condições do Leilão
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

        {/* Body */}
        <div style={{ padding: '24px', fontSize: '13px', color: '#334155', lineHeight: '1.7' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: 0 }}>
            1. Das Condições Gerais e Legislação Aplicável
          </h4>
          <p>
            O presente leilão é regido pelo Decreto nº 21.981/1932 com as alterações da Lei nº 13.138/2015, pelas condições estipuladas no catálogo do evento e pelas normas vigentes da Junta Comercial.
          </p>

          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            2. Da Habilitação e Participação
          </h4>
          <p>
            Poderão participar pessoas físicas maiores de 18 anos ou emancipadas, inscritas no CPF, e pessoas jurídicas regularmente constituídas com CNPJ ativo. É obrigatório o envio prévio de documentos e a aprovação cadastral antes de efetuar lances.
          </p>

          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            3. Da Comissão do Leiloeiro e Taxas Administrativas
          </h4>
          <p>
            Ao valor do lance vencedor será acrescida a comissão de <strong>5% (cinco por cento)</strong> devida ao Leiloeiro Oficial, acrescida da taxa de administração do pátio conforme previsto na descrição de cada lote.
          </p>

          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            4. Do Pagamento do Lote Arrematado
          </h4>
          <p>
            O arrematante deverá efetuar o pagamento integral do valor do lote mais a comissão no prazo improrrogável de até <strong>24 (vinte e quatro) horas úteis</strong> após o encerramento do leilão, mediante transferência bancária (TED ou PIX) identificado para a conta oficial informada na Nota de Venda.
          </p>

          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            5. Da Retirada e Transferência
          </h4>
          <p>
            Os bens são vendidos no estado e conservação em que se encontram, cabendo ao interessado inspecioná-los durante o período de visitação. A retirada é liberada após a confirmação da liquidação bancária. A transferência de propriedade deverá ser concluída no prazo de até 30 dias pelo adquirente.
          </p>

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 24px',
                background: '#5D3A1F',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Compreendi e Concordo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
