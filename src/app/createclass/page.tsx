"use client";
import React, { useState, useEffect } from "react";
import "./createclass.css";
import Router from "next/router";

// Interface para Estudantes
interface Student {
  name: string;
  email: string;
}

type Question = {
  id: number;
  description: string;
  options: { text: string; isCorrect: boolean }[];
}

// Interface para o Popup de Estudantes
interface StudentPopupProps {
  students: Student[];
  onClose: () => void;
}

type ModalProps = {
  message: string;
  onClose: () => void;
}

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
interface MaterialProps {
  topics: string[];
  onAddTopic: (topic: string) => void;
  onClose: () => void;
}

const Material: React.FC<MaterialProps> = ({ topics, onAddTopic, onClose }) => {
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

const CreateClassroomPage: React.FC = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [curriculums, setCurriculums] = useState<{ 
      curriculumId: number;
      name: string;
      description: string;
      curriculumTopics: any[];
    }[]>([]);
  const [loadingCurriculums, setLoadingCurriculums] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students] = useState<Student[]>([
    { name: "João Silva", email: "joao.silva@email.com" },
    { name: "Maria Oliveira", email: "maria.oliveira@email.com" }
  ]);
  const [topicTitle, setTopicTitle] = useState<string>("");
  const [topicDescription, setTopicDescription] = useState<string>("");
  const [material, setMaterial] = useState<File | null>(null);
  const [materialLink, setMaterialLink] = useState<string>("");
  const [questionDescription, setQuestionDescription] = useState<string>("");
  const [options, setOptions] = useState([{ text: "", isCorrect: false }]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [showQuestionPopup, setShowQuestionPopup] = useState(false);
  const [showImportMaterial, setShowImportMaterial] = useState(false);

  const handleOpenQuestionPopup = () => setShowQuestionPopup(true);
  const handleCloseQuestionPopup = () => setShowQuestionPopup(false);
  const handleOpenImportMaterial = () => setShowImportMaterial(true);
  const handleCloseImportMaterial = () => setShowImportMaterial(false);

  const [topicsList] = useState<string[]>([
    "Matemática", 
    "História", 
    "Geografia", 
    "Física", 
    "Química"
  ]);
  const [topics, setTopics] = useState<string[]>([]);
  const [showMaterial, setShowMaterial] = useState(false);

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

  useEffect(() => {
    const fetchCurriculums = async () => {
      const token = localStorage.getItem("accessToken"); 
      if (!token) {
        console.error("Token não encontrado");
        return;
      }

      try {
        const response = await fetch("http://localhost:8081/api/curriculums", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        });
        if (!response.ok) throw new Error("Erro ao buscar currículos.");
        const data = await response.json();
        setCurriculums(data);
      } catch (err) {
        setError("Erro ao carregar currículos.");
      } finally {
        setLoadingCurriculums(false);
      }
    };

    fetchCurriculums();
  }, []);

  const handleAddTopic = (newTopic: string) => {
    setTopics((prevTopics) => [...prevTopics, newTopic]);
  };

  const QuestionPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [questionDescription, setQuestionDescription] = useState("");
    const [options, setOptions] = useState([{ text: "", isCorrect: false }]);
  
    const handleAddOption = () => {
      setOptions([...options, { text: "", isCorrect: false }]);
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
  
    const handleAddQuestion = () => {
      console.log("Nova Questão:", { questionDescription, options });
      onClose(); // Fecha o popup após adicionar a questão
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Adicionar Questão</h2>
  
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
          <button type="button" className="add-button" onClick={handleAddQuestion}>Salvar Questão</button>
          <button type="button" className="close-button" onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  };

  const ImportMaterial: React.FC<{ 
    onClose: () => void; 
    material: File | null; 
    setMaterial: (file: File | null) => void;
    materialLink: string;
    setMaterialLink: (link: string) => void;
  }> = ({ onClose, material, setMaterial, materialLink, setMaterialLink }) => {
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMaterial(e.target.files ? e.target.files[0] : null);
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Importar Tópicos</h2>
  
          <label htmlFor="import-material" className="label">Importar Material</label>
          <input
            type="file"
            id="import-material"
            className="input"
            onChange={handleFileChange}
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
  
          <button type="button" className="add-button" onClick={onClose}>Salvar</button>
          <button type="button" className="close-button" onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  };
  
  

  return (
    <div className="createclass-container">
  <div className="stars"></div>
  <img src="/assets/image9.png" alt="Planeta Terra" className="planet-earth" />
  <img src="/assets/image8.png" alt="Planeta" className="planet-upper-right" />

  <h1 className="title">Fábrica de Classes</h1>

  <form className="createclass-form">
    <div className="form-content">
      {/* Primeira coluna */}
      <div className="form-column">
      <div className="curriculum-course-container">
        {/* Seção de Curriculum */}
        <div className="curriculum-section">
          <label className="label">Curriculum <span className="required">*</span></label>
          <div className="dropdown-list">
            {["Curriculum 1", "Curriculum 2", "Curriculum 3", "Curriculum 4", "Curriculum 5"].map(item => (
              <li 
                key={item} 
                onClick={() => setSelectedCurriculum (item)} 
                className={selectedCurriculum  === item ? "selected" : ""}
              >
                {item}
              </li>
            ))}
          </div>
          {/*<div className="dropdown-list">
            {loadingCurriculums ? (
              <p>Carregando currículos...</p>
            ) : (
              <ul>
                {curriculums.map((curriculum) => (
                  <li
                    key={curriculum.curriculumId}
                    onClick={() => setSelectedCurriculum(curriculum.name)}
                    className={selectedCurriculum === curriculum.name ? "selected" : ""}
                  >
                    {curriculum.name}
                  </li>
                ))}
              </ul>
            )}
          </div>*/}
        </div>

        {/* Seção de Curso */}
        <div className="course-section">
          <label className="label">Curso <span className="required">*</span></label>
          <div className="dropdown-list">
            {["Curso 1", "Curso 2", "Curso 3", "Curso 4", "Curso 5"].map(item => (
              <li 
                key={item} 
                onClick={() => setSelectedCourse(item)} 
                className={selectedCourse === item ? "selected" : ""}
              >
                {item}
              </li>
            ))}
          </div>
        </div>
      </div>
        <label className="label">Classe</label>
        <input type="text" className="input" placeholder="Nome da Classe" />

        <label className="label">Descrição</label>
        <input type="text" className="input" placeholder="Descrição da Classe" />

        <label className="label">Adicionar Alunos</label>
        <div className="import-group">
          <input type="text" className="input" placeholder="Adicionar alunos" />
          <button type="button" className="add-button" onClick={() => setShowPopup(true)}>+</button>
        </div>
      </div>

      {/* Segunda coluna */}
      <div className="form-column">
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

        <div className="button-group">
          <button type="button" className="import-button" onClick={handleOpenImportMaterial}>
            Importar Tópico
          </button>
          <button type="button" className="material-button" onClick={handleOpenImportMaterial}>
            Importar Material
          </button>
          <button type="button" className="add-question-button" onClick={handleOpenQuestionPopup}>
            Adicionar Questão
          </button>
        </div>


        {/*<label htmlFor="import-material" className="label">Importar Material</label>
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
        </button>*/}

        <div className="question-list-scrollable">
          <h2>Lista de Questões</h2>
          {questions.length === 0 ? (
            <p>Nenhuma questão adicionada ainda.</p>
          ) : (
            <ol>
              {questions.map((question, index) => (
                <li key={question.id} 
                    onClick={() => handleEditQuestion(question)}
                    style={{ 
                      cursor: "pointer", 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      padding: "10px 0"
                    }}>
                  <span>Questão {index + 1}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(question.id); }} 
                          style={{ 
                            background: "red", 
                            color: "white", 
                            border: "none", 
                            padding: "5px 10px", 
                            cursor: "pointer" 
                          }}>
                    Excluir
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

      </div>
    </div>

    {/* Botões abaixo das colunas */}
    <div className="form-actions">
      <button type="button" className="cancel-button" onClick={() => Router.back()}>Voltar</button>
      <button type="submit" className="submit-button" onClick={() => Router.push("/topicsprofile")}>Avançar</button>
      <button type="button" className="cancel-button" onClick={() => Router.push("/profile")}>Cancelar</button>
    </div>
  </form>

  {showPopup && <StudentPopup students={students} onClose={() => setShowPopup(false)} />}
  {showQuestionPopup && <QuestionPopup onClose={handleCloseQuestionPopup} />}
  {showImportMaterial && (<ImportMaterial onClose={handleCloseImportMaterial} material={material} setMaterial={setMaterial} materialLink={materialLink} setMaterialLink={setMaterialLink} />)}
</div>

  );
};

export default CreateClassroomPage;
