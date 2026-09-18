import React from 'react';

interface HeroCategoriasProps {
  onSelectCategory: (category: string) => void;
  onScrollToAgenda: () => void;
}

export const HeroCategorias: React.FC<HeroCategoriasProps> = ({
  onSelectCategory,
  onScrollToAgenda
}) => {
  return (
    <section className="secao-hero-categorias" id="secao-categorias-destaque">
      <div className="shc-inner">
        {/* Col 1: Título + Botão */}
        <div className="shc-titulo-bloco">
          <h2 className="shc-titulo">
            Seu <span>próximo veículo</span> a uma batida de martelo
          </h2>
          <button
            type="button"
            className="shc-btn-ver-lotes"
            onClick={onScrollToAgenda}
            style={{ border: 0, cursor: 'pointer' }}
          >
            Ver lotes
          </button>
        </div>

        {/* Col 2: Cards de Categoria */}
        <div className="shc-categorias-grid">
          {/* Card Carros (destaque) */}
          <div
            className="shc-card-cat shc-card-cat-destaque"
            onClick={() => onSelectCategory('carros')}
            style={{ cursor: 'pointer' }}
          >
            <div className="shc-card-img-wrap">
              <img
                src="/views/imagens/carros-veiculos-opt.webp"
                alt="Leilão de Carros"
                width="340"
                height="250"
                decoding="async"
                loading="lazy"
              />
            </div>
            <span className="shc-card-label">Leilão de</span>
            <h3 className="shc-card-nome">Carros</h3>
            <p className="shc-card-desc">Leilão excelência do Brasil.</p>
            <span className="shc-card-seta" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>

          {/* Sub-grid: Motos + Pesados */}
          <div className="shc-sub-grid">
            {/* Card Motos */}
            <div
              className="shc-card-cat"
              onClick={() => onSelectCategory('motos')}
              style={{ cursor: 'pointer' }}
            >
              <div className="shc-card-img-wrap">
                <img
                  src="/views/imagens/motos-veiculos-opt.webp"
                  alt="Leilão de Motos"
                  width="340"
                  height="239"
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <span className="shc-card-label">Leilão de</span>
              <h3 className="shc-card-nome">Motos</h3>
              <p className="shc-card-desc">Leilão de maior prestígio no Brasil</p>
              <span className="shc-card-seta" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>

            {/* Card Pesados */}
            <div
              className="shc-card-cat"
              onClick={() => onSelectCategory('pesados')}
              style={{ cursor: 'pointer' }}
            >
              <div className="shc-card-img-wrap">
                <img
                  src="/views/imagens/caminhoes-utilitarios-opt.webp"
                  alt="Leilão de Pesados"
                  width="340"
                  height="239"
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <span className="shc-card-label">Leilão de</span>
              <h3 className="shc-card-nome">Pesados</h3>
              <p className="shc-card-desc">O maior leilão de pesados do Brasil</p>
              <span className="shc-card-seta" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>

            {/* Card Imóveis */}
            <div
              className="shc-card-cat"
              onClick={() => onSelectCategory('imoveis')}
              style={{ cursor: 'pointer' }}
            >
              <div className="shc-card-img-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/views/imagens/icones3d/imovel.png"
                  alt="Leilão de Imóveis"
                  width="130"
                  height="130"
                  style={{ objectFit: 'contain', margin: '0 auto', display: 'block', maxHeight: '130px' }}
                />
              </div>
              <span className="shc-card-label">Leilão de</span>
              <h3 className="shc-card-nome">Imóveis</h3>
              <p className="shc-card-desc">Casas, apartamentos e terrenos comerciais</p>
              <span className="shc-card-seta" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>

            {/* Card Materiais */}
            <div
              className="shc-card-cat"
              onClick={() => onSelectCategory('materiais')}
              style={{ cursor: 'pointer' }}
            >
              <div className="shc-card-img-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/views/imagens/icones3d/equipamento.png"
                  alt="Leilão de Materiais"
                  width="130"
                  height="130"
                  style={{ objectFit: 'contain', margin: '0 auto', display: 'block', maxHeight: '130px' }}
                />
              </div>
              <span className="shc-card-label">Leilão de</span>
              <h3 className="shc-card-nome">Materiais</h3>
              <p className="shc-card-desc">Equipamentos, informática e bens diversos</p>
              <span className="shc-card-seta" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Col 3: Banner escuro */}
        <div
          className="shc-banner-dark"
          onClick={onScrollToAgenda}
          style={{ cursor: 'pointer' }}
        >
          <img
            className="shc-banner-dark-bg"
            src="/views/imagens/carro-seminovo-home.webp"
            alt="Explore novas possibilidades"
            width="960"
            height="1368"
            decoding="async"
            loading="lazy"
          />
          <div className="shc-banner-dark-content">
            <p className="shc-banner-dark-sub">
              Mais que uma conquista, é a sensação de liberdade em cada quilômetro
            </p>
            <h3 className="shc-banner-dark-titulo">
              Escolha seu próprio caminho e explore novas possibilidades
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};
