"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./topiccontent.css";

interface Material {
  id: number;
  title: string;
  url: string;
  type: "pdf" | "video";
}

const TopicContent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const topicId = params.id as string;

  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentMaterial = materials[currentIndex];

  const detectType = (url: string): "pdf" | "video" => {
    if (url.includes("youtube.com") || url.includes("youtu.be") || url.endsWith(".mp4")) {
      return "video";
    }
    return "pdf";
  };

  const fetchMaterials = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !topicId) return;

    try {
      const res = await fetch(`http://localhost:8081/api/materials/topic/${topicId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar materiais");

      const data = await res.json();

      const mapped = data.map((m: any) => ({
        id: m.materialId,
        title: m.title,
        url: m.url,
        type: detectType(m.url),
      }));

      setMaterials(mapped);
    } catch (err) {
      console.error("Erro ao carregar materiais:", err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [topicId]);

  useEffect(() => {
    const dotsContainer = document.querySelector(".dots");
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";
    const totalDots = 150;

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");

      dot.style.top = `${Math.random() * 100}vh`;
      dot.style.left = `${Math.random() * 100}vw`;

      const size = Math.random() * 3 + 2;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.animationDelay = `${Math.random() * 5}s`;

      dotsContainer.appendChild(dot);
    }
  }, []);

  const handleNext = () => {
    if (currentIndex < materials.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (materials.length === 0) {
    return <div className="space-background">Carregando materiais...</div>;
  }

  return (
    <div className="space-background">
      <div className="back-button" onClick={() => router.back()}>
        <ArrowBackIcon className="back-icon" />
      </div>

      <div className="dots"></div>

      <div className="content-card">
        <div className="progress-indicator">
          {currentIndex + 1}/{materials.length}
        </div>

        <h2 className="content-title">{currentMaterial.title}</h2>

        <div className="content-viewer">
          {currentMaterial.type === "video" ? (
            <iframe
              src={currentMaterial.url}
              frameBorder="0"
              allowFullScreen
              className="video-frame"
            ></iframe>
          ) : (
            <iframe
              src={currentMaterial.url}
              className="pdf-frame"
            ></iframe>
          )}
        </div>

        <div className="navigation-buttons">
          <button className="nav-button" onClick={handlePrevious} disabled={currentIndex === 0}>
            <NavigateBeforeIcon />
          </button>
          <button
            className="nav-button"
            onClick={handleNext}
            disabled={currentIndex === materials.length - 1}
          >
            <NavigateNextIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicContent;
