import React from "react";
import { RiReactjsLine, RiTailwindCssFill } from "react-icons/ri";
import { FaNode, FaPython, FaJava, FaFigma } from "react-icons/fa";
import { SiExpress, SiMongodb, SiSpringboot } from "react-icons/si";
import { GrMysql } from "react-icons/gr";
import { DiPostgresql } from "react-icons/di";
import { TbBrandReactNative } from "react-icons/tb";

const BrandSectionWithIcons = () => {
  const technologies = [
    {
      name: "React JS",
      icon: (
        <RiReactjsLine
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#61DBFB"
        />
      ),
    },
    {
      name: "Node JS",
      icon: (
        <FaNode
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#3C873A"
        />
      ),
    },
    {
      name: "Express JS",
      icon: (
        <SiExpress
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#000000"
        />
      ),
    },
    {
      name: "MongoDB",
      icon: (
        <SiMongodb
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#47A248"
        />
      ),
    },
    {
      name: "Tailwind CSS",
      icon: (
        <RiTailwindCssFill
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#06B6D4"
        />
      ),
    },
    {
      name: "MySQL",
      icon: (
        <GrMysql
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#00758F"
        />
      ),
    },

    {
      name: "ServiceNow",
      icon: (
        <img
          src="/servicenow.png"
          alt="ServiceNow"
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain"
          onError={(e) => {
            console.error("ServiceNow image not found:", e.currentTarget.src);
          }}
        />
      ),
    },

    {
      name: "PostgreSQL",
      icon: (
        <DiPostgresql
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#336791"
        />
      ),
    },
    {
      name: "Python",
      icon: (
        <FaPython
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#FFD43B"
        />
      ),
    },
    {
      name: "Java",
      icon: (
        <FaJava
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#007396"
        />
      ),
    },
    {
      name: "Spring Boot",
      icon: (
        <SiSpringboot
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#6DB33F"
        />
      ),
    },
    {
      name: "React Native",
      icon: (
        <TbBrandReactNative
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#61DBFB"
        />
      ),
    },
    {
      name: "Figma",
      icon: (
        <FaFigma
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          color="#F24E1E"
        />
      ),
    },
  ];

  // Split array into 2 for alternate rows
  const row1 = technologies.slice(0, 6);
  const row2 = technologies.slice(6);

  return (
    <section className="section-spacing w-3/4 md:w-10/12 mt-10 md:mt-[70px] mb-10 md:mb-[70px]">
      <div className=" mx-auto  px-0 sm:px-2 animate-fade-in">
        <div className="border border-blue-500 rounded-2xl md:rounded-[30px] bg-[#EBEDF5] p-4 sm:p-6 md:p-10 lg:p-16">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Technologies We Work With
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2">
              We build powerful and scalable solutions using modern technologies
              and frameworks — from front-end to back-end.
            </p>
          </div>

          {/* === Infinite Scroll Rows === */}
          <div className="overflow-hidden space-y-3 md:space-y-4">
            {[row1, row2].map((row, i) => (
              <div
                key={i}
                className={`flex w-full gap-3 sm:gap-4 md:gap-6 ${
                  i % 2 === 0 ? "animate-marquee-left" : "animate-marquee-right"
                }`}
              >
                {row.concat(row).map((tech, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center text-center bg-white p-3 sm:p-4 md:p-5 rounded-lg md:rounded-[15px] shadow-sm min-w-[80px] sm:min-w-[100px] md:min-w-[120px] flex-shrink-0"
                  >
                    {tech.icon}
                    <div className="mt-1 md:mt-2 font-medium text-gray-800 text-xs sm:text-sm md:text-base">
                      {tech.name}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .animate-marquee-left {
          display: flex;
          animation: marquee-left 25s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          animation: marquee-right 25s linear infinite;
        }

        /* Slower animation for mobile */
        @media (max-width: 768px) {
          .animate-marquee-left {
            animation-duration: 30s;
          }
          .animate-marquee-right {
            animation-duration: 30s;
          }
        }

        /* Even slower for very small screens */
        @media (max-width: 480px) {
          .animate-marquee-left {
            animation-duration: 35s;
          }
          .animate-marquee-right {
            animation-duration: 35s;
          }
        }
      `}</style>
    </section>
  );
};

export default BrandSectionWithIcons;
