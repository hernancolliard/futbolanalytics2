import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const login = (credentials) => apiClient.post("/login", credentials);
export const register = (userData) => apiClient.post("/register", userData);

// Teams
export const createTeam = (teamData) => apiClient.post("/teams", teamData);
export const getTeams = () => apiClient.get("/teams");

// Players
export const createPlayer = (playerData) => apiClient.post("/players", playerData);
export const getPlayers = (teamId = null) => {
  const params = teamId ? { team_id: teamId } : {};
  return apiClient.get("/players", { params });
};

// Matches
export const createMatch = (matchData) => apiClient.post("/matches", matchData);
export const getMatches = () => apiClient.get("/matches");
export const likeMatch = (matchId) => apiClient.post(`/matches/${matchId}/like`);
export const updateMatch = (matchId, data) => apiClient.put(`/matches/${matchId}`, data);
export const deleteMatch = (matchId) => apiClient.delete(`/matches/${matchId}`);

// Lineups
export const addPlayerToLineup = (matchId, lineupData) => apiClient.post(`/matches/${matchId}/lineup`, lineupData);
export const getMatchLineup = (matchId) => apiClient.get(`/matches/${matchId}/lineup`);

// Events
export const getEvents = (matchId) => apiClient.get(`/matches/${matchId}/events`);
export const createEvent = (matchId, eventData) => apiClient.post(`/matches/${matchId}/events`, eventData);
export const updateEvent = (eventId, eventData) => apiClient.put(`/events/${eventId}`, eventData);
export const deleteEvent = (eventId) => apiClient.delete(`/events/${eventId}`);


export default {
  // Auth
  login,
  register,
  // Teams
  createTeam,
  getTeams,
  // Players
  createPlayer,
  getPlayers,
  // Matches
  createMatch,
  getMatches,
  likeMatch,
  updateMatch,
  deleteMatch,
  // Lineups
  addPlayerToLineup,
  getMatchLineup,
  // Events
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};