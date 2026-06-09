import axios from 'axios';

export const activityService = {
  async getAllActivities() {
    const response = await axios.get('/api/activities');
    return response.data;
  },

  async getActivitiesByProject(projectId) {
    const response = await axios.get(`/api/activities/project/${projectId}`);
    return response.data;
  },

  async getActivitiesByTask(taskId) {
    const response = await axios.get(`/api/activities/task/${taskId}`);
    return response.data;
  },
};
