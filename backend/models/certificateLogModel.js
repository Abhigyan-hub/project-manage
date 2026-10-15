import mongoose from "mongoose";

const certificateLogSchema = new mongoose.Schema({
  candidateName: { type: String, default: "" },
  collegeName: { type: String, default: "" },
  letterType: { type: String, required: true },
  role: { type: String, default: "" },
  internshipFrom: { type: String, default: "" },
  internshipTo: { type: String, default: "" },
  issuedDate: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CertificateLog", certificateLogSchema);
