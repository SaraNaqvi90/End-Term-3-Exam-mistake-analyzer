import { Link } from "react-router-dom";

function AuthForm({
  title,
  description,
  submitLabel,
  footerText,
  footerLinkText,
  footerLinkTo,
  showNameField,
  formData,
  onChange,
  onSubmit,
  loading,
  error,
}) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Batch 2029 Project</p>
        <h1>{title}</h1>
        <p className="auth-copy">{description}</p>

        <form className="form-stack" onSubmit={onSubmit}>
          {showNameField ? (
            <label className="field-group">
              <span>Full name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter your full name"
                required
              />
            </label>
          ) : null}

          <label className="field-group">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </label>

          <label className="field-group">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-button full-width" disabled={loading}>
            {loading ? "Please wait..." : submitLabel}
          </button>
        </form>

        <p className="auth-footer">
          {footerText} <Link to={footerLinkTo}>{footerLinkText}</Link>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
