"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./question.css";

interface Question {
  id: number;
  title: string;
  text: string;
  difficulty: number;
  options: { value: string; label: string; isCorrect?: boolean }[];
}

function getLevelNumber(level: string): number {
  switch (level?.toUpperCase()) {
    case "EASY": return 1;
    case "MEDIUM": return 2;
    case "HARD": return 3;
    default: return 1;
  }
}

const QuestionPage = () => {
  const params = useParams();
  const topicId = params.id as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const fetchQuestions = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !topicId) return;

    try {
      const res = await fetch(`http://localhost:8081/api/questions/topic/${topicId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar questões");
      const data = await res.json();

      const mapped = data.map((q: any, index: number) => ({
        id: q.questionId,
        title: `Questão ${index + 1}`,
        text: q.content,
        difficulty: getLevelNumber(q.level),
        options: q.options.map((opt: any) => ({
          value: opt.optionId.toString(),
          label: opt.text,
          isCorrect: opt.correct,
        })),
      }));

      setQuestions(mapped);
    } catch (err) {
      console.error("Erro ao carregar questões:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [topicId]);

  useEffect(() => {
    const dotsContainer = document.querySelector(".dots");
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";

    for (let i = 0; i < 100; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.left = `${Math.random() * 100}%`;
      const size = Math.random() * 1 + 2;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.animationDelay = `${Math.random() * 5}s`;
      dotsContainer.appendChild(dot);
    }
  }, []);

  const handleOptionChange = (optionValue: string) => {
    setSelectedOption(optionValue);
  };

  const handleNextQuestion = async () => {
    if (!selectedOption) return;

    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("userId");
    const question = questions[currentQuestionIndex];
    const selected = question.options.find(opt => opt.value === selectedOption);
    const now = new Date().toISOString();
    const isCorrect = selected?.isCorrect ?? false;
    const answerText = selected?.label || "";

    try {
      await fetch("http://localhost:8081/api/solutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: parseInt(studentId || "0"),
          questionId: question.id,
          answerGiven: answerText,
          correct: isCorrect ? 1.0 : 0.0,
          result: isCorrect ? "CORRETA" : "INCORRETA",
          status: "RESPONDIDA",
          startTime: now,
          endTime: now,
          selfAssessed: 0.0
        }),
      });

      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
      } else {
        setIncorrectCount(prev => prev + 1);
      }

      if (currentQuestionIndex === questions.length - 1) {
        const total = questions.length;
        const percent = Math.round(((isCorrect ? correctCount + 1 : correctCount) / total) * 100);

        const searchParams = new URLSearchParams({
          acertos: isCorrect ? (correctCount + 1).toString() : correctCount.toString(),
          erros: isCorrect ? incorrectCount.toString() : (incorrectCount + 1).toString(),
          porcentagem: percent.toString(),
          reforcar: "Revisar tópico",
        });

        window.location.href = `/topic/${topicId}/${percent >= 70 ? "won" : "lose"}?${searchParams.toString()}`;
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      }
    } catch (err) {
      console.error("Erro ao salvar resposta:", err);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
    }
  };

  const handleExit = () => {
    alert("Você saiu do questionário!");
  };

  if (questions.length === 0) {
    return <div>Carregando questões ou nenhuma questão disponível.</div>;
  }

  return (
    <div className="question-container">
      <div className="dots"></div>

      <div className="header">
        <button className="exit-button" onClick={handleExit}>Sair</button>
        <div className="logo-wrapper">
          <div className="logo-background"></div>
          <img src="/assets/img_questao.png" alt="Logo" className="logo" />
        </div>
        <div className="counter">{currentQuestionIndex + 1}/{questions.length}</div>
      </div>

      <div className="question-box">
        <h1 className="question-title">{currentQuestion.title}</h1>
        <p className="question-text">{currentQuestion.text}</p>

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

      <div className="navigation">
        <button className="nav-button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
          {"<"}
        </button>
        <div className="stars">
          {[...Array(currentQuestion.difficulty)].map((_, i) => (
            <span key={`filled-${i}`} className="star">★</span>
          ))}
          {[...Array(3 - currentQuestion.difficulty)].map((_, i) => (
            <span key={`empty-${i}`} className="star-empty">☆</span>
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
