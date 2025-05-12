"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./createcurriculum.css";

const CreateCurriculumPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    const curriculumData = {
      name,
      description,
    };

    try {
      const response = await fetch("http://localhost:8081/api/curriculums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(curriculumData),
      });

      if (response.ok) {
        alert("Curriculum criado com sucesso!");
        router.push("/createcourse");
      } else {
        alert("Erro ao criar curriculum.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro no servidor.");
    }
  };

  return (
    <div className="createclass-container">
      <div className="stars"></div>

      <img src="/assets/image9.png" alt="Planeta Terra" className="planet-earth" />
      <img src="/assets/image8.png" alt="Planeta" className="planet-upper-right" />

      <h1 className="title">Fábrica de Curriculum</h1>

      <form className="createclass-form" onSubmit={handleSubmit}>
        <div className="info-icon" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>i</div><br />

        <label htmlFor="curriculum" className="label">Curriculum</label>
        <input
          type="text"
          id="curriculum"
          className="input"
          placeholder="Nome do curriculum"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="curriculum-description" className="label">Descrição</label>
        <input
          type="text"
          id="curriculum-description"
          className="input"
          placeholder="Descrição do curriculum"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => router.back()}>Cancelar</button>
          <button type="button" className="cancel-button" onClick={() => router.push("/profile")}>Voltar</button>
          <button type="submit" className="submit-button">Salvar e Avançar</button>
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
