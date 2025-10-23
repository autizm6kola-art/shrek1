

// // src/components/MenuPage.js
// import React, { useEffect, useState } from 'react';
// import { clearAllAnswers, getAllCorrectInputs } from '../utils/storage';
// import BackButton from './BackButton';
// import ProgressBar from './ProgressBar';
// import { generateRanges } from '../utils/ranges'; // ✅
// import '../styles/menuPage.css';

// function MenuPage({ allTasks, onSelectRange }) {
//   const [correctInputsKeys, setCorrectInputsKeys] = useState([]);
//   const [totalInputs, setTotalInputs] = useState(0);
//   const ranges = generateRanges(allTasks, 5); // ✅ 10 заданий в одном диапазоне

//   useEffect(() => {
//     const keys = getAllCorrectInputs();
//     setCorrectInputsKeys(keys);

//     const total = allTasks.reduce((sum, task) => sum + task.answers.length, 0);
//     setTotalInputs(total);
//   }, [allTasks]);

//   const countCorrectInRange = (range) => {
//     return range.taskIds.reduce((count, id) => {
//       const prefix = `shrek_input_correct_${id}_`;
//       return (
//         count + correctInputsKeys.filter((key) => key.startsWith(prefix)).length
//       );
//     }, 0);
//   };

//   const countTotalInRange = (range) => {
//     return range.taskIds.reduce((sum, id) => {
//       const task = allTasks.find((t) => t.id === id);
//       return sum + (task ? task.answers.length : 0);
//     }, 0);
//   };

//   return (
//     <div className="menu-container">
//       <BackButton />

//       <h1 className="menu-title">SHREK</h1>

//       <ProgressBar correct={correctInputsKeys.length} total={totalInputs} />

//       <p className="menu-progress-text">
//         Правильных ответов {correctInputsKeys.length} из {totalInputs}
//       </p>

//       <div className="range-buttons-wrapper">
//         {ranges.map((range, i) => {
//           const total = countTotalInRange(range);
//           const correct = countCorrectInRange(range);

//           let buttonClass = 'range-button';
//           if (correct === total && total > 0) {
//             buttonClass += ' completed';
//           } else if (correct > 0) {
//             buttonClass += ' partial';
//           }

//           const from = range.taskIds[0];
//           const to = range.taskIds[range.taskIds.length - 1];

//           return (
//             <button
//                 key={i}
//                 className={buttonClass}
//                 onClick={() => onSelectRange(range.taskIds)}
//                     >
//                 {i + 1}
//             </button>
//             );

//         })}
//       </div>

//       <div className="reset-button-contaner">
//         <button
//           className="reset-button"
//           onClick={() => {
//             clearAllAnswers();
//             window.location.reload();
//           }}
//         >
//           Сбросить все ответы
//         </button>
//       </div>
//     </div>
//   );
// }

// export default MenuPage;

// src/components/MenuPage.js
import React, { useEffect, useState } from 'react';
import { clearAllAnswers, getCorrectInputs } from '../utils/storage';
import BackButton from './BackButton';
import ProgressBar from './ProgressBar';
import { generateRanges } from '../utils/ranges';
import '../styles/menuPage.css';

function MenuPage({ allTasks, onSelectRange }) {
  const [correctInputsByTask, setCorrectInputsByTask] = useState({});
  const [totalInputs, setTotalInputs] = useState(0);

  const ranges = generateRanges(allTasks, 5); // группировка по 5 заданий

  useEffect(() => {
    // Собираем количество правильных инпутов по каждой задаче
    const corrects = {};
    allTasks.forEach((task) => {
      const correctForTask = getCorrectInputs(task.id);
      corrects[task.id] = correctForTask.length;
    });
    setCorrectInputsByTask(corrects);

    // Подсчёт общего количества инпутов
    const total = allTasks.reduce((sum, task) => sum + task.answers.length, 0);
    setTotalInputs(total);
  }, [allTasks]);

  const countCorrectInRange = (range) => {
    return range.taskIds.reduce((count, id) => count + (correctInputsByTask[id] || 0), 0);
  };

  const countTotalInRange = (range) => {
    return range.taskIds.reduce((sum, id) => {
      const task = allTasks.find((t) => t.id === id);
      return sum + (task ? task.answers.length : 0);
    }, 0);
  };

  const totalCorrect = Object.values(correctInputsByTask).reduce((a, b) => a + b, 0);

  return (
    <div className="menu-container">
      <BackButton />

      <h1 className="menu-title">SHREK</h1>

      <ProgressBar correct={totalCorrect} total={totalInputs} />

      <p className="menu-progress-text">
        Правильных ответов {totalCorrect} из {totalInputs}
      </p>

      <div className="range-buttons-wrapper">
        {ranges.map((range, i) => {
          const total = countTotalInRange(range);
          const correct = countCorrectInRange(range);

          let buttonClass = 'range-button';
          if (correct === total && total > 0) {
            buttonClass += ' completed';
          } else if (correct > 0) {
            buttonClass += ' partial';
          }

          return (
            <button
              key={i}
              className={buttonClass}
              onClick={() => onSelectRange(range.taskIds)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="reset-button-contaner">
        <button
          className="reset-button"
          onClick={() => {
            clearAllAnswers();
            window.location.reload();
          }}
        >
          Сбросить все ответы
        </button>
      </div>
    </div>
  );
}

export default MenuPage;
