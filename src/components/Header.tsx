import React, { useState } from 'react';
import { AUCTION_EVENTS, CATEGORIES } from '../data/lotsData';
import { RegisteredUser } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenComoFunciona: () => void;
  onOpenPatios?: () => void;
  onOpenVender?: () => void;
  onOpenTermos?: () => void;
  onViewAllLots?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory?: (slug: string) => void;
  onSelectAuction?: (auctionId: string) => void;
  onScrollToAgenda?: () => void;
  user?: RegisteredUser | null;
  onOpenDashboard?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenAuth,
  onOpenComoFunciona,
  onOpenPatios,
  onOpenVender,
  onViewAllLots,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onSelectAuction,
  onScrollToAgenda,
  user,
  onOpenDashboard,
  onLogout
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'leiloes' | 'comprar' | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onViewAllLots && searchQuery.trim()) {
      onViewAllLots();
    } else if (onScrollToAgenda) {
      onScrollToAgenda();
    }
  };

  return (
    <header className="header" id="site-header">
      <div className="header-left">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img
            src="https://patiorpleiloes.com/web/img/z_leilao/logoleilo.webp"
            alt="Logo Pátio RP Leilões"
            className="logo"
            id="header-logo"
            onError={(e) => {
              e.currentTarget.src = '/web/img/z_leilao/logoleilo.webp';
            }}
          />
        </a>
      </div>

      {/* 🔍 Search Input Desktop */}
      <form className="header-search desktop-only" onSubmit={handleSearchSubmit} id="form-header-search">
        <input
          type="search"
          name="busca"
          id="input-header-search"
          placeholder="Digite o modelo, marca, bloco ou lote"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button type="submit" className="search-icon" aria-label="Buscar" id="btn-header-search">
          <i className="fa-solid fa-search"></i>
        </button>
      </form>

      {/* 🔸 Nav desktop */}
      <div className="header-nav desktop-only">
        <nav className="desktop-menu" id="nav-desktop">
          {/* Menu Leilões */}
          <div
            className={`menu-item has-submenu ${activeDropdown === 'leiloes' ? 'open' : ''}`}
            onMouseEnter={() => setActiveDropdown('leiloes')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a
              href="#agenda-leiloes"
              className="dropdown-toggle"
              onClick={(e) => {
                e.preventDefault();
                onScrollToAgenda?.();
              }}
            >
              Leilões <i className="fa-solid fa-chevron-down"></i>
            </a>
            <div
              className="dropdown-menu"
              style={{
                display: activeDropdown === 'leiloes' ? 'block' : undefined,
                maxHeight: '450px',
                overflowY: 'auto'
              }}
            >
              <div className="dropdown-header">Leilões Disponíveis ({AUCTION_EVENTS.length})</div>
              <ul className="dropdown-list">
                {AUCTION_EVENTS.map((evento) => (
                  <li className="evento-leilao" key={evento.id}>
                    <a
                      href={`#leilao-${evento.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveDropdown(null);
                        if (onSelectAuction) onSelectAuction(evento.id);
                        else onScrollToAgenda?.();
                      }}
                    >
                      <strong>{evento.title.toUpperCase()}</strong>
                      <div className="info">
                        <span>
                          <i className="fa-regular fa-calendar"></i> {evento.dataHora}
                        </span>
                        <span className="lotes">{evento.badge}</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#agenda-leiloes"
                className="dropdown-footer"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDropdown(null);
                  if (onViewAllLots) onViewAllLots();
                  else onScrollToAgenda?.();
                }}
              >
                Ver todos os leilões e lotes
              </a>
            </div>
          </div>

          {/* Menu Comprar */}
          <div
            className={`menu-item has-submenu submenu-comprar ${activeDropdown === 'comprar' ? 'open' : ''}`}
            onMouseEnter={() => setActiveDropdown('comprar')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a
              href="#categorias"
              className="submenu-toggle dropdown-toggle"
              onClick={(e) => {
                e.preventDefault();
                if (onViewAllLots) onViewAllLots();
              }}
            >
              Comprar <i className="fa-solid fa-chevron-down"></i>
            </a>
            <div className="dropdown-menu grid-comprar" style={{ display: activeDropdown === 'comprar' ? 'block' : undefined }}>
              <div className="dropdown-header">Categorias de Bens</div>
              <button
                className="btn-ver-todos"
                type="button"
                onClick={() => {
                  setActiveDropdown(null);
                  if (onViewAllLots) onViewAllLots();
                }}
              >
                Ver todos os lotes disponíveis
              </button>
              <ul className="dropdown-grid">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`#categoria-${cat.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveDropdown(null);
                        onSelectCategory?.(cat.slug);
                      }}
                    >
                      <div>
                        <img
                          src={cat.icone}
                          alt={cat.titulo}
                          width="32"
                          height="32"
                          onError={(e) => {
                            if (cat.iconeFallback) e.currentTarget.src = cat.iconeFallback;
                          }}
                        />
                      </div>
                      <div>
                        <span className="title">{cat.titulo}</span>
                        <span className="badge">{cat.total}</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Como funciona */}
          <a
            href="#como-funciona"
            onClick={(e) => {
              e.preventDefault();
              onOpenComoFunciona();
            }}
            id="nav-link-como-funciona"
          >
            Como Funciona
          </a>

          {/* Pátios */}
          {onOpenPatios && (
            <a
              href="#patios"
              onClick={(e) => {
                e.preventDefault();
                onOpenPatios();
              }}
              id="nav-link-patios"
            >
              Pátios
            </a>
          )}

          {/* Vender */}
          {onOpenVender && (
            <a
              href="#vender"
              onClick={(e) => {
                e.preventDefault();
                onOpenVender();
              }}
              id="nav-link-vender"
            >
              Vender
            </a>
          )}
        </nav>

        {/* PWA App Install Button */}
        <PWAInstallButton variant="header" />

        {/* Auth buttons */}
        <div className="auth-buttons">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={onOpenDashboard}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#0b2c4d',
                  color: '#ffffff',
                  border: '1px solid #1e3a8a',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Abrir Meu Painel / Meus Lances"
              >
                <span style={{ color: '#22c55e' }}>●</span>
                <span>{user.nome.split(' ')[0]}</span>
                <span style={{ fontSize: '10px', backgroundColor: '#16a34a', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>
                  Lances
                </span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                style={{
                  padding: '6px 10px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
                title="Desconectar"
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="btn-cadastrar"
                onClick={() => onOpenAuth('register')}
                id="btn-header-cadastrar"
              >
                Cadastrar
              </button>
              <button
                type="button"
                className="btn-login green"
                onClick={() => onOpenAuth('login')}
                id="btn-header-login"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile controls */}
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user ? (
          <button
            type="button"
            onClick={onOpenDashboard}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#0b2c4d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <span style={{ color: '#22c55e' }}>●</span>
            <span>{user.nome.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn-login"
            onClick={() => onOpenAuth('register')}
            id="btn-mobile-cadastre"
          >
            cadastre-se
          </button>
        )}

        <button
          id="menu-btn"
          className="menu-btn"
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>
    </header>
  );
};
