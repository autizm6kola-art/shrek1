// import React, { useEffect, useState } from 'react';
// import MenuPage from './components/MenuPage';
// import TasksPage from './components/TasksPage';

// function App() {
//   const [allTasks, setAllTasks] = useState([]);
//   const [selectedTaskId, setSelectedTaskId] = useState(null);

//   useEffect(() => {
//     // Загружаем JSON из public
//     fetch(process.env.PUBLIC_URL + '/tasks_shrek.json')
//       .then((response) => response.json())
//       .then((data) => setAllTasks(data))
//       .catch((error) => console.error('Ошибка загрузки заданий:', error));
//   }, []);

//   const handleSelectTask = (taskId) => {
//     setSelectedTaskId(taskId);
//   };

//   const handleGoBack = () => {
//     setSelectedTaskId(null);
//   };

//   if (allTasks.length === 0) {
//     return <div>Загрузка заданий...</div>;
//   }

//   return (
//     <div>
//       {selectedTaskId === null ? (
//         <MenuPage allTasks={allTasks} onSelectTask={handleSelectTask} />
//       ) : (
//         <TasksPage
//           tasks={allTasks.filter((task) => task.id === selectedTaskId)}
//           goBack={handleGoBack}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

// src/App.js
import React, { useEffect, useState } from 'react';
import MenuPage from './components/MenuPage';
import TasksPage from './components/TasksPage';

function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [menuKey, setMenuKey] = useState(0); // 🔑 новый ключ

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/tasks_shrek.json')
      .then((response) => response.json())
      .then((data) => setAllTasks(data))
      .catch((error) => console.error('Ошибка загрузки заданий:', error));
  }, []);

  const handleSelectTask = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const handleGoBack = () => {
    setSelectedTaskId(null);
    setMenuKey((prev) => prev + 1); // 🔄 форсируем перерисовку MenuPage
  };

  if (allTasks.length === 0) {
    return <div>Загрузка заданий...</div>;
  }

  return (
    <div>
      {selectedTaskId === null ? (
        <MenuPage
          key={menuKey} // 🧠 заставляет React пересоздавать MenuPage
          allTasks={allTasks}
          onSelectTask={handleSelectTask}
        />
      ) : (
        <TasksPage
          tasks={allTasks.filter((task) => task.id === selectedTaskId)}
          goBack={handleGoBack}
        />
      )}
    </div>
  );
}

export default App;
