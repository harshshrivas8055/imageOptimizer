import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, fetchImages, deleteImage } from "../redux/imageSlice";

const Image = () => {
  const dispatch = useDispatch();
  const { images, loading, error } = useSelector((state) => state.image);
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    dispatch(uploadImage(formData));
    setFile(null);
  };

  const handleDelete = (filename) => {
    dispatch(deleteImage(filename));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 text-white">
      <h2 className="text-3xl font-bold text-center text-teal-400 mb-8">
        Upload & Manage Images
      </h2>

      <form
        onSubmit={handleUpload}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="bg-gray-800 text-white p-2 rounded-md w-full sm:w-auto"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded-md font-medium transition duration-300 ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-center font-semibold mb-6">
          {error?.message || error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.length === 0 ? (
          <p className="text-center text-gray-300 col-span-full">
            No images uploaded yet.
          </p>
        ) : (
          images.map((img) => (
            <div
              key={img.filename}
              className="bg-gray-900 rounded-lg p-4 shadow-md flex flex-col items-center"
            >
              <img
                src={`http://localhost:8000/uploads/${img.filename
                  .split("-")
                  .pop()
                  .replace(".jpg", "")}/${img.filename}`}
                alt={img.filename}
                className="w-full h-auto max-w-xs rounded-md mb-4"
              />
              <div className="text-sm text-gray-300 space-y-1 text-center">
                <p className="font-semibold">{img.filename}</p>
                <p>Size: {(img.size / 1024).toFixed(2)} KB</p>
                <p>
                  Quality:{" "}
                  {img.optimized
                    ? img.filename.split("-").pop().replace(".jpg", "")
                    : "original"}
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href={`http://localhost:8000/api/images/download/${img.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm">
                    Download
                  </button>
                </a>
                <button
                  onClick={() => handleDelete(img.filename)}
                  className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Image;
