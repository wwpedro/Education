"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import "./topicsmenu.css";

interface Topic {
  topicId: number;
  description: string;
  isLocked?: boolean;
}

interface UserData {
  subjectSpecialty?: string;
}

const TopicsMenu: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTeacher = !!userData?.subjectSpecialty;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !classId) return;

      try {
        // 1. Dados da turma
        const classRes = await fetch(`http://localhost:8081/api/classes/${classId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!classRes.ok) throw new Error("Erro ao buscar dados da turma");

        const classData = await classRes.json();
        const curriculumTopics = classData?.course?.curriculum?.curriculumTopics ?? [];

        const mappedTopics: Topic[] = curriculumTopics
          .map((ct: any) => ({
            topicId: ct.topic.topicId,
            description: ct.topic.description,
            isLocked: true,
          }))
          .sort((a: { topicId: number; }, b: { topicId: number; }) => a.topicId - b.topicId); // ← ordena por ID


        setTopics(mappedTopics);

        // 2. Dados do usuário
        const userRes = await fetch("http://localhost:8081/api/auth/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (userRes.ok) {
          const user = await userRes.json();
          setUserData(user);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  const handleTopicClick = (topic: Topic) => {
    if (topic.isLocked && !isTeacher) {
      setShowPopup(true);
      return;
    }
    router.push(`/topic/${topic.topicId}`);
  };

  const toggleLock = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isTeacher) return;

    setTopics((prev) =>
      prev.map((t) =>
        t.topicId === id ? { ...t, isLocked: !t.isLocked } : t
      )
    );
  };

  const getColorByIndex = (index: number) => {
    const colors = ["yellow", "red", "blue", "pink", "green"];
    return colors[index % colors.length];
  };

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
      dot.style.width = `${Math.random() * 3 + 2}px`;
      dot.style.height = `${Math.random() * 3 + 2}px`;
      dot.style.animationDelay = `${Math.random() * 5}s`;
      dotsContainer.appendChild(dot);
    }
  }, []);

  if (isLoading || !classId) return null;

  return (
    <div className="space-background scrollable">
      <div className="back-button">
        <Link href="/classlist">
          <ArrowBackIcon className="back-icon" />
        </Link>
      </div>

      <img src="/assets/image81.png" alt="Planeta" className="planet" />
      <img src="/assets/image812.png" alt="Cometa" className="comet" />
      <img src="/assets/img2.png" alt="Foguete" className="rocket diagonal" />
      <img src="/assets/image9.png" alt="Terra" className="earth" />
      <div className="dots"></div>

      <div className="title">
        <h1>Tópicos da Turma</h1>
        {isTeacher && (
          <Link href={`/createclass?classId=${classId}`}>
            <button className="yellow-button">Editar classe</button>
          </Link>
        )}
      </div>

      <div className="topics-container">
        {topics.map((topic, index) => {
          const color = getColorByIndex(index);
          const randomOffset = (Math.random() - 0.5) * 40;

          return (
            <div
              key={topic.topicId}
              className="node"
              onClick={() => handleTopicClick(topic)}
              style={{
                cursor: "pointer",
                transform: `translateX(${randomOffset}px)`,
              }}
            >
              <div className="node-circle" style={{ backgroundColor: color }}>
                <img
                  src="/assets/star.png"
                  alt="Ícone do tópico"
                  className="topic-icon"
                />
                {isTeacher ? (
                  topic.isLocked ? (
                    <LockIcon
                      className="lock-icon"
                      onClick={(e) => toggleLock(topic.topicId, e)}
                    />
                  ) : (
                    <LockOpenIcon
                      className="lock-icon"
                      onClick={(e) => toggleLock(topic.topicId, e)}
                    />
                  )
                ) : topic.isLocked ? (
                  <LockIcon className="lock-icon disabled" />
                ) : (
                  <LockOpenIcon className="lock-icon disabled" />
                )}
              </div>
              <p className="node-title">{topic.description}</p>
            </div>
          );
        })}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-content">
              <p>Este módulo ainda não foi liberado!</p>
              <button
                className="close-button"
                onClick={() => setShowPopup(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicsMenu;
