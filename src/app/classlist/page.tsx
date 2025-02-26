"use client";
import React, { useEffect } from "react";
import "./classlist.css";
import Router from "next/router";

const classesList = [
  { curriculumTitle: "Currículo 1", className: "Matemática Avançada", description: "Descrição sobre a classe", isActive: true },
  { curriculumTitle: "Currículo 2", className: "História da Arte", description: "Descrição sobre a classe", isActive: true },
  { curriculumTitle: "Currículo 3", className: "Física Experimental", description: "Descrição sobre a classe", isActive: true },
  { curriculumTitle: "Currículo 4", className: "Literatura Brasileira", description: "Descrição sobre a classe", isActive: true},
  { curriculumTitle: "Currículo 5", className: "Química Orgânica", description: "Descrição sobre a classe", isActive: true },
  { curriculumTitle: "Currículo 6", className: "Geografia Global", description: "Descrição sobre a classe", isActive: true },
  { curriculumTitle: "Currículo 7", className: "Engenharia de Software", description: "Descrição sobre a classe", isActive: true },
  { curriculumTitle: "Currículo 8", className: "Design Gráfico", description: "Descrição sobre a classe", isActive: true },
];

const ClassListPage = () => {
  useEffect(() => {
    const starsContainer = document.querySelector(".stars");
    if (!starsContainer) return;

    const totalStars = 100; // Quantidade de estrelas
    for (let i = 0; i < totalStars; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      // Posição aleatória
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;

      // Tamanho aleatório
      const size = Math.random() * 3 + 1; // Entre 1px e 4px
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      // Atraso de animação aleatório
      star.style.animationDelay = `${Math.random() * 2}s`;

      // Adiciona a estrela ao contêiner
      starsContainer.appendChild(star);
    }
  }, []);

  const handleBackClick = () => {
    window.history.back(); // Volta para a página anterior
    console.log("Botão de voltar clicado");
  };

  return (
    <div className="classlist-background-container">
      {/* Estrelas no fundo */}
      <div className="stars"></div>

      {/* Imagem da nave espacial no canto superior esquerdo */}
      <img src="/assets/img2.png" alt="Nave Espacial" className="rocket-image" />

      {/* Imagem do planeta no canto inferior direito */}
      <img src="/assets/image8.png" alt="Planeta" className="planet-image" />

      {/* Título */}
      <h1 className="title">Lista de Classes</h1>

      {/* Área rolável dos cartões */}
      <div className="class-cards-container">
        {classesList.map((classItem, index) => (
          <div key={index} className="class-card">
            <div className="curriculum-title">
              <h2>{classItem.curriculumTitle}</h2>
            </div>
            <div className="class-details">
              <h3>{classItem.className}</h3>
              <p>{classItem.description}</p>
              <p>Status: {classItem.isActive ? "Ativa" : "Inativa"}</p>
              <button className="see-more-button" onClick={() => Router.push("/topics")}>Ver mais</button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão de Voltar */}
      <button className="back-button" onClick={handleBackClick}>
        Voltar
      </button>
    </div>
  );
};

export default ClassListPage;
