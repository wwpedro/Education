"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import "./won.css";  // ✅ Igual à página lose, usando o mesmo CSS

interface SolutionFeedback {
  question: string;
  correctOption: string;
  selectedOption: string;
  isCorrect: boolean;
}

const WonScreen: React.FC = () => {
  const params = useSearchParams();
  const routeParams = useParams();
  const topicId = routeParams.id as string;

  const correct = parseInt(params.get("acertos") || "0", 10);
  const incorrect = parseInt(params.get("erros") || "0", 10);
  const percentage = parseInt(params.get("porcentagem") || "0", 10);

  const [solutions, setSolutions] = useState<SolutionFeedback[]>([]);

  const handleFinish = () => {
    alert("Parabéns! Você finalizou a etapa!");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !topicId) return;

    const fetchSolutions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/solutions/by-topic/${topicId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Erro ao buscar soluções");
        const data = await res.json();
        setSolutions(data);
      } catch (err) {
        console.error("Erro ao carregar soluções:", err);
      }
    };

    fetchSolutions();
  }, [topicId]);

  return (
    <div className="result-screen">
      <img src="/assets/image9.png" alt="Planeta Terra" className="earth-img" />

      <h1 className="success-text">
        Parabéns! <br />
        Você concluiu essa fase <br />
        e desbloqueou uma nova etapa!
      </h1>

      <div className="summary-box green">
        <h2>Resumo</h2>
        <p>Prova</p>
        <p>Erros: {incorrect}</p>
        <p>Acertos: {correct}</p>
        <p>Porcentagem de aprendizado: {percentage}%</p>
      </div>

      {solutions.length > 0 && (
        <div className="table-wrapper">
          <h2>Detalhamento das Respostas</h2>
          <table className="solution-table">
            <thead>
              <tr>
                <th>Pergunta</th>
                <th>Você respondeu</th>
                <th>Correta</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {solutions.map((sol, index) => (
                <tr key={index}>
                  <td>{sol.question}</td>
                  <td>{sol.selectedOption}</td>
                  <td>{sol.correctOption}</td>
                  <td style={{ color: sol.isCorrect ? "green" : "red" }}>
                    {sol.isCorrect ? "✔ Acertou" : "✘ Errou"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <img
        src="/assets/astronaut.png"
        alt="Astronauta comemorando"
        className="astronaut-img"
      />

      <button className="finish-button" onClick={handleFinish}>
        Finalizar
      </button>

      <div className="moon-curve"></div>
    </div>
  );
};

export default WonScreen;
