"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import "./topic.css"; // Reutilizando o CSS para manter o estilo

const Topico: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const topicId = params.id;
  const title = params.title || "Título Tópico";

  return (
    <div className="space-background">
      {/* Botão de Voltar */}
      <button className="back-button" onClick={() => router.back()}>
        &#8592;
      </button>

      {/* Imagens dos planetas */}
      <img src="/assets/planet-top.png" alt="Planeta Superior" className="planet-top" />
      <img src="/assets/planet-bottom.png" alt="Planeta Inferior" className="planet-bottom" />

      {/* Título do Tópico */}
      <div className="title">
        <h1>{title}</h1>
        <button className="yellow-button">editar Tópico</button>
      </div>

      {/* Botões redondos */}
      <div className="topics-container">
        <div className="node" onClick={() => router.push(`/topic/${topicId}/conteudo`)}> 
          <div className="node-circle" style={{ backgroundColor: "#D9D9D9" }}></div>
          <p className="node-title">AULA</p>
        </div>

        <div className="node" onClick={() => router.push(`/topic/${topicId}/question`)}> 
          <div className="node-circle" style={{ backgroundColor: "#FFD700" }}></div>
          <p className="node-title">EXERCÍCIOS</p>
        </div>

        <div className="node" onClick={() => router.push(`/topic/${topicId}/won`)}> 
          <div className="node-circle" style={{ backgroundColor: "#FF4C4C" }}></div>
          <p className="node-title">RESULTADO</p>
        </div>
      </div>
    </div>
  );
};

export default Topico;