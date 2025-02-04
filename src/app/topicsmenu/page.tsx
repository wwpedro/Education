"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Para navegação
import "./topicsmenu.css"; // Arquivo CSS para os estilos

// Interface para representar um tópico
interface Topic {
  id: number;
  title: string;
}

// Lista de tópicos (simulação de dados)
const topics: Topic[] = [
  { id: 1, title: "Fundamentos I" },
  { id: 2, title: "Fundamentos II" },
  { id: 3, title: "Avançado" },
  { id: 4, title: "Introdução à Matemática" },
  { id: 5, title: "Física Básica" },
  { id: 6, title: "Fundamentos II - Avançado" },
  { id: 7, title: "Avançado Plus" },
  { id: 8, title: "Matemática Aplicada" },
  { id: 9, title: "Física Experimental" },
];

const TopicsMenu: React.FC = () => {
  const router = useRouter();

  // Função para lidar com cliques nos tópicos
  const handleTopicClick = (id: number) => {
    router.push(`/topics/${id}`); // Redireciona para a página do tópico
  };

  // Função para definir cores dinâmicas
  const getColorByIndex = (index: number) => {
    const colors = ["yellow", "red", "blue", "pink", "green"];
    return colors[index % colors.length];
  };
  

  useEffect(() => {
    const dotsContainer = document.querySelector(".dots");
    if (!dotsContainer) return;
  
    const totalDots = 150; // Quantidade de pontinhos na tela
  
    // Limpa os pontos antigos, caso o efeito seja recarregado
    dotsContainer.innerHTML = "";
  
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
  
      // Posições aleatórias dentro da tela visível
      dot.style.top = `${Math.random() * 100}vh`; // Altura relativa à janela de visualização
      dot.style.left = `${Math.random() * 100}vw`; // Largura relativa à janela de visualização
  
      // Tamanhos aleatórios
      const size = Math.random() * 3 + 2; // Entre 2px e 5px
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
  
      // Atraso de animação aleatório
      dot.style.animationDelay = `${Math.random() * 5}s`;
  
      // Adiciona o ponto ao contêiner
      dotsContainer.appendChild(dot);
    }
  }, []);
   

  return (
    <div className="space-background scrollable">
      {/* Adicionar imagens ao fundo */}
      <img src="/assets/image81.png" alt="Planeta" className="planet" />
      <img src="/assets/image812.png" alt="Cometa" className="comet" />
      <img src="/assets/img2.png" alt="Foguete" className="rocket diagonal" />
      <img src="/assets/image9.png" alt="Terra" className="earth" />

      {/* Contêiner para os pontinhos */}
      <div className="dots"></div>

      {/* Título da Matéria */}
      <div className="title"> 
        <h1>Topicos</h1>
        <button className="yellow-button">Editar classe</button>
      </div>

      {/* Container dinâmico de tópicos */}
      <div className="topics-container">
        {topics.map((topic, index) => {
          const color = getColorByIndex(index);
          return (
            <div
              key={topic.id}
              className="node"
              onClick={() => handleTopicClick(topic.id)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="node-circle"
                style={{ backgroundColor: color }}
              ></div>
              <p className="node-title">{topic.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopicsMenu;
