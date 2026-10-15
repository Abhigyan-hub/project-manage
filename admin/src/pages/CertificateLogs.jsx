import { useEffect, useState } from "react";
import axios from "axios";

function formatCreatedOn(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}, ${hours}:${minutes}`;
}

export default function CertificateLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios
      .get("/api/certificate-logs", { timeout: 20000 })
      .then((response) => {
        if (!active) return;
        setLogs(response.data.logs || []);
      })
      .catch(() => {
        if (!active) return;
        setError("Certificate logs could not be loaded. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Certificate logs</h1>
      {loading && <p className="text-gray-600">Loading letters...</p>}
      {error && <p className="text-gray-800">{error}</p>}
      {!loading && !error && logs.length === 0 && (
        <p className="text-gray-700">No letters have been created yet.</p>
      )}
      {!loading && !error && logs.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border px-3 py-2">Created on</th>
                <th className="border px-3 py-2">Candidate name</th>
                <th className="border px-3 py-2">College</th>
                <th className="border px-3 py-2">Letter type</th>
                <th className="border px-3 py-2">Role</th>
                <th className="border px-3 py-2">Internship from</th>
                <th className="border px-3 py-2">Internship to</th>
                <th className="border px-3 py-2">Issued date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="border px-3 py-2">{formatCreatedOn(log.createdAt)}</td>
                  <td className="border px-3 py-2">{log.candidateName || "—"}</td>
                  <td className="border px-3 py-2">{log.collegeName || "—"}</td>
                  <td className="border px-3 py-2">{log.letterType}</td>
                  <td className="border px-3 py-2">{log.role || "—"}</td>
                  <td className="border px-3 py-2">{log.internshipFrom || "—"}</td>
                  <td className="border px-3 py-2">{log.internshipTo || "—"}</td>
                  <td className="border px-3 py-2">{log.issuedDate || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
