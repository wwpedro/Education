"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import "./lose.css";

interface SolutionFeedback {
  question: string;
  correctOption: string;
  selectedOption: string;
  isCorrect: boolean;
}

const PerdaScreen: React.FC = () => {
  const params = useSearchParams();
  const routeParams = useParams();
  const topicId = routeParams.id as string;

  const correct = parseInt(params.get("acertos") || "0", 10);
  const incorrect = parseInt(params.get("erros") || "0", 10);
  const percentage = parseInt(params.get("porcentagem") || "0", 10);

  const [solutions, setSolutions] = useState<SolutionFeedback[]>([]);

  const handleReview = () => {
    alert("Vamos revisar!");
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

      <h1 className="warning-text">
        Ops <br />
        Parece que você precisa <br />
        reforçar seus conhecimentos
      </h1>

      <div className="summary-box red">
        <h2>Resumo</h2>
        <p>Prova</p>
        <p>erros: {incorrect}</p>
        <p>acertos: {correct}</p>
        <p>porcentagem de aprendizado: {percentage}%</p>
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
        src="/assets/astronautll.png"
        alt="Astronauta flutuando"
        className="astronaut-img"
      />

      <button className="finish-button" onClick={handleReview}>
        Revisar
      </button>

      <div className="moon-curve"></div>
    </div>
  );
};

export default PerdaScreen;
