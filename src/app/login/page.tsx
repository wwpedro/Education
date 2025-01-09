"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8081/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login bem-sucedido!", data);
      alert("Login realizado com sucesso!");
    } else {
      console.error("Erro ao realizar login");
      alert("Credenciais inválidas");
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
      {/* Waves no fundo */}
      <div className="wave-container">
        <div className="wave wave-back"></div>
        <div className="wave wave-front"></div>
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
        <button type="submit">Logar</button>
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