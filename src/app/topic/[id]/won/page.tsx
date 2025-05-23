"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import "./won.css";

const FinalScreen: React.FC = () => {
  const params = useSearchParams();

  const correct = parseInt(params.get("acertos") || "0", 10);
  const incorrect = parseInt(params.get("erros") || "0", 10);
  const improvement = params.get("reforcar") || "Nenhum";
  const percentage = parseInt(params.get("porcentagem") || "0", 10);

  const handleFinish = () => {
    // Redirecionamento ou reset
    alert("Fim da jornada!");
  };

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
