import { API_BASE_URL } from '@env';
import axios from "axios";

export const createCoach = async (coachData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/coaches`, coachData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating coach:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error al crear entrenador"
    );
  }
};

export const getCoaches = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coaches`);
    return response.data;
  } catch (error) {
    console.error("Error getting coaches:", error);
    throw error;
  }
};

export const getAvailableCoaches = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coaches/available`);
    return response.data;
  } catch (error) {
    console.error("Error getting available coaches:", error);
    throw error;
  }
};

export const assignCoachToTeam = async (coachId, teamId) => {
  try {
    console.log("Asignando coach:", { coachId, teamId });
    const response = await axios.patch(
      `${API_BASE_URL}/coaches/${coachId}/assign`,
      { teamId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error asignando entrenador:", {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });
    throw new Error(
      error.response?.data?.message || "Error al asignar entrenador"
    );
  }
};
