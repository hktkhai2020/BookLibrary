export {};

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    results: T[];
  }
  interface ILogin {
    access_token: string;
    user: {
      email: string;
      phone: string;
      fullName: string;
      role: string;
      avatar: string;
      id: string;
    };
  }

  interface IUser {
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    id: string;
  }
  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
  interface IUserTable {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    isActive: boolean;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    __v: 0;
  }
  interface IBookTable {
    _id: string;
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    __v: 0;
  }
  interface IOrderTable {
    name: string;
    address: string;
    phone: string;
    totalPrice: number;
    type: string;
    detail: {
      bookName: string;
      quantity: number;
      _id: string;
    }[];
  }
  interface IOrderTable {
    _id: string;
    name: string;
    address: string;
    phone: string;
    type: string;
    paymentStatus: string;
    paymentRef: string;
    detail: {
      bookName: string;
      quantity: number;
      _id: string;
    }[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }
}
// định nghĩa các kiểu toàn cục ở đây nếu cần thiết
// tránh sử dụng 'declare module' trong các file này để không gây nhầm lẫn
