import axios from 'axios';

const API_BASE_URL = '/api/v1';

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/resume/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const matchJobs = async (skills: string[]) => {
  const response = await axios.post(`${API_BASE_URL}/jobs/match`, {
    resume_skills: skills,
  });
  return response.data;
};
