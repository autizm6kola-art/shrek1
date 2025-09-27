
// src/components/TasksPage.js
import React, { useEffect, useState } from 'react';
import BackButton from './BackButton';
import ProgressBar from './ProgressBar';
import Task from './Task';
import {
  clearAnswersByIds,
  getAllCorrectInputs,
} from '../utils/storage';
import '../styles/tasksPage.css';

function TasksPage({ tasks, goBack }) {
  const [correctInputs, setCorrectInputs] = useState([]);
  const [totalInputs, setTotalInputs] = useState(0);

  const updateCorrectInputs = () => {
    const allCorrect = getAllCorrectInputs(); // ["app_audio_input_correct_1_0", ...]
    setCorrectInputs(allCorrect);
  };

  useEffect(() => {
    updateCorrectInputs();
    const total = tasks.reduce((acc, task) => acc + task.answers.length, 0);
    setTotalInputs(total);
  }, [tasks]);

  const handleReset = () => {
    tasks.forEach((task) => {
      clearAnswersByIds([task.id]);
      const total = task.answers.length;
      for (let i = 0; i < total; i++) {
        localStorage.removeItem(`app_audio_input_correct_${task.id}_${i}`);
      }
    });

    setCorrectInputs([]);
    window.location.reload(); // можно заменить на updateCorrectInputs() + пересчёт, если без перезагрузки
  };

  if (!tasks || tasks.length === 0) {
    return <div>Нет вопросов</div>;
  }

  const taskIds = tasks.map((t) => t.id);
  const start = Math.min(...taskIds);

  return (
    <div className="task-container">
      <BackButton />

      <button onClick={goBack} className="back-link task-back-button">
        ← Назад к выбору
      </button>

      <h1 className="task-heading">Страница {start}</h1>

      {/* <ProgressBar correct={correctInputs.length} total={totalInputs} /> */}

      {/* <p>
        <strong className="task-strong">
          Правильных ответов: {correctInputs.length} из {totalInputs}
        </strong>
      </p> */}

      <hr />

      <div className="task-grid">
        {tasks.map((task) => (
          <div className="task-item" key={task.id}>
            <Task task={task} onCheck={updateCorrectInputs} />
          </div>
        ))}
      </div>

      <div className="reset-button-contaner">
        <button onClick={handleReset} className="reset-button">
          Сбросить ответы на этой странице
        </button>
      </div>
    </div>
  );
}

export default TasksPage;

// // src/components/Task.js
// import React, { useEffect, useState } from 'react';
// import {
//   saveUserInputs,
//   getUserInputs,
//   saveCorrectInput,
// } from '../utils/storage';
// import '../styles/taskItem.css';

// function Task({ task, onCheck }) {
//   const [inputs, setInputs] = useState([]);
//   const [checked, setChecked] = useState(false);

//   const placeholders = task.exercise.split('|_|');
//   const correctAnswers = task.answers;

//   useEffect(() => {
//     const savedInputs = getUserInputs(task.id);

//     if (savedInputs.length === correctAnswers.length) {
//       setInputs(savedInputs);

//       const correctIndexes = savedInputs
//         .map((input, i) =>
//           input.trim().toLowerCase() === correctAnswers[i].trim().toLowerCase()
//             ? i
//             : null
//         )
//         .filter((i) => i !== null);

//       correctIndexes.forEach((i) => saveCorrectInput(task.id, i));
//     } else {
//       setInputs(Array(correctAnswers.length).fill(''));
//     }
//   }, [task]);

//   const handleChange = (index, value) => {
//     const updated = [...inputs];
//     updated[index] = value;
//     setInputs(updated);
//     saveUserInputs(task.id, updated);
//   };

//   const handleCheck = () => {
//     const correctIndexes = inputs
//       .map((input, i) =>
//         input.trim().toLowerCase() === correctAnswers[i].trim().toLowerCase()
//           ? i
//           : null
//       )
//       .filter((i) => i !== null);

//     correctIndexes.forEach((i) => saveCorrectInput(task.id, i));
//     setChecked(true);

//     if (onCheck) {
//       onCheck(); // 👈 Обновляем прогресс в родителе
//     }
//   };

//   const handleResetCheck = () => {
//     setChecked(false);
//   };

//   return (
//     <div className="task-item">
//       <div className="reset-button-contaner">
//         <button className="button-proverit" onClick={handleCheck}>
//           Проверить
//         </button>
//       </div>

//       <div className="text-block" onClick={handleResetCheck}>
//         {placeholders.map((text, i) => (
//           <React.Fragment key={i}>
//             <span>{text}</span>
//             {i < correctAnswers.length && (
//               <input
//                 type="text"
//                 value={inputs[i] || ''}
//                 onChange={(e) => handleChange(i, e.target.value)}
//                 className={
//                   !checked
//                     ? ''
//                     : inputs[i].trim().toLowerCase() ===
//                       correctAnswers[i].trim().toLowerCase()
//                     ? 'input-correct'
//                     : 'input-wrong'
//                 }
//               />
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       <div className="reset-button-contaner">
//         <button className="button-proverit" onClick={handleCheck}>
//           Проверить
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Task;

