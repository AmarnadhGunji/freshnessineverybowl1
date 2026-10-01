import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import PlaceOrder from "./pages/PlaceOrder";
import DeliveryTracking from "./pages/DeliveryTracking";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";

import AdminOrders from "./pages/AdminOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* =========================
            CUSTOMER PAGES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/address"
          element={<Address />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/place-order"
          element={<PlaceOrder />}
        />

        {/* DELIVERY TRACKING */}

        <Route
          path="/delivery-tracking"
          element={<DeliveryTracking />}
        />

        {/* MY ORDERS */}

        <Route
          path="/my-orders"
          element={<MyOrders />}
        />

        {/* ORDER DETAILS */}

        <Route
          path="/order-details/:orderId"
          element={<OrderDetails />}
        />

        {/* =========================
            ADMIN PAGES
        ========================= */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin-orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin-products"
          element={<AdminProducts />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;