"use client";
import React, { useEffect, useState } from "react";
import "./createcourse.css";
import Link from "next/link";
import Router from "next/router";

const CreateClassPage = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
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

      <h1 className="title">Fábrica de Cursos</h1>
      <form className="createclass-form">
        <div className="info-icon" onClick={() => setIsModalOpen(true)}>i</div><br></br>

        <label htmlFor="curriculum" className="label">
          Curriculum <span className="required">*</span>
        </label>

        <div className="dropdown-list">
          <ul>
            {["Curriculum 1", "Curriculum 2", "Curriculum 3", "Curriculum 4", "Curriculum 5"].map((item) => (
              <li
                key={item}
                onClick={() => setSelectedCurriculum(item)}
                className={selectedCurriculum === item ? "selected" : ""}
              >
                {item}
              </li>
            ))}
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
          <button type="button" className="cancel-button" onClick={() => history.back()}>Voltar</button>
          <Link href="/createclass" className="link">
            <button type="submit" className="submit-button" onClick={() => Router.push("/creaclass")}>Avançar</button>
          </Link>
          <button type="button" className="cancel-button" onClick={() => Router.push("/profile")}>Cancelar</button>
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

export default CreateClassPage;
