"use client";
import React, { useEffect, useState } from "react";
import "./createcourse.css";
import { useRouter } from "next/navigation";

const CreateClassPage = () => {
  const router = useRouter();
  const [curriculums, setCurriculums] = useState([]);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<number | null>(null);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchCurriculums = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/curriculums", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCurriculums(data);
        } else {
          alert("Erro ao carregar currículos.");
        }
      } catch (error) {
        console.error("Erro ao buscar currículos:", error);
      }
    };

    const fetchTeacherId = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTeacherId(data.id);
        } else {
          alert("Erro ao carregar dados do usuário.");
        }
      } catch (error) {
        console.error("Erro ao buscar professor:", error);
      }
    };

    fetchCurriculums();
    fetchTeacherId();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCurriculumId) {
      alert("Você precisa selecionar um curriculum.");
      return;
    }

    if (!teacherId) {
      alert("Não foi possível identificar o professor logado.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    const courseData = {
      name: courseName,
      description: courseDescription,
      status: true,
      teacher: {
        id: teacherId,
      },
      curriculum: {
        curriculumId: selectedCurriculumId,
      },
    };

    try {
      const response = await fetch("http://localhost:8081/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        alert("Curso criado com sucesso!");
        router.push("/createclass");
      } else {
        alert("Erro ao criar curso.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro no servidor.");
    }
  };

  return (
    <div className="createclass-container">
      <button
        className="back-arrow"
        onClick={() => router.push("/createclassmenu")}
        aria-label="Voltar"
      >
        ←
      </button>

      <div className="stars"></div>

      <img src="/assets/image9.png" alt="Planeta Terra" className="planet-earth" />
      <img src="/assets/image8.png" alt="Planeta" className="planet-upper-right" />

      <h1 className="title">Fábrica de Cursos</h1>
      <form className="createclass-form" onSubmit={handleSubmit}>
        <div className="info-icon" onClick={() => setIsModalOpen(true)}>i</div><br />

        <label htmlFor="curriculum" className="label">
          Curriculum <span className="required">*</span>
        </label>

        <select
          id="curriculum"
          className="input"
          value={selectedCurriculumId ?? ""}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            setSelectedCurriculumId(isNaN(parsed) ? null : parsed);
          }}
          required
        >
          <option value="" disabled>Selecione um curriculum</option>
          {curriculums.map((item: any) => (
            <option key={item.curriculumId ?? item.id} value={item.curriculumId ?? item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <label htmlFor="course" className="label">Curso</label>
        <input
          type="text"
          id="course"
          className="input"
          placeholder="Nome do curso"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
        />

        <label htmlFor="description" className="label">Descrição</label>
        <input
          type="text"
          id="description"
          className="input"
          placeholder="Descrição do curso"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          required
        />

        <div className="form-actions">
          <button type="submit" className="submit-button">Salvar</button>
        </div>
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              É obrigatório ter um curriculum para a criação de cursos. Já para a criação de turma/classe é preciso já ter um curriculum e um curso cadastrados. Você pode avançar e voltar quando quiser.
            </p>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateClassPage;