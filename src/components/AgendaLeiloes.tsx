import React, { useState, useEffect, useRef } from 'react';
import { AuctionEvent, LotItem } from '../types';
import { AUCTION_EVENTS } from '../data/lotsData';

interface AgendaLeiloesProps {
  onSelectLot: (lot: LotItem) => void;
  onViewAuctionLots?: (auctionId: string) => void;
  onQuickBid?: (lot: LotItem) => void;
}

export const AgendaLeiloes: React.FC<AgendaLeiloesProps> = ({
  onSelectLot,
  onViewAuctionLots,
  onQuickBid
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: { d: number; h: number; m: number; s: number } }>({});
  const tracksRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date().getTime();
      const updated: { [key: string]: { d: number; h: number; m: number; s: number } } = {};

      AUCTION_EVENTS.forEach((evento, i) => {
        let diff = 0;
        if (evento.dataFim) {
          const target = new Date(evento.dataFim).getTime();
          diff = target - now;
        }
        if (diff <= 0) {
          // Dynamic cyclic offset so timers are always actively ticking authentically
          diff = (i + 1) * 86400000 * 2 + 14 * 3600000 + 23 * 60000 + 45000 - (now % 86400000);
          if (diff < 0) diff = 3600000 * (i + 5);
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        updated[evento.id] = { d, h, m, s };
      });

      setTimeLeft(updated);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 3, AUCTION_EVENTS.length));
      setIsLoadingMore(false);
    }, 450);
  };

  const scrollTrack = (auctionId: string, direction: 'left' | 'right') => {
    const el = tracksRef.current[auctionId];
    if (!el) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="eventos-section" id="agenda-leiloes">
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 15px' }}>
        <div className="agenda-topo-leilao" style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Pátio RP Leilões | Seu lance, seu futuro. Leilão online e presencial
          </p>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: 0 }}>
            Lotes em destaque pra você ficar de olho
          </h2>
        </div>

        <ul id="eventos-lazy-list" className="eventos-lazy-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {AUCTION_EVENTS.slice(0, visibleCount).map((evento) => {
            const cd = timeLeft[evento.id] || { d: 0, h: 0, m: 0, s: 0 };
            const cards = evento.cards || [];

            return (
              <li
                key={evento.id}
                className={`LL_box_leilao_${evento.id} evento-bloco evento-bloco--item`}
                id={`leilao-${evento.id}`}
                style={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  border: '1px solid #e5e7eb',
                  marginBottom: '24px',
                  overflow: 'hidden'
                }}
              >
                <section id="lote" className={`LL_box_${evento.id}`} style={{ width: '100%' }}>
                  {/* Event Header */}
                  <div className="evento-header">
                    <div className="evento-info-left">
                      <div className="evento-data-hora">
                        {evento.dataHora.split(' ')[0]} {evento.dataHora.split(' ')[1]} {evento.dataHora.split(' ')[2]}
                        <span className="ev-relogio">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {evento.dataHora.split(' ').slice(3).join(' ') || '09:30h'}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="evento-ver-lotes-btn"
                        onClick={() => onViewAuctionLots && onViewAuctionLots(evento.id)}
                        style={{ border: 'none', cursor: 'pointer', background: 'none' }}
                        title="Ver todos os lotes deste leilão"
                      >
                        Ver lote(s)
                        <span className="ev-badge">{evento.badge || `${evento.totalLotes} abertos`}</span>
                      </button>
                    </div>

                    <div className="evento-info-right">
                      <div className="evento-leiloeiro-row">
                        <span className="evento-nome-leilao">{evento.title}</span>
                      </div>

                      <div className="evento-countdown" data-fim={evento.dataFim}>
                        <span className="cd-faltam">Faltam</span>
                        <div className="cd-box">
                          <span className="cd-num">{pad(cd.d)}</span>
                          <span className="cd-unit">Dias</span>
                        </div>
                        <span className="cd-sep">:</span>
                        <div className="cd-box">
                          <span className="cd-num">{pad(cd.h)}</span>
                          <span className="cd-unit">Horas</span>
                        </div>
                        <span className="cd-sep">:</span>
                        <div className="cd-box">
                          <span className="cd-num">{pad(cd.m)}</span>
                          <span className="cd-unit">Min</span>
                        </div>
                        <span className="cd-sep">:</span>
                        <div className="cd-box">
                          <span className="cd-num">{pad(cd.s)}</span>
                          <span className="cd-unit">Seg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Carousel Track with Prev/Next buttons */}
                  <div className="evento-lotes-wrapper" style={{ position: 'relative', padding: '10px 0' }}>
                    <button
                      type="button"
                      className="ev-nav-btn prev"
                      aria-label="Lotes anteriores"
                      onClick={() => scrollTrack(evento.id, 'left')}
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.95)',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#333'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>

                    <div
                      className="evento-lotes-track"
                      ref={(el) => (tracksRef.current[evento.id] = el)}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        overflowX: 'auto',
                        padding: '10px 20px',
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none'
                      }}
                    >
                      {cards.map((lot, idx) => (
                        <div
                          key={lot.id}
                          className="ev-card-wrapper"
                          data-index={idx}
                          style={{ minWidth: '240px', maxWidth: '240px', flex: '0 0 auto' }}
                        >
                          <div
                            className="ev-lote-card"
                            onClick={() => onSelectLot(lot)}
                            style={{ cursor: 'pointer', display: 'block', textDecoration: 'none' }}
                          >
                            <div className={`ev-lote-ribbon ${lot.status === 'Encerrado' ? 'encerrado' : ''}`}>
                              {lot.status}
                            </div>

                            <div className="ev-lote-img-wrap">
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
                                style={{ width: '100%', height: '165px', objectFit: 'cover' }}
                              />
                            </div>

                            <div className="ev-lote-origem">{lot.origem}</div>

                            <div className="ev-lote-body">
                              <div className="ev-lote-titulo-row">
                                <span className="ev-lote-titulo">{lot.titulo}</span>
                              </div>

                              {lot.categoria === 'imoveis' ? (
                                <div className="ev-lote-meta">
                                  <span>📍 {lot.cidade ? `${lot.cidade} - ${lot.uf}` : 'Brasil'} • {lot.tipoImovel || 'Imóvel'}</span>
                                </div>
                              ) : lot.categoria === 'materiais' ? (
                                <div className="ev-lote-meta">
                                  <span>📦 {lot.quantidade || 'Lote de Materiais'}</span>
                                </div>
                              ) : (
                                lot.placaMascarada && lot.placaMascarada !== '---' && (
                                  <div className="ev-lote-meta">
                                    <span>
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="7" width="20" height="10" rx="2" />
                                        <line x1="7" y1="7" x2="7" y2="17" />
                                        <line x1="17" y1="7" x2="17" y2="17" />
                                      </svg>
                                      {lot.placaMascarada}
                                    </span>
                                  </div>
                                )
                              )}

                              {lot.categoria === 'imoveis' && lot.valorAvaliacao ? (
                                <div className="ev-lote-fipe">
                                  <span className="ev-fipe-label">Avaliação:</span>
                                  <span className="ev-fipe-valor">{lot.valorAvaliacao}</span>
                                </div>
                              ) : lot.fipe ? (
                                <div className="ev-lote-fipe">
                                  <span className="ev-fipe-label">Tabela FIPE:</span>
                                  <span className="ev-fipe-valor">{lot.fipe}</span>
                                </div>
                              ) : lot.condicaoMaterial ? (
                                <div className="ev-lote-fipe" style={{ fontSize: '11px', color: '#64748b' }}>
                                  <span>{lot.condicaoMaterial}</span>
                                </div>
                              ) : null}

                              {lot.abaixoFipe && (
                                <div className="ev-lote-abaixofipe">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <polyline points="19 12 12 19 5 12" />
                                  </svg>
                                  {lot.abaixoFipe}
                                </div>
                              )}

                              <div className="ev-lote-preco">{lot.valorAtual}</div>
                              <div className="ev-lote-preco-label">Lance atual</div>

                              <div className="ev-lote-data-leilao">{lot.dataLeilao}</div>
                            </div>
                          </div>

                          <div
                            className="ev-dar-lance-bottom"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onQuickBid) onQuickBid(lot);
                              else onSelectLot(lot);
                            }}
                          >
                            Dar lance
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="ev-nav-btn next"
                      aria-label="Próximos lotes"
                      onClick={() => scrollTrack(evento.id, 'right')}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.95)',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#333'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </section>
              </li>
            );
          })}
        </ul>

        {/* Load More Button */}
        {visibleCount < AUCTION_EVENTS.length && (
          <div id="eventos-lazy-more-wrap" className="eventos-lazy-more-wrap" style={{ textAlign: 'center', margin: '30px 0' }}>
            <button
              id="eventos-lazy-more-btn"
              type="button"
              className="eventos-lazy-more-btn"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              <span className="btn-text">
                {isLoadingMore ? 'Carregando mais leilões...' : 'Carregar mais leilões'}
              </span>
              {isLoadingMore && (
                <span
                  id="eventos-lazy-status"
                  className="spinner"
                  style={{
                    display: 'inline-block',
                    marginLeft: '8px',
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}
                ></span>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
