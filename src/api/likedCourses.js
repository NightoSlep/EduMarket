import { axiosInstance, mock } from './axios';

let likedCourses = [
  { userId: 1, courseId: 1 },
  { userId: 1, courseId: 3 },
  { userId: 1, courseId: 5 },
  { userId: 2, courseId: 2 },
  { userId: 2, courseId: 3 },
  { userId: 2, courseId: 6 },
  { userId: 3, courseId: 1 },
  { userId: 3, courseId: 4 },
  { userId: 3, courseId: 8 },
  { userId: 3, courseId: 9 },
  { userId: 4, courseId: 7 },
  { userId: 4, courseId: 11 },
  { userId: 5, courseId: 10 },
  { userId: 5, courseId: 12 },
];

mock.onGet('/liked-courses').reply((config) => {
  const userId = parseInt(config.params.userId, 10);
  const userLikes = likedCourses.filter((l) => l.userId === userId);
  return [200, userLikes];
});

mock.onPost('/liked-courses').reply((config) => {
  const { userId, courseId } = JSON.parse(config.data);
  const exists = likedCourses.some(
    (l) => l.userId === userId && l.courseId === courseId
  );
  if (!exists) {
    likedCourses.push({ userId, courseId });
  }
  return [201, { success: true }];
});

mock.onDelete('/liked-courses').reply((config) => {
  const userId = parseInt(config.params.userId, 10);
  const courseId = parseInt(config.params.courseId, 10);
  likedCourses = likedCourses.filter(
    (l) => !(l.userId === userId && l.courseId === courseId)
  );
  return [200, { success: true }];
});

mock.onGet('/liked-courses').reply(config => {
  const userId = config.params?.userId;
  if (userId) {
    const parsedId = parseInt(userId);
    const userLikes = likedCourses.filter(l => l.userId === parsedId);
    return [200, userLikes];
  }
  return [200, likedCourses];
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
