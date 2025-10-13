import React, { useState } from "react";

export default function ReceiptUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [otherFile, setOtherFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setMessage("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOtherFile(file);
      setMessage("");
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (type === "image") {
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
      } else {
        setOtherFile(file);
      }
      setMessage("");
    }
  };

  const handleUpload = () => {
    if (!imageFile && !otherFile) {
      setMessage("Please upload a file first.");
      return;
    }
    setMessage("✅ File uploaded locally (no backend connected).");
  };

  const handleReset = () => {
    setImageFile(null);
    setOtherFile(null);
    setPreview(null);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Upload Receipt
        </h2>

        {/* Image Upload */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-4 mb-5 text-center hover:border-blue-400 transition"
          onDrop={(e) => handleDrop(e, "image")}
          onDragOver={(e) => e.preventDefault()}
        >
          <label className="block cursor-pointer">
            <span className="text-gray-600">
              📷 Image Upload (or take a photo)
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-lg border"
            />
          ) : (
            <p className="text-sm text-gray-400 mt-2">
              Drag & drop or tap to upload
            </p>
          )}
        </div>

        {/* File Upload */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-4 mb-5 text-center hover:border-blue-400 transition"
          onDrop={(e) => handleDrop(e, "file")}
          onDragOver={(e) => e.preventDefault()}
        >
          <label className="block cursor-pointer">
            <span className="text-gray-600">📎 Other File Upload</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {otherFile ? (
            <p className="text-sm text-gray-600 mt-2">
              Selected: <strong>{otherFile.name}</strong>
            </p>
          ) : (
            <p className="text-sm text-gray-400 mt-2">
              Drag & drop or tap to upload
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-3">
          <button
            onClick={handleUpload}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg"
          >
            Upload
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg"
          >
            Reset
          </button>
        </div>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
