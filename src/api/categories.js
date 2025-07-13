import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

const mockCategories = [
  { id: 1, name: 'Khóa học' },
  { id: 2, name: 'Tài liệu' }
];

const axiosInstance = axios.create();
const mock = new AxiosMockAdapter(axiosInstance, { delayResponse: 200 });

mock.onGet('/categories').reply(200, mockCategories);

export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};
