"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./createcurriculum.css";

const CreateCurriculumPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importedTopics, setImportedTopics] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [fileName, setFileName] = useState("");
  const router = useRouter();
  const goTo = (url: string) => {
    window.location.href = url;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    const curriculumData = {
      name: name.trim(),
      description: description.trim()
    };

    console.log("Enviando currículo:", curriculumData);

    try {
      const response = await fetch("http://localhost:8081/api/curriculums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(curriculumData),
      });

      if (response.ok) {
        const createdCurriculum = await response.json();
        const curriculumId = createdCurriculum.curriculumId;
        console.log("Currículo criado:", createdCurriculum);

        let parentTopicId: number | null = null;

        for (let i = 0; i < importedTopics.length; i++) {
          const topicTitle: string = importedTopics[i];

          const topicRes: Response = await fetch("http://localhost:8081/api/topics", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              description: topicTitle,
              estimatedTime: 1,
              parentTopic: i === 0 ? null : { topicId: parentTopicId },
            }),
          });

          if (!topicRes.ok) {
            console.error(`Erro ao criar tópico: ${topicTitle}`);
            continue;
          }

          const topic: { topicId: number } = await topicRes.json();
          const topicId: number = topic.topicId;

          if (i === 0) {
            parentTopicId = topicId;
          }

          await fetch("http://localhost:8081/api/curriculum-topics", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              curriculumId,
              topicId,
            }),
          });
        }

        alert("Curriculum e tópicos vinculados com sucesso!");
        goTo("/createcourse");
      } else {
        const errorText = await response.text();
        console.error("Erro ao criar currículo:", errorText);
        alert("Erro ao criar curriculum.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro no servidor.");
    }
  };

  return (
    <div className="createclass-container">
      <button
        className="back-button"
        onClick={() => goTo("/createclassmenu")}
        aria-label="Voltar"
      >
        <ArrowBackIcon className="back-icon" />
      </button>
      <div className="stars"></div>

      <img src="/assets/image9.png" alt="Planeta Terra" className="planet-earth" />
      <img src="/assets/image8.png" alt="Planeta" className="planet-upper-right" />

      <h1 className="title">Fábrica de Curriculum</h1>

      <form className="createclass-form" onSubmit={handleSubmit}>
        <div className="info-icon" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>i</div><br />

        <div className="form-group">
          <label htmlFor="curriculum" className="label">Curriculum<span className="required"> *</span></label>
          <input
            type="text"
            id="curriculum"
            className="input"
            placeholder="Nome do curriculum"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="curriculum-description" className="label">Descrição<span className="required"> *</span></label>
          <input
            type="text"
            id="curriculum-description"
            className="input"
            placeholder="Descrição do curriculum"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="label">Importar Tópicos do Currículo<span className="required"> *</span></label>
          <div className="import-group">
            
            <button
              type="button"
              className="add-button"
              onClick={() => document.getElementById("curriculum-file")?.click()}
            >
              +
            </button>
            
            <input
              type="file"
              id="curriculum-file"
              style={{ display: "none" }}
              accept=".json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const text = await file.text();
                  const json = JSON.parse(text);
                  const titles = json.elements
                    .filter((el: any) => el.group === "nodes" && el.data?.id)
                    .map((el: any) => el.data.id);

                  setImportedTopics(titles);
                  setFileName(file.name);
                  setShowPopup(true);
                }
              }}
            />

            <input
              type="text"
              value={fileName || "Nenhum arquivo selecionado"}
              readOnly
              className="input"
              onClick={() => fileName && setShowPopup(true)}
              style={{
                flex: 1,
                marginLeft: "0.5rem",
                backgroundColor: "#f3f3f3",
                color: fileName ? "#333" : "#888",
                fontStyle: fileName ? "normal" : "italic",
                cursor: fileName ? "pointer" : "default"
              }}
            />
            
          </div>
        </div>

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
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "500px", position: "relative" }}>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                fontSize: "1.2rem",
                background: "transparent",
                border: "none",
                color: "#333",
                cursor: "pointer"
              }}
              aria-label="Fechar"
            >
              ✖
            </button>
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>Tópicos Importados</h2>
            <ul style={{
              textAlign: "left",
              maxHeight: "300px",
              overflowY: "auto",
              padding: "0 1rem",
              color: "#444",
              listStyleType: "disc"
            }}>
              {importedTopics.map((topic, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>{topic}</li>
              ))}
            </ul>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
              <button
                className="submit-button"
                onClick={() => setShowPopup(false)}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCurriculumPage;
