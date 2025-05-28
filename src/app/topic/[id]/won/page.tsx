"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import "./won.css";

interface SolutionFeedback {
  question: string;
  correctOption: string;
  selectedOption: string;
  isCorrect: boolean;
}

const FinalScreen: React.FC = () => {
  const params = useSearchParams();
  const routeParams = useParams();
  const topicId = routeParams.id as string;

  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [solutions, setSolutions] = useState<SolutionFeedback[]>([]);

  const improvement = params.get("reforcar") || "Nenhum";

  const handleFinish = () => {
    alert("Fim da jornada!");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("userId");

    if (!token || !studentId || !topicId) return;

    const fetchSolutions = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/solutions/student/${studentId}/topic/${topicId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar soluções");
        const data = await res.json();

        const formatted = data.map((s: any) => ({
          question: s.question?.content || "Pergunta não encontrada",
          correctOption: s.question?.answer || "Desconhecida",
          selectedOption: s.selectedOption?.text || "Não respondida",
          isCorrect: s.selectedOption?.isCorrect === true,
        }));

        const correctCount = formatted.filter((s: any) => s.isCorrect).length;
        const total = formatted.length;

        setCorrect(correctCount);
        setIncorrect(total - correctCount);
        setPercentage(total > 0 ? Math.round((correctCount / total) * 100) : 0);
        setSolutions(formatted);
      } catch (err) {
        console.error("Erro ao carregar soluções:", err);
      }
    };

    fetchSolutions();
  }, [topicId]);

  return (
    <div className="result-screen">
      <img src="/assets/image9.png" alt="Planeta Terra" className="earth-img" />

      <h1 className="congrats-text">
        Parabéns Você concluiu a seção <br />
        e desbloqueou uma nova fase
      </h1>

      <div className="summary-box">
        <h2>Resumo</h2>
        <p>Prova</p>
        <p>erros: {incorrect}</p>
        <p>acertos: {correct}</p>
        <p>reforçar: {improvement}</p>
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
        src="/assets/astronaut.png"
        alt="Astronauta com bandeira"
        className="astronaut-img"
      />

      <button className="finish-button" onClick={handleFinish}>
        Finalizar
      </button>

      <div className="moon-curve"></div>
    </div>
  );
};

export default FinalScreen;
