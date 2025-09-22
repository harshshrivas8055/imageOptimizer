import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(userData));
  };

  useEffect(() => {
    if (user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4 py-12">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
          Create Your imageoptimizer Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={userData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold transition duration-300 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error?.message || error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;