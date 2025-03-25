import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundLines } from "../Components/Bg"; // Import BackgroundLines component

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
      const response = await fetch("https://local-swart.vercel.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("User", JSON.stringify(data.user.name));
      localStorage.setItem("Token", JSON.stringify(data.token));
      localStorage.setItem("Role", JSON.stringify(data.user.role));

      console.log(data);
      navigate("/Adminpanel");
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLines  className="flex items-center justify-center min-h-screen" svgOptions={{ stroke: "#ddd" }}>
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-md relative z-10">
        <h2 className="text-3xl font-bold text-center text-gray-400 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white bg-blue-500 rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"} focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </BackgroundLines>
  );
};

export default LoginPage;
