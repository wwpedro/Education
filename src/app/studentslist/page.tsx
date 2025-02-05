"use client";
import React, { useEffect } from "react";
import "./studentslist.css";

const studentsList = [
  { name: "João Silva", email: "joao.silva@email.com" },
  { name: "Maria Oliveira", email: "maria.oliveira@email.com" },
  { name: "Pedro Santos", email: "pedro.santos@email.com" },
  { name: "Ana Costa", email: "ana.costa@email.com" },
  { name: "Carlos Pereira", email: "carlos.pereira@email.com" },
  { name: "Luciana Souza", email: "luciana.souza@email.com" },
  { name: "Rafael Almeida", email: "rafael.almeida@email.com" },
  { name: "Beatriz Lima", email: "beatriz.lima@email.com" },
  { name: "Ricardo Alves", email: "ricardo.alves@email.com" },
  { name: "Fernanda Rocha", email: "fernanda.rocha@email.com" },
  { name: "Juliana Costa", email: "juliana.costa@email.com" },
  { name: "Tiago Almeida", email: "tiago.almeida@email.com" },
  { name: "Patrícia Silva", email: "patricia.silva@email.com" },
  { name: "Gabriela Oliveira", email: "gabriela.oliveira@email.com" },
  { name: "Lucas Costa", email: "lucas.costa@email.com" },
  { name: "Carla Pereira", email: "carla.pereira@email.com" },
  { name: "Rodrigo Santos", email: "rodrigo.santos@email.com" },
  { name: "Isabela Martins", email: "isabela.martins@email.com" },
  { name: "Mariana Souza", email: "mariana.souza@email.com" },
  { name: "Gustavo Lima", email: "gustavo.lima@email.com" },
];
  

const StudentsPage = () => {
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
    <div className="students-container">
      {/* Estrelas no fundo */}
      <div className="stars"></div>

      {/* Imagem do planeta Terra no fundo inferior */}
      <img src="/assets/image9.png" alt="Planeta Terra" className="planet-earth" />

      {/* Imagem do planeta no canto superior direito */}
      <img src="/assets/image8.png" alt="Planeta" className="planet-upper-right" />

      {/* Conteúdo principal */}
      <h1 className="title">Lista de Alunos</h1>

      {/* Área rolável dos cartões */}
      <div className="students-scroll-area">
        {studentsList.map((student, index) => (
          <div key={index} className="student-card">
            <div className="student-info">
              <h2 className="student-name">{student.name}</h2>
              <p className="student-email">{student.email}</p>
            </div>
            <div className="action-buttons">
              <button className="accept-button">
                ✔
              </button>
              <button className="reject-button">
                ✘
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão Voltar */}
      <button className="back-button" onClick={handleBackClick}>Voltar</button>
    </div>
  );
};

export default StudentsPage;