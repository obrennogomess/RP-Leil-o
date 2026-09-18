import React, { useState, useMemo } from 'react';
import { CATEGORIES, QUICK_CARDS_DATA } from '../data/lotsData';
import { LotItem } from '../types';

interface BuscaSectionProps {
  lots: LotItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectLot: (lot: LotItem) => void;
  onSelectCategory: (slug: string) => void;
  onViewAllLots?: () => void;
}

export const BuscaSection: React.FC<BuscaSectionProps> = ({
  lots,
  searchQuery,
  onSearchChange,
  onSelectLot,
  onSelectCategory,
  onViewAllLots
}) => {
  const [activeTab, setActiveTab] = useState<'texto' | 'filtros'>('texto');

  // Filter quick cards according to searchQuery if present
  const displayCards = useMemo(() => {
    if (!searchQuery.trim()) return QUICK_CARDS_DATA;
    const q = searchQuery.toLowerCase();
    return lots.filter(
      (l) =>
        l.titulo.toLowerCase().includes(q) ||
        l.categoria.toLowerCase().includes(q) ||
        (l.subcategoria && l.subcategoria.toLowerCase().includes(q)) ||
        (l.tipoImovel && l.tipoImovel.toLowerCase().includes(q)) ||
        (l.cidade && l.cidade.toLowerCase().includes(q)) ||
        (l.condicaoMaterial && l.condicaoMaterial.toLowerCase().includes(q)) ||
        l.origem.toLowerCase().includes(q) ||
        l.loteNum.toLowerCase().includes(q)
    );
  }, [lots, searchQuery]);

  return (
    <section className="busca-container" id="secao-busca">
      {/* Tabs */}
      <div className="busca-tabs">
        <button
          type="button"
          className={`busca-tab ${activeTab === 'texto' ? 'active' : ''}`}
          onClick={() => setActiveTab('texto')}
          id="tab-btn-pesquisa"
        >
          Pesquisa
        </button>
        <button
          type="button"
          className={`busca-tab ${activeTab === 'filtros' ? 'active' : ''}`}
          onClick={() => setActiveTab('filtros')}
          id="tab-btn-categoria"
        >
          Categoria
        </button>
      </div>

      {/* FIXED SEARCH INPUT */}
      <div className="busca-busca-button">
        <form
          className="busca-input-group"
          onSubmit={(e) => {
            e.preventDefault();
            if (onViewAllLots && searchQuery.trim()) {
              onViewAllLots();
            }
          }}
          id="form-busca-principal"
        >
          <button
            type="submit"
            className="busca-icon"
            aria-label="Buscar"
            id="btn-busca-submit"
            style={{ border: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <input
            type="search"
            name="busca"
            className="busca-input"
            id="input-busca-principal"
            placeholder="Digite o modelo, marca, leilão..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (activeTab !== 'texto') setActiveTab('texto');
            }}
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{ background: 'none', border: 0, padding: '0 10px', cursor: 'pointer', color: '#888', fontSize: '16px' }}
              title="Limpar busca"
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {/* Content wrapper */}
      <div className="busca-tab-wrapper">
        {activeTab === 'texto' ? (
          <div className="busca-tab-content active" id="tab-texto">
            <div className="card-grid">
              {displayCards.map((lot) => (
                <div
                  className="card-item"
                  key={lot.id}
                  onClick={() => onSelectLot(lot)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-item-link">
                    <img
                      src={lot.imagem}
                      alt={lot.titulo}
                      className="img"
                      style={{ borderRadius: '3px', width: '100%', height: '140px', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div className="card-overlay">
                      <p className="card-titulo">{lot.titulo}</p>
                      <span className="card-categoria">{lot.subcategoria || lot.categoria}</span>
                      <span className="card-preco">{lot.valorAtual}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {onViewAllLots && (
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={onViewAllLots}
                  style={{
                    backgroundColor: '#1E3A8A',
                    color: '#ffffff',
                    padding: '12px 28px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(30,58,138,0.25)',
                    transition: 'all 0.2s'
                  }}
                >
                  Ver todos os 138 lotes disponíveis →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="busca-tab-content active" id="tab-filtros" style={{ padding: '8px 0' }}>
            <ul
              className="dropdown-grid-cate dropdown‑grid-cate"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '14px',
                listStyle: 'none',
                padding: '12px 0 0 0',
                margin: 0
              }}
            >
              {CATEGORIES.map((cat) => (
                <li key={cat.id} style={{ margin: 0 }}>
                  <a
                    href={`#categoria-${cat.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectCategory(cat.slug);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '8px',
                      border: '1px solid #e2e8f0',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#1e293b',
                      background: '#ffffff',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#1e293b';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      <img
                        src={cat.icone}
                        alt={cat.titulo}
                        width="46"
                        height="46"
                        style={{ objectFit: 'contain', display: 'block', transition: 'transform 0.3s ease' }}
                        onError={(e) => {
                          if (cat.iconeFallback) {
                            e.currentTarget.src = cat.iconeFallback;
                          }
                        }}
                      />
                      <span
                        className="badge"
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px'
                        }}
                      >
                        {cat.total}
                      </span>
                    </div>
                    <div>
                      <p
                        className="title"
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#0f172a',
                          margin: '4px 0 0 0'
                        }}
                      >
                        Leilão de {cat.titulo}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
