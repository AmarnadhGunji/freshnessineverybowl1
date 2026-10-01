import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import productImages from "../services/productImages";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingProductId, setAddingProductId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    fetch("http://localhost:8082/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Products from backend:", data);

        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);

        setError("Unable to load products.");
        setLoading(false);
      });
  }, []);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = async (product) => {
    setSuccessMessage("");
    setLoginMessage("");
    setError("");

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      setLoginMessage(
        "Please login to add products to your cart."
      );
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch (error) {
      console.error("Invalid user data:", error);

      localStorage.removeItem("user");

      setLoginMessage("Please login again.");
      return;
    }

    const userId = user.userId;

    if (!userId) {
      setLoginMessage(
        "User information not found. Please login again."
      );
      return;
    }

    if (!product.available) {
      return;
    }

    setAddingProductId(product.productId);

    try {
      const response = await fetch(
        `http://localhost:8082/api/cart/${userId}/add?productId=${product.productId}&quantity=1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        data = {
          message: text,
        };
      }

      console.log("Add to cart response:", data);

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setLoginMessage(
          "Your session has expired. Please login again."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to add product to cart."
        );
      }

      setSuccessMessage(
        `${product.productName} added to cart successfully!`
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (error) {
      console.error("Add to cart error:", error);

      setError(
        error.message ||
          "Unable to add product to cart."
      );

    } finally {
      setAddingProductId(null);
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = () => {
    navigate("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        className="products-page"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="products-header">
          <h1>Our Products 🍓</h1>

          <p>
            Fresh fruits, delicious shakes,
            lassi and healthy juices.
          </p>
        </div>

        <p className="loading">
          Loading products...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && products.length === 0) {
    return (
      <div
        className="products-page"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="products-header">
          <h1>Our Products 🍓</h1>

          <p>
            Fresh fruits, delicious shakes,
            lassi and healthy juices.
          </p>
        </div>

        <p className="error">
          {error}
        </p>
      </div>
    );
  }

  // ==========================================
  // PRODUCTS PAGE
  // ==========================================

  return (
    <div
      className="products-page"
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >

      {/* ======================================
          HEADER
      ====================================== */}

      <div
        className="products-header"
        style={{
          textAlign: "center",
          paddingTop: "30px",
          paddingBottom: "25px",
        }}
      >
        <h1
          style={{
            margin: "0",
            fontSize: "38px",
            fontWeight: "800",
            color: "#14532d",
          }}
        >
          Our Products 🍓
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#6b7280",
            fontSize: "17px",
          }}
        >
          Fresh fruits, delicious shakes,
          lassi and healthy juices.
        </p>
      </div>


      {/* LOGIN MESSAGE */}

      {loginMessage && (
        <div className="cart-login-message">

          <span>
            {loginMessage}
          </span>

          <button onClick={handleLogin}>
            Login
          </button>

        </div>
      )}


      {/* SUCCESS MESSAGE */}

      {successMessage && (
        <div className="cart-success-message">
          ✓ {successMessage}
        </div>
      )}


      {/* ERROR MESSAGE */}

      {error && products.length > 0 && (
        <div className="cart-error-message">
          {error}
        </div>
      )}


      {/* ======================================
          PRODUCT GRID
      ====================================== */}

      <div className="product-grid">

        {products.map((product) => {

          /*
           * IMPORTANT:
           *
           * First use local product image
           * based on product ID.
           *
           * If no local image exists,
           * then use imageUrl from database.
           */

          const imagePath =
            productImages[
              Number(product.productId)
            ] || product.imageUrl;


          console.log(
            "Product:",
            product.productId,
            product.productName,
            "Image:",
            imagePath
          );


          return (
            <div
              className={`product-card ${
                !product.available
                  ? "unavailable"
                  : ""
              }`}
              key={product.productId}
            >

              {/* ==================================
                  IMAGE
              ================================== */}

              <div className="product-image-container">

                {imagePath ? (

                  <img
                    src={imagePath}
                    alt={product.productName}
                    className="product-image"
                    onError={(event) => {

                      console.error(
                        "Image not found:",
                        imagePath
                      );

                      event.currentTarget.style.display =
                        "none";

                    }}
                  />

                ) : (

                  <div className="image-not-found">
                    Image Not Available
                  </div>

                )}


                {/* UNAVAILABLE */}

                {!product.available && (
                  <span className="unavailable-badge">
                    Currently Unavailable
                  </span>
                )}

              </div>


              {/* ==================================
                  PRODUCT INFORMATION
              ================================== */}

              <div className="product-info">

                <h2>
                  {product.productName}
                </h2>

                <p className="product-description">
                  {product.description}
                </p>


                {/* PRICE + CART */}

                <div className="product-bottom">

                  <span className="product-price">
                    ₹{product.price}
                  </span>


                  <button
                    className="add-cart-button"

                    disabled={
                      !product.available ||
                      addingProductId ===
                        product.productId
                    }

                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >

                    {!product.available
                      ? "Unavailable"
                      : addingProductId ===
                        product.productId
                      ? "Adding..."
                      : "Add to Cart"}

                  </button>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default Products;