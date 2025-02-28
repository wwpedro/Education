"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./topiccontent.css";

const contents = [
    { 
      id: 1, 
      title: "Introdução ao Tópico", 
      type: "video", 
      src: "https://www.youtube.com/embed/Xn599R0ZBwg", // Lady Gaga - Bad Romance
      icon: "https://cdn-icons-png.flaticon.com/512/777/777242.png" // Ícone de vídeo
    },
    { 
      id: 2, 
      title: "Material Complementar", 
      type: "pdf", 
      src: "https://educapes.capes.gov.br/bitstream/capes/206523/2/Matemática%20Básica%20I-Livro.pdf", // PDF válido
      icon: "https://cdn-icons-png.flaticon.com/512/337/337946.png" // Ícone de PDF
    }
];  

const TopicContent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentContent = contents[currentIndex];

  const handleNext = () => {
    if (currentIndex < contents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const dotsContainer = document.querySelector(".dots");
    if (!dotsContainer) return;

    const totalDots = 150;
    dotsContainer.innerHTML = "";

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");

      dot.style.top = `${Math.random() * 100}vh`;
      dot.style.left = `${Math.random() * 100}vw`;

      const size = Math.random() * 3 + 2;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;

      dot.style.animationDelay = `${Math.random() * 5}s`;

      dotsContainer.appendChild(dot);
    }
  }, []);

  return (
    <div className="space-background">
      {/* Botão de Voltar */}
      <div className="back-button" onClick={() => router.back()}>
        <ArrowBackIcon className="back-icon" />
      </div>

      {/* Dots de fundo */}
      <div className="dots"></div>

      {/* Círculo azul com ícone dinâmico */}
      <div className="circle-container">
        <div className="circle">
          <img src={currentContent.icon} alt="Ícone do conteúdo" className="circle-icon" />
        </div>
      </div>

      {/* Card principal */}
      <div className="content-card">
        {/* Indicador de progresso no canto superior direito */}
        <div className="progress-indicator">
          {currentIndex + 1}/{contents.length}
        </div>

        {/* Título dinâmico */}
        <h2 className="content-title">{currentContent.title}</h2>

        {/* Área de exibição (PDF ou Vídeo) */}
        <div className="content-viewer">
          {currentContent.type === "video" ? (
            <iframe 
              src={currentContent.src} 
              frameBorder="0" 
              allowFullScreen 
              className="video-frame"
            ></iframe>
          ) : (
            <iframe 
              src={currentContent.src} 
              className="pdf-frame"
            ></iframe>
          )}
        </div>

        {/* Botões de navegação */}
        <div className="navigation-buttons">
          <button className="nav-button" onClick={handlePrevious} disabled={currentIndex === 0}>
            <NavigateBeforeIcon />
          </button>
          <button className="nav-button" onClick={handleNext} disabled={currentIndex === contents.length - 1}>
            <NavigateNextIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicContent;
