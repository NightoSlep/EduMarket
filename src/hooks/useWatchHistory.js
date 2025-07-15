import { useCallback } from 'react';

export default function useWatchHistory() {
  const STORAGE_KEY = 'watchHistory';

  const getWatchHistory = useCallback(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }, []);

  const saveWatchHistory = (userId, courseId) => {
    const existing = getWatchHistory();
    const filtered = existing.filter(
      (item) => item.courseId !== courseId || item.userId !== userId
    );
    const newEntry = {
      id: Date.now(),
      userId,
      courseId,
      watchedAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  };
  return { getWatchHistory, saveWatchHistory };
}
