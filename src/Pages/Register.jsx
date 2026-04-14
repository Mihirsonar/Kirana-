import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundLines } from '../Components/Bg';
import { Link } from 'react-router-dom';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);

    try {
      const response = await fetch('https://local-swart.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate('/'); 

    } catch (error) {
      console.error('Registration Error:', error);
      setIsSigningUp(false);
    }
  };

  return (
    <BackgroundLines className="flex items-center justify-center min-h-screen p-4" svgOptions={{ stroke: "#ddd" }}>
      <div className="w-full max-w-md p-6 bg-black rounded-lg shadow-md relative z-10">
        <h2 className="text-2xl font-bold text-gray-200 mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="mb-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-200 text-black"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-200 text-black"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-200 text-black"
              placeholder="Enter your password"
            />
          </div>

          <button className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg" type="submit" disabled={isSigningUp}>
            {isSigningUp ? 'Creating Account...' : 'Create an Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">Have an account?</span>
          <Link to="/login" className="text-sm text-blue-500 hover:underline ml-2">
            Login
          </Link>
        </div>
      </div>
    </BackgroundLines>
  );
};

export default SignInPage;