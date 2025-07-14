import { axiosInstance, mock } from './axios';
import mockSubcategories from '../mockData/mockSubcategories';

mock.onGet('/subcategories').reply(200, mockSubcategories);

export const fetchSubcategories = async () => {
  const response = await axiosInstance.get('/subcategories');
  return response.data;
};
