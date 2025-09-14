import React, { useState, useEffect } from 'react';
import { Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import BASE_URL from '@/components/config/apiConfig';
import NoticePDFViewer from '/utility/padDesign';

const SearchInput = ({ searchTerm, onSearchChange }) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search notices..."
      value={searchTerm}
      onChange={onSearchChange}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
    />
    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
  </div>
);

const PaginationControls = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onPageChange,
}) => (
  <div className="flex justify-center space-x-2 p-4">
    <button
      onClick={onPrevPage}
      disabled={currentPage === 1}
      className="p-2 rounded-full bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors"
    >
      <ChevronLeft size={20} />
    </button>

    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => onPageChange(index + 1)}
        className={`w-10 h-10 rounded-full ${
          currentPage === index + 1
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } transition-colors`}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={onNextPage}
      disabled={currentPage === totalPages}
      className="p-2 rounded-full bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors"
    >
      <ChevronRight size={20} />
    </button>
  </div>
);

const NoticeTable = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/notices`);
        const data = await res.json();
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotices(sortedData);
        setFilteredNotices(sortedData);
      } catch (err) {
        console.error('Error fetching notices:', err);
      }
    };
    fetchNotices();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = notices.filter(
      (notice) =>
        notice.title.toLowerCase().includes(term) ||
        notice.content.toLowerCase().includes(term)
    );
    setFilteredNotices(filtered);
    setCurrentPage(1);
  };

  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex flex-wrap justify-between items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
          নোটিশ সমূহ
        </h1>
        <SearchInput searchTerm={searchTerm} onSearchChange={handleSearch} />
      </div>

      <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-wrap justify-between items-center p-4 bg-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600">
            Showing{' '}
            {Math.min(
              (currentPage - 1) * itemsPerPage + 1,
              filteredNotices.length
            )}
            –
            {Math.min(currentPage * itemsPerPage, filteredNotices.length)} of{' '}
            {filteredNotices.length}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ক্রমিক
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  শিরোনাম
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  প্রকাশের তারিখ
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ডাউনলোড
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedNotices.map((notice, index) => (
                <tr
                  key={notice.id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">
                      {notice.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500">
                    {new Date(notice.date).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <NoticePDFViewer fullNotice={notice} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={() => setCurrentPage(Math.max(1, currentPage - 1))}
          onNextPage={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default NoticeTable;
