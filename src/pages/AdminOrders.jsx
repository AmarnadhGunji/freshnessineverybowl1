import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const statusOptions = [
    "PLACED",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8082/api/orders",
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

      data.forEach((order) => {
        fetchAddress(order.addressId);
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

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

      const data = await response.json();

      setAddresses((previous) => ({
        ...previous,
        [addressId]: data,
      }));
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8082/api/orders/${orderId}/status?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.orderId === orderId
            ? updatedOrder
            : order
        )
      );

      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusClass = (status) => {
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

  if (loading) {
    return (
      <div className="admin-orders-loading">
        <h2>Loading Orders...</h2>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">

      {/* HEADER */}

      <div className="admin-orders-header">

        <div>
          <h1>Admin Order Management</h1>

          <p>
            Manage customer orders and update their status.
          </p>
        </div>

        <button
          className="dashboard-btn"
          onClick={() =>
            navigate("/admin-dashboard")
          }
        >
          📊 Dashboard
        </button>

      </div>

      {/* ORDERS */}

      {orders.length === 0 ? (

        <div className="no-admin-orders">

          <h2>No Orders Found</h2>

          <p>
            There are currently no customer orders.
          </p>

        </div>

      ) : (

        <div className="admin-orders-list">

          {orders.map((order) => {

            const address =
              addresses[order.addressId];

            return (

              <div
                className="admin-order-card"
                key={order.orderId}
              >

                {/* ORDER HEADER */}

                <div className="admin-order-header">

                  <div>

                    <h2>
                      Order #{order.orderId}
                    </h2>

                    <p>
                      User ID: {order.userId}
                    </p>

                  </div>

                  <span
                    className={`admin-status-badge ${getStatusClass(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>

                </div>

                {/* ORDER INFORMATION */}

                <div className="admin-order-info">

                  <div className="admin-info-box">

                    <span>
                      Order Amount
                    </span>

                    <strong>
                      ₹{order.totalAmount}
                    </strong>

                  </div>

                  <div className="admin-info-box">

                    <span>
                      Payment Method
                    </span>

                    <strong>
                      {order.paymentMode}
                    </strong>

                  </div>

                  <div className="admin-info-box">

                    <span>
                      Payment Status
                    </span>

                    <strong className="payment-pending">
                      {order.paymentStatus}
                    </strong>

                  </div>

                  <div className="admin-info-box">

                    <span>
                      Order Date
                    </span>

                    <strong>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString()
                        : "N/A"}
                    </strong>

                  </div>

                </div>

                {/* DELIVERY ADDRESS */}

                <div className="admin-delivery-address">

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
                      Loading address...
                    </p>

                  )}

                </div>

                {/* STATUS */}

                <div className="admin-status-section">

                  <label>
                    Update Order Status
                  </label>

                  <select
                    value={order.orderStatus}
                    disabled={
                      updatingOrderId ===
                      order.orderId
                    }
                    onChange={(event) =>
                      updateStatus(
                        order.orderId,
                        event.target.value
                      )
                    }
                  >

                    {statusOptions.map(
                      (status) => (

                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>

                      )
                    )}

                  </select>

                  {updatingOrderId ===
                    order.orderId && (

                    <span className="updating-text">
                      Updating...
                    </span>

                  )}

                </div>

              </div>

            );
          })}

        </div>
      )}

    </div>
  );
}

export default AdminOrders;