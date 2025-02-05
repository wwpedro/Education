"use client";
import React, { useEffect, useState } from "react";
import "./createtopic.css";
import Link from "next/link";
import Router from "next/router";

type Question = {
  id: number;
  description: string;
  options: { text: string; isCorrect: boolean }[];
};

type ModalProps = {
  message: string;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ message, onClose }) => (
  <div className="modal-overlay" style={modalOverlayStyle}>
    <div className="modal-content" style={modalContentStyle}>
      <p>{message}</p>
      <button onClick={onClose} style={buttonStyle}>Fechar</button>
    </div>
  </div>
);

const modalOverlayStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
  textAlign: "center" as const,
  maxWidth: "300px",
  width: "100%",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "8px 16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};


const CreateTopicPage: React.FC = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("");
  const [topicTitle, setTopicTitle] = useState<string>("");
  const [topicDescription, setTopicDescription] = useState<string>("");
  const [material, setMaterial] = useState<File | null>(null);
  const [materialLink, setMaterialLink] = useState<string>("");
  const [questionDescription, setQuestionDescription] = useState<string>("");
  const [options, setOptions] = useState([{ text: "", isCorrect: false }]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddQuestion = () => {
    if (editingQuestionId !== null) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === editingQuestionId ? { ...q, description: questionDescription, options: [...options] } : q
        )
      );
      setEditingQuestionId(null);
    } else {
      const newQuestion: Question = {
        id: questions.length + 1,
        description: questionDescription,
        options: [...options],
      };
      setQuestions([...questions, newQuestion]);
    }
    setQuestionDescription("");
    setOptions([{ text: "", isCorrect: false }]);
  };

  const handleOptionChange = (index: number, field: "text" | "isCorrect", value: string | boolean) => {
    const updatedOptions = [...options];
    if (field === "text") {
      updatedOptions[index].text = value as string;
    } else {
      updatedOptions[index].isCorrect = value as boolean;
    }
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id);
    setQuestionDescription(question.description);
    setOptions(question.options);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

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

  const handleSaveAndAdvance = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLButtonElement>) => {
    if (topicTitle.trim() === "") {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  return (
    <div className="createclass-container">
      <div className="stars"></div>
      <img src="/assets/image9.png" alt="Planeta Terra" className="planet-earth" />
      <img src="/assets/image8.png" alt="Planeta" className="planet-upper-right" />

      <h1 className="title">Fábrica de Tópicos</h1>
      <form className="createclass-form">
        

        <label htmlFor="topic-title" className="label">Título do Tópico</label>
        <input
          type="text"
          id="topic-title"
          className="input"
          value={topicTitle}
          onChange={(e) => setTopicTitle(e.target.value)}
          placeholder="Título do Tópico"
        />

        <label htmlFor="topic-description" className="label">Descrição do Tópico</label>
        <textarea
          id="topic-description"
          className="input"
          value={topicDescription}
          onChange={(e) => setTopicDescription(e.target.value)}
          placeholder="Descrição do Tópico"
        ></textarea>

        <label htmlFor="import-material" className="label">Importar Material</label>
        <input
          type="file"
          id="import-material"
          className="input"
          onChange={(e) => setMaterial(e.target.files ? e.target.files[0] : null)}
        />

        <label htmlFor="material-link" className="label">Link do Material</label>
        <input
          type="url"
          id="material-link"
          className="input"
          value={materialLink}
          onChange={(e) => setMaterialLink(e.target.value)}
          placeholder="https://exemplo.com"
        />

        <label htmlFor="question-description" className="label">Descrição da Questão</label>
        <textarea
          id="question-description"
          className="input"
          value={questionDescription}
          onChange={(e) => setQuestionDescription(e.target.value)}
          placeholder="Descrição da Questão"
        ></textarea>

        <label className="label">Alternativas</label>
        {options.map((option, index) => (
          <div key={index} className="import-group">
            <input
              type="text"
              className="input"
              placeholder={`Alternativa ${index + 1}`}
              value={option.text}
              onChange={(e) => handleOptionChange(index, "text", e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={option.isCorrect}
                onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
              />
              Correta
            </label>
          </div>
        ))}

        <button type="button" className="add-button" onClick={handleAddOption}>Adicionar Alternativa</button>
        <button type="button" className="add-button" onClick={handleAddQuestion}>
          {editingQuestionId !== null ? "Salvar Alterações" : "Adicionar Questão"}
        </button>

        <div className="question-list-scrollable" style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginTop: "20px", color: "black" }}>
          <h2>Lista de Questões</h2>
          {questions.length === 0 ? (
            <p>Nenhuma questão adicionada ainda.</p>
          ) : (
            <ol>
              {questions.map((question, index) => (
                <li key={question.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span onClick={() => handleEditQuestion(question)} style={{ cursor: "pointer" }}>
                    Questão {index + 1}
                  </span>
                  <button onClick={() => handleDeleteQuestion(question.id)} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>Excluir</button>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="form-actions">
          
            <button type="submit" className="submit-button" onClick={() => {
              Router.push("/createcourse");
              handleSaveAndAdvance;
            }}>Salvar e Avançar</button>

          <button type="button" className="cancel-button" onClick={() => Router.push("/profile")}>Cancelar</button>
        </div>
      </form>

      {isModalOpen && <Modal message="O título do tópico não deve ficar vazio." onClose={() => setIsModalOpen(false)} />}

    </div>
  );
};

export default CreateTopicPage;
