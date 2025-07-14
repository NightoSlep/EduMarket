import { axiosInstance, mock } from './axios';
import likedCoursesData from '../mockData/likedCourses';

let likedCourses = [...likedCoursesData];

mock.onGet('/liked-courses').reply(config => {
  const userId = config.params?.userId;
  if (userId) {
    const parsedId = parseInt(userId);
    const userLikes = likedCourses.filter(l => l.userId === parsedId);
    return [200, userLikes];
  }
  return [200, likedCourses];
});

mock.onPost('/liked-courses').reply(config => {
  const { userId, courseId } = JSON.parse(config.data);
  const exists = likedCourses.some(
    l => l.userId === userId && l.courseId === courseId
  );
  if (!exists) {
    likedCourses.push({ userId, courseId });
  }
  return [201, { success: true }];
});

mock.onDelete('/liked-courses').reply(config => {
  const userId = parseInt(config.params.userId, 10);
  const courseId = parseInt(config.params.courseId, 10);
  likedCourses = likedCourses.filter(
    l => !(l.userId === userId && l.courseId === courseId)
  );
  return [200, { success: true }];
});

export const fetchLikedCourses = async (userId) => {
  const response = await axiosInstance.get('/liked-courses', {
    params: { userId },
  });
  return response.data;
};

export const likeCourse = async (userId, courseId) => {
  const response = await axiosInstance.post('/liked-courses', {
    userId,
    courseId,
  });
  return response.data;
};

export const unlikeCourse = async (userId, courseId) => {
  const response = await axiosInstance.delete('/liked-courses', {
    params: { userId, courseId },
  });
  return response.data;
};
