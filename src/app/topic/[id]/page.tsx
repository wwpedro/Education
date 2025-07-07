"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import "./topic.css";

const Topico: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const topicId = params.id as string;
  const title = params.title || "Título Tópico";

  const [isLocked, setIsLocked] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`topic_${topicId}_percent`);
    if (stored !== null) {
      setIsLocked(false);
    }
  }, [topicId]);

  const goTo = (url: string) => {
    router.push(url);
  };

  const toggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLocked(prev => !prev);
  };

  const handleResultClick = () => {
    if (isLocked) {
      setShowPopup(true);
    } else {
      const stored = sessionStorage.getItem(`topic_${topicId}_percent`);
      const percent = stored ? parseInt(stored) : 0;
      const route = percent >= 70 ? 'won' : 'lose';
      goTo(`/topic/${topicId}/${route}`);
    }
  };

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

  const handleExitModule = () => {
    router.push('/classlist');
  };

  return (
    <div className="space-background">
      <div className="back-button" onClick={handleExitModule}>
        <Link href="/classlist"><ArrowBackIcon className="back-icon"/></Link>
      </div>

      <img src="/assets/image81.png" alt="Planeta Superior" className="planet-top" />
      <img src="/assets/image9.png" alt="Planeta Inferior" className="planet-bottom" />

      <div className="dots"></div>

      <div className="title"><h1>{title}</h1></div>

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
            {isLocked ? <LockIcon className="lock-icon" onClick={toggleLock}/> : <LockOpenIcon className="lock-icon" onClick={toggleLock}/>}            
          </div>
          <p className="node-title">RESULTADO</p>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup"><div className="popup-content">
            <p>Este módulo ainda não foi liberado!</p>
            <button className="close-button" onClick={() => setShowPopup(false)}>Fechar</button>
          </div></div>
        </div>
      )}
    </div>
  );
};

export default Topico;
