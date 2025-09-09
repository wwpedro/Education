"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./topiccontent.css";

interface Material {
  title: string;
  url: string;
  type: "pdf" | "video";
}

const TopicContent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  // Você pode usar topicId se quiser, mas não influencia o material fixo:
  const topicId = params.id as string;

  // Estado com o material fixo sempre:
  const [materials] = useState<Material[]>([
    {
      title: "Material",
      url: "https://fasbam.edu.br/fasbampress/index.php/home/catalog/view/14/14/73",
      type: "pdf",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMaterial = materials[currentIndex];

  const handleNext = () => {
    if (currentIndex < materials.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // Efeito só para criar o fundo animado de pontos, opcional
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

  return (
    <div className="space-background">
      <div className="back-button" onClick={() => window.history.back()}>
        <ArrowBackIcon className="back-icon" />
      </div>

      <div className="dots"></div>

      <div className="content-card">
        <div className="progress-indicator">
          {currentIndex + 1}/{materials.length}
        </div>

        <h2 className="content-title">{currentMaterial.title}</h2>

        <div className="content-viewer">
          <iframe src={currentMaterial.url} className="pdf-frame" />
        </div>

        <div className="navigation-buttons">
          <button
            className="nav-button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
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
