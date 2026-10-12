import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Upload, Table, message, Popconfirm, Input, Space } from "antd";

// Icons
import { Trash, Plus, Edit3, Loader2 } from "lucide-react";

export default function AdminJobs() {
  const BASE_URL = "https://ss-infotech-v2-2.onrender.com/api/jobs";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    experience: "",
    type: "Full-time",
    skills: "",
    description: "",
    salary: "",
    category: "",
  });

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/show-jobs`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Update Job
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const jobData = {
        ...jobForm,
        skills: jobForm.skills.split(",").map((s) => s.trim()),
      };

      const url = editingJob
        ? `${BASE_URL}/update-jobs/${editingJob._id}`
        : `${BASE_URL}/add-jobs`;
      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save job");

      message.success(editingJob ? "Job updated successfully!" : "Job added successfully!");

      // Reset form
      setJobForm({
        title: "",
        company: "",
        location: "",
        experience: "",
        type: "Full-time",
        skills: "",
        description: "",
        salary: "",
        category: "",
      });
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch(`${BASE_URL}/delete-jobs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete job");

      message.success("Job deleted successfully!");
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      message.error(err.message);
    }
  };

  // Edit job
  const handleEdit = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      experience: job.experience,
      type: job.type,
      skills: job.skills.join(", "),
      description: job.description,
      salary: job.salary,
      category: job.category,
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold mb-6">Admin Job Listings</h1>

      {/* Job Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4"
      >
        <h2 className="text-xl font-semibold">{editingJob ? "Edit Job" : "Add New Job"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["title", "company", "location", "experience", "salary", "category"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={jobForm[field]}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
              required={["title", "company"].includes(field)}
            />
          ))}

          <select
            name="type"
            value={jobForm.type}
            onChange={handleInputChange}
            className="border p-2 rounded-md"
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
          </select>

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={jobForm.skills}
            onChange={handleInputChange}
            className="border p-2 rounded-md"
          />
        </div>

        <textarea
          name="description"
          placeholder="Job Description"
          value={jobForm.description}
          onChange={handleInputChange}
          className="border p-2 rounded-md w-full"
          rows="3"
          required
        ></textarea>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#552586] text-white px-4 py-2 rounded-md hover:bg-[#552586] flex items-center gap-2"
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : editingJob ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {editingJob ? "Update Job" : "Create Job"}
        </button>
      </form>

      {/* Jobs List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Existing Jobs</h2>
        {loading ? <p>Loading jobs...</p> : null}
        {!loading && jobs.length === 0 && <p>No jobs found.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                <p className="text-xs text-gray-500">{job.skills?.join(", ")}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(job)}
                  className="text-[#552586] hover:text-[#552586] flex items-center gap-1"
                >
                  <Edit3 className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
