"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./profile.css";

// Definição do tipo de usuário
interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  createdAt: string;
  lastLogin: string | null;
  profilePicturePath: string | null;
  status: string;
  subjectSpecialty?: string; // Campo opcional para professores
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const goTo = (url: string) => { window.location.href = url; };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    document.head.appendChild(link);

    // Função para buscar dados do usuário
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken"); // Recupera o token armazenado
      if (!token) {
        console.error("Token não encontrado");
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        });

        if (response.ok) {
          const data: UserData = await response.json();
          setUserData(data); // Armazena os dados do usuário
        } else {
          console.error("Erro ao buscar dados do usuário:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchUserData();

    // Adiciona os pontinhos animados
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
      <div className="wave-container1">
        <div className="wave1 wave-back1"></div>
        <div className="wave1 wave-front1"></div>
      </div>

      <div className="dots"></div>
      {/* Botão de Logout */}
      <button
        className="logout-button-perfil"
        onClick={() => {
          localStorage.removeItem("accessToken");
          goTo("/login");
        }}
      >
        <span className="material-icons logout-icon" style={{ fontSize: "1.7rem" }}>
          logout
        </span>
        <span className="logout-text">Logout</span>
      </button>
      <div className="profile-header">
        {/* Coluna esquerda */}
        <div className="profile-left">
          {/* Linha 1: Foto + Detalhes */}
          <div className="profile-info">
            <img
              src={
                userData?.subjectSpecialty
                  ? "../assets/professora.png" // ou professor.png, dependendo do formato
                  : "../assets/estudante.png"
              }
              alt="Foto do Perfil"
              className="profile-picture"
            />
            <div className="profile-details">
              {userData ? (
                <>
                  <h1 className="profile-name">Olá, {userData.name}</h1>
                  <a href="/editprofile" className="edit-link">
                    Editar
                  </a>
                  {userData.subjectSpecialty ? (
                    <p className="profile-role">
                      Professor(a) – {userData.subjectSpecialty}
                    </p>
                  ) : (
                    <p className="profile-role">Estudante</p>
                  )}
                  <p className="profile-description">
                    Sou uma pessoa dedicada, gosto de programação e quero aprender mais...
                  </p>
                </>
              ) : (
                <p>Carregando informações...</p>
              )}
            </div>
          </div>

          {/* Linha 2: Destaques */}
          {!userData?.subjectSpecialty && (
            <div className="profile-highlights">
              <h3>Destaques:</h3>
              <div className="highlights-icons">
                <div className="highlight-circle">
                  <img src="/medalhas/ouro.png" alt="Destaque 1" />
                </div>
                <div className="highlight-circle">
                  <img src="/medalhas/prata.png" alt="Destaque 2" />
                </div>
                <div className="highlight-circle">
                  <img src="/medalhas/bronze.png" alt="Destaque 3" />
                </div>
              </div>
            </div>
          )}
        </div>




        {/* Coluna direita → Card */}
        <div className="profile-right">
          {!userData?.subjectSpecialty ? (
            // Se for estudante
            <div className="student-card">
              <div className="card-header">
                <span>Pontos 130</span>
                <button onClick={() => goTo("/loja")}><span className="material-icons">shopping_cart</span></button>
              </div>
              <img src="/naves/verdinha.png" alt="Nave" className="card-image" />
              <p className="card-description">
                Verdinho - a nave mais rápida do espaço
              </p>
            </div>
          ) : (
            // Se for professor
            <div className="teacher-card">
              <img src="/assets/professor.png" alt="Professor" className="card-image" />
              <p>Turmas ministradas: 5</p>
              <p>Materiais: 10</p>
            </div>
          )}

          {/* Botões abaixo do card */}
          <div className="card-buttons">
            {!userData?.subjectSpecialty ? (
              <>
                <button onClick={() => goTo("/baseespacial")}>Base Espacial</button>
                <button onClick={() => goTo("/classlist")}>Turmas</button>
              </>
            ) : (
              <>
                <button onClick={() => goTo("/createclassmenu")}>Criar turma/curso</button>
                <button onClick={() => goTo("/classlist")}>Ver turmas</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
