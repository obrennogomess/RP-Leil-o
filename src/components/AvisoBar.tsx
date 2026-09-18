import React, { useState, useEffect } from 'react';

const FRASES = [
  'Cadastre-se e venha participar de Leilões !',
  'Em breve Grande Leilão da Receita Federal! Fique Atento!',
  'Entregamos veículos arrematados em todo o território nacional.',
  'Veículos com documentação regular e procedência garantida.'
];

export const AvisoBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FRASES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="aviso-bar" id="site-aviso-bar">
      <div className="aviso-slider" id="aviso-slider">
        <div className="aviso-item" key={currentIndex}>
          <span>{FRASES[currentIndex]}</span>
        </div>
      </div>
    </div>
  );
};
