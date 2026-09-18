import React, { useState } from 'react';

interface FooterProps {
  onOpenComoFunciona: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSelectCategory: (cat: string) => void;
  onScrollToAgenda: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenComoFunciona,
  onOpenAuth,
  onSelectCategory,
  onScrollToAgenda
}) => {
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    conheca: false,
    regulamentos: false,
    leiloes: false,
    patio: false,
    conta: false
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-container">
        {/* Accordions */}
        <div className="footer-accordion">
          {/* Item 1: Conheça */}
          <div className="footer-accordion-item">
            <button
              className="footer-accordion-title"
              type="button"
              onClick={() => toggleAccordion('conheca')}
            >
              Conheça
              <i className={`fa-solid fa-chevron-${openAccordions.conheca ? 'up' : 'down'}`}></i>
            </button>
            <div className={`footer-accordion-content ${openAccordions.conheca ? 'open' : ''}`}>
              <a href="#como-funciona" onClick={(e) => { e.preventDefault(); onOpenComoFunciona(); }}>
                Nossa História
              </a>
              <a href="#agenda-leiloes" onClick={(e) => { e.preventDefault(); onScrollToAgenda(); }}>
                Sobre o Pátio RP Leilões
              </a>
            </div>
          </div>

          {/* Item 2: Regulamentos */}
          <div className="footer-accordion-item">
            <button
              className="footer-accordion-title"
              type="button"
              onClick={() => toggleAccordion('regulamentos')}
            >
              Regulamentos
              <i className={`fa-solid fa-chevron-${openAccordions.regulamentos ? 'up' : 'down'}`}></i>
            </button>
            <div className={`footer-accordion-content ${openAccordions.regulamentos ? 'open' : ''}`}>
              <a href="#como-funciona" onClick={(e) => { e.preventDefault(); onOpenComoFunciona(); }}>
                Como Funciona
              </a>
              <a href="#como-funciona" onClick={(e) => { e.preventDefault(); onOpenComoFunciona(); }}>
                Dúvidas Frequentes
              </a>
              <a href="#como-funciona" onClick={(e) => { e.preventDefault(); onOpenComoFunciona(); }}>
                Leilão Online
              </a>
              <a href="#como-funciona" onClick={(e) => { e.preventDefault(); onOpenComoFunciona(); }}>
                Política de Privacidade
              </a>
              <a href="#como-funciona" onClick={(e) => { e.preventDefault(); onOpenComoFunciona(); }}>
                Política de Segurança
              </a>
            </div>
          </div>

          {/* Item 3: Leilões */}
          <div className="footer-accordion-item">
            <button
              className="footer-accordion-title"
              type="button"
              onClick={() => toggleAccordion('leiloes')}
            >
              Leilões
              <i className={`fa-solid fa-chevron-${openAccordions.leiloes ? 'up' : 'down'}`}></i>
            </button>
            <div className={`footer-accordion-content ${openAccordions.leiloes ? 'open' : ''}`}>
              <a href="#categoria-carros" onClick={(e) => { e.preventDefault(); onSelectCategory('carros'); }}>
                Leilão de Carros
              </a>
              <a href="#categoria-motos" onClick={(e) => { e.preventDefault(); onSelectCategory('motos'); }}>
                Leilão de Motos
              </a>
              <a href="#categoria-pesados" onClick={(e) => { e.preventDefault(); onSelectCategory('pesados'); }}>
                Leilão de Pesados
              </a>
              <a href="#categoria-utilitarios" onClick={(e) => { e.preventDefault(); onSelectCategory('utilitarios'); }}>
                Leilão de Utilitários
              </a>
              <a href="#categoria-imoveis" onClick={(e) => { e.preventDefault(); onSelectCategory('imoveis'); }}>
                Leilão de Imóveis
              </a>
            </div>
          </div>

          {/* Item 4: Pátio */}
          <div className="footer-accordion-item">
            <button
              className="footer-accordion-title"
              type="button"
              onClick={() => toggleAccordion('patio')}
            >
              Pátio
              <i className={`fa-solid fa-chevron-${openAccordions.patio ? 'up' : 'down'}`}></i>
            </button>
            <div className={`footer-accordion-content ${openAccordions.patio ? 'open' : ''}`}>
              <span>Ribeirão Preto / SP</span>
              <span>Atendimento: Seg à Sex, 08h às 18h</span>
              <span>Visitação com agendamento prévio</span>
            </div>
          </div>

          {/* Item 5: Minha Conta */}
          <div className="footer-accordion-item">
            <button
              className="footer-accordion-title"
              type="button"
              onClick={() => toggleAccordion('conta')}
            >
              Minha Conta
              <i className={`fa-solid fa-chevron-${openAccordions.conta ? 'up' : 'down'}`}></i>
            </button>
            <div className={`footer-accordion-content ${openAccordions.conta ? 'open' : ''}`}>
              <a href="#login" onClick={(e) => { e.preventDefault(); onOpenAuth('login'); }}>
                Login
              </a>
              <a href="#cadastrar" onClick={(e) => { e.preventDefault(); onOpenAuth('register'); }}>
                Cadastrar
              </a>
              <a href="#recuperar" onClick={(e) => { e.preventDefault(); onOpenAuth('login'); }}>
                Recuperar Senha
              </a>
            </div>
          </div>
        </div>

        {/* Institucional text */}
        <div className="footer-institucional" style={{ margin: '30px 0', borderTop: '1px solid #4D331B', paddingTop: '20px' }}>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#c2b5aa' }}>
            Com uma comunicação moderna e presença nos principais meios digitais, a Pátio RP Leilões proporciona aos seus usuários experiências diferenciadas e acessíveis, com foco na satisfação dos clientes como um dos seus objetivos centrais.
          </p>
        </div>

        {/* Contact info, Address, and Logos */}
        <div className="footer-flex">
          <div className="footer-contact">
            <div className="footer-contact-flex">
              <div className="contact-info">
                <p>
                  <span>
                    Central de Relacionamento<br />
                    <a href="tel:+551626260297" className="footer-contact-link" aria-label="Ligar para a Central de Relacionamento">
                      (16) 2626-0297
                    </a><br />
                    <a href="tel:+551626260397" className="footer-contact-link" aria-label="Ligar para a Central de Relacionamento">
                      (16) 2626-0397
                    </a><br /><br />
                    WhatsApp<br />
                    <a
                      href="https://wa.me/5516996219389?text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-contact-link footer-contact-link--whats"
                      aria-label="Falar pelo WhatsApp"
                    >
                      <i className="fa-brands fa-whatsapp" style={{ marginRight: '5px' }}></i>
                      (16) 99621-9389
                    </a>
                  </span>
                  <br /><br />
                  <span>
                    E-mail<br />
                    <a href="mailto:atendimento@patiorpleiloes.com" className="footer-contact-link">
                      atendimento@patiorpleiloes.com
                    </a><br />
                    <a href="mailto:financeiro@patiorpleiloes.com" className="footer-contact-link">
                      financeiro@patiorpleiloes.com
                    </a>
                    <br /><br />
                    Endereço:<br />
                    R. Gen. Câmara, 2930 - Vila Recreio, Ribeirão Preto - SP, 14060-582
                  </span>
                </p>
              </div>
            </div>

            <div className="footer-bottom" style={{ marginTop: '20px' }}>
              <p>&copy; 2026 Pátio Rp Leilões S/A. Todos os direitos reservados.</p>
            </div>
          </div>

          <div className="footer-logos" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
            <img src="/web/logos/logoleilobranca.webp" alt="Logo Pátio RP Leilões" className="logo" style={{ maxWidth: '180px' }} />
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <img src="/web/logos/logo-leilaoseguro.png" alt="Leilão Seguro" style={{ height: '42px' }} />
              <img src="/web/logos/logo-aleibras.png" alt="Aleibras" style={{ height: '42px' }} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
