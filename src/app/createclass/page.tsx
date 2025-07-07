"use client";
import React, { useState, useEffect } from "react";
import "./createclass.css";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";


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

const CreateClassroomPage: React.FC = () => {
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
  const [material, setMaterial] = useState<File | null>(null);
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
      const res = await fetch(`http://localhost:8081/api/student-classes/class/${classId}`, {
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
        const response = await fetch(`http://localhost:8081/api/classes/${classIdNumber}`, {
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
      const response = await fetch(`http://localhost:8081/api/questions/${id}`, {
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
          response = await fetch(`http://localhost:8081/api/questions/${editingQuestionId}`, {
            method: "PUT", // <-- PUT para atualizar
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
        } else {
          response = await fetch("http://localhost:8081/api/questions", {
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
        const response = await fetch(`http://localhost:8081/api/questions/${id}`, {
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
      <div className="student-modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>Gerenciar Alunos da Turma</h2>

        <div className="student-columns">
          <div className="student-column">
            <h3>Todos os Alunos</h3>
            <button className="action-button green" onClick={handleAddAll}>Adicionar todos</button>
            <ul>
              {allStudents.map((student, i) => (
                <li key={i}>
                  <div className="student-info">
                    <strong>{student.name}</strong>
                    <small>{student.email}</small>
                  </div>
                  <button className="icon-button green" onClick={() => handleAddStudent(student)}>+</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="student-column">
            <h3>Alunos da Turma</h3>
            <button className="action-button red" onClick={handleRemoveAll}>Remover todos</button>
            <ul>
              {selectedStudents.map((student, i) => (
                <li key={i}>
                  <div className="student-info">
                    <strong>{student.name}</strong>
                  </div>
                  <button className="icon-button red" onClick={() => handleRemoveStudent(student.email)}>x</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-footer-buttons">
          <button className="save-button" onClick={saveStudentList}>
            Salvar Alunos da Turma
          </button>
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
    savedMaterials: { id?: number; title: string; url: string }[];   // ✅ Agora com id opcional
    setSavedMaterials: (materials: { id?: number; title: string; url: string }[]) => void;  // ✅ Agora com id opcional
  }> = ({ onClose, material, setMaterial, materialLink, setMaterialLink, savedMaterials, setSavedMaterials }) => {

    const [previewFile, setPreviewFile] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedMaterialIndex, setSelectedMaterialIndex] = useState<number | null>(null);

    // Adiciona material à lista ao salvar
    const handleSaveMaterial = async () => {
      if (selectedTopicIndex === null) {
        alert("Selecione um tópico antes de salvar o material.");
        return;
      }

      if (!materialTitle.trim()) {
        alert("Informe o título do material.");
        return;
      }

      const newMaterial = { title: materialTitle, url: materialLink };
      const updatedMaterials = [...savedMaterials, newMaterial];
      setSavedMaterials(updatedMaterials);

      const updatedTopics = [...topicList];
      updatedTopics[selectedTopicIndex].materials = updatedMaterials;
      setTopicList(updatedTopics);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Token não encontrado.");
        return;
      }

      const topicId = topicList[selectedTopicIndex].topicId;

      // Enviar link
      if (materialLink.trim() !== "") {
        const payload = {
          title: materialTitle,
          url: materialLink,
          topic: {
            topicId: topicId
          }
        };

        try {
          const response = await fetch("http://localhost:8081/api/materials", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao salvar material: ${errorText}`);
          }

          const saved = await response.json();
          alert("Material de link salvo com sucesso!");
          setMaterialLink("");
        } catch (error) {
          console.error("Erro ao salvar material (link):", error);
          alert("Erro ao salvar o material. Veja o console.");
        }

      } else if (material) {
        const fakeUploadedUrl = URL.createObjectURL(material);

        const payload = {
          title: materialTitle,
          url: materialLink,
          topic: {
            topicId: topicId
          }
        };



        try {
          const response = await fetch("http://localhost:8081/api/materials", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro ao salvar material:", errorText);
            alert("Erro ao salvar material: " + errorText);
            return;
          }

          const saved = await response.json();
          alert("Material PDF salvo com sucesso!");
          setMaterial(null);
        } catch (error) {
          console.error("Erro ao salvar material (PDF):", error);
          alert("Erro ao salvar o material. Veja o console.");
        }
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
    const handleDeleteMaterial = async (index: number, materialId?: number) => {
      const token = localStorage.getItem("accessToken");

      // Se o material tem ID (ou seja, já foi salvo no backend), faz DELETE no backend
      if (materialId && token) {
        try {
          const response = await fetch(`http://localhost:8081/api/materials/${materialId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ao excluir material no backend: ${text}`);
          }

          console.log(`Material com id ${materialId} deletado no backend.`);
        } catch (error) {
          console.error("Erro ao excluir material no backend:", error);
          alert("Erro ao excluir material no backend. Veja o console.");
          return;
        }
      }

      // ✅ Independente de ter ou não id, remove do estado local:
      const updatedMaterials = savedMaterials.filter((_, i) => i !== index);
      setSavedMaterials(updatedMaterials);

      // ✅ Limpa os campos se o material excluído estava selecionado
      if (selectedMaterialIndex === index) {
        setSelectedMaterialIndex(null);
        setMaterialTitle("");
        setMaterialLink("");
      }
    };


    // Limita o título do material a 10 caracteres
    const truncateTitle = (title: string) => (title.length > 10 ? title.substring(0, 10) + "..." : title);

    // Verifica se um material é um link externo
    const isLink = (url: string) => url.startsWith("http");

    // Abre a pré-visualização de um arquivo PDF
    const handlePreviewFile = (fileUrl: string) => {
      setPreviewUrl(fileUrl);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">

          <label htmlFor="material-title" className="label">Título do Material</label>
          <input
            type="text"
            id="material-title"
            className="input"
            value={materialTitle}
            onChange={(e) => setMaterialTitle(e.target.value)}
            placeholder="Digite o título do material"
          />

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
                  <li
                    key={index}
                    className={`material-item ${selectedMaterialIndex === index ? "selected" : ""}`}
                    onClick={() => {
                      if (selectedMaterialIndex === index) {
                        // Se clicar de novo no mesmo, desmarca
                        setSelectedMaterialIndex(null);
                        setMaterialTitle("");
                        setMaterialLink("");
                      } else {
                        // Se for um novo, carrega os campos
                        setSelectedMaterialIndex(index);
                        setMaterialTitle(item.title);
                        setMaterialLink(item.url);
                      }
                    }}
                  >
                    {isLink(item.url) ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">{truncateTitle(item.title)}</a>
                    ) : (
                      <span className="file-preview">{truncateTitle(item.title)}</span>
                    )}
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();  // Evita que o clique selecione o material
                        handleDeleteMaterial(index, item.id);  // Se tiver id, passa. Se não, tudo bem.
                      }}
                    >
                      🗑
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="plus-button" onClick={onClose}>Salvar</button>
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
      const response = await fetch("http://localhost:8081/api/topics", {
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
      const curriculumResponse = await fetch("http://localhost:8081/api/curriculum-topics", {
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
      const response = await fetch(`http://localhost:8081/api/curriculums/${curriculumId}`, {
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
      const response = await fetch(`http://localhost:8081/api/classes${isEditing ? `/${classId}` : ""}`, {
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
        const studentResponse = await fetch("http://localhost:8081/api/student-classes", {
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
                <div className="dropdown-list">
                  {courses.map((course) => (
                    <li
                      key={course.courseId}
                      onClick={() => handleSelectCourse(course)}
                      className={selectedCourseId === course.courseId ? "selected" : ""}
                    >
                      {course.name}
                    </li>


                  ))}

                </div>
                {selectedCourse && (
                  <div style={{ marginTop: "0.5rem", fontWeight: "bold", color: "black" }}>
                    {selectedCourse}
                  </div>
                )}
                <button type="button" className="plus-button">Adicionar Novo Curso</button>
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
