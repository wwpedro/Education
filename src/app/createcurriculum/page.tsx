"use client";
import React, { useEffect } from "react";
import "./createcurriculum.css";
import Router from "next/router";

const CreateCurriculumPage = () => {
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
      <h1 className="title">Fábrica de Curriculum</h1>
      <form className="createclass-form">
        <label htmlFor="curriculum" className="label">
          Curriculum
        </label>
        <input type="text" id="curriculum" className="input" placeholder="Nome do curriculum" />

        <label htmlFor="curriculum-description" className="label">
          Descrição
        </label>
        <input type="text" id="curriculum-description" className="input" placeholder="Descrição do curriculum" />

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
          <button type="submit" className="submit-button" onClick={() => Router.push("/createcourse")}>Avançar</button>
          <button type="button" className="cancel-button" onClick={() => Router.push("/profile")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CreateCurriculumPage;