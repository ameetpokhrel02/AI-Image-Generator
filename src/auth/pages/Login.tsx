import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background texture/pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      {/* Glassmorphism Card */}
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        {/* Subtle light reflections */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
        
        {/* Back to Home Link */}
        <div className="w-full mb-6 relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center text-white/60 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center relative z-10">
          {/* Circular Logo */}
          <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-4 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-white/40 border border-white/50"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-white/70 text-center">Please enter your details to sign in.</p>
        </div>
        
        {error && (
          <div className="w-full mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm text-center backdrop-blur-sm relative z-10">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 relative z-10">
          {/* Email Input with Action Button */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">Email</label>
            <div className="flex items-center space-x-3">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="flex-1 px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent" 
              disabled={isLoading}
            />
            <label className="text-white/70 text-sm">Remember me</label>
          </div>
        </form>

        {/* OR Separator */}
        <div className="w-full flex items-center my-8 relative z-10">
          <div className="flex-1 h-px bg-white/20" />
          <span className="px-4 text-white/50 text-sm font-medium">OR</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4 relative z-10">
          <button className="w-full flex items-center justify-between px-4 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all group">
            <div className="flex items-center space-x-3">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Continue with Google</span>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <span className="text-white text-sm">→</span>
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between px-4 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all group">
            <div className="flex items-center space-x-3">
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="GitHub"
                className="w-5 h-5"
              />
              <span>Continue with GitHub</span>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <span className="text-white text-sm">→</span>
            </div>
          </button>
        </div>

        {/* Create Account Link */}
        <div className="mt-8 text-center relative z-10">
          <span className="text-white/70">Don't have an account? </span>
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
