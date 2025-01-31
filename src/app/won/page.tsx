"use client";
import React from 'react';
import './won.css';

const WonPage = () => {
  return (
    <div className="page">
      <div className="box">
        <div className="image-container">
          <img src="/assets/logo questao2.png" alt="Logo questão" className="logo1" />
        </div>
        <h1 className="title">Parabéns! Você concluiu a seção<br />e desbloqueou uma nova fase</h1>
        <div className="trophy-container">
          <img src="/assets/ganhou.png" alt="Troféu" className="logo2" />
        </div>
        <button className="finish-button">Finalizar</button>        
        <div className="text-box">
          <p>Prova</p>
          <p>Erros: 30</p>
          <p>Acertos: 70</p>
          <p>Reforçar: Condicionais</p>
          <p>Porcentagem de Aprendizado: 70%</p>
        </div>    
      </div>
    </div>
  );
};

export default WonPage;
