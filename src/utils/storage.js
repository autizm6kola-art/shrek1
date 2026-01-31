// const STORAGE_PREFIX = "shrek_";
// const USE_SUPABASE = false;

// const localStorageImpl = {
//   clearAllAnswers: () => {
//     const keys = Object.keys(localStorage);
//     keys.forEach((key) => {
//       if (key.startsWith(STORAGE_PREFIX)) {
//         localStorage.removeItem(key);
//       }
//     });
//   },

//   getTaskKey: (id) => `${STORAGE_PREFIX}task_answer_${id}`,

//   isTaskCorrect: (id) => {
//     return localStorage.getItem(localStorageImpl.getTaskKey(id)) === 'true';
//   },

//   saveCorrectAnswer: (id) => {
//     localStorage.setItem(localStorageImpl.getTaskKey(id), 'true');
//   },

//   migrateOldProgress: () => {
//     const keys = Object.keys(localStorage);
//     const oldProgressKeys = keys.filter(key => key.startsWith("progress_"));

//     oldProgressKeys.forEach((key) => {
//       try {
//         const data = JSON.parse(localStorage.getItem(key));
//         if (data && data.answeredTasks) {
//           Object.keys(data.answeredTasks).forEach((taskId) => {
//             localStorageImpl.saveCorrectAnswer(taskId);
//           });
//         }
//       } catch (e) {
//         console.error("Ошибка при миграции из", key, e);
//       }
//     });
//   },

//   clearAnswersByIds: (ids) => {
//     ids.forEach((id) => {
//       localStorage.removeItem(localStorageImpl.getTaskKey(id));
//       localStorage.removeItem(`${STORAGE_PREFIX}task_inputs_${id}`);
//     });
//   },

//   saveUserInputs: (id, inputs) => {
//     localStorage.setItem(`${STORAGE_PREFIX}task_inputs_${id}`, JSON.stringify(inputs));
//   },

//   getUserInputs: (id) => {
//     const stored = localStorage.getItem(`${STORAGE_PREFIX}task_inputs_${id}`);
//     return stored ? JSON.parse(stored) : [];
//   },

//   // --- Новый функционал: отдельные input как подзадания ---
//   saveCorrectInput: (taskId, inputIndex) => {
//     const key = `${STORAGE_PREFIX}input_correct_${taskId}_${inputIndex}`;
//     localStorage.setItem(key, 'true');
//   },

//   isInputCorrect: (taskId, inputIndex) => {
//     return localStorage.getItem(`${STORAGE_PREFIX}input_correct_${taskId}_${inputIndex}`) === 'true';
//   },

//   clearCorrectInputs: (taskId, totalInputs) => {
//     for (let i = 0; i < totalInputs; i++) {
//       const key = `${STORAGE_PREFIX}input_correct_${taskId}_${i}`;
//       localStorage.removeItem(key);
//     }
//   },

//   getAllCorrectInputs: () => {
//     const keys = Object.keys(localStorage).filter(k =>
//       k.startsWith(`${STORAGE_PREFIX}input_correct_`)
//     );
//     return keys;
//   },

//   // Добавить в localStorageImpl:
// getCorrectInputs: (taskId) => {
//   const key = `${STORAGE_PREFIX}correct_inputs_${taskId}`;
//   const stored = localStorage.getItem(key);
//   return stored ? JSON.parse(stored) : [];
// },

// saveCorrectInputs: (taskId, indexes) => {
//   const key = `${STORAGE_PREFIX}correct_inputs_${taskId}`;
//   localStorage.setItem(key, JSON.stringify(indexes));
// }
// };

// const supabaseImpl = {
//   // оставить как есть — пока не используется
// };

// const storage = USE_SUPABASE ? supabaseImpl : localStorageImpl;

// export const clearAllAnswers = (userId) => storage.clearAllAnswers(userId);
// export const isTaskCorrect = (id, userId) => storage.isTaskCorrect(id, userId);
// export const saveCorrectAnswer = (id, userId) => storage.saveCorrectAnswer(id, userId);
// export const migrateOldProgress = (userId) => storage.migrateOldProgress(userId);
// export const clearAnswersByIds = (ids, userId) => storage.clearAnswersByIds(ids, userId);
// export const getTaskKey = localStorageImpl.getTaskKey;
// export const saveUserInputs = (id, inputs) => storage.saveUserInputs(id, inputs);
// export const getUserInputs = (id) => storage.getUserInputs(id);
// export const saveCorrectInput = (taskId, index) => storage.saveCorrectInput(taskId, index);
// export const isInputCorrect = (taskId, index) => storage.isInputCorrect(taskId, index);
// export const getAllCorrectInputs = () => storage.getAllCorrectInputs();
// export const getCorrectInputs = (taskId) => storage.getCorrectInputs(taskId);
// export const saveCorrectInputs = (taskId, indexes) => storage.saveCorrectInputs(taskId, indexes);

const STORAGE_PREFIX = "shrek_";
const USE_SUPABASE = false;

const localStorageImpl = {
  clearAllAnswers: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  getTaskKey: (id) => `${STORAGE_PREFIX}task_answer_${id}`,

  isTaskCorrect: (id) => {
    return localStorage.getItem(
      localStorageImpl.getTaskKey(id)
    ) === 'true';
  },

  saveCorrectAnswer: (id) => {
    localStorage.setItem(
      localStorageImpl.getTaskKey(id),
      'true'
    );
  },

  migrateOldProgress: () => {
    const keys = Object.keys(localStorage).filter(k =>
      k.startsWith("progress_")
    );

    keys.forEach((key) => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data?.answeredTasks) {
          Object.keys(data.answeredTasks).forEach((taskId) => {
            localStorageImpl.saveCorrectAnswer(taskId);
          });
        }
      } catch (e) {
        console.error("Ошибка при миграции из", key, e);
      }
    });
  },

  clearAnswersByIds: (ids) => {
    ids.forEach((id) => {
      localStorage.removeItem(localStorageImpl.getTaskKey(id));
      localStorage.removeItem(`${STORAGE_PREFIX}task_inputs_${id}`);
      localStorage.removeItem(`${STORAGE_PREFIX}correct_inputs_${id}`);

      let i = 0;
      while (true) {
        const key = `${STORAGE_PREFIX}input_correct_${id}_${i}`;
        if (!localStorage.getItem(key)) break;
        localStorage.removeItem(key);
        i++;
      }
    });
  },

  // ---------- inputs ----------

  saveUserInputs: (id, inputs) => {
    localStorage.setItem(
      `${STORAGE_PREFIX}task_inputs_${id}`,
      JSON.stringify(inputs)
    );
  },

  getUserInputs: (id) => {
    const stored = localStorage.getItem(
      `${STORAGE_PREFIX}task_inputs_${id}`
    );
    return stored ? JSON.parse(stored) : [];
  },

  // ---------- input as subtasks (variant 1) ----------

  saveCorrectInput: (taskId, inputIndex) => {
    localStorage.setItem(
      `${STORAGE_PREFIX}input_correct_${taskId}_${inputIndex}`,
      'true'
    );
  },

  isInputCorrect: (taskId, inputIndex) => {
    return localStorage.getItem(
      `${STORAGE_PREFIX}input_correct_${taskId}_${inputIndex}`
    ) === 'true';
  },

  getAllCorrectInputs: () => {
    return Object.keys(localStorage).filter(k =>
      k.startsWith(`${STORAGE_PREFIX}input_correct_`)
    );
  },

  // ---------- input as array (variant 2) ----------

  getCorrectInputs: (taskId) => {
    const key = `${STORAGE_PREFIX}correct_inputs_${taskId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  },

  saveCorrectInputs: (taskId, indexes) => {
    const key = `${STORAGE_PREFIX}correct_inputs_${taskId}`;
    localStorage.setItem(key, JSON.stringify(indexes));
  },

  // =================================================
  // =============== BACKUP / RESTORE =================
  // =================================================

  exportProgress: () => {
    const data = {};

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        data[key] = localStorage.getItem(key);
      }
    });

    return data;
  },

  importProgress: (data) => {
    if (!data || typeof data !== 'object') return;

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.setItem(key, value);
      }
    });
  },
};

const supabaseImpl = {
  // пока не используется
};

const storage = USE_SUPABASE ? supabaseImpl : localStorageImpl;

// ---------- exports ----------

export const clearAllAnswers = () => storage.clearAllAnswers();
export const isTaskCorrect = (id) => storage.isTaskCorrect(id);
export const saveCorrectAnswer = (id) => storage.saveCorrectAnswer(id);
export const migrateOldProgress = () => storage.migrateOldProgress();
export const clearAnswersByIds = (ids) => storage.clearAnswersByIds(ids);

export const saveUserInputs = (id, inputs) =>
  storage.saveUserInputs(id, inputs);
export const getUserInputs = (id) =>
  storage.getUserInputs(id);

export const saveCorrectInput = (taskId, index) =>
  storage.saveCorrectInput(taskId, index);
export const isInputCorrect = (taskId, index) =>
  storage.isInputCorrect(taskId, index);
export const getAllCorrectInputs = () =>
  storage.getAllCorrectInputs();

export const getCorrectInputs = (taskId) =>
  storage.getCorrectInputs(taskId);
export const saveCorrectInputs = (taskId, indexes) =>
  storage.saveCorrectInputs(taskId, indexes);

export const exportProgress = () => storage.exportProgress();
export const importProgress = (data) => storage.importProgress(data);
