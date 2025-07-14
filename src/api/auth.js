import { axiosInstance } from './users';

export const loginUser = async (email, password) => {
  const res = await axiosInstance.post('/login', { email, password });
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post('/logout');
  return res.data;
};

export const getCurrentUser = async (token) => {
  const res = await axiosInstance.get('/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};
