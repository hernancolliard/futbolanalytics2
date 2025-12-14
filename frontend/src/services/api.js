import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
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

export default {
    getMatches,
    createMatch,
    getPlayers,
    getEvents,
    createEvent,
    deleteEvent,
    updateEvent,
}
