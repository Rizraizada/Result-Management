import { useState, useEffect } from "react";
import BASE_URL from "@/components/config/apiConfig";
import Swal from "sweetalert2";

export default function SubjectConfigList() {
  const [configs, setConfigs] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [activeGroup, setActiveGroup] = useState("");
  const [formData, setFormData] = useState({
    class_level: "",
    group_name: "",
    subject_key: "",
    subject_name: "",
    compulsory: 1,
    total_marks: "",
    pass_mark: "",
    is_optional: 0,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchConfigs = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/subject-config`);
      const data = await res.json();
      setConfigs(data);
    } catch (error) {
      console.error("Error fetching configs:", error);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value 
    });
  };

  const handleEdit = (config) => {
    setFormData(config);
    setEditingId(config.id);
    setActiveClass(config.class_level);
    setActiveGroup(config.group_name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = `${BASE_URL}/api/subject-config`;
      let method = "POST";
      if (editingId) {
        url += `/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save config");

      Swal.fire("Success", "Configuration saved successfully!", "success");
      setFormData({
        class_level: "",
        group_name: "",
        subject_key: "",
        subject_name: "",
        compulsory: 1,
        total_marks: "",
        pass_mark: "",
        is_optional: 0,
      });
      setEditingId(null);
      fetchConfigs();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "This will delete the config permanently!",
        icon: "warning",
        showCancelButton: true,
      });

      if (!confirm.isConfirmed) return;

      const res = await fetch(`${BASE_URL}/api/subject-config/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete config");

      Swal.fire("Deleted!", "Config deleted successfully", "success");
      fetchConfigs();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const uniqueClasses = [...new Set(configs.map(c => c.class_level))].sort((a, b) => a - b);
  const filteredConfigsByClass = activeClass
    ? configs.filter(cfg => cfg.class_level === activeClass)
    : [];

  const groupedConfigs = filteredConfigsByClass.reduce((acc, config) => {
    const group = config.group_name || "Common";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(config);
    return acc;
  }, {});

  const classGroups = activeClass
    ? [...new Set(filteredConfigsByClass.map((c) => c.group_name || "Common"))]
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Subject Configuration Management
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add / Edit Subject Config</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="number"
            name="class_level"
            value={formData.class_level}
            onChange={handleChange}
            placeholder="Class Level"
            className="border-gray-300 border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="text"
            name="group_name"
            value={formData.group_name}
            onChange={handleChange}
            placeholder="Group (e.g., Science)"
            className="border-gray-300 border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            name="subject_name"
            value={formData.subject_name}
            onChange={handleChange}
            placeholder="Subject Name"
            className="border-gray-300 border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="text"
            name="subject_key"
            value={formData.subject_key}
            onChange={handleChange}
            placeholder="Subject Key (e.g., Bangla_1st_CQ)"
            className="border-gray-300 border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="number"
            name="pass_mark"
            value={formData.pass_mark}
            onChange={handleChange}
            placeholder="Pass Mark"
            className="border-gray-300 border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="number"
            name="total_marks"
            value={formData.total_marks}
            onChange={handleChange}
            placeholder="Total Marks"
            className="border-gray-300 border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <div className="flex items-center gap-4 col-span-full justify-center">
            <label className="text-gray-700 flex items-center gap-1">
              <input
                type="checkbox"
                name="compulsory"
                checked={formData.compulsory === 1}
                onChange={handleChange}
                className="rounded text-blue-600"
              />
              Compulsory
            </label>
            <label className="text-gray-700 flex items-center gap-1">
              <input
                type="checkbox"
                name="is_optional"
                checked={formData.is_optional === 1}
                onChange={handleChange}
                className="rounded text-blue-600"
              />
              Optional
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition duration-300 col-span-full"
          >
            {editingId ? "Update Config" : "Add New Config"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          View & Edit Configurations
        </h2>
        
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
          {uniqueClasses.map(cls => (
            <button
              key={cls}
              className={`px-4 py-2 rounded-full font-semibold transition duration-300 ${
                activeClass === cls ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => {
                setActiveClass(cls);
                setActiveGroup("");
              }}
            >
              Class {cls}
            </button>
          ))}
        </div>
        
        {activeClass && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-full text-sm transition duration-300 ${
                  activeGroup === "" ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveGroup("")}
              >
                All
              </button>
              {classGroups.map(gr => (
                <button
                  key={gr}
                  className={`px-3 py-1 rounded-full text-sm transition duration-300 ${
                    activeGroup === gr ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveGroup(gr)}
                >
                  {gr}
                </button>
              ))}
            </div>

            {Object.keys(groupedConfigs).filter(group => activeGroup === "" || group === activeGroup).map(groupName => (
                <div key={groupName} className="mb-6">
                  <h3 className="text-lg font-bold mb-3 p-2 bg-gray-100 rounded-lg text-gray-800">{groupName} Group Subjects</h3>
                  <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Key</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compulsory</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optional</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Mark</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {groupedConfigs[groupName].map(cfg => (
                          <tr key={cfg.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cfg.subject_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cfg.subject_key}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cfg.compulsory === 1 ? 'Yes' : 'No'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cfg.is_optional === 1 ? 'Yes' : 'No'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cfg.pass_mark}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cfg.total_marks}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEdit(cfg)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(cfg.id)}
                                className="ml-4 text-red-600 hover:text-red-900 transition-colors duration-200"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}