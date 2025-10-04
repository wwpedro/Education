"use client";

import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "./RankClassTeacher.css";
import { useRouter, useParams, useSearchParams } from "next/navigation";

const RankClassTeacher: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs("2025-01-27"),
    dayjs("2025-01-31"),
  ]);

  const router = useRouter();
      const params = useParams();
      const searchParams = useSearchParams();
  
      const classId = searchParams.get('classId') || '1';

  useEffect(() => {
    const dotsContainer = document.querySelector(".dots");
    if (!dotsContainer) return;

    const totalDots = 100;
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");

      dot.style.top = `${Math.random() * 100}%`;
      dot.style.left = `${Math.random() * 100}%`;

      const size = Math.random() * 2 + 1;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;

      dot.style.animationDelay = `${Math.random() * 5}s`;

      dotsContainer.appendChild(dot);
    }
  }, []);

  const students = [
    { id: 1, name: "Griteide Lemos", email: "griteide@email.com", points: 100 },
    { id: 2, name: "Pedro Prado", email: "pedro_prado@email.com", points: 98 },
    { id: 3, name: "Igor Jaime", email: "igor.jaime@email.com", points: 95 },
    { id: 4, name: "Sara Lucia", email: "sara.lucia@email.com", points: 93 },
    { id: 5, name: "Claudio Lucas", email: "claudio.lucas@email.com", points: 90 },
    { id: 6, name: "Sara Lucia", email: "sara.lucia@email.com", points: 85 },
    { id: 7, name: "Carla Cristina", email: "carla@email.com", points: 80 },
  ];

  const goTo = (url: string) => {
        window.location.href = url;
    };
    const handleExitModule = () => {
        goTo(`/topicsmenu?classId=${classId}`);
    };

  return (
    <div className="teacher-dashboard">
      <div className="dots"></div>

      {/* Botão voltar */}
      <div className="back-button" onClick={handleExitModule}>
        <Link href="/topicsmenu">
          <ArrowBackIcon className="back-icon" />
        </Link>
      </div>

      <div className="dashboard-wrapper">
        <h1 className="dashboard-title">Dashboard Turma</h1>

        <div className="dashboard-container">
          {/* Coluna esquerda */}
          <div className="left-column">
            <div className="stats-row">
              <div className="stat-card">
                <h2>35</h2>
                <p>Alunos Cadastrados</p>
              </div>
              <div className="stat-card">
                <h2>5</h2>
                <p>Quantidade de Tópicos</p>
              </div>
              <div className="stat-card">
                <h2>120</h2>
                <p>Questões Cadastradas</p>
              </div>
              <div className="stat-card">
                <h2>50</h2>
                <p>Conteúdos da Turma</p>
              </div>
            </div>

            {/* Progresso */}
            <div className="progress-card">
              <div className="progress-header">
                <h2>Progresso</h2>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="date-picker-container">
                    <DatePicker
                      label="Início"
                      value={dateRange[0]}
                      onChange={(newValue) =>
                        setDateRange([newValue, dateRange[1]])
                      }
                    />
                    <DatePicker
                      label="Fim"
                      value={dateRange[1]}
                      onChange={(newValue) =>
                        setDateRange([dateRange[0], newValue])
                      }
                    />
                  </div>
                </LocalizationProvider>
              </div>
              <div className="progress-body">
                <p>
                  Quantidade de questões acertadas na primeira tentativa por
                  tópico
                </p>
              </div>
            </div>
          </div>

          {/* Coluna direita */}
          <div className="right-column">
            <div className="ranking-card">
              <div className="ranking-header">
                <h2>Ranking da turma</h2>
                <p>
                  {dateRange[0]?.format("DD/MM/YYYY")} -{" "}
                  {dateRange[1]?.format("DD/MM/YYYY")}
                </p>
              </div>

              {/* Ranking scrollável */}
              <div className="ranking-list">
                {students.map((student, index) => (
                  <div key={student.id} className="ranking-item">
                    <div>
                      <span className="ranking-position">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="ranking-name">{student.name}</span>
                      <p className="ranking-email">{student.email}</p>
                    </div>
                    <div className="ranking-stats">
                      <p>Pontos: {student.points}</p>
                      <p>Questões feitas: 30</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankClassTeacher;
