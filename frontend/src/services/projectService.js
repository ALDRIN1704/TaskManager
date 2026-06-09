import axios from 'axios';

export const projectService = {
  async getAllProjects() {
    const response = await axios.get('/api/projects');
    return response.data;
  },

  async getProjectById(id) {
    const response = await axios.get(`/api/projects/${id}`);
    return response.data;
  },

  async createProject(projectData) {
    const response = await axios.post('/api/projects', projectData);
    return response.data;
  },

  async updateProject(id, projectData) {
    const response = await axios.put(`/api/projects/${id}`, projectData);
    return response.data;
  },

  async deleteProject(id) {
    await axios.delete(`/api/projects/${id}`);
    return true;
  }
};
