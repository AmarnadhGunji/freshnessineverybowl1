import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productImages from "../services/productImages";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCheckout();
  }, []);

  const loadCheckout = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const selectedAddressId =
      localStorage.getItem("selectedAddressId");

    if (!token || !userData) {
      setError("Please login to continue.");
      setLoading(false);
      return;
    }

    if (!selectedAddressId) {
      setError("Please select a delivery address first.");
      setLoading(false);
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch {
      setError("Invalid user information.");
      setLoading(false);
      return;
    }

    try {
      // Get cart items
      const cartResponse = await fetch(
        `http://localhost:8082/api/cart/${user.userId}/items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        cartResponse.status === 401 ||
        cartResponse.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Your session has expired. Please login again."
        );

        setLoading(false);
        return;
      }

      if (!cartResponse.ok) {
        throw new Error("Unable to load cart.");
      }

      const cartData = await cartResponse.json();

      // Get products
      const productResponse = await fetch(
        "http://localhost:8082/api/products"
      );

      if (!productResponse.ok) {
        throw new Error("Unable to load products.");
      }

      const productData = await productResponse.json();

      // Get selected address
      const addressResponse = await fetch(
        `http://localhost:8082/api/addresses/${selectedAddressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!addressResponse.ok) {
        throw new Error(
          "Unable to load delivery address."
        );
      }

      const addressData =
        await addressResponse.json();

      setCartItems(cartData);
      setProducts(productData);
      setAddress(addressData);

    } catch (error) {
      console.error(
        "Checkout loading error:",
        error
      );

      setError(
        error.message ||
        "Unable to load checkout information."
      );

    } finally {
      setLoading(false);
    }
  };

  const getProduct = (productId) => {
    return products.find(
      (product) =>
        product.productId === productId
    );
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => {
        const product =
          getProduct(item.productId);

        if (!product) {
          return total;
        }

        return (
          total +
          Number(product.price) *
          Number(item.quantity)
        );
      },
      0
    );
  };

  const continueToPayment = () => {
    if (!address) {
      setError(
        "Please select a delivery address."
      );
      return;
    }

    navigate("/payment");
  };

  if (loading) {
    return (
      <div className="checkout-page">

        <div className="checkout-loading">

          <div className="checkout-loading-icon">
            🛒
          </div>

          <h2>
            Loading checkout...
          </h2>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">

        <div className="checkout-error-card">

          <div className="checkout-error-icon">
            ⚠️
          </div>

          <h2>
            {error}
          </h2>

          <button
            className="checkout-primary-button"
            onClick={() =>
              navigate("/address")
            }
          >
            Go to Address
          </button>

        </div>

      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">

        <div className="checkout-error-card">

          <div className="checkout-error-icon">
            🛒
          </div>

          <h2>
            Your cart is empty.
          </h2>

          <button
            className="checkout-primary-button"
            onClick={() =>
              navigate("/products")
            }
          >
            Browse Products
          </button>

        </div>

      </div>
    );
  }

  const subtotal = getSubtotal();
  const deliveryCharge = 0;
  const total =
    subtotal + deliveryCharge;

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        {/* HEADER */}

        <div className="checkout-header">

          <div>
            <h1>
              🧾 Checkout
            </h1>

            <p>
              Review your order before payment.
            </p>
          </div>

          <button
            className="checkout-back-button"
            onClick={() =>
              navigate("/address")
            }
          >
            ← Back to Address
          </button>

        </div>

        <div className="checkout-content">

          {/* LEFT SIDE */}

          <div className="checkout-left">

            {/* DELIVERY ADDRESS */}

            <div className="checkout-card">

              <div className="checkout-card-header">

                <h2>
                  📍 Delivery Address
                </h2>

                <button
                  onClick={() =>
                    navigate("/address")
                  }
                >
                  Change
                </button>

              </div>

              {address && (

                <div className="checkout-address">

                  <h3>
                    {address.houseNo}
                  </h3>

                  <p>
                    {address.street}
                  </p>

                  <p>
                    {address.area}
                  </p>

                  <p>
                    {address.city},{" "}
                    {address.state}
                  </p>

                  <p>
                    <strong>
                      Pincode:
                    </strong>{" "}
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

                </div>

              )}

            </div>

            {/* ORDER ITEMS */}

            <div className="checkout-card">

              <h2>
                🛍️ Order Items
              </h2>

              <div className="checkout-items">

                {cartItems.map((item) => {

                  const product =
                    getProduct(
                      item.productId
                    );

                  if (!product) {
                    return null;
                  }

                  const imagePath =
                    productImages[
                      product.productId
                    ];

                  const itemTotal =
                    Number(product.price) *
                    Number(item.quantity);

                  return (
                    <div
                      className="checkout-item"
                      key={item.cartItemId}
                    >

                      <div className="checkout-item-image">

                        {imagePath ? (
                          <img
                            src={imagePath}
                            alt={
                              product.productName
                            }
                          />
                        ) : (
                          <span>
                            🍓
                          </span>
                        )}

                      </div>

                      <div className="checkout-item-info">

                        <h3>
                          {product.productName}
                        </h3>

                        <p>
                          ₹
                          {Number(
                            product.price
                          ).toFixed(2)}
                          {" "}×{" "}
                          {item.quantity}
                        </p>

                      </div>

                      <strong>
                        ₹
                        {itemTotal.toFixed(2)}
                      </strong>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>

            <div className="checkout-summary-row">

              <span>
                Items
              </span>

              <span>
                {cartItems.reduce(
                  (total, item) =>
                    total +
                    Number(item.quantity),
                  0
                )}
              </span>

            </div>

            <div className="checkout-summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹
                {subtotal.toFixed(2)}
              </span>

            </div>

            <div className="checkout-summary-row">

              <span>
                Delivery
              </span>

              <span className="checkout-free">
                FREE
              </span>

            </div>

            <div className="checkout-divider"></div>

            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {total.toFixed(2)}
              </strong>

            </div>

            <button
              className="payment-button"
              onClick={continueToPayment}
            >
              Continue to Payment →
            </button>

            <button
              className="checkout-shopping-button"
              onClick={() =>
                navigate("/cart")
              }
            >
              ← Back to Cart
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;