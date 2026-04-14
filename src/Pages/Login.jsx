import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BackgroundLines } from "../Components/Bg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://local-swart.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await response.json();

      localStorage.setItem("User", JSON.stringify(data.user.name));
      localStorage.setItem("Token", JSON.stringify(data.token));
      localStorage.setItem("Role", JSON.stringify(data.user.role));

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLines className="min-h-screen flex items-center justify-center px-4">

      <div className="w-full max-w-md z-10 relative">

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
            Welcome Back
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            Login to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="password"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">
              Don’t have an account?
            </span>
            <Link
              to="/register"
              className="ml-2 text-sm text-green-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </BackgroundLines>
  );
};

export default LoginPage;