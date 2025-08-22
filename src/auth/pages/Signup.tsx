import React from "react";

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center border border-white/20">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
          <p className="text-sm text-white/80">Fill in the details to get started.</p>
        </div>
        <form className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex items-center text-sm">
            <label className="flex items-center text-white/80">
              <input type="checkbox" className="mr-2 rounded" />
              I agree to the{" "}
              <a href="/terms" className="text-purple-400 hover:underline ml-1">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-purple-400 hover:underline ml-1">
                Privacy Policy
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 rounded-lg text-white font-bold text-lg shadow hover:opacity-90 transition-all"
          >
            <span>Sign Up</span>
            <span className="ml-2">→</span>
          </button>
        </form>
        <div className="w-full flex items-center my-4">
          <div className="flex-1 h-px bg-white/30" />
          <span className="px-2 text-white/60 text-xs">OR</span>
          <div className="flex-1 h-px bg-white/30" />
        </div>
        <button className="w-full flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg text-white font-semibold mb-2 border border-white/20">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
          <span className="ml-auto">→</span>
        </button>
        <button className="w-full flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg text-white font-semibold border border-white/20">
          <img
            src="https://www.svgrepo.com/show/512317/github-142.svg"
            alt="GitHub"
            className="w-5 h-5"
          />
          Continue with GitHub
          <span className="ml-auto">→</span>
        </button>
        <div className="mt-6 text-center text-white/80 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-purple-400 hover:underline">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
