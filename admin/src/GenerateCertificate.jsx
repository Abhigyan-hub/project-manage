import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaCopy, FaPlus, FaTrash } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { templates } from "../../admin/src/components/CertificateTemplates"
import { offerLetterTemplates } from "../../admin/src/components/OfferLetterTemplates"
import CollegeNameField from "../../admin/src/components/CollegeNameField"

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

const DATE_FIELDS = new Set(["internshipFrom", "internshipTo", "issuedDate"]);

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseISODate(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(match[1]) ||
    date.getMonth() !== Number(match[2]) - 1 ||
    date.getDate() !== Number(match[3])
  ) {
    return null;
  }
  return date;
}

function addMonths(iso, months) {
  const date = parseISODate(iso);
  if (!date) return "";
  date.setMonth(date.getMonth() + months);
  return toISODate(date);
}

function addDays(iso, days) {
  const date = parseISODate(iso);
  if (!date) return "";
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

function formatDisplayDate(iso) {
  const date = parseISODate(iso);
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function datesFromInternshipStart(fromIso) {
  const internshipFrom = parseISODate(fromIso) ? fromIso : toISODate(new Date());
  return {
    internshipFrom,
    internshipTo: addMonths(internshipFrom, 6),
    issuedDate: addDays(internshipFrom, -3),
  };
}

const EditableOfferPreview = React.memo(function EditableOfferPreview({ Template, previewKey, docType }) {
  const sourceRef = useRef(null);
  const hostRef = useRef(null);
  const data = useMemo(() => JSON.parse(previewKey), [previewKey]);

  useEffect(() => {
    if (!sourceRef.current || !hostRef.current || !Template) return;
    hostRef.current.innerHTML = sourceRef.current.innerHTML;
  }, [Template, docType, previewKey]);

  if (!Template) {
    return <p className="text-red-500 text-center">Selected template not found!</p>;
  }

  return (
    <>
      <div ref={sourceRef} aria-hidden="true" style={{ display: "none" }}>
        <Template data={data} type={docType} />
      </div>
      <div
        ref={hostRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck
        className="letter-editor bg-white outline-none"
        style={{ width: 794, minHeight: 1123 }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;
          event.preventDefault();
          document.execCommand("insertLineBreak");
        }}
      />
    </>
  );
});

function certificateStateFromLocation(state) {
  const templateName = ROLE_BY_TEMPLATE[state?.templateName]
    ? state.templateName
    : "Web Developer";
  const docType = Object.values(DOC_TYPES).includes(state?.docType)
    ? state.docType
    : DOC_TYPES.offer;
  const dates = datesFromInternshipStart(state?.internshipFrom);

  return {
    docType,
    templateName,
    fromApplication: Boolean(state?.fromApplication),
    data: {
      candidateName: (state?.candidateName || "").trim(),
      companyName: state?.companyName || "SS Infotech Pvt. Ltd.",
      internshipFrom: dates.internshipFrom,
      internshipTo: parseISODate(state?.internshipTo) ? state.internshipTo : dates.internshipTo,
      position: state?.position || ROLE_BY_TEMPLATE[templateName],
      issuedDate: parseISODate(state?.issuedDate) ? state.issuedDate : dates.issuedDate,
      collegeName: state?.collegeName || "",
    },
  };
}

const LETTER_TYPE_LABEL = {
  [DOC_TYPES.offer]: "Offer letter",
  [DOC_TYPES.completion]: "Completion certificate",
};

const FIELD_LABELS = {
  candidateName: "Candidate Name",
  companyName: "Company Name",
  internshipFrom: "Internship From",
  internshipTo: "Internship To",
  position: "Position",
  issuedDate: "Issued Date",
  collegeName: "College Name",
};

function blankLetterData() {
  const dates = datesFromInternshipStart();
  return {
    candidateName: "",
    companyName: "SS Infotech Pvt. Ltd.",
    internshipFrom: dates.internshipFrom,
    internshipTo: dates.internshipTo,
    position: ROLE_BY_TEMPLATE["Web Developer"],
    issuedDate: dates.issuedDate,
    collegeName: "",
  };
}

function createLetter(source) {
  return {
    id: crypto.randomUUID(),
    docType: source?.docType || DOC_TYPES.offer,
    templateName: source?.templateName || "Web Developer",
    data: source?.data ? { ...source.data } : blankLetterData(),
  };
}

async function saveCertificateLog(letter) {
  await axios.post(
    "/api/certificate-logs",
    {
      candidateName: letter.data.candidateName,
      collegeName: letter.data.collegeName,
      letterType: LETTER_TYPE_LABEL[letter.docType] || letter.docType,
      role: letter.data.position,
      internshipFrom: formatDisplayDate(letter.data.internshipFrom),
      internshipTo: formatDisplayDate(letter.data.internshipTo),
      issuedDate: formatDisplayDate(letter.data.issuedDate),
    },
    { timeout: 20000 },
  );
}

function ScaledLetterPreview({ captureRef, children }) {
  const frameRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const update = () => {
      const available = frame.clientWidth;
      setScale(available > 0 ? Math.min(1, available / 794) : 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="w-full overflow-hidden bg-gray-100 py-6">
      <div className="mx-auto" style={{ width: 794 * scale, height: 1123 * scale }}>
        <div style={{ width: 794, height: 1123, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <div ref={captureRef}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function LetterCard({ letter, canRemove, sideBySide, onChange, onDuplicate, onRemove }) {
  const ref = useRef(null);
  const [downloadError, setDownloadError] = useState("");
  const [logNote, setLogNote] = useState("");
  const { docType, templateName, data } = letter;
  const templateSet = docType === DOC_TYPES.offer ? offerLetterTemplates : templates;
  const TemplateComponent = templateSet[templateName];
  const previewData = Object.fromEntries(
    Object.entries(data)
      .map(([key, value]) => [
        key,
        DATE_FIELDS.has(key) ? formatDisplayDate(value) : value,
      ])
      .filter(([, value]) => String(value).trim() !== "")
  );
  const isOffer = docType === DOC_TYPES.offer;
  const collegeInputId = `college-${letter.id}`;

  const updateData = (nextData) => {
    onChange({ ...letter, data: typeof nextData === "function" ? nextData(letter.data) : nextData });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "internshipFrom") {
      const dates = value ? datesFromInternshipStart(value) : {
        internshipFrom: "",
        internshipTo: "",
        issuedDate: "",
      };
      updateData((prev) => ({ ...prev, ...dates }));
      return;
    }
    updateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocTypeChange = (value) => {
    const nextSet = value === DOC_TYPES.offer ? offerLetterTemplates : templates;
    const nextTemplate = nextSet[templateName] ? templateName : Object.keys(nextSet)[0];
    onChange({ ...letter, docType: value, templateName: nextTemplate });
  };

  const handleTemplateChange = (value) => {
    const knownRoles = Object.values(ROLE_BY_TEMPLATE);
    const nextRole = ROLE_BY_TEMPLATE[value];
    const position = !nextRole || (data.position.trim() && !knownRoles.includes(data.position))
      ? data.position
      : nextRole;
    onChange({
      ...letter,
      templateName: value,
      data: { ...data, position },
    });
  };

  const downloadPdf = async () => {
    if (!ref.current) return;
    setDownloadError("");
    setLogNote("");
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
      try {
        await saveCertificateLog(letter);
      } catch (error) {
        console.error(error);
        setLogNote("The letter was downloaded, but it could not be added to Certificate logs.");
      }
    } catch (error) {
      console.error(error);
      setDownloadError("Could not create the PDF. Please try again.");
    }
  };

  return (
    <section className={`${sideBySide ? "min-w-0" : "max-w-4xl mx-auto"} space-y-6 border rounded-lg p-4 bg-white`}>
      {canRemove && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove letter"
            title="Remove"
            className="text-gray-500 hover:text-red-600 p-2 rounded"
          >
            <FaTrash size={14} />
          </button>
        </div>
      )}

      <div className="flex gap-4">
        <select
          value={docType}
          onChange={(event) => handleDocTypeChange(event.target.value)}
          className="border p-2 rounded"
          aria-label="Document type"
        >
          <option value={DOC_TYPES.offer}>{DOC_TYPES.offer}</option>
          <option value={DOC_TYPES.completion}>{DOC_TYPES.completion}</option>
        </select>

        <select
          value={templateName}
          onChange={(event) => handleTemplateChange(event.target.value)}
          className="border p-2 rounded"
          aria-label="Role template"
        >
          {Object.keys(templateSet).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.keys(data).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-semibold mb-1" htmlFor={key === "collegeName" ? collegeInputId : undefined}>
              {FIELD_LABELS[key] || key}
            </label>
            {key === "collegeName" ? (
              <CollegeNameField
                inputId={collegeInputId}
                value={data.collegeName}
                onChange={(collegeName) => updateData((prev) => ({ ...prev, collegeName }))}
              />
            ) : (
              <input
                type={DATE_FIELDS.has(key) ? "date" : "text"}
                name={key}
                value={data[key]}
                onChange={handleChange}
                className="border rounded p-2"
                placeholder={DATE_FIELDS.has(key) ? undefined : `Enter ${FIELD_LABELS[key] || key}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onDuplicate}
          aria-label="Duplicate letter"
          title="Duplicate"
          className="border border-[#552586] text-[#552586] p-2 rounded"
        >
          <FaCopy size={14} />
        </button>
        <button
          type="button"
          onClick={downloadPdf}
          className="bg-[#552586] text-white py-2 px-4 rounded"
        >
          {isOffer ? "Download offer letter" : "Download completion certificate"}
        </button>
      </div>
      {downloadError && (
        <p className="text-center text-sm text-red-600">{downloadError}</p>
      )}
      {logNote && (
        <p className="text-center text-sm text-gray-700">{logNote}</p>
      )}

      {isOffer && (
        <p className="text-sm text-gray-600">
          Click the offer letter and type to change the wording. Those edits are included in the download.
          Changing the form, role, or document type rebuilds the letter, so set the details first.
        </p>
      )}

      <ScaledLetterPreview captureRef={ref}>
        {isOffer ? (
          <EditableOfferPreview
            Template={TemplateComponent}
            previewKey={JSON.stringify(previewData)}
            docType={docType}
          />
        ) : TemplateComponent ? (
          <TemplateComponent key={`${docType}-${templateName}`} data={previewData} type={docType} />
        ) : (
          <p className="text-red-500 text-center">Selected template not found!</p>
        )}
      </ScaledLetterPreview>
    </section>
  );
}

const GenerateCertificate = () => {
  const location = useLocation();
  const initial = certificateStateFromLocation(location.state);
  const [letters, setLetters] = useState(() => [createLetter(initial)]);

  const updateLetter = (id, nextLetter) => {
    setLetters((current) => current.map((letter) => (letter.id === id ? nextLetter : letter)));
  };

  const addLetter = () => {
    setLetters((current) => [...current, createLetter()]);
  };

  const duplicateLetter = (id) => {
    setLetters((current) => {
      const index = current.findIndex((letter) => letter.id === id);
      if (index === -1) return current;
      const copy = createLetter(current[index]);
      const next = [...current];
      next.splice(index + 1, 0, copy);
      return next;
    });
  };

  const removeLetter = (id) => {
    setLetters((current) => (current.length <= 1 ? current : current.filter((letter) => letter.id !== id)));
  };

  const sideBySide = letters.length > 1;

  return (
    <div className="p-6 space-y-6">
      <div className={`${sideBySide ? "" : "max-w-4xl mx-auto"} flex justify-between items-center gap-4`}>
        <h1 className="text-2xl font-bold text-gray-800">Letters</h1>
        <button
          type="button"
          onClick={addLetter}
          className="inline-flex items-center gap-2 bg-[#552586] text-white py-2 px-4 rounded"
        >
          <FaPlus size={12} />
          Add another letter
        </button>
      </div>

      {initial.fromApplication && (
        <p className={`${sideBySide ? "" : "max-w-4xl mx-auto"} text-sm text-gray-600`}>
          Filled from the job application for {letters[0]?.data.candidateName || "this applicant"}.
          College name is not stored on the application. Internship dates are prefilled and can be changed.
        </p>
      )}

      <div
        className={sideBySide ? "grid items-start gap-6" : undefined}
        style={sideBySide ? { gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 560px), 1fr))" } : undefined}
      >
        {letters.map((letter) => (
          <LetterCard
            key={letter.id}
            letter={letter}
            canRemove={letters.length > 1}
            sideBySide={sideBySide}
            onChange={(nextLetter) => updateLetter(letter.id, nextLetter)}
            onDuplicate={() => duplicateLetter(letter.id)}
            onRemove={() => removeLetter(letter.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GenerateCertificate;
