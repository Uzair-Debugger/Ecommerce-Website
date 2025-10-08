// src/Pages/Auth/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Eye, EyeOff } from "lucide-react"; // Eye icons

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    // Stricter regex: ensures username@domain.extension
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.status || "Signup failed. Please try again.");
        return;
      }

      toast.success(data.status || "Registration successful! Please log in.");
      navigate('/login');

    } catch (error) {
      console.error("Signup Error: ", error);
      toast.error("A network error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Light theme: bg-gray-50 for subtle off-white background
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-inter p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl ring-1 ring-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-cyan-800 mb-8 tracking-tight">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              disabled={isLoading}
              // Cyan focus rings for branding
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 transition duration-150 ease-in-out shadow-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
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
                Signing Up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          {/* Cyan 700/800 link color */}
          <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-800 hover:underline transition duration-150">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
