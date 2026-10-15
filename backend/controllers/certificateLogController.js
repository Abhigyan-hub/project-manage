import CertificateLog from "../models/certificateLogModel.js";

export const createCertificateLog = async (req, res) => {
  try {
    const {
      candidateName = "",
      collegeName = "",
      letterType = "",
      role = "",
      internshipFrom = "",
      internshipTo = "",
      issuedDate = "",
    } = req.body || {};

    if (!String(letterType).trim()) {
      return res.status(400).json({ success: false, message: "Letter type is required." });
    }

    const log = await CertificateLog.create({
      candidateName: String(candidateName).trim(),
      collegeName: String(collegeName).trim(),
      letterType: String(letterType).trim(),
      role: String(role).trim(),
      internshipFrom: String(internshipFrom).trim(),
      internshipTo: String(internshipTo).trim(),
      issuedDate: String(issuedDate).trim(),
    });

    res.status(201).json({ success: true, log });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not save the certificate log." });
  }
};

export const listCertificateLogs = async (_req, res) => {
  try {
    const logs = await CertificateLog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not load certificate logs." });
  }
};
