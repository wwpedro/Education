"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./profile.css";

const ProfilePage = () => {
  const router = useRouter();

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
      const size = Math.random() * 2 + 1; // Entre 1px e 3px
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;

      // Atraso de animação aleatório
      dot.style.animationDelay = `${Math.random() * 5}s`;

      // Adiciona o ponto ao contêiner
      dotsContainer.appendChild(dot);
    }
  }, []);

  return (
    <div className="profile-container">
      {/* Contêiner para as waves */}
      <div className="wave-container1">
        <div className="wave1 wave-back1"></div>
        <div className="wave1 wave-front1"></div>
      </div>

      {/* Contêiner para os pontinhos */}
      <div className="dots"></div>

      {/* Header com imagem, informações e botões */}
      <div className="profile-header">
        {/* Informações do usuário no lado esquerdo */}
        <div className="profile-info">
          <img
            src="assets/Pessoa-fisica-mobile.jpg"
            alt="Foto do Perfil"
            className="profile-picture"
          />
          <div className="profile-details">
            <h1 className="profile-name">Olá, Girleide</h1>
            <a href="/editprofile" className="edit-link">
              Editar
            </a>
            <p className="profile-description">Estudante dedicada e apaixonada por tecnologia</p>
            <p className="profile-role">Cargo: Professora</p>
          </div>
        </div>

        {/* Botões no lado direito */}
        <div className="profile-buttons">
          <button
            className="accept-button"
            onClick={() => router.push("/studantlist")}
          >
            Aceitar Alunos
          </button>
          <button
            className="create-class-button"
            onClick={() => router.push("/createclass")}
          >
            Criar Aula
          </button>
          <button
            className="view-classes-button"
            onClick={() => router.push("/classes")}
          >
            Ver Classes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;