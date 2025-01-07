"use client";
import React, { useState } from "react";
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

  return (
    <div className="login-container">
      {/* Waves no fundo */}
      <div className="wave wave-back"></div>
      <div className="wave wave-front"></div>
  
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