import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Address.css";

function Address() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

  const [formData, setFormData] = useState({
    houseNo: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadAddresses();
  }, []);

  const getUserData = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      return null;
    }

    try {
      const user = JSON.parse(userData);

      if (!user.userId) {
        return null;
      }

      return {
        token,
        user,
      };
    } catch {
      return null;
    }
  };

  const loadAddresses = async () => {
    setLoading(true);
    setError("");

    const data = getUserData();

    if (!data) {
      setError("Please login to continue.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8082/api/addresses/user/${data.user.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
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

        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to load addresses."
        );
      }

      const addressData = await response.json();

      setAddresses(addressData);

      if (addressData.length > 0) {
        setSelectedAddressId(
          addressData[0].addressId
        );
      }

    } catch (error) {
      console.error(
        "Address loading error:",
        error
      );

      setError(
        error.message ||
        "Unable to load your addresses."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const data = getUserData();

    if (!data) {
      setError("Please login to continue.");
      return;
    }

    if (
      !formData.houseNo.trim() ||
      !formData.street.trim() ||
      !formData.area.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setError(
        "Please fill all required fields."
      );
      return;
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      setError(
        "Pincode must contain exactly 6 digits."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:8082/api/addresses",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${data.token}`,
          },

          body: JSON.stringify({
            userId: data.user.userId,
            houseNo: formData.houseNo,
            street: formData.street,
            area: formData.area,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            landmark: formData.landmark,
          }),
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
          "Unable to save address."
        );
      }

      const savedAddress =
        await response.json();

      setAddresses((previous) => [
        ...previous,
        savedAddress,
      ]);

      setSelectedAddressId(
        savedAddress.addressId
      );

      setFormData({
        houseNo: "",
        street: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
      });

      setShowForm(false);

      setSuccess(
        "Address saved successfully."
      );

    } catch (error) {
      console.error(
        "Save address error:",
        error
      );

      setError(
        error.message ||
        "Unable to save address."
      );

    } finally {
      setSaving(false);
    }
  };

  /*
   * CONTINUE TO CHECKOUT
   */
  const continueToCheckout = () => {
    if (!selectedAddressId) {
      setError(
        "Please select a delivery address."
      );
      return;
    }

    localStorage.setItem(
      "selectedAddressId",
      selectedAddressId
    );

    setError("");

    navigate("/checkout");
  };

  /*
   * LOADING
   */
  if (loading) {
    return (
      <div className="address-page">

        <div className="address-loading">

          <div className="address-loading-icon">
            📍
          </div>

          <h2>
            Loading your addresses...
          </h2>

        </div>

      </div>
    );
  }

  /*
   * MAIN PAGE
   */
  return (
    <div className="address-page">

      <div className="address-container">

        {/* HEADER */}

        <div className="address-header">

          <div>

            <h1>
              📍 Delivery Address
            </h1>

            <p>
              Choose where you want your
              order delivered.
            </p>

          </div>

          <button
            className="back-cart-button"
            onClick={() =>
              navigate("/cart")
            }
          >
            ← Back to Cart
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="address-error">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="address-success">
            {success}
          </div>
        )}

        {/* SAVED ADDRESSES */}

        {addresses.length > 0 && (

          <div className="saved-address-section">

            <h2>
              Saved Addresses
            </h2>

            <div className="address-list">

              {addresses.map((address) => (

                <div
                  key={address.addressId}
                  className={`address-card ${
                    selectedAddressId ===
                    address.addressId
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedAddressId(
                      address.addressId
                    )
                  }
                >

                  <div className="address-radio">

                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={
                        selectedAddressId ===
                        address.addressId
                      }
                      onChange={() =>
                        setSelectedAddressId(
                          address.addressId
                        )
                      }
                    />

                  </div>

                  <div className="address-details">

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

                </div>

              ))}

            </div>

          </div>

        )}

        {/* ADD ADDRESS BUTTON */}

        <button
          className="add-address-button"
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setSuccess("");
          }}
        >
          {showForm
            ? "✕ Close"
            : "+ Add New Address"}
        </button>

        {/* ADDRESS FORM */}

        {showForm && (

          <div className="address-form-card">

            <h2>
              Add New Address
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="address-form-grid">

                {/* HOUSE */}

                <div className="address-form-group">

                  <label>
                    House / Flat No. *
                  </label>

                  <input
                    type="text"
                    name="houseNo"
                    value={formData.houseNo}
                    onChange={handleChange}
                    placeholder="Example: Flat 302"
                  />

                </div>

                {/* STREET */}

                <div className="address-form-group">

                  <label>
                    Street *
                  </label>

                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Street name"
                  />

                </div>

                {/* AREA */}

                <div className="address-form-group">

                  <label>
                    Area *
                  </label>

                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Area / Locality"
                  />

                </div>

                {/* CITY */}

                <div className="address-form-group">

                  <label>
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />

                </div>

                {/* STATE */}

                <div className="address-form-group">

                  <label>
                    State *
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />

                </div>

                {/* PINCODE */}

                <div className="address-form-group">

                  <label>
                    Pincode *
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6 digit pincode"
                    maxLength="6"
                  />

                </div>

                {/* LANDMARK */}

                <div className="address-form-group full-width">

                  <label>
                    Landmark
                  </label>

                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark (optional)"
                  />

                </div>

              </div>

              {/* SAVE */}

              <button
                type="submit"
                className="save-address-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Address"}
              </button>

            </form>

          </div>

        )}

        {/* CONTINUE */}

        {addresses.length > 0 && (

          <div className="address-continue">

            <button
              className="continue-address-button"
              onClick={continueToCheckout}
            >
              Continue to Checkout →
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default Address;