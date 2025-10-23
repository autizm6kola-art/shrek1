// // src/components/Task.js
// import React, { useEffect, useState } from 'react';
// import {
//   saveUserInputs,
//   getUserInputs,
//   saveCorrectInput,
//   isInputCorrect,
// } from '../utils/storage';
// import '../styles/taskItem.css';

// function Task({ task }) {
//   const [inputs, setInputs] = useState([]);
//   const [checked, setChecked] = useState(false);
//   const [correctInputs, setCorrectInputs] = useState([]);

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

//       setCorrectInputs(correctIndexes);
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
//     setCorrectInputs(correctIndexes);
//     setChecked(true);
//   };

//   const handleResetCheck = () => {
//     setChecked(false);
//   };

//   return (
//     <div >
//       <div className="task-button">
      
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
//           <button className="button-proverit" onClick={handleCheck}>
//             ✓
//           </button>
//         </div>
//     </div>
      
//     </div>
//   );
// }

// export default Task;


import React, { useEffect, useState } from 'react';
import {
  saveUserInputs,
  getUserInputs,
  saveCorrectInputs,
  getCorrectInputs,
} from '../utils/storage';
import '../styles/taskItem.css';

function Task({ task }) {
  const [inputs, setInputs] = useState([]);
  const [checked, setChecked] = useState(false);
  const [correctInputs, setCorrectInputs] = useState([]);

  const placeholders = task.exercise.split('|_|');
  const correctAnswers = task.answers;

  useEffect(() => {
    const savedInputs = getUserInputs(task.id);
    const savedCorrectIndexes = getCorrectInputs(task.id);

    if (savedInputs.length === correctAnswers.length) {
      setInputs(savedInputs);
      setCorrectInputs(savedCorrectIndexes);
      if (savedCorrectIndexes.length > 0) {
        setChecked(true);
      }
    } else {
      setInputs(Array(correctAnswers.length).fill(''));
    }
  }, [task]);

  const handleChange = (index, value) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
    saveUserInputs(task.id, updated);
  };

  const handleCheck = () => {
    const correctIndexes = inputs
      .map((input, i) =>
        input.trim().toLowerCase() === correctAnswers[i].trim().toLowerCase()
          ? i
          : null
      )
      .filter((i) => i !== null);

    saveCorrectInputs(task.id, correctIndexes);
    setCorrectInputs(correctIndexes);
    setChecked(true);
  };

  const handleResetCheck = () => {
    setChecked(false);
  };

  return (
    <div>
      <div className="task-button">
        <div className="text-block" onClick={handleResetCheck}>
          {placeholders.map((text, i) => (
            <React.Fragment key={i}>
              <span>{text}</span>
              {i < correctAnswers.length && (
                <input
                  type="text"
                  value={inputs[i] || ''}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className={
                    correctInputs.includes(i)
                      ? 'input-correct'
                      : checked
                      ? 'input-wrong'
                      : ''
                  }
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="reset-button-contaner">
          <button className="button-proverit" onClick={handleCheck}>
            ✓
          </button>
        </div>
      </div>
    </div>
  );
}

export default Task;

