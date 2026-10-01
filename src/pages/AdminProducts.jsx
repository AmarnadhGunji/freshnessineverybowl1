import { useEffect, useState } from "react";
import productImages from "../services/productImages";
import "./AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    categoryId: "",
    productName: "",
    description: "",
    price: "",
    imageUrl: "",
    available: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8082/api/products";

  // =====================================================
  // GET JWT TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      setProducts(data);
      setError("");

    } catch (error) {
      console.error(error);
      setError("Unable to load products.");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // =====================================================
  // ADD / UPDATE PRODUCT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const token = getToken();

    if (!token) {
      setError("Please login as admin.");
      return;
    }

    try {
      const productData = {
        categoryId: Number(form.categoryId),
        productName: form.productName,
        description: form.description,
        price: Number(form.price),
        imageUrl: form.imageUrl,
        available: form.available,
      };

      let response;

      // =========================
      // UPDATE
      // =========================

      if (editingId) {
        response = await fetch(
          `${API_URL}/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(productData),
          }
        );

      }

      // =========================
      // ADD
      // =========================

      else {
        response = await fetch(API_URL, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(productData),
        });
      }

      const responseText = await response.text();

      console.log(
        "Save product status:",
        response.status
      );

      console.log(
        "Save product response:",
        responseText
      );

      if (!response.ok) {
        throw new Error(
          `Failed to save product (${response.status}) ${responseText}`
        );
      }

      setMessage(
        editingId
          ? "Product updated successfully."
          : "Product added successfully."
      );

      resetForm();

      await loadProducts();

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const handleEdit = (product) => {
    setEditingId(product.productId);

    setForm({
      categoryId: product.categoryId || "",
      productName: product.productName || "",
      description: product.description || "",
      price: product.price || "",
      imageUrl: product.imageUrl || "",
      available: product.available === true,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    const token = getToken();

    if (!token) {
      setError("Please login as admin.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();

      console.log(
        "Delete product status:",
        response.status
      );

      console.log(
        "Delete product response:",
        responseText
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete product (${response.status}) ${responseText}`
        );
      }

      setMessage(
        "Product deleted successfully."
      );

      await loadProducts();

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // =====================================================
  // ENABLE / DISABLE PRODUCT
  // =====================================================

  const handleAvailability = async (product) => {
    setMessage("");
    setError("");

    const token = getToken();

    if (!token) {
      setError("Please login as admin.");
      return;
    }

    const newAvailability =
      product.available !== true;

    try {
      const response = await fetch(
        `${API_URL}/${product.productId}/availability?available=${newAvailability}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();

      console.log(
        "Availability status:",
        response.status
      );

      console.log(
        "Availability response:",
        responseText
      );

      if (!response.ok) {
        throw new Error(
          `Availability update failed (${response.status}) ${responseText}`
        );
      }

      setMessage(
        newAvailability
          ? `${product.productName} enabled successfully.`
          : `${product.productName} disabled successfully.`
      );

      await loadProducts();

    } catch (error) {
      console.error(
        "Availability update error:",
        error
      );

      setError(error.message);
    }
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setEditingId(null);

    setForm({
      categoryId: "",
      productName: "",
      description: "",
      price: "",
      imageUrl: "",
      available: true,
    });
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-products-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-products-header">

        <h1>
          Admin Product Management
        </h1>

        <p>
          Add, update, delete and manage
          product availability.
        </p>

      </div>

      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {message && (
        <div className="admin-success">
          ✓ {message}
        </div>
      )}

      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (
        <div className="admin-error">
          ❌ {error}
        </div>
      )}

      {/* =========================
          PRODUCT FORM
      ========================= */}

      <div className="product-form-card">

        <h2>
          {editingId
            ? "Update Product"
            : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* CATEGORY ID */}

            <div className="form-group">

              <label>
                Category ID
              </label>

              <input
                type="number"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                placeholder="Enter category ID"
                required
              />

            </div>

            {/* PRODUCT NAME */}

            <div className="form-group">

              <label>
                Product Name
              </label>

              <input
                type="text"
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />

            </div>

            {/* PRICE */}

            <div className="form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                step="0.01"
                min="0"
                required
              />

            </div>

            {/* IMAGE URL */}

            <div className="form-group">

              <label>
                Image URL
              </label>

              <input
                type="text"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="/images/product.jpg"
              />

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="3"
            />

          </div>

          {/* AVAILABILITY */}

          <div className="availability-checkbox">

            <label>

              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
              />

              Product Available

            </label>

          </div>

          {/* FORM BUTTONS */}

          <div className="form-buttons">

            <button
              type="submit"
              className="save-product-button"
            >
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (

              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>

      {/* =========================
          PRODUCT LIST
      ========================= */}

      <div className="product-list-section">

        <h2>
          All Products
        </h2>

        {loading ? (

          <p>
            Loading products...
          </p>

        ) : products.length === 0 ? (

          <p>
            No products found.
          </p>

        ) : (

          <div className="admin-product-table-wrapper">

            <table className="admin-product-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Image
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Availability
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.map((product) => {

                  const imagePath =
                    productImages[
                      Number(product.productId)
                    ] ||
                    product.imageUrl;

                  return (

                    <tr
                      key={product.productId}
                    >

                      {/* ID */}

                      <td>
                        {product.productId}
                      </td>

                      {/* IMAGE */}

                      <td>

                        {imagePath ? (

                          <img
                            src={imagePath}
                            alt={product.productName}
                            className="admin-product-image"
                          />

                        ) : (

                          <span>
                            No Image
                          </span>

                        )}

                      </td>

                      {/* NAME */}

                      <td>
                        {product.productName}
                      </td>

                      {/* CATEGORY */}

                      <td>
                        {product.categoryId}
                      </td>

                      {/* PRICE */}

                      <td>
                        ₹{product.price}
                      </td>

                      {/* ENABLE / DISABLE */}

                      <td>

                        <button
                          type="button"
                          className={
                            product.available
                              ? "available-button"
                              : "unavailable-button"
                          }
                          onClick={() =>
                            handleAvailability(
                              product
                            )
                          }
                        >

                          {product.available
                            ? "Disable"
                            : "Enable"}

                        </button>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="action-buttons">

                          {/* EDIT */}

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              handleEdit(
                                product
                              )
                            }
                          >
                            Edit
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDelete(
                                product.productId
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminProducts;