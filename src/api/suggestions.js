import { axiosInstance, mock } from './axios';
import watchHistoryData from '../mockData/watchHistory';
import likedCoursesData from '../mockData/likedCourses';
import allCourses from '../mockData/mockCourses';

mock.onGet('/suggested-courses').reply(config => {
  const userId = parseInt(config.params?.userId);
  if (!userId) return [400, { message: 'Thiếu userId' }];

  const watchHistory = [...watchHistoryData]
    .filter(h => h.userId === userId)
    .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
    .slice(0, 5);

  const watchedCourseIds = watchHistory.map(h => h.courseId);
  const likedCourseIds = likedCoursesData
    .filter(l => l.userId === userId)
    .map(l => l.courseId);

  const viewedOrLikedCourseIds = [...new Set([...watchedCourseIds, ...likedCourseIds])];

  const subcategoryScores = {};
  viewedOrLikedCourseIds.forEach(courseId => {
    const course = allCourses.find(c => c.id === courseId);
    if (course) {
      subcategoryScores[course.subcategoryId] = (subcategoryScores[course.subcategoryId] || 0) + 1;
    }
  });

  const suggestions = allCourses.filter(course =>
    !viewedOrLikedCourseIds.includes(course.id) &&
    subcategoryScores[course.subcategoryId]
  );
  const sortedSuggestions = suggestions.sort((a, b) =>
    (subcategoryScores[b.subcategoryId] || 0) - (subcategoryScores[a.subcategoryId] || 0)
  );
  return [200, sortedSuggestions.slice(0, 5)];
});

export const fetchSuggestedCourses = async (userId) => {
  const response = await axiosInstance.get('/suggested-courses', {
    params: { userId }
  });
  return response.data;
};
