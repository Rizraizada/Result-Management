import React from "react";
import Dropdiv from "@/components/Dropdiv";

const MDAndCEOMessage = () => {
  return (
    <div className="message-container">
      <Dropdiv />
      <div className="content-wrapper">
        {/* Left side: Image and Name/Position */}
        <div className="image-section">
          <div className="image-wrapper">
            <img
              src="/15.-Mr.-Md.-Shamim-Hossain_Chief-Executive-Officer.png" // You can replace this with the actual image path
              alt="MD & CEO"
              className="ceo-image"
            />
          </div>
          <h3 className="ceo-name">Md Shamim Hossain</h3>
          <p className="ceo-position">Managing Director & CEO</p>
          <div className="decorative-line"></div>
        </div>

        {/* Right side: MD & CEO's Message */}
        <div className="message-section">
          <h2 className="message-heading">Message from MD & CEO</h2>
          <div className="message-content">
            Mr. Md Shamim Hossain joined City General Insurance Company Limited
            as a General Manager in 2008. In his journey, he has proven himself
            as a dynamic, creative and accomplished sales professional with
            extensive experience in both B2B and B2C. With a proven track record
            of generating new businesses, he has a strong working experience in
            a highly pressured target based environment. He has served this
            company in different positions and in 2018 he had taken the
            responsibility of current charge of Managing Director & CEO. From
            2019 he has been serving this company as full placed Managing
            Director & CEO. Since then as a Managing Director he has held and
            led successfully all areas of the organization. He has around 21
            years of experience in the insurance industry. He is a highly
            motivated and enthusiastic individual with expertise in management.
            He has strong leadership and communication, technical, marketing
            skills and innovative ideas. During his working period he has
            attended many trainings seminars and symposiums on insurance and
            other related sectors. He obtained the degree of Master of Science
            in Chemistry from National University. He also completed “Post
            graduate diploma course in Computer Science and Engineering” and
            “ORACLE certification course”. Before joining in insurance company,
            he was in teaching profession. He has professional experience in IT.
            He also worked as programmer. He involves himself in various social
            activities. He was president of “Rotary Club of Shahbag” in 2018-19.
            He was also “Assistant Governor” 2021-22 of rotary district 3281
            Bangladesh.
            {/* Additional paragraphs as needed */}
          </div>
        </div>
      </div>

      <style jsx>{`
        .message-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
        }

        .content-wrapper {
          margin: 50px auto;
          max-width: 1200px;
          display: flex;
          gap: 4rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 3rem;
          position: relative;
          overflow: hidden;
          flex-wrap: wrap;
        }

        .content-wrapper::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #2563eb, #3b82f6);
        }

        .image-section {
          flex: 0 0 280px;
          text-align: center;
          position: relative;
        }

        .image-wrapper {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .image-wrapper::after {
          content: "";
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          opacity: 0.3;
          animation: pulse 2s infinite;
        }

        .ceo-image {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }

        .ceo-image:hover {
          transform: scale(1.05);
        }

        .ceo-name {
          font-size: 1.5rem;
          color: #1e3a8a;
          margin: 1rem 0 0.5rem;
          font-weight: 700;
        }

        .ceo-position {
          color: #3b82f6;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 500;
        }

        .decorative-line {
          width: 50px;
          height: 3px;
          background: #3b82f6;
          margin: 1.5rem auto;
        }

        .message-section {
          flex: 1;
          position: relative;
        }

        .message-heading {
          font-size: 2.2rem;
          color: #1e3a8a;
          margin: 0 0 2rem;
          position: relative;
          padding-bottom: 1rem;
        }

        .message-heading::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 80px;
          height: 3px;
          background: #3b82f6;
        }

        .message-content {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #374151;
        }

        .message-content p {
          margin-bottom: 1.5rem;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .content-wrapper {
            flex-direction: column;
            padding: 2rem;
            gap: 2rem;
          }

          .image-section {
            flex: none;
          }

          .ceo-image {
            width: 180px;
            height: 180px;
          }

          .message-heading {
            font-size: 1.8rem;
          }

          .message-content {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .content-wrapper {
            padding: 1.5rem;
          }

          .ceo-image {
            width: 150px;
            height: 150px;
          }

          .message-heading {
            font-size: 1.5rem;
          }

          .message-content {
            font-size: 0.95rem;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default MDAndCEOMessage;
