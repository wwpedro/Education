"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importa o hook useRouter
import "./editprofile.css";

const EditProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); // Estado para telefone
  const [profileImage, setProfileImage] = useState(null); // Estado para imagem de perfil
  const router = useRouter(); // Inicializa o hook para redirecionamento

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      phone,
      role: "student", // Papel padrão definido automaticamente
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
        router.push("/popup"); // Redireciona para a rota /popup
      } else {
        console.error("Erro ao cadastrar usuário");
        alert("Erro no cadastro. Verifique os dados.");
      }
    } catch (error) {
      console.error("Erro no servidor:", error);
      alert("Erro no servidor. Tente novamente mais tarde.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        //setProfileImage(reader.result as string);
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

  const handleBackClick = () => {
    window.history.back(); // Volta para a página anterior
    console.log("Botão de voltar clicado");
  };

  return (
    <div className="register-container">
      <div className="wave wave-back"></div>
      <div className="wave wave-front"></div>
      <div className="dots"></div>

      <div className="form-and-image">
        {/* Cartão de Adicionar Foto */}
        <div className="left-side">
          <div className="profile-card">
            <div className="profile-image-container">
              {profileImage ? (
                <img src={profileImage} alt="Imagem de perfil" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder"></div>
              )}
            </div>
            <div className="image-upload-container">
              <div className="photo-text-box">Adicione sua foto</div>
              <input type="file" accept="image/*" onChange={handleImageChange} />              
            </div>
            {/* Botão "+" ao lado da caixa */}
            <div className="button-container">
                <button className="upload-button">+</button>
            </div>
          </div>
        </div>

        {/* Formulário de Preenchimento */}
        <div className="right-side">
          <form className="register-form" onSubmit={handleRegister}>
            <h1 className="title">Informações do usuário</h1>
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
              <label htmlFor="phone">Telefone</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="save-button" onClick={handleBackClick}>Salvar informações</button>
          </form>
        </div>

        
      </div>
    </div>
  );
};

export default EditProfilePage;