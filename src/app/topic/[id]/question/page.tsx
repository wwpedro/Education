"use client";

import React, { useEffect, useState } from "react";
import "./question.css";

interface Question {
  id: number;
  title: string;
  text: string;
  difficulty: number; // 1 = Fácil, 2 = Médio, 3 = Difícil
  options: { value: string; label: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    title: "Questão 1",
    text: "CESPE - 2012 - POLÍCIA FEDERAL - AGENTE DA POLÍCIA FEDERAL Para proferir uma palestra acerca de crime organizado, um agente conectou dispositivo USB do tipo bluetooth no computador que lhe estava disponível. A respeito desse cenário, julgue o item abaixo. O uso de dispositivos bluetooth em portas USB necessita de driver especial do sistema operacional. Em termos de funcionalidade, esse driver equivale ao de uma interface de rede sem fio (wireless LAN), pois ambas as tecnologias trabalham com o mesmo tipo de endereço físico.",
    difficulty: 2, // Médio
    options: [
      { value: "A", label: "Verdadeiro" },
      { value: "B", label: "Falso" },
    ],
  },
  {
    id: 2,
    title: "Questão 2",
    text: "Outra questão exemplo para mostrar como a lista de questões funciona.",
    difficulty: 1, // Fácil
    options: [
      { value: "A", label: "Sim" },
      { value: "B", label: "Não" },
    ],
  },
  // Adicione mais questões aqui
];

const QuestionPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  const handleExit = () => {
    alert("Você saiu do questionário!");
    // Redirecione para outra página ou realize outra ação
  };

  useEffect(() => {
      const dotsContainer = document.querySelector(".dots");
      if (!dotsContainer) return;
  
      const totalDots = 100; // Quantidade de pontinhos
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
  
        // Posições aleatórias
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.left = `${Math.random() * 100}%`;
  
        // Tamanhos aleatórios
        const size = Math.random() * 1 + 2; // Entre 2px e 6px
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
  
        // Atraso de animação aleatório
        dot.style.animationDelay = `${Math.random() * 5}s`;
  
        // Adiciona o ponto ao contêiner
        dotsContainer.appendChild(dot);
      }
    }, []);

  return (
    <div className="question-container">

        {/* Contêiner para os pontinhos */}
      <div className="dots"></div>
      
      {/* Cabeçalho */}
      <div className="header">
        <button className="exit-button" onClick={handleExit}>
          Sair
        </button>
        <div className="logo-wrapper">
          <div className="logo-background"></div>
          <img src="/assets/img_questao.png" alt="Logo" className="logo" />
        </div>
        <div className="counter">
          {currentQuestionIndex + 1}/{questions.length}
        </div>
      </div>

      {/* Corpo da questão */}
      <div className="question-box">
        <h1 className="question-title">{currentQuestion.title}</h1>
        <p className="question-text">{currentQuestion.text}</p>

        {/* Alternativas */}
        <div className="options">
          {currentQuestion.options.map((option) => (
            <label key={option.value} className="option">
              <input
                type="radio"
                name="answer"
                value={option.value}
                checked={selectedOption === option.value}
                onChange={() => handleOptionChange(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Navegação */}
      <div className="navigation">
        <button
          className="nav-button"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          {"<"}
        </button>
        <div className="stars">
          {[...Array(currentQuestion.difficulty)].map((_, index) => (
            <span key={index} className="star">&#9733;</span>
          ))}
          {[...Array(3 - currentQuestion.difficulty)].map((_, index) => (
            <span key={index} className="star-empty">&#9734;</span>
          ))}
        </div>
        <button
          className="nav-button"
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;
