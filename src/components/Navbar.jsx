import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        setCartCount(0);
        return;
      }

      const user = JSON.parse(savedUser);

      if (!user?.userId) {
        setCartCount(0);
        return;
      }

      const response = await fetch(
        `http://localhost:8082/api/cart/${user.userId}/items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const items = await response.json();

      const count = items.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      setCartCount(count);
    } catch (error) {
      console.error(
        "Cart count error:",
        error
      );

      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartCount();

    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );

    window.addEventListener(
      "storage",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );

      window.removeEventListener(
        "storage",
        handleCartUpdate
      );
    };
  }, []);

  useEffect(() => {
    loadCartCount();
  }, [location.pathname]);

  const navLinkStyle = (path) => ({
    textDecoration: "none",
    color:
      location.pathname === path
        ? "#198754"
        : "#333",
    fontWeight:
      location.pathname === path
        ? "700"
        : "600",
    fontSize: "15px",
    padding: "8px 12px",
    borderRadius: "8px",
    transition: "0.3s",
  });

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        background: "#ffffff",
        boxShadow:
          "0 3px 15px rgba(0,0,0,0.08)",
        borderBottom:
          "1px solid #eeeeee",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          minHeight: "70px",
          padding: "0 25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          boxSizing: "border-box",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "28px",
            }}
          >
            🍓
          </span>

          <span
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#198754",
            }}
          >
            Fruit Bowl
          </span>
        </Link>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            to="/"
            style={navLinkStyle("/")}
          >
            Home
          </Link>

          <Link
            to="/products"
            style={navLinkStyle("/products")}
          >
            Products
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            style={{
              ...navLinkStyle("/cart"),
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span
              style={{
                fontSize: "21px",
              }}
            >
              🛒
            </span>

            <span>Cart</span>

            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-3px",
                  minWidth: "19px",
                  height: "19px",
                  padding: "0 5px",
                  borderRadius: "50px",
                  background: "#dc3545",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/login"
            style={{
              textDecoration: "none",
              background: "#198754",
              color: "#ffffff",
              fontWeight: "600",
              fontSize: "14px",
              padding: "9px 17px",
              borderRadius: "8px",
              marginLeft: "5px",
            }}
          >
            Login
          </Link>
        </div>
      </div>

      {/* Mobile navigation */}
      <style>
        {`
          @media (max-width: 700px) {
            nav > div {
              flex-direction: column;
              padding: 15px;
              gap: 12px;
            }

            nav > div > div {
              width: 100%;
            }
          }
        `}
      </style>
    </nav>
  );
}

export default Navbar;