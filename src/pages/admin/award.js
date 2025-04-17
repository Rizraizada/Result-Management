import React, { useState, useEffect, useContext } from 'react';
import BASE_URL from '@/components/config/apiConfig';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';

const AwardPage = () => {
  const [awards, setAwards] = useState([]);
  const [message, setMessage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editAwardId, setEditAwardId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'headmaster') {
      router.push('/unauthorized');
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'headmaster') {
      fetchAwards();
    }
  }, [user]);

  const fetchAwards = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/award/awards`);
      const data = await response.json();
      setAwards(data);
    } catch (error) {
      console.error('Error fetching awards:', error);
      setMessage({ type: 'error', text: 'Failed to fetch awards' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newImage && !editMode) {
      setMessage({ type: 'error', text: 'Please select an image' });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subtitle', formData.subtitle);
    if (newImage) {
      formDataToSend.append('image', newImage);
    }

    if (editMode) {
      formDataToSend.append('id', editAwardId);
    }

    try {
      const response = await fetch(`${BASE_URL}/api/award/awards`, {
        method: editMode ? 'PUT' : 'POST',
        body: formDataToSend,
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchAwards();
        resetForm();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Error submitting award:', error);
      setMessage({ type: 'error', text: 'Failed to submit award' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/award/awards/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchAwards();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Error deleting award:', error);
      setMessage({ type: 'error', text: 'Failed to delete award' });
    }
  };

  const handleEdit = (award) => {
    setEditMode(true);
    setEditAwardId(award.id);
    setFormData({
      title: award.title,
      subtitle: award.subtitle,
    });
    setImagePreview(award.image);
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '' });
    setNewImage(null);
    setImagePreview(null);
    setEditMode(false);
    setEditAwardId(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAwards = awards.filter(
    (award) =>
      award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAwards = filteredAwards.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    user &&
    user.role === 'headmaster' && (
      <div className="max-w-[900px] mx-auto mt-8">
        {/* Form Section */}
        <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4 text-center">Add / Edit Award</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
              <input
                type="file"
                onChange={handleImagePreview}
                className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Image preview"
                    className="w-32 h-32 object-cover rounded-md mx-auto"
                  />
                </div>
              )}
            </div>

            {message && (
              <div
                className={`mb-4 p-2 text-sm text-white ${
                  message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition duration-300"
              >
                {editMode ? 'Update Award' : 'Add Award'}
              </button>
            </div>
          </form>
        </div>

        {/* Search Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Awards</h3>
              <p className="text-slate-500">Manage your award list.</p>
            </div>
            <div className="w-[200px]">
              <input
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Search awards..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {/* Awards Table Section */}
        <div className="overflow-x-auto bg-white p-6 shadow-lg rounded-lg">
          <table className="w-full text-left table-auto">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 border-b border-slate-200 text-sm font-medium text-slate-500">Title</th>
                <th className="p-4 border-b border-slate-200 text-sm font-medium text-slate-500">Subtitle</th>
                <th className="p-4 border-b border-slate-200 text-sm font-medium text-slate-500">Image</th>
                <th className="p-4 border-b border-slate-200 text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAwards.map((award) => (
                <tr key={award.id} className="hover:bg-slate-50 border-b border-slate-200">
                  <td className="p-4 py-5 text-sm text-slate-800 font-semibold">{award.title}</td>
                  <td className="p-4 py-5 text-sm text-slate-500">{award.subtitle}</td>
                  <td className="p-4 py-5">
                    <img src={award.image} alt="Award" className="w-16 h-16 object-cover rounded-md" />
                  </td>
                  <td className="p-4 py-5">
                    <button
                      onClick={() => handleEdit(award)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(award.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-3 mt-4">
            <div className="text-sm text-slate-500">
              Showing <b>{indexOfFirst + 1}-{Math.min(indexOfLast, filteredAwards.length)}</b> of{' '}
              {filteredAwards.length}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
              >
                Prev
              </button>
              {Array.from(
                { length: Math.ceil(filteredAwards.length / itemsPerPage) },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 min-w-9 min-h-9 text-sm font-normal ${
                      currentPage === index + 1
                        ? 'text-white bg-slate-800 border-slate-800 hover:bg-slate-600 hover:border-slate-600'
                        : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-400'
                    } rounded transition duration-200 ease`}
                  >
                    {index + 1}
                  </button>
                )
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage * itemsPerPage >= filteredAwards.length}
                className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AwardPage;
