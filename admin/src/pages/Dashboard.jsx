import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Progress from "../components/ui/Progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/Chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { DollarSign, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { FaBriefcase } from "react-icons/fa";
import axios from 'axios';

export default function Dashboard() {
  const [albums, setAlbums] = useState([]);
  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [slides, setSlides] = useState([]);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('albums');
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albumRes, appRes, candRes, jobRes, slideRes] = await Promise.all([
          axios.get('https://ss-infotech-v2-2.onrender.com/api/albums/album-getall').catch((err) => {
            console.error('Album Fetch Error:', err);
            return { data: [] };
          }),
          axios.get('https://ss-infotech-v2-2.onrender.com/api/applications/recive-applications').catch((err) => {
            console.error('Application Fetch Error:', err);
            return { data: [] };
          }),
          axios.get('https://ss-infotech-v2-2.onrender.com/api/candidate/candidates').catch((err) => {
            console.error('Candidate Fetch Error:', err);
            return { data: [] };
          }),
          axios.get('https://ss-infotech-v2-2.onrender.com/api/jobs/show-jobs').catch((err) => {
            console.error('Job Fetch Error:', err);
            return { data: [] };
          }),
          axios.get('https://ss-infotech-v2-2.onrender.com/api/slides').catch((err) => {
            console.error('Slide Fetch Error:', err);
            return { data: [] };
          }),
        ]);
        console.log('API Responses:', { albumRes, appRes, candRes, jobRes, slideRes });

        setAlbums(Array.isArray(albumRes.data) ? albumRes.data : albumRes.data?.jobs || albumRes.data?.data || []);
        setApplications(Array.isArray(appRes.data) ? appRes.data : appRes.data?.applications || appRes.data?.data || []);
        setCandidates(Array.isArray(candRes.data) ? candRes.data : candRes.data?.candidates || candRes.data?.data || []);
        setJobs(Array.isArray(jobRes.data) ? jobRes.data : jobRes.data?.jobs || jobRes.data?.data || []);
        setSlides(Array.isArray(slideRes.data) ? slideRes.data : slideRes.data?.slides || slideRes.data?.data || []);

        console.log('Updated States:', { albums, applications, candidates, jobs, slides });
      } catch (err) {
        console.error('Overall Fetch Error:', err);
        setError('Failed to load data. Please try again.');
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => [
    { label: "Total Albums", value: albums.length, delta: albums.length > 0 ? "+5.2%" : "0%", icon: ShoppingBag, trend: albums.length > 0 ? "up" : "down" },
    { label: "Total Applications", value: applications.length, delta: applications.length > 0 ? "+3.8%" : "0%", icon: Users, trend: applications.length > 0 ? "up" : "down" },
    { label: "Total Candidates", value: candidates.length, delta: candidates.length > 0 ? "+2.1%" : "0%", icon: Users, trend: candidates.length > 0 ? "up" : "down" },
    { label: "Total Jobs", value: jobs.length, delta: jobs.length > 0 ? "+4.5%" : "0%", icon: FaBriefcase, trend: jobs.length > 0 ? "up" : "down" },
  ], [albums.length, applications.length, candidates.length, jobs.length]);

  const albumsData = useMemo(() => {
    const monthlyData = Array(12).fill(0).map((_, i) => {
      const month = new Date(currentYear, i, 1).toLocaleString('en-US', { month: 'short' });
      const count = albums.filter(a => new Date(a.createdAt || Date.now()).getMonth() === i).length;
      return { month, value: count };
    });
    return monthlyData;
  }, [albums]);

  const applicationsData = useMemo(() => {
    const monthlyData = Array(12).fill(0).map((_, i) => {
      const month = new Date(currentYear, i, 1).toLocaleString('en-US', { month: 'short' });
      const count = applications.filter(a => new Date(a.createdAt || Date.now()).getMonth() === i).length;
      return { month, value: count };
    });
    return monthlyData;
  }, [applications]);

  const candidatesData = useMemo(() => {
    const monthlyData = Array(12).fill(0).map((_, i) => {
      const month = new Date(currentYear, i, 1).toLocaleString('en-US', { month: 'short' });
      const count = candidates.filter(c => new Date(c.createdAt || Date.now()).getMonth() === i).length;
      return { month, value: count };
    });
    return monthlyData;
  }, [candidates]);

  const jobsData = useMemo(() => {
    const monthlyData = Array(12).fill(0).map((_, i) => {
      const month = new Date(currentYear, i, 1).toLocaleString('en-US', { month: 'short' });
      const count = jobs.filter(j => {
        const date = j.createdAt || j.dateCreated || j.created_date || Date.now();
        return new Date(date).getMonth() === i;
      }).length;
      return { month, value: count };
    });
    return monthlyData;
  }, [jobs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (activeSection === 'albums' && files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }
    if (activeSection === 'albums' && !isEditing && files.length < 5) {
      setError('Minimum 5 images required for new albums');
      return;
    }
    setFormData((prev) => ({ ...prev, files }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'files') {
        let fieldName;
        switch (activeSection) {
          case 'albums': fieldName = 'images'; break;
          case 'applications': fieldName = 'resume'; break;
          case 'candidates': fieldName = 'file'; break;
          case 'slides': fieldName = 'url'; break;
          default: return;
        }
        value.forEach((file) => data.append(fieldName, file));
      } else {
        data.append(key, value);
      }
    });

    try {
      if (activeSection === 'albums') {
        if (isEditing) {
          const res = await axios.patch(`https://ss-infotech-v2-2.onrender.com/api/albums/album/${editId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
          setAlbums((prev) => prev.map((item) => (item._id === editId ? res.data.album : item)));
        } else {
          const res = await axios.post('https://ss-infotech-v2-2.onrender.com/api/albums/album-post', data, { headers: { 'Content-Type': 'multipart/form-data' } });
          setAlbums((prev) => [...prev, res.data.album]);
        }
      } else if (activeSection === 'applications') {
        if (isEditing) {
          setError('Editing applications is not supported.');
          return;
        }
        const res = await axios.post('https://ss-infotech-v2-2.onrender.com/api/applications/fill-applications', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setApplications((prev) => [...prev, res.data]);
      } else if (activeSection === 'candidates') {
        if (isEditing) {
          setError('Editing candidates is not supported.');
          return;
        }
        const res = await axios.post('https://ss-infotech-v2-2.onrender.com/api/candidate/upload-excel', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setCandidates((prev) => [...prev, ...res.data]);
      } else if (activeSection === 'jobs') {
        if (isEditing) {
          const res = await axios.put(`https://ss-infotech-v2-2.onrender.com/api/jobs/update-jobs/${editId}`, formData);
          setJobs((prev) => prev.map((item) => (item._id === editId ? res.data : item)));
        } else {
          const res = await axios.post('https://ss-infotech-v2-2.onrender.com/api/jobs/add-jobs', formData);
          setJobs((prev) => [...prev, res.data]);
        }
      } else if (activeSection === 'slides') {
        if (isEditing) {
          setError('Editing slides is not supported.');
          return;
        }
        const res = await axios.post('https://ss-infotech-v2-2.onrender.com/api/slides', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSlides((prev) => [...prev, res.data]);
      }
      setFormData({});
      setIsEditing(false);
      setEditId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to save ${activeSection.slice(0, -1)}`);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setFormData({ ...item, files: [], resume: undefined, url: undefined });
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete this ${activeSection.slice(0, -1)}?`)) return;
    try {
      if (activeSection === 'albums') {
        await axios.delete(`https://ss-infotech-v2-2.onrender.com/api/albums/album/${id}`);
        setAlbums((prev) => prev.filter((item) => item._id !== id));
      } else if (activeSection === 'applications') {
        await axios.delete(`https://ss-infotech-v2-2.onrender.com/api/applications/delete/${id}`);
        setApplications((prev) => prev.filter((item) => item._id !== id));
      } else if (activeSection === 'candidates') {
        await axios.delete(`https://ss-infotech-v2-2.onrender.com/api/candidate/candidate/${id}`);
        setCandidates((prev) => prev.filter((item) => item._id !== id));
      } else if (activeSection === 'jobs') {
        await axios.delete(`https://ss-infotech-v2-2.onrender.com/api/jobs/delete-jobs/${id}`);
        setJobs((prev) => prev.filter((item) => item._id !== id));
      } else if (activeSection === 'slides') {
        await axios.delete(`https://ss-infotech-v2-2.onrender.com/api/slides/delete/${id}`);
        setSlides((prev) => prev.filter((item) => item._id !== id));
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to delete ${activeSection.slice(0, -1)}`);
    }
  };

  const handleDownloadResume = async (publicId) => {
    try {
      const response = await axios.get(`https://ss-infotech-v2-2.onrender.com/api/applications/download/${publicId}`, {
        headers: { Authorization: 'Bearer YOUR_TOKEN_HERE' },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${publicId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download resume. Ensure you are authenticated.');
    }
  };

  const fields = {
    albums: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'fullTitle', label: 'Full Title', type: 'text', required: true },
      { name: 'color', label: 'Color (e.g., from-purple-500 to-indigo-600)', type: 'text', required: true },
      { name: 'images', label: 'Images (5-10, JPEG/PNG/WEBP)', type: 'file', accept: 'image/jpeg,image/png,image/webp', multiple: true, required: !isEditing },
    ],
    applications: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel', required: true },
      { name: 'resume', label: 'Resume (PDF)', type: 'file', accept: 'application/pdf', multiple: false, required: !isEditing },
    ],
    candidates: [
      { name: 'file', label: 'Excel File', type: 'file', accept: '.xlsx,.xls', multiple: false, required: !isEditing },
    ],
    jobs: [
      { name: 'title', label: 'Job Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
    ],
    slides: [
      { name: 'url', label: 'Image/Video (JPEG/PNG/WEBP/MP4)', type: 'file', accept: 'image/jpeg,image/png,image/webp,video/mp4', multiple: false, required: !isEditing },
    ],
  };

  const renderRecentItems = () => {
    let data = [];
    switch (activeSection) {
      case 'albums': data = albums.slice(0, 4); break;
      case 'applications': data = applications.slice(0, 4); break;
      case 'candidates': data = candidates.slice(0, 4); break;
      case 'jobs': data = jobs.slice(0, 4); break;
      case 'slides': data = slides.slice(0, 4); break;
      default: return null;
    }
    // ... (rest of renderRecentItems remains the same)
    // Note: The switch case structure is simplified here; keep the full implementation as in your code
  };

  return (
    <div className="grid gap-6 p-6">
      {/* Section Selector */}
      {/* <div className="flex gap-4 mb-6">
        {['albums', 'applications', 'candidates', 'jobs', 'slides'].map((section) => (
          <Button
            key={section}
            variant={activeSection === section ? 'default' : 'outline'}
            onClick={() => {
              setActiveSection(section);
              setFormData({});
              setIsEditing(false);
              setEditId(null);
              setError('');
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Button>
        ))}
      </div> */}

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {/* <span className={isUp ? "text-emerald-600" : "text-rose-600"}>{s.delta}</span> vs last month */}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Albums Over Time</CardTitle>
              <Badge variant="secondary">{currentYear}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{ value: { label: "Albums", color: "hsl(var(--primary))" } }}
              className="h-64"
            >
              <AreaChart data={albumsData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="value" type="monotone" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/.15)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Applications Over Time</CardTitle>
              <Badge variant="secondary">{currentYear}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={{ value: { label: "Applications", color: "hsl(var(--accent))" } }} className="h-64">
              <LineChart data={applicationsData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card> */}
<Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Applications Over Time</CardTitle>
              <Badge variant="secondary">{currentYear}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{ value: { label: "Albums", color: "hsl(var(--primary))" } }}
              className="h-64"
            >
              <AreaChart data={applicationsData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="value" type="monotone" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/.15)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Candidates Over Time</CardTitle>
              <Badge variant="secondary">{currentYear}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{ value: { label: "Candidates", color: "hsl(var(--primary))" } }}
              className="h-64"
            >
              <AreaChart data={candidatesData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="value" type="monotone" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/.15)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Jobs Over Time</CardTitle>
              <Badge variant="secondary">{currentYear}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={{ value: { label: "Jobs", color: "hsl(var(--accent))" } }} className="h-64">
              <LineChart data={jobsData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Jobs Over Time</CardTitle>
              <Badge variant="secondary">{currentYear}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{ value: { label: "Albums", color: "hsl(var(--primary))" } }}
              className="h-64"
            >
              <AreaChart data={jobsData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="value" type="monotone" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/.15)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Items */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          {renderRecentItems()}
        </Card>
      </div>

      {/* Form Section (Commented out as in original) */}
      {/* ... */}
    </div>
  );
}