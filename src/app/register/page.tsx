"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./register.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState(false);
  const router = useRouter();
  const goTo = (url: string) => {
    window.location.href = url;
  };


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setModalMessage("As senhas não coincidem.");
      setModalError(true);
      setShowModal(true);
      return;
    }

    const userData = {
      name,
      email,
      password,
      role: "student",
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
        setModalMessage("Cadastro realizado com sucesso!");
        setModalError(false);
        setShowModal(true);
      } else {
        const data = await response.json();
        setModalMessage(data.message || "Erro ao cadastrar usuário.");
        setModalError(true);
        setShowModal(true);
      }
    } catch (error) {
      setModalMessage("Erro no servidor. Tente novamente mais tarde.");
      setModalError(true);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (!modalError) {
      goTo("/login");
    }
  };


  useEffect(() => {
    const dotsContainer = document.querySelector(".dots");
    if (!dotsContainer) return;

    const totalDots = 100;
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.left = `${Math.random() * 100}%`;
      const size = Math.random() * 1 + 2;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.animationDelay = `${Math.random() * 5}s`;
      dotsContainer.appendChild(dot);
    }
  }, []);

  type ModalProps = {
    message: string;
    isError: boolean;
    onClose: () => void;
  };

  const Modal: React.FC<ModalProps> = ({ message, isError, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className={isError ? "error-text" : "success-text"}>{message}</p>
        <button className="modal-close-btn" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );



  return (
    <>

      {showModal && (
        <Modal
          message={modalMessage}
          isError={modalError}
          onClose={closeModal}
        />
      )}
      {/* 🔵 ONDAS FORA do container */}
      <div className="wave-container">
        <svg className="wave-svg back" viewBox="0 0 1800 400" preserveAspectRatio="none">
          <path
            className="wave-path back"
            d="M0,300 C200,250 400,350 600,300 C800,250 1000,350 1200,300 C1400,250 1600,350 1800,300 L1800,400 L0,400 Z"
          />
        </svg>
        <svg className="wave-svg front" viewBox="0 0 1800 400" preserveAspectRatio="none">
          <path
            className="wave-path front"
            d="M0,320 C200,280 400,360 600,320 C800,280 1000,360 1200,320 C1400,280 1600,360 1800,320 L1800,400 L0,400 Z"
          />
        </svg>
      </div>


      <div className="dots"></div>

      {/* 🔵 CONTEÚDO DE CADASTRO */}
      <div className="register-container">
        <div className="image-container">
          <img src="/assets/img-planet.png" alt="Planeta" className="img-planet" />
        </div>
        <div className="image-container">
          <img src="/assets/img-astro.png" alt="Astronauta" className="img-astro" />
        </div>

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
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Cadastrar</button>
          <p className="redirect">
            Caso já tenha uma conta por favor:{" "}
            <Link href="/login" className="link">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;