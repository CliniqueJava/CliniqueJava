import axios from 'axios';

const API_BASE_URL = 'http://localhost:8009/api';

export const doctorService = {
  getAllDoctors: async () => {
    const response = await axios.get(`${API_BASE_URL}/doctors`);
    return response.data;
  },
  
  getDoctorById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/doctors/${id}`);
    return response.data;
  },
  
  getDoctorAvailability: async (id, date) => {
    const response = await axios.get(`${API_BASE_URL}/doctors/${id}/availability`, {
      params: { date }
    });
    return response.data;
  },
  
  bookAppointment: async (appointmentData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/appointments/book`, appointmentData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  }
};
