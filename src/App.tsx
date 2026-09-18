import React, { useState, useEffect } from 'react';
import { LOTS_DATA, AUCTION_EVENTS } from './data/lotsData';
import { LotItem, RegisteredUser } from './types';
import { authService } from './services/authService';
import { AvisoBar } from './components/AvisoBar';
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { BannerSlider } from './components/BannerSlider';
import { BuscaSection } from './components/BuscaSection';
import { AgendaLeiloes } from './components/AgendaLeiloes';
import { HeroCategorias } from './components/HeroCategorias';
import { SpvaSection } from './components/SpvaSection';
import { ParceirosSection } from './components/ParceirosSection';
import { Footer } from './components/Footer';
import { LotDetailModal } from './components/LotDetailModal';
import { AuthModal } from './components/AuthModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { ComoFuncionaModal } from './components/ComoFuncionaModal';
import { PatiosModal } from './components/PatiosModal';
import { TermosModal } from './components/TermosModal';
import { VenderModal } from './components/VenderModal';
import { CatalogoLotesView } from './components/CatalogoLotesView';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [lots, setLots] = useState<LotItem[]>(LOTS_DATA);
  const [viewMode, setViewMode] = useState<'home' | 'catalog'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  
  // Auth & Bidder State
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
    bidIntentMessage?: string;
  }>({
    isOpen: false,
    mode: 'login'
  });
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Other modals
  const [isComoFuncionaOpen, setIsComoFuncionaOpen] = useState(false);
  const [isPatiosOpen, setIsPatiosOpen] = useState(false);
  const [isTermosOpen, setIsTermosOpen] = useState(false);
  const [isVenderOpen, setIsVenderOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<LotItem | null>(null);
  const [bidNotification, setBidNotification] = useState<string | null>(null);

  // Load existing session on boot
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Handle placing a new bid
  const handlePlaceBid = (lotId: string, newBid: number) => {
    if (!currentUser) {
      setAuthModal({
        isOpen: true,
        mode: 'register',
        bidIntentMessage: 'Cadastre-se ou faça login para confirmar seu lance no leilão.'
      });
      return;
    }

    setLots((prevLots) =>
      prevLots.map((item) => {
        if (item.id === lotId) {
          const formatted = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(newBid);

          const updated: LotItem = {
            ...item,
            valorAtualNum: newBid,
            valorAtual: formatted,
            lances: item.lances + 1
          };

          if (selectedLot && selectedLot.id === lotId) {
            setSelectedLot(updated);
          }

          setBidNotification(`✓ Lance de ${formatted} registrado com sucesso para ${currentUser.nome}! Você está ganhando o Lote ${item.loteNum}.`);
          setTimeout(() => setBidNotification(null), 5000);

          return updated;
        }
        return item;
      })
    );
  };

  const handleLogout = () => {
    authService.logoutUser();
    setCurrentUser(null);
    setBidNotification('Você foi desconectado com segurança.');
    setTimeout(() => setBidNotification(null), 3000);
  };

  const scrollToAgenda = () => {
    if (viewMode !== 'home') {
      setViewMode('home');
      setTimeout(() => {
        const agenda = document.getElementById('agenda-leiloes');
        if (agenda) {
          agenda.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const agenda = document.getElementById('agenda-leiloes');
      if (agenda) {
        agenda.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedAuctionId(null);
    setViewMode('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAuction = (auctionId: string) => {
    setSelectedAuctionId(auctionId);
    setSelectedCategory(null);
    setViewMode('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAllLots = () => {
    setSelectedCategory(null);
    setSelectedAuctionId(null);
    setViewMode('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthWithIntent = (mode: 'login' | 'register', reason?: string) => {
    setAuthModal({
      isOpen: true,
      mode,
      bidIntentMessage: reason
    });
  };

  // Find lot by ID for selection from Dashboard
  const handleSelectLotById = (lotId: string) => {
    const found = lots.find((l) => l.id === lotId);
    if (found) {
      setSelectedLot(found);
    }
  };

  return (
    <div className="app-container" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Indicador de Status Offline PWA */}
      <OfflineIndicator />

      {/* 1. Barra de Aviso Superior (Golpes e Canais Oficiais) */}
      <AvisoBar />

      {/* 2. Top Header com busca, menu e dados do Arrematante */}
      <Header
        onOpenMenu={() => setIsSideMenuOpen(true)}
        onOpenAuth={(mode) => openAuthWithIntent(mode)}
        onOpenComoFunciona={() => setIsComoFuncionaOpen(true)}
        onOpenPatios={() => setIsPatiosOpen(true)}
        onOpenVender={() => setIsVenderOpen(true)}
        onViewAllLots={handleViewAllLots}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={handleSelectCategory}
        onSelectAuction={handleSelectAuction}
        onScrollToAgenda={scrollToAgenda}
        user={currentUser}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onLogout={handleLogout}
      />

      {/* 3. Notificação Toast de Lance e Sucesso */}
      {bidNotification && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 10001,
            backgroundColor: '#15803d',
            color: '#fff',
            padding: '14px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            fontWeight: 700,
            maxWidth: '420px',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <span style={{ fontSize: '20px' }}>🔨</span>
          <span>{bidNotification}</span>
          <button
            type="button"
            onClick={() => setBidNotification(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '16px',
              marginLeft: 'auto',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 4. Menu Lateral Mobile & Drawer */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        onOpenAuth={(mode) => openAuthWithIntent(mode)}
        onOpenComoFunciona={() => setIsComoFuncionaOpen(true)}
        onOpenPatios={() => setIsPatiosOpen(true)}
        onOpenVender={() => setIsVenderOpen(true)}
        onOpenTermos={() => setIsTermosOpen(true)}
        onViewAllLots={handleViewAllLots}
        onSelectCategory={handleSelectCategory}
        onSelectAuction={handleSelectAuction}
        onScrollToAgenda={scrollToAgenda}
        user={currentUser}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onLogout={handleLogout}
      />

      {/* Visualização Alternada: Catálogo Completo vs Página Inicial */}
      {viewMode === 'catalog' ? (
        <CatalogoLotesView
          lots={lots}
          selectedCategory={selectedCategory}
          selectedAuctionId={selectedAuctionId}
          searchQuery={searchQuery}
          onSelectCategory={setSelectedCategory}
          onSelectAuction={setSelectedAuctionId}
          onSelectLot={(lot) => setSelectedLot(lot)}
          onBackToHome={() => {
            setViewMode('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <>
          {/* 4. Slider de Banners Promocionais Oficiais */}
          <BannerSlider
            onSlideAction={(link) => {
              if (link.startsWith('#leilao-')) {
                const id = link.replace('#leilao-', '');
                handleSelectAuction(id);
              } else if (link === '#categorias') {
                handleViewAllLots();
              } else {
                scrollToAgenda();
              }
            }}
          />

          {/* 5. Seção de Busca / Filtros Rápidos */}
          <BuscaSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={() => {
              if (searchQuery.trim()) {
                handleViewAllLots();
              } else {
                scrollToAgenda();
              }
            }}
            onSelectCategory={handleSelectCategory}
            onViewAllLots={handleViewAllLots}
            onOpenAuth={() => openAuthWithIntent('register')}
          />

          {/* 6. Agenda de Leilões em Andamento (Lotes em Destaque) */}
          <AgendaLeiloes
            events={AUCTION_EVENTS}
            lots={lots}
            onSelectLot={(lot) => {
              setSelectedLot(lot);
            }}
          />

          {/* 7. Seção Hero Categorias (Carros, Motos, Pesados, Imóveis e Materiais) */}
          <HeroCategorias
            onSelectCategory={handleSelectCategory}
            onScrollToAgenda={scrollToAgenda}
          />

          {/* 8. Seção SPVA (Primeira vez aqui?) */}
          <SpvaSection
            onOpenComoFunciona={() => setIsComoFuncionaOpen(true)}
            onOpenAuth={(mode) => openAuthWithIntent(mode)}
          />

          {/* 9. Seção de Parceiros e CTA de Cadastro */}
          <ParceirosSection onOpenAuth={(mode) => openAuthWithIntent(mode)} />
        </>
      )}

      {/* 10. Rodapé completo institucional com acordeões e contato */}
      <Footer
        onOpenComoFunciona={() => setIsComoFuncionaOpen(true)}
        onOpenAuth={(mode) => openAuthWithIntent(mode)}
        onSelectCategory={handleSelectCategory}
        onScrollToAgenda={scrollToAgenda}
      />

      {/* 11. WhatsApp Floating Action Button */}
      <a
        href="https://wa.me/5516997428815?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20leil%C3%B5es"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com atendimento via WhatsApp"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          backgroundColor: '#25d366',
          color: '#fff',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
          zIndex: 9999,
          textDecoration: 'none'
        }}
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>

      {/* Modais Interativos */}
      {selectedLot && (
        <LotDetailModal
          lot={selectedLot}
          currentUser={currentUser}
          onClose={() => setSelectedLot(null)}
          onPlaceBid={handlePlaceBid}
          onOpenAuth={(mode: 'login' | 'register' = 'register', reason?: string) => openAuthWithIntent(mode, reason)}
          onUserUpdated={(updatedUser) => {
            setCurrentUser(updatedUser);
            setBidNotification(`✓ Documentos homologados com sucesso! Você está liberado para dar lances.`);
            setTimeout(() => setBidNotification(null), 5000);
          }}
        />
      )}

      {authModal.isOpen && (
        <AuthModal
          isOpen={authModal.isOpen}
          initialMode={authModal.mode}
          bidIntentMessage={authModal.bidIntentMessage}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          onSuccess={(user) => {
            setCurrentUser(user);
            if (user.status === 'pendente_documentos' || !user.documentosCompletos) {
              setBidNotification(`Cadastro registrado com sucesso! Atenção: envie os 3 documentos (frente, verso e foto com RG) para liberar lances.`);
            } else {
              setBidNotification(`Bem-vindo, ${user.nome}! Documentação aprovada e lances liberados.`);
            }
            setTimeout(() => setBidNotification(null), 5000);
          }}
        />
      )}

      {/* Modal do Painel do Arrematante / Meus Lances */}
      {currentUser && isDashboardOpen && (
        <UserDashboardModal
          isOpen={isDashboardOpen}
          user={currentUser}
          onClose={() => setIsDashboardOpen(false)}
          onSelectLot={handleSelectLotById}
          onLogout={handleLogout}
          onUserUpdated={(updatedUser) => {
            setCurrentUser(updatedUser);
            setBidNotification(`✓ Documentos atualizados com sucesso! Lances liberados.`);
            setTimeout(() => setBidNotification(null), 5000);
          }}
        />
      )}

      {isComoFuncionaOpen && (
        <ComoFuncionaModal
          isOpen={isComoFuncionaOpen}
          onClose={() => setIsComoFuncionaOpen(false)}
          onOpenAuth={() => {
            setIsComoFuncionaOpen(false);
            openAuthWithIntent('register');
          }}
        />
      )}

      {isPatiosOpen && (
        <PatiosModal
          isOpen={isPatiosOpen}
          onClose={() => setIsPatiosOpen(false)}
        />
      )}

      {isTermosOpen && (
        <TermosModal
          isOpen={isTermosOpen}
          onClose={() => setIsTermosOpen(false)}
        />
      )}

      {isVenderOpen && (
        <VenderModal
          isOpen={isVenderOpen}
          onClose={() => setIsVenderOpen(false)}
        />
      )}
    </div>
  );
}
