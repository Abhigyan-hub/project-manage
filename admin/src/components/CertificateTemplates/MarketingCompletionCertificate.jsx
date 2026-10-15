import React from "react";
import CertificateFrame from "../CertificateFrame";

const MarketingCompletionCertificate = ({ data = {}, type = "Certificate" }) => {
  const {
    candidateName = "[Candidate Name]",
    companyName = "[Company Name]",
    internshipFrom = "[Start Date]",
    internshipTo = "[End Date]",
    department = "Marketing",
    position = "Marketing Intern",
    issuedDate = "[Date]",
    collegeName = "[College Name]",
  } = data;

  return (
    <CertificateFrame>
    <div className="relative h-full w-full p-8">
      {/* Date top-right */}
      <div className="absolute right-8 text-sm pt-44">
        Date: <strong>{issuedDate}</strong>
      </div>

      {/* Title */}
      <div className="text-center font-bold text-[20px] underline pt-52">
        INTERNSHIP COMPLETION CERTIFICATE
      </div>

      <div className="absolute left-8 right-8 text-[14px] pt-4">
        {/* To Section */}
        <div className="mb-4">
          <p className="font-semibold">To,</p>
          <p className="font-semibold">{candidateName},</p>
          <p>{collegeName}.</p>
        </div>

        {/* Subject */}
        <p className="font-semibold mb-3">
          Subject: Certificate of Internship
        </p>

        {/* Greeting */}
        <p className="mb-4">Dear {candidateName},</p>

        {/* Main Content */}
        <p className="mb-3">
          This is to formally certify that <strong>{candidateName}</strong> has successfully
          completed an internship at <strong>{companyName}</strong> from{" "}
          <strong>{internshipFrom}</strong> to <strong>{internshipTo}</strong>. During the
          tenure of the internship, {candidateName} was assigned to the{" "}
          <strong>{position}</strong> role in the <strong>{department}</strong> department.
        </p>

        {/* Internship Details */}
        <p className="mb-3 font-semibold">Internship Details:</p>
        <div className="pl-4 mb-3">
          <p>
            <strong>Intern Name:</strong> {candidateName}
          </p>
          <p>
            <strong>Position:</strong> {position}
          </p>
          <p>
            <strong>Internship Duration:</strong> {internshipFrom} to {internshipTo}
          </p>
        </div>

        {/* Responsibilities Undertaken */}
        <p className="mb-3 font-semibold">Responsibilities Undertaken:</p>
        <p className="mb-3">
          During the internship, {candidateName} actively contributed to the marketing and
          promotional activities of the organization. Key responsibilities included:
        </p>
        <div className="pl-4 mb-3">
          <p>
            Assisting in the planning and execution of marketing campaigns across digital and
            offline platforms.
          </p>
          <p>
            Conducting market research and competitor analysis to support strategic decisions.
          </p>
          <p>
            Creating and managing promotional content for social media and marketing materials.
          </p>
          <p>
            Coordinating with design and HR teams for event promotions and brand awareness.
          </p>
          <p>
            Tracking campaign performance and contributing to reports for improvement.
          </p>
        </div>

        {/* Overview & Evaluation */}
        <p className="mb-3 font-semibold">
          Internship Overview & Performance Evaluation:
        </p>
        <p className="mb-2">
          Throughout the internship, {candidateName} demonstrated creativity, communication
          skills, and professionalism. Their enthusiasm in executing marketing activities and
          collaboration within the team was highly commendable.
        </p>

        {/* Closing */}
        <p className="">
          We appreciate {candidateName}’s efforts and wish them great success in their future
          career in Marketing.
        </p>
      </div>
    </div>
    </CertificateFrame>
  );
};

export default MarketingCompletionCertificate;
