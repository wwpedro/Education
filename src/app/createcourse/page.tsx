"use client";
import React, { useEffect, useState } from "react";
import "./createcourse.css";
import Link from "next/link";

const CreateClassPage = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState("");

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
      <h1 className="title">Fábrica de Cursos</h1>
      <form className="createclass-form">
        <label htmlFor="curriculum" className="label">
          Curriculum <span className="required">*</span>
        </label>

        {/* Lista rolável para Curriculum */}
        <div className="dropdown-list">
          <ul>
            <li
              onClick={() => setSelectedCurriculum("Curriculum 1")}
              className={selectedCurriculum === "Curriculum 1" ? "selected" : ""}
            >
              Curriculum 1
            </li>
            <li
              onClick={() => setSelectedCurriculum("Curriculum 2")}
              className={selectedCurriculum === "Curriculum 2" ? "selected" : ""}
            >
              Curriculum 2
            </li>
            <li
              onClick={() => setSelectedCurriculum("Curriculum 3")}
              className={selectedCurriculum === "Curriculum 3" ? "selected" : ""}
            >
              Curriculum 3
            </li>
            <li
              onClick={() => setSelectedCurriculum("Curriculum 4")}
              className={selectedCurriculum === "Curriculum 4" ? "selected" : ""}
            >
              Curriculum 4
            </li>
            <li
              onClick={() => setSelectedCurriculum("Curriculum 5")}
              className={selectedCurriculum === "Curriculum 5" ? "selected" : ""}
            >
              Curriculum 5
            </li>
          </ul>
        </div>

        <label htmlFor="course" className="label">
          Curso
        </label>
        <input type="text" id="course" className="input" placeholder="Nome do curso" />

        <label htmlFor="description" className="label">
          Descrição
        </label>
        <input type="text" id="description" className="input" placeholder="Descrição do curso" />

        <div className="form-actions">
        <Link href="/createclass" className="link">
          <button type="submit" className="submit-button">Avançar</button>
          </Link>
          <button type="button" className="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassPage;