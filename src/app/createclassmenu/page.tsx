"use client";
import React, { useEffect, useState } from "react";
import "./createcurriculum.css";
import { useRouter } from "next/navigation";

const CreateResumePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

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
      
      <button className="cancel-button" onClick={() => router.back()}>Voltar</button>

      <div className="title-container">
        <h1 className="title">Fábrica de Currículo</h1>
        <div className="info-icon" onClick={() => setIsModalOpen(true)}>i</div>
      </div>

      <div className="button-group">
        <button className="action-button" onClick={() => router.push("/createcurriculum")}>Criar Curriculum</button>
        <button className="action-button" onClick={() => router.push("/createcourse")}>Criar Curso</button>
        <button className="action-button" onClick={() => router.push("/createclass")}>Criar Classe</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              É obrigatório ter um currículo para a criação de cursos. Já para a criação de turma/classe é preciso já ter um currículo e um curso cadastrados. Você pode avançar e voltar quando quiser.
            </p>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateResumePage;