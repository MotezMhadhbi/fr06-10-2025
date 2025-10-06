import axios from 'axios';

const API_BASE = 'http://localhost:1880';


export async function getRoutes(status = null) {
  const params = status ? { status } : {};
  const response = await axios.get(`${API_BASE}/routes`, { params });
  return response.data;
}
