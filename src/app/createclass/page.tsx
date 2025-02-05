"use client";
import React, { useState, useEffect } from "react";
import "./createclass.css";
import Router from "next/router";

const CreateClassroomPage = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

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
      <h1 className="title">Fábrica de Turmas</h1>
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
          Curso <span className="required">*</span>
        </label>

        {/* Lista rolável para Curso */}
        <div className="dropdown-list">
          <ul>
            <li
              onClick={() => setSelectedCourse("Curso 1")}
              className={selectedCourse === "Curso 1" ? "selected" : ""}
            >
              Curso 1
            </li>
            <li
              onClick={() => setSelectedCourse("Curso 2")}
              className={selectedCourse === "Curso 2" ? "selected" : ""}
            >
              Curso 2
            </li>
            <li
              onClick={() => setSelectedCourse("Curso 3")}
              className={selectedCourse === "Curso 3" ? "selected" : ""}
            >
              Curso 3
            </li>
            <li
              onClick={() => setSelectedCourse("Curso 4")}
              className={selectedCourse === "Curso 4" ? "selected" : ""}
            >
              Curso 4
            </li>
            <li
              onClick={() => setSelectedCourse("Curso 5")}
              className={selectedCourse === "Curso 5" ? "selected" : ""}
            >
              Curso 5
            </li>
          </ul>
        </div>

        <label htmlFor="class" className="label">
          Turma
        </label>
        <input type="text" id="class" className="input" placeholder="Nome da turma" />

        <label htmlFor="class-description" className="label">
          Descrição
        </label>
        <input type="text" id="class-description" className="input" placeholder="Descrição da turma" />

        <label htmlFor="add-students" className="label">
          Adicionar alunos
        </label>
        <div className="import-group">
          <input type="text" id="add-students" className="input" placeholder="Adicionar alunos" />
          <button type="button" className="add-button">
            +
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" onClick={() => Router.push("/profile")}>Avançar</button>
          <button type="button" className="cancel-button" onClick={() => Router.push("/profile")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassroomPage;
