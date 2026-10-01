import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH ORDERS
  // =========================

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      if (!userData) {
        setError("User information not found.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);

      const response = await fetch(
        `http://localhost:8082/api/orders/user/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);

      // Fetch address for every order
      data.forEach((order) => {
        fetchAddress(order.addressId);
      });

    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH ADDRESS
  // =========================

  const fetchAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8082/api/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const addressData = await response.json();

      setAddresses((previous) => ({
        ...previous,
        [addressId]: addressData,
      }));

    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  // =========================
  // TRACK ORDER
  // =========================

  const handleTrackOrder = (order) => {
    // Save selected order information
    // for Delivery Tracking page

    localStorage.setItem(
      "orderId",
      String(order.orderId)
    );

    localStorage.setItem(
      "orderStatus",
      order.orderStatus ||
        order.status ||
        "PLACED"
    );

    localStorage.setItem(
      "orderTotal",
      String(
        order.totalAmount ||
          order.orderTotal ||
          order.total ||
          0
      )
    );

    localStorage.setItem(
      "orderPaymentMode",
      order.paymentMode || ""
    );

    // Go to Delivery Tracking
    navigate("/delivery-tracking");
  };

  // =========================
  // ORDER STATUS CLASS
  // =========================

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "status-placed";

      case "CONFIRMED":
        return "status-confirmed";

      case "PREPARING":
        return "status-preparing";

      case "OUT_FOR_DELIVERY":
        return "status-delivery";

      case "DELIVERED":
        return "status-delivered";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "";
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="loading">
        Loading your orders...
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="my-orders-container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  // =========================
  // NO ORDERS
  // =========================

  if (orders.length === 0) {
    return (
      <div className="my-orders-container">

        <h1>My Orders</h1>

        <div className="no-orders">

          <h2>No Orders Found</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // ORDERS PAGE
  // =========================

  return (
    <div className="my-orders-container">

      <h1>My Orders</h1>

      <div className="orders-list">

        {orders.map((order) => {

          const address =
            addresses[order.addressId];

          return (
            <div
              className="order-card"
              key={order.orderId}
              onClick={() =>
                handleTrackOrder(order)
              }
              style={{
                cursor: "pointer",
              }}
            >

              {/* =========================
                  ORDER TITLE
              ========================= */}

              <h3>
                Order #{order.orderId}
              </h3>

              {/* =========================
                  ORDER INFORMATION
              ========================= */}

              <div className="order-info">

                <p>
                  <strong>Total Amount:</strong>{" "}
                  ₹{order.totalAmount}
                </p>

                <p>
                  <strong>Payment Method:</strong>{" "}
                  {order.paymentMode}
                </p>

                <p>
                  <strong>Payment Status:</strong>{" "}

                  <span className="payment-status">
                    {order.paymentStatus}
                  </span>

                </p>

                <p>
                  <strong>Order Status:</strong>{" "}

                  <span
                    className={`order-status ${getOrderStatusClass(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>

                </p>

                <p>
                  <strong>Order Date:</strong>{" "}

                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleString()
                    : "N/A"}

                </p>

                {/* =========================
                    DELIVERY ADDRESS
                ========================= */}

                <div className="delivery-address">

                  <strong>
                    📍 Delivery Address
                  </strong>

                  {address ? (
                    <>
                      <p>
                        {address.houseNo},{" "}
                        {address.street}
                      </p>

                      <p>
                        {address.area}
                      </p>

                      <p>
                        {address.city},{" "}
                        {address.state} -{" "}
                        {address.pincode}
                      </p>

                      {address.landmark && (
                        <p>
                          <strong>
                            Landmark:
                          </strong>{" "}
                          {address.landmark}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>
                      Loading address...
                    </p>
                  )}

                </div>

              </div>

              {/* =========================
                  BUTTONS
              ========================= */}

              <div className="order-actions">

                <button
                  className="view-order-btn"
                  onClick={(event) => {
                    event.stopPropagation();

                    navigate(
                      `/order-details/${order.orderId}`
                    );
                  }}
                >
                  View Order Details
                </button>

                <button
                  className="continue-shopping-btn"
                  onClick={(event) => {
                    event.stopPropagation();

                    navigate("/products");
                  }}
                >
                  Continue Shopping
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default MyOrders;