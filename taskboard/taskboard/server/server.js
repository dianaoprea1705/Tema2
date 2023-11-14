const express = require('express');
const { join, resolve } = require('path');
const service = require('./server/service'); 
const PORT = process.env.PORT || 8080;
const TASKS_FILE_PATH = resolve(__dirname, 'tasks.json');
const tasksService = service(TASKS_FILE_PATH);

express()
  .use(express.static(join(resolve('..'), 'client')))
  .use(express.json()) 
  .get('/tasks', (request, response) => {
    try {
      const tasks = tasksService.getTasksByStatus();

      if (Object.keys(tasks).length === 0) {
        // dacă nu există task-uri, se returnează 204
        response.status(204).send();
      } else {
        response.json(tasks);
      }
    } catch (error) {
      console.error(`Error getting tasks: ${error.message}`);
      response.status(500).send('Internal Server Error');
    }
  })
  .put('/tasks', (request, response) => {
    try {
      const { status, task } = request.query;

      if (!status || !task) {
        response.status(400).send('Missing required parameters in query string');
        return;
      }

      tasksService.changeTaskStatus(status, task);
      response.send('Task status updated successfully');
    } catch (error) {
      console.error(`Error updating task status: ${error.message}`);
      response.status(500).send('Internal Server Error');
    }
  })
  .listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
