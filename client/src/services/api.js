
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://enigma-ai-mystery-room.onrender.com/api",
  timeout: 90000,
});

export const createMystery = async (premise, difficulty) => {
  const response = await api.post("/cases", {
    premise,
    difficulty,
  });

  return response.data;
};

export const getMystery = async (caseId) => {
  const response = await api.get(`/cases/${caseId}`);
  return response.data;
};

export const discoverClue = async (caseId, clueId) => {
  const response = await api.post(
    `/cases/${caseId}/clues/${clueId}/discover`
  );
  return response.data;
};

export const requestHint = async (caseId) => {
  const response = await api.post(`/cases/${caseId}/hints`);
  return response.data;
};

export const accuseSuspect = async (caseId, suspectId) => {
  const response = await api.post(`/cases/${caseId}/accuse`, {
    suspectId,
  });
  return response.data;
};

export const getResult = async (caseId) => {
  const response = await api.get(`/cases/${caseId}/result`);
  return response.data;
};

export default api;
