import React from 'react';

interface ParceirosSectionProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const ParceirosSection: React.FC<ParceirosSectionProps> = ({ onOpenAuth }) => {
  return (
    <>
      <section className="secao-parceiros" id="parceiros">
        <div className="parceiros-inner">
          <picture>
            <source media="(min-width: 768px)" srcSet="/views/imagens/parceiros.webp" />
            <img
              src="/views/imagens/parceirosmob.webp"
              alt="Nossos parceiros"
              className="parceiros-img"
              loading="lazy"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </picture>
        </div>
      </section>

      {/* CTA Box de Cadastro */}
      <div className="cta-card centerr" style={{ marginBottom: '24px', maxWidth: '1200px', margin: '0 auto 24px auto', padding: '0 16px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #3D2817 0%, #5D3A1F 100%)',
            borderRadius: '12px',
            padding: '24px',
            color: '#fff',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-user-plus" style={{ color: '#B8874C' }}></i>
              Faça seu cadastro e participe dos leilões
            </div>
            <div style={{ fontSize: '13px', color: '#e5d7cc', marginTop: '4px' }}>
              Leva menos de 1 minuto e libera lances, alertas e documentos do lote.
            </div>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', listStyle: 'none', padding: 0, fontSize: '12px', color: '#f5efe7' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#48bb78' }}></i> Dar lances com 1 clique
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#48bb78' }}></i> Acompanhamento em tempo real
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#48bb78' }}></i> Segurança jurídica total
              </li>
            </ul>
          </div>
          <button
            type="button"
            className="btn-cadastrar"
            onClick={() => onOpenAuth('register')}
            style={{
              background: '#B8874C',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 'bold',
              border: 0,
              cursor: 'pointer',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            Cadastrar Agora
          </button>
        </div>
      </div>
    </>
  );
};
