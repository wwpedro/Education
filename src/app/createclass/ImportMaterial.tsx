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

      /* 🔹 NOVA VALIDAÇÃO: pelo menos link OU arquivo */
      const hasLink = materialLink.trim() !== "";
      const hasFile = materials && materials.length > 0;
      if (!hasLink && !hasFile) {
        alert("Envie pelo menos um link ou um arquivo.");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        return;
      }

      const topicId = topicList[selectedTopicIndex].topicId;

      const formData = new FormData();
      formData.append("title", materialTitle);
      formData.append("topicId", String(topicId));

      if (hasLink) formData.append("url", materialLink.trim());
      if (hasFile) {
        materials.forEach((file) => formData.append("filesMaterial", file));
      }

      try {
        const response = await fetch("http://localhost:8081/api/materials", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const saved = await response.json();

        const updatedMaterials = [...savedMaterials, saved];
        setSavedMaterials(updatedMaterials);

        const updatedTopics = [...topicList];
        updatedTopics[selectedTopicIndex].materials = updatedMaterials;
        setTopicList(updatedTopics);

        alert("Material salvo com sucesso!");

        /* limpa campos */
        setMaterialTitle("");
        setMaterialLink("");
        setMaterials(null);
      } catch (error: any) {
        console.error("Erro ao salvar material:", error);
        alert(`Erro: ${error.message}`);
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
        headers: { Authorization: `Bearer ${token}` },
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

  // remove da lista local
  const updatedMaterials = savedMaterials.filter((_, i) => i !== index);
  setSavedMaterials(updatedMaterials);

  // 🔹 ATUALIZA o tópico para refletir a remoção
  if (selectedTopicIndex !== null) {
    const updatedTopics = [...topicList];
    updatedTopics[selectedTopicIndex].materials = updatedMaterials;
    setTopicList(updatedTopics);
  }

  // limpa campos se o item excluído era o selecionado
  if (selectedMaterialIndex === index) {
    setSelectedMaterialIndex(null);
    setMaterialTitle("");
    setMaterialLink("");
  }
};

    const truncateTitle = (title: string) =>
      title.length > 10 ? title.substring(0, 10) + "..." : title;

    const isLink = (url: string | null) => url?.startsWith("https") ?? false;

    const handlePreviewFile = (item: { id?: number; url?: string }) => {
      if (item.url && item.url.startsWith("http")) {
        setPreviewUrl(item.url);
      } else if (item.id) {
        const token = localStorage.getItem("accessToken");
        const fileUrl = `http://localhost:8081/api/materials/${item.id}/download?token=${token}`;
        setPreviewUrl(fileUrl);
      } else {
        alert("Arquivo não encontrado para visualização.");
      }
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
                className={`material-item ${selectedMaterialIndex === index ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();

                  // 🔹 Se já está selecionado → desseleciona e limpa campos
                  if (selectedMaterialIndex === index) {
                    setSelectedMaterialIndex(null);
                    setMaterialTitle("");
                    setMaterialLink("");
                    setMaterials(null);
                    return;
                  }

                  // 🔹 Seleciona e preenche os campos
                  setSelectedMaterialIndex(index);
                  setMaterialTitle(item.title ?? "");
                  setMaterialLink(item.url ?? "");
                  setMaterials(null);
                }}
              >
                {isLink(item.url) ? (
                  <span
                    className="file-preview link-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 🔹 Abre modal de preview em vez de redirecionar
                      handlePreviewFile(item);
                    }}
                  >
                    {truncateTitle(item.title)}
                  </span>
                ) : (
                  <span
                    className="file-preview"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 🔹 Preview do arquivo também abre no modal
                      handlePreviewFile(item);
                    }}
                  >
                    {truncateTitle(item.title)}
                  </span>
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
