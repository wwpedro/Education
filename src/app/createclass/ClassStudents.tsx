import React from "react";

interface Student {
  id: number;
  name: string;
  email: string;
}

const ClassStudents: React.FC<{ 
    onClose: () => void;
    allStudents: Student[];
    selectedStudents: Student[];
    setSelectedStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}> = ({ onClose, allStudents, selectedStudents, setSelectedStudents }) => {

    const handleAddAll = () => {
        setSelectedStudents(allStudents);
    };

    const handleAddStudent = (student: Student) => {
        if (!selectedStudents.find(s => s.email === student.email)) {
            setSelectedStudents([...selectedStudents, student]);
        }
    };

    const handleRemoveStudent = (email: string) => {
        setSelectedStudents(selectedStudents.filter(s => s.email !== email));
    };

    const handleRemoveAll = () => {
        setSelectedStudents([]);
    };

    const saveStudentList = () => {
        if (selectedStudents.length === 0) {
        alert("Selecione pelo menos um aluno.");
        return;
        }

        onClose();
        alert("Alunos selecionados e salvos localmente para a turma.");
    };
    

    return (
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
}

export default ClassStudents;