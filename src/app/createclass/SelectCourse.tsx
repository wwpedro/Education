import React from "react";

interface Course {
  courseId: number;
  name: string;
}

interface SelectCourseProps {
  courses: Course[];
  selectedCourseId: number | null;
  onSelect: (course: Course) => void;
}

const SelectCourse: React.FC<SelectCourseProps> = ({ courses, selectedCourseId, onSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const selectedCourse = courses.find(course => course.courseId === selectedId);
    if (selectedCourse) {
      onSelect(selectedCourse);
    }
  };

  return (
    <select
      value={selectedCourseId ?? ""}
      onChange={handleChange}
      className={selectedCourseId ? "selected select-dropdown" : "select-dropdown"}
    >
      <option value="" disabled>Selecione um curso</option>
      {courses.map(course => (
        <option key={course.courseId} value={course.courseId}>
          {course.name}
        </option>
      ))}
    </select>
  );
};

export default SelectCourse;