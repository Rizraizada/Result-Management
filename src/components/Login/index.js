import { useState, useContext } from "react";
import { useRouter } from "next/router";
import BASE_URL from "@/components/config/apiConfig";
import { UserContext } from "@/context/UserContext";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      if (data.user?.role === "headmaster") {
        router.push("/admin/headmaster");
      } else if (data.user?.role === "teacher") {
        router.push("/admin/teacher-dashboard");
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gray-100 flex items-center justify-center py-12 px-6 sm:px-8 lg:px-16">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
          Log In
        </h2>
        {error && (
          <div
            className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-indigo-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember Me
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
