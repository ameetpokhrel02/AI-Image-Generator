import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (submitError) setSubmitError("");
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError("");

    try {
      const success = await signup(formData.fullName, formData.email, formData.password);
      if (success) {
        navigate("/");
      } else {
        setSubmitError("Failed to create account. Please try again.");
      }
    } catch (err) {
      setSubmitError("An error occurred during signup");
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
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/70 text-center">Please fill in your details to get started.</p>
        </div>
        
        {submitError && (
          <div className="w-full mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm text-center backdrop-blur-sm relative z-10">
            {submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 relative z-10">
          {/* Full Name Input */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.fullName ? 'border-red-400' : 'border-white/20'
              }`}
              required
              disabled={isLoading}
            />
            {errors.fullName && <p className="text-red-300 text-sm mt-2">{errors.fullName}</p>}
          </div>
          
          {/* Email Input */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.email ? 'border-red-400' : 'border-white/20'
              }`}
              required
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-300 text-sm mt-2">{errors.email}</p>}
          </div>
          
          {/* Password Input */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.password ? 'border-red-400' : 'border-white/20'
              }`}
              required
              disabled={isLoading}
            />
            {errors.password && <p className="text-red-300 text-sm mt-2">{errors.password}</p>}
          </div>
          
          {/* Confirm Password Input */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.confirmPassword ? 'border-red-400' : 'border-white/20'
              }`}
              required
              disabled={isLoading}
            />
            {errors.confirmPassword && <p className="text-red-300 text-sm mt-2">{errors.confirmPassword}</p>}
          </div>
          
          {/* Terms Agreement */}
          <div>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent mt-0.5" 
                disabled={isLoading}
              />
              <span className="text-white/70 text-sm">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && <p className="text-red-300 text-sm mt-2">{errors.agreeToTerms}</p>}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <span className="ml-2">→</span>
              </>
            )}
          </button>
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

        {/* Sign In Link */}
        <div className="mt-8 text-center relative z-10">
          <span className="text-white/70">Already have an account? </span>
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
