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

export default {
    getMatches,
    createMatch,
    getPlayers,
}
