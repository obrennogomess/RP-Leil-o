import React from 'react';

interface SpvaSectionProps {
  onOpenComoFunciona: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const SpvaSection: React.FC<SpvaSectionProps> = ({
  onOpenComoFunciona,
  onOpenAuth
}) => {
  return (
    <section className="spva-secao" id="primeira-vez-aqui">
      <div className="spva-inner">
        {/* Header */}
        <div className="spva-header">
          <div className="spva-header-texto">
            <h2 className="spva-titulo">Primeira vez aqui?</h2>
            <p className="spva-subtitulo">Nós te ajudamos a entender como funciona</p>
          </div>
          <button
            type="button"
            className="spva-btn-como"
            onClick={onOpenComoFunciona}
            style={{ border: 0, cursor: 'pointer' }}
          >
            Como funciona
          </button>
        </div>

        {/* Grid de cards */}
        <div className="spva-grid">
          {/* Card 1: Como funciona um leilão */}
          <div
            className="spva-card"
            onClick={onOpenComoFunciona}
            style={{ cursor: 'pointer' }}
          >
            <img
              className="spva-card-bg"
              src="/views/imagens/leilo-card-patio.webp"
              alt="Como funciona um leilão"
              width="741"
              height="768"
              decoding="async"
              loading="lazy"
            />
            <div className="spva-card-overlay"></div>
            <div className="spva-card-content">
              <span className="spva-card-label">Para você que nunca participou de um leilão, clica aqui e descubra</span>
              <h3 className="spva-card-titulo">Como funciona um leilão</h3>
            </div>
          </div>

          {/* Card 2: Entregamos veículos em todo Brasil */}
          <div
            className="spva-card"
            onClick={onOpenComoFunciona}
            style={{ cursor: 'pointer' }}
          >
            <img
              className="spva-card-bg"
              src="/views/imagens/leilo-card-entrega.webp"
              alt="Entregamos veículos em todo Brasil"
              width="741"
              height="768"
              decoding="async"
              loading="lazy"
            />
            <div className="spva-card-overlay"></div>
            <div className="spva-card-content">
              <span className="spva-card-label">A gente leva pra você</span>
              <h3 className="spva-card-titulo">Entregamos veículos em todo Brasil</h3>
            </div>
          </div>

          {/* Card 3: Leilão Online */}
          <div
            className="spva-card"
            onClick={onOpenComoFunciona}
            style={{ cursor: 'pointer' }}
          >
            <img
              className="spva-card-bg"
              src="/views/imagens/leilo-card-online.webp"
              alt="Leilão Online"
              width="741"
              height="768"
              decoding="async"
              loading="lazy"
            />
            <div className="spva-card-overlay"></div>
            <div className="spva-card-content">
              <span className="spva-card-label">Participe de qualquer lugar, pelo celular ou computador</span>
              <h3 className="spva-card-titulo">Leilão Online</h3>
            </div>
          </div>

          {/* Card 4: Quero comprar meu primeiro veículo */}
          <div
            className="spva-card"
            onClick={() => onOpenAuth('register')}
            style={{ cursor: 'pointer' }}
          >
            <img
              className="spva-card-bg"
              src="/views/imagens/leilo-card-patio2.webp"
              alt="Quero comprar meu primeiro veículo"
              width="741"
              height="768"
              decoding="async"
              loading="lazy"
            />
            <div className="spva-card-overlay"></div>
            <div className="spva-card-content">
              <span className="spva-card-label">Do cadastro ao primeiro lance</span>
              <h3 className="spva-card-titulo">Quero comprar meu primeiro veículo</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
