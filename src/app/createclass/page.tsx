"use client";
import React, { useState, useEffect } from "react";
import "./createclass.css";

const CreateClassroomPage = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [curriculums, setCurriculums] = useState<{ 
      curriculumId: number;
      name: string;
      description: string;
      curriculumTopics: any[];
    }[]>([]);
  const [loadingCurriculums, setLoadingCurriculums] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchCurriculums = async () => {
      const token = localStorage.getItem("accessToken"); 
      if (!token) {
        console.error("Token não encontrado");
        return;
      }

      try {
        const response = await fetch("http://localhost:8081/api/curriculums", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        });
        if (!response.ok) throw new Error("Erro ao buscar currículos.");
        const data = await response.json();
        setCurriculums(data);
      } catch (err) {
        setError("Erro ao carregar currículos.");
      } finally {
        setLoadingCurriculums(false);
      }
    };

    fetchCurriculums();
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
          {loadingCurriculums ? (
            <p>Carregando currículos...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <ul>
              {curriculums.map((curriculum) => (
                <li
                  key={curriculum.curriculumId}
                  onClick={() => setSelectedCurriculum(curriculum.name)}
                  className={selectedCurriculum === curriculum.name ? "selected" : ""}
                >
                  {curriculum.name} 
                </li>
              ))}
            </ul>
          )}
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
          <button type="submit" className="submit-button">Avançar</button>
          <button type="button" className="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassroomPage;
