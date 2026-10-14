import React from "react";
import CertificateFrame from "../CertificateFrame";

const DataAnalystOfferLetter = ({ data }) => {
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
        <p>Nagpur</p>

        <p className="mt-6 font-semibold">Subject: Offer for Data Analyst Intern</p>

        <p className="mt-6">Dear {candidateName || "Candidate Name"},</p>

        <p className="mt-4 text-justify">
          We are pleased to offer you the position of <b>Data Analyst Intern</b> at <b>SS Infotech Pvt. Ltd.</b>.
          We are confident that your analytical mindset, dedication, and enthusiasm will be valuable assets to our team.
        </p>

        <p className="mt-4 text-justify">
          <b>Internship / Training Details:</b><br />
          Role: Data Analyst Intern<br />
          Location: Nagpur<br />
          Joining Date: {internshipFrom || "DD/MM/YYYY"}
        </p>

        <p className="mt-4 text-justify">
          During your internship, you will gain hands-on experience with data collection, cleaning, visualization, and 
          basic machine learning model interpretation. This training will help you build a strong foundation in 
          statistical analysis and data-driven decision-making, enhancing your career prospects in the field of Data Science.
        </p>

        <p className="mt-4 text-justify">
          Kindly confirm your acceptance of this offer by replying to this email or sending a signed copy of this letter.
        </p>

        <p className="mt-4 text-justify">
          We look forward to welcoming you to our team and witnessing your growth during your internship with us.
        </p>

      </div>
    </div>
    </CertificateFrame>
  );
};

export default DataAnalystOfferLetter;
