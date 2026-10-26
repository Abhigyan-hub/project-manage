import { useEffect, useMemo, useState, useRef } from "react";
import { Search, MapPin, Briefcase, Clock, IndianRupee, X, Sparkles, Stars, GraduationCap } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { internships } from "../data/internships";

// Time ago utility
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  return "just now";
}

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: "easeOut",
      when: "beforeChildren"
    },
  }),
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// JobApplicationModal Component
function JobApplicationModal({ job, isOpen, onClose, isInternship }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      console.log("Modal Job Data:", job);
      if (!job.title) console.warn("Job title is undefined in modal:", job);
    }
  }, [job]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.resume) {
      toast.error("Please select a resume file.");
      setSubmitting(false);
      return;
    }

    const fullPhone = isInternship ? `${countryCode}${phoneDigits}` : formData.phone;

    if (isInternship && !/^\d{10}$/.test(phoneDigits)) {
      toast.error("Please enter a valid 10-digit phone number.");
      setSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("jobId", job.id);
    formDataToSend.append("title", job.title || "Untitled Job");
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", fullPhone);
    formDataToSend.append("resume", formData.resume);

    try {
      const response = await fetch("https://ss-infotech-v2-2.onrender.com/api/applications/fill-applications", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      toast.success(data.message || "Application submitted successfully!");
      console.log("Application Response:", data.message, data.application);
      setFormData({ name: "", email: "", phone: "", resume: null });
      setCountryCode("+91");
      setPhoneDigits("");

      if (isInternship) {
        const subject = encodeURIComponent(`Internship Application - ${job.title || "Internship"}`);
        const body = encodeURIComponent(
          `Hello,\n\nI would like to apply for the ${job.title || "internship"} role.\n\nFull Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${fullPhone}\n\nMy resume is attached to the application submitted on the website. Please attach it here as well if needed.\n`
        );
        window.location.href = `mailto:hr@ssinfotech.co.in?subject=${subject}&body=${body}`;
      }

      onClose();
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error(err.message || "An error occurred while submitting the application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl border border-slate-200"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Apply for {job.title || 'Untitled Job'}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-purple-600 transition-colors"
            disabled={submitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
              placeholder="Enter your full name"
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
              placeholder="Enter your email"
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Phone</label>
            {isInternship ? (
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value.replace(/[^\d+]/g, "").slice(0, 5))}
                  required
                  aria-label="Country code"
                  className="w-20 shrink-0 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-slate-50 text-slate-900"
                  disabled={submitting}
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  name="phoneDigits"
                  value={phoneDigits}
                  onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Enter a 10-digit phone number"
                  className="min-w-0 flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                  placeholder="10-digit mobile number"
                  disabled={submitting}
                />
              </div>
            ) : (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                placeholder="Enter your phone number"
                disabled={submitting}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Resume</label>
            <input
              type="file"
              name="resume"
              onChange={handleInputChange}
              accept=".pdf,.doc,.docx"
              required
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-slate-50 text-slate-900 file:text-slate-600"
              disabled={submitting}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <motion.button
              type="button"
              onClick={onClose}
              disabled={submitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors font-medium"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium shadow-lg shadow-purple-600/20"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// JobSearch Component
export default function JobSearch() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState(undefined);
  const [jobType, setJobType] = useState(undefined);
  const [category, setCategory] = useState(undefined);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [salaryRange, setSalaryRange] = useState(undefined);
  const [postedWithin, setPostedWithin] = useState(undefined);
  const [visible, setVisible] = useState(4);
  const [saved, setSaved] = useState({});
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");

  const tabs = [
    { id: "jobs", label: "Job Opportunities", icon: Briefcase },
    { id: "internships", label: "Internship Opportunities", icon: GraduationCap },
  ];

  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        let url = "https://ss-infotech-v2-2.onrender.com/api/jobs/show-jobs";

        const params = new URLSearchParams();
        if (query) params.append("query", query);
        if (location) params.append("location", location);
        if (category) params.append("category", category);
        if (salaryRange) {
          const [min, max] = salaryRange.split("₹")[1].split("-").map((s) => parseInt(s.replace(" LPA", "")) * 100000);
          params.append("salaryMin", min);
          if (max) params.append("salaryMax", max);
        }
        if (postedWithin && postedWithin !== "Any") {
          const days = { "Last 24 hours": 1, "Last 7 days": 7, "Last 30 days": 30 };
          params.append("daysSincePosted", days[postedWithin]);
        }
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        const transformedJobs = data.jobs.map((job) => ({
          id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          experience: job.experience || "Not specified",
          type: job.type || "Full-time",
          skills: job.skills || [],
          postedAt: job.createdAt,
          description: job.description,
          salary: job.salary || "Not specified",
          category: job.category || "Other",
          isAdmin: true,
        }));
        setJobs(transformedJobs);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch jobs: ${err.message}`);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [query, location, category, salaryRange, postedWithin]);

  const locations = useMemo(() => Array.from(new Set(jobs.map((j) => j.location))), [jobs]);
  const experiences = ["0-1 years", "1-3 years", "2-4 years", "4+ years"];
  const types = useMemo(() => Array.from(new Set(jobs.map((j) => j.type))), [jobs]);
  const skills = useMemo(() => Array.from(new Set(jobs.flatMap((j) => j.skills))), [jobs]);
  const categories = useMemo(() => Array.from(new Set(jobs.map((j) => j.category))), [jobs]);
  const salaryRanges = ["₹5-10 LPA", "₹10-15 LPA", "₹15-20 LPA", "₹20+ LPA"];
  const postedWithinOptions = ["Any", "Last 24 hours", "Last 7 days", "Last 30 days"];

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchesExperience = experience ? job.experience === experience : true;
      const matchesType = jobType ? job.type === jobType : true;
      const matchesSkills = selectedSkills.length > 0 ? selectedSkills.every((skill) => job.skills.includes(skill)) : true;
      const matchesQuery = !query || job.title.toLowerCase().includes(query.toLowerCase()) || job.company.toLowerCase().includes(query.toLowerCase()) || job.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));
      const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
      const matchesCategory = !category || job.category === category;
      const matchesSalary = !salaryRange || job.salary.startsWith(salaryRange.split("-")[0]);
      const matchesPostedWithin = !postedWithin || (postedWithin === "Any" || timeAgo(job.postedAt).includes(postedWithin));
      return matchesExperience && matchesType && matchesSkills && matchesQuery && matchesLocation && matchesCategory && matchesSalary && matchesPostedWithin;
    });
  }, [jobs, experience, jobType, selectedSkills, query, location, category, salaryRange, postedWithin]);

  const toggleSave = (jobId) => {
    setSaved((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
    toast.success(saved[jobId] ? "Job removed from saved" : "Job saved!");
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const [isInternshipApply, setIsInternshipApply] = useState(false);

  const handleViewApply = (job, internship = false) => {
    setSelectedJob(job);
    setIsInternshipApply(internship);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in", "slide-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [filtered]);

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-hidden">
      {/* Animated Background Elements — Light Theme */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-purple-200/30 rounded-full blur-xl"
        animate={{
          y: [0, 30, 0],
          x: [0, 15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-32 right-20 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"
        animate={{
          y: [0, -40, 0],
          x: [0, -20, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />

      {/* Floating Stars */}
      <motion.div
        className="absolute top-1/4 left-1/5"
        variants={floatingAnimation}
        animate="animate"
      >
        <Stars className="h-6 w-6 text-purple-300" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-1/3"
        variants={floatingAnimation}
        animate="animate"
        style={{ animationDelay: '2s' }}
      >
        <Sparkles className="h-4 w-4 text-purple-300" />
      </motion.div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {/* Hero Section */}
        <motion.div className="text-center mb-12" variants={item}>
          <motion.div
            className="inline-flex items-center justify-center mb-6"
            variants={item}
          >
            <div className="bg-purple-100 text-purple-800 px-6 py-2 text-lg border border-purple-200 shadow-md rounded-full font-semibold">
              Job Opportunities
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6"
            variants={item}
          >
            Find Your Dream{" "}
            <motion.span
              className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent inline-block"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              Career
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            variants={item}
          >
            Discover exciting job opportunities that match your skills and aspirations.{" "}
            <motion.span
              className="font-semibold text-purple-700"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Your next career move starts here.
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Opportunity Tabs */}
        <motion.div className="flex justify-center mb-10" variants={item}>
          <div
            role="tablist"
            aria-label="Opportunity type"
            className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm"
          >
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <motion.button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isActive
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                      : "bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {activeTab === "jobs" && (
        <motion.div key="jobs" initial="hidden" animate="visible" variants={container}>
        {/* Search Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8"
          variants={container}
        >
          <motion.div className="lg:col-span-2 flex items-center space-x-2" variants={item}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by job title, company, or skills"
                className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:shadow-lg bg-white text-slate-900 placeholder:text-slate-400 shadow-sm"
              />
            </div>
            <motion.button
              onClick={() => {
                setQuery("");
                setLocation("");
                setExperience(undefined);
                setJobType(undefined);
                setCategory(undefined);
                setSelectedSkills([]);
                setSalaryRange(undefined);
                setPostedWithin(undefined);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl font-medium text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 shadow-sm"
            >
              Reset
            </motion.button>
          </motion.div>
          <motion.div variants={item}>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location (e.g., Pune, India)"
                className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:shadow-lg bg-white text-slate-900 placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          variants={container}
        >
          {/* Filters Sidebar */}
          <motion.aside className="space-y-4" variants={item}>
            <motion.div 
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -3 }}
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                Filters
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select
                    onChange={(e) => setCategory(e.target.value === "__any" ? undefined : e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-slate-50 text-slate-900"
                  >
                    <option value="__any">Any</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Experience</label>
                  <select
                    onChange={(e) => setExperience(e.target.value === "__any" ? undefined : e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-slate-50 text-slate-900"
                  >
                    <option value="__any">Any</option>
                    {experiences.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Job Type</label>
                  <select
                    onChange={(e) => setJobType(e.target.value === "__any" ? undefined : e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-slate-50 text-slate-900"
                  >
                    <option value="__any">Any</option>
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Skills</label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {skills.map((skill) => (
                      <label key={skill} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-purple-50 p-1 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={() => toggleSkill(skill)}
                          className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-slate-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Salary Range</label>
                  <select
                    onChange={(e) => setSalaryRange(e.target.value === "__any" ? undefined : e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-slate-50 text-slate-900"
                  >
                    <option value="__any">Any</option>
                    {salaryRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Posted Within</label>
                  <select
                    onChange={(e) => setPostedWithin(e.target.value === "__any" ? undefined : e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-slate-50 text-slate-900"
                  >
                    <option value="__any">Any</option>
                    {postedWithinOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-sm text-slate-600">
                    Saved <strong className="text-purple-700">{Object.keys(saved).filter((k) => saved[k]).length}</strong> jobs
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -3 }}
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Stars className="w-4 h-4 mr-2 text-purple-600" />
                Tips
              </h2>
              <ul className="list-disc ml-5 text-sm text-slate-600 space-y-2">
                <li>Use specific keywords (e.g., nurse, accountant) to narrow results.</li>
                <li>Apply quickly to new listings — save them for later review.</li>
                <li>Filter by category and salary to find the best fit.</li>
              </ul>
            </motion.div>
          </motion.aside>

          {/* Job Listings */}
          <motion.section className="lg:col-span-3 space-y-4" variants={container}>
            {loading && (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-slate-600 text-lg">Loading jobs...</p>
              </motion.div>
            )}
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}
            {!loading && !error && (
              <motion.div variants={container}>
                <motion.h3 className="text-2xl font-semibold text-slate-900 mb-4" variants={item}>
                  Job Opportunities
                </motion.h3>
                <motion.div className="flex items-center justify-between mb-4" variants={item}>
                  <p className="text-sm text-slate-600">
                    Showing <strong className="text-slate-900">{filtered.length}</strong> results
                  </p>
                  <div className="text-sm text-slate-600">
                    Sorted by <strong className="text-slate-900">Relevance</strong>
                  </div>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.slice(0, visible).map((job, index) => (
                    <motion.div
                      key={job.id}
                      ref={(el) => (cardRefs.current[index] = el)}
                      className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      variants={item}
                      whileHover={{ y: -5 }}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="bg-purple-50 rounded-xl p-3 shadow-sm">
                                <Briefcase className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                                <p className="text-sm text-slate-600">
                                  {job.company} • {job.location}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full border border-purple-200 text-purple-700 bg-purple-50">
                                {job.experience}
                              </span>
                              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full border border-slate-200 text-slate-700 bg-slate-50">
                                {job.type}
                              </span>
                              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                {job.category}
                              </span>
                              {job.skills.slice(0, 3).map((s) => (
                                <span
                                  key={s}
                                  className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                            <div className="mt-4 text-sm text-slate-600 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-slate-400" />
                                {timeAgo(job.postedAt)}
                              </span>
                              {job.salary && (
                                <span className="flex items-center gap-1">
                                  <IndianRupee className="h-4 w-4 text-slate-400" />
                                  {job.salary}
                                </span>
                              )}
                            </div>
                            <div className="mt-4">
                              <p className="text-sm text-slate-600 line-clamp-3">{job.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <motion.button
                              onClick={() => handleViewApply(job)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-lg shadow-purple-600/20"
                            >
                              View & Apply
                            </motion.button>
                            <motion.button
                              onClick={() => toggleSave(job.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border ${
                                saved[job.id]
                                  ? "bg-purple-50 text-purple-700 border-purple-300"
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              {saved[job.id] ? "Saved" : "Save"}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {filtered.length === 0 && (
                  <motion.div 
                    className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-lg text-slate-600">
                      No jobs matched your search. Try adjusting filters or keywords.
                    </p>
                  </motion.div>
                )}
                {visible < filtered.length && (
                  <motion.div className="text-center mt-8" variants={item}>
                    <motion.button
                      onClick={() => setVisible((v) => v + 4)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-lg shadow-purple-600/20"
                    >
                      Load More Opportunities
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.section>
        </motion.div>
        </motion.div>
        )}

        {/* Internship Listings */}
        {activeTab === "internships" && (
          <motion.section key="internships" className="space-y-4" initial="hidden" animate="visible" variants={container}>
            <motion.h3 className="text-2xl font-semibold text-slate-900 mb-2" variants={item}>
              Internship Opportunities
            </motion.h3>
            <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4" variants={item}>
              <p className="text-sm text-slate-600">
                These are the internship domains we accept applications for, not individual live vacancies.
              </p>
              <p className="text-sm text-slate-600 shrink-0">
                Showing <strong className="text-slate-900">{internships.length}</strong> domains
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((internship) => (
                <motion.div
                  key={internship.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col"
                  variants={item}
                  whileHover={{ y: -5 }}
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-purple-50 rounded-xl p-3 shadow-sm shrink-0">
                        <GraduationCap className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{internship.title}</h3>
                        <p className="text-sm text-slate-600">{internship.category}</p>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full border border-purple-200 text-purple-700 bg-purple-50">
                        {internship.type}
                      </span>
                      {internship.skills.map((s) => (
                        <span
                          key={s}
                          className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-slate-600 flex-1">{internship.description}</p>
                    <div className="mt-6">
                      <motion.button
                        onClick={() => handleViewApply(internship, true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-lg shadow-purple-600/20"
                      >
                        Apply for Internship
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>

      <JobApplicationModal
        job={selectedJob}
        isOpen={isModalOpen}
        isInternship={isInternshipApply}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}