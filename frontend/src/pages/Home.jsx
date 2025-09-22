import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import Image from "../components/Image";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate("/login");
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-xl font-semibold">
        Loading your dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-4 py-10 flex flex-col items-center">
      <div className="max-w-4xl w-full text-center space-y-6">
        {user ? (
          <>
           <h1 className="text-3xl md:text-4xl font-bold text-teal-400">
  Welcome, {user.name}
</h1>
<p className="text-lg md:text-xl text-gray-300">
  Your dashboard is ready. Time to unleash the full power of ImageOptimizer.
</p>
<p className="mt-4 text-base md:text-lg text-gray-400">
  ImageOptimizer is a full-stack image management platform built for developers, designers, and creators who demand speed, precision, and control. Upload your images, compress them with customizable quality settings, and manage your gallery with ease. Powered by Express, Multer, Sharp, JWT, and Tailwind CSS, this tool blends backend efficiency with a sleek, responsive UI—perfect for testing media pipelines, optimizing assets, or showcasing your work.
</p>
<p className="mt-2 italic text-sm text-gray-500">
  Built for performance. Designed for clarity. Yours to command.
</p>

            <button
              onClick={handleLogout}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium transition duration-300"
            >
              Logout
            </button>

            <div className="mt-10">
              <Image />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
              Welcome to imageoptimizer
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Please sign in to access your dashboard.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
              <Link to="/login">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition duration-300">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition duration-300">
                  Signup
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;