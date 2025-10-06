import axios from 'axios';

const API_BASE = 'http://localhost:1880'; 

export async function getForklifts(status = null) {
  const params = status ? { status } : {};
  const response = await axios.get(`${API_BASE}/forklifts`, { params });
  return response.data;
}

export async function blockForklift(forkliftId) {
  const response = await axios.post(`${API_BASE}/forklifts/${forkliftId}/block`);
  return response.data;
}

export async function unblockForklift(forkliftId) {
  const response = await axios.post(`${API_BASE}/forklifts/${forkliftId}/unblock`);
  return response.data;
}

export async function resetAllForklifts() {
  const response = await axios.post(`${API_BASE}/forklifts/reset-status`);
  return response.data;
}

export async function updateForklift(id, data) {
  const response = await axios.put(`${API_BASE}/forklifts/${id}`, data);
  return response.data;
}

export async function createForklift(data) {
  const response = await axios.post(`${API_BASE}/forklifts`, data);
  return response.data;
}

export async function getForkliftById(id) {
  const response = await axios.get(`${API_BASE}/forklifts/${id}`);
  return response.data;
}
export async function getLocation(status = null) {
  const params = status ? { status } : {};
	const response = await axios.get(`${API_BASE}/locationlist`, { params });
  return response.data;
}

export async function updateForkliftStatus(id, status) {
  await axios.patch(`${API_BASE}/forklifts/${id}/status`, { status });
}
