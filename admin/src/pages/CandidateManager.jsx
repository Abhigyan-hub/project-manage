import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Upload, Table, message, Popconfirm, Input, Space } from "antd";
import { UploadOutlined, SearchOutlined, DownloadOutlined } from "@ant-design/icons";

export default function CandidateManager() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const API_BASE = "https://ss-infotech-v2-2.onrender.com/api/candidate"; // change if needed

  // ✅ Fetch all candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`${API_BASE}/candidates`);
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.candidates || [];

        // Add "uploadDate" field (mock if missing)
        const updated = data.map((c) => ({
          ...c,
          uploadDate: c.uploadDate
            ? new Date(c.uploadDate).toLocaleDateString()
            : new Date().toLocaleDateString(), // fallback
        }));

        setCandidates(updated);
        setFilteredCandidates(updated);
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
        message.error("Failed to fetch candidates");
      }
    };

    fetchCandidates();
  }, []);

  // ✅ Upload Excel
  const handleUpload = async () => {
    if (!file) return message.warning("Please select an Excel file to upload");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/upload-excel`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success(`Uploaded ${res.data.count} candidates successfully`);
      setFile(null);

      // Refresh list
      const fetchRes = await axios.get(`${API_BASE}/candidates`);
      const updated = (fetchRes.data.candidates || fetchRes.data || []).map(
        (c) => ({
          ...c,
          uploadDate: new Date().toLocaleDateString(),
        })
      );

      setCandidates(updated);
      setFilteredCandidates(updated);
    } catch (err) {
      console.error("Failed to upload Excel:", err);
      message.error(err.response?.data?.message || "Failed to upload Excel file");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete a candidate
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/candidate/${id}`);
      message.success("Candidate deleted");
      const updated = candidates.filter((c) => c._id !== id);
      setCandidates(updated);
      setFilteredCandidates(updated);
    } catch (err) {
      console.error("Failed to delete candidate:", err);
      message.error("Failed to delete candidate");
    }
  };

  // ✅ Delete all candidates
  const handleDeleteAll = async () => {
    try {
      await axios.delete(`${API_BASE}/candidates`);
      message.success("All candidates deleted");
      setCandidates([]);
      setFilteredCandidates([]);
    } catch (err) {
      console.error("Failed to delete all candidates:", err);
      message.error("Failed to delete all candidates");
    }
  };

  // ✅ Filter candidates by search input
  const handleSearch = (value) => {
    setSearchText(value);

    const lower = value.toLowerCase();
    const filtered = candidates.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(lower) ||
        c.phoneNumber?.toLowerCase().includes(lower) ||
        c.emailAddress?.toLowerCase().includes(lower) ||
        c.dateOfBirth?.toLowerCase().includes(lower) ||
        c.uploadDate?.toLowerCase().includes(lower)
    );

    setFilteredCandidates(filtered);
  };

  // ✅ Download Excel
  const handleDownload = async () => {
    try {
      const response = await axios.get(`${API_BASE}/download-excel`, {
        responseType: "blob", // Important: tells axios to treat the response as a binary blob
      });

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `candidates_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("Excel file downloaded successfully");
    } catch (err) {
      console.error("Failed to download Excel:", err);
      message.error("Failed to download Excel file");
    }
  };

  // ✅ Table columns
  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "emailAddress", key: "emailAddress" },
    { title: "Location", dataIndex: "currentLocation", key: "currentLocation" },
    { title: "DOB / Age", dataIndex: "dateOfBirth", key: "dateOfBirth" },
    {
      title: "Post Grad",
      dataIndex: "postGraduationDegree",
      key: "postGraduationDegree",
    },
    {
      title: "Under Grad",
      dataIndex: "underGraduationDegree",
      key: "underGraduationDegree",
    },
    {
      title: "Resume",
      dataIndex: "resumeLink",
      key: "resumeLink",
      render: (link) =>
        link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            View
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Excel Upload Date",
      dataIndex: "uploadDate",
      key: "uploadDate",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this candidate?"
          onConfirm={() => handleDelete(record._id)}
        >
          <Button danger size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Candidate Manager</h2>

      {/* Upload & Control Buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Upload
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
          accept=".xls,.xlsx"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Select Excel</Button>
        </Upload>

        <Button type="primary" onClick={handleUpload} loading={loading} className="bg-[#552586]">
          Upload
        </Button>

        <Button danger onClick={handleDeleteAll}>
          Delete All
        </Button>

        <Button
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          className="bg-[#552586] text-white hover:bg-[#4a2163]"
        >
          Download Excel
        </Button>

        {/* Search Box */}
        <Space>
          <Input
            placeholder="Search by name, number, email, DOB, or upload date"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            style={{ width: 320 }}
            className="border-[#552586]"
          />
        </Space>
      </div>

      {/* Candidate Table */}
      <Table
        columns={columns}
        dataSource={filteredCandidates.map((c) => ({ ...c, key: c._id }))}
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}