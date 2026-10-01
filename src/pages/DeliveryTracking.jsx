import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DeliveryTracking() {
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState("PLACED");
  const [orderTotal, setOrderTotal] = useState("0");
  const [paymentMode, setPaymentMode] = useState("");
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const savedOrderId = localStorage.getItem("orderId");
    const savedOrderStatus =
      localStorage.getItem("orderStatus") || "PLACED";
    const savedOrderTotal =
      localStorage.getItem("orderTotal") || "0";
    const savedPaymentMode =
      localStorage.getItem("orderPaymentMode") || "";

    setOrderId(savedOrderId || "");
    setOrderStatus(savedOrderStatus);
    setOrderTotal(savedOrderTotal);
    setPaymentMode(savedPaymentMode);

    if (
      savedOrderStatus === "DELIVERED" ||
      savedOrderStatus === "COMPLETED"
    ) {
      setProgress(100);
    } else if (
      savedOrderStatus === "OUT_FOR_DELIVERY"
    ) {
      setProgress(75);
    } else if (
      savedOrderStatus === "PREPARING" ||
      savedOrderStatus === "IN_PROGRESS"
    ) {
      setProgress(50);
    } else {
      setProgress(25);
    }
  }, []);

  const getStatusText = () => {
    if (orderStatus === "DELIVERED") {
      return "Order Delivered";
    }

    if (orderStatus === "COMPLETED") {
      return "Order Completed";
    }

    if (orderStatus === "OUT_FOR_DELIVERY") {
      return "Out for Delivery";
    }

    if (
      orderStatus === "PREPARING" ||
      orderStatus === "IN_PROGRESS"
    ) {
      return "Your Order Is Being Prepared";
    }

    return "Order Placed Successfully";
  };

  const getPaymentText = () => {
    if (paymentMode === "CASH_ON_DELIVERY") {
      return "Cash on Delivery";
    }

    if (paymentMode === "UPI") {
      return "UPI";
    }

    if (paymentMode === "CARD") {
      return "Credit / Debit Card";
    }

    if (paymentMode === "ONLINE") {
      return "Net Banking";
    }

    return paymentMode || "Not Available";
  };

  const refreshTracking = () => {
    const savedStatus =
      localStorage.getItem("orderStatus") || "PLACED";

    setOrderStatus(savedStatus);

    if (savedStatus === "DELIVERED") {
      setProgress(100);
    } else if (savedStatus === "OUT_FOR_DELIVERY") {
      setProgress(75);
    } else if (
      savedStatus === "PREPARING" ||
      savedStatus === "IN_PROGRESS"
    ) {
      setProgress(50);
    } else {
      setProgress(25);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px 16px",
        background:
          "linear-gradient(135deg, #f0fff4, #ffffff)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >

        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              color: "#176b45",
              marginBottom: "8px",
            }}
          >
            🚚 Delivery Tracking
          </h1>

          <p
            style={{
              color: "#555",
              margin: 0,
            }}
          >
            Track your Fruit Bowl order
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "25px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                Order ID
              </p>

              <h2
                style={{
                  margin: "5px 0 0",
                  color: "#222",
                }}
              >
                {orderId || "Recently Placed Order"}
              </h2>
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                Order Status
              </p>

              <strong
                style={{
                  display: "inline-block",
                  marginTop: "5px",
                  padding: "8px 14px",
                  borderRadius: "20px",
                  background: "#dff7e8",
                  color: "#176b45",
                }}
              >
                {orderStatus}
              </strong>
            </div>
          </div>

          <h2
            style={{
              color: "#176b45",
              marginBottom: "8px",
            }}
          >
            {getStatusText()}
          </h2>

          <p
            style={{
              color: "#666",
              lineHeight: "1.6",
            }}
          >
            Your order is moving through the delivery process.
            This is a tracking-style display for your application.
          </p>

          <div
            style={{
              height: "12px",
              background: "#e6e6e6",
              borderRadius: "20px",
              overflow: "hidden",
              marginTop: "22px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, #20a464, #79d64b)",
                borderRadius: "20px",
                transition: "width 0.5s ease",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
              marginTop: "10px",
              color: "#666",
              fontSize: "13px",
              flexWrap: "wrap",
            }}
          >
            <span>Placed</span>
            <span>Preparing</span>
            <span>Out for Delivery</span>
            <span>Delivered</span>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "25px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            marginBottom: "22px",
          }}
        >
          <h2
            style={{
              color: "#176b45",
              marginTop: 0,
            }}
          >
            📦 Delivery Information
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "15px",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#f5fff8",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                Estimated Time
              </p>

              <strong
                style={{
                  display: "block",
                  marginTop: "8px",
                  color: "#222",
                }}
              >
                30–45 minutes
              </strong>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#f5fff8",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                Total Amount
              </p>

              <strong
                style={{
                  display: "block",
                  marginTop: "8px",
                  color: "#222",
                }}
              >
                ₹{Number(orderTotal || 0).toFixed(2)}
              </strong>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#f5fff8",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                Payment Method
              </p>

              <strong
                style={{
                  display: "block",
                  marginTop: "8px",
                  color: "#222",
                }}
              >
                {getPaymentText()}
              </strong>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "25px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            marginBottom: "22px",
          }}
        >
          <h2
            style={{
              color: "#176b45",
              marginTop: 0,
            }}
          >
            🛵 Delivery Partner
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "75px",
                height: "75px",
                borderRadius: "50%",
                background: "#dff7e8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "38px",
              }}
            >
              🚚
            </div>

            <div>
              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#222",
                }}
              >
                Fruit Bowl Delivery
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#666",
                }}
              >
                Your delivery partner will bring your order
                to your selected address.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={refreshTracking}
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "13px 20px",
              background: "#176b45",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            🔄 Refresh Tracking
          </button>

          <button
            onClick={() => navigate("/my-orders")}
            style={{
              border: "1px solid #176b45",
              borderRadius: "10px",
              padding: "13px 20px",
              background: "#ffffff",
              color: "#176b45",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            📋 My Orders
          </button>

          <button
            onClick={() => navigate("/products")}
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "13px 20px",
              background: "#f0a500",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            🛍️ Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}

export default DeliveryTracking;