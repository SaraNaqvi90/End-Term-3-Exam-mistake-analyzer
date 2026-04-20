import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useDocumentTitle("Sign Up | Exam Mistake Analyzer");

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

    if (formData.password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError("Could not create your account. Please try a different email.");
      console.error(submitError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Create your account"
      description="Start tracking mistakes from every exam and turn them into a clear revision system."
      submitLabel="Create account"
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkTo="/login"
      showNameField={true}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}

export default SignupPage;
