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

  useEffect(() => {
    // Função para buscar dados do usuário
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken"); // Recupera o token armazenado
      if (!token) {
        console.error("Token não encontrado");
        return;
      }

      try {
        const response = await fetch("http://localhost:8081/api/auth/profile", {
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

      <div className="profile-header">
        <div className="profile-info">
          <img
            src="assets/Pessoa-fisica-mobile.jpg"
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
                    Cargo: Professor(a) - {userData.subjectSpecialty}
                  </p>
                ) : (
                  <p className="profile-role">Cargo: Estudante</p>
                )}
              </>
            ) : (
              <p>Carregando informações...</p>
            )}
          </div>
        </div>

        <div className="profile-buttons">
          {/*<button
            className="accept-button"
            onClick={() => router.push("/studentslist")}
          >
            Aceitar Alunos
          </button>*/}
          <button
            className="create-class-button"
            onClick={() => router.push("/createclassmenu")}
          >
            Criar Classe
          </button>
          <button
            className="view-classes-button"
            onClick={() => router.push("/classlist")}
          >
            Ver Classes
          </button>
        </div>
        
        {/* Botão de Logout */}
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("accessToken");
            router.push("/login"); // Redireciona para a tela de login
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
