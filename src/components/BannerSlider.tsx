import React, { useState, useEffect } from 'react';
import { BANNER_SLIDES } from '../data/lotsData';

interface BannerSliderProps {
  onScrollToAgenda?: () => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ onScrollToAgenda }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  return (
    <section className="banner" style={{ maxWidth: '2560px', margin: '0 auto', position: 'relative' }} id="site-banner">
      <div className="banner__wrapper">
        {BANNER_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`banner__slide ${isActive ? 'active' : ''}`}
              style={{
                display: isActive ? 'block' : 'none',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              <a
                href={slide.link}
                aria-label={`Abrir banner: ${slide.titulo}`}
                onClick={(e) => {
                  if (slide.link.startsWith('#')) {
                    e.preventDefault();
                    onScrollToAgenda?.();
                  }
                }}
              >
                <picture>
                  <source media="(max-width: 768px)" srcSet={slide.mobileImg} />
                  <img
                    src={slide.desktopImg}
                    alt={slide.titulo}
                    className="b-desk"
                    width="4624"
                    height="1300"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    onError={(e) => {
                      e.currentTarget.src = `/banners/banner_${idx * 2}.webp`;
                    }}
                  />
                </picture>
              </a>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={goToPrev}
        aria-label="Slide anterior"
        id="banner-prev"
        style={{
          position: 'absolute',
          top: '50%',
          left: '16px',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.4)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5
        }}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      <button
        type="button"
        onClick={goToNext}
        aria-label="Próximo slide"
        id="banner-next"
        style={{
          position: 'absolute',
          top: '50%',
          right: '16px',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.4)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5
        }}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>

      {/* Slide Indicators / Dots */}
      <div
        className="banner-dots"
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 5
        }}
      >
        {BANNER_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Ir para slide ${idx + 1}`}
            style={{
              width: idx === currentSlide ? '24px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: idx === currentSlide ? '#B8874C' : 'rgba(255,255,255,0.6)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </section>
  );
};
