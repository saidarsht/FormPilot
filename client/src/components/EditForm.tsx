import { useState, useEffect, useRef } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "./Navbar";

const API_BASE = process.env.REACT_APP_API_URL;

type FormField = {
  id: string;
  type: string;
  label: string;
  options?: string[];
  value?: string;
  required?: boolean;
};

const defaultFieldTypes = [
  "Text",
  "Number",
  "Multiple Choice",
  "Checkbox",
  "Dropdown",
  "Date",
];

const EditForm = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formName, setFormName] = useState("");
  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You Are Not Logged In.");
      navigate("/login");
      return;
    }

    api
      .get(`${API_BASE}/forms/${formId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFormName(res.data.form_name);
        setFields(res.data.fields);
      })
      .catch((err) => {
        console.error("Error Fetching Form:", err);
        alert("Failed To Load The Form.");
      });
  }, [formId, navigate]);

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const updatedFields = [...fields];
    const draggedField = updatedFields[dragIndex];
    updatedFields.splice(dragIndex, 1);
    updatedFields.splice(hoverIndex, 0, draggedField);
    setFields(updatedFields);
  };

  const updateField = (id: string, key: keyof FormField, value: any) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const toggleRequired = (id: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, required: !field.required } : field
      )
    );
  };

  const addOption = (id: string) => {
    setFields(
      fields.map((field) =>
        field.id === id
          ? {
              ...field,
              options: [
                ...field.options!,
                `Option ${field.options!.length + 1}`,
              ],
            }
          : field
      )
    );
  };

  const removeOption = (id: string, index: number) => {
    setFields(
      fields.map((field) =>
        field.id === id
          ? {
              ...field,
              options: field.options!.filter((_, idx) => idx !== index),
            }
          : field
      )
    );
  };

  const addField = () => {
    const newField = {
      id: `${Date.now()}`,
      type: "Text",
      label: "",
      options: [],
      required: false,
    };
    setFields([...fields, newField]);
  };

  const saveForm = async () => {
    if (!formName.trim()) {
      alert("Please Enter a Form Name");
      return;
    }

    try {
      const response = await api.put(
        `${API_BASE}/forms/${formId}`,
        { formName, fields },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        alert("Form Updated Successfully.");
        navigate("/forms");
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed To Update Form.");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Navbar />
      <div className="pt-24 flex flex-col items-center min-h-screen bg-gray-100 p-6 font-[Oxygen]">
        <h1 className="text-3xl font-bold mb-4">Edit Form - {formName}</h1>
        <input
          type="text"
          placeholder="Form Name"
          className="text-lg border p-3 w-full max-w-3xl rounded mb-4"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
        {fields.map((field, index) => (
          <DraggableField
            key={field.id}
            index={index}
            field={field}
            moveField={moveField}
            updateField={updateField}
            removeField={removeField}
            toggleRequired={toggleRequired}
            addOption={addOption}
            removeOption={removeOption}
          />
        ))}
        <button
          onClick={addField}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Question
        </button>
        <button
          onClick={saveForm}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save Form
        </button>
      </div>
    </DndProvider>
  );
};

const DraggableField = ({
  field,
  index,
  moveField,
  updateField,
  removeField,
  toggleRequired,
  addOption,
  removeOption,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "field",
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveField(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "field",
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
      className="bg-white p-4 my-2 rounded shadow w-full max-w-3xl"
    >
      <FieldEditor
        field={field}
        updateField={updateField}
        removeField={removeField}
        toggleRequired={toggleRequired}
        addOption={addOption}
        removeOption={removeOption}
      />
    </div>
  );
};

const FieldEditor = ({
  field,
  updateField,
  removeField,
  toggleRequired,
  addOption,
  removeOption,
}) => {
  const renderInputForType = (type, option, idx) => {
    let icon;
    switch (type) {
      case "Dropdown":
        icon = `${idx + 1}.`;
        break;
      case "Checkbox":
        icon = "□";
        break;
      case "Multiple Choice":
        icon = "○";
        break;
      default:
        icon = null;
    }

    return (
      <div key={idx} className="flex items-center space-x-2">
        {icon && <span>{icon}</span>}
        <input
          type="text"
          placeholder="Option"
          value={option}
          onChange={(e) => {
            const newOptions = [...field.options];
            newOptions[idx] = e.target.value;
            updateField(field.id, "options", newOptions);
          }}
          className="p-2 border border-gray-300 rounded flex-grow"
        />
        <button
          onClick={() => removeOption(field.id, idx)}
          className="text-red-500"
          style={{ fontSize: "1.5rem" }}
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Question"
          value={field.label}
          onChange={(e) => updateField(field.id, "label", e.target.value)}
          className="p-2 border border-gray-300 rounded flex-grow"
        />
        <select
          value={field.type}
          onChange={(e) => {
            updateField(field.id, "type", e.target.value);
            if (
              ["Multiple Choice", "Dropdown", "Checkbox"].includes(
                e.target.value
              ) &&
              (!field.options || field.options.length === 0)
            ) {
              updateField(field.id, "options", ["Option 1"]);
            }
          }}
          className="border p-2 rounded"
        >
          {defaultFieldTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button onClick={() => removeField(field.id)} className="text-red-500">
          Remove
        </button>
      </div>
      {field.options &&
        ["Dropdown", "Multiple Choice", "Checkbox"].includes(field.type) && (
          <div className="mt-2">
            {field.options.map((option, idx) =>
              renderInputForType(field.type, option, idx)
            )}
            <button
              onClick={() => addOption(field.id)}
              className="px-4 py-2 mt-3 bg-blue-500 text-white rounded"
              style={{ width: "auto" }}
            >
              Add Option
            </button>
          </div>
        )}
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          checked={field.required || false}
          onChange={() => toggleRequired(field.id)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span className="ml-2 text-gray-700">Required</span>
      </div>
      {field.type === "Text" && (
        <div className="italic text-gray-400">Answer Text</div>
      )}
      {field.type === "Number" && (
        <div className="italic text-gray-400">Answer Number</div>
      )}
      {field.type === "Date" && (
        <div className="italic text-gray-400">Select Date</div>
      )}
    </div>
  );
};

export default EditForm;
