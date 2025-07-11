"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./editprofile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

const EditProfilePage = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [role, setRole] = useState("student");
  const goTo = (url: string) => {
    window.location.href = url;
  };


  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token || userId === null) return;

    const updatedData: Record<string, string> = {
      role,
      status: "ATIVO", // sempre enviado, mas não mostrado
    };

    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;
    if (password) updatedData.password = password;

    console.log("🔁 Enviando dados para o backend:", updatedData);

    try {
      const response = await fetch(`http://localhost:8081/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("Informações atualizadas com sucesso!");
        goTo("/profile");
      } else {
        alert("Erro ao atualizar informações.");
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro no servidor.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8081/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.id);
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setRole(data.role || "student");
        } else {
          alert("Erro ao carregar dados do perfil.");
        }
      } catch (err) {
        console.error("Erro ao buscar dados do usuário", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="register-container">
      <div className="wave wave-back"></div>
      <div className="wave wave-front"></div>
      <div className="dots"></div>
      <div className="back-button" onClick={() => window.history.back()}>
        <Link href="/classlist">
          <ArrowBackIcon className="back-icon" />
        </Link>
      </div>


      <div className="form-and-image">
        <div className="left-side">
          <div className="profile-card">
            <div className="profile-image-container">
              {profileImage ? (
                <img src={profileImage} alt="Imagem de perfil" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder" />
              )}
            </div>
            <div className="button-container">
              <label htmlFor="fileInput" className="upload-button">Escolher Foto</label>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        <div className="right-side">
          <form className="register-form" onSubmit={handleUpdate}>
            <h1 className="title">Informações do usuário</h1>
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Telefone</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Nova Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="save-button">Salvar informações</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
