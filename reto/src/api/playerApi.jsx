import { API_BASE_URL } from "@env";
import axios from "axios";

export const createPlayer = async (playerData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/players`, playerData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating player:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Error al crear jugador");
  }
};

export const assignPlayerToTeam = async (playerId, teamId, isStarter) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/players/${playerId}/assign`,
      { teamId, isStarter },
      { headers: { "Content-Type": "application/json" } }
    );

    return {
      success: true,
      message: response.data.message || "Jugador asignado correctamente",
      player: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al asignar jugador al equipo",
    };
  }
};

export const getPositions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/positions`);
    return response.data;
  } catch (error) {
    console.error("Error getting positions:", error);
    return [
      "Arquero",
      "Defensa central",
      "Lateral derecho",
      "Lateral izquierdo",
      "Mediocampista defensivo",
      "Mediocampista ofensivo",
      "Volante",
      "Extremo derecho",
      "Extremo izquierdo",
      "Delantero",
    ];
  }
};

export const getPlayers = async () => {
  const response = await axios.get(`${API_BASE_URL}/players`);
  return response.data;
};

export const getAvailablePlayers = async () => {
  const response = await axios.get(`${API_BASE_URL}/players/available`);
  return response.data;
};
