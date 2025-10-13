"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import "./topicsmenu.css";
import Image from "next/image";

interface Topic {
  topicId: number;
  description: string;
  isLocked?: boolean;
}

interface UserData {
  subjectSpecialty?: string;
}

interface Dot {
  top: number;
  left: number;
  size: number;
  delay: number;
}




const TopicsMenuContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [className, setClassName] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const isTeacher = !!userData?.subjectSpecialty;
  const [curriculumId, setCurriculumId] = useState<number | null>(null);
  const goTo = (url: string) => {
    window.location.href = url;
  };
  const unlockedIndex = topics.reduce(
    (lasttopic, topic, i) => (!topic.isLocked ? i : lasttopic),
    -1
  );

  const naveIndex =
    unlockedIndex >= 0 ? unlockedIndex : 0;

  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token || !classId) return;

      try {
        // 1. Dados da turma
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const classRes = await fetch(`${apiUrl}/classes/${classId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!classRes.ok) throw new Error("Erro ao buscar dados da turma");

        const classData = await classRes.json();
        setCurriculumId(classData.course?.curriculum?.curriculumId || null);
        setClassName(classData.description); // Nome da turma
        setCourseName(classData.course?.name || ""); // Nome do curso (opcional)
        const curriculumTopics = classData?.course?.curriculum?.curriculumTopics ?? [];

        const mappedTopics: Topic[] = curriculumTopics.map((ct: any) => ({
          topicId: ct.topicId,
          description: ct.description,
          isLocked: ct.locked ?? true,
        })).sort((a: { topicId: number; }, b: { topicId: number; }) => a.topicId - b.topicId); // ← ordena por ID


        setTopics(mappedTopics);

        // 2. Dados do usuário
        const userRes = await fetch(`${apiUrl}/auth/profile`, {
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

  useEffect(() => {
    const total = 100;
    const arr: Dot[] = [];
    for (let i = 0; i < total; i++) {
      arr.push({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
      });
    }
    setDots(arr);
  }, []);



  const handleTopicClick = (topic: Topic) => {
    if (topic.isLocked && !isTeacher) {
      setShowPopup(true);
      return;
    }
    goTo(`/topic/${topic.topicId}`);
  };

  const toggleLock = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isTeacher || curriculumId === null) return;

    const topic = topics.find(t => t.topicId === id);
    if (!topic) return;

    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await fetch(
        `${apiUrl}/curriculum-topics/lock?curriculumId=${curriculumId}&topicId=${id}&locked=${!topic.isLocked}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTopics((prev) =>
        prev.map((t) =>
          t.topicId === id ? { ...t, isLocked: !t.isLocked } : t
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar estado de bloqueio:", err);
    }
  };



  const getColorByIndex = (index: number) => {
    const colors = ["yellow", "red", "blue", "pink", "green"];
    return colors[index % colors.length];
  };



  if (isLoading || !classId) return null;



  return (

    <div className="space-background scrollable">
      {/* canvas cobrindo toda a tela para desenhar as estrelas */}
      <div className="dots">
        {dots.map((d, i) => (
          <div
            key={i}
            className="dot"
            style={{
              top: `${d.top}%`,
              left: `${d.left}%`,
              width: `${d.size}px`,
              height: `${d.size}px`,
              animationDelay: `${d.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="back-button">
        <Link href="/classlist">
          <ArrowBackIcon className="back-icon" />
        </Link>
      </div>

      <img src="/assets/image81.png" alt="Planeta" className="planet" />
      <img src="/assets/image812.png" alt="Cometa" className="comet" />
      <img src="/assets/img2.png" alt="Foguete" className="rocket diagonal" />
      <img src="/assets/image9.png" alt="Terra" className="earth" />

      <div className="title">
  <h1>Tópicos da Turma: {className}</h1>
  <p className="subtitle">Curso: {courseName}</p>

  {isTeacher ? (
    <>
      <Link href={`/createclass?classId=${classId}`}>
        <button className="yellow-button">Editar classe</button>
      </Link>

      {/* 
      <Link href={`/topicsmenu/rankingclasssteacher?classId=${classId}`}>
        <button className="yellow-button">Ver Ranking da Turma</button>
      </Link> 
      */}
    </>
  ) : (
    <>
      {/* 
      <Link href={`/topicsmenu/rankingclassstudant?classId=${classId}`}>
        <button className="yellow-button">Ver Ranking da Turma</button>
      </Link> 
      */}
    </>
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
              {!isTeacher && index === naveIndex && (
                <Image
                  src="/assets/navepink.png"
                  alt="Nave"
                  width={60}
                  height={60}
                  className="nave-flutuante"
                />
              )}
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

export default function TopicsMenu() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TopicsMenuContent />
    </Suspense>
  );
}