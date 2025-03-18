import { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const API_BASE = process.env.REACT_APP_API_URL;

interface FormType {
  id: number;
  form_name: string;
  created_at: string;
}

const FormList = () => {
  const [forms, setForms] = useState<FormType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get(`${API_BASE}/forms`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForms(response.data);
      } catch (error) {
        console.error("Error Fetching Forms:", error);
        setForms([]);
      }
    };

    fetchForms();
  }, [navigate]);

  const deleteForm = async (formId: number) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await api.delete(`${API_BASE}/forms/${formId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setForms(forms.filter((form) => form.id !== formId));
        alert("Form Deleted.");
      } catch (error) {
        alert("Error Deleting Form.");
      }
    }
  };

  const copyLink = (formId: number) => {
    navigator.clipboard.writeText(`${window.location.origin}/submit/${formId}`);
    alert(
      "Link Copied. Copy and Paste in Another Tab to View Submission Link."
    );
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 p-10 bg-gray-100 min-h-screen">
        <ul className="space-y-3 font-[Oxygen]">
          {forms.length > 0 ? (
            forms.map((form) => (
              <li
                key={form.id}
                className="bg-white p-8 shadow rounded flex items-center justify-between"
              >
                <div>
                  <span className="text-xl">{form.form_name}</span>
                  <p className="text-gray-500 text-sm">
                    Created on: {formatDate(form.created_at)}{" "}
                  </p>
                </div>
                <div className="text-lg">
                  <Link
                    to={`/responses/${form.id}`}
                    className="text-purple-500 mr-4"
                  >
                    Responses
                  </Link>
                  <Link
                    to={`/preview/${form.id}`}
                    className="text-blue-500 mr-4"
                  >
                    Preview
                  </Link>
                  <Link to={`/edit/${form.id}`} className="text-green-500 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteForm(form.id)}
                    className="text-red-500 mr-4"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => copyLink(form.id)}
                    className="text-blue-500"
                  >
                    Send
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No forms found</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default FormList;
