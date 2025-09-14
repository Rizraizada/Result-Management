import React, { useState, useEffect } from "react";
import BASE_URL from "@/components/config/apiConfig";
import Image from "next/image";
import Swal from "sweetalert2";

const CommitteeList = () => {
  const [directors, setDirectors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCommittee, setFilterCommittee] = useState("");
  const [formKey, setFormKey] = useState(Date.now());

  // REMOVED: The 'committees' array is no longer needed.

  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/api/director`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch committee members.');
      const data = await response.json();
      setDirectors(data.data || []);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const openAddForm = () => {
    setEditingId(null);
    setFormKey(Date.now());
    setShowAddForm(true);
  };

  const startEdit = (director) => {
    setEditingId(director.id);
    setFormKey(Date.now());
    setShowAddForm(true);
  };
  
  const closeForm = () => {
      setShowAddForm(false);
      setEditingId(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = formData.get('image');
    
    // Client-side file validation
    if (imageFile && imageFile.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(imageFile.type)) {
        Swal.fire("Invalid File Type", "Please upload only JPG, JPEG, or PNG images.", "error");
        return;
      }
      if (imageFile.size > 5 * 1024 * 1024) { // 5MB Limit
        Swal.fire("File Too Large", "Please upload an image smaller than 5MB.", "error");
        return;
      }
    }

    const token = localStorage.getItem("authToken");
    
    try {
      Swal.fire({
        title: editingId ? 'Updating...' : 'Adding...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const url = editingId ? `${BASE_URL}/api/director/${editingId}` : `${BASE_URL}/api/director`;
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Operation failed');
      }
      
      Swal.fire({
        title: "Success!",
        text: `Member ${editingId ? 'updated' : 'added'} successfully.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      
      closeForm();
      fetchDirectors();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const deleteDirector = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${name}. This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Deleting...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        const token = localStorage.getItem("authToken");
        await fetch(`${BASE_URL}/api/director/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire("Deleted!", "The member has been deleted.", "success");
        fetchDirectors();
      } catch (error) {
        Swal.fire("Error", "Failed to delete member.", "error");
      }
    }
  };

  const filteredDirectors = directors.filter(d => 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCommitteeName = (committee) => {
    return committee?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Board of Directors</h1>
              <p className="text-gray-600 mt-1">Manage all board members in one place.</p>
            </div>
            <button
              onClick={openAddForm}
              className="mt-4 sm:mt-0 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto font-semibold"
            >
              + Add Member
            </button>
          </div>
        </div>

        {(showAddForm || editingId) && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              <h2 className="text-xl font-bold p-6 bg-gray-50 border-b">{editingId ? 'Edit Member' : 'Add New Member'}</h2>
              <div className="overflow-y-auto">
                <form key={formKey} onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input name="name" placeholder="Enter full name" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" defaultValue={editingId ? directors.find(d => d.id === editingId)?.name : ''} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input name="position" placeholder="Enter position" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" defaultValue={editingId ? directors.find(d => d.id === editingId)?.position : ''} />
                  </div>
                  
                  {/* FIXED: Committee value is now hardcoded and hidden */}
                  <input type="hidden" name="committee" value="board_of_directors" />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                    <textarea name="details" placeholder="Enter member details" rows="3" className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingId ? directors.find(d => d.id === editingId)?.details : ''} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea name="description" placeholder="Additional description" rows="2" className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingId ? directors.find(d => d.id === editingId)?.description : ''} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo {editingId && <span className="text-xs font-normal text-gray-500">(Leave empty to keep existing photo)</span>}</label>
                    <input name="image" type="file" accept=".jpg,.jpeg,.png" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                  <div className="flex gap-3 pt-4 border-t">
                    <button type="submit" className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"> {editingId ? 'Update Member' : 'Add Member'} </button>
                    <button type="button" onClick={closeForm} className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"> Cancel </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <input 
            placeholder="Search by name or position..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">Photo</th>
                <th className="p-4 text-left font-semibold text-gray-600">Name</th>
                <th className="p-4 text-left font-semibold text-gray-600">Position</th>
                <th className="p-4 text-left font-semibold text-gray-600">Committee</th>
                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDirectors.map(director => (
                <tr key={director.id} className="hover:bg-gray-50">
                  <td className="p-4"><div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-200 shadow-sm">{director.image_url ? <Image src={`${BASE_URL}${director.image_url}`} alt={director.name} layout="fill" className="object-cover" unoptimized /> : <span className="text-xs text-gray-400 flex items-center justify-center h-full">No Pic</span>}</div></td>
                  <td className="p-4 font-medium text-gray-900">{director.name}</td>
                  <td className="p-4 text-gray-700">{director.position}</td>
                  <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">{formatCommitteeName(director.committee)}</span></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(director)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm font-semibold">Edit</button>
                      <button onClick={() => deleteDirector(director.id, director.name)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
          {filteredDirectors.map(director => (
            <div key={director.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex items-center p-4">
                <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-200 shadow-sm flex-shrink-0 mr-4">{director.image_url ? <Image src={`${BASE_URL}${director.image_url}`} alt={director.name} layout="fill" className="object-cover" unoptimized /> : <span className="text-xs text-gray-400 flex items-center justify-center h-full">No Pic</span>}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{director.name}</h3>
                  <p className="text-gray-600 font-medium">{director.position}</p>
                  <span className="inline-block mt-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">{formatCommitteeName(director.committee)}</span>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-gray-50 border-t">
                <button onClick={() => startEdit(director)} className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold transition-colors">Edit</button>
                <button onClick={() => deleteDirector(director.id, director.name)} className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredDirectors.length === 0 && !loading && (
            <div className="text-center bg-white rounded-lg shadow-md p-12 mt-6">
                <h3 className="text-xl font-semibold text-gray-700">No Members Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search to find what you're looking for.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default CommitteeList;