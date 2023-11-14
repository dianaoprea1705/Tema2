const { existsSync, readFileSync, writeFileSync } = require('fs');

module.exports = function (path) {
  const TASKS_FILE_PATH = path;

  function getTasksByStatus() {
    try {
      if (existsSync(TASKS_FILE_PATH)) {
        const tasksData = readFileSync(TASKS_FILE_PATH, 'utf8');
        return JSON.parse(tasksData);
      } else {
        throw new Error('File not found');
      }
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      throw error;
    }
  }

  function changeTaskStatus(status, task) {
    try {
      if (existsSync(TASKS_FILE_PATH)) {
        const tasksData = readFileSync(TASKS_FILE_PATH, 'utf8');
        const tasks = JSON.parse(tasksData);

        const fromStatus = Object.keys(tasks).find((s) => tasks[s].includes(task));
        if (!fromStatus || !tasks[fromStatus]) {
          throw new Error('Task not found');
        }

        const taskIndex = tasks[fromStatus].indexOf(task);
        tasks[fromStatus].splice(taskIndex, 1);

        if (!tasks[status]) {
          tasks[status] = [];
        }

        tasks[status].push(task);

        writeFileSync(TASKS_FILE_PATH, JSON.stringify(tasks, null, 2), 'utf8');
      } else {
        throw new Error('File not found');
      }
    } catch (error) {
      console.error(`Error updating task status: ${error.message}`);
      throw error;
    }
  }

  return {
    getTasksByStatus,
    changeTaskStatus,
  };
};
