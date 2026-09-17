import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearCart } from "../redux/Slice/CartSlice";
import CartHeader from "../Components/CartHeader";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("selectedAddress");
    if (saved) {
      try {
        setSelectedAddress(JSON.parse(saved));
      } catch {
        setSelectedAddress(null);
      }
    }
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const delivery = cartItems.length ? 20 : 0;
  const total = subtotal + delivery;

  // Handle Online Payment via Razorpay
  const handleRazorpayPayment = async (token, items) => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create order in backend via Razorpay
      const { data: orderRes } = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/orders/create-razorpay-order`,
        { totalAmount: total },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!orderRes.success || !orderRes.order) {
        throw new Error(orderRes.message || "Failed to initialize payment order");
      }

      const razorpayOrder = orderRes.order;
      const razorpayKey =
        import.meta.env.VITE_RAZORPAY_KEY_ID ||
        import.meta.env.VITE_APP_RAZORPAY_KEY_ID ||
        "rzp_test_T6EniuKaqC0QNI";

      // 2. Configure and open Razorpay Checkout modal
      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Kirana+",
        description: "Order Payment",
        image:
          "https://static.vecteezy.com/system/resources/previews/016/471/452/original/abstract-modern-ecommerce-logo-ecommerce-logo-design-shop-logo-design-template-creative-ecommerce-logo-vector.jpg",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // 3. Verify payment signature on backend
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_APP_BACKEND_URL}/api/orders/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items,
                totalAmount: total,
                address: selectedAddress,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyRes.data.success) {
              dispatch(clearCart());
              toast.success("Payment Successful 🎉");
              navigate("/order-success", {
                state: { order: verifyRes.data.order },
              });
            } else {
              toast.error(verifyRes.data.message || "Payment verification failed ❌");
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            toast.error(
              verifyError.response?.data?.message ||
                "Payment verification failed on server ❌"
            );
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: localStorage.getItem("User") || "",
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        setIsProcessing(false);
        toast.error(resp.error?.description || "Payment failed ❌");
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay order error:", err);
      toast.error(
        err.response?.data?.message || "Could not initiate Razorpay payment ❌"
      );
      setIsProcessing(false);
    }
  };

  // Handle Cash on Delivery
  const handleCodPayment = async (token, items) => {
    try {
      const orderData = {
        items,
        totalAmount: total,
        address: selectedAddress,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdOrder = res.data.order;
      dispatch(clearCart());
      toast.success("Order placed successfully 🎉");

      navigate("/order-success", {
        state: { order: createdOrder },
      });
    } catch (error) {
      console.error("COD error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Failed to place order ❌"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) return toast.error("Please select a delivery address first 🚚");
    if (!cartItems.length) return toast.error("Your cart is empty 🛒");

    const token = localStorage.getItem("Token");
    if (!token) {
      toast.error("Please log in to complete your order");
      navigate("/login", { state: { from: { pathname: "/payment" } } });
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    setIsProcessing(true);

    if (paymentMethod === "Razorpay") {
      await handleRazorpayPayment(token, items);
    } else {
      await handleCodPayment(token, items);
    }
  };

  const paymentOptions = [
    {
      id: "Razorpay",
      title: "Online Payment (Razorpay)",
      description: "Pay with UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, NetBanking, or Wallets",
      badge: "Instant & Secure",
      icon: (
        <svg
          className="w-6 h-6 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      id: "Cash on Delivery",
      title: "Cash on Delivery (COD)",
      description: "Pay with cash at your doorstep when your order is delivered",
      badge: "Pay at Doorstep",
      icon: (
        <svg
          className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <ToastContainer position="bottom-right" autoClose={2000} />

      <CartHeader currentStep="Payment" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Delivery Address Section */}
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold dark:text-white flex items-center gap-2">
                  <span>📍</span> Delivery Address
                </h3>
              </div>

              {selectedAddress ? (
                <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg border border-gray-200 dark:border-gray-700/60">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    {selectedAddress.label || "Home"}
                  </p>
                  <p>
                    {selectedAddress.street}, {selectedAddress.city} - {selectedAddress.zip}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    ⚠️ No address selected. Please select or add an address in the previous step.
                  </p>
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3 dark:text-white flex items-center gap-2">
                <span>💳</span> Select Payment Method
              </h3>

              <div className="grid gap-3">
                {paymentOptions.map((opt) => {
                  const isSelected = paymentMethod === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => !isProcessing && setPaymentMethod(opt.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                        isSelected
                          ? "border-green-500 bg-green-50/70 dark:bg-green-950/30 ring-2 ring-green-500/20 shadow-sm"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900"
                      }`}
                    >
                      <div className="mt-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        {opt.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {opt.title}
                          </p>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              isSelected
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      <div className="mt-1 flex items-center justify-center">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                            isSelected
                              ? "border-green-600 bg-green-600"
                              : "border-gray-400 dark:border-gray-600"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3 dark:text-white flex items-center gap-2">
                <span>🛍️</span> Order Items ({cartItems.length})
              </h3>

              <div className="flex flex-col gap-3 divide-y divide-gray-100 dark:divide-gray-800">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="pt-3 first:pt-0 flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        className="w-12 h-12 object-contain rounded-lg border border-gray-200 dark:border-gray-800 p-1 bg-white"
                        alt={item.name}
                      />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>

                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4 dark:text-white text-base">
                Order Summary
              </h3>

              <div className="flex justify-between text-sm mb-2.5">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium dark:text-white">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-sm mb-2.5">
                <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                <span className="font-medium dark:text-white">
                  {delivery === 0 ? "Free" : `₹${delivery}`}
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 my-3" />

              <div className="flex justify-between font-bold text-lg">
                <span className="dark:text-white">Total Amount</span>
                <span className="text-green-600">₹{total}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={!cartItems.length || isProcessing}
                className="w-full mt-6 py-3.5 bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Processing Payment...</span>
                  </>
                ) : paymentMethod === "Razorpay" ? (
                  <span>Pay ₹{total} via Razorpay →</span>
                ) : (
                  <span>Place Cash on Delivery Order →</span>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>100% Safe & Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;