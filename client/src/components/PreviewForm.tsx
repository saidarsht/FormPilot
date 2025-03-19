import { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

const API_BASE = process.env.REACT_APP_API_URL;

type FormField = {
  id: string;
  type: string;
  label: string;
  options?: string[];
  required?: boolean;
};

const PreviewForm = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formName, setFormName] = useState("");
  const { formId } = useParams<{ formId: string }>();

  useEffect(() => {
    api
      .get(`${API_BASE}/forms/secure/${formId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setFormName(res.data.form_name);
        setFields(res.data.fields);
      })
      .catch((err) => {
        console.error("Error Fetching Form:", err);
        alert("Failed To Load The Form.");
      });
  }, [formId]);

  return (
    <>
      <Navbar />
      <div className="pt-24 flex flex-col items-center min-h-screen bg-gray-100 p-6 font-[Oxygen]">
        <h1 className="text-3xl font-bold mb-4">Preview Form - {formName}</h1>
        {fields.map((field) => (
          <FieldViewer key={field.id} field={field} />
        ))}
      </div>
    </>
  );
};

const FieldViewer = ({ field }: { field: FormField }) => {
  const renderFieldInput = (field: FormField) => {
    switch (field.type) {
      case "Text":
      case "Number":
        return (
          <input
            type={field.type.toLowerCase()}
            className="p-2 border border-gray-300 rounded w-full"
          />
        );
      case "Dropdown":
        return (
          <select className="p-2 border border-gray-300 rounded w-full">
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "Multiple Choice":
        return field.options?.map((option, idx) => (
          <label key={idx} className="block">
            <input type="radio" name={field.id} value={option} />
            {option}
          </label>
        ));
      case "Checkbox":
        return field.options?.map((option, idx) => (
          <label key={idx} className="block">
            <input type="checkbox" value={option} />
            {option}
          </label>
        ));
      case "Date":
        return (
          <input
            type="date"
            className="p-2 border border-gray-300 rounded w-full"
          />
        );
      default:
        return <div />;
    }
  };

  return (
    <div className="bg-white p-4 my-2 rounded shadow w-full max-w-3xl">
      <div className="font-bold">
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </div>
      {renderFieldInput(field)}
    </div>
  );
};

export default PreviewForm;
