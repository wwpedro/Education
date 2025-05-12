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
  <div className="modal-overlay">
    <div className="modal-content">
      <p>{message}</p>
      <button className="modal-close-btn" onClick={onClose}>Fechar</button>
    </div>
  </div>
);


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
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
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
  const [classId, setClassId] = useState<number | null>(null);
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
  const [savedMaterials, setSavedMaterials] = useState<string[]>([]);
  const [showImportTopic, setShowImportTopic] = useState(false);
  const [savedTopics, setSavedTopics] = useState<string[]>([]);
  const [classTitle, setClassTitle] = useState(""); // Nome da turma
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null); // ID do curso

  const handleOpenImportTopic = () => setShowImportTopic(true);
  const handleCloseImportTopic = () => setShowImportTopic(false);
  const handleOpenQuestionPopup = () => setShowQuestionPopup(true);
  const handleCloseQuestionPopup = () => setShowQuestionPopup(false);
  const handleOpenImportMaterial = () => setShowImportMaterial(true);
  const handleCloseImportMaterial = () => setShowImportMaterial(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Token não encontrado");
        return;
      }

      try {
        const response = await fetch("http://localhost:8081/api/courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Erro ${response.status}: ${text}`);
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setError("Erro ao carregar cursos.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);


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

  // Editar questão ao clicar na lista
  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id);
    setQuestionDescription(question.description);
    setOptions(question.options);
  };

  // Excluir questão
  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

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
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Erro ${response.status}: ${text}`);
        }

        const data = await response.json();

        // Filtra ou transforma os dados se necessário
        setCurriculums(data);
      } catch (err) {
        console.error("Erro ao buscar currículos:", err);
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

  const QuestionPopup: React.FC<{ onClose: () => void; questions: Question[]; setQuestions: (questions: Question[]) => void; }> = ({ onClose, questions, setQuestions }) => {
    const [questionDescription, setQuestionDescription] = useState("");
    const [options, setOptions] = useState([{ text: "", isCorrect: false }]);
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

    // Adicionar nova alternativa
    const handleAddOption = () => {
      setOptions([...options, { text: "", isCorrect: false }]);
    };

    // Alterar texto ou checkbox da alternativa
    const handleOptionChange = (index: number, field: "text" | "isCorrect", value: string | boolean) => {
      const updatedOptions = [...options];
      if (field === "text") {
        updatedOptions[index].text = value as string;
      } else {
        updatedOptions[index].isCorrect = value as boolean;
      }
      setOptions(updatedOptions);
    };

    // Criar ou editar questão
    const handleCreateOrUpdateQuestion = () => {
      if (questionDescription.trim() === "") return; // Evita salvar questões vazias

      if (editingQuestionId !== null) {
        // Edita a questão existente
        setQuestions(questions.map(q =>
          q.id === editingQuestionId ? { ...q, description: questionDescription, options: [...options] } : q
        ));
        setEditingQuestionId(null);
      } else {
        // Cria uma nova questão
        const newQuestion: Question = {
          id: Date.now(),
          description: questionDescription,
          options: [...options],
        };
        setQuestions([...questions, newQuestion]);
      }

      setQuestionDescription("");
      setOptions([{ text: "", isCorrect: false }]);
    };

    // Editar questão ao clicar na lista
    const handleEditQuestion = (question: Question) => {
      setEditingQuestionId(question.id);
      setQuestionDescription(question.description);
      setOptions(question.options);
    };

    // Excluir questão
    const handleDeleteQuestion = (id: number) => {
      setQuestions(questions.filter(question => question.id !== id));
    };

    return (
      <div className="modal-overlay">
        <div id="question-modal">
          {/* Botão de fechar no canto superior esquerdo */}
          <button type="button" className="close-button" onClick={onClose}>✖</button>

          <h2>Adicionar Questão</h2>

          <div id="question-modal-body">
            {/* Coluna esquerda - Formulário */}
            <div id="question-form">
              <label htmlFor="question-description" className="label">Descrição da Questão</label>
              <textarea
                id="question-description"
                className="input"
                value={questionDescription}
                onChange={(e) => setQuestionDescription(e.target.value)}
                placeholder="Descrição da Questão"
              ></textarea>

              <label className="label">Alternativas</label>
              <div className="options-container">
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
              </div>

              {/* Botões lado a lado com espaçamento */}
              <div id="triple-button-group">
                <button type="button" className="plus-button" onClick={handleAddOption}>Adicionar Alternativa</button>
                <button type="button" className="plus-button" onClick={handleCreateOrUpdateQuestion}>
                  {editingQuestionId !== null ? "Salvar Alterações" : "Criar Questão"}
                </button>
              </div>
            </div>

            {/* Coluna direita - Lista de Questões */}
            <div id="question-list">
              <h3>Questões Salvas</h3>
              {questions.length === 0 ? (
                <p>Nenhuma questão adicionada ainda.</p>
              ) : (
                <ul>
                  {questions.map((question, index) => (
                    <li
                      key={question.id}
                      className={`question-item ${editingQuestionId === question.id ? "selected-question" : ""}`}
                      onClick={() => handleEditQuestion(question)}
                    >
                      <strong>Questão {index + 1}</strong>
                      <button className="delete-question-button" onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(question.id); }}>🗑</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Botão Salvar Questões (mantém o estado e não fecha o pop-up) */}
          <div id="question-modal-footer">
            <button type="button" id="save-question-button" onClick={onClose}>
              Salvar Questões
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Adicione isso dentro do componente CreateClassroomPage

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8081/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setAllStudents(data);
      } catch (error) {
        console.error("Erro ao buscar alunos", error);
      }
    };

    fetchStudents();
  }, []);


  const handleAddStudent = (student: Student) => {
    if (!selectedStudents.find(s => s.email === student.email)) {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleRemoveStudent = (email: string) => {
    setSelectedStudents(selectedStudents.filter(s => s.email !== email));
  };

  const handleAddAll = () => {
    setSelectedStudents(allStudents);
  };

  const handleRemoveAll = () => {
    setSelectedStudents([]);
  };

  const saveStudentList = () => {
    if (selectedStudents.length === 0) {
      alert("Selecione pelo menos um aluno.");
      return;
    }

    // Fecha o modal e mantém os alunos no estado
    setShowPopup(false);
    alert("Alunos selecionados e salvos localmente para a turma.");
  };


  // Substitua o StudentPopup existente por:

  const StudentPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>Gerenciar Alunos da Turma</h2>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div>
            <h3>Todos os Alunos</h3>
            <button onClick={handleAddAll}>Adicionar todos</button>
            <ul>
              {allStudents.map((student, i) => (
                <li key={i}>
                  {student.name} - {student.email}
                  <button onClick={() => handleAddStudent(student)}>+</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Alunos da Turma</h3>
            <button onClick={handleRemoveAll}>Remover todos</button>
            <ul>
              {selectedStudents.map((student, i) => (
                <li key={i}>
                  {student.name}
                  <button onClick={() => handleRemoveStudent(student.email)}>x</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="center-button">
          <button className="save-button" onClick={saveStudentList}>Salvar Alunos da Turma</button>
        </div>
      </div>
    </div>
  );

  const ImportMaterial: React.FC<{
    onClose: () => void;
    material: File | null;
    setMaterial: (file: File | null) => void;
    materialLink: string;
    setMaterialLink: (link: string) => void;
    savedMaterials: string[];
    setSavedMaterials: (materials: string[]) => void;
  }> = ({ onClose, material, setMaterial, materialLink, setMaterialLink, savedMaterials, setSavedMaterials }) => {

    const [previewFile, setPreviewFile] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Adiciona material à lista ao salvar
    const handleSaveMaterial = () => {
      if (materialLink.trim() !== "") {
        setSavedMaterials([...savedMaterials, materialLink]);
        setMaterialLink(""); // Limpa o campo após salvar
      } else if (material) {
        const fileUrl = URL.createObjectURL(material); // Cria um link temporário para o arquivo
        setSavedMaterials([...savedMaterials, fileUrl]);
        setMaterial(null); // Limpa o arquivo após salvar
      }
    };

    const truncateFileName = (name: string, maxLength = 20) => {
      return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      setMaterial(file);
    };

    // Remove um material da lista
    const handleDeleteMaterial = (index: number) => {
      const updatedMaterials = savedMaterials.filter((_, i) => i !== index);
      setSavedMaterials(updatedMaterials);
    };

    // Limita o título do material a 10 caracteres
    const truncateTitle = (title: string) => (title.length > 10 ? title.substring(0, 10) + "..." : title);

    // Verifica se um material é um link externo
    const isLink = (item: string) => item.startsWith("http");

    // Abre a pré-visualização de um arquivo PDF
    const handlePreviewFile = (fileUrl: string) => {
      setPreviewUrl(fileUrl);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {/* Botão de fechar no canto superior direito */}
          <button type="button" className="close-button" onClick={onClose}>✖</button>

          <h1>Importar Materiais</h1>

          {/* Input de arquivo customizado */}
          <div className="file-input-container">
            <label htmlFor="import-material" className="file-label">Selecionar Arquivo</label>
            <input
              type="file"
              id="import-material"
              className="file-input"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <span className="file-name">
              {material ? truncateFileName(material.name) : "Clique para escolher um arquivo"}
            </span>
          </div>

          <label htmlFor="material-link" className="label">Link do Material</label>
          <input
            type="url"
            id="material-link"
            className="input"
            value={materialLink}
            onChange={(e) => setMaterialLink(e.target.value)}
            placeholder="https://exemplo.com"
          />

          <button type="button" className="plus-button" onClick={handleSaveMaterial}>Adicionar Material à Lista</button>

          {/* Lista de Materiais Salvos */}
          <div className="material-list">
            <h3>Materiais Salvos</h3>
            {savedMaterials.length === 0 ? (
              <p className="empty-message">Ainda não temos nenhum material na lista.</p>
            ) : (
              <ul>
                {savedMaterials.map((item, index) => (
                  <li key={index} className="material-item">
                    {isLink(item) ? (
                      <a href={item} target="_blank" rel="noopener noreferrer">{truncateTitle(item)}</a>
                    ) : (
                      <span className="file-preview" onClick={() => handlePreviewFile(item)}>{truncateTitle(item)}</span>
                    )}
                    <button className="delete-button" onClick={() => handleDeleteMaterial(index)}>🗑</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="plus-button" onClick={handleSaveMaterial}>Salvar</button>
          </div>
        </div>

        {/* Pop-up de Pré-visualização do PDF */}
        {previewUrl && (
          <div className="modal-overlay">
            <div className="modal-content preview-modal">
              <button type="button" className="close-button" onClick={() => setPreviewUrl(null)}>✖</button>
              <h3>Pré-visualização do PDF</h3>
              <iframe src={previewUrl} className="pdf-preview"></iframe>
            </div>
          </div>
        )}
      </div>
    );
  };



  const ImportTopicPopup: React.FC<{
    onClose: () => void;
    savedTopics: string[];
    setSavedTopics: (topics: string[]) => void;
  }> = ({ onClose, savedTopics, setSavedTopics }) => {

    const [topicFile, setTopicFile] = useState<File | null>(null);
    const [topicName, setTopicName] = useState("");

    // Trunca o nome do arquivo caso seja muito grande
    const truncateFileName = (name: string, maxLength = 20) => {
      return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
    };

    // Atualiza o estado ao selecionar um arquivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      setTopicFile(file);
    };

    // Adiciona um novo tópico à lista
    const handleAddTopic = () => {
      if (topicName.trim() !== "") {
        setSavedTopics([...savedTopics, topicName]);
        setTopicName("");
      }
    };
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {/* Botão de fechar no canto superior direito */}
          <button type="button" className="close-button" onClick={onClose}>✖</button>

          <h2>Importar Tópico</h2>

          {/* Input de arquivo customizado */}
          <div className="file-input-container">
            <label htmlFor="import-topic" className="file-label">Selecionar Arquivo</label>
            <input
              type="file"
              id="import-topic"
              className="file-input"
              accept=".txt,.csv,.json"
              onChange={handleFileChange}
            />
            <span className="file-name">
              {topicFile ? truncateFileName(topicFile.name) : "Clique para escolher um arquivo"}
            </span>
          </div>


          <button type="button" className="plus-button" onClick={handleAddTopic}>Adicionar Tópico</button>


          {/* Lista de Tópicos Salvos */}
          <div className="topic-list">
            <h3>Tópicos Salvos</h3>
            {savedTopics.length === 0 ? (
              <p className="empty-message">Ainda não temos nenhum tópico na lista.</p>
            ) : (
              <ul>
                {savedTopics.map((item, index) => (
                  <li key={index} className="topic-item">
                    <span>{item}</span>
                    <button className="delete-button" onClick={() => handleDeleteTopic(index)}>🗑</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="plus-button">Salvar</button>
          </div>
        </div>
      </div>
    );
  };

  const [topicList, setTopicList] = useState<{ title: string; description: string; questions: Question[]; materials: string[] }[]>([]);
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null);

  const handleAddOrEditTopic = () => {
    if (!topicTitle.trim() || !topicDescription.trim()) {
      alert("Preencha o título e a descrição do tópico.");
      return;
    }

    const newTopic = {
      title: topicTitle,
      description: topicDescription,
      questions: [...questions],
      materials: [...savedMaterials],
    };

    if (editingTopicIndex !== null) {
      const updated = [...topicList];
      updated[editingTopicIndex] = newTopic;
      setTopicList(updated);
      setEditingTopicIndex(null);
    } else {
      setTopicList([...topicList, newTopic]);
    }

    // Limpa os campos após adicionar/editar
    setTopicTitle("");
    setTopicDescription("");
    setQuestions([]);
    setSavedMaterials([]);
  };


  const handleEditTopic = (index: number) => {
    const topic = topicList[index];
    setTopicTitle(topic.title);
    setTopicDescription(topic.description);
    setQuestions(topic.questions);
    setSavedMaterials(topic.materials);
    setEditingTopicIndex(index);
  };

  const handleDeleteTopic = (index: number) => {
    const updatedList = [...topicList];
    updatedList.splice(index, 1);
    setTopicList(updatedList);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token || !classTitle || !selectedCourseId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      description: classTitle,
      course: {
        courseId: selectedCourseId
      }
    };

    try {
      // 1. Cria a turma
      const response = await fetch("http://localhost:8081/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json(); // recebe o classId
      const createdClassId = data.classId;

      // 2. Envia os alunos vinculados
      if (selectedStudents.length > 0) {
        const studentResponse = await fetch("http://localhost:8081/api/student-classes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            selectedStudents.map((student) => ({
              studentEmail: student.email,
              classId: createdClassId,
            }))
          ),
        });

        if (!studentResponse.ok) {
          const text = await studentResponse.text();
          throw new Error(`Erro ao adicionar alunos: ${text}`);
        }
      }

      alert("Turma e alunos criados com sucesso!");
      Router.push("/topicsprofile");
    } catch (err) {
      console.error("Erro ao criar turma ou adicionar alunos:", err);
      alert("Erro ao criar turma ou adicionar alunos. Veja o console.");
    }
  };

  return (
    <div className="classroom-container">
      <div className="stars"></div>
      <img src="/assets/image9.png" alt="Planeta Terra" className="planet-earth-img" />
      <img src="/assets/image8.png" alt="Planeta" className="planet-topright-img" />

      <h1 className="classroom-title">Fábrica de Classes</h1>

      <form className="classroom-form">
        <div className="form-grid">
          {/* Primeira coluna */}
          <div className="form-column">
            <div className="curriculum-course-container">
              {/* Seção de Curriculum */}
              <div className="curriculum-section">
                <label className="label">Curriculum <span className="required">*</span></label>
                <div className="dropdown-list curriculum-disabled">
                  <ul>
                    {curriculums.map((curriculum) => (
                      <li
                        key={curriculum.curriculumId}
                        className={selectedCurriculum === curriculum.curriculumId.toString() ? "selected" : ""}
                      >
                        {curriculum.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Seção de Curso */}
              <div className="course-section">
                <label className="label">Curso <span className="required">*</span></label>
                <div className="dropdown-list">
                  {courses.map((course) => (
                    <li
                      key={course.courseId}
                      onClick={() => {
                        setSelectedCourseId(course.courseId);
                        setSelectedCourse(course.name);

                        // Adiciona esta parte para selecionar o currículo automaticamente
                        if (course.curriculum && course.curriculum.curriculumId) {
                          setSelectedCurriculum(course.curriculum.curriculumId.toString());
                        }
                      }}
                      className={selectedCourseId === course.courseId ? "selected" : ""}
                    >
                      {course.name}
                    </li>
                  ))}

                </div>
                <button type="button" className="plus-button">Adicionar Curso</button>
              </div>
            </div>
            <label className="label">Nome da Turma <span className="required">*</span></label>
            <input
              type="text"
              className="input"
              value={classTitle}
              onChange={(e) => setClassTitle(e.target.value)}
              placeholder="Ex: Turma de Programação 2025.1"
            />

            <div className="center-button">
              <button
                type="button"
                className="alunos-button"
                onClick={() => setShowPopup(true)}
              >
                Alunos da turma
              </button>

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

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button type="button" className="material-button" onClick={handleOpenImportMaterial}>
                Importar Material
              </button>
              <button type="button" className="add-question-button" onClick={handleOpenQuestionPopup}>
                Questões Tópico
              </button>
            </div>

            <button type="button" className="add-topic-button" onClick={handleAddOrEditTopic}>
              Adicionar Tópico a Classe
            </button>

            {/* Lista dos tópicos adicionados */}
            <div className="topic-list-display">
              <label className="label">Tópicos da Turma</label>
              <ul>
                {topicList.map((topic, index) => (
                  <li key={index} className="topic-item-display">
                    {topic.title}
                    <button className="delete-button" onClick={() => handleDeleteTopic(index)}>×</button>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Botões abaixo das colunas */}
        <div className="footer-button-row">
          <button type="button" className="cancel-button" onClick={() => Router.back()}>Voltar</button>
          <button type="submit" className="submit-button" onClick={() => Router.push("/topicsprofile")}>Avançar</button>
          <button type="button" className="cancel-button" onClick={() => Router.push("/profile")}>Cancelar</button>
        </div>
      </form>

      {showImportTopic && (
        <ImportTopicPopup
          onClose={handleCloseImportTopic}
          savedTopics={savedTopics}
          setSavedTopics={setSavedTopics}
        />
      )}
      {showQuestionPopup && (
        <QuestionPopup onClose={handleCloseQuestionPopup} questions={questions} setQuestions={setQuestions} />
      )}
      {showImportMaterial && (
        <ImportMaterial
          onClose={handleCloseImportMaterial}
          material={material}
          setMaterial={setMaterial}
          materialLink={materialLink}
          setMaterialLink={setMaterialLink}
          savedMaterials={savedMaterials}
          setSavedMaterials={setSavedMaterials}
        />
      )}

      {showPopup && (
        <StudentPopup onClose={() => setShowPopup(false)} />
      )}


    </div>

  );
};

export default CreateClassroomPage;
