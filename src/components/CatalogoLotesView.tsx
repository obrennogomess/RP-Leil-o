import React, { useState, useMemo } from 'react';
import { LotItem, AuctionEvent } from '../types';
import { CATEGORIES, AUCTION_EVENTS } from '../data/lotsData';

interface CatalogoLotesViewProps {
  lots: LotItem[];
  selectedCategory?: string | null;
  selectedAuctionId?: string | null;
  initialSearchTerm?: string;
  onSelectLot: (lot: LotItem) => void;
  onBackToHome: () => void;
  onCategoryChange: (cat: string | null) => void;
  onAuctionChange: (aucId: string | null) => void;
}

export const CatalogoLotesView: React.FC<CatalogoLotesViewProps> = ({
  lots,
  selectedCategory,
  selectedAuctionId,
  initialSearchTerm = '',
  onSelectLot,
  onBackToHome,
  onCategoryChange,
  onAuctionChange
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'aberto' | 'encerrado'>('todos');
  const [sortBy, setSortBy] = useState<'relevancia' | 'menor_preco' | 'maior_preco' | 'mais_lances' | 'mais_vistos'>('relevancia');

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'todos') {
        const cat = (lot.categoria || '').toLowerCase();
        const sub = (lot.subcategoria || '').toLowerCase();
        const leilao = (lot.leilaoNome || '').toLowerCase();
        const sel = selectedCategory.toLowerCase();

        if (sel === 'materiais' || sel === 'equipamentos') {
          if (!cat.includes('materiais') && !cat.includes('equipamento') && !sub.includes('materiais') && !leilao.includes('materiais')) {
            return false;
          }
        } else if (sel === 'imoveis' || sel === 'imovel') {
          if (!cat.includes('imov') && !sub.includes('imov') && !leilao.includes('imov')) {
            return false;
          }
        } else if (sel === 'carros' || sel === 'carro') {
          if (!cat.includes('carro') && !sub.includes('veículo') && !sub.includes('veiculo') && !leilao.includes('veículo') && !leilao.includes('veiculo')) {
            return false;
          }
        } else if (sel === 'motos' || sel === 'moto') {
          if (!cat.includes('moto') && !sub.includes('moto') && !leilao.includes('moto')) {
            return false;
          }
        } else if (sel === 'pesados' || sel === 'pesado') {
          if (!cat.includes('pesad') && !sub.includes('pesad') && !leilao.includes('pesad') && !cat.includes('caminh')) {
            return false;
          }
        } else if (sel === 'utilitarios' || sel === 'utilitario') {
          if (!cat.includes('utilitar') && !sub.includes('utilitar') && !leilao.includes('utilitar')) {
            return false;
          }
        } else {
          if (!cat.includes(sel) && !sel.includes(cat) && !sub.includes(sel)) {
            return false;
          }
        }
      }

      // Auction filter
      if (selectedAuctionId && selectedAuctionId !== 'todos') {
        if (lot.leilaoId !== selectedAuctionId) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === 'aberto' && lot.status.toLowerCase().includes('encerrado')) {
        return false;
      }
      if (statusFilter === 'encerrado' && !lot.status.toLowerCase().includes('encerrado')) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = lot.titulo.toLowerCase().includes(q);
        const matchLote = lot.loteNum.toLowerCase().includes(q);
        const matchPlaca = lot.placaMascarada.toLowerCase().includes(q);
        const matchOrigem = lot.origem.toLowerCase().includes(q);
        const matchCidade = lot.cidade?.toLowerCase().includes(q);
        const matchUf = lot.uf?.toLowerCase().includes(q);
        const matchTipo = lot.tipoImovel?.toLowerCase().includes(q);
        const matchCond = lot.condicaoMaterial?.toLowerCase().includes(q);
        const matchQtd = lot.quantidade?.toLowerCase().includes(q);
        const matchCat = lot.categoria.toLowerCase().includes(q);
        const matchSub = lot.subcategoria?.toLowerCase().includes(q);
        if (
          !matchTitle &&
          !matchLote &&
          !matchPlaca &&
          !matchOrigem &&
          !matchCidade &&
          !matchUf &&
          !matchTipo &&
          !matchCond &&
          !matchQtd &&
          !matchCat &&
          !matchSub
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'menor_preco') return a.valorAtualNum - b.valorAtualNum;
      if (sortBy === 'maior_preco') return b.valorAtualNum - a.valorAtualNum;
      if (sortBy === 'mais_lances') return b.lances - a.lances;
      if (sortBy === 'mais_vistos') return b.visualizacoes - a.visualizacoes;
      return 0;
    });
  }, [lots, selectedCategory, selectedAuctionId, statusFilter, searchTerm, sortBy]);

  return (
    <div className="catalogo-lotes-container" style={{ background: '#f8fafc', minHeight: '80vh', padding: '30px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={onBackToHome}
            style={{ background: 'none', border: 'none', color: '#1e3a8a', cursor: 'pointer', padding: 0, fontWeight: 600 }}
          >
            Início
          </button>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>Catálogo Geral de Lotes</span>
          {selectedCategory && (
            <>
              <span>›</span>
              <span style={{ color: '#5D3A1F', fontWeight: 700, textTransform: 'capitalize' }}>{selectedCategory}</span>
            </>
          )}
          {selectedAuctionId && (
            <>
              <span>›</span>
              <span style={{ color: '#2563eb' }}>
                {AUCTION_EVENTS.find((a) => a.id === selectedAuctionId)?.title || `Leilão #${selectedAuctionId}`}
              </span>
            </>
          )}
        </div>

        {/* Title Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Catálogo de Lotes & Veículos
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Exibindo {filteredLots.length} oportunidades disponíveis para arrematação online e presencial.
            </p>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ← Voltar para a Home
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: !selectedCategory ? '2px solid #5D3A1F' : '1px solid #cbd5e1',
              background: !selectedCategory ? '#5D3A1F' : '#ffffff',
              color: !selectedCategory ? '#ffffff' : '#334155',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            Todos os Lotes ({lots.length})
          </button>

          {CATEGORIES.map((cat) => {
            const isSel = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: isSel ? '2px solid #5D3A1F' : '1px solid #cbd5e1',
                  background: isSel ? '#5D3A1F' : '#ffffff',
                  color: isSel ? '#ffffff' : '#334155',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                <img
                  src={cat.icone}
                  alt=""
                  width="20"
                  height="20"
                  onError={(e) => {
                    if (cat.iconeFallback) e.currentTarget.src = cat.iconeFallback;
                  }}
                />
                {cat.titulo} ({cat.total})
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            background: '#ffffff',
            padding: '16px 20px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '28px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Search box */}
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Pesquisar por modelo, marca, placa ou lote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Auction selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Leilão:</span>
            <select
              value={selectedAuctionId || 'todos'}
              onChange={(e) => onAuctionChange(e.target.value === 'todos' ? null : e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#ffffff',
                color: '#334155'
              }}
            >
              <option value="todos">Todos os leilões (9 eventos)</option>
              {AUCTION_EVENTS.map((auc) => (
                <option key={auc.id} value={auc.id}>
                  {auc.title} (#{auc.id} - {auc.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#ffffff',
                color: '#334155'
              }}
            >
              <option value="todos">Todos os status</option>
              <option value="aberto">Apenas Em Aberto</option>
              <option value="encerrado">Encerrados</option>
            </select>
          </div>

          {/* Sort selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#ffffff',
                color: '#334155'
              }}
            >
              <option value="relevancia">Relevância / Padrão</option>
              <option value="menor_preco">Menor Lance Atual</option>
              <option value="maior_preco">Maior Lance Atual</option>
              <option value="mais_lances">Mais Disputados (Lances)</option>
              <option value="mais_vistos">Mais Visitados</option>
            </select>
          </div>
        </div>

        {/* Lots Grid */}
        {filteredLots.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px dashed #cbd5e1'
            }}
          >
            <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '12px' }}>
              Nenhum lote encontrado com os filtros selecionados.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('todos');
                onCategoryChange(null);
                onAuctionChange(null);
              }}
              style={{
                padding: '8px 20px',
                background: '#1E3A8A',
                color: '#fff',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Limpar todos os filtros
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px'
            }}
          >
            {filteredLots.map((lot, idx) => (
              <div
                key={lot.id}
                className="ev-card-wrapper"
                data-index={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div
                  className="ev-lote-card"
                  onClick={() => onSelectLot(lot)}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', flex: 1, textDecoration: 'none' }}
                >
                  <div className={`ev-lote-ribbon ${lot.status === 'Encerrado' ? 'encerrado' : ''}`}>
                    {lot.status}
                  </div>

                  <div className="ev-lote-img-wrap" style={{ position: 'relative' }}>
                    <span className="ev-badge-lote">{lot.loteNum}</span>
                    <span className="ev-badge-stats">
                      <span title="Lances">
                        <i className="fa-solid fa-gavel" style={{ fontSize: '9px', marginRight: '3px' }}></i>
                        {lot.lances}
                      </span>
                      <span title="Visualizações" style={{ marginLeft: '6px' }}>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }}
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {lot.visualizacoes}
                      </span>
                    </span>

                    <img
                      src={lot.imagem}
                      alt={lot.titulo}
                      className="img"
                      width="400"
                      height="300"
                      loading="lazy"
                      style={{ width: '100%', height: '175px', objectFit: 'cover', display: 'block' }}
                    />
                  </div>

                  <div className="ev-lote-origem">{lot.origem}</div>

                  <div className="ev-lote-body" style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="ev-lote-titulo-row">
                      <span className="ev-lote-titulo" style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>
                        {lot.titulo}
                      </span>
                    </div>

                    {lot.categoria === 'imoveis' ? (
                      <div className="ev-lote-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', margin: '4px 0' }}>
                        <span>📍 {lot.cidade ? `${lot.cidade} - ${lot.uf}` : 'Brasil'} • {lot.tipoImovel || 'Imóvel'}</span>
                        {lot.areaTotal && <span>• {lot.areaTotal}</span>}
                      </div>
                    ) : lot.categoria === 'materiais' ? (
                      <div className="ev-lote-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', margin: '4px 0' }}>
                        <span>📦 {lot.quantidade || 'Lote de Materiais'}</span>
                      </div>
                    ) : (
                      lot.placaMascarada && lot.placaMascarada !== '---' && (
                        <div className="ev-lote-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', margin: '4px 0' }}>
                          <span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '3px' }}>
                              <rect x="2" y="7" width="20" height="10" rx="2" />
                              <line x1="7" y1="7" x2="7" y2="17" />
                              <line x1="17" y1="7" x2="17" y2="17" />
                            </svg>
                            {lot.placaMascarada}
                          </span>
                          {lot.anoModelo && <span>• {lot.anoModelo}</span>}
                        </div>
                      )
                    )}

                    {lot.categoria === 'imoveis' && lot.valorAvaliacao ? (
                      <div className="ev-lote-fipe" style={{ fontSize: '12px', marginTop: '6px' }}>
                        <span className="ev-fipe-label" style={{ color: '#64748b', marginRight: '4px' }}>Avaliação:</span>
                        <span className="ev-fipe-valor" style={{ fontWeight: 600, color: '#334155' }}>{lot.valorAvaliacao}</span>
                      </div>
                    ) : lot.fipe ? (
                      <div className="ev-lote-fipe" style={{ fontSize: '12px', marginTop: '6px' }}>
                        <span className="ev-fipe-label" style={{ color: '#64748b', marginRight: '4px' }}>Tabela FIPE:</span>
                        <span className="ev-fipe-valor" style={{ fontWeight: 600, color: '#334155' }}>{lot.fipe}</span>
                      </div>
                    ) : lot.condicaoMaterial ? (
                      <div className="ev-lote-fipe" style={{ fontSize: '11px', marginTop: '6px', color: '#64748b' }}>
                        <span>{lot.condicaoMaterial}</span>
                      </div>
                    ) : null}

                    {lot.abaixoFipe && (
                      <div className="ev-lote-abaixofipe" style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', margin: '3px 0' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <polyline points="19 12 12 19 5 12" />
                        </svg>
                        {lot.abaixoFipe}
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                      <div className="ev-lote-preco" style={{ fontSize: '19px', fontWeight: 800, color: '#5D3A1F' }}>
                        {lot.valorAtual}
                      </div>
                      <div className="ev-lote-preco-label" style={{ fontSize: '11px', color: '#64748b' }}>
                        Lance atual
                      </div>
                      <div className="ev-lote-data-leilao" style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                        {lot.dataLeilao}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="ev-dar-lance-bottom"
                  onClick={() => onSelectLot(lot)}
                  style={{ cursor: 'pointer' }}
                >
                  Dar lance
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
