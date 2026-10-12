import React, { useState, useEffect } from "react";
import { Button, Upload, Table, message, Popconfirm, Input, Space } from "antd";

const AdminSlides = () => {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    cta: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const API_BASE = "https://ss-infotech-v2-2.onrender.com"; // Your backend URL

  // Fetch slides on mount
  useEffect(() => {
    fetchSlides();
  }, []);

  // Fetch slides
  const fetchSlides = async () => {
    try {
      setFetchError("");
      const res = await fetch(`${API_BASE}/api/slides`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      console.log("Fetched slides:", data);
      setSlides(data.slides || []);
    } catch (error) {
      console.error("Error fetching slides:", error);
      setFetchError(`Failed to fetch slides: ${error.message}`);
      setSlides([]);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit new slide
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return message.error("Please select a file");
    if (!form.title.trim()) return message.error("Please provide a title");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("url", file);
      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("cta", form.cta);

      console.log("Submitting form data...");

      const res = await fetch(`${API_BASE}/api/slides`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      console.log("Success:", result);

      setForm({ title: "", subtitle: "", cta: "" });
      setFile(null);
      document.getElementById("file-input").value = "";
      fetchSlides();
      message.success(" Slide created successfully!");
    } catch (error) {
      console.error("Error creating slide:", error);
      message.error(` Error creating slide: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete slide
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/slides/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      console.log("Delete success:", result);
      fetchSlides();
      message.success(" Slide deleted successfully!");
    } catch (error) {
      console.error("Error deleting slide:", error);
      message.error(` Error deleting slide: ${error.message}`);
    }
  };

  // Test backend connection
  const testConnection = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/slides`, {
        credentials: "include",
      });
      if (res.status === 200) {
        message.success("✅ Backend connection successful!");
      } else {
        message.error("⚠️ Backend connection failed!");
      }
    } catch (error) {
      message.error(` Backend connection failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Hero Slides</h2>
        <button
          onClick={testConnection}
          className="bg-[#552586] hover:bg-[#6a36a2] text-white px-4 py-2 rounded text-sm"
        >
          Test Backend Connection
        </button>
      </div>

      {/* Error Display */}
      {fetchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {fetchError}
        </div>
      )}

      {/* Add Slide Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-semibold mb-4">Add New Slide</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* File Upload */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media File *
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported: JPG, PNG, JPEG, WEBP, MP4, WEBM
            </p>
            {file && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Title */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              placeholder="Slide title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              placeholder="Optional subtitle"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          {/* CTA Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call-to-Action
            </label>
            <input
              type="text"
              placeholder="Optional button text"
              value={form.cta}
              onChange={(e) => setForm({ ...form, cta: e.target.value })}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="bg-[#552586] hover:bg-[#6a36a2] disabled:bg-[#a58ec2] text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          {loading ? "Uploading..." : "Add Slide"}
        </button>
      </form>

      {/* Slides List */}
      <div className="bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold p-6 border-b">
          Current Slides ({slides.length})
        </h3>

        {slides.length === 0 ? (
          <p className="p-6 text-gray-500">
            {fetchError
              ? "Cannot load slides - check backend connection"
              : "No slides available. Add your first slide above."}
          </p>
        ) : (
          <ul className="divide-y">
            {slides.map((slide) => (
              <li
                key={slide._id || slide.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-12 bg-gray-200 rounded overflow-hidden">
                    {slide.type === "video" ? (
                      <video
                        src={slide.url}
                        className="w-full h-full object-cover"
                        muted
                        autoPlay
                        loop
                      />
                    ) : (
                      <img
                        src={slide.url}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2U0ZTVlNiIvPjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzkzOTQ5NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+";
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{slide.title || "Untitled Slide"}</h4>
                    <p className="text-sm text-gray-500 capitalize">
                      {slide.type} •{" "}
                      {new Date(slide.createdAt).toLocaleDateString()}
                    </p>
                    {slide.subtitle && (
                      <p className="text-sm text-gray-600 mt-1">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(slide._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminSlides;
