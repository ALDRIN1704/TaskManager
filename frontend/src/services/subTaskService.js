import axios from 'axios';

export const subTaskService = {
  async getAllSubTasks() {
    const response = await axios.get('/api/subtasks');
    return response.data;
  },

  async getSubTaskById(id) {
    const response = await axios.get(`/api/subtasks/${id}`);
    return response.data;
  },

  async getSubTasksByProject(projectId) {
    const response = await axios.get(`/api/subtasks/project/${projectId}`);
    return response.data;
  },

  async getSubTasksByTask(taskId) {
    const response = await axios.get(`/api/subtasks/task/${taskId}`);
    return response.data;
  },

  async getSubTasksByEmployee(employeeId) {
    const response = await axios.get(`/api/subtasks/employee/${employeeId}`);
    return response.data;
  },

  async createSubTask(subTaskData) {
    const response = await axios.post('/api/subtasks', subTaskData);
    return response.data;
  },

  async updateSubTask(id, subTaskData) {
    const response = await axios.put(`/api/subtasks/${id}`, subTaskData);
    return response.data;
  },

  async updateSubTaskStatus(id, status, actorName = null) {
    const response = await axios.patch(`/api/subtasks/${id}/status`, { status, actorName });
    return response.data;
  },

  async deleteSubTask(id) {
    await axios.delete(`/api/subtasks/${id}`);
    return true;
  }
};
