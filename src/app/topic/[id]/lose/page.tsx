"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import "./lose.css";

const PerdaScreen: React.FC = () => {
  const params = useSearchParams();

  const correct = parseInt(params.get("acertos") || "0", 10);
  const incorrect = parseInt(params.get("erros") || "0", 10);
  const improvement = params.get("reforcar") || "Nenhum";
  const percentage = parseInt(params.get("porcentagem") || "0", 10);

  const handleReview = () => {
    alert("Vamos revisar!");
  };

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
        <p>reforçar: {improvement}</p>
        <p>porcentagem de aprendizado: {percentage}%</p>
      </div>

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
