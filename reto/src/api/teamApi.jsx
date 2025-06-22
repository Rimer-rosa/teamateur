import { API_BASE_URL } from '@env';
import axios from "axios";

export const createTeam = async (teamName) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/teams`,
      {
        name: teamName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al crear equipo");
  }
};

export const getTeams = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teams`);
    return response.data;
  } catch (error) {
    console.error("Error getting teams:", error);
    throw new Error(
      error.response?.data?.message || "Error al obtener equipos"
    );
  }
};

export const getTeamRoster = async (teamId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teams/${teamId}/roster`);
    const data = response.data;
    return {
      ...data,
      players: data.players || [],
      coach: data.coach || null,
    };
  } catch (error) {
    console.error("Error getting team roster:", error);
    throw error;
  }
};

// Funciones avanzadas
export const getCompleteTeams = async () => {
  try {
    const allTeams = await getTeams();
    const completeTeams = [];

    for (const team of allTeams) {
      try {
        const details = await getTeamRoster(team.id);
        const starters = details.players.filter((p) => p.isStarter);
        const hasGoalkeeper = starters.some((p) => p.position === "arquero");
        const isComplete =
          starters.length === 11 && hasGoalkeeper && !!details.coach;

        if (isComplete) {
          completeTeams.push({
            ...team,
            startersCount: starters.length,
            hasGoalkeeper,
            hasCoach: !!details.coach,
          });
        }
      } catch (error) {
        console.error(`Error checking team ${team.name}:`, error);
      }
    }

    return completeTeams;
  } catch (error) {
    console.error("Error getting complete teams:", error);
    throw error;
  }
};

export const simulateMatch = async (team1Id, team2Id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/teams/simulate-match`, {
      team1Id,
      team2Id,
    });
    return response.data;
  } catch (error) {
    console.error("Error simulating match:", error);
    throw new Error(
      error.response?.data?.message || "Error al simular partido"
    );
  }
};
// src/api/teamApi.js
export const getTopCompleteTeams = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/teams/top/complete-winners`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting top complete teams:", {
      url: `${API_BASE_URL}/teams/top/complete-winners`,
      error: error.response?.data || error.message,
    });
    throw new Error(
      error.response?.data?.message || "Error al obtener la clasificación"
    );
  }
};
