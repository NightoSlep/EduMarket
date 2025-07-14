import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import mockReviews from '../mockData/mockReviews';

export const axiosInstance = axios.create();
export const mock = new AxiosMockAdapter(axiosInstance, { delayResponse: 800 });

mock.onGet(/\/courses\/\d+\/reviews/).reply(config => {
  const courseId = parseInt(config.url.match(/\/courses\/(\d+)\/reviews/)[1], 10);
  const reviews = mockReviews.filter(r => r.courseId === courseId);
  return [200, reviews];
});

export const fetchReviewsByCourseId = async (courseId) => {
  const response = await axiosInstance.get(`/courses/${courseId}/reviews`);
  return response.data;
};
