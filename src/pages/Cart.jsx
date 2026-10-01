import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productImages from "../services/productImages";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingItemId, setUpdatingItemId] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      setError("Please login to view your cart.");
      setLoading(false);
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch {
      setError("Invalid user information. Please login again.");
      setLoading(false);
      return;
    }

    if (!user.userId) {
      setError("User information not found.");
      setLoading(false);
      return;
    }

    try {
      const cartResponse = await fetch(
        `http://localhost:8082/api/cart/${user.userId}/items`,
        {
          method: "GET",
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
        throw new Error("Unable to load cart items.");
      }

      const cartData = await cartResponse.json();

      console.log("Cart items:", cartData);

      const productResponse = await fetch(
        "http://localhost:8082/api/products"
      );

      if (!productResponse.ok) {
        throw new Error(
          "Unable to load product information."
        );
      }

      const productData = await productResponse.json();

      console.log("Products:", productData);

      setCartItems(cartData);
      setProducts(productData);

    } catch (error) {
      console.error(
        "Cart loading error:",
        error
      );

      setError(
        error.message ||
        "Unable to load your cart."
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

  const updateQuantity = async (
    cartItemId,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    const token =
      localStorage.getItem("token");

    setUpdatingItemId(cartItemId);

    try {
      const response = await fetch(
        `http://localhost:8082/api/cart/item/${cartItemId}?quantity=${newQuantity}`,
        {
          method: "PUT",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to update quantity."
        );
      }

      await loadCart();

    } catch (error) {
      console.error(
        "Quantity update error:",
        error
      );

      setError(
        error.message ||
        "Unable to update quantity."
      );

    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeItem = async (cartItemId) => {
    const token =
      localStorage.getItem("token");

    setUpdatingItemId(cartItemId);

    try {
      const response = await fetch(
        `http://localhost:8082/api/cart/item/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to remove item."
        );
      }

      await loadCart();

    } catch (error) {
      console.error(
        "Remove item error:",
        error
      );

      setError(
        error.message ||
        "Unable to remove item."
      );

    } finally {
      setUpdatingItemId(null);
    }
  };

  const getTotal = () => {
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

  /*
   * GO TO DELIVERY ADDRESS
   */
  const goToAddress = () => {
    navigate("/address");
  };

  if (loading) {
    return (
      <div className="cart-page">

        <div className="cart-loading">

          <div className="cart-loading-icon">
            🛒
          </div>

          <h2>
            Loading your cart...
          </h2>

        </div>

      </div>
    );
  }

  if (error && cartItems.length === 0) {
    return (
      <div className="cart-page">

        <div className="cart-empty-card">

          <div className="cart-empty-icon">
            🛒
          </div>

          <h2>
            {error}
          </h2>

          <button
            className="cart-primary-button"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

        </div>

      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">

        <div className="cart-empty-card">

          <div className="cart-empty-icon">
            🛒
          </div>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Add some delicious products
            to your cart.
          </p>

          <button
            className="cart-primary-button"
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

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* CART HEADER */}

        <div className="cart-header">

          <div>

            <h1>
              🛒 My Cart
            </h1>

            <p>
              Review your selected products
            </p>

          </div>

          <button
            className="continue-shopping-button"
            onClick={() =>
              navigate("/products")
            }
          >
            ← Continue Shopping
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="cart-error">
            {error}
          </div>
        )}

        <div className="cart-content">

          {/* CART ITEMS */}

          <div className="cart-items">

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
                  className="cart-item"
                  key={item.cartItemId}
                >

                  {/* PRODUCT IMAGE */}

                  <div className="cart-item-image">

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

                  {/* PRODUCT INFORMATION */}

                  <div className="cart-item-info">

                    <h2>
                      {product.productName}
                    </h2>

                    <p>
                      ₹
                      {Number(
                        product.price
                      ).toFixed(2)}
                      {" "}each
                    </p>

                    <strong>
                      ₹
                      {itemTotal.toFixed(2)}
                    </strong>

                  </div>

                  {/* QUANTITY */}

                  <div className="cart-quantity">

                    <button
                      disabled={
                        updatingItemId ===
                          item.cartItemId ||
                        item.quantity <= 1
                      }
                      onClick={() =>
                        updateQuantity(
                          item.cartItemId,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      disabled={
                        updatingItemId ===
                        item.cartItemId
                      }
                      onClick={() =>
                        updateQuantity(
                          item.cartItemId,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  {/* REMOVE */}

                  <button
                    className="remove-cart-button"
                    disabled={
                      updatingItemId ===
                      item.cartItemId
                    }
                    onClick={() =>
                      removeItem(
                        item.cartItemId
                      )
                    }
                  >
                    Remove
                  </button>

                </div>
              );
            })}

          </div>

          {/* ORDER SUMMARY */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {cartItems.reduce(
                  (
                    total,
                    item
                  ) =>
                    total +
                    Number(
                      item.quantity
                    ),
                  0
                )}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹
                {getTotal().toFixed(2)}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span className="free-delivery">
                FREE
              </span>

            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {getTotal().toFixed(2)}
              </strong>

            </div>

            {/* PROCEED TO ADDRESS */}

            <button
              className="checkout-button"
              onClick={goToAddress}
            >
              Proceed to Checkout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;