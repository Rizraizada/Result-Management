import React from 'react';
import Dropdiv from '@/components/Dropdiv';

const ChairmanMessage = () => {
  return (
    <div className="message-container">
      <Dropdiv />
      <div className="content-wrapper">
  {/* Left side: Image and Name/Position */}
  <div className="image-section">
    <div className="image-wrapper">
      <img
        src="/hossain-akther.png"
        alt="Chairman"
        className="chairman-image"
      />
    </div>
    <h3 className="chairman-name">মো. মনিরুল ইসলাম</h3>
    <p className="chairman-position">প্রধান শিক্ষক</p>
    <div className="decorative-line"></div>
  </div>

  {/* Right side: Chairman's Message */}
  <div className="message-section">
    <h2 className="message-heading">প্রধান শিক্ষকের বার্তা</h2>
    <div className="message-content">
      <p>
        "প্রিয় মূল্যবান অভিভাবকবৃন্দ, সম্মানিত সহকর্মী ও বন্ধুরা, আজ আমি এই
        গুরুত্বপূর্ণ মঞ্চে দাঁড়িয়ে আমাদের প্রতিষ্ঠানের প্রধান শিক্ষকের
        দায়িত্ব পালন করে অত্যন্ত গর্বিত ও কৃতজ্ঞ। দীর্ঘকাল ধরে আমরা একটি
        বিশেষ প্রতিষ্ঠান গড়ে তুলেছি এবং আজ আমি আমাদের অর্জিত
        মাইলফলকগুলো নিয়ে ভাবছি, যাত্রাপথের প্রতিটি পদক্ষেপকে স্মরণ করছি,
        এবং আমাদের আগামীর দিশা সম্পর্কে আলোচনা করছি। আমাদের পথচলা ছিল
        অধ্যবসায়, উদ্ভাবন এবং উৎকর্ষের এক নিরন্তর চর্চা।"
      </p>
      <p>
        "প্রতিষ্ঠানের প্রথম দিন থেকেই আমাদের লক্ষ্য ছিল পরিষ্কার: আমাদের
        ছাত্র-ছাত্রী, শিক্ষক, কর্মচারী এবং অভিভাবকদের জন্য সত্যিকার মূল্য
        তৈরি করা। তবে তার বাইরেও, আমরা আরও বড় কিছু করতে চেয়েছি, যা কেবল
        আজকের দিনের চাহিদা পূরণ করবে না, বরং আগামী দিনের চ্যালেঞ্জগুলোকেও
        মাথায় রেখে সঠিক সমাধান তৈরির দিকে লক্ষ্য রাখবে।"
      </p>
      <p>
        "আমরা এমন এক সময়ে বসবাস করছি যেখানে প্রযুক্তিগত অগ্রগতি, শিল্প,
        অর্থনীতি এবং সমাজে অবিশ্বাস্য গতিতে পরিবর্তন আনছে। এটি এমন একটি সময়
        যখন অনেকেরই overwhelmed হওয়ার প্রবণতা থাকে। তবে আমি এটিকে একটি
        সুযোগ হিসেবে দেখি। প্রযুক্তির দ্রুত বিকাশ আমাদের জন্য অসীম সম্ভাবনা
        উন্মোচিত করছে, যা আমাদের সঠিকভাবে পরিবর্তিত হতে এবং সমৃদ্ধ হতে
        সাহায্য করবে।"
      </p>
      {/* Additional paragraphs can be added similarly */}
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
          content: '';
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
          content: '';
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

        .chairman-image {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }

        .chairman-image:hover {
          transform: scale(1.05);
        }

        .chairman-name {
          font-size: 1.5rem;
          color: #1e3a8a;
          margin: 1rem 0 0.5rem;
          font-weight: 700;
        }

        .chairman-position {
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
          content: '';
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

          .chairman-image {
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

          .chairman-image {
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

export default ChairmanMessage;
