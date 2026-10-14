import React from "react";
import certificateBg from "../../assets/certificate-bg.png";

const CyberSecurityTemplate = ({ data = {}, type = "Internship Offer Letter" }) => {
  const {
    candidateName = "[Candidate Name]",
    collegeName = "[College Name]",
    companyName = "SS Infotech Pvt. Ltd.",
    position = "Cyber Security Intern",
    internshipFrom = "[Start Date]",
    internshipTo = "[End Date]",
    issuedDate = "[Issued Date]",
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
            ? `Offer for Internship in Cyber Security`
            : "Certificate of Internship"}
        </p>

        <p className="mb-4">Dear {candidateName},</p>

        {type === "Internship Offer Letter" ? (
          <>
            <p className="mb-3">
              We are pleased to offer you the position of{" "}
              <strong>{position}</strong> at{" "}
              <strong>{companyName}</strong>. Your passion for cybersecurity and
              enthusiasm for securing digital infrastructures make you an ideal
              candidate for this internship.
            </p>

            <p className="mb-3">
              As a <strong>{position}</strong>, you will gain practical
              experience in the following areas:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>
                Performing vulnerability assessments and penetration testing.
              </li>
              <li>
                Monitoring network activity for suspicious patterns and security
                breaches.
              </li>
              <li>
                Analyzing malware, phishing threats, and intrusion attempts.
              </li>
              <li>
                Implementing security policies and encryption techniques.
              </li>
              <li>
                Collaborating with the team to design secure system
                architectures.
              </li>
            </ul>

            <p className="mb-3">
              The internship will commence on <strong>{internshipFrom}</strong>{" "}
              and conclude on <strong>{internshipTo}</strong>. Please confirm
              your acceptance by replying to this email or submitting a signed
              copy of this offer.
            </p>

            <p className="mb-6">
              We look forward to having you as part of our Cyber Security team
              and are confident that this experience will significantly enhance
              your technical expertise.
            </p>
          </>
        ) : (
          <>
            <p className="mb-3">
              This is to formally certify that <strong>{candidateName}</strong>{" "}
              has successfully completed an internship at{" "}
              <strong>{companyName}</strong> from{" "}
              <strong>{internshipFrom}</strong> to{" "}
              {<strong>{internshipTo}.</strong>}
            </p>

            <div className="mt-4 mb-3">
              <p className="font-semibold underline">Internship Details:</p>
              <p>Intern Name: {candidateName}</p>
              <p>Position: {position}</p>
              <p>Department: Cyber Security & Network Defense</p>
              <p>
                Internship Duration: {internshipFrom} to {internshipTo}
              </p>
            </div>

            <div className="mt-4 mb-3">
              <p className="font-semibold underline">
                Responsibilities Undertaken:
              </p>
              <div className="pl-6">
                <p>
                  Conducting vulnerability assessments and penetration testing
                  on internal systems.
                </p>
                <p>
                  Assisting in incident response and forensic investigation
                  exercises.
                </p>
                <p>
                  Implementing firewall configurations and access control
                  measures.
                </p>
                <p>
                  Monitoring and analyzing network logs for potential security
                  threats.
                </p>
                <p>
                  Researching and documenting cybersecurity best practices and
                  emerging threats.
                </p>
              </div>
            </div>

            <div className="mt-4 mb-3">
              <p className="font-semibold underline">
                Internship Overview & Performance Evaluation:
              </p>
              <p>
                Throughout the internship, {candidateName} demonstrated
                excellent analytical thinking, attention to detail, and a
                strong understanding of cybersecurity principles. Their
                contributions to system hardening and vulnerability mitigation
                were highly valuable to the team.
              </p>
            </div>

            <div className="mt-4 mb-3">
              <p className="font-semibold underline">
                Conclusion & Appreciation:
              </p>
              <p>
                We appreciate {candidateName}'s dedication, technical skills,
                and professionalism displayed during the internship. Their
                performance has been exemplary, and we are confident that the
                knowledge and hands-on experience gained during this period will
                greatly contribute to their future success in the field of
                Cyber Security.
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CyberSecurityTemplate;
