import { axiosInstance, mock } from './axios';
import mockCourses from '../mockData/mockCourses'; 

mock.onGet('/courses').reply(200, mockCourses);

mock.onGet(/\/courses\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10);
  const course = mockCourses.find(item => item.id === id);
  return course ? [200, course] : [404, { message: 'Không tìm thấy khóa học' }];
});

export const fetchCourses = async () => {
  const response = await axiosInstance.get('/courses');
  return response.data;
};

export const fetchCourseById = async (id) => {
  const response = await axiosInstance.get(`/courses/${id}`);
  return response.data;
};
