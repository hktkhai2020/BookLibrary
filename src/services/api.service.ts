import { UploadFile } from "antd";
import instance from "services/axios.customize";

const LoginApi = async (username: string, password: string) => {
  const BACKEND_URL = "/api/v1/auth/login";
  const data = {
    username,
    password,
  };
  return await instance.post<IBackendRes<ILogin>>(BACKEND_URL, data, {
    headers: {
      // delay:5000,
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
  phone: string,
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
const createUser = (
  fullName: string,
  email: string,
  password: string,
  phone: string,
) => {
  const BACKEND_URL = "/api/v1/user";
  const data = {
    fullName,
    email,
    password,
    phone,
  };
  return instance.post(BACKEND_URL, data);
};
const importListUser = (data: Partial<IUserTable>[]) => {
  const BACKEND_URL = "/api/v1/user/bulk-create";
  return instance.post(BACKEND_URL, data);
};
const updateUser = (data: Partial<IUserTable>) => {
  const BACKEND_URL = `/api/v1/user/`;
  return instance.put(BACKEND_URL, data);
};
const deleteUser = (id: string) => {
  const BACKEND_URL = `/api/v1/user/${id}`;
  return instance.delete(BACKEND_URL);
};
const getBooksAPI = (query: string) => {
  const BACKEND_URL = `/api/v1/book?${query}`;
  return instance.get(BACKEND_URL);
};
const getBookDetailAPI = (id: string) => {
  const BACKEND_URL = `/api/v1/book/${id}`;
  return instance.get(BACKEND_URL, {
    headers: {
      delay: 1000,
    },
  });
};
const deleteBook = (id: string) => {
  const BACKEND_URL = `/api/v1/book/${id}`;
  return instance.delete(BACKEND_URL);
};

const createBook = (
  thumbnail: UploadFile[],
  slider: UploadFile[],
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string,
) => {
  const BACKEND_URL = `/api/v1/book`;
  console.log(thumbnail, slider);
  const data = {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    category,
  };
  return instance.post(BACKEND_URL, data);
};
const uploadImage = (file: File | UploadFile, folder: string) => {
  const BACKEND_URL = "/api/v1/file/upload";
  const config = {
    headers: {
      "upload-type": folder,
      "Content-type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", file as File);
  return instance.post(BACKEND_URL, bodyFormData, config);
};
const updateBook = (data: Partial<IBookTable>, _id: string) => {
  const BACKEND_URL = `/api/v1/book/${_id}`;
  return instance.put(BACKEND_URL, data);
};

const createOrder = (data: IOrderTable) => {
  const BACKEND_URL = `/api/v1/order`;
  return instance.post(BACKEND_URL, data);
};
const ordersHistoryAPI = () => {
  const BACKEND_URL = `/api/v1/history`;
  return instance.get(BACKEND_URL);
};

const updatePasswordAPI = (data: {
  email: string;
  oldpass: string;
  newpass: string;
}) => {
  const BACKEND_URL = `/api/v1/user/change-password`;
  return instance.post(BACKEND_URL, data);
};
const updateInfoAPI = (data: {
  fullName: string;
  phone: string;
  avatar: string;
  _id: string;
}) => {
  const BACKEND_URL = `/api/v1/user`;
  return instance.put(BACKEND_URL, data);
};
const uploadAvatarAPI = (file: File | UploadFile) => {
  const BACKEND_URL = "/api/v1/file/upload";
  const config = {
    headers: {
      "upload-type": "avatar",
      "Content-type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", file as File);
  return instance.post(BACKEND_URL, bodyFormData, config);
};
const dashboardAPI = () => {
  const BACKEND_URL = `/api/v1/database/dashboard`;
  return instance.get(BACKEND_URL);
};
const listOrderAPI = (query: string) => {
  const BACKEND_URL = `/api/v1/order?${query}`;
  return instance.get(BACKEND_URL);
};
export {
  LoginApi,
  loginAccountAPI,
  logoutAccountAPI,
  registerAPI,
  getUserAPI,
  createUser,
  importListUser,
  updateUser,
  deleteUser,
  getBooksAPI,
  getBookDetailAPI,
  deleteBook,
  createBook,
  uploadImage,
  updateBook,
  createOrder,
  ordersHistoryAPI,
  updatePasswordAPI,
  updateInfoAPI,
  uploadAvatarAPI,
  dashboardAPI,
  listOrderAPI,
};
