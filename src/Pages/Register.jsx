import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BackgroundLines } from "../Components/Bg";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://local-swart.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (!response.ok) throw new Error();

      navigate("/");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <BackgroundLines className="min-h-screen flex items-center justify-center px-4">

      <div className="w-full max-w-md z-10 relative">

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
            Create Account
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            Sign up to continue
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">
              Already have an account?
            </span>
            <Link
              to="/login"
              className="ml-2 text-sm text-green-600 hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </BackgroundLines>
  );
};

export default SignInPage;