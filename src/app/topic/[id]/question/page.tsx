"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const topicId = params.id as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  // Map: question index -> selected option value
  const [answersMap, setAnswersMap] = useState<Record<number, string>>({});

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !topicId) return;
      try {
        const res = await fetch(
          `http://localhost:8081/api/questions/topic/${topicId}`,
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Erro ao buscar questões");
        const data = await res.json();
        const mapped: Question[] = data.map((q: any, i: number) => ({
          id: q.questionId,
          title: `Questão ${i + 1}`,
          text: q.content,
          difficulty: getLevelNumber(q.level),
          options: q.options.map((opt: any) => ({
            value: opt.optionId.toString(),
            label: opt.text,
            isCorrect: opt.correct,
          })),
        }));
        setQuestions(mapped);
        // Load any saved answer for the first question
        setSelectedOption(prev => answersMap[0] || null);
      } catch (err) {
        console.error("Erro ao carregar questões:", err);
      }
    };
    fetchQuestions();
  }, [topicId]);

  useEffect(() => {
    const dots = document.querySelector(".dots");
    if (!dots) return;
    dots.innerHTML = "";
    for (let i = 0; i < 100; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.left = `${Math.random() * 100}%`;
      const size = Math.random() * 1 + 2;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.animationDelay = `${Math.random() * 5}s`;
      dots.appendChild(dot);
    }
  }, []);

  useEffect(() => {
    const handleUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    setAnswersMap(prev => ({ ...prev, [currentQuestionIndex]: value }));
  };

  const saveAnswerToServer = async (questionId: number, answerText: string, correct: boolean) => {
    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("userId");
    const now = new Date().toISOString();
    try {
      await fetch("http://localhost:8081/api/solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          studentId: parseInt(studentId || "0"),
          questionId,
          answerGiven: answerText,
          correct: correct ? 1.0 : 0.0,
          result: correct ? "CORRETA" : "INCORRETA",
          status: "RESPONDIDA",
          startTime: now,
          endTime: now,
          selfAssessed: 0.0,
        }),
      });
    } catch (err) {
      console.error("Erro ao salvar solution:", err);
    }
  };

  const handleNext = async () => {
    if (!selectedOption) return;
    // Prepare updated answers map including current selection
    const updatedMap = { ...answersMap, [currentQuestionIndex]: selectedOption };
    setAnswersMap(updatedMap);
    // Save current answer
    const opt = currentQuestion.options.find(o => o.value === selectedOption)!;
    await saveAnswerToServer(currentQuestion.id, opt.label, !!opt.isCorrect);

    // Move to next or finish
    if (currentQuestionIndex < questions.length - 1) {
      const next = currentQuestionIndex + 1;
      setCurrentQuestionIndex(next);
      setSelectedOption(updatedMap[next] || null);
    } else {
      // Compute final counts from updatedMap
      const total = questions.length;
      const correctAnswers = Object.entries(updatedMap).filter(([idx, val]) => {
        const q = questions[parseInt(idx)];
        const o = q.options.find(o => o.value === val);
        return o?.isCorrect;
      }).length;
      const percent = Math.round((correctAnswers / total) * 100);
      const params = new URLSearchParams({
        acertos: correctAnswers.toString(),
        erros: (total - correctAnswers).toString(),
        porcentagem: percent.toString(),
        reforcar: "Revisar tópico",
      });
      router.push(`/topic/${topicId}/${percent >= 70 ? "won" : "lose"}?${params}`);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex === 0) return;
    const prev = currentQuestionIndex - 1;
    setCurrentQuestionIndex(prev);
    setSelectedOption(answersMap[prev] || null);
  };

  const handleExit = () => {
    if (confirm("Tem certeza que deseja sair? Você perderá seu progresso.")) {
      router.push(`/topic/${topicId}`);
    }
  };

  if (!questions.length) return <div>Carregando questões...</div>;

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
          {currentQuestion.options.map(o => (
            <label key={o.value} className={`option ${selectedOption === o.value ? 'selected' : ''}`}>
              <input
                type="radio"
                name="answer"
                value={o.value}
                checked={selectedOption === o.value}
                onChange={() => handleOptionChange(o.value)}
              />
              {o.label}
            </label>
          ))}
        </div>
      </div>
      <div className="navigation">
        <button className="nav-button" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          {"<"}
        </button>
        <div className="stars">
          {[...Array(currentQuestion.difficulty)].map((_, i) => <span key={i} className="star">★</span>)}
          {[...Array(3 - currentQuestion.difficulty)].map((_, i) => <span key={i} className="star-empty">☆</span>)}
        </div>
        <button className="nav-button" onClick={handleNext} disabled={!selectedOption}>
          {currentQuestionIndex === questions.length - 1 ? 'Finalizar questionário' : '>'}
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;
