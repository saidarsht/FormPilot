import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;
console.log("Login Page API URL:", API_BASE);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    console.log("Login button clicked, attempting login...");

    try {
      console.log("Sending request to:", `${API_BASE}/auth/login`);
      console.log("Payload:", { email, password });
      const res = await api.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      if (res.data.token) {
        console.log("Login successful, token stored:", res.data.token);
        localStorage.setItem("token", res.data.token);
        navigate("/forms");
      } else {
        setError("Invalid Credentials. No Token Received.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Invalid Email or Password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
