"use client";
import React from 'react';
import './lose.css';

const LosePage = () => {
  return (
    <div className="page">
      <div className="box">
        <div className="image-container">
          <img src="/assets/logo questao2.png" alt="Logo questão" className="logo1" />
        </div>
        <h1 className="title">Opa! Parece que você precisa<br />reforçar seus conhecimentos</h1>
        <div className="bag-container">
          <img src="/assets/perdeu.png" alt="mochila triste" className="logo2" />
        </div>
        <button className="finish-button">Revisar</button>        
        <div className="text-box">
          <p>Prova</p>
          <p>Erros: 10</p>
          <p>Acertos: 10</p>
          <p>Reforçar: Condicionais</p>
          <p>Porcentagem de Aprendizado: 50%</p>
        </div>    
      </div>
    </div>
  );
};

export default LosePage;