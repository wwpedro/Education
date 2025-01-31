"use client";

import React from "react";
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

  return (
    <div className="space-background">
      {/* Adicionar imagens ao fundo */}
      <img src="/assets/img-palnet.png" alt="Planeta" className="planet" />
      <img src="/images/comet.png" alt="Cometa" className="comet" />
      <img src="/images/rocket.png" alt="Foguete" className="rocket" />
      <img src="/assets/image9.png" alt="Terra" className="earth" />

      {/* Título da Matéria */}
      <div className="title"> 
        <h1>Título Matéria</h1>
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
