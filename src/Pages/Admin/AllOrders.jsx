import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("Token");

      const res = await fetch(
        "https://local-swart.vercel.app/api/orders/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("Token");

      await axios.put(
        `https://local-swart.vercel.app/api/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order._id
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.user?.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === "All"
          ? true
          : order.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, filterStatus]);

  const stats = {
    total: orders.length,
    pending: orders.filter(
      (o) => o.status === "Pending"
    ).length,
    processing: orders.filter(
      (o) => o.status === "Processing"
    ).length,
    delivered: orders.filter(
      (o) => o.status === "Delivered"
    ).length,
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300";

      case "Processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300";

      default:
        return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Orders Dashboard
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Monitor and manage customer orders
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        <StatCard
          title="Total Orders"
          value={stats.total}
        />

        <StatCard
          title="Pending"
          value={stats.pending}
        />

        <StatCard
          title="Processing"
          value={stats.processing}
        />

        <StatCard
          title="Delivered"
          value={stats.delivered}
        />

      </div>

      {/* FILTERS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search by Order ID or Customer"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
            className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="Pending">
              Pending
            </option>
            <option value="Processing">
              Processing
            </option>
            <option value="Delivered">
              Delivered
            </option>
          </select>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 dark:bg-slate-800">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Order
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Address
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Items
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Amount
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Date
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>

                  <tr className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          #{order._id.slice(-6)}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {order.user?.name ||
                          "Unknown User"}
                      </p>
                    </td>

                    <td className="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                      {order.address?.street},{" "}
                      {order.address?.city}
                    </td>

                    <td className="px-6 py-4 text-center text-slate-900 dark:text-white">
                      {order.products?.length}
                    </td>

                    <td className="px-6 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{order.totalAmount}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder ===
                                order._id
                                ? null
                                : order._id
                            )
                          }
                          className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                          View
                        </button>

                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="Pending">
                            Pending
                          </option>
                          <option value="Processing">
                            Processing
                          </option>
                          <option value="Delivered">
                            Delivered
                          </option>
                        </select>

                      </div>

                    </td>

                  </tr>

                  {expandedOrder === order._id && (
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td colSpan="8" className="p-5">

                        <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">
                          Ordered Products
                        </h3>

                        <div className="space-y-3">

                          {order.products?.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                              >
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {
                                    item.product
                                      ?.name
                                  }
                                </span>

                                <span className="text-slate-600 dark:text-slate-400">
                                  Qty:{" "}
                                  {item.quantity}
                                </span>
                              </div>
                            )
                          )}

                        </div>

                      </td>
                    </tr>
                  )}

                </React.Fragment>
              ))}

            </tbody>

          </table>

        </div>
      </div>

      {!filteredOrders.length && (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
            No Orders Found
          </h3>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Orders will appear here once customers place them.
          </p>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </h2>

    </div>
  );
};

export default AllOrders;