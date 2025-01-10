"use client";
import React, { useEffect } from 'react';
import './popup.css';

const ApprovalPage: React.FC = () => {
  useEffect(() => {
    const dotsContainer = document.querySelector(".dots");
    if (!dotsContainer) return;

    const totalDots = 100; // Quantidade de pontinhos
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");

      // Posições aleatórias
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.left = `${Math.random() * 100}%`;

      // Tamanhos aleatórios
      const size = Math.random() * 1 + 2; // Entre 2px e 6px
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;

      // Atraso de animação aleatório
      dot.style.animationDelay = `${Math.random() * 5}s`;

      // Adiciona o ponto ao contêiner
      dotsContainer.appendChild(dot);
    }
  }, []);

  return (
    <div className="approval-page-container">
      <div className="dots"></div>
      <h1 className="approval-page-title">
        Aguarde a aprovação do professor. <br />
        (Vai chegar no seu E-mail!)
      </h1>

      {/* Contêiner para os pontinhos */}
      <div className="dots"></div>

      {/* Imagem do planeta */}
      <div className="image-container">
      <img src="/assets/img-planet.png" alt="Planeta" className="img-planet" />
      </div>

      {/* Imagem do astronauta */}
      <div className="image-container">
      <img src="/assets/img-astro.png" alt="Astronauta" className="img-astro" />
    </div>
      <button className="approval-page-button" onClick={() => alert('Botão clicado!')}>
        Voltar ao Menu
      </button>
    </div>
  );
};

export default ApprovalPage;
