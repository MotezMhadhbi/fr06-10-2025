import axios from 'axios';
const API_BASE = 'http://localhost:1880';

export async function getOrders() {
  const response = await axios.get(`${API_BASE}/TransportAssignments`);
  return response.data;
}

/**
 
 * @param {number} orderId 
 * @param {number} forkliftId 
 */
export async function assignOrderToForklift(orderId, forkliftId) {
  try { 

    const response = await axios.put(`http://localhost:1880/TransportAssignments/${orderId}/assign`, { VehicleId: forkliftId });
   
  return response.data;

  } catch (err) {
    console.error('Error assigning order to forklift:', err);
    throw err;
}}


export async function resetAllOrders() {
  try {
    const response = await axios.get(`${API_BASE}/TransportAssignments/reset-status`);
    return response.data;
  } catch (err) {
    console.error('Error resetting orders:', err);
    throw err;
  }
}
