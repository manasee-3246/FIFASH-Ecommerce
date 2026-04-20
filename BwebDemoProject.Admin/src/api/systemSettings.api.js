import axios from "axios";
import { API_URL } from "./index";

export const getSystemSettings = async () => {
    const response = await axios.get(`${API_URL}/companies/public/settings`);
    return response;
};

export const updateSystemSettings = async (id, data) => {
    const response = await axios.put(`${API_URL}/companies/${id}`, data);
    return response;
};
