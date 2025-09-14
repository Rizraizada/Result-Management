import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";

const TabContent = ({ children, isActive }) => (
  <AnimatePresence mode="wait">
    {isActive && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="contact-tab-content"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const Contact = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const tabs = [
    {
      id: "tab1",
      title: "Contact",
      icon: Mail,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <style>
        {`
          .contact-container {
            border-radius: 16px;
           }

          .contact-tab-nav {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
          }

          .contact-tab-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s;
            background: white;
            border: 2px solid #f3f4f6;
            color: black;
          }

          .contact-tab-button:hover {
            background: #f3f4f6;
          }

          .contact-tab-button.active {
            background: #1a365d;
            color: white;
            border-color: #1a365d;
          }

          .contact-content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
          }

          .contact-info-panel {
            background: #f8fafc;
            padding: 2rem;
            border-radius: 12px;
            color: black;
          }

          .contact-info-panel h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1a365d;
          }

          .contact-info-panel p {
            margin-bottom: 1rem;
            line-height: 1.6;
          }

          .contact-form-panel {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          }

          .contact-form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .contact-form-group {
            margin-bottom: 1.5rem;
          }

          .contact-form-group.full-width {
            grid-column: span 2;
          }

          .contact-form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: black;
          }

          .contact-form-group input,
          .contact-form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            transition: border-color 0.2s;
            color: black;
            background: white;
          }

          .contact-form-group input:focus,
          .contact-form-group textarea:focus {
            border-color: #1a365d;
            outline: none;
          }

          .contact-submit-button {
            width: 100%;
            padding: 0.75rem;
            background: #1a365d;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s;
            grid-column: span 2;
          }

          .contact-submit-button:hover {
            background: #2d4a7f;
            transform: translateY(-1px);
          }

          .contact-map {
            border-radius: 12px;
            overflow: hidden;
            height: 400px;
            border: 1px solid #e5e7eb;
          }

          .contact-map iframe {
            width: 100%;
            height: 100%;
            border: none;
          }

          @media (max-width: 768px) {
            .contact-content-grid {
              grid-template-columns: 1fr;
            }
            
            .contact-form-grid {
              grid-template-columns: 1fr;
            }
            
            .contact-form-group.full-width {
              grid-column: span 1;
            }
            
            .contact-submit-button {
              grid-column: span 1;
            }
          }
        `}
      </style>

      <div className="contact-container">
        <div className="contact-tab-nav">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`contact-tab-button ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>
        <div className="contact-content-grid">
          <div className="contact-info-panel">
            <h3>যোগাযোগ করুন</h3>
            <p>
              আমরা এখানে আছি আপনার যেকোনো প্রশ্নের উত্তর দিতে এবং আপনাকে সাহায্য
              করতে। আপনার বার্তা পাওয়ার জন্য আমরা অপেক্ষা করছি।
            </p>
            <p>
              আমাদের নিবেদিত দল দ্রুত উত্তর এবং চমৎকার সেবা নিশ্চিত করে। ফর্মের
              মাধ্যমে আমাদের সাথে যোগাযোগ করুন অথবা আমাদের অবস্থানে আসুন।
            </p>
          </div>

          <div className="contact-form-panel">
            <form onSubmit={handleSubmit} className="contact-form-grid">
              <div className="contact-form-group">
                <label htmlFor="firstName">প্রথম নাম *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form-group">
                <label htmlFor="lastName">শেষ নাম *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form-group">
                <label htmlFor="email">ইমেইল ঠিকানা *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form-group">
                <label htmlFor="phone">ফোন নম্বর *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form-group full-width">
                <label htmlFor="message">বার্তা</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              <button type="submit" className="contact-submit-button">
                বার্তা পাঠান
              </button>
            </form>
          </div>
        </div>

        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.7397793429054!2d91.14381617483846!3d23.50588059812062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3754796f0bf92ab1%3A0x81a7d7e966fab1ff!2sBharasar%20High%20School!5e0!3m2!1sen!2sbd!4v1734631401664!5m2!1sen!2sbd"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
