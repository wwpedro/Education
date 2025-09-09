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
}> = ({
  onClose,
  materials,
  setMaterials,
  materialLink,
  setMaterialLink,
  savedMaterials,
  setSavedMaterials,
  topicList,
  setTopicList,
  selectedTopicIndex,
}) => {
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

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      return;
    }

    console.log("🔑 Token que será enviado:", token);

    const topicId = topicList[selectedTopicIndex].topicId;

    // 🔹 Monta FormData (sempre multipart, seja link ou arquivo)
    const formData = new FormData();
    formData.append("title", materialTitle);
    formData.append("topicId", String(topicId));

    if (materialLink.trim() !== "") {
      formData.append("url", materialLink);
    }

    if (materials && materials.length > 0) {
      materials.forEach((file) => {
        formData.append("filesMaterial", file);
      });
    }

    try {
      const response = await fetch("http://localhost:8081/api/materials", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ garante o envio do token
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao salvar material: ${errorText}`);
      }

      const saved = await response.json();

      // 🔹 Atualiza lista local com retorno do backend
      const updatedMaterials = [...savedMaterials, saved];
      setSavedMaterials(updatedMaterials);

      const updatedTopics = [...topicList];
      updatedTopics[selectedTopicIndex].materials = updatedMaterials;
      setTopicList(updatedTopics);

      alert("Material salvo com sucesso!");

      // 🔹 Limpa campos
      setMaterialTitle("");
      setMaterialLink("");
      setMaterials(null);
    } catch (error) {
      console.error("Erro ao salvar material:", error);
      alert("Erro ao salvar o material. Veja o console.");
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

    const updatedMaterials = savedMaterials.filter((_, i) => i !== index);
    setSavedMaterials(updatedMaterials);

    if (selectedMaterialIndex === index) {
      setSelectedMaterialIndex(null);
      setMaterialTitle("");
      setMaterialLink("");
    }
  };

  const truncateTitle = (title: string) =>
    title.length > 10 ? title.substring(0, 10) + "..." : title;

  const isLink = (url: string) => url.startsWith("http");

  const handlePreviewFile = (fileUrl: string) => {
    setPreviewUrl(fileUrl);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <label htmlFor="material-title" className="label">
          Título do Material
        </label>
        <input
          type="text"
          id="material-title"
          className="input"
          value={materialTitle}
          onChange={(e) => setMaterialTitle(e.target.value)}
          placeholder="Digite o título do material"
          onClick={(e) => e.stopPropagation()}
        />

        <button type="button" className="close-button" onClick={onClose}>
          ✖
        </button>

        <h1>Importar Materiais</h1>

        <div className="file-input-container">
          <label htmlFor="import-material" className="file-label">
            Selecionar Arquivo
          </label>
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
                    {index < materials.length - 1 && ", "}
                  </span>
                ))
              : "Clique para escolher arquivos"}
          </span>
        </div>

        <label htmlFor="material-link" className="label">
          Link do Material
        </label>
        <input
          type="url"
          id="material-link"
          className="input"
          value={materialLink}
          onChange={(e) => setMaterialLink(e.target.value)}
          placeholder="https://exemplo.com"
        />

        <button type="button" className="plus-button" onClick={handleSaveMaterial}>
          Adicionar Material à Lista
        </button>

        <div className="material-list">
          <h3>Materiais Salvos</h3>
          {savedMaterials.length === 0 ? (
            <p className="empty-message">Ainda não temos nenhum material na lista.</p>
          ) : (
            <ul>
              {savedMaterials.map((item, index) => (
                <li
                  key={index}
                  className={`material-item ${
                    selectedMaterialIndex === index ? "selected" : ""
                  }`}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === "INPUT" || target.closest("input")) return;

                    if (selectedMaterialIndex === index) {
                      setSelectedMaterialIndex(null);
                    } else {
                      setSelectedMaterialIndex(index);
                      setMaterialTitle(item.title);
                      setMaterialLink(item.url);
                    }
                  }}
                >
                  {isLink(item.url) ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {truncateTitle(item.title)}
                    </a>
                  ) : (
                    <span className="file-preview">{truncateTitle(item.title)}</span>
                  )}
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMaterial(index, item.id);
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
          <button type="button" className="plus-button" onClick={onClose}>
            Salvar
          </button>
        </div>
      </div>

      {previewUrl && (
        <div className="modal-overlay">
          <div className="modal-content preview-modal">
            <button
              type="button"
              className="close-button"
              onClick={() => setPreviewUrl(null)}
            >
              ✖
            </button>
            <h3>Pré-visualização do PDF</h3>
            <iframe src={previewUrl} className="pdf-preview"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportMaterial;
