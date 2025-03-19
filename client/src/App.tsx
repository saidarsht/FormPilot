import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormBuilder from "./components/FormBuilder";
import FormList from "./components/FormList";
import PreviewForm from "./components/PreviewForm";
import EditForm from "./components/EditForm";
import FormSubmit from "./components/FormSubmit";
import FormResponses from "./components/FormResponses";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

console.log("✅ App component is rendering...");

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/submit/:formId" element={<FormSubmit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/form-builder" element={<FormBuilder />} />
          <Route path="/forms" element={<FormList />} />
          <Route path="/preview/:formId" element={<PreviewForm />} />
          <Route path="/edit/:formId" element={<EditForm />} />
          <Route path="/responses/:formId" element={<FormResponses />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
