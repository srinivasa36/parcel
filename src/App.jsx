import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import PageLoader from "./components/ui/PageLoader";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {[
          ["index", Home],
          ["shop", Shop],
          ["product/:id", Product],
          ["cart", Cart],
          ["wishlist", Wishlist],
          ["login", Login],
          ["register", Register],
          ["forgot-password", ForgotPassword],
        ].map(([path, Page]) =>
          path === "index" ? (
            <Route
              key={path}
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <Page />
                </Suspense>
              }
            />
          ) : (
            <Route
              key={path}
              path={path}
              element={
                <Suspense fallback={<PageLoader />}>
                  <Page />
                </Suspense>
              }
            />
          ),
        )}

        <Route element={<ProtectedRoute />}>
          <Route
            path="checkout"
            element={
              <Suspense fallback={<PageLoader />}>
                <Checkout />
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense fallback={<PageLoader />}>
                <Orders />
              </Suspense>
            }
          />
          <Route
            path="orders/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <OrderDetail />
              </Suspense>
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
