import { axiosInstance, mock } from './axios';
import mockCategories from '../mockData/mockCategories'; 

mock.onGet('/categories').reply(200, mockCategories);

export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};
