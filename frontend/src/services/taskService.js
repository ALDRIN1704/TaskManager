import axios from 'axios';

export const taskService = {
  // GET /api/tasks
  async getAllTasks() {
    const response = await axios.get('/api/tasks');
    return response.data;
  },

  // GET /api/tasks/{id}
  async getTaskById(id) {
    const response = await axios.get(`/api/tasks/${id}`);
    return response.data;
  },

  // GET /api/tasks/employee/{employeeId}
  async getTasksByEmployee(employeeId) {
    const response = await axios.get(`/api/tasks/employee/${employeeId}`);
    return response.data;
  },

  // POST /api/tasks
  async createTask(taskData) {
    const response = await axios.post('/api/tasks', taskData);
    return response.data;
  },

  // PUT /api/tasks/{id}
  async updateTask(id, taskData) {
    const response = await axios.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },

  // PATCH /api/tasks/{id}/status
  async updateTaskStatus(id, status) {
    const response = await axios.patch(`/api/tasks/${id}/status`, { status });
    return response.data;
  },

  // DELETE /api/tasks/{id}
  async deleteTask(id) {
    await axios.delete(`/api/tasks/${id}`);
    return true;
  }
};
