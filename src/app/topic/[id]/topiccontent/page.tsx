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
  const topicId = params.id as string;

  // Estado dinâmico para materiais vindos do backend
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

  // Detecta se o material é PDF ou vídeo
  const detectType = (url?: string | null): "pdf" | "video" => {
    if (!url) return "pdf";
    if (url.includes("youtube.com") || url.includes("youtu.be") || url.endsWith(".mp4")) return "video";
    return "pdf";
  };

  // Converte links do YouTube para embed
  const formatYoutubeUrl = (url?: string | null): string => {
    if (!url) return "";
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url;
  };

  // Busca materiais do backend
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token || !topicId) {
        setError("Token ou topicId não encontrado.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/materials/topic/${topicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar materiais");

        const data = await res.json();

        const mapped: Material[] = (data || [])
          .filter((m: any) => m.url) // ignora materiais sem URL
          .map((m: any) => {
            const url = m.url;
            const type = detectType(url);
            return {
              title: m.title || "Sem título",
              url: type === "video" ? formatYoutubeUrl(url) : url,
              type,
            };
          });

        setMaterials(mapped);
      } catch (err: any) {
        console.error("Erro ao carregar materiais:", err);
        setError(err.message || "Erro ao carregar materiais");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, [topicId]);

  const handleNext = () => {
    if (currentIndex < materials.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // Fundo animado de pontos (opcional)
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

  if (isLoading) return <div className="space-background">Carregando materiais...</div>;
  if (error) return <div className="space-background">Erro: {error}</div>;
  if (materials.length === 0) return <div className="space-background">Nenhum material encontrado.</div>;

  const currentMaterial = materials[currentIndex];

  return (
    <div className="space-background">
      <div className="back-button" onClick={() => window.history.back()}>
        <ArrowBackIcon className="back-icon" />
      </div>

      <div className="dots"></div>

      <div className="content-card">
        <div className="progress-indicator">{currentIndex + 1}/{materials.length}</div>

        <h2 className="content-title">{currentMaterial.title}</h2>

        <div className="content-viewer">
          {currentMaterial.type === "video" ? (
            <iframe
              src={currentMaterial.url}
              frameBorder="0"
              allowFullScreen
              className="video-frame"
            />
          ) : (
            <iframe
              src={currentMaterial.url}
              className="pdf-frame"
            />
          )}
        </div>

        <div className="navigation-buttons">
          <button className="nav-button" onClick={handlePrevious} disabled={currentIndex === 0}>
            <NavigateBeforeIcon />
          </button>
          <button className="nav-button" onClick={handleNext} disabled={currentIndex === materials.length - 1}>
            <NavigateNextIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicContent;
