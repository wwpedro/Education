"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Hook de navegação
import "./popup.css";

const SuccessTopic: React.FC = () => {
  const goTo = (url: string) => {
    window.location.href = url;
  };

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

  const handleButtonClick = () => {
    goTo("/"); // Redireciona para a página inicial
  };

  return (
    <div className="approval-page-container">
      <div className="dots"></div>
      <h1 className="approval-page-title">
        Parabéns! Você completou a atividade com sucesso! 🎉
      </h1>
      <div className="image-container">
        <img src="/assets/success_planet.png" alt="Planeta" className="img-planet" />
        <img src="/assets/success_astro.png" alt="Astronauta" className="img-astro" />
      </div>
      <button
        className="approval-page-button"
        onClick={handleButtonClick} // Redireciona para a página inicial
      >
        Voltar ao Início
      </button>
    </div>
  );
};

export default SuccessTopic;
