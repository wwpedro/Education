"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  const goTo = (url: string) => {
    window.location.href = url;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        goTo("/profile");
      } else {
        setModalMessage("Credenciais inválidas");
        setShowModal(true);
      }
    } catch (error) {
      setModalMessage("Ocorreu um erro ao tentar fazer login. Tente novamente.");
      setShowModal(true);
    }
  };

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

  return (
    <div className="login-container">
      {/* Modal integrado */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button 
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Waves no fundo */}
      <div className="wave-container">
        <svg className="wave-svg back" viewBox="0 0 1800 400" preserveAspectRatio="none">
          <path className="wave-path back" d="" />
        </svg>
        <svg className="wave-svg front" viewBox="0 0 1800 400" preserveAspectRatio="none">
          <path className="wave-path front" d="" />
        </svg>
      </div>
      {/* Contêiner para os pontinhos */}
      <div className="dots"></div>

      {/* Formulário */}
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Boas Vindas</h1>
        <div className="form-group">
          <label htmlFor="email">Usuário</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button">Logar</button>
        <p className="redirect">
          Não tem uma conta?{" "}
          <Link href="/register" className="link">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;