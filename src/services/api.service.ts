import instance from "services/axios.customize";

const LoginApi = async (username: string, password: string) => {
  const BACKEND_URL = "/api/v1/auth/login";
  const data = {
    username,
    password,
  };
  return await instance.post<IBackendRes<ILogin>>(BACKEND_URL, data, {
    headers: {
      delay: "2000",
    },
  });
};
const loginAccountAPI = () => {
  const BACKEND_URL = "/api/v1/auth/account";
  return instance.get(BACKEND_URL);
};
const logoutAccountAPI = () => {
  const BACKEND_URL = "/api/v1/auth/logout";
  return instance.post(BACKEND_URL);
};
const registerAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const BACKEND_URL = "/api/v1/user/register";
  const data = {
    fullName,
    email,
    password,
    phone,
  };
  return instance.post(BACKEND_URL, data);
};
const getUserAPI = (query: string) => {
  const BACKEND_URL = `/api/v1/user?${query}`;
  // return instance.get<IBackendRes<IModelPaginate<IUserTable>>>(BACKEND_URL);
  return instance.get(BACKEND_URL);
};

export { LoginApi, loginAccountAPI, logoutAccountAPI, registerAPI, getUserAPI };
