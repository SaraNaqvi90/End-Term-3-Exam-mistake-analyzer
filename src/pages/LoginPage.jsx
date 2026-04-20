import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useDocumentTitle("Login | Exam Mistake Analyzer");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        [name]: value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      const nextPath = location.state?.from?.pathname || "/dashboard";
      navigate(nextPath, { replace: true });
    } catch (submitError) {
      setError("Could not log in. Please check your email and password.");
      console.error(submitError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Welcome back"
      description="Log in to review old tests, understand your weak areas, and build a better revision plan."
      submitLabel="Log in"
      footerText="Do not have an account?"
      footerLinkText="Create one"
      footerLinkTo="/signup"
      showNameField={false}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}

export default LoginPage;
