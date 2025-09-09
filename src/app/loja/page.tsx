"use client";
import React, { useEffect, useState } from "react";
import "./loja.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

interface Nave {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  descricao: string;
}

const LojaPage = () => {
  const [naves] = useState<Nave[]>([
    {
      id: 1,
      nome: "Rosinha",
      preco: 1300,
      imagem: "/assets/rosinha.png",
      descricao: "A nave rosa mais charmosa do espaço",
    },
    {
      id: 2,
      nome: "Amarelinho",
      preco: 1300,
      imagem: "/assets/amarelinho.png",
      descricao: "A nave amarela iluminada",
    },
    {
      id: 3,
      nome: "Vermelhinho",
      preco: 1300,
      imagem: "/assets/vermelhinho.png",
      descricao: "A nave vermelha mais veloz",
    },
    {
      id: 4,
      nome: "Verderinha",
      preco: 1300,
      imagem: "/assets/verderinha.png",
      descricao: "Sua nave é a Verderinha, a mais rápida do espaço",
    },
  ]);

  const [naveSelecionada, setNaveSelecionada] = useState<Nave | null>(naves[3]);
  const [pontos] = useState(130);

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
  }, []);

  return (
    <div className="loja-background-container">
      <div className="stars"></div>

      {/* Botão de voltar */}
      <div className="back-button">
        <Link href="/profile">
          <ArrowBackIcon className="back-icon" />
        </Link>
      </div>

      {/* Título */}
      <h1 className="title">Loja Espacial</h1>

      <div className="loja-container">
        {/* Card Esquerdo */}
        <div className="card-esquerdo">
          <h3>Pontos</h3>
          <h1 className="pontos">{pontos}</h1>
          {naveSelecionada && (
            <>
              <img
                src={naveSelecionada.imagem}
                alt={naveSelecionada.nome}
                className="nave-imagem"
              />
              <p className="descricao">
                Sua nave é a <strong>{naveSelecionada.nome}</strong> <br />
                {naveSelecionada.descricao}
              </p>
            </>
          )}
        </div>

        {/* Card Direito */}
        <div className="card-direito">
          <div className="lista-naves">
            {naves.map((nave) => (
              <div
                key={nave.id}
                className="nave-item"
                onClick={() => setNaveSelecionada(nave)}
              >
                <img src={nave.imagem} alt={nave.nome} className="nave-mini" />
                <div className="nave-info">
                  <h4>{nave.nome}</h4>
                  <p>CB$ {nave.preco}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="comprar-btn">Comprar</button>
        </div>
      </div>
    </div>
  );
};

export default LojaPage;
