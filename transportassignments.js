import axios from 'axios';

const API_BASE = 'http://localhost:1880'; 


export async function getTransportAssignments(status = null) {
  const params = status ? { status } : {};
  const response = await axios.get(`${API_BASE}/TransportAssignments`, { params });
  return response.data;
}


export async function blockTransportAssignments(TransportAssignmentsId) {
  const response = await axios.post(`${API_BASE}/TransportAssignments/${TransportAssignmentsId}/block`);
  return response.data;
}


export async function unblockTransportAssignments(TransportAssignmentsId) {
  const response = await axios.post(`${API_BASE}/TransportAssignments/${TransportAssignmentsId}/unblock`);
  return response.data;
}


export async function resetAllTransportAssignments() {
  const response = await axios.post(`${API_BASE}/TransportAssignments/reset-status`);
  return response.data;
}


export async function updateTransportAssignments(id, data) {
  const response = await axios.put(`${API_BASE}/TransportAssignments/${id}`, data);
  return response.data;
}


export async function createTransportAssignments(data) {
  const response = await axios.post(`${API_BASE}/TransportAssignments`, data);
  return response.data;
}


export async function getTransportAssignmentsById(id) {
  const response = await axios.get(`${API_BASE}/TransportAssignments/${id}`);
  return response.data;
}
