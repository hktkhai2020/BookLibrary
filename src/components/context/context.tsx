import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { loginAccountAPI } from "services/api.service";

interface IAppContext {
  isUser: IUser | null;
  setUser: (u: IUser | null) => void;
  isAppGlobalLoading: boolean;
  shoppingCart: IShoppingCart[];
  setShoppingCart: (cart: IShoppingCart[]) => void;
}
interface IShoppingCart {
  _id: string;
  quantity: number;
  detail: IBookTable;
}
export const AuthContext = createContext<IAppContext | null>(null);

export const AppContext = ({ children }: { children: React.ReactNode }) => {
  const [isUser, setUser] = useState<IUser | null>(null);
  const [isAppGlobalLoading, setIsAppLoading] = useState(false);
  const [shoppingCart, setShoppingCart] = useState<IShoppingCart[]>([]);
  const delay = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  const fetchAccountAPI = useCallback(async () => {
    setIsAppLoading(true);
    if (localStorage.getItem("access_token")) {
      const res = await loginAccountAPI();
      await delay(1000);
      if (res?.data?.data?.user) {
        setUser(res.data.data.user);
        if (res.data.data.access_token) {
          localStorage.setItem("access_token", res.data.data.access_token);
        }
      }
    }

    setIsAppLoading(false);
  }, []);
  useEffect(() => {
    fetchAccountAPI();
  }, []);
  useEffect(() => {
    if (localStorage.getItem("shoppingCart")) {
      setShoppingCart(JSON.parse(localStorage.getItem("shoppingCart") || "[]"));
    }
  }, []);

  const value = useMemo(
    () => ({
      isUser,
      setUser,
      isAppGlobalLoading,
      setIsAppLoading,
      shoppingCart,
      setShoppingCart,
    }),
    [isUser, isAppGlobalLoading, shoppingCart]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useCurrentContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("Loi context !");
  }
  return ctx;
};
