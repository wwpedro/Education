"use client";
import React, { useEffect } from "react";
import "./createclass.css";

const CreateClassPage = () => {
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

  return (
    <div className="createclass-container">
      {/* Estrelas no fundo */}
      <div className="stars"></div>

      {/* Imagem do planeta Terra no fundo */}
      <img src="/assets/image9.png" alt="Planeta Terra" className="planet-earth" />

      {/* Imagem do planeta no canto superior direito */}
      <img src="/assets/image8.png" alt="Planeta" className="planet-upper-right" />

      {/* Conteúdo principal */}
      <h1 className="title">Fabrica de Aulas</h1>
      <form className="createclass-form">
        <label htmlFor="course" className="label">
          Curso
        </label>
        <input type="text" id="course" className="input" placeholder="Nome do curso" />

        <label htmlFor="description" className="label">
          Descrição
        </label>
        <input type="text" id="description" className="input" placeholder="Descrição do curso" />

        <label htmlFor="import" className="label">
          Import
        </label>
        <div className="import-group">
          <input type="text" id="import" className="input" placeholder="Importar dados" />
          <button type="button" className="add-button">
            +
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Avançar</button>
          <button type="button" className="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassPage;
