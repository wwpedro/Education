"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import "./topic.css";

const Topico: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const topicId = params.id as string;
  const title = params.title || "Título Tópico";
  const classId = searchParams.get('classId') || '1'; // Adicionado para pegar o classId da URL ou usar '1' como padrão

  const [isLocked, setIsLocked] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [percentage, setPercentage] = useState<number | null>(null);

  // Verifica o progresso ao carregar a página
  useEffect(() => {
    const checkProgress = async () => {
      const token = localStorage.getItem("accessToken");
      const studentId = localStorage.getItem("userId");
      
      if (!token || !studentId) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(
          `${apiUrl}/solutions/student/${studentId}/topic/${topicId}/progress`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsLocked(!data.isTopicUnlocked);
          setPercentage(data.percentage);
          
          if (data.isTopicUnlocked) {
            sessionStorage.setItem(`topic_${topicId}_percent`, data.percentage);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar progresso:", error);
      }
    };

    checkProgress();
  }, [topicId, searchParams]);

  const goTo = (url: string) => {
    window.location.href = url;
  };

  const handleResultClick = () => {
    if (isLocked) {
      setShowPopup(true);
    } else {
      goTo(`/topic/${topicId}/result`);
    }
  };

  // Função modificada para voltar para a página de menu de tópicos com o classId
  const handleExitModule = () => {
    goTo(`/topicsmenu?classId=${classId}`);
  };

  // Efeito para as estrelas de fundo
  useEffect(() => {
    const dots = document.querySelector('.dots');
    if (!dots) return;
    dots.innerHTML = '';
    for (let i = 0; i < 150; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.style.top = `${Math.random() * 100}vh`;
      dot.style.left = `${Math.random() * 100}vw`;
      const size = Math.random() * 3 + 2;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.animationDelay = `${Math.random() * 5}s`;
      dots.appendChild(dot);
    }
  }, []);

  return (
    <div className="space-background">
      {/* Botão de voltar atualizado */}
      <div className="back-button" onClick={handleExitModule}>
        <ArrowBackIcon className="back-icon"/>
      </div>

      <img src="/assets/image81.png" alt="Planeta Superior" className="planet-top" />
      <img src="/assets/image9.png" alt="Planeta Inferior" className="planet-bottom" />

      <div className="dots"></div>

      <div className="title">
        <h1>{title}</h1>
        {percentage !== null && (
          <div className="progress-display">
            Seu progresso: {percentage}%
          </div>
        )}
      </div>

      <div className="topics-container">
        <div className="node" onClick={() => goTo(`/topic/${topicId}/topiccontent`)}>
          <div className="node-circle" style={{ backgroundColor: '#D9D9D9' }}>
            <img src="/assets/22.png" alt="Ícone Aula" className="node-icon" />
          </div>
          <p className="node-title">AULA</p>
        </div>

        <div className="node" onClick={() => goTo(`/topic/${topicId}/question`)}>
          <div className="node-circle" style={{ backgroundColor: '#FFD700' }}>
            <img src="/assets/24.png" alt="Ícone Exercícios" className="node-icon" />
          </div>
          <p className="node-title">EXERCÍCIOS</p>
        </div>

        <div className="node" onClick={handleResultClick}>
          <div className="node-circle" style={{ backgroundColor: '#FF4C4C' }}>
            <img src="/assets/23.png" alt="Ícone Resultado" className="node-icon" />
            {isLocked ? (
              <LockIcon className="lock-icon" />
            ) : (
              <LockOpenIcon className="lock-icon" />
            )}
          </div>
          <p className="node-title">RESULTADO</p>
          {!isLocked && percentage !== null && (
            <div className="result-percentage">{percentage}%</div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-content">
              <p>Este módulo ainda não foi liberado!</p>
              <p>Complete os exercícios com 70% de acerto para desbloquear.</p>
              <button
                className="close-button"
                onClick={() => setShowPopup(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topico;