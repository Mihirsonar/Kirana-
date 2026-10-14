import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Order Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent to our team.");
      setFormData({
        name: "",
        email: "",
        subject: "Order Inquiry",
        message: "",
      });
    }, 1000);
  };

  const contactCards = [
    {
      icon: Phone,
      title: "Call Us",
      info: "+91 98765 43210",
      desc: "Mon - Sun: 7:00 AM - 11:00 PM",
      action: "tel:+919876543210",
      actionText: "Call Now",
    },
    {
      icon: Mail,
      title: "Email Support",
      info: "support@kiranaplus.com",
      desc: "Average response time: 2 hours",
      action: "mailto:support@kiranaplus.com",
      actionText: "Send Email",
    },
    {
      icon: MapPin,
      title: "Headquarters",
      info: "Navi Mumbai, Maharashtra",
      desc: "Near Tilak Global School, 400705",
      action: "#",
      actionText: "Directions",
    },
    {
      icon: Clock,
      title: "Delivery Hours",
      info: "6:00 AM - Midnight",
      desc: "365 days a year across service zones",
      action: "#",
      actionText: "Check Zones",
    },
  ];

  const faqs = [
    {
      q: "How fast is delivery?",
      a: "Our typical delivery time is within 15 to 20 minutes from our nearest partner kirana store or dark store.",
    },
    {
      q: "What payment methods are supported?",
      a: "We accept all major UPI apps (Google Pay, PhonePe, Paytm), Debit/Credit cards, NetBanking via Razorpay, and Cash on Delivery (COD).",
    },
    {
      q: "How can I track my active order?",
      a: "Go to 'My Orders' in the top menu or profile to see real-time status updates (Processing, Out for Delivery, Delivered).",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <ToastContainer position="bottom-right" autoClose={2000} />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>We're Here to Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Contact Kirana+ Support
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Have a question about an order, delivery partner inquiries, or need assistance? Reach out to us anytime.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {c.title}
                  </h3>
                  <p className="font-bold text-sm text-purple-600 dark:text-purple-400 mt-1">
                    {c.info}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {c.desc}
                  </p>
                </div>
                {c.action !== "#" && (
                  <a
                    href={c.action}
                    className="mt-4 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline block"
                  >
                    {c.actionText} →
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Form & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Send us a Message
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Fill out the form below and our customer care team will get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Topic / Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                >
                  <option value="Order Inquiry">Order Inquiry / Delivery Delay</option>
                  <option value="Refund & Payment">Refund or Payment Issue</option>
                  <option value="Product Quality">Product Quality Feedback</option>
                  <option value="Vendor Partnership">Vendor / Kirana Partner Inquiry</option>
                  <option value="Other">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you today?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-md active:scale-99 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Sending..." : "Submit Message"}</span>
              </button>
            </form>
          </div>

          {/* Quick FAQ Accordion */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-4">
                <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Frequently Asked Questions</span>
              </div>

              <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
                {faqs.map((f, i) => (
                  <div key={i} className={i !== 0 ? "pt-3.5" : ""}>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {f.q}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}