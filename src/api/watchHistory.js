import { axiosInstance, mock } from './axios';
import watchHistoryData from '../mockData/watchHistory';

let watchHistory = [...watchHistoryData];
mock.onGet('/watch-history').reply(config => {
  const userId = parseInt(config.params?.userId);
  if (userId) {

    const history = watchHistory
      .filter(h => h.userId === userId)
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
    return [200, history];
  }
  return [400, { message: 'Thiếu userId' }];
});

mock.onPost('/watch-history').reply(config => {
  const { userId, courseId } = JSON.parse(config.data);
  const entry = {
    userId,
    courseId,
    watchedAt: new Date().toISOString()
  };
  watchHistory.push(entry);
  return [201, entry];
});

export const fetchWatchHistory = async (userId) => {
  const response = await axiosInstance.get('/watch-history', {
    params: { userId }
  });
  return response.data;
};

export const addToWatchHistory = async (userId, courseId) => {
  const response = await axiosInstance.post('/watch-history', {
    userId,
    courseId
  });
  return response.data;
};
