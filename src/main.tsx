import { createRoot } from "react-dom/client";
import Layout from "@/layout.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "styles/global.css";
import Login from "@/pages/client/authentication/login";
import Register from "@/pages/client/authentication/register";
import HomePage from "@/pages/client/home";
import BookPage from "@/pages/client/book";
import AboutPage from "@/pages/client/about";
import { AppContext } from "@/components/context/context";
import "nprogress/nprogress.css";
import PrivateRoute from "pages/private.router";
import LayoutAdmin from "components/layout/layout.admin";
import DashboardPage from "pages/admin/dashboard";
import ManagerBookPage from "pages/admin/manager.book";
import ManagerOrderPage from "pages/admin/manager.order";
import ManagerUserPage from "pages/admin/manager.user";
import { App, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import { ThemeVariablesProvider } from "@/components/theme/theme.provider";
import OrderPage from "@/pages/client/order";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: "",
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/book/",
        element: (
          <PrivateRoute>
            <BookPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/about",
        element: (
          <PrivateRoute>
            <AboutPage />
          </PrivateRoute>
        ),
      },
      {
        path: "book/:id",
        element: <BookPage />,
      },
      {
        path: "order",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      }
    ],
  },
  {
    path: "admin",
    element: (
      <PrivateRoute>
        <LayoutAdmin />
      </PrivateRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        ),
      },
      {
        path: "order",
        element: (
          <PrivateRoute>
            <ManagerOrderPage />
          </PrivateRoute>
        ),
      },
      {
        path: "book",
        element: (
          <PrivateRoute>
            <ManagerBookPage />
          </PrivateRoute>
        ),
      },
      {
        path: "user",
        element: (
          <PrivateRoute>
            <ManagerUserPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <App>
    <AppContext>
      <ConfigProvider locale={enUS}>
        <ThemeVariablesProvider>
          <RouterProvider router={router} />
        </ThemeVariablesProvider>
      </ConfigProvider>
    </AppContext>
  </App>
  // </StrictMode>
);
