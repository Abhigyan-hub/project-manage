import React from "react";
import CertificateFrame from "../CertificateFrame";

const WebDeveloperOfferLetter = ({ data }) => {
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
        <p>{collegeName || "College Name"}</p>

        <p className="mt-6 font-semibold">Subject: Offer for Internship in Web Development</p>

        <p className="mt-6">Dear {candidateName || "Candidate Name"},</p>

        <p className="mt-4 text-justify">
          We are pleased to offer you an opportunity to join <b>SS Infotech Pvt. Ltd.</b> as a <b>Web Development Intern</b>. Based on our discussions and review of your technical background, we are confident that your skills and enthusiasm will positively contribute to our development team.
        </p>

        <p className="mt-4 text-justify">
          <b>Internship / Training Details:</b><br />
          Role: Web Development Intern<br />
          Location: Nagpur<br />
          Joining Date: {internshipFrom || "DD/MM/YYYY"}
        </p>

        <p className="mt-4 text-justify">
          During your internship, you will be mentored by our senior developers and project leads. You will be involved in front-end and/or back-end development tasks, debugging, and contributing to live projects under supervision. We expect you to maintain professionalism, adhere to coding best practices, and respect the confidentiality of project details.
        </p>

        <p className="mt-4 text-justify">
          Upon successful completion of your internship and submission of your final report and evaluation, a certificate of completion will be issued. Please note that this internship is designed for your academic and skill development and does not constitute an offer of employment.
        </p>

        <p className="mt-4 text-justify">
          Kindly confirm your acceptance of this offer by replying to this email or submitting a signed copy of this letter.
        </p>

        <p className="mt-4 text-justify">
          We look forward to having you on board and seeing your contributions in action.
        </p>

        
      </div>
    </div>
    </CertificateFrame>
  );
};

export default WebDeveloperOfferLetter;
