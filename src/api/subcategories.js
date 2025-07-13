// src/api/subcategories.js
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

const mockSubcategories = [
  { id: 1, name: 'Lập trình', categoryId: 1 },
  { id: 2, name: 'Thiết kế đồ họa', categoryId: 1 },
  { id: 3, name: 'Ngoại ngữ', categoryId: 1 },
  { id: 4, name: 'Lập trình', categoryId: 2 },
  { id: 5, name: 'Thiết kế đồ họa', categoryId: 2 },
  { id: 6, name: 'Ngoại ngữ', categoryId: 2 }
];

const axiosInstance = axios.create();
const mock = new AxiosMockAdapter(axiosInstance, { delayResponse: 200 });

mock.onGet('/subcategories').reply(200, mockSubcategories);

export const fetchSubcategories = async () => {
  const response = await axiosInstance.get('/subcategories');
  return response.data;
};
