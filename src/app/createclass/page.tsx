"use client";
import React, { useState, useEffect } from "react";
import "./createclass.css";
import Router from "next/router";

// Interface para Estudantes
interface Student {
  name: string;
  email: string;
}

// Interface para o Popup de Estudantes
interface StudentPopupProps {
  students: Student[];
  onClose: () => void;
}

const StudentPopup: React.FC<StudentPopupProps> = ({ students, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ul className="student-list scroll-invisible">
          {students.map((student, index) => (
            <li key={index} className="student-card">
              <div className="student-info">
                <strong>{student.name}</strong>
                <small>{student.email}</small>
              </div>
              <div className="action-buttons">
                <button className="accept-button">+</button>
                <button className="reject-button">x</button>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="close-button">Salvar lista</button>
      </div>
    </div>
  );
};

// Interface para o Popup de Tópicos
interface TopicPopupProps {
  topics: string[];
  onAddTopic: (topic: string) => void;
  onClose: () => void;
}

const TopicPopup: React.FC<TopicPopupProps> = ({ topics, onAddTopic, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Lista de Tópicos</h2>
        <ul className="topic-list scroll-invisible">
          {topics.map((topic, index) => (
            <li key={index} className="topic-card">
              <div className="topic-info">
                <strong>{topic}</strong>
              </div>
              <div className="action-buttons">
                <button className="accept-button" onClick={() => onAddTopic(topic)}>+</button>
              </div>
            </li>
          ))}
        </ul>
        <button className="close-button" onClick={onClose}>Salvar Lista</button>
      </div>
    </div>
  );
};

const CreateClassroomPage = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTopics, setSelectedTopics] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students] = useState<Student[]>([
    { name: "João Silva", email: "joao.silva@email.com" },
    { name: "Maria Oliveira", email: "maria.oliveira@email.com" }
  ]);

  const [topicsList] = useState<string[]>([
    "Matemática", 
    "História", 
    "Geografia", 
    "Física", 
    "Química"
  ]);
  const [topics, setTopics] = useState<string[]>([]);
  const [showTopicPopup, setShowTopicPopup] = useState(false);


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

  const handleAddTopic = (newTopic: string) => {
    setTopics((prevTopics) => [...prevTopics, newTopic]);
  };

  return (
    <div className="createclass-container">
      <div className="stars"></div>
      <img src="/assets/image9.png" alt="Planeta Terra" className="planet-earth" />
      <img src="/assets/image8.png" alt="Planeta" className="planet-upper-right" />

      <h1 className="title">Fábrica de Turmas</h1>
      <form className="createclass-form">
        <div className="info-icon" onClick={() => setIsModalOpen(true)}>i</div><br></br>

        <label className="label">Curriculum <span className="required">*</span></label>
        <div className="dropdown-list">
          {["Curriculum 1", "Curriculum 2", "Curriculum 3", "Curriculum 4", "Curriculum 5"].map(item => (
            <li key={item} onClick={() => setSelectedCurriculum(item)} className={selectedCurriculum === item ? "selected" : ""}>{item}</li>
          ))}
        </div>

        <label className="label">Curso <span className="required">*</span></label>
        <div className="dropdown-list">
          {["Curso 1", "Curso 2", "Curso 3", "Curso 4", "Curso 5"].map(item => (
            <li key={item} onClick={() => setSelectedCourse(item)} className={selectedCourse === item ? "selected" : ""}>{item}</li>
          ))}
        </div>

        <label className="label">Turma</label>
        <input type="text" className="input" placeholder="Nome da turma" />

        <label className="label">Descrição</label>
        <input type="text" className="input" placeholder="Descrição da turma" />

        <label className="label">Adicionar Tópicos</label>
        <div className="import-group">
          <input type="text" className="input" placeholder="Adicionar Tópicos" disabled value={selectedTopics.split(", ")} />
          <button type="button" className="add-button" onClick={() => setShowTopicPopup(true)}>+</button>
        </div>

        <label className="label">Adicionar Alunos</label>
        <div className="import-group">
          <input type="text" className="input" placeholder="Adicionar alunos" />
          <button type="button" className="add-button" onClick={() => setShowPopup(true)}>+</button>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => Router.back()}>Voltar</button>
          <button type="submit" className="submit-button" onClick={() => "/topicsmenu"}>Avançar</button>
          <button type="button" className="cancel-button">Cancelar</button>
        </div>
      </form>

      {showPopup && <StudentPopup students={students} onClose={() => setShowPopup(false)} />}
      {showTopicPopup && (
        <TopicPopup
          topics={topicsList}
          onAddTopic={handleAddTopic}
          onClose={() => setShowTopicPopup(false)}
        />
      )}
    </div>
  );
};

export default CreateClassroomPage;
