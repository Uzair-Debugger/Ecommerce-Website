// src/Pages/Auth/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Eye, EyeOff } from 'lucide-react'; // Added Eye icons
// Assuming useCart context is still needed, though its internal logic is untouched
import { useCart } from "../Context/CartContext"; 
import { apiUrl } from "../../config/api";

export default function Login() {
  // const { isAdmin, setIsAdmin } = useCart() // Kept as in original
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password toggle
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // { formData.email === 'uzair@gmail.com' ? setIsAdmin(true) : setIsAdmin(false) } // Logic preserved

      const response = await fetch(apiUrl("/auth/login"), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        // Use toast for error notification
        toast.error(data.status)
        return;
      }
      
      const data = await response.json();

      // Successful login: store token and navigate
      localStorage.setItem('token', data.accessToken);
      toast.success("Login successful! Welcome back.");
      navigate('/shop');
      
    } catch (error) {
      console.error("Login Error: ", error);
      // Replaced alert() with toast.error()
      toast.error("A network or unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Light theme: bg-gray-50 for subtle off-white background
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-inter p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl ring-1 ring-gray-200">
        {/* Cyan 800 Heading */}
        <h2 className="text-4xl font-extrabold text-center text-cyan-800 mb-8 tracking-tight">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              // type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              // Cyan focus rings for branding
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 transition duration-150 ease-in-out shadow-sm"
            />
          </div>

          {/* Password with Eye Toggle */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={isLoading}
              // Cyan focus rings for branding
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 pr-10 transition duration-150 ease-in-out shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-500 hover:text-cyan-700 transition" // Cyan hover on icon
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button (Cyan 700 / 800) */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 text-lg font-semibold rounded-xl transition duration-300 ease-in-out transform shadow-lg 
              ${isLoading
                ? 'bg-cyan-400 cursor-not-allowed text-white'
                : 'bg-cyan-700 hover:bg-cyan-800 text-white hover:scale-[1.01] active:scale-[0.99]'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging In...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          {/* Cyan 700/800 link color */}
          <Link to="/signup" className="font-semibold text-cyan-700 hover:text-cyan-800 hover:underline transition duration-150">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
