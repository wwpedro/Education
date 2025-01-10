"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./register.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8081/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Usuário cadastrado com sucesso!", data);
        alert("Cadastro realizado com sucesso!");
      } else {
        console.error("Erro ao cadastrar usuário");
        alert("Erro no cadastro. Verifique os dados.");
      }
    } catch (error) {
      console.error("Erro no servidor:", error);
      alert("Erro no servidor. Tente novamente mais tarde.");
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
    <div className="register-container">
      {/* Waves no fundo */}
      <div className="wave wave-back"></div>
      <div className="wave wave-front"></div>

      {/* Contêiner para os pontinhos */}
      <div className="dots"></div>

      {/* Imagem do planeta */}
    <div className="image-container">
    <img src="/assets/img-planet.png" alt="Planeta" className="img-planet" />
    </div>

    {/* Imagem do astronauta */}
    <div className="image-container">
    <img src="/assets/img-astro.png" alt="Astronauta" className="img-astro" />
    </div>

      {/* Formulário */}
      <form className="register-form" onSubmit={handleRegister}>
        <h1>Cadastro de Usuário</h1>
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
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
        <button type="submit">Cadastrar</button>
        <p className="redirect">
          Já tem uma conta?{" "}
          <Link href="/login" className="link">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );  
};

export default RegisterPage;