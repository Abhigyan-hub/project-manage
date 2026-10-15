import React from "react";
import CertificateFrame from "../CertificateFrame";

const CyberSecurityOfferLetter = ({ data }) => {
  const {
    candidateName,
    collegeName,
    internshipFrom,
  } = data;

  return (
    <CertificateFrame>
    <div className="relative h-full w-full text-[14px] leading-relaxed">
      <div className="absolute left-8 right-8 pt-40">
        <p>To,</p>
        <p className="font-semibold">{candidateName || "Candidate Name"}</p>
        <p>{collegeName || "College Name"},</p>

        <p className="mt-6 font-semibold">Subject: Offer for Cyber Security Intern</p>

        <p className="mt-6">Dear {candidateName || "Candidate Name"},</p>

        <p className="mt-4 text-justify">
          We are delighted to offer you the position of <b>Cyber Security Intern</b> at <b>SS Infotech Pvt. Ltd.</b>.
          We are confident that your technical acumen, curiosity, and enthusiasm for network security will be valuable to our organization.
        </p>

        <p className="mt-4 text-justify">
          <b>Internship / Training Details:</b><br />
          Role: Cyber Security Intern<br />
          Location: Nagpur<br />
          Joining Date: {internshipFrom || "DD/MM/YYYY"}
        </p>

        <p className="mt-4 text-justify">
          During your internship, you will work on vulnerability assessments, penetration testing, and security auditing 
          under the guidance of experienced professionals. This program aims to strengthen your knowledge in safeguarding 
          IT infrastructure and enhance your expertise in the field of Cyber Security.
        </p>

        <p className="mt-4 text-justify">
          Please confirm your acceptance by replying to this email or returning a signed copy of this letter.
        </p>

        <p className="mt-4 text-justify">
          We look forward to having you join our security team and contribute to our projects at SS Infotech Pvt. Ltd.
        </p>

      </div>
    </div>
    </CertificateFrame>
  );
};

export default CyberSecurityOfferLetter;
