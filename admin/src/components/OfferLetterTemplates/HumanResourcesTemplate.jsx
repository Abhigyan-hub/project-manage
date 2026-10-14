import React from "react";
import certificateBg from "../../assets/certificate-bg.png";

const HumanResourcesTemplate = ({ data }) => {
  const {
    candidateName,
    collegeName,
    companyName,
    position,
    internshipFrom,
    internshipTo,
  } = data;

  return (
    <div
      className="relative w-[794px] h-[1123px] mx-auto text-[14px] leading-relaxed bg-white"
      style={{
        backgroundImage: `url(${certificateBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute left-8 right-8 pt-40">
        <p>To,</p>
        <p className="font-semibold">{candidateName || "candidate Name"}</p>
        <p>{collegeName || "College Name"}</p>

        <p className="mt-6 font-semibold">Subject: Offer for Internship in Human Resources</p>

        <p className="mt-6">Dear {candidateName || "Candidate Name"},</p>

        <p className="mt-4 text-justify">
          We are pleased to offer you an opportunity to join{" "}
          <b>{companyName || "SS Infotech Pvt. Ltd."}</b> as a{" "}
          <b>{position || "Human Resources Intern"}</b>. Based on our discussions and review of your
          background, we are confident that your potential and enthusiasm will positively contribute
          to our team.
        </p>

        <p className="mt-4 text-justify">
          <b>Internship Details:</b>
          <br />
          Internship Role: {position || "Human Resources Intern"}
          <br />
          Location: Nagpur
          <br />
          Start Date: {internshipFrom || "DD/MM/YYYY"}
          {internshipTo ? (
            <>
              <br />
              End Date: {internshipTo}
            </>
          ) : null}
        </p>

        <p className="mt-4 text-justify">
          During your internship, you will be guided by the HR and Marketing leads of{" "}
          {companyName || "SS Infotech Pvt. Ltd."}. You are expected to maintain confidentiality,
          professionalism, and actively contribute to the assigned tasks and ongoing projects.
        </p>

        <p className="mt-4 text-justify">
          Upon successful completion of your internship and submission of your final report and
          evaluation, a certificate of completion will be provided. Please note that this internship
          is part of your academic development and does not constitute an offer of employment.
        </p>

        <p className="mt-4 text-justify">
          Kindly confirm your acceptance of this offer by replying to this email or submitting a
          signed copy of this letter.
        </p>

        <p className="mt-4 text-justify">
          We look forward to having you on board and witnessing your contributions.
        </p>

      </div>
    </div>
  );
};

export default HumanResourcesTemplate;
