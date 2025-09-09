"use client";
import React, { useEffect } from "react";
import "./baseespacial.css";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const BaseEspacialPage = () => {

  // efeito das estrelas
  useEffect(() => {
    const starsContainer = document.querySelector(".stars");
    if (!starsContainer) return;

    const totalStars = 100;
    for (let i = 0; i < totalStars; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      starsContainer.appendChild(star);
    }

    return () => {
      starsContainer.innerHTML = "";
    };
  }, []);

  return (
    <div className="baseespacial-container">
      <div className="stars."></div>

      {/* Botão voltar */}
      <div className="back-button">
        <Link href="/profile">
          <ArrowBackIcon className="back-icon" />
        </Link>
      </div>

      {/* Título */}
      <h1 className="title">Minha Base</h1>

      {/* Grid principal */}
      <div className="grid-container">
        {/* Coluna esquerda */}
        <div className="left-column">
          {/* Linha de cima */}
          <div className="top-row">
            {/* Medalhas principais */}
            <div className="card medalhas-card">
              <h2>Medalhas Principais</h2>
              <div className="medalhas-list">
                <div className="medal">
                  <img src="/images/medal1.png" alt="Medalha 1" />
                </div>
                <div className="medal">
                  <img src="/images/medal2.png" alt="Medalha 2" />
                </div>
                <div className="medal">
                  <img src="/images/medal3.png" alt="Medalha 3" />
                </div>
              </div>
            </div>

            {/* Card nave */}
            <div className="card nave-card">
              <span className="pontuacao">Pontos: 130</span>
              <div className="nave-content">
                <div className="nave">
                  <img src="/images/nave1.png" alt="Nave" />
                </div>
                <ChevronRightIcon className="seta" />
              </div>
              <button className="usar-button">Usar</button>
            </div>
          </div>

          {/* Linha de baixo */}
          <div className="card progresso-card">
            <h2>Progresso</h2>
            <div className="progresso-content">
              <div className="filtros">
                <h3>Filtros</h3>
                <p>Conquistadas</p>
              </div>
              <div className="grafico">
                {/* Espaço reservado para gráfico */}
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita */}
        <div className="card medalhas-todas-card">
          <h2>Todas as medalhas</h2>

          <div className="medalhas-section">
            <h3>Conquistadas</h3>
            <div className="medalhas-grid">
              <div className="medal-item">
                <div className="medal">
                  <img src="/images/medal1.png" alt="Medalha conquistada" />
                </div>
                <span>Título</span>
              </div>
              <div className="medal-item">
                <div className="medal">
                  <img src="/images/medal2.png" alt="Medalha conquistada" />
                </div>
                <span>Título</span>
              </div>
              <div className="medal-item">
                <div className="medal">
                  <img src="/images/medal3.png" alt="Medalha conquistada" />
                </div>
                <span>Título</span>
              </div>
            </div>
          </div>

          <div className="medalhas-section">
            <h3>À Conquistar</h3>
            <div className="medalhas-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="medal-item" key={i}>
                  <div className="medal">
                    <img src="/images/medal-placeholder.png" alt="Medalha bloqueada" />
                  </div>
                  <span>Título</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseEspacialPage;
