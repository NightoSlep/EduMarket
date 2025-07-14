import { axiosInstance, mock } from './axios';

const mockCategories = [
  { id: 1, name: 'Khóa học' },
  { id: 2, name: 'Tài liệu' }
];

mock.onGet('/categories').reply(200, mockCategories);

export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};
