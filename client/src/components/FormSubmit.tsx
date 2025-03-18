import { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;

type FormField = {
  id: string;
  type: string;
  label: string;
  options?: string[];
  required?: boolean;
};

const FormSubmit = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formName, setFormName] = useState("");
  const { formId } = useParams<{ formId: string }>();
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api
      .get(`${API_BASE}/forms/${formId}`)
      .then((res) => {
        setFormName(res.data.form_name);
        setFields(res.data.fields);
      })
      .catch((err) => {
        console.error("Error Fetching Form:", err);
        alert("Failed to Load The Form.");
      });
  }, [formId]);

  const handleChange = (
    id: string,
    value: any,
    isCheckbox: boolean = false
  ) => {
    setResponses((prev) => {
      if (isCheckbox) {
        const selectedOptions = prev[id] ? [...prev[id]] : [];
        if (selectedOptions.includes(value)) {
          return { ...prev, [id]: selectedOptions.filter((v) => v !== value) };
        } else {
          return { ...prev, [id]: [...selectedOptions, value] };
        }
      } else {
        return { ...prev, [id]: value };
      }
    });
  };

  const handleSubmit = async () => {
    const missingFields = fields
      .filter((field) => field.required)
      .filter((field) => {
        const responseValue = responses[field.id];

        if (responseValue === undefined || responseValue === null) {
          return true;
        }

        if (typeof responseValue === "string") {
          return responseValue.trim() === "";
        }

        if (Array.isArray(responseValue)) {
          return responseValue.length === 0;
        }

        return false;
      });

    if (missingFields.length > 0) {
      alert("Please Fill In All Required Fields Before Submitting.");
      return;
    }

    try {
      await api.post(
        `${API_BASE}/form-responses`,
        { formId, responses },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setSubmitted(true);
      setResponses({});
    } catch (error) {
      console.error("Error Submitting Response:", error);
      alert("Error Submitting Response. Please Try Again.");
    }
  };

  return (
    <div className="pt-24 flex flex-col items-center min-h-screen bg-gray-100 p-6 font-[Oxygen]">
      {submitted ? (
        <h1 className="text-6xl text-black">Form Submitted!</h1>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{formName}</h1>
          {fields.map((field) => (
            <FieldViewer
              key={field.id}
              field={field}
              responses={responses}
              handleChange={handleChange}
            />
          ))}
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit Form
          </button>
        </>
      )}
    </div>
  );
};

const FieldViewer = ({
  field,
  responses,
  handleChange,
}: {
  field: FormField;
  responses: { [key: string]: any };
  handleChange: (id: string, value: any, isCheckbox?: boolean) => void;
}) => {
  const renderFieldInput = (field: FormField) => {
    switch (field.type) {
      case "Text":
      case "Number":
        return (
          <input
            type={field.type.toLowerCase()}
            className="p-2 border border-gray-300 rounded w-full"
            value={responses[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        );
      case "Dropdown":
        return (
          <select
            className="p-2 border border-gray-300 rounded w-full"
            value={responses[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
          >
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
            <input
              type="radio"
              name={field.id}
              value={option}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
            {option}
          </label>
        ));
      case "Checkbox":
        return (
          <div>
            {field.options?.map((option, idx) => (
              <label key={idx} className="block">
                <input
                  type="checkbox"
                  value={option}
                  checked={responses[field.id]?.includes(option) || false}
                  onChange={(e) => handleChange(field.id, option, true)}
                />
                {option}
              </label>
            ))}
          </div>
        );
      case "Date":
        return (
          <input
            type="date"
            className="p-2 border border-gray-300 rounded w-full"
            value={responses[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
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

export default FormSubmit;
