import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import BASE_URL from "@/components/config/apiConfig";
import {
  FaSearch,
  FaUniversity,
  FaPrint,
  FaDownload,
  FaCalendarAlt,
  FaUser,
  FaIdCard,
} from "react-icons/fa";
import Link from "next/link";

export default function StudentResultPage() {
  const [form, setForm] = useState({
    student_name: "",
    roll: "",
    year: "",
    captcha: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [captchaText, setCaptchaText] = useState("");
  const [captchaValid, setCaptchaValid] = useState(true);
  const canvasRef = useRef(null);
  const resultRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateCaptcha = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate random captcha text (5 characters)
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCaptchaText(captcha);

    // Draw the text
    ctx.font = "bold 24px serif";
    ctx.strokeStyle = "#00663e";
    ctx.fillStyle = "#00663e";

    // Draw each character with slight rotation for security
    for (let i = 0; i < captcha.length; i++) {
      const rotation = Math.random() * 0.4 - 0.2; // Random rotation between -0.2 and 0.2 radians
      ctx.save();
      ctx.translate(15 + i * 24, 30);
      ctx.rotate(rotation);
      ctx.fillText(captcha[i], 0, 0);
      ctx.restore();
    }

    // Add noise (lines)
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(0, 102, 62, 0.2)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Add noise (dots)
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(0, 102, 62, 0.2)`;
      ctx.fill();
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      generateCaptcha();
    }
  }, []);

  const fetchResults = async (e) => {
    if (e) e.preventDefault();

    // Validate captcha
    if (form.captcha.toLowerCase() !== captchaText.toLowerCase()) {
      setCaptchaValid(false);
      generateCaptcha(); // Generate new captcha after failed attempt
      return;
    }
    setCaptchaValid(true);

    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({
        student_name: form.student_name,
        roll: form.roll,
        year: form.year,
        page,
      }).toString();
      const res = await fetch(
        `${BASE_URL}/api/student-results/search?${query}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "ফলাফল খুঁজে পাওয়া যায়নি");

      // Check if data is an array or a single object
      if (Array.isArray(data)) {
        setResults(data);
      } else if (data && typeof data === "object") {
        // If it's a single object with results property
        if (data.results) {
          setResults(data.results);
          setTotalPages(data.totalPages || 1);
        }
        // If it's just a single result object (as in your API response)
        else if (data.student_name) {
          setResults([data]);
          setTotalPages(1);
        } else {
          throw new Error("কোন ফলাফল পাওয়া যায়নি");
        }
      } else {
        throw new Error("অবৈধ রেসপন্স ফরম্যাট");
      }

      // Scroll to results after loading
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((form.roll || form.student_name || form.year) && page > 0) {
      fetchResults();
    }
  }, [page]);

  const excludedFields = [
    "id",
    "student_name",
    "roll",
    "class",
    "section",
    "year",
    "publish_date",
    "total_marks",
    "merit_position",
    "failed_subjects",
  ];

  const refreshCaptcha = () => {
    generateCaptcha();
    setForm({ ...form, captcha: "" });
  };

  const printResult = () => {
    window.print();
  };

  // Function to convert Bengali/English numerals
  const convertToBengaliNumeral = (num) => {
    const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) =>
        isNaN(parseInt(digit)) ? digit : bengaliNumerals[parseInt(digit)]
      )
      .join("");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Search Form */}
          <div className="bg-white shadow-md border-t-4 border-green-700 rounded-md overflow-hidden mb-8">
            <div className="bg-green-50 border-b border-green-100 px-6 py-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white mr-4">
                <FaSearch size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-800">
                  শিক্ষার্থী ফলাফল অনুসন্ধান
                </h2>
                <p className="text-sm text-green-800">আপনার তথ্য প্রদান করুন</p>
              </div>
            </div>

            <form onSubmit={fetchResults} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    name="student_name"
                    value={form.student_name}
                    onChange={handleChange}
                    placeholder="শিক্ষার্থীর নাম"
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaIdCard className="text-gray-400" />
                  </div>
                  <input
                    name="roll"
                    value={form.roll}
                    onChange={handleChange}
                    placeholder="রোল নম্বর"
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    name="year"
                    type="number"
                    value={form.year}
                    onChange={handleChange}
                    placeholder="শিক্ষাবর্ষ (উদাহরণ: ২০২৫)"
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    নিরাপত্তা যাচাইকরণ
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <canvas
                        ref={canvasRef}
                        width="150"
                        height="40"
                        className="border border-gray-300 rounded-md bg-white"
                      ></canvas>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="absolute top-0 right-0 p-1 bg-gray-100 hover:bg-gray-200 rounded-bl text-xs"
                        title="ক্যাপচা রিফ্রেশ করুন"
                      >
                        ↻
                      </button>
                    </div>
                    <div className="flex-grow">
                      <input
                        name="captcha"
                        value={form.captcha}
                        onChange={handleChange}
                        placeholder="প্রদর্শিত টেক্সট লিখুন"
                        className={`w-full border rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 ${
                          !captchaValid ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {!captchaValid && (
                        <p className="text-red-500 text-xs mt-1">
                          ক্যাপচা সঠিক নয়। আবার চেষ্টা করুন।
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-700 to-green-800 text-white font-bold py-2 px-8 rounded-md hover:from-green-800 hover:to-green-900 transition shadow-md flex items-center justify-center mx-auto gap-2"
                  disabled={loading}
                >
                  <FaSearch size={16} />
                  {loading ? "অনুসন্ধান করা হচ্ছে..." : "ফলাফল অনুসন্ধান করুন"}
                </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {results.length > 0 && (
            <div className="space-y-8" ref={resultRef}>
              {results.map((result, index) => {
                const subjectMarks = Object.entries(result).filter(
                  ([key]) =>
                    !excludedFields.includes(key) && result[key] !== null
                );

                // Calculate result statistics
                const totalSubjects = subjectMarks.length;
                const passingSubjects = subjectMarks.filter(
                  ([_, mark]) => Number(mark) >= 33
                ).length;

                return (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-md overflow-hidden shadow-lg bg-white print:shadow-none"
                  >
                    {/* Result header with BD govt style */}
                    <div className="print:hidden bg-gradient-to-r from-green-700 to-green-800 text-white p-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold">
                          {result.student_name}
                        </h3>
                        <p className="text-sm">
                          রোল: {convertToBengaliNumeral(result.roll)} | শ্রেণি:{" "}
                          {result.class} | শাখা: {result.section}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <button
                          onClick={printResult}
                          className="bg-white text-green-800 px-3 py-1 rounded-md flex items-center gap-1 text-sm shadow-sm hover:bg-green-50"
                        >
                          <FaPrint size={14} />
                          <span>প্রিন্ট</span>
                        </button>
                        <button className="bg-white text-green-800 px-3 py-1 rounded-md flex items-center gap-1 text-sm shadow-sm hover:bg-green-50">
                          <FaDownload size={14} />
                          <span>ডাউনলোড</span>
                        </button>
                      </div>
                    </div>

                    {/* Print header with Bangladesh govt style */}
                    <div className="hidden print:flex print:flex-col print:items-center print:border-b-2 print:border-gray-300 print:pb-4 print:mb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src="/bd-govt-logo.png"
                          alt="Bangladesh Govt Logo"
                          className="w-16 h-16 object-contain"
                        />
                        <img
                          src="/bhs-logo.png"
                          alt="School Logo"
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                    </div>

                    {/* Student Information */}
                    <div className="print:mt-4 p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex">
                          <span className="font-medium w-32">
                            শিক্ষার্থীর নাম:
                          </span>
                          <span>{result.student_name}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-32">রোল নম্বর:</span>
                          <span>{convertToBengaliNumeral(result.roll)}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-32">শ্রেণি:</span>
                          <span>{result.class}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex">
                          <span className="font-medium w-32">শাখা:</span>
                          <span>{result.section}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-32">শিক্ষাবর্ষ:</span>
                          <span>{convertToBengaliNumeral(result.year)}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-32">
                            প্রকাশের তারিখ:
                          </span>
                          <span>
                            {result.publish_date
                              ? new Date(
                                  result.publish_date
                                ).toLocaleDateString("bn-BD")
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Student stats */}
                    <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="bg-green-50 p-3 rounded shadow-sm border border-green-100">
                        <p className="text-sm text-gray-600">মোট নম্বর</p>
                        <p className="text-xl font-bold text-green-800">
                          {convertToBengaliNumeral(result.total_marks)}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded shadow-sm border border-green-100">
                        <p className="text-sm text-gray-600">মেধা স্থান</p>
                        <p className="text-xl font-bold text-green-800">
                          {result.merit_position
                            ? convertToBengaliNumeral(result.merit_position)
                            : "N/A"}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded shadow-sm border border-green-100">
                        <p className="text-sm text-gray-600">অকৃতকার্য বিষয়</p>
                        <p className="text-xl font-bold text-green-800">
                          {result.failed_subjects
                            ? convertToBengaliNumeral(result.failed_subjects)
                            : "০"}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded shadow-sm border border-green-100">
                        <p className="text-sm text-gray-600">ফলাফল</p>
                        <p
                          className={`text-xl font-bold ${
                            Number(result.failed_subjects || 0) > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {Number(result.failed_subjects || 0) > 0
                            ? "অকৃতকার্য"
                            : "কৃতকার্য"}
                        </p>
                      </div>
                    </div>

                    {/* Subject marks table */}
                    <div className="p-4">
                      <table className="min-w-full border border-gray-300">
                        <thead>
                          <tr className="bg-gradient-to-r from-green-700 to-green-800 text-white">
                            <th className="py-2 px-4 border-b border-r text-left">
                              বিষয়
                            </th>
                            <th className="py-2 px-4 border-b border-r text-center w-24">
                              প্রাপ্ত নম্বর
                            </th>
                            <th className="py-2 px-4 border-b text-center w-24">
                              ফলাফল
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjectMarks.map(([subject, mark], idx) => {
                            const formattedSubject = subject
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase());

                            // Map English subject names to Bengali
                            const subjectNameMap = {
                              Bangla: "বাংলা",
                              English: "ইংরেজী",
                              Mathematics: "গণিত",
                              Science: "বিজ্ঞান",
                              "Social Science": "সমাজ বিজ্ঞান",
                              Religion: "ধর্ম",
                              "Physical Education": "শারীরিক শিক্ষা",
                              Arts: "চারু ও কারুকলা",
                              Agriculture: "কৃষি শিক্ষা",
                              Ict: "তথ্য ও যোগাযোগ প্রযুক্তি",
                              Physics: "পদার্থ বিজ্ঞান",
                              Chemistry: "রসায়ন",
                              Biology: "জীববিজ্ঞান",
                              "Higher Math": "উচ্চতর গণিত",
                              Geography: "ভূগোল",
                              Economics: "অর্থনীতি",
                              History: "ইতিহাস",
                              Civics: "পৌরনীতি",
                            };

                            const displayName =
                              subjectNameMap[formattedSubject] ||
                              formattedSubject;
                            const isPass = Number(mark) >= 33;

                            return (
                              <tr
                                key={subject}
                                className={
                                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
                              >
                                <td className="py-2 px-4 border-b border-r">
                                  {displayName}
                                </td>
                                <td className="py-2 px-4 border-b border-r text-center font-medium">
                                  {convertToBengaliNumeral(mark)}
                                </td>
                                <td
                                  className={`py-2 px-4 border-b text-center font-medium ${
                                    isPass ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {isPass ? "কৃতকার্য" : "অকৃতকার্য"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-green-50 font-bold">
                            <td className="py-2 px-4 border-t border-r">মোট</td>
                            <td className="py-2 px-4 border-t border-r text-center">
                              {convertToBengaliNumeral(result.total_marks)}
                            </td>
                            <td className="py-2 px-4 border-t text-center">
                              {convertToBengaliNumeral(passingSubjects)}/
                              {convertToBengaliNumeral(totalSubjects)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Official mark */}
                    <div className="p-4 border-t border-gray-300 bg-gray-50">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center">
                          <div className="mb-12 print:block hidden">
                            <div className="h-px bg-gray-300 w-32 mt-16 mx-auto"></div>
                            <p className="text-sm">শিক্ষার্থীর স্বাক্ষর</p>
                          </div>
                          <p className="text-sm text-gray-700">
                            এটি একটি কম্পিউটার জেনারেটেড ফলাফল।
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="mb-12 print:block hidden">
                            <img
                              src="/signature.png"
                              alt="Principal Signature"
                              className="h-12 mx-auto"
                            />
                            <div className="h-px bg-gray-300 w-32 mx-auto"></div>
                            <p className="text-sm">অধ্যক্ষের স্বাক্ষর ও সীল</p>
                          </div>
                          <p className="text-sm text-gray-700">
                            যাচাইকৃত: অধ্যক্ষ, ভরাসার বহুমুখী উচ্চ বিদ্যালয়
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6 print:hidden">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 bg-green-700 text-white rounded-md disabled:opacity-50 disabled:bg-gray-400 shadow-md"
                  >
                    « পূর্ববর্তী
                  </button>
                  <span className="font-medium">
                    পৃষ্ঠা {convertToBengaliNumeral(page)} /{" "}
                    {convertToBengaliNumeral(totalPages)}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-green-700 text-white rounded-md disabled:opacity-50 disabled:bg-gray-400 shadow-md"
                  >
                    পরবর্তী »
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      <style jsx>{`
        @media print {
          body {
            font-family: "Hind Siliguri", sans-serif;
            background: white;
          }

          @page {
            size: A4;
            margin: 1.5cm;
          }

          button {
            display: none;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:block {
            display: block !important;
          }

          .print\\:flex {
            display: flex !important;
          }

          .print\\:flex-col {
            flex-direction: column !important;
          }

          .print\\:items-center {
            align-items: center !important;
          }

          .print\\:border-b-2 {
            border-bottom-width: 2px !important;
          }

          .print\\:border-gray-300 {
            border-color: rgb(209, 213, 219) !important;
          }

          .print\\:pb-4 {
            padding-bottom: 1rem !important;
          }

          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }

          .print\\:mt-4 {
            margin-top: 1rem !important;
          }

          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }

        /* Arabic digits to Bengali digits conversion */
        .bn-number {
          font-feature-settings: "tnum";
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #007040;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #005030;
        }

        /* Animation for loading state */
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Custom focus styles for better accessibility */
        input:focus,
        button:focus {
          outline: 2px solid rgba(0, 102, 62, 0.5);
          outline-offset: 2px;
        }

        /* Improve mobile experience */
        @media (max-width: 640px) {
          table {
            font-size: 0.85rem;
          }

          .responsive-cell {
            word-break: break-word;
          }
        }

        /* Bangla font improvements */
        body {
          font-family: "Hind Siliguri", "SolaimanLipi", Arial, sans-serif;
        }

        /* Certificate border for print */
        @media print {
          .certificate-border {
            border: 10px double #00663e;
            padding: 20px;
            margin: 20px;
            position: relative;
          }

          .certificate-border::before {
            content: "";
            position: absolute;
            top: 5px;
            left: 5px;
            right: 5px;
            bottom: 5px;
            border: 1px solid #00663e;
          }
        }
      `}</style>
    </>
  );
}
