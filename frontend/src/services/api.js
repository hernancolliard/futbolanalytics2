import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const getPlayers = async () => {
  const response = await apiClient.get('/players');
  return response.data;
};

export const getMatches = () => {
    return apiClient.get('/matches');
};

export const createMatch = (data) => {
    return apiClient.post('/matches', data);
};

export const updateMatch = (matchId, data) => {
    return apiClient.put(`/matches/${matchId}`, data);
};

export const deleteMatch = (matchId) => {
    return apiClient.delete(`/matches/${matchId}`);
};

export const getEvents = (matchId) => {
    return apiClient.get(`/matches/${matchId}/events`);
};

export const createEvent = (matchId, eventData) => {
    return apiClient.post(`/matches/${matchId}/events`, eventData);
};

export const deleteEvent = (eventId) => {
    return apiClient.delete(`/events/${eventId}`);
};

export const updateEvent = (eventId, eventData) => {
    return apiClient.put(`/events/${eventId}`, eventData);
};

export const login = (credentials) => {
    return apiClient.post('/login', credentials);
};

export const register = (userData) => {
    return apiClient.post('/register', userData);
};

export default {
    getMatches,
    createMatch,
    updateMatch,
    deleteMatch,
    getPlayers,
    getEvents,
    createEvent,
    deleteEvent,
    updateEvent,
    login,
    register,
}
