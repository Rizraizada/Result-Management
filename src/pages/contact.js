import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Flag } from "lucide-react";

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
    subject: "",
    designation: "",
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
    // Here you would typically send the data to a server
    alert("আপনার বার্তা সফলভাবে পাঠানো হয়েছে।");
  };

  const tabs = [
    {
      id: "tab1",
      title: "যোগাযোগ করুন",
      icon: Mail,
    },
    {
      id: "tab2",
      title: "অবস্থান",
      icon: MapPin,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <style jsx global>{`
        .bd-govt-contact-container {
          border-radius: 8px;
          max-width: 1200px;
          margin: 0 auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          background-color: white;
          overflow: hidden;
        }

        .bd-header {
          background: linear-gradient(to right, #006a4e, #004d40);
          color: white;
          padding: 1.5rem;
          text-align: center;
          border-bottom: 4px solid #f42a41;
          position: relative;
        }

        .bd-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .bd-header p {
          font-size: 1rem;
          opacity: 0.9;
        }

        .bd-national-emblem {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          background-color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-tab-nav {
          display: flex;
          justify-content: center;
          margin: 1.5rem 0;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1rem;
        }

        .contact-tab-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-weight: 600;
          transition: all 0.2s;
          margin: 0 0.5rem;
          background: #f3f4f6;
          color: #333;
          border: none;
        }

        .contact-tab-button:hover {
          background: #e5e7eb;
        }

        .contact-tab-button.active {
          background: #006a4e;
          color: white;
        }

        .contact-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 0 1.5rem 1.5rem;
        }

        .contact-info-panel {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #006a4e;
        }

        .contact-info-panel h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #006a4e;
          border-bottom: 2px solid #f42a41;
          padding-bottom: 0.5rem;
          display: inline-block;
        }

        .contact-info-panel p {
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .contact-info-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px dashed #e5e7eb;
        }

        .contact-info-item:last-child {
          border-bottom: none;
        }

        .contact-info-icon {
          margin-right: 10px;
          background-color: rgba(0, 106, 78, 0.1);
          padding: 8px;
          border-radius: 50%;
          color: #006a4e;
        }

        .contact-info-text h4 {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .contact-form-panel {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .contact-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .contact-form-group {
          margin-bottom: 1rem;
        }

        .contact-form-group.full-width {
          grid-column: span 2;
        }

        .contact-form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .contact-form-group input,
        .contact-form-group textarea,
        .contact-form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          transition: border-color 0.2s;
          background-color: #f9f9f9;
        }

        .contact-form-group input:focus,
        .contact-form-group textarea:focus,
        .contact-form-group select:focus {
          border-color: #006a4e;
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 106, 78, 0.1);
        }

        .contact-submit-button {
          width: 100%;
          padding: 0.75rem;
          background: #006a4e;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          transition: all 0.2s;
          grid-column: span 2;
          cursor: pointer;
        }

        .contact-submit-button:hover {
          background: #00563e;
        }

        .contact-submit-button:active {
          transform: translateY(1px);
        }

        .contact-map {
          border-radius: 8px;
          overflow: hidden;
          height: 400px;
          border: 1px solid #e5e7eb;
          margin: 0 1.5rem 1.5rem;
        }

        .contact-map iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .bd-footer {
          background: linear-gradient(to right, #006a4e, #004d40);
          color: white;
          text-align: center;
          padding: 1rem;
          font-size: 0.9rem;
          border-top: 3px solid #f42a41;
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

          .bd-national-emblem {
            position: static;
            margin: 0 auto 1rem;
            transform: none;
          }

          .bd-header {
            padding-bottom: 1rem;
          }

          .contact-tab-nav {
            flex-direction: column;
            align-items: center;
          }

          .contact-tab-button {
            margin-bottom: 0.5rem;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="bd-govt-contact-container">
        {/* Tab Navigation */}
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
                <Icon size={18} />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Contact Information and Form */}
        <TabContent isActive={activeTab === "tab1"}>
          <div className="contact-content-grid">
            <div className="contact-info-panel">
              <h3>যোগাযোগ তথ্য</h3>
              
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <MapPin size={18} />
                </div>
                <div className="contact-info-text">
                  <h4>ঠিকানা</h4>
                  <p>ভরাসর হাই স্কুল, কুমিল্লা, বাংলাদেশ</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Phone size={18} />
                </div>
                <div className="contact-info-text">
                  <h4>ফোন</h4>
                  <p>+৮৮০১৭১২-৩৪৫৬৭৮</p>
                  <p>+৮৮০১৮১৩-৯৮৭৬৫৪</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Mail size={18} />
                </div>
                <div className="contact-info-text">
                  <h4>ইমেইল</h4>
                  <p>bharasar.school@gov.bd</p>
                  <p>principal.bharasar@gov.bd</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Clock size={18} />
                </div>
                <div className="contact-info-text">
                  <h4>অফিস সময়</h4>
                  <p>রবিবার - বৃহস্পতিবার: সকাল ৮টা - বিকাল ৪টা</p>
                  <p>শুক্রবার - শনিবার: বন্ধ</p>
                </div>
              </div>
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
                  <label htmlFor="designation">পদবি</label>
                  <select
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="student">শিক্ষার্থী</option>
                    <option value="guardian">অভিভাবক</option>
                    <option value="teacher">শিক্ষক</option>
                    <option value="official">সরকারি কর্মকর্তা</option>
                    <option value="other">অন্যান্য</option>
                  </select>
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
                  <label htmlFor="subject">বিষয় *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-form-group full-width">
                  <label htmlFor="message">বার্তা *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </div>
                <button type="submit" className="contact-submit-button">
                  বার্তা পাঠান
                </button>
              </form>
            </div>
          </div>
        </TabContent>

        {/* Map Tab */}
        <TabContent isActive={activeTab === "tab2"}>
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
        </TabContent>
      </div>
    </div>
  );
};

export default Contact;