"use client";

import { useState } from 'react';
import './createtopic.css';

export default function CreateTopicPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({ enunciado: '', alternativas: [{ texto: '', correta: false }] });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddAlternative = () => {
    setCurrentQuestion({
      ...currentQuestion,
      alternativas: [...currentQuestion.alternativas, { texto: '', correta: false }],
    });
  };

  const handleQuestionChange = (/*index, value*/) => {
    const novasAlternativas = [...currentQuestion.alternativas];
    /*novasAlternativas[index].texto = value*/;
    setCurrentQuestion({ ...currentQuestion, alternativas: novasAlternativas });
  };

  const handleCorrectChange = (/*index*/) => {
    const novasAlternativas = [...currentQuestion.alternativas];
    /*novasAlternativas[/*index].correta = !novasAlternativas[index].correta;
    setCurrentQuestion({ ...currentQuestion, alternativas: novasAlternativas });*/
  };

  const handleAddQuestion = () => {
    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      /*updatedQuestions[editingIndex] = currentQuestion;*/
      setQuestions(updatedQuestions);
      setEditingIndex(null);
    } else {
      setQuestions([/*...questions, currentQuestion*/]);
    }
    setCurrentQuestion({ enunciado: '', alternativas: [{ texto: '', correta: false }] });
  };

  const handleEditQuestion = (/*index*/) => {
    /*setCurrentQuestion(questions[/*index]);*/
    /*setEditingIndex(/*index/);*/
  };

  const handleDeleteQuestion = (/*index*/) => {
    /*setQuestions(questions.filter(/*(_, i) => i !== /*index));*/
  };

  return (
    <div className="container">
      <div className="card">
        <form className="form">
          <input type="text" placeholder="Título" className="input" />
          <textarea placeholder="Descrição" className="textarea"></textarea>
          <input type="file" className="input" />
          <input type="text" placeholder="Link" className="input" />

          <div className="question-form">
            <textarea
              placeholder="Enunciado da questão"
              value={currentQuestion.enunciado}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, enunciado: e.target.value })}
              className="textarea"
            ></textarea>

            {currentQuestion.alternativas.map((alt, index) => (
              <div key={index} className="alternative">
                <input
                  type="text"
                  value={alt.texto}
                  onChange={(e) => handleQuestionChange(/*index, e.target.value*/)}
                  className="input"
                  placeholder={`Alternativa ${index + 1}`}
                />
                <label>
                  Correta
                  <input
                    type="checkbox"
                    checked={alt.correta}
                    onChange={() => handleCorrectChange(/*index*/)}
                  />
                </label>
              </div>
            ))}
            <button type="button" onClick={handleAddAlternative} className="button">Adicionar Alternativa</button>
            <button type="button" onClick={handleAddQuestion} className="button">Salvar Questão</button>
          </div>

          <div className="question-list">
            {questions.map((q, index) => (
              <div key={index} className="question-item">
                <p>{/*q.enunciado*/}</p>
                <button type="button" onClick={() => handleEditQuestion(/*index*/)} className="button">Editar</button>
                <button type="button" onClick={() => handleDeleteQuestion(/*index*/)} className="button">Deletar</button>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="button save">Salvar e Avançar</button>
            <button type="button" className="button cancel">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}