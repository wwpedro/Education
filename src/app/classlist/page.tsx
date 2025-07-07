// src/app/classlist/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import "./classlist.css";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

const ClassListPage = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const goTo = (url: string) => {
    window.location.href = url;
  };

  //Efeito das estrelas
  useEffect(() => {
    const starsContainer = document.querySelector(".stars");
    if (!starsContainer) return;

    const totalStars = 100;
    for (let i = 0; i < totalStars; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      starsContainer.appendChild(star);
    }
  }, []);

  //Fetch das turmas
  useEffect(() => {
    const fetchClasses = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8081/api/classes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao carregar turmas");
        const data = await response.json();
        setClasses(data.reverse());
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleBackClick = () => {
    goTo("/profile");
  };

  return (
    <div className="classlist-background-container">
      <div className="stars"></div>
      <img
        src="/assets/img2.png"
        alt="Nave Espacial"
        className="rocket-image"
      />
      <img
        src="/assets/image8.png"
        alt="Planeta"
        className="planet-image"
      />

      <h1 className="title">Lista de Classes</h1>

      <div className="class-cards-container">
        {loading ? (
          <p>Carregando turmas...</p>
        ) : classes.length === 0 ? (
          <p>Nenhuma turma encontrada.</p>
        ) : (
          classes.map((classItem, index) => (
            <div key={index} className="custom-class-card">
              <div className="class-card-header">
                <span className="class-semester">{classItem.description}</span>
                <span className="class-status">Status: andamento</span>
              </div>
              <div className="class-card-body">
                <h3 className="class-title">
                  {classItem.course?.name || "Sem curso"}
                </h3>
                <p className="class-description">
                  {classItem.course?.curriculum?.description ||
                    "Sem descrição"}
                </p>
              </div>
              <button
                className="view-class-button"
                onClick={() =>
                  goTo(`/topicsmenu?classId=${classItem.classId}`)
                }
              >
                Ver classe
              </button>
            </div>
          ))
        )}
      </div>

      <div className="back-button" onClick={() => window.history.back()}>
        <Link href="/classlist">
          <ArrowBackIcon className="back-icon" />
        </Link>
      </div>
    </div>
  );
};

export default ClassListPage;