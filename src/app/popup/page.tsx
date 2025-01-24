"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Importa o hook de navegação do Next.js
import "./popup.css";

const ApprovalPage: React.FC = () => {
  const router = useRouter(); // Inicializa o roteador

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

  const handleButtonClick = () => {
    router.push("/profile"); // Redireciona para a página /profile
  };

  return (
    <div className="approval-page-container">
      <div className="dots"></div>
      <h1 className="approval-page-title">
        Seu cadastro foi realizado com sucesso <br />
        <br />
        Seu perfil está em análise<br />
        assim que for aprovado você receberá um email
      </h1>

      {/* Contêiner para os pontinhos */}
      <div className="dots"></div>

      <button
        className="approval-page-button"
        onClick={handleButtonClick} // Adiciona o redirecionamento no clique
      >
        Perfil
      </button>
    </div>
  );
};

export default ApprovalPage;
