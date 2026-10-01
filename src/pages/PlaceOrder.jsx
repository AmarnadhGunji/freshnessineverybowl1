import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";

function PlaceOrder() {
  const navigate = useNavigate();

  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTotal = localStorage.getItem("checkoutTotal");
    const savedPayment = localStorage.getItem("paymentMethod");

    setTotal(Number(savedTotal || 0));
    setPaymentMethod(savedPayment || "");
    setLoading(false);
  }, []);

  const getPaymentMode = () => {
    if (paymentMethod === "COD") {
      return "CASH_ON_DELIVERY";
    }

    if (paymentMethod === "UPI") {
      return "UPI";
    }

    if (paymentMethod === "CARD") {
      return "CARD";
    }

    if (paymentMethod === "NET_BANKING") {
      return "ONLINE";
    }

    return null;
  };

  const placeOrder = async () => {
    try {
      setError("");
      setPlacingOrder(true);

      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      const selectedAddressId =
        localStorage.getItem("selectedAddressId");

      if (!token || !savedUser) {
        setError("Please login before placing your order.");
        setPlacingOrder(false);
        return;
      }

      let user;

      try {
        user = JSON.parse(savedUser);
      } catch (parseError) {
        console.error("User parsing error:", parseError);
        setError("Invalid user information. Please login again.");
        setPlacingOrder(false);
        return;
      }

      if (!user?.userId) {
        setError("User information is missing. Please login again.");
        setPlacingOrder(false);
        return;
      }

      if (!selectedAddressId) {
        setError("Please select a delivery address.");
        setPlacingOrder(false);
        return;
      }

      const paymentMode = getPaymentMode();

      if (!paymentMode) {
        setError("Please select a valid payment method.");
        setPlacingOrder(false);
        return;
      }

      const url =
        `http://localhost:8082/api/orders` +
        `?userId=${user.userId}` +
        `&addressId=${selectedAddressId}` +
        `&paymentMode=${paymentMode}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseText = await response.text();

      console.log("Place order status:", response.status);
      console.log("Place order response:", responseText);

      if (!response.ok) {
        throw new Error(
          `Order failed (${response.status}) ${responseText}`
        );
      }

      let order = {};

      try {
        order = JSON.parse(responseText);
      } catch (parseError) {
        console.warn("Order response is not JSON.");
      }

      /*
       * Save order details for Delivery Tracking page.
       * Different backend field names are handled safely.
       */
      const createdOrderId =
        order.orderId ||
        order.id ||
        order.orderID ||
        "";

      const createdOrderStatus =
        order.orderStatus ||
        order.status ||
        "PLACED";

      const createdOrderTotal =
        order.totalAmount ||
        order.orderTotal ||
        order.total ||
        total;

      const createdPaymentMode =
        order.paymentMode ||
        paymentMode;

      localStorage.setItem(
        "orderId",
        String(createdOrderId)
      );

      localStorage.setItem(
        "orderStatus",
        String(createdOrderStatus)
      );

      localStorage.setItem(
        "orderTotal",
        String(createdOrderTotal)
      );

      localStorage.setItem(
        "orderPaymentMode",
        String(createdPaymentMode)
      );

      localStorage.removeItem("checkoutTotal");
      localStorage.removeItem("selectedAddressId");
      localStorage.removeItem("paymentMethod");
      localStorage.removeItem("upiId");
      localStorage.removeItem("selectedBank");

      alert("Order placed successfully!");

      // Important: open Delivery Tracking page
      navigate("/delivery-tracking");

    } catch (error) {
      console.error("Place order error:", error);

      setError(
        error.message ||
        "Something went wrong while placing the order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="place-order-page">
        <div className="place-order-container">
          <h2>Loading Order...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="place-order-page">
      <div className="place-order-container">

        <div className="place-order-header">
          <h1>🛍️ Place Your Order</h1>
          <p>
            Review your payment details before placing your order.
          </p>
        </div>

        {error && (
          <div className="place-order-error">
            {error}
          </div>
        )}

        <div className="place-order-content">

          <div className="place-order-card">
            <h2>Order Details</h2>

            <div className="order-detail-row">
              <span>Total Amount</span>
              <strong>₹{total.toFixed(2)}</strong>
            </div>

            <div className="order-detail-row">
              <span>Payment Method</span>

              <strong>
                {paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : paymentMethod === "UPI"
                  ? "UPI"
                  : paymentMethod === "CARD"
                  ? "Credit / Debit Card"
                  : paymentMethod === "NET_BANKING"
                  ? "Net Banking"
                  : "Not Selected"}
              </strong>
            </div>
          </div>

          <div className="place-order-card">
            <h2>🚚 Delivery</h2>

            <p>
              Your order will be delivered to your selected address.
            </p>

            <p className="delivery-info">
              Estimated delivery:
              <strong>30–45 minutes</strong>
            </p>
          </div>

          <div className="place-order-actions">

            <button
              className="place-order-button"
              onClick={placeOrder}
              disabled={placingOrder}
            >
              {placingOrder
                ? "Placing Order..."
                : "🛒 Place Order"}
            </button>

            <button
              className="back-payment-button"
              onClick={() => navigate("/payment")}
              disabled={placingOrder}
            >
              ← Back to Payment
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;