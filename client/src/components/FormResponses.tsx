import { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

const API_BASE = process.env.REACT_APP_API_URL;

interface FormResponse {
  id: number;
  form_id: number;
  response_data: { [key: string]: any };
  created_at: string;
}

interface FormField {
  id: string;
  label: string;
}

const FormResponses = () => {
  const { formId } = useParams<{ formId: string }>();
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<FormResponse[]>(
    []
  );
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formFields, setFormFields] = useState<{ [key: string]: string }>({});
  const [formName, setFormName] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`${API_BASE}/form-responses/${formId}`)
      .then((res) => {
        setResponses(res.data);
        setFilteredResponses(res.data);
      })
      .catch((err) => console.error("Error Fetching Responses:", err));
    api
      .get(`${API_BASE}/forms/secure/${formId}`)
      .then((res) => {
        setFormName(res.data.form_name);
        const fieldMap: { [key: string]: string } = {};
        res.data.fields.forEach((field: FormField) => {
          fieldMap[field.id] = field.label;
        });
        setFormFields(fieldMap);
      })
      .catch((err) => console.error("Error Fetching Form Fields:", err));
  }, [formId]);

  const handleSort = (key: string) => {
    let newOrder: "asc" | "desc" | null = "asc";

    if (sortBy === key) {
      if (sortOrder === "asc") newOrder = "desc";
      else if (sortOrder === "desc") newOrder = null;
      else newOrder = "asc";
    }

    if (newOrder === null) {
      setFilteredResponses([...responses]);
      setSortBy(null);
      setSortOrder(null);
      return;
    }

    const sorted = [...filteredResponses].sort((a, b) => {
      let aValue = a.response_data[key] ?? "";
      let bValue = b.response_data[key] ?? "";

      if (key === "id") {
        aValue = Number(a.id);
        bValue = Number(b.id);
      } else if (key === "created_at") {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      } else if (Array.isArray(aValue) && Array.isArray(bValue)) {
        aValue = aValue.join(", ");
        bValue = bValue.join(", ");
      } else {
        aValue = String(aValue);
        bValue = String(bValue);
      }

      return newOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

    setFilteredResponses(sorted);
    setSortBy(key);
    setSortOrder(newOrder);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    if (query === "") {
      setFilteredResponses(responses);
    } else {
      setFilteredResponses(
        responses.filter((response) =>
          Object.values(response.response_data).some((val) =>
            Array.isArray(val)
              ? val.some((item) => String(item).toLowerCase().includes(query))
              : String(val).toLowerCase().includes(query)
          )
        )
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 p-6 bg-gray-100 min-h-screen font-[Oxygen]">
        <h1 className="text-2xl font-bold mb-4 flex justify-center">
          {formName ? `Responses For: ${formName}` : "Form Responses"}
        </h1>
        <input
          type="text"
          placeholder="Search responses..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-full mb-4"
        />
        {filteredResponses.length > 0 ? (
          <table className="w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th
                  className="p-2 cursor-pointer hover:bg-gray-300"
                  onClick={() => handleSort("id")}
                >
                  ID{" "}
                  {sortBy === "id" ? (sortOrder === "asc" ? "🔼" : "🔽") : ""}
                </th>
                <th
                  className="p-2 cursor-pointer hover:bg-gray-300"
                  onClick={() => handleSort("created_at")}
                >
                  Created At{" "}
                  {sortBy === "created_at"
                    ? sortOrder === "asc"
                      ? "🔼"
                      : "🔽"
                    : ""}
                </th>
                {Object.keys(filteredResponses[0].response_data).map((key) => (
                  <th
                    key={key}
                    className="p-2 cursor-pointer hover:bg-gray-300"
                    onClick={() => handleSort(key)}
                  >
                    {formFields[key] || key}{" "}
                    {sortBy === key ? (sortOrder === "asc" ? "🔼" : "🔽") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredResponses.map((response) => (
                <tr key={response.id} className="border-t text-center">
                  <td className="p-2">{response.id}</td>
                  <td className="p-2">
                    {new Date(response.created_at).toLocaleString()}
                  </td>
                  {Object.keys(response.response_data).map((key, idx) => (
                    <td key={idx} className="p-2">
                      {Array.isArray(response.response_data[key])
                        ? response.response_data[key].join(", ")
                        : response.response_data[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Responses Found</p>
        )}
      </div>
    </>
  );
};

export default FormResponses;
