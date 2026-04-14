// /src/Pages/Body/Cart.jsx

import { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import OrderSummary from "./OrderSummary";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";

function Cart() {
  const { cart, setCart } = useCart([]);
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [allowed, setAllowed] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyFilter, setHistoryFilter] = useState('all');
  // const [expandedOrder, setExpandedOrder] = useState(null);


  const totalPrice = orders.reduce((acc, order) => acc + (order.price * order.quantity), 0);
  const totalItems = orders.reduce((acc, order) => acc + order.quantity, 0);

  const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    processing: { label: "Processing", icon: Package, color: "bg-blue-100 text-blue-800 border-blue-300" },
    shipping: { label: "Shipping", icon: Truck, color: "bg-purple-100 text-purple-800 border-purple-300" },
    delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-800 border-green-300" },
    cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-800 border-red-300" }
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAllowed(false);
      return;
    }

    try {
      const decodeToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodeToken.exp > currentTime) {
        setAllowed(true);

        fetch("http://localhost:5000/order/fetch", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              setOrders(data);
              console.log("Fetched Orders:", data);

              if (token && decodeToken.exp > currentTime) {
                setCart(data);
              } else {
                setCart([]);
              }
            } else {
              setOrders([]);
              setCart([]);
            }
          })
          .catch((err) => console.error("Error fetching orders:", err));

        // Fetch order history
        fetchHistory(token);
      } else {
        setAllowed(false);
      }
    } catch (error) {
      console.log("Invalid Token");
      setAllowed(false);
    }
  }, []);

  const fetchHistory = async (token) => {
    setHistoryLoading(true);
    try {
      const response = await fetch('http://localhost:5000/checkout/history', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        console.log("Error fetching orders");
        setOrderHistory([]);
        return;
      }

      const data = await response.json();
      setOrderHistory(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Error:", error);
      setOrderHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const filteredOrderHistory = historyFilter === 'all'
    ? orderHistory
    : orderHistory.filter(order => order.status === historyFilter);

  const handleDelete = async (item_id) => {
    try {
      const response = await fetch(`http://localhost:5000/order/delete/${item_id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id: item_id }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data)
        return;
      }

      if (response.status === 200) {
        toast.success("Item removed from cart");
      }

      setOrders((prevOrders) => prevOrders.filter(order => order.item_id !== item_id));
      setCart((prevCart) => prevCart.filter(order => order.item_id !== item_id));

    } catch (error) {
      toast.error("Network error. Please try again.");
      console.log("Network/Server error", error);
    }
  };

  const handleQuantityChange = async (item_id, newQuantity) => {
    if (newQuantity < 1) {
      toast.warning("Quantity must be at least 1");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/order/update/${item_id}`, {
        method: 'PUT',
        body: JSON.stringify({ id: item_id, quantity: newQuantity }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      if (!response.ok) {
        toast.error("Cannot update quantity");
        return;
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.item_id === item_id ? { ...order, quantity: newQuantity } : order
        )
      );
      setCart((prevCart) =>
        prevCart.map((order) =>
          order.item_id === item_id ? { ...order, quantity: newQuantity } : order
        )
      );

      toast.success("Quantity updated");
    } catch (error) {
      toast.error("Failed to update quantity");
      console.log("Error updating quantity:", error);
    }
  };

  const handleCheckout = async () => {
    if (orders.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/checkout/create', {
        method: 'POST',
        body: JSON.stringify({
          orders: orders,
          totalAmount: totalPrice
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + token
        }
      });

      if (!response.ok) {
        toast.error("Checkout failed. Please try again.");
        setIsCheckingOut(false);
        return;
      }

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Order placed successfully!");
        setOrders([]);
        setCart([]);
        fetchHistory(token);
      } else {
        toast.error(data.message || "Checkout failed");
      }


    } catch (error) {
      toast.error("Network error. Please try again.");
      console.log("Checkout error:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!allowed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-lg shadow-lg max-w-md">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">You Haven't Logged In!</h2>

          <p className="text-gray-500 text-center mb-8 max-w-sm">
            Please log in to your account to view your cart and continue shopping for electronics.
          </p>

          <Link to='/login' className="bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-3 rounded-full transition-colors duration-200">
            LOGIN NOW
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-sm text-gray-600">
            {orders.length > 0 ? `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-2 text-gray-500">Start adding some products to your cart!</p>
            <Link to="/" className="mt-6 inline-block bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Table Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 rounded-t-lg font-semibold text-gray-700">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Cart Items */}
                <div className="divide-y">
                  {orders.map((order) => (
                    <div key={order.item_id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center">
                      {/* Product Info */}
                      <div className="col-span-5 mb-4 md:mb-0">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium text-gray-900 truncate">{order.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{order.category}</p>
                            <button
                              onClick={() => handleDelete(order.item_id)}
                              className="text-sm text-red-500 hover:text-red-700 mt-2 md:hidden"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 mb-3 md:mb-0">
                        <div className="md:text-center">
                          <span className="md:hidden text-sm text-gray-600 font-medium">Price: </span>
                          <span className="text-gray-900 font-medium">${order.price.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-3 mb-3 md:mb-0">
                        <div className="flex items-center md:justify-center gap-3">
                          <span className="md:hidden text-sm text-gray-600 font-medium">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(order.item_id, order.quantity - 1)}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                              disabled={order.quantity <= 1}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center border-x">
                              {order.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(order.item_id, order.quantity + 1)}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="col-span-2 flex items-center justify-between md:justify-end gap-4">
                        <div>
                          <span className="md:hidden text-sm text-gray-600 font-medium">Total: </span>
                          <span className="text-gray-900 font-bold">
                            ${(order.price * order.quantity).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(order.item_id)}
                          className="hidden md:block text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link to="/" className="inline-flex items-center text-red-500 hover:text-red-600 font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium">${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${(totalPrice * 1.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isCheckingOut ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      Proceed to Checkout
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order History Section */}
        <div className="mt-12">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full mb-4 p-4 bg-white rounded-lg shadow-sm border"
          >
            <h2 className="text-xl font-bold text-gray-900">Order History</h2>
            <ChevronDown className={`w-5 h-5 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>

          {showHistory && (
            <div>
              <OrderSummary

                location={'cart'}
              />
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Cart;