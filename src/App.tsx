import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/context/AuthContext";
import ImageGenerator from "./components/ImageGenerator";
import PromptHistory from "./components/PromptHistory";
import Login from "./auth/pages/Login";
import Signup from "./auth/pages/Signup";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main App Content
const AppContent: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800">
      {/* Navigation Header */}
      <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white hover:text-purple-300 transition-colors">
            AI Image Generator
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-white/80">Welcome, {user.fullName}</span>
                <button 
                  onClick={logout}
                  className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg text-red-300 font-semibold transition-all border border-red-500/50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left section - Main Generator */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-lg p-6 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-4">
                Generate AI Images
              </h2>
              <p className="text-gray-300 mb-6">
                Enter your prompt below and generate unique AI-powered images.
              </p>
              <ImageGenerator />
            </div>
          </div>

          {/* Right section - Prompt History */}
          <div className="backdrop-blur-md bg-white/5 rounded-2xl shadow-lg p-6 border border-white/20 overflow-y-auto max-h-[80vh]">
            <PromptHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Main App Route - Protected */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } />
          
          {/* Redirect to home for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
