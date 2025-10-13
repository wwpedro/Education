"use client";
import React, { useState, useEffect, Suspense } from "react";
import "./createclass.css";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import ImportMaterial from "./ImportMaterial";
import SelectCourse from "./SelectCourse";
import ClassStudents from "./ClassStudents";


// Interface para Estudantes
interface Student {
  id: number;
  name: string;
  email: string;
}

type Question = {
  id: number;
  content: string;
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

const CreateClassroomContent: React.FC = () => {
  const router = useRouter();
  const [materialTitle, setMaterialTitle] = useState<string>("");
  const searchParams = useSearchParams(); // 👈 aqui dentro
  const classIdFromParams = searchParams.get("classId");
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
  const [curriculumTopics, setCurriculumTopics] = useState<string[]>([]);
  const [loadingCurriculums, setLoadingCurriculums] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classId, setClassId] = useState<number | null>(null);
  const [topicTitle, setTopicTitle] = useState<string>("");
  const [topicDescription, setTopicDescription] = useState<string>("");
  const [materials, setMaterials] = useState<File[] | null>(null);
  const [materialLink, setMaterialLink] = useState<string>("");
  const [questionDescription, setQuestionDescription] = useState<string>("");
  const [options, setOptions] = useState([{ text: "", isCorrect: false }]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [showQuestionPopup, setShowQuestionPopup] = useState(false);
  const [showImportMaterial, setShowImportMaterial] = useState(false);
  const [savedMaterials, setSavedMaterials] = useState<{ id?: number; title: string; url: string }[]>([]);
  const [showImportTopic, setShowImportTopic] = useState(false);
  const [savedTopics, setSavedTopics] = useState<string[]>([]);
  const [classTitle, setClassTitle] = useState(""); // Nome da turma
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null); // ID do curso
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(null);

  const goTo = (url: string) => {
    window.location.href = url;
  };

  const handleOpenImportTopic = () => setShowImportTopic(true);
  const handleCloseImportTopic = () => setShowImportTopic(false);
  const handleOpenQuestionPopup = () => setShowQuestionPopup(true);
  const handleCloseQuestionPopup = () => setShowQuestionPopup(false);
  const handleOpenImportMaterial = () => setShowImportMaterial(true);
  const handleCloseImportMaterial = () => setShowImportMaterial(false);

  const fetchClassStudents = async (classId: number, token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/student-classes/class/${classId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar alunos da turma");

      const students = await res.json();
      setSelectedStudents(students); // preenche a lista de alunos no lado direito do popup
    } catch (err) {
      console.error("Erro ao buscar alunos da turma:", err);
    }
  };

  useEffect(() => {
    const fetchClassData = async () => {
      const token = localStorage.getItem("accessToken");
      const search = searchParams.get("classId");
      if (!token || !search) return;

      const classIdNumber = parseInt(search);
      setClassId(classIdNumber);

      try {
        // Buscar dados da turma
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/classes/${classIdNumber}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar dados da turma");
        const data = await response.json();

        // Preencher título da turma e curso selecionado
        setClassTitle(data.description);
        await handleSelectCourse(data.course);

        // Buscar alunos da turma
        await fetchClassStudents(classIdNumber, token);

      } catch (err) {
        console.error("Erro ao carregar turma:", err);
      }
    };

    fetchClassData();
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
        content: questionDescription,
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
    if (editingQuestionId === question.id) {
      // Se já está editando a mesma, desmarca
      setEditingQuestionId(null);
      setQuestionDescription("");
      setOptions([{ text: "", isCorrect: false }]);
      return;
    }

    // Caso contrário, seleciona para editar
    setEditingQuestionId(question.id);
    setQuestionDescription(question.content);

    const mappedOptions = (question.options || []).map((opt: any) => ({
      text: opt.text || "",
      isCorrect: opt.isCorrect !== undefined ? opt.isCorrect : opt.correct === true
    }));

    setOptions(mappedOptions);
  };

  // Excluir questão
  const handleDeleteQuestion = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/questions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erro ao excluir questão: ${text}`);
      }

      // Se deu certo no backend, remove do estado local também:
      setQuestions(questions.filter((question) => question.id !== id));
      alert("Questão deletada com sucesso!");

    } catch (error) {
      console.error("Erro ao deletar questão:", error);
      alert("Erro ao deletar questão. Veja o console.");
    }
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
    const fetchCourses = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Token não encontrado");
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/courses`, {
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
        setCourses(data); // <- aqui você preenche a lista de cursos

      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSelectCourse = async (course: any) => {
    setSelectedCourseId(course.courseId);
    setSelectedCourse(course.name);

    if (course.curriculum?.curriculumId) {
      const curriculumId = course.curriculum.curriculumId;
      setSelectedCurriculum(curriculumId.toString());
      await fetchTopicsFromCurriculum(curriculumId);
    } else {
      setCurriculumTopics([]);
      setTopicList([]);
    }
  };


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
    const handleCreateOrUpdateQuestion = async () => {
      if (!questionDescription.trim()) {
        alert("Descrição da questão está vazia.");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token || selectedTopicIndex === null) {
        alert("Token não encontrado ou tópico não selecionado.");
        return;
      }

      const topicId = topicList[selectedTopicIndex].topicId;
      if (!topicId) {
        alert("ID do tópico não encontrado.");
        return;
      }

      const correctOption = options.find((o) => o.isCorrect);
      if (!correctOption) {
        alert("Marque ao menos uma alternativa correta.");
        return;
      }

      const payload = {
        content: questionDescription,
        level: "EASY",
        type: "MULTIPLE_CHOICE",
        status: "ACTIVE",
        answer: correctOption.text,
        tags: "tag",
        metadata: "meta",
        topic: { topicId },
        options: options.map(opt => ({
          text: opt.text,
          correct: opt.isCorrect,  // 👈 Corrige o envio
        })),
      };


      try {
        let response;
        let savedQuestion;
        if (editingQuestionId !== null) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          response = await fetch(`${apiUrl}/questions/${editingQuestionId}`, {
            method: "PUT", // <-- PUT para atualizar
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
        } else {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          response = await fetch(`${apiUrl}/questions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro: ${errorText}`);
        }

        savedQuestion = await response.json();

        const updatedQuestions = editingQuestionId !== null
          ? questions.map(q =>
            q.id === editingQuestionId
              ? { ...q, content: savedQuestion.content, options: savedQuestion.options }
              : q
          )
          : [...questions, {
            id: savedQuestion.questionId,
            content: savedQuestion.content,
            options: savedQuestion.options,
          }];

        setQuestions(updatedQuestions);

        const updatedTopicList = [...topicList];
        updatedTopicList[selectedTopicIndex].questions = updatedQuestions;
        setTopicList(updatedTopicList);

        setEditingQuestionId(null);
        setQuestionDescription("");
        setOptions([{ text: "", isCorrect: false }]);
        alert(editingQuestionId !== null ? "Questão atualizada!" : "Questão criada!");

      } catch (error) {
        console.error("Erro ao salvar questão:", error);
        alert("Erro ao salvar questão. Veja o console.");
      }
    };



    // Editar questão ao clicar na lista
    const handleEditQuestion = (question: Question) => {
      if (editingQuestionId === question.id) {
        // Se já está editando a mesma, desmarca
        setEditingQuestionId(null);
        setQuestionDescription("");
        setOptions([{ text: "", isCorrect: false }]);
        return;
      }

      // Caso contrário, seleciona para editar
      setEditingQuestionId(question.id);
      setQuestionDescription(question.content);

      const mappedOptions = (question.options || []).map((opt: any) => ({
        text: opt.text || "",
        isCorrect: opt.isCorrect !== undefined ? opt.isCorrect : opt.correct === true
      }));

      setOptions(mappedOptions);
    };

    // Excluir questão
    const handleDeleteQuestion = async (id: number) => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/questions/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Erro ao excluir questão: ${text}`);
        }

        // Se deu certo no backend, remove do estado local também:
        setQuestions(questions.filter((question) => question.id !== id));
        alert("Questão deletada com sucesso!");

      } catch (error) {
        console.error("Erro ao deletar questão:", error);
        alert("Erro ao deletar questão. Veja o console.");
      }
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
                        checked={!!option.isCorrect}
                        onChange={(e) => {
                          const updatedOptions = [...options];
                          updatedOptions[index].isCorrect = e.target.checked;
                          setOptions(updatedOptions);
                        }}
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/users/students`, {
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
                {topicList.map((topic, index) => (
                  <li
                    key={topic.topicId}
                    className={`topic-item-display ${selectedTopicIndex === index ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedTopicIndex(index);
                      setTopicTitle(topic.title); // mostra o título no campo
                      setSavedMaterials(topic.materials);
                      setQuestions(topic.questions);

                    }}

                  >
                    {topic.title}
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

  const [topicList, setTopicList] = useState<{
    title: string;
    description: string;
    questions: Question[];
    materials: { title: string; url: string }[];
    topicId?: number;
  }[]>([]);


  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null);

  const handleAddOrEditTopic = async () => {
    if (!topicTitle.trim()) {
      alert("Preencha o título do tópico.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token || !selectedCurriculum) {
      alert("Currículo ou token não definido.");
      return;
    }

    try {
      // 1. Cria o tópico
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/topics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: topicTitle,
          estimatedTime: 1,
          parentTopic: { topicId: 1 },
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erro ao criar tópico: ${text}`);
      }

      const topicData = await response.json();
      const newTopicId = topicData.topicId;

      // 2. Associa ao currículo
      const curriculumResponse = await fetch(`${apiUrl}/curriculum-topics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          curriculumId: Number(selectedCurriculum),
          topicId: newTopicId,
        }),
      });

      if (!curriculumResponse.ok) {
        const text = await curriculumResponse.text();
        throw new Error(`Erro ao associar tópico ao currículo: ${text}`);
      }

      // ...

      alert("Tópico criado e vinculado com sucesso!");

      // Atualiza a lista de tópicos visível
      const newTopic = {
        title: topicTitle,
        description: "",
        questions: [],
        materials: [],
        topicId: newTopicId // 👈 aqui você adiciona o ID retornado pelo backend
      };
      setTopicList([...topicList, newTopic]);


      // Limpa o campo
      setTopicTitle("");

    } catch (error) {
      console.error("Erro ao adicionar tópico:", error);
      alert("Erro ao adicionar tópico. Veja o console.");
    }
  };



  const handleEditTopic = (index: number) => {
    const topic = topicList[index];
    setTopicTitle(topic.title);
    setTopicDescription(topic.description);

    // 👇 Aqui faz o mapeamento para garantir que o campo isCorrect venha certo
    const mappedQuestions = (topic.questions || []).map((q: any) => ({
      id: q.id,
      content: q.content,
      options: (q.options || []).map((opt: any) => ({
        text: opt.text,
        isCorrect: opt.correct,  // 👈 Conversão do backend para o frontend
      })),
    }));
    setQuestions(mappedQuestions);

    setSavedMaterials(topic.materials);
    setEditingTopicIndex(index);
  };


  const handleDeleteTopic = (index: number) => {
    const updatedList = [...topicList];
    updatedList.splice(index, 1);
    setTopicList(updatedList);
  };

  const fetchTopicsFromCurriculum = async (curriculumId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Token não encontrado");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/curriculums/${curriculumId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar tópicos do currículo: ${errorText}`);
      }

      const curriculum = await response.json();
      console.log("Currículo retornado:", curriculum);

      const loadedTopicList = curriculum.curriculumTopics.map((topic: any) => ({
        title: topic.description,
        description: topic.description,
        questions: (topic.questions || []).map((q: any) => ({
          id: q.id,
          content: q.content,
          options: (q.options || []).map((opt: any) => ({
            text: opt.text,
            isCorrect: opt.correct  // 👈 CONVERSÃO AQUI!
          }))
        })),
        materials: (topic.materials || []).map((m: any) => ({
          id: m.materialId,           // 👈 Captura o ID vindo do backend
          title: m.title,
          url: m.url,
        })),
        topicId: topic.topicId
      })).sort((a: any, b: any) => a.topicId - b.topicId);

      setTopicList(loadedTopicList);
      setCurriculumTopics(loadedTopicList.map((t: any) => t.title));

    } catch (err) {
      console.error("Erro ao buscar tópicos:", err);
      setCurriculumTopics([]);
      setTopicList([]);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token || !classTitle || !selectedCourseId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      ...(classId && { classId }), // <-- adiciona se estiver editando
      description: classTitle,
      course: {
        courseId: selectedCourseId
      },
      topics: topicList.map(t => ({
        topicId: t.topicId,
        title: t.title,
        description: t.description,
        questions: t.questions,
        materials: t.materials
      }))
    };
    console.log("🔍 Payload a ser enviado:", JSON.stringify(payload, null, 2));


    try {
      const isEditing = !!classId;
      // 1. Cria a turma
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/classes${isEditing ? `/${classId}` : ""}`, {
        method: isEditing ? "PUT" : "POST",
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const studentResponse = await fetch(`${apiUrl}/student-classes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            selectedStudents.map((student) => ({
              studentId: student.id,
              classId: createdClassId,
              enrollmentDate: new Date().toISOString().split("T")[0], // exemplo de data
              completionStatus: "PENDING", // ou outro valor padrão
            }))
          ),
        });

        if (!studentResponse.ok) {
          const text = await studentResponse.text();
          console.error("🛑 Erro completo ao adicionar alunos:", text);
          throw new Error(`Erro ao adicionar alunos: ${studentResponse.status} - ${text}`);
        }
      }

      alert("Turma e alunos criados com sucesso!");
      goTo(`/topicsmenu?classId=${createdClassId}`);
    } catch (err) {
      console.error("Erro ao criar turma ou adicionar alunos:", err);
      alert("Erro ao criar turma ou adicionar alunos. Veja o console.");
    }
  };

  return (
    <div className="classroom-container">

      <div className="back-button" onClick={() => window.history.back()}>
        <Link href="/classlist">
          <ArrowBackIcon className="back-icon" />
        </Link>
      </div>

      <div className="stars"></div>
      <img src="/assets/image9.png" alt="Planeta Terra" className="planet-earth-img" />
      <img src="/assets/image8.png" alt="Planeta" className="planet-topright-img" />

      <h1 className="classroom-title">Fábrica de Classes</h1>

      <form className="classroom-form">
        <div className="form-grid">
          {/* Primeira coluna */}
          <div className="form-column">
            <div className="curriculum-course-container">

              {/* Seção de Curso */}
              <div className="course-section">
                <label className="label">Curso <span className="required">*</span></label>
                
                <SelectCourse 
                  courses={courses}
                  selectedCourseId={selectedCourseId}
                  onSelect={handleSelectCourse}
                />

              </div>
            </div>
            <label className="label">Nome da Turma<span className="required">*</span></label>
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
            {/* Lista dos tópicos adicionados */}
            <div className="topic-list-display">
              <label className="label">Tópicos da Turma</label>
              {topicList.length > 0 && (
                <ul>
                  {topicList.map((topic, index) => (
                    <li
                      key={topic.topicId}
                      className={`topic-item-display ${selectedTopicIndex === index ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedTopicIndex(index);
                        setTopicTitle(topic.title);
                        setTopicDescription(topic.description);
                        setSavedMaterials(topic.materials);
                        setQuestions(topic.questions);
                      }}
                    >
                      {topic.title}
                    </li>
                  ))}
                </ul>
              )}


            </div>


            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button type="button" className="material-button" onClick={handleOpenImportMaterial}>
                Importar Material
              </button>
              <button type="button" className="add-question-button" onClick={handleOpenQuestionPopup}>
                Questões Tópico
              </button>
            </div>

            <label htmlFor="topic-title" className="label">Tópico Selecionado</label>
            <input
              type="text"
              id="topic-title"
              className="input"
              value={selectedTopicIndex !== null ? topicList[selectedTopicIndex]?.title : ""}
              readOnly
              placeholder="Selecione um tópico para visualizar"
            />



          </div>

        </div>

        {/* Botões abaixo das colunas */}
        <div className="center-button" style={{ marginTop: "2rem" }}>
          <button type="submit" className="submit-button" onClick={handleCreateClass}>Salvar</button>
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
          materials={materials}
          setMaterials={setMaterials}
          materialLink={materialLink}
          setMaterialLink={setMaterialLink}
          savedMaterials={savedMaterials}
          setSavedMaterials={setSavedMaterials}
          topicList={topicList}
          setTopicList={setTopicList}
          selectedTopicIndex={selectedTopicIndex}
        />
      )}

      {showPopup && (
        <ClassStudents
         onClose={() => setShowPopup(false)} 
         allStudents={allStudents}
         selectedStudents={selectedStudents}
         setSelectedStudents={setSelectedStudents}
         />
      )}

    </div>

  );
};

export default function CreateClassroomPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CreateClassroomContent />
    </Suspense>
  );
}