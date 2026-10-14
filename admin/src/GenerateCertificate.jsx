import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { templates } from "../../admin/src/components/CertificateTemplates"
import { offerLetterTemplates } from "../../admin/src/components/OfferLetterTemplates"

export const DOC_TYPES = {
  offer: "Internship Offer Letter",
  completion: "Internship Completion Certificate",
};

export const ROLE_BY_TEMPLATE = {
  "Web Developer": "Web Development Intern",
  "Data Analyst": "Data Analyst Intern",
  "Cyber Security": "Cyber Security Intern",
  Marketing: "Marketing Intern",
  "Human Resources": "Human Resources Intern",
};

export function templateFromJobTitle(title = "") {
  const value = String(title).toLowerCase();
  if (/(data|analyst|analytics)/.test(value)) return "Data Analyst";
  if (/(cyber|security)/.test(value)) return "Cyber Security";
  if (/market/.test(value)) return "Marketing";
  if (/(human resource|\bhr\b)/.test(value)) return "Human Resources";
  return "Web Developer";
}

function certificateStateFromLocation(state) {
  const templateName = ROLE_BY_TEMPLATE[state?.templateName]
    ? state.templateName
    : "Web Developer";
  const docType = Object.values(DOC_TYPES).includes(state?.docType)
    ? state.docType
    : DOC_TYPES.offer;

  return {
    docType,
    templateName,
    fromApplication: Boolean(state?.fromApplication),
    data: {
      candidateName: (state?.candidateName || "").trim(),
      companyName: state?.companyName || "SS Infotech Pvt. Ltd.",
      internshipFrom: state?.internshipFrom || "",
      internshipTo: state?.internshipTo || "",
      position: state?.position || ROLE_BY_TEMPLATE[templateName],
      issuedDate: state?.issuedDate || "",
      collegeName: state?.collegeName || "",
    },
  };
}

const FIELD_LABELS = {
  candidateName: "Candidate Name",
  companyName: "Company Name",
  internshipFrom: "Internship From",
  internshipTo: "Internship To",
  position: "Position",
  issuedDate: "Issued Date",
  collegeName: "College Name",
};

const GenerateCertificate = () => {
  const location = useLocation();
  const initial = certificateStateFromLocation(location.state);
  const ref = useRef(null);
  const [docType, setDocType] = useState(initial.docType);
  const [templateName, setTemplateName] = useState(initial.templateName);
  const [downloadError, setDownloadError] = useState("");

  const [data, setData] = useState(initial.data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocTypeChange = (value) => {
    setDocType(value);
    const nextSet = value === DOC_TYPES.offer ? offerLetterTemplates : templates;
    if (!nextSet[templateName]) {
      setTemplateName(Object.keys(nextSet)[0]);
    }
  };

  const handleTemplateChange = (value) => {
    setTemplateName(value);
    setData((prev) => {
      const knownRoles = Object.values(ROLE_BY_TEMPLATE);
      const nextRole = ROLE_BY_TEMPLATE[value];
      if (!nextRole) return prev;
      if (!prev.position.trim() || knownRoles.includes(prev.position)) {
        return { ...prev, position: nextRole };
      }
      return prev;
    });
  };

  const downloadPdf = async () => {
    if (!ref.current) return;
    setDownloadError("");
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [794, 1123] });
      pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);
      const safeName = (data.candidateName || "document").replace(/[\\/:*?"<>|]/g, "").trim();
      pdf.save(`${safeName || "document"}.pdf`);
    } catch (error) {
      console.error(error);
      setDownloadError("Could not create the PDF. Please try again.");
    }
  };

  const templateSet = docType === DOC_TYPES.offer ? offerLetterTemplates : templates;
  const TemplateComponent = templateSet[templateName];
  const previewData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => String(value).trim() !== "")
  );

  return (
    <div className="p-6 space-y-6">
      {initial.fromApplication && (
        <p className="max-w-4xl mx-auto text-sm text-gray-600">
          Filled from the job application for {data.candidateName || "this applicant"}.
          College name and internship dates are not stored on the application, so add those before downloading.
        </p>
      )}
      {/* Select Document Type */}
      <div className="flex gap-4 max-w-4xl mx-auto">
        <select
          value={docType}
          onChange={(e) => handleDocTypeChange(e.target.value)}
          className="border p-2 rounded"
          aria-label="Document type"
        >
          <option value={DOC_TYPES.offer}>{DOC_TYPES.offer}</option>
          <option value={DOC_TYPES.completion}>{DOC_TYPES.completion}</option>
        </select>

        <select
          value={templateName}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="border p-2 rounded"
          aria-label="Role template"
        >
          {Object.keys(templateSet).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
        {Object.keys(data).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              {FIELD_LABELS[key] || key}
            </label>
            <input
              type="text"
              name={key}
              value={data[key]}
              onChange={handleChange}
              className="border rounded p-2"
              placeholder={`Enter ${key}`}
            />
          </div>
        ))}
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          onClick={downloadPdf}
          className="bg-[#552586] hover:bg-[#552586] text-white py-2 px-4 rounded"
        >
          Download {docType}
        </button>
      </div>
      {downloadError && (
        <p className="text-center text-sm text-red-600">{downloadError}</p>
      )}

      {/* Preview */}
      <div className="flex justify-center overflow-x-auto bg-gray-100 py-10">
        <div ref={ref}>
          {TemplateComponent ? (
            <TemplateComponent key={`${docType}-${templateName}`} data={previewData} type={docType} />
          ) : (
            <p className="text-red-500 text-center">Selected template not found!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateCertificate;
