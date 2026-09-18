import React, { useState } from 'react';
import { AUCTION_EVENTS, CATEGORIES } from '../data/lotsData';
import { RegisteredUser } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenComoFunciona: () => void;
  onOpenPatios?: () => void;
  onOpenVender?: () => void;
  onOpenTermos?: () => void;
  onViewAllLots?: () => void;
  onSelectCategory?: (slug: string) => void;
  onSelectAuction?: (auctionId: string) => void;
  onScrollToAgenda?: () => void;
  user?: RegisteredUser | null;
  onOpenDashboard?: () => void;
  onLogout?: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenComoFunciona,
  onOpenPatios,
  onOpenVender,
  onOpenTermos,
  onViewAllLots,
  onSelectCategory,
  onSelectAuction,
  onScrollToAgenda,
  user,
  onOpenDashboard,
  onLogout
}) => {
  const [leilaoOpen, setLeilaoOpen] = useState(false);
  const [comprarOpen, setComprarOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="menu-overlay"
        id="side-menu-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 998
        }}
      />
      <nav id="side-menu" className={`side-menu ${isOpen ? 'active' : ''}`} style={{ zIndex: 999 }}>
        <button className="close-btn" id="close-menu" type="button" onClick={onClose} aria-label="Fechar menu">
          ✕
        </button>

        <div className="side-menu-header">
          {user ? (
            <div style={{ padding: '8px 0', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '15px', color: '#0b2c4d' }}>{user.nome}</span>
                <span style={{ fontSize: '10px', backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                  HABILITADO
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>
                Arrematante #{user.id} • {user.email}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDashboard?.();
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#0b2c4d',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🔨 Meus Lances
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout?.();
                    onClose();
                  }}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f1f5f9',
                    color: '#dc2626',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="btn-cadastrar"
                onClick={() => {
                  onClose();
                  onOpenAuth('register');
                }}
              >
                Cadastrar
              </button>
              <button
                type="button"
                className="btn-login green"
                onClick={() => {
                  onClose();
                  onOpenAuth('login');
                }}
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* PWA Download Banner in Mobile Menu */}
        <div style={{ padding: '0 16px 8px' }}>
          <PWAInstallButton variant="menu" />
        </div>

        <ul className="menu-list">
          <div>
            <p>Menu do site</p>
          </div>

          {/* Submenu Leilão */}
          <li className={`menu-item has-submenu ${leilaoOpen ? 'active' : ''}`}>
            <span
              className="menu-title"
              onClick={() => setLeilaoOpen(!leilaoOpen)}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>Leilões Ativos ({AUCTION_EVENTS.length})</span>
              <i className={`fa-solid fa-chevron-${leilaoOpen ? 'up' : 'down'}`}></i>
            </span>
            {leilaoOpen && (
              <ul className="submenu leilao-mobile" style={{ display: 'block', paddingLeft: 10 }}>
                {AUCTION_EVENTS.map((evento) => (
                  <li className="evento-leilao" key={evento.id} style={{ margin: '8px 0' }}>
                    <a
                      href={`#leilao-${evento.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        if (onSelectAuction) onSelectAuction(evento.id);
                        else onScrollToAgenda?.();
                      }}
                    >
                      <strong>{evento.title.toUpperCase()}</strong>
                      <div className="info" style={{ fontSize: 12, color: '#666' }}>
                        <span>
                          <i className="fa-regular fa-calendar"></i> {evento.dataHora}
                        </span>
                        <span className="lotes" style={{ marginLeft: 8 }}>{evento.badge}</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Submenu Comprar */}
          <li className={`menu-item has-submenu ${comprarOpen ? 'active' : ''}`}>
            <span
              className="menu-title"
              onClick={() => setComprarOpen(!comprarOpen)}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>Categorias</span>
              <i className={`fa-solid fa-chevron-${comprarOpen ? 'up' : 'down'}`}></i>
            </span>
            {comprarOpen && (
              <ul className="submenu comprar-mobile" style={{ display: 'block', paddingLeft: 10 }}>
                <li style={{ margin: '6px 0' }}>
                  <a
                    href="#todos-lotes"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      onViewAllLots?.();
                    }}
                    style={{ fontWeight: 700, color: '#1E3A8A' }}
                  >
                    Ver Todos os Lotes →
                  </a>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.id} style={{ margin: '8px 0' }}>
                    <a
                      href={`#cat-${cat.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        onSelectCategory?.(cat.slug);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <img
                        src={cat.icone}
                        alt={cat.titulo}
                        width="20"
                        height="20"
                        onError={(e) => {
                          if (cat.iconeFallback) e.currentTarget.src = cat.iconeFallback;
                        }}
                      />
                      <span>{cat.titulo}</span>
                      <span className="badge" style={{ marginLeft: 'auto', fontSize: 11, background: '#eee', padding: '2px 6px', borderRadius: 4 }}>
                        {cat.total}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="menu-item">
            <a
              href="#como-funciona"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                onOpenComoFunciona();
              }}
            >
              Como Funciona
            </a>
          </li>

          {onOpenPatios && (
            <li className="menu-item">
              <a
                href="#patios"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  onOpenPatios();
                }}
              >
                Pátios & Visitação
              </a>
            </li>
          )}

          {onOpenVender && (
            <li className="menu-item">
              <a
                href="#vender"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  onOpenVender();
                }}
              >
                Vender no Leilão
              </a>
            </li>
          )}

          {onOpenTermos && (
            <li className="menu-item">
              <a
                href="#termos"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  onOpenTermos();
                }}
              >
                Termos e Condições
              </a>
            </li>
          )}

          <li className="menu-item" style={{ marginTop: 20, borderTop: '1px solid #eee', paddingTop: 15 }}>
            <a
              href="https://wa.me/5516997428815"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <i className="fa-brands fa-whatsapp" style={{ fontSize: 18 }}></i>
              <span>(16) 99742-8815</span>
            </a>
          </li>

          <li className="menu-item">
            <a href="tel:+551632364190" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fa-solid fa-phone" style={{ fontSize: 16 }}></i>
              <span>(16) 3236-4190</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};
