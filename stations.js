import axios from 'axios';

const API_BASE = 'http://localhost:1880';


export async function getStations(status = null) {
  const params = status ? { status } : {};
  const response = await axios.get(`${API_BASE}/Stations`, { params });
  return response.data;
}
