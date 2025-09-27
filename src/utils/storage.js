// // src/utils/storage.js

// import { supabase } from './supabaseClient';  // импорт клиента Supabase (предполагается, что он есть)

// const STORAGE_PREFIX = "app_audio_"; // можно поменять на любое название для конкретного приложения

// // Флаг: false — используем localStorage, true — Supabase
// const USE_SUPABASE = false;  // переключай на true, когда будешь готова к работе с Supabase

// // --- Реализация для localStorage ---

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
//         // Можно оставить старые ключи, как ты делала
//       } catch (e) {
//         console.error("Ошибка при миграции из", key, e);
//       }
//     });
//   },

//   clearAnswersByIds: (ids) => {
//     ids.forEach((id) => {
//       localStorage.removeItem(localStorageImpl.getTaskKey(id));
//     });
//   },

//   saveUserInputs: (id, inputs) => {
//   localStorage.setItem(`${STORAGE_PREFIX}task_inputs_${id}`, JSON.stringify(inputs));
// },

// getUserInputs: (id) => {
//   const stored = localStorage.getItem(`${STORAGE_PREFIX}task_inputs_${id}`);
//   return stored ? JSON.parse(stored) : [];
// },


// };

// // --- Реализация для Supabase ---

// const supabaseImpl = {
//   clearAllAnswers: async (userId) => {
//     const { error } = await supabase
//       .from('answers')
//       .delete()
//       .eq('user_id', userId);
//     if (error) console.error('Ошибка очистки ответов в Supabase:', error);
//   },

//   isTaskCorrect: async (id, userId) => {
//     const { data, error } = await supabase
//       .from('answers')
//       .select('answer_correct')
//       .eq('user_id', userId)
//       .eq('task_id', id)
//       .single();
//     if (error) {
//       console.error('Ошибка получения ответа из Supabase:', error);
//       return false;
//     }
//     return data?.answer_correct === true;
//   },

//   saveCorrectAnswer: async (id, userId) => {
//     const { error } = await supabase
//       .from('answers')
//       .upsert({ user_id: userId, task_id: id, answer_correct: true });
//     if (error) console.error('Ошибка сохранения ответа в Supabase:', error);
//   },

//   // Для миграции пока можно оставить пустую функцию или добавить логику
//   migrateOldProgress: () => {
//     // Тут пока ничего не делаем
//   },

//   clearAnswersByIds: async (ids, userId) => {
//     for (const id of ids) {
//       const { error } = await supabase
//         .from('answers')
//         .delete()
//         .eq('user_id', userId)
//         .eq('task_id', id);
//       if (error) console.error('Ошибка удаления ответа в Supabase:', error);
//     }
//   },
// };


// // --- Общий интерфейс — выбираем реализацию по флагу ---

// const storage = USE_SUPABASE ? supabaseImpl : localStorageImpl;

// // Экспортируем нужные функции

// export const clearAllAnswers = (userId) => storage.clearAllAnswers(userId);
// export const isTaskCorrect = (id, userId) => storage.isTaskCorrect(id, userId);
// export const saveCorrectAnswer = (id, userId) => storage.saveCorrectAnswer(id, userId);
// export const migrateOldProgress = (userId) => storage.migrateOldProgress(userId);
// export const clearAnswersByIds = (ids, userId) => storage.clearAnswersByIds(ids, userId);
// export const getTaskKey = localStorageImpl.getTaskKey;
// export const saveUserInputs = (id, inputs) => storage.saveUserInputs(id, inputs);
// export const getUserInputs = (id) => storage.getUserInputs(id);


// src/utils/storage.js

// src/utils/storage.js

// src/utils/storage.js

import { supabase } from './supabaseClient';

const STORAGE_PREFIX = "app_audio_";
const USE_SUPABASE = false;

const localStorageImpl = {
  clearAllAnswers: () => {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  getTaskKey: (id) => `${STORAGE_PREFIX}task_answer_${id}`,

  isTaskCorrect: (id) => {
    return localStorage.getItem(localStorageImpl.getTaskKey(id)) === 'true';
  },

  saveCorrectAnswer: (id) => {
    localStorage.setItem(localStorageImpl.getTaskKey(id), 'true');
  },

  migrateOldProgress: () => {
    const keys = Object.keys(localStorage);
    const oldProgressKeys = keys.filter(key => key.startsWith("progress_"));

    oldProgressKeys.forEach((key) => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data && data.answeredTasks) {
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
    });
  },

  saveUserInputs: (id, inputs) => {
    localStorage.setItem(`${STORAGE_PREFIX}task_inputs_${id}`, JSON.stringify(inputs));
  },

  getUserInputs: (id) => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}task_inputs_${id}`);
    return stored ? JSON.parse(stored) : [];
  },

  // --- Новый функционал: отдельные input как подзадания ---
  saveCorrectInput: (taskId, inputIndex) => {
    const key = `${STORAGE_PREFIX}input_correct_${taskId}_${inputIndex}`;
    localStorage.setItem(key, 'true');
  },

  isInputCorrect: (taskId, inputIndex) => {
    return localStorage.getItem(`${STORAGE_PREFIX}input_correct_${taskId}_${inputIndex}`) === 'true';
  },

  clearCorrectInputs: (taskId, totalInputs) => {
    for (let i = 0; i < totalInputs; i++) {
      const key = `${STORAGE_PREFIX}input_correct_${taskId}_${i}`;
      localStorage.removeItem(key);
    }
  },

  getAllCorrectInputs: () => {
    const keys = Object.keys(localStorage).filter(k =>
      k.startsWith(`${STORAGE_PREFIX}input_correct_`)
    );
    return keys;
  },
};

const supabaseImpl = {
  // оставить как есть — пока не используется
};

const storage = USE_SUPABASE ? supabaseImpl : localStorageImpl;

export const clearAllAnswers = (userId) => storage.clearAllAnswers(userId);
export const isTaskCorrect = (id, userId) => storage.isTaskCorrect(id, userId);
export const saveCorrectAnswer = (id, userId) => storage.saveCorrectAnswer(id, userId);
export const migrateOldProgress = (userId) => storage.migrateOldProgress(userId);
export const clearAnswersByIds = (ids, userId) => storage.clearAnswersByIds(ids, userId);
export const getTaskKey = localStorageImpl.getTaskKey;
export const saveUserInputs = (id, inputs) => storage.saveUserInputs(id, inputs);
export const getUserInputs = (id) => storage.getUserInputs(id);
export const saveCorrectInput = (taskId, index) => storage.saveCorrectInput(taskId, index);
export const isInputCorrect = (taskId, index) => storage.isInputCorrect(taskId, index);
export const getAllCorrectInputs = () => storage.getAllCorrectInputs();

