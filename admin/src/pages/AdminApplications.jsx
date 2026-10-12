import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "antd";
import {message} from "antd";
const ADMIN_TOKEN = "i4oTayXOPrLmdMaaBhYbIdeowhIZRRQa";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "https://ss-infotech-v2-2.onrender.com/api/applications/recive-applications"
      );
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
      message.error("Failed to load applications.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Open resume directly using resumePath
  const handleDownload = (resumePath, name) => {
    if (!resumePath) return alert("Resume URL not found");
    const filename = name.replace(/\s+/g, "_") + "_resume.pdf"; // optional custom name
    const a = document.createElement("a");
    a.href = resumePath;
    a.target = "_blank";  // open in new tab
    a.download = filename; // browser may ignore for cross-origin URLs, still opens fine
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Delete single application
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(`https://ss-infotech-v2-2.onrender.com/api/applications/delete/${id}`, {
        headers: { "x-admin-token": ADMIN_TOKEN },
      });
      message.success("Application deleted successfully!");
      fetchApplications();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete application.");
    }
  };

  // Delete all applications
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL applications?")) return;
    try {
      await axios.delete("https://ss-infotech-v2-2.onrender.com/api/applications/delete-all", {
        headers: { "x-admin-token": ADMIN_TOKEN },
      });
      message.success("All applications deleted successfully!");
      fetchApplications();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete all applications.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Job Applications</h2>
        <Button danger onClick={handleDeleteAll}>
          Delete All
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">Phone</th>
              <th className="border px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{app.name}</td>
                <td className="border px-3 py-2">{app.email}</td>
                <td className="border px-3 py-2">{app.phone}</td>
                <td className="border px-3 py-2 text-center space-x-2">
                  <Button
                    type="primary"
                    onClick={() => handleDownload(app.resumePath, app.name)} className="bg-[#552586]"
                  >
                    Download Resume
                  </Button>
                  <Button danger onClick={() => handleDelete(app._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}

            {applications.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
