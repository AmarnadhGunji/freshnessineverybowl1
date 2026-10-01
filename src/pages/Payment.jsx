import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();

  const [selectedPayment, setSelectedPayment] =
    useState("COD");

  const [selectedUpiApp, setSelectedUpiApp] =
    useState("");

  const [upiId, setUpiId] = useState("");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });

  const [selectedBank, setSelectedBank] =
    useState("");

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentAmount();
  }, []);

  const getSavedUser = () => {
    try {
      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);
    } catch (error) {
      console.error(
        "Error reading user:",
        error
      );

      return null;
    }
  };

  const loadPaymentAmount = async () => {
    try {
      const savedTotal =
        localStorage.getItem(
          "checkoutTotal"
        );

      if (savedTotal) {
        setTotal(Number(savedTotal));
        setLoading(false);
        return;
      }

      const token =
        localStorage.getItem("token");

      const user = getSavedUser();

      if (!token || !user?.userId) {
        setLoading(false);
        return;
      }

      const cartResponse =
        await fetch(
          `http://localhost:8082/api/cart/${user.userId}/items`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!cartResponse.ok) {
        throw new Error(
          "Failed to load cart"
        );
      }

      const cartItems =
        await cartResponse.json();

      const productsResponse =
        await fetch(
          "http://localhost:8082/api/products"
        );

      if (!productsResponse.ok) {
        throw new Error(
          "Failed to load products"
        );
      }

      const products =
        await productsResponse.json();

      let subtotal = 0;

      cartItems.forEach((item) => {
        const product =
          products.find(
            (p) =>
              p.productId ===
              item.productId
          );

        if (product) {
          subtotal +=
            Number(product.price) *
            Number(item.quantity);
        }
      });

      const deliveryCharge =
        subtotal >= 500 ? 0 : 40;

      const finalTotal =
        subtotal + deliveryCharge;

      setTotal(finalTotal);

      localStorage.setItem(
        "checkoutTotal",
        finalTotal.toString()
      );
    } catch (error) {
      console.error(
        "Error loading payment amount:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (e) => {
    const { name, value } =
      e.target;

    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  const handleContinue = () => {
    if (selectedPayment === "COD") {
      localStorage.setItem(
        "paymentMethod",
        "COD"
      );

      alert(
        "Cash on Delivery selected successfully."
      );

      navigate("/place-order");

      return;
    }

    if (selectedPayment === "UPI") {
      if (!selectedUpiApp) {
        alert(
          "Please select a UPI app."
        );

        return;
      }

      if (
        selectedUpiApp === "OTHER" &&
        !upiId.trim()
      ) {
        alert(
          "Please enter your UPI ID."
        );

        return;
      }

      localStorage.setItem(
        "paymentMethod",
        "UPI"
      );

      localStorage.setItem(
        "upiApp",
        selectedUpiApp
      );

      if (upiId.trim()) {
        localStorage.setItem(
          "upiId",
          upiId
        );
      }

      alert(
        "UPI payment details submitted."
      );

      navigate("/place-order");

      return;
    }

    if (selectedPayment === "CARD") {
      if (
        !cardDetails.cardNumber.trim() ||
        !cardDetails.cardHolder.trim() ||
        !cardDetails.expiry.trim() ||
        !cardDetails.cvv.trim()
      ) {
        alert(
          "Please fill all card details."
        );

        return;
      }

      localStorage.setItem(
        "paymentMethod",
        "CARD"
      );

      alert(
        "Card details submitted."
      );

      navigate("/place-order");

      return;
    }

    if (
      selectedPayment ===
      "NET_BANKING"
    ) {
      if (!selectedBank) {
        alert(
          "Please select your bank."
        );

        return;
      }

      localStorage.setItem(
        "paymentMethod",
        "NET_BANKING"
      );

      localStorage.setItem(
        "selectedBank",
        selectedBank
      );

      alert(
        "Bank selected successfully."
      );

      navigate("/place-order");

      return;
    }
  };

  const paymentOptionStyle = (
    selected
  ) => ({
    border:
      selected
        ? "2px solid #198754"
        : "1px solid #dddddd",
    borderRadius: "12px",
    padding: "18px",
    marginBottom: "15px",
    background:
      selected
        ? "#f0fff7"
        : "#ffffff",
    cursor: "pointer",
  });

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border:
      "1px solid #d5d9e0",
    borderRadius: "8px",
    marginTop: "7px",
    marginBottom: "15px",
    fontSize: "14px",
    outline: "none",
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f7fb",
        }}
      >
        <h2>
          Loading Payment...
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "35px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Header */}

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "15px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: "0 0 8px",
              color: "#198754",
            }}
          >
            💳 Payment
          </h1>

          <p
            style={{
              margin: 0,
              color: "#666",
            }}
          >
            Select your preferred payment
            method
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 330px",
            gap: "25px",
            alignItems: "start",
          }}
        >
          {/* Payment methods */}

          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "15px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.08)",
            }}
          >
            <h2>
              Choose Payment Method
            </h2>

            {/* COD */}

            <div
              style={paymentOptionStyle(
                selectedPayment === "COD"
              )}
              onClick={() =>
                setSelectedPayment(
                  "COD"
                )
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontWeight: "600",
                }}
              >
                <input
                  type="radio"
                  checked={
                    selectedPayment ===
                    "COD"
                  }
                  onChange={() =>
                    setSelectedPayment(
                      "COD"
                    )
                  }
                />

                <span>
                  💵 Cash on Delivery
                </span>
              </div>

              {selectedPayment ===
                "COD" && (
                <div
                  style={{
                    marginTop: "15px",
                    color: "#666",
                  }}
                >
                  <h3>
                    Cash on Delivery
                  </h3>

                  <p>
                    Pay when your order is
                    delivered.
                  </p>

                  <strong
                    style={{
                      color: "#198754",
                      fontSize: "20px",
                    }}
                  >
                    ₹{total.toFixed(2)}
                  </strong>
                </div>
              )}
            </div>

            {/* UPI */}

            <div
              style={paymentOptionStyle(
                selectedPayment === "UPI"
              )}
              onClick={() =>
                setSelectedPayment(
                  "UPI"
                )
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontWeight: "600",
                }}
              >
                <input
                  type="radio"
                  checked={
                    selectedPayment ===
                    "UPI"
                  }
                  onChange={() =>
                    setSelectedPayment(
                      "UPI"
                    )
                  }
                />

                <span>
                  📱 UPI Payment
                </span>
              </div>

              {selectedPayment ===
                "UPI" && (
                <div
                  style={{
                    marginTop: "18px",
                  }}
                >
                  <h3>
                    Select UPI App
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, 1fr)",
                      gap: "12px",
                      marginTop: "15px",
                    }}
                  >
                    {[
                      {
                        id: "GPAY",
                        icon: "🟢",
                        name: "Google Pay",
                      },
                      {
                        id: "PHONEPE",
                        icon: "🟣",
                        name: "PhonePe",
                      },
                      {
                        id: "PAYTM",
                        icon: "🔵",
                        name: "Paytm",
                      },
                      {
                        id: "OTHER",
                        icon: "💳",
                        name: "Other UPI",
                      },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUpiApp(
                            app.id
                          );
                        }}
                        style={{
                          padding:
                            "15px 10px",
                          borderRadius:
                            "10px",
                          border:
                            selectedUpiApp ===
                            app.id
                              ? "2px solid #198754"
                              : "1px solid #ddd",
                          background:
                            selectedUpiApp ===
                            app.id
                              ? "#e9f9f0"
                              : "#ffffff",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        <div
                          style={{
                            fontSize:
                              "25px",
                            marginBottom:
                              "5px",
                          }}
                        >
                          {app.icon}
                        </div>

                        {app.name}
                      </button>
                    ))}
                  </div>

                  {selectedUpiApp ===
                    "OTHER" && (
                    <div
                      style={{
                        marginTop:
                          "15px",
                      }}
                    >
                      <label>
                        Enter UPI ID
                      </label>

                      <input
                        type="text"
                        placeholder="example@upi"
                        value={upiId}
                        onChange={(e) =>
                          setUpiId(
                            e.target.value
                          )
                        }
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        style={
                          inputStyle
                        }
                      />
                    </div>
                  )}

                  {selectedUpiApp && (
                    <div
                      style={{
                        marginTop:
                          "15px",
                        padding:
                          "12px",
                        borderRadius:
                          "8px",
                        background:
                          "#e9f9f0",
                        color:
                          "#198754",
                        fontWeight:
                          "600",
                      }}
                    >
                      Selected:{" "}
                      {selectedUpiApp ===
                      "GPAY"
                        ? "Google Pay"
                        : selectedUpiApp ===
                          "PHONEPE"
                        ? "PhonePe"
                        : selectedUpiApp ===
                          "PAYTM"
                        ? "Paytm"
                        : "Other UPI"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CARD */}

            <div
              style={paymentOptionStyle(
                selectedPayment ===
                  "CARD"
              )}
              onClick={() =>
                setSelectedPayment(
                  "CARD"
                )
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontWeight: "600",
                }}
              >
                <input
                  type="radio"
                  checked={
                    selectedPayment ===
                    "CARD"
                  }
                  onChange={() =>
                    setSelectedPayment(
                      "CARD"
                    )
                  }
                />

                <span>
                  💳 Credit / Debit Card
                </span>
              </div>

              {selectedPayment ===
                "CARD" && (
                <div
                  style={{
                    marginTop: "15px",
                  }}
                >
                  <label>
                    Card Number
                  </label>

                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={
                      cardDetails.cardNumber
                    }
                    onChange={
                      handleCardChange
                    }
                    style={inputStyle}
                  />

                  <label>
                    Card Holder Name
                  </label>

                  <input
                    type="text"
                    name="cardHolder"
                    placeholder="Enter card holder name"
                    value={
                      cardDetails.cardHolder
                    }
                    onChange={
                      handleCardChange
                    }
                    style={inputStyle}
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <label>
                        Expiry
                      </label>

                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={
                          cardDetails.expiry
                        }
                        onChange={
                          handleCardChange
                        }
                        style={
                          inputStyle
                        }
                      />
                    </div>

                    <div>
                      <label>
                        CVV
                      </label>

                      <input
                        type="password"
                        name="cvv"
                        placeholder="CVV"
                        value={
                          cardDetails.cvv
                        }
                        onChange={
                          handleCardChange
                        }
                        style={
                          inputStyle
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* NET BANKING */}

            <div
              style={paymentOptionStyle(
                selectedPayment ===
                  "NET_BANKING"
              )}
              onClick={() =>
                setSelectedPayment(
                  "NET_BANKING"
                )
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontWeight: "600",
                }}
              >
                <input
                  type="radio"
                  checked={
                    selectedPayment ===
                    "NET_BANKING"
                  }
                  onChange={() =>
                    setSelectedPayment(
                      "NET_BANKING"
                    )
                  }
                />

                <span>
                  🏦 Net Banking
                </span>
              </div>

              {selectedPayment ===
                "NET_BANKING" && (
                <div
                  style={{
                    marginTop: "15px",
                  }}
                >
                  <label>
                    Select Your Bank
                  </label>

                  <select
                    value={selectedBank}
                    onChange={(e) =>
                      setSelectedBank(
                        e.target.value
                      )
                    }
                    style={inputStyle}
                  >
                    <option value="">
                      Select Bank
                    </option>

                    <option value="SBI">
                      State Bank of India
                    </option>

                    <option value="HDFC">
                      HDFC Bank
                    </option>

                    <option value="ICICI">
                      ICICI Bank
                    </option>

                    <option value="AXIS">
                      Axis Bank
                    </option>

                    <option value="KOTAK">
                      Kotak Mahindra Bank
                    </option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}

          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "15px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.08)",
              position: "sticky",
              top: "90px",
            }}
          >
            <h2>
              Payment Summary
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                padding:
                  "20px 0",
                borderBottom:
                  "1px solid #eee",
              }}
            >
              <span>
                Total Payable
              </span>

              <strong
                style={{
                  color: "#198754",
                  fontSize: "20px",
                }}
              >
                ₹{total.toFixed(2)}
              </strong>
            </div>

            <p
              style={{
                color: "#666",
                marginTop: "20px",
              }}
            >
              🔒 Your payment information
              is secure.
            </p>

            <button
              onClick={handleContinue}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "8px",
                background: "#198754",
                color: "#ffffff",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "15px",
                marginTop: "10px",
              }}
            >
              Continue to Place Order
            </button>

            <button
              onClick={() =>
                navigate("/checkout")
              }
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid #198754",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#198754",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "15px",
                marginTop: "10px",
              }}
            >
              ← Back to Checkout
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 800px) {
            div[style*="grid-template-columns: 1fr 330px"] {
              grid-template-columns: 1fr !important;
            }

            div[style*="position: sticky"] {
              position: static !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Payment;