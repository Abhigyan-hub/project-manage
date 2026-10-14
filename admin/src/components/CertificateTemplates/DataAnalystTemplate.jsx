import React from "react";
import certificateBg from "../../assets/certificate-bg.png";

const DataAnalystTemplate = ({ data = {}, type = "Internship Offer Letter" }) => {
  const {
    candidateName = "[Candidate Name]",
    collegeName = "[College Name]",
    companyName = "SS Infotech Pvt. Ltd.",
    position = "Data Analyst Intern",
    internshipFrom = "[Start Date]",
    internshipTo = "[End Date]",
    issuedDate = "[Date]",
  } = data;

  return (
    <div
      className="relative w-[794px] h-[1123px] p-8"
      style={{
        backgroundImage: `url(${certificateBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute right-8 text-sm pt-44">
        Date: <strong>{issuedDate}</strong>
      </div>

      <div className="text-center font-bold text-[20px] underline pt-52">INTERNSHIP COMPLETION CERTIFICATE</div>

      <div className="absolute left-8 right-8 text-[14px] pt-4">
        <div className="mb-4">
          <p className="font-semibold">To,</p>
          <p className="font-semibold">{candidateName}</p>
          <p>{collegeName}</p>
        </div>
        
        <p className="font-semibold mb-3">
          Subject:{" "}
          {type === "Internship Offer Letter"
            ? `Offer for Internship in ${position}`
            : "Certificate of Internship"}
        </p>

        <p className="mb-4">Dear {candidateName},</p>

        {type === "Internship Offer Letter" ? (
          <>
            <p className="mb-3">
              We are pleased to offer you the position of <strong>{position}</strong> at{" "}
              <strong>{companyName}</strong>. Your internship will focus on data analysis,
              business intelligence, and related tasks. Internship Details:
            </p>

            <p className="mb-3">
              Internship Duration: <strong>{internshipFrom}</strong> to <strong>{internshipTo}</strong>.
              Please confirm your acceptance by replying to this email or returning a signed copy of this letter.
            </p>

            <p className="mb-6">
              We look forward to your contributions and growth during the internship.
            </p>
          </>
        ) : (
          <>
            <p className="mb-3">
              This is to formally certify that <strong>{candidateName}</strong> has successfully completed an internship at{" "}
              <strong>{companyName}</strong> from <strong>{internshipFrom}</strong> to <strong>{internshipTo}</strong>.
            </p>

            <div className="mt-4 mb-3">
              <p className="font-semibold underline">Internship Details:</p>
              <p>Intern Name: {candidateName}</p>
              <p>Position: {position}</p>
              <p>Department: Data Analytics</p>
              <p>Internship Duration: {internshipFrom} to {internshipTo}</p>
            </div>

            <div className="mt-4 mb-3">
              <p className="font-semibold underline">Responsibilities Undertaken:</p>
              <p>
                During the internship, {candidateName} actively contributed to data analysis and business intelligence tasks. Key responsibilities included:
              </p>
              <p>Data Collection & Cleaning: Gathering, processing, and cleaning large datasets for analysis.</p>
              <p>Data Visualization: Creating insightful visualizations using tools like Tableau, Power BI, and Matplotlib.</p>
              <p>Statistical Analysis: Applying statistical techniques to interpret and extract valuable insights from data.</p>
              <p>SQL & Database Management: Querying and managing data using SQL and relational databases.</p>
              <p>Machine Learning & Predictive Analytics: Assisting in building models for forecasting and trend analysis.</p>
            </div>

            <div className="mt-4 mb-3">
              <p className="font-semibold underline">Internship Overview & Performance Evaluation:</p>
              <p>
                Throughout the internship, {candidateName} exhibited exceptional analytical thinking, attention to detail, and enthusiasm in learning new data-driven technologies. Contributions to data projects and teamwork were highly commendable.
              </p>
            </div>

            
          </>
        )}

      </div>
    </div>
  );
};

export default DataAnalystTemplate;
