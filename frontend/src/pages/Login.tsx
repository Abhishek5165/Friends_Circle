import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import friend from '../images/friend.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-green-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg overflow-hidden shadow-xl">
        <div className="p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading} // Disable button while loading
                className={`w-full py-2 rounded-lg transition-colors text-white ${
                  loading ? 'bg-green-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>
          <h2 className="mt-7 text-4xl text-center font-bold text-green-800">Friends Zone !</h2>
          <p className="text-center mt-6">
            Don't have an account? <Link to="/signup" className="text-green-600">Signup now</Link>
          </p>
        </div>
        <div className="hidden md:block bg-green-600 p-8 text-white relative">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Every new friend is a new adventure.</h2>
            <img src={friend} alt="friend" className="rounded-lg" />
            <p className="text-lg text-center mt-4 font-semibold">Let's get connected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
