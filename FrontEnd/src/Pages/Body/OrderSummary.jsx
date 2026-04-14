import React, { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, Clock, XCircle, Trash2, Eye, ChevronDown } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const SalesOrder = ({ location }) => {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [inCart, setInCart] = useState(location ? true : false);

  const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    processing: { label: "Processing", icon: Package, color: "bg-blue-100 text-blue-800 border-blue-300" },
    shipping: { label: "Shipping", icon: Truck, color: "bg-purple-100 text-purple-800 border-purple-300" },
    delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-800 border-green-300" },
    cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-800 border-red-300" }
  };

  const checkoutList = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log("No token found");
      setLoading(false);
      return;
    }

    try {
      const decodeToken = jwtDecode(token);
      if (decodeToken.role === 'admin') {
        setIsAdmin(true);
      }

      const response = await fetch(`http://localhost:5000/checkout`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        console.log("Error fetching orders");
        return;
      }

      const data = await response.json();
      setCheckoutItems(data.checkout_list || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/checkout/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        if (response.status === 401) {
          const data = await response.json();
          alert(data.status);
          return;
        }
      }

      setCheckoutItems(items =>
        items.map(item =>
          item.id === orderId ? { ...item, status: newStatus } : item
        )
      );

    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/checkout/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          alert(data.status);
        }
        console.error(data.status);
        return;
      }
      setCheckoutItems(items => items.filter(item => item.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    checkoutList();
  }, []);

  const filteredItems = filter === 'all'
    ? checkoutItems
    : checkoutItems.filter(item => item.status === filter);

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

  const StatusDropdown = ({ currentStatus, orderId }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <StatusBadge status={currentStatus} />
          <ChevronDown size={16} className="text-gray-500" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {Object.entries(statusConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      updateOrderStatus(orderId, key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left ${currentStatus === key ? 'bg-gray-50' : ''}`}
                  >
                    <Icon size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Orders</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          {['all', ...Object.keys(statusConfig)].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === status
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              {status === 'all' ? 'All Orders' : statusConfig[status].label}
              <span className="ml-2 text-xs opacity-75">
                ({status === 'all' ? checkoutItems.length : checkoutItems.filter(i => i.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">There are no orders matching your filter criteria.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Order #{item.id}</h3>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(item.created_at || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAdmin && !inCart && (
                        <StatusDropdown currentStatus={item.status} orderId={item.id} />
                      )}

                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === item.id ? null : item)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye size={20} className="text-gray-600" />
                      </button>

                      {isAdmin && !inCart && (
                        <button
                          onClick={() => deleteOrder(item.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete order"
                        >
                          <Trash2 size={20} className="text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Total Amount:</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${item.total_amount?.toFixed(2)}
                    </div>
                  </div>

                  {selectedOrder?.id === item.id && item.items && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {item.items.map((orderItem, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{orderItem.product_name}</p>
                              <p className="text-sm text-gray-600">Qty: {orderItem.quantity} × ${orderItem.unit_price}</p>
                            </div>
                            <div className="font-semibold text-gray-900">
                              ${orderItem.subtotal?.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesOrder;