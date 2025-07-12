"use client";

import React, { useState } from "react";

  const ImportMaterial: React.FC<{
    onClose: () => void;
    materials: File[] | null;
    setMaterials: (files: File[] | null) => void;
    materialLink: string;
    setMaterialLink: (link: string) => void;
    savedMaterials: { id?: number; title: string; url: string }[];
    setSavedMaterials: (materials: { id?: number; title: string; url: string }[]) => void; 
    topicList: any[];
    setTopicList: (list: any[]) => void;
    selectedTopicIndex: number | null;
  }> = ({ onClose, materials, setMaterials, materialLink, setMaterialLink, savedMaterials, setSavedMaterials, topicList, setTopicList, selectedTopicIndex }) => {

    const [previewFile, setPreviewFile] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedMaterialIndex, setSelectedMaterialIndex] = useState<number | null>(null);
    const [materialTitle, setMaterialTitle] = useState("");

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

        const formData = new FormData();
        formData.append("title", materialTitle);
        formData.append("url", materialLink);
        formData.append("topicId", String(topicId));

        if (materials && materials.length > 0) {
          materials.forEach((file) => {
            formData.append("filesMaterial", file);
          });
        }

        fetch("/api/materiais", {
          method: "POST",
          body: formData,
        });

        try {
          const response = await fetch("http://localhost:8081/api/materials", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
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

      } else if (materials) {
        const fakeUploadedUrl = URL.createObjectURL(materials[0]);

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
          setMaterials(null);
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
      const files = e.target.files ? Array.from(e.target.files) : [];
      setMaterials(files);
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
            onClick={(e) => e.stopPropagation()} // 👈 isso impede que o clique suba
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
              {materials && materials.length > 0
                ? materials.map((file, index) => (
                    <span key={index}>
                      {truncateFileName(file.name)}
                      {index < materials.length - 1 && ', '}
                    </span>
                  ))
                : "Clique para escolher arquivos"}
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
                    onClick={(e) => {
                      // Evita conflito com input
                      const target = e.target as HTMLElement;
                      if (target.tagName === "INPUT" || target.closest("input")) return;

                      if (selectedMaterialIndex === index) {
                        setSelectedMaterialIndex(null);
                        // ⚠️ NÃO limpe aqui se o input está sendo usado
                        // setMaterialTitle("");
                        // setMaterialLink("");
                      } else {
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

  export default ImportMaterial;