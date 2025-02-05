"use client";
import React, { useEffect, useState } from "react";
import "./createcurriculum.css";
import Router from "next/router";

const CreateCurriculumPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const starsContainer = document.querySelector(".stars");
    if (!starsContainer) return;

    const totalStars = 100;
    for (let i = 0; i < totalStars; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;

      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      star.style.animationDelay = `${Math.random() * 2}s`;

      starsContainer.appendChild(star);
    }
  }, []);

  return (
    <div className="createclass-container">
      <div className="stars"></div>

      <img src="/assets/image9.png" alt="Planeta Terra" className="planet-earth" />
      <img src="/assets/image8.png" alt="Planeta" className="planet-upper-right" />

      <h1 className="title">Fábrica de Curriculum</h1>

      <form className="createclass-form">       

        <div className="info-icon" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>i</div><br></br>

        <label htmlFor="curriculum" className="label">Curriculum</label>
        <input type="text" id="curriculum" className="input" placeholder="Nome do curriculum" />

        <label htmlFor="curriculum-description" className="label">Descrição</label>
        <input type="text" id="curriculum-description" className="input" placeholder="Descrição do curriculum" />

        <label htmlFor="import" className="label">Import</label>
        <div className="import-group">
          <input type="text" id="import" className="input" placeholder="Importar dados" />
          <button type="button" className="add-button">+</button>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button">Cancelar</button>
          <button type="button" className="cancel-button" onClick={() => Router.back()}>Voltar</button>
          <button type="submit" className="submit-button" onClick={() => Router.push("/createcourse")}>Avançar</button>
        </div>
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              É obrigatório ter um curriculum para a criação de cursos. Já para a criação de turma/classe é preciso já ter um curriculum e um curso cadastrados. Você pode avançar e voltar quando quiser.
            </p>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCurriculumPage;