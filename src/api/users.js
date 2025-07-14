import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import usersData from '../mockData/users';

export const axiosInstance = axios.create();
export const mock = new AxiosMockAdapter(axiosInstance, { delayResponse: 500 });

let users = [...usersData];

let fakeToken = null;
let currentUser = null;

mock.onPost('/login').reply(config => {
  const { email, password } = JSON.parse(config.data);
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...safeUser } = user;
    fakeToken = "mocked-token-" + user.id;
    currentUser = safeUser;
    return [200, { token: fakeToken, user: safeUser }];
  } else {
    return [401, { message: "Email hoặc mật khẩu không đúng." }];
  }
});

mock.onPost('/logout').reply(() => {
  fakeToken = null;
  currentUser = null;
  return [200, { message: "Đã đăng xuất thành công" }];
});

mock.onGet('/me').reply(config => {
  if (config.headers.Authorization === `Bearer ${fakeToken}` && currentUser) {
    return [200, currentUser];
  }
  return [401, { message: "Chưa đăng nhập" }];
});
