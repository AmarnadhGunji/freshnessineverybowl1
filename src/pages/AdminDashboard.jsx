import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Admin login required.");
        return;
      }

      // =================================================
      // FETCH ORDERS
      // =================================================

      const ordersResponse = await fetch(
        "http://localhost:8082/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!ordersResponse.ok) {
        throw new Error(
          `Failed to fetch orders (${ordersResponse.status})`
        );
      }

      const ordersData =
        await ordersResponse.json();

      setOrders(ordersData);

      // =================================================
      // FETCH PRODUCTS
      // =================================================

      const productsResponse = await fetch(
        "http://localhost:8082/api/products"
      );

      if (!productsResponse.ok) {
        throw new Error(
          `Failed to fetch products (${productsResponse.status})`
        );
      }

      const productsData =
        await productsResponse.json();

      setProducts(productsData);

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setError(
        error.message ||
        "Unable to load dashboard."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  // =====================================================
  // PRODUCT COUNTS
  // =====================================================

  const totalProducts = products.length;

  const availableProducts =
    products.filter(
      (product) =>
        product.available === true
    ).length;

  const disabledProducts =
    products.filter(
      (product) =>
        product.available !== true
    ).length;

  // =====================================================
  // ORDER COUNTS
  // =====================================================

  const totalOrders = orders.length;

  const placedOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "PLACED"
    ).length;

  const confirmedOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "CONFIRMED"
    ).length;

  const preparingOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "PREPARING"
    ).length;

  const outForDeliveryOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "OUT_FOR_DELIVERY"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "DELIVERED"
    ).length;

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.orderStatus === "CANCELLED"
    ).length;

  // =====================================================
  // TOTAL SALES
  // =====================================================

  const totalSales = orders
    .filter(
      (order) =>
        order.orderStatus !== "CANCELLED"
    )
    .reduce(
      (total, order) =>
        total +
        Number(order.totalAmount || 0),
      0
    );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-dashboard-loading">

        <div className="loading-box">

          <div className="loading-spinner"></div>

          <h2>
            Loading Dashboard...
          </h2>

          <p>
            Please wait while we load
            your dashboard.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="admin-dashboard-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-dashboard-header">

        <div>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage your Fruit Bowl
            application from one place.
          </p>

        </div>

        <div className="header-buttons">

          <button
            className="refresh-dashboard-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

          <button
            className="view-orders-btn"
            onClick={() =>
              navigate("/admin-orders")
            }
          >
            📦 View Orders
          </button>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="dashboard-error">
          ❌ {error}
        </div>
      )}

      {/* =================================================
          PRODUCT OVERVIEW
      ================================================= */}

      <div className="dashboard-section-title">

        <div>
          <h2>
            Product Overview
          </h2>

          <p>
            Current product availability.
          </p>
        </div>

        <button
          className="manage-products-btn"
          onClick={() =>
            navigate("/admin-products")
          }
        >
          🛍 Manage Products
        </button>

      </div>

      <div className="dashboard-cards product-cards">

        {/* TOTAL PRODUCTS */}

        <div className="dashboard-card product-total-card">

          <div className="card-icon">
            🛍️
          </div>

          <div>

            <h3>
              Total Products
            </h3>

            <strong>
              {totalProducts}
            </strong>

          </div>

        </div>

        {/* AVAILABLE PRODUCTS */}

        <div className="dashboard-card product-available-card">

          <div className="card-icon">
            ✅
          </div>

          <div>

            <h3>
              Available Products
            </h3>

            <strong>
              {availableProducts}
            </strong>

          </div>

        </div>

        {/* DISABLED PRODUCTS */}

        <div className="dashboard-card product-disabled-card">

          <div className="card-icon">
            🚫
          </div>

          <div>

            <h3>
              Disabled Products
            </h3>

            <strong>
              {disabledProducts}
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          ORDER OVERVIEW
      ================================================= */}

      <div className="dashboard-section-title">

        <div>

          <h2>
            Order Overview
          </h2>

          <p>
            Monitor customer orders and sales.
          </p>

        </div>

      </div>

      <div className="dashboard-cards">

        {/* TOTAL ORDERS */}

        <div className="dashboard-card total-card">

          <div className="card-icon">
            🛒
          </div>

          <div>

            <h3>
              Total Orders
            </h3>

            <strong>
              {totalOrders}
            </strong>

          </div>

        </div>

        {/* PLACED */}

        <div className="dashboard-card placed-card">

          <div className="card-icon">
            📦
          </div>

          <div>

            <h3>
              Placed
            </h3>

            <strong>
              {placedOrders}
            </strong>

          </div>

        </div>

        {/* CONFIRMED */}

        <div className="dashboard-card confirmed-card">

          <div className="card-icon">
            ✅
          </div>

          <div>

            <h3>
              Confirmed
            </h3>

            <strong>
              {confirmedOrders}
            </strong>

          </div>

        </div>

        {/* PREPARING */}

        <div className="dashboard-card preparing-card">

          <div className="card-icon">
            👨‍🍳
          </div>

          <div>

            <h3>
              Preparing
            </h3>

            <strong>
              {preparingOrders}
            </strong>

          </div>

        </div>

        {/* OUT FOR DELIVERY */}

        <div className="dashboard-card delivery-card">

          <div className="card-icon">
            🚚
          </div>

          <div>

            <h3>
              Out for Delivery
            </h3>

            <strong>
              {outForDeliveryOrders}
            </strong>

          </div>

        </div>

        {/* DELIVERED */}

        <div className="dashboard-card delivered-card">

          <div className="card-icon">
            🎉
          </div>

          <div>

            <h3>
              Delivered
            </h3>

            <strong>
              {deliveredOrders}
            </strong>

          </div>

        </div>

        {/* CANCELLED */}

        <div className="dashboard-card cancelled-card">

          <div className="card-icon">
            ❌
          </div>

          <div>

            <h3>
              Cancelled
            </h3>

            <strong>
              {cancelledOrders}
            </strong>

          </div>

        </div>

        {/* SALES */}

        <div className="dashboard-card sales-card">

          <div className="card-icon">
            💰
          </div>

          <div>

            <h3>
              Total Sales
            </h3>

            <strong>
              ₹{totalSales.toFixed(2)}
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <div className="quick-actions-section">

        <h2>
          Quick Actions
        </h2>

        <p>
          Quickly access your admin modules.
        </p>

        <div className="quick-actions">

          <button
            onClick={() =>
              navigate("/admin-products")
            }
            className="quick-action products-action"
          >
            <span>
              🛍️
            </span>

            <div>
              <strong>
                Manage Products
              </strong>

              <small>
                Add, update or disable products
              </small>
            </div>
          </button>

          <button
            onClick={() =>
              navigate("/admin-orders")
            }
            className="quick-action orders-action"
          >
            <span>
              📦
            </span>

            <div>
              <strong>
                Manage Orders
              </strong>

              <small>
                View and update customer orders
              </small>
            </div>
          </button>

        </div>

      </div>

      {/* =================================================
          ORDER SUMMARY
      ================================================= */}

      <div className="order-summary-section">

        <div className="summary-header">

          <div>

            <h2>
              Order Summary
            </h2>

            <p>
              Current status of customer
              orders.
            </p>

          </div>

          <button
            className="summary-orders-btn"
            onClick={() =>
              navigate("/admin-orders")
            }
          >
            Manage Orders
          </button>

        </div>

        <div className="summary-table">

          <div className="summary-row summary-heading">

            <span>
              Status
            </span>

            <span>
              Orders
            </span>

          </div>

          <div className="summary-row">

            <span>
              PLACED
            </span>

            <strong>
              {placedOrders}
            </strong>

          </div>

          <div className="summary-row">

            <span>
              CONFIRMED
            </span>

            <strong>
              {confirmedOrders}
            </strong>

          </div>

          <div className="summary-row">

            <span>
              PREPARING
            </span>

            <strong>
              {preparingOrders}
            </strong>

          </div>

          <div className="summary-row">

            <span>
              OUT FOR DELIVERY
            </span>

            <strong>
              {outForDeliveryOrders}
            </strong>

          </div>

          <div className="summary-row">

            <span>
              DELIVERED
            </span>

            <strong>
              {deliveredOrders}
            </strong>

          </div>

          <div className="summary-row">

            <span>
              CANCELLED
            </span>

            <strong>
              {cancelledOrders}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;