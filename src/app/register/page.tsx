"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./register.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [subjectSpecialty, setSubjectSpecialty] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      role,
      subjectSpecialty: role === "teacher" ? subjectSpecialty : undefined,
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

  return (
    <div className="register-container">
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
        <div className="form-group">
          <label htmlFor="role">Tipo de Usuário</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Estudante</option>
            <option value="teacher">Professor</option>
          </select>
        </div>
        {role === "teacher" && (
          <div className="form-group">
            <label htmlFor="subjectSpecialty">Especialidade</label>
            <input
              type="text"
              id="subjectSpecialty"
              value={subjectSpecialty}
              onChange={(e) => setSubjectSpecialty(e.target.value)}
              required
            />
          </div>
        )}
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