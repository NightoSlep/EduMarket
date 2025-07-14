import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

export const axiosInstance = axios.create({
  baseURL: 'https://mockapi.local',
});

export const mock = new AxiosMockAdapter(axiosInstance, { delayResponse: 300 });

export default axiosInstance;
