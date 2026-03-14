import api from '../api/axiosConfig';

//Get all trades for the authenticated user
export const getTrades = async () => {
    try {   
        const response = await api.get('/trades');
        return response.data;
    } catch (error) {
        console.error('Error fetching trades:', error);
        throw error;
    }
};

// Get single trade by ID
export const getTradeById = async (id) => {
  try {
    const response = await api.get(`/trades/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trade:', error);
    throw error;
  }
};

// Create new trade
export const createTrade = async (tradeData) => {
  try {
    const response = await api.post('/trades', tradeData);
    return response.data;
  } catch (error) {
    console.error('Error creating trade:', error);
    throw error;
  }
};

// Update trade
export const updateTrade = async (id, tradeData) => {
  try {
    const response = await api.put(`/trades/${id}`, tradeData);
    return response.data;
  } catch (error) {
    console.error('Error updating trade:', error);
    throw error;
  }
};

// Delete trade
export const deleteTrade = async (id) => {
  try {
    const response = await api.delete(`/trades/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting trade:', error);
    throw error;
  }
};

