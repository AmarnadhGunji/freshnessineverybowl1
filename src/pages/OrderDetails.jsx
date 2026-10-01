import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderDetails.css";

function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH ORDER DETAILS
  // =========================

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view order details.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8082/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const orderData = await response.json();

      setOrder(orderData);

      // =========================
      // FETCH DELIVERY ADDRESS
      // =========================

      if (orderData.addressId) {
        const addressResponse = await fetch(
          `http://localhost:8082/api/addresses/${orderData.addressId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (addressResponse.ok) {
          const addressData =
            await addressResponse.json();

          setAddress(addressData);
        }
      }

    } catch (err) {
      console.error(
        "Error fetching order details:",
        err
      );

      setError(
        "Failed to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TRACK DELIVERY
  // =========================

  const handleTrackDelivery = () => {
    if (!order) {
      return;
    }

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

    navigate("/delivery-tracking");
  };

  // =========================
  // STATUS CLASS
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
        Loading order details...
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="order-details-container">
        <div className="error-message">
          {error}
        </div>

        <button
          onClick={() => navigate("/my-orders")}
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  // =========================
  // ORDER NOT FOUND
  // =========================

  if (!order) {
    return (
      <div className="order-details-container">

        <h1>Order Details</h1>

        <p>
          Order details not found.
        </p>

        <button
          onClick={() => navigate("/my-orders")}
        >
          Back to My Orders
        </button>

      </div>
    );
  }

  // =========================
  // ORDER DETAILS PAGE
  // =========================

  return (
    <div className="order-details-container">

      <h1>Order Details</h1>

      {/* =========================
          ORDER SUMMARY
      ========================= */}

      <div className="order-details-card">

        <h2>
          Order #{order.orderId}
        </h2>

        <div className="order-details-info">

          <p>
            <strong>
              Total Amount:
            </strong>{" "}
            ₹{order.totalAmount}
          </p>

          <p>
            <strong>
              Payment Method:
            </strong>{" "}
            {order.paymentMode}
          </p>

          <p>
            <strong>
              Payment Status:
            </strong>{" "}

            <span className="payment-status">
              {order.paymentStatus}
            </span>
          </p>

          <p>
            <strong>
              Order Status:
            </strong>{" "}

            <span
              className={`order-status ${getOrderStatusClass(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>
          </p>

          <p>
            <strong>
              Order Date:
            </strong>{" "}

            {order.createdAt
              ? new Date(
                  order.createdAt
                ).toLocaleString()
              : "N/A"}
          </p>

        </div>

        {/* =========================
            DELIVERY ADDRESS
        ========================= */}

        <div className="delivery-address">

          <h3>
            📍 Delivery Address
          </h3>

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
              Delivery address not available.
            </p>
          )}

        </div>

        {/* =========================
            ACTION BUTTONS
        ========================= */}

        <div className="order-actions">

          {/* TRACK DELIVERY */}

          <button
            className="track-delivery-btn"
            onClick={handleTrackDelivery}
          >
            🚚 Track Delivery
          </button>

          {/* BACK TO ORDERS */}

          <button
            className="continue-shopping-btn"
            onClick={() =>
              navigate("/my-orders")
            }
          >
            Back to My Orders
          </button>

          {/* CONTINUE SHOPPING */}

          <button
            className="continue-shopping-btn"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue Shopping
          </button>

        </div>

      </div>

    </div>
  );
}

export default OrderDetails;