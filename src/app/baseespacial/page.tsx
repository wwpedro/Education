"use client";
import React, { useEffect, useState } from "react";
import "./baseespacial.css";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from '@mui/icons-material/Close';


const BaseEspacialPage = () => {
  interface Medalha {
    id: number;
    nome: string;
    descricao: string;
    imagem: string;
    pontuacao: number;
    conquistada: boolean;
    categoria: string;
    dataConquista: string;
  }
  
  const medalhas: Medalha[] = [
    {
      id: 1,
      nome: "Viajante de Ouro",
      descricao: "Conquistada ao completar todos os questionários do curso!",
      imagem: "/medalhas/ouro.png",
      pontuacao: 5000,
      conquistada: true,
      categoria: "questionario",
      dataConquista: "2025-10-10",
    },
    {
      id: 2,
      nome: "Viajante de Prata",
      descricao: "Conquistada ao finalizar metade (50%) dos questionários do curso!",
      imagem: "/medalhas/prata.png",
      pontuacao: 3000,
      conquistada: true,
      categoria: "questionario",
      dataConquista: "",
    },
    {
      id: 3,
      nome: "Viajante de Bronze",
      descricao: "Conquistada ao finalizar o seu primeiro questionário do curso!",
      imagem: "/medalhas/bronze.png",
      pontuacao: 1500,
      conquistada: true,
      categoria: "questionario",
      dataConquista: "",
    },
    {
      id: 4,
      nome: "Nave do Viajante",
      descricao: "Conquistada ao terminar o primeiro conteúdo do curso!",
      imagem: "/medalhas/nave-espacial.png",
      pontuacao: 1500,
      conquistada: true,
      categoria: "tempo de curso",
      dataConquista: "",
    },
    {
      id: 5,
      nome: "Nave de Ouro",
      descricao: "Conquistada ao finalizar metade (50%) do curso!",
      imagem: "/medalhas/nave-ouro.png",
      pontuacao: 3000,
      conquistada: false,
      categoria: "tempo de curso",
      dataConquista: "",
    },
    {
      id: 6,
      nome: "Viajante Universal",
      descricao: "Conquistada quando finalizar todo o curso!",
      imagem: "/medalhas/viajante-universal.png",
      pontuacao: 5000,
      conquistada: false,
      categoria: "tempo de curso",
      dataConquista: "",
    },
    {
      id: 7,
      nome: "Nova Espécie Alienígena",
      descricao: "Você conquistou todas as medalhas e se tornou uma nova espécie Alienígena!",
      imagem: "/medalhas/et.png",
      pontuacao: 5000,
      conquistada: false,
      categoria: "todas as medalhas",
      dataConquista: "",
    },
  ];
  
  const ModalMedalha: React.FC<{
    medalha: Medalha;
    onClose: () => void;
    onAdicionar?: () => void;
  }> = ({ medalha, onClose, onAdicionar }) => {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <img src={medalha.imagem} alt={medalha.nome} />
          <h2>{medalha.nome}</h2>
          <p>{medalha.descricao}</p>
          <p><strong>Pontuação:</strong> CB$ {medalha.pontuacao}</p>
          {medalha.conquistada && medalha.dataConquista.trim() !== "" && (
            <p><strong>Conquistada em:</strong> {medalha.dataConquista}</p>
          )}
          <div className="modal-buttons">
            {medalha.conquistada && (
              <button className="modal-add" onClick={onAdicionar}>Adicionar</button>
            )}
            <button className="modal-close" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    );
  };
  
  const [modalAberto, setModalAberto] = useState(false);
  const [medalhaSelecionada, setMedalhaSelecionada] = useState<Medalha | null>(null);
  const [medalhasPrincipais, setMedalhasPrincipais] = useState<Medalha[]>([]);
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);


  // efeito das estrelas
 useEffect(() => {
     // Adiciona os pontinhos animados
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
       const size = Math.random() * 2 + 1; // Entre 1px e 3px
       dot.style.width = `${size}px`;
       dot.style.height = `${size}px`;
 
       // Atraso de animação aleatório
       dot.style.animationDelay = `${Math.random() * 5}s`;
 
       // Adiciona o ponto ao contêiner
       dotsContainer.appendChild(dot);
     }
   }, []);

   const medalhasConquistadas = medalhas.filter((m) => m.conquistada);
   const medalhasBloqueadas = medalhas.filter((m) => !m.conquistada);

  return (
    <div className="baseespacial-container">
      <div className="dots"></div>

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

            {/* Card nave */}
            <div className="card nave-card">
              <div className="card pontuacao-card">
                <h2>Pontuação Total</h2>
                <p>CB$ {pontuacaoTotal}</p>
              </div>
              <div className="nave-content">
                <div className="nave">
                  <img src="/naves/verdinha.png" alt="Nave" />
                </div>
                <ChevronRightIcon className="seta" />
              </div>
              <button className="usar-button">Usar</button>
            </div>

            {/* Medalhas principais */}
            <div className="card medalhas-card">
              <h2>Medalhas Principais</h2>
              <div className="medalhas-list">
               {medalhasPrincipais.length === 0 && (
                <p className="placeholder">Nenhuma medalha adicionada ainda.</p>
              )}
              {medalhasPrincipais.map((medalha) => (
                <div key={medalha.id} className="medal-principal">
                  <img src={medalha.imagem} alt={medalha.nome} />
                  <button
                    className="remover-button"
                    onClick={() =>
                      setMedalhasPrincipais((prev) =>
                        prev.filter((m) => m.id !== medalha.id)
                      )                      
                    }
                  >                
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Linha de baixo 
          {/*<div className="card progresso-card">
            <h2>Progresso</h2>
            <div className="progresso-content">
              <div className="filtros">
                <h3>Filtros</h3>
                <p>Conquistadas</p>
              </div>
              <div className="grafico">
                {/* Espaço reservado para gráfico 
              </div>
            </div>
          </div>*/}
        </div>

        {/* Coluna direita */}
        <div className="card medalhas-todas-card">
          <h2>Todas as medalhas</h2>

          <div className="medalhas-section">
            <h3>Conquistadas</h3>
            <div className="medalhas-grid">
              {medalhasConquistadas.map((medalha) => (
                <div
                  key={medalha.id}
                  className="medal-item"
                  onClick={() => {
                    setMedalhaSelecionada(medalha);
                    setModalAberto(true);
                  }}
                >
                  <div className="medal">
                    <img src={medalha.imagem} alt={medalha.nome} />
                  </div>
                  <span>{medalha.nome}</span>
                </div>
              ))}
            </div>
          </div>             

          <div className="medalhas-section">
            <h3>À Conquistar</h3>
            <div className="medalhas-grid">
              {medalhasBloqueadas.map((medalha) => (
                <div
                  key={medalha.id}
                  className="medal-item"
                  onClick={() => {
                    setMedalhaSelecionada(medalha);
                    setModalAberto(true);
                  }}
                >
                  <div className="medal">
                    <img src={medalha.imagem} alt={medalha.nome} />
                  </div>
                  <span>{medalha.nome}</span>
                </div>
              ))}
            </div>
          </div>

          {modalAberto && medalhaSelecionada && (
            <ModalMedalha
              medalha={medalhaSelecionada}
              onClose={() => setModalAberto(false)}
              onAdicionar={() => {                             
                if (
                  medalhaSelecionada &&
                  medalhaSelecionada.conquistada &&
                  !medalhasPrincipais.some((m) => m.id === medalhaSelecionada.id)
                ) {
                  if (medalhasPrincipais.length < 3) {
                    setMedalhasPrincipais([...medalhasPrincipais, medalhaSelecionada]);
                    setPontuacaoTotal((prev) => prev + medalhaSelecionada.pontuacao);
                  } else {
                    alert("Você só pode ter 3 medalhas principais.");
                  }
                }
                setModalAberto(false);
              }}
            />
          )}      
        </div>
      </div>
    </div>
  );
};

export default BaseEspacialPage;
