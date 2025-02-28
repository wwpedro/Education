"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Ícone de voltar
import Link from "next/link";
import "./topicsmenu.css";

// Interface para representar um tópico
interface Topic {
  id: number;
  title: string;
  icon: string; // Caminho da imagem do ícone do tópico
  isLocked: boolean; // Indica se o módulo está bloqueado
}

// Lista inicial de tópicos
const initialTopics: Topic[] = [
  { id: 1, title: "Fundamentos I", icon: "https://cdn-icons-png.flaticon.com/512/276/276020.png", isLocked: false },
  { id: 2, title: "Fundamentos II", icon: "https://cdn-icons-png.flaticon.com/512/276/276020.png", isLocked: true },
  { id: 3, title: "Avançado", icon: "https://cdn-icons-png.flaticon.com/512/276/276020.png", isLocked: false },
  { id: 4, title: "Introdução à Matemática", icon: "https://cdn-icons-png.flaticon.com/512/276/276020.png", isLocked: true },
  { id: 5, title: "Física Básica", icon: "https://cdn-icons-png.flaticon.com/512/276/276020.png", isLocked: false },
  { id: 6, title: "Fundamentos II - Avançado", icon: "https://cdn-icons-png.flaticon.com/512/276/276020.png", isLocked: false },
  { id: 7, title: "Avançado Plus", icon: "https://cdn-icons-png.flaticon.com/512/276/276020.png", isLocked: true },
  { id: 8, title: "Matemática Aplicada", icon: "https://cdn-icons-png.flaticon.com/512/276/276020.png", isLocked: false },
  { id: 9, title: "Física Experimental", icon: "https://cdn-icons-png.flaticon.com/512/276/276020.png", isLocked: true },
];

const TopicsMenu: React.FC = () => {
  const router = useRouter();
  const [topics, setTopics] = useState(initialTopics);
  const [showPopup, setShowPopup] = useState(false);

  // Função para lidar com cliques nos tópicos
  const handleTopicClick = (topic: Topic) => {
    if (topic.isLocked) {
      setShowPopup(true);
      return;
    }
    router.push(`/topic/${topic.id}`);
  };

  // Função para alternar o bloqueio do tópico
  const toggleLock = (id: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Impede que o clique no cadeado acione a navegação
    setTopics((prevTopics) =>
      prevTopics.map((topic) =>
        topic.id === id ? { ...topic, isLocked: !topic.isLocked } : topic
      )
    );
  };

  // Função para definir cores dinâmicas
  const getColorByIndex = (index: number) => {
    const colors = ["yellow", "red", "blue", "pink", "green"];
    return colors[index % colors.length];
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
    <div className="space-background scrollable">
      {/* Botão de Voltar */}
      <div className="back-button">
        <Link href="/classlist">
          <ArrowBackIcon className="back-icon" />
        </Link>
      </div>

      <img src="/assets/image81.png" alt="Planeta" className="planet" />
      <img src="/assets/image812.png" alt="Cometa" className="comet" />
      <img src="/assets/img2.png" alt="Foguete" className="rocket diagonal" />
      <img src="/assets/image9.png" alt="Terra" className="earth" />

      <div className="dots"></div>

      <div className="title">
        <h1>Topicos</h1>
        <Link href="/createclass">
          <button className="yellow-button">Editar classe</button>
        </Link>
      </div>

      <div className="topics-container">
        {topics.map((topic, index) => {
          const color = getColorByIndex(index);
          const randomOffset = (Math.random() - 0.5) * 40; // Deslocamento aleatório

          return (
            <div
              key={topic.id}
              className="node"
              onClick={() => handleTopicClick(topic)}
              style={{ cursor: "pointer", transform: `translateX(${randomOffset}px)` }}
            >
              <div className="node-circle" style={{ backgroundColor: color }}>
                <img src={topic.icon} alt="Ícone do tópico" className="topic-icon" />
                {topic.isLocked ? (
                  <LockIcon
                    className="lock-icon"
                    onClick={(event) => toggleLock(topic.id, event)}
                  />
                ) : (
                  <LockOpenIcon
                    className="lock-icon"
                    onClick={(event) => toggleLock(topic.id, event)}
                  />
                )}
              </div>
              <p className="node-title">{topic.title}</p>
            </div>
          );
        })}
      </div>

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

export default TopicsMenu;