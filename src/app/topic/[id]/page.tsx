"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./topic.css"; 

const Topico: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const topicId = params.id;
  const title = params.title || "Título Tópico";

  // Estado do cadeado na bolinha de resultado
  const [isLocked, setIsLocked] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Função para alternar o cadeado
  const toggleLock = (event: React.MouseEvent) => {
    event.stopPropagation(); // Impede que o clique no cadeado acione a navegação
    setIsLocked(!isLocked);
  };

  // Função para tentar acessar o resultado
  const handleResultClick = () => {
    if (isLocked) {
      setShowPopup(true); // Mostra o pop-up se estiver bloqueado
    } else {
      router.push(`/topic/${topicId}/won`); // Navega se estiver desbloqueado
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

      {/* Imagens dos planetas */}
      <img src="/assets/image81.png" alt="Planeta Superior" className="planet-top" />
      <img src="/assets/image9.png" alt="Planeta Inferior" className="planet-bottom" />

      <div className="dots"></div>

      {/* Título do Tópico */}
      <div className="title">
        <h1>{title}</h1>
      </div>

      {/* Botões redondos maiores com ícones */}
      <div className="topics-container">
        <div className="node" onClick={() => router.push(`/topic/${topicId}/topiccontent`)}> 
          <div className="node-circle" style={{ backgroundColor: "#D9D9D9" }}>
            <img src="https://cdn-icons-png.flaticon.com/512/619/619175.png" alt="Ícone Aula" className="node-icon" />
          </div>
          <p className="node-title">AULA</p>
        </div>

        <div className="node" onClick={() => router.push(`/topic/${topicId}/question`)}> 
          <div className="node-circle" style={{ backgroundColor: "#FFD700" }}>
            <img src="https://cdn-icons-png.flaticon.com/512/10301/10301575.png" alt="Ícone Exercícios" className="node-icon" />
          </div>
          <p className="node-title">EXERCÍCIOS</p>
        </div>

        <div className="node" onClick={handleResultClick}> 
          <div className="node-circle" style={{ backgroundColor: "#FF4C4C" }}>
            <img src="https://cdn-icons-png.flaticon.com/512/2617/2617955.png" alt="Ícone Resultado" className="node-icon" />
            {isLocked ? (
              <LockIcon className="lock-icon" onClick={toggleLock} />
            ) : (
              <LockOpenIcon className="lock-icon" onClick={toggleLock} />
            )}
          </div>
          <p className="node-title">RESULTADO</p>
        </div>
      </div>

      {/* Pop-up de módulo bloqueado */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-content">
              <p>Este módulo ainda não foi liberado!</p>
              <button className="close-button" onClick={() => setShowPopup(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topico;