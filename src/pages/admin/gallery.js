import { useState, useEffect, useContext } from 'react';
import BASE_URL from '@/components/config/apiConfig';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import ReactPaginate from 'react-paginate';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Gallery = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const itemsPerPage = 5;

  const [state, setState] = useState({
    galleryItems: [],
    filteredItems: [],
    searchTerm: '',
    currentPage: 0,
    isLoading: false,
  });

  const [formData, setFormData] = useState({
    id: null,
    image: null,
    title: '',
    description: '',
    category: '',
  });

  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'headmaster') {
      router.push('/unauthorized');
    } else {
      fetchGalleryItems();
    }
  }, [user]);

  const fetchGalleryItems = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`${BASE_URL}/api/gallery`);
      if (!response.ok) throw new Error('Failed to fetch gallery items');
      const data = await response.json();
      setState((prev) => ({
        ...prev,
        galleryItems: data,
        filteredItems: data,
        isLoading: false,
      }));
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = state.galleryItems.filter((item) => {
      const title = item.title ? item.title.toLowerCase() : '';
      const category = item.category ? item.category.toLowerCase() : '';
      return title.includes(value) || category.includes(value);
    });
    setState((prev) => ({
      ...prev,
      searchTerm: value,
      filteredItems: filtered,
      currentPage: 0,
    }));
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        Swal.fire('Error', 'File size should not exceed 5MB', 'error');
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || (!formData.image && !isEdit)) {
      Swal.fire('Error', 'Please fill out all required fields', 'error');
      return;
    }

    const formDataToSend = new FormData();
    if (formData.image) formDataToSend.append('image', formData.image);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('category', formData.category);

    try {
      const response = await fetch(
        `${BASE_URL}/api/gallery${isEdit ? `/${formData.id}` : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error('Operation failed');

      Swal.fire('Success', `Gallery item ${isEdit ? 'updated' : 'added'} successfully`, 'success');
      resetForm();
      fetchGalleryItems();
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      image: null,
      title: '',
      description: '',
      category: '',
    });
    setIsEdit(false);
    setImagePreview(null);
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      image: null,
      title: item.title,
      description: item.description,
      category: item.category,
    });
    setImagePreview(`${BASE_URL}/${item.image}`);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        const response = await fetch(`${BASE_URL}/api/gallery/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete gallery item');
        }

        Swal.fire('Deleted!', 'Gallery item has been deleted.', 'success');
        fetchGalleryItems();
      }
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const displayedItems = state.filteredItems.slice(
    state.currentPage * itemsPerPage,
    (state.currentPage + 1) * itemsPerPage
  );

  return (
    user?.role === 'headmaster' && (
      <div className="container mx-auto my-6 p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-3xl font-semibold text-slate-800 mb-6 text-center">Add / Edit Gallery</h3>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="text-lg font-medium text-slate-700 mb-2">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control w-full p-3 border rounded-lg"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-lg font-medium text-slate-700 mb-2">Category *</label>
              <input
                type="text"
                id="category"
                name="category"
                className="form-control w-full p-3 border rounded-lg"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group mb-6">
            <label htmlFor="description" className="text-lg font-medium text-slate-700 mb-2">Description</label>
            <ReactQuill
              value={formData.description}
              onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              className="w-full border rounded-lg"
            />
          </div>

          <div className="form-group mb-6">
            <label htmlFor="image" className="text-lg font-medium text-slate-700 mb-2">Image {!isEdit && '*'}</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="form-control w-full p-3 border rounded-lg"
              onChange={handleFileChange}
              required={!isEdit}
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-[200px] max-h-[200px] object-cover border rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button type="submit" className="btn btn-primary px-6 py-2 text-white bg-blue-600 rounded-lg">
              {isEdit ? 'Update' : 'Add'} Gallery Item
            </button>
            {isEdit && (
              <button
                type="button"
                className="btn btn-secondary px-6 py-2 text-white bg-gray-600 rounded-lg"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* Gallery Items Table */}
        {state.isLoading ? (
          <div className="text-center text-lg font-semibold text-gray-500">Loading...</div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <div className="mb-4">
              <input
                type="text"
                className="form-control w-full p-3 border rounded-lg shadow-md"
                placeholder="Search by title or category"
                value={state.searchTerm}
                onChange={handleSearch}
              />
            </div>

            <table className="table-auto w-full border-collapse text-left">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2 text-sm">{index + 1 + state.currentPage * itemsPerPage}</td>
                    <td className="px-4 py-2">
                      <img
                        src={`${BASE_URL}/${item.image}`}
                        alt={item.title}
                        className="max-w-[100px] max-h-[100px] object-cover"
                      />
                    </td>
                    <td className="px-4 py-2 text-sm">{item.title}</td>
                    <td className="px-4 py-2 text-sm">{item.category}</td>
                    <td className="px-4 py-2 text-sm">
                      <div dangerouslySetInnerHTML={{ __html: item.description }} />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="btn btn-warning btn-sm px-4 py-2 text-white bg-yellow-600 rounded-lg"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm px-4 py-2 text-white bg-red-600 rounded-lg"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              breakLabel="..."
              pageCount={Math.ceil(state.filteredItems.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={({ selected }) => setState((prev) => ({ ...prev, currentPage: selected }))}
              containerClassName="pagination justify-center mt-6"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              activeClassName="active"
            />
          </div>
        )}
      </div>
    )
  );
};

export default Gallery;
