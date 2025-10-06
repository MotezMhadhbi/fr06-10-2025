import axios from 'axios';

const API_BASE = 'http://localhost:1880';


export async function getPaths(status = null) {
  const params = status ? { status } : {};
  const response = await axios.get(`${API_BASE}/paths`, { params });
  return response.data;
}
