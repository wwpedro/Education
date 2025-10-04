"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./rankingstudent.css";

interface Student {
    id: number;
    name: string;
    email: string;
    points: number;
    spaceship: string;
}

const RankStudentPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const classId = searchParams.get('classId') || '1';

    const [students] = useState<Student[]>([
        { id: 1, name: "Igor", email: "igor@email.com", points: 120, spaceship: "/assets/redship.png" },
        { id: 2, name: "Griteide", email: "griteide@email.com", points: 130, spaceship: "/assets/greenship.png" },
        { id: 3, name: "Pedro", email: "pedro@email.com", points: 110, spaceship: "/assets/blueship.png" },
        { id: 4, name: "Sara Lucia", email: "sara.lucia@email.com", points: 100, spaceship: "/assets/default.png" },
        { id: 5, name: "Claudio Lucas", email: "claudio.lucas@email.com", points: 98, spaceship: "/assets/default.png" },
        { id: 6, name: "Antony Vinicius", email: "antony.v123@email.com", points: 95, spaceship: "/assets/default.png" },
        { id: 7, name: "Antony Vinicius", email: "antony.v123@email.com", points: 95, spaceship: "/assets/default.png" },
        { id: 8, name: "Antony Vinicius", email: "antony.v123@email.com", points: 95, spaceship: "/assets/default.png" },
        { id: 9, name: "Antony Vinicius", email: "antony.v123@email.com", points: 95, spaceship: "/assets/default.png" },
        { id: 10, name: "Antony Vinicius", email: "antony.v123@email.com", points: 95, spaceship: "/assets/default.png" },
        { id: 11, name: "Antony Vinicius", email: "antony.v123@email.com", points: 95, spaceship: "/assets/default.png" },
        { id: 12, name: "Antony Vinicius", email: "antony.v123@email.com", points: 95, spaceship: "/assets/default.png" },
        { id: 13, name: "Antony Vinicius", email: "antony.v123@email.com", points: 95, spaceship: "/assets/default.png" },
        { id: 14, name: "Antony Vinicius", email: "antony.v123@email.com", points: 95, spaceship: "/assets/default.png" },
        { id: 15, name: "Antony Vinicius", email: "antony.v123@email.com", points: 95, spaceship: "/assets/default.png" },
        { id: 16, name: "Antony Vinicius", email: "antony.v123@email.com", points: 95, spaceship: "/assets/default.png" },
    ]);

    const [dots, setDots] = useState<{ top: number; left: number; size: number; delay: number }[]>([]);

    useEffect(() => {
        const dotsContainer = document.querySelector(".dots");
        if (!dotsContainer) return;

        const totalDots = 100; // Quantidade de pontinhos
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement("div");
            dot.classList.add("dot");

            // Posições aleatórias
            dot.style.top = `${Math.random() * 100}%`;
            dot.style.left = `${Math.random() * 100}%`;

            // Tamanhos aleatórios
            const size = Math.random() * 2 + 1; // Entre 1px e 3px
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;

            // Atraso de animação aleatório
            dot.style.animationDelay = `${Math.random() * 5}s`;

            // Adiciona o ponto ao contêiner
            dotsContainer.appendChild(dot);
        }
    }, []);

    // Ordenar pelo maior ponto
    const sortedStudents = [...students].sort((a, b) => b.points - a.points);
    const goTo = (url: string) => {
        window.location.href = url;
    };
    const handleExitModule = () => {
        goTo(`/topicsmenu?classId=${classId}`);
    };

    // Top 3 do pódio
    const podium = sortedStudents.slice(0, 3);
    const others = sortedStudents.slice(3);

    // Datas da semana atual (segunda a sexta)
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay() + 1); // segunda
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 4); // sexta

    const formatDate = (date: Date) =>
        date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

    return (
        <div className="rank-background">
            <div className="dots"></div>

            {/* botão voltar */}
            <div className="back-button" onClick={handleExitModule}>
                <Link href="/topicsmenu">
                    <ArrowBackIcon className="back-icon" />
                </Link>
            </div>

            {/* título */}
            <h1 className="rank-title">Ranking Semanal da Turma</h1>
            <p className="rank-subtitle">
                {formatDate(firstDay)} - {formatDate(lastDay)}
            </p>

            {/* pódio */}
            <div className="podium">
                {podium.map((student, index) => (
                    <div key={student.id} className={`podium-slot podium-${index + 1}`}>
                        <img src={student.spaceship} alt={student.name} className="podium-ship" />
                        <p className="podium-name">{student.name}</p>
                        <p className="podium-points">Pontos: {student.points}</p>
                    </div>
                ))}
            </div>

            {/* lista de alunos */}
            <h2 className="list-title">Lista de Alunos</h2>
            <p className="list-subtitle">Data Atual: {formatDate(today)}</p>
            <div className="students-list">
                {others.map((student, index) => (
                    <div
                        key={student.id}
                        className={`student-card ${index === others.length - 1 ? "last" : ""}`}
                    >
                        <div className="student-info">
                            <p className="student-name">{student.name}</p>
                            <p className="student-email">{student.email}</p>
                        </div>
                        <div className="student-stats">
                            <p>Pontos: {student.points}</p>
                            <p>Questões feitas: 30</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RankStudentPage;
