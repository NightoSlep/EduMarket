import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

const mockReviews = [
  {
    id: 1,
    courseId: 1,
    name: 'Nguyễn Văn A',
    content: 'Rất hữu ích, dễ hiểu và sát với thực tế!',
    createdAt: '2025-07-12T09:30:00Z',
  },
  {
    id: 2,
    courseId: 1,
    name: 'Trần Thị B',
    content: 'Hình ảnh rõ ràng, nội dung tốt, xứng đáng!',
    createdAt: '2025-07-13T14:15:00Z',
  },
  {
    id: 3,
    courseId: 2,
    name: 'Lê Văn C',
    content: 'Nội dung hơi ngắn nhưng vẫn ổn.',
    createdAt: '2025-07-10T08:00:00Z',
  },
];

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
