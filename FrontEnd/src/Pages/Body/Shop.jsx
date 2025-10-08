




// Shop.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X, Plus, Edit2, Trash2, Filter, ShoppingCart } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";

const Shop = () => {
  const [addProduct, setAddProduct] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const { cart, setCart } = useCart();
  const token = localStorage.getItem("token");

  const API_URL = "http://127.0.0.1:5000";

  // ✅ Add Product
  const handleAddNewProduct = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", name);
    formData.append("product_price", price);
    formData.append("product_category", category);
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/product/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.status || "Failed to add new product.");
        return;
      }

      toast.success(data.status);
      setAddProduct(false);
      fetchProducts(); // refresh list
    } catch (error) {
      toast.error("Network or server error!");
      console.error("Error!", error);
    }
  };

  // ✅ Edit/Delete Product
  const changeProductDetails = async (id, action) => {
    try {
      let response;
      if (action === "delete") {
        response = await fetch(`${API_URL}/product/delete/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (action === "edit") {
        const formData = new FormData();
        formData.append("product_name", editProduct.product_name);
        formData.append("product_price", editProduct.product_price);
        formData.append("product_category", editProduct.product_category);
        if (editProduct.file) {
          formData.append("file", editProduct.file);
        }

        response = await fetch(`${API_URL}/product/update/${id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.status || "Failed to process request");
        return;
      }

      toast.success(data.status);
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error!", error);
      toast.error("Network/Server error!");
    }
  };

  // ✅ Fetch Products
  const fetchProducts = async (category = "") => {
    const url = category
      ? `${API_URL}/product/show?category=${encodeURIComponent(category)}`
      : `${API_URL}/product/show`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.status === 404) {
        setAllProducts([]);
        return;
      }

      if (!response.ok) {
        toast.error("Failed to load products.");
        setAllProducts([]);
        return;
      }

      setAllProducts(data.products);
      const uniqueCategories = [
        ...new Set(data.products.map((p) => p.product_category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error("Network/server error!");
      console.error("Error!", error);
    }
  };

  // ✅ Check Admin & Fetch Initially
  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    } else {
      fetchProducts();
    }

    if (token) {
      try {
        const decodeToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        setIsAdmin(decodeToken.role === "admin" && currentTime < decodeToken.exp);
      } catch {
        setIsAdmin(false);
      }
    }
  }, [selectedCategory]);

  // ✅ Add to Cart
  const addToCart = async (id, name, price, category) => {
    if (!token) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }

    const decodeToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (currentTime > decodeToken.exp) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }

    const existingItem = cart.find((item) => item.name === name);
    const method = existingItem ? "PUT" : "POST";

    try {
      const res = await fetch(`${API_URL}/order/add`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id,
          name,
          quantity,
          price,
          category,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.status);
        return;
      }

      toast.success(data.status);
    } catch (error) {
      console.error("Error!", error);
      toast.error("Network/Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Admin Add Button */}
      {isAdmin && (
        <button
          onClick={() => setAddProduct(true)}
          className="fixed top-20 right-6 z-40 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Add Product
        </button>
      )}

      {/* Header Section */}
      <div className="pt-8 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Shop</h1>
          <p className="text-gray-600">Discover amazing products at great prices</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <NavLink
              to=""
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${!selectedCategory
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-cyan-400 hover:shadow-md"
                }`}
            >
              All Products
            </NavLink>

            {categories.map((cat, idx) => {
              const isActive = selectedCategory === cat;
              return (
                <NavLink
                  key={idx}
                  to={`?category=${encodeURIComponent(cat)}`}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${isActive
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-cyan-400 hover:shadow-md"
                    }`}
                >
                  {cat}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {addProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form
            onSubmit={handleAddNewProduct}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
              <button
                type="button"
                onClick={() => setAddProduct(false)}
                className="text-gray-400 hover:text-gray-600 transition-all hover:rotate-90 duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Enter product name"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  value={name}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  placeholder="0.00"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  value={price}
                  required
                />
              </div>

              {/* 🔹 Dynamic Category with datalist */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  list="categories"
                  onChange={(e) => setCategory(e.target.value)}
                  type="text"
                  placeholder="Enter or select category"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  value={category}
                  required
                />
                <datalist id="categories">
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Add Product
            </button>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              changeProductDetails(editProduct.product_id, "edit");
            }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="text-gray-400 hover:text-gray-600 transition-all hover:rotate-90 duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, product_name: e.target.value })
                  }
                  type="text"
                  value={editProduct.product_name}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, product_price: e.target.value })
                  }
                  type="number"
                  value={editProduct.product_price}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* 🔹 Dynamic Category with datalist */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  list="categories"
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, product_category: e.target.value })
                  }
                  type="text"
                  value={editProduct.product_category}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <datalist id="categories">
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, file: e.target.files[0] })
                  }
                  type="file"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if you don’t want to change the image.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Update Product
            </button>
          </form>
        </div>
      )}


      {/* Products Grid */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {allProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allProducts.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image || `${API_URL}/uploads/${item.file_name}`}
                      alt={item.product_name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-medium text-sm">
                      $ {item.product_price}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {item.product_category}
                    </p>

                    <button
                      onClick={() =>
                        addToCart(
                          item.product_id,
                          item.product_name,
                          item.product_price,
                          item.product_category
                        )
                      }
                      className="w-full cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      Add to Cart
                    </button>

                    {isAdmin && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => setEditProduct(item)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-300 font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            changeProductDetails(item.product_id, "delete")
                          }
                          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white rounded-2xl shadow-md">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-600">
                  No products found
                </p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Shop;
