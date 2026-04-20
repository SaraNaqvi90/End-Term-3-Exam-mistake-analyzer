import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  createSession,
  fetchSessionForUser,
  updateSession,
} from "../services/examService";

const emptyForm = {
  examTitle: "",
  subject: "",
  examDate: "",
  totalQuestions: "",
  score: "",
  teacherComment: "",
};

function UploadTestPage() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const isEditing = Boolean(sessionId);
  const [formData, setFormData] = useState(emptyForm);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useDocumentTitle(
    isEditing ? "Edit Test | Exam Mistake Analyzer" : "Upload Test | Exam Mistake Analyzer"
  );

  useEffect(() => {
    async function loadSessionData() {
      if (!isEditing || !currentUser) {
        return;
      }

      setPageLoading(true);
      setError("");

      try {
        const fallbackSession = location.state?.session || null;
        const session =
          (await fetchSessionForUser(currentUser.uid, sessionId)) || fallbackSession;

        if (!session) {
          setError("This test could not be found.");
          return;
        }

        setFormData({
          examTitle: session.examTitle || "",
          subject: session.subject || "",
          examDate: session.examDate || "",
          totalQuestions: String(session.totalQuestions || ""),
          score: String(session.score || ""),
          teacherComment: session.teacherComment || "",
        });
      } catch (loadError) {
        setError("Could not load this test.");
        console.error(loadError);
      } finally {
        setPageLoading(false);
      }
    }

    loadSessionData();
  }, [currentUser, isEditing, location.state, sessionId]);

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

    if (!currentUser) {
      return;
    }

    setSaving(true);
    setError("");

    const sessionData = {
      examTitle: formData.examTitle.trim(),
      subject: formData.subject.trim(),
      examDate: formData.examDate,
      totalQuestions: Number(formData.totalQuestions),
      score: Number(formData.score),
      teacherComment: formData.teacherComment.trim(),
    };

    try {
      if (isEditing) {
        await updateSession(sessionId, currentUser.uid, sessionData);
        navigate(`/tests/${sessionId}`);
      } else {
        const newSessionId = await createSession(currentUser.uid, sessionData);
        navigate(`/tests/${newSessionId}`);
      }
    } catch (saveError) {
      setError("The test could not be saved. Please try again.");
      console.error(saveError);
    } finally {
      setSaving(false);
    }
  }

  if (pageLoading) {
    return <LoadingScreen message="Loading test form..." />;
  }

  return (
    <section className="page-section">
      <section className="hero-card compact-hero">
        <div>
          <p className="eyebrow">{isEditing ? "Edit test" : "Add test details"}</p>
          <h2>{isEditing ? "Update the test details" : "Save one graded test to start analysis"}</h2>
          <p>
            Add the exam details first. Then open the test and save each wrong answer one
            by one.
          </p>
        </div>

        <Link className="secondary-button" to="/tests">
          Back to tests
        </Link>
      </section>

      <section className="card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field-group">
            <span>Exam title</span>
            <input
              type="text"
              name="examTitle"
              value={formData.examTitle}
              onChange={handleChange}
              placeholder="Example: Midterm Mathematics Test"
              required
            />
          </label>

          <label className="field-group">
            <span>Subject</span>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Example: Mathematics"
              required
            />
          </label>

          <label className="field-group">
            <span>Exam date</span>
            <input
              type="date"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field-group">
            <span>Total questions</span>
            <input
              type="number"
              min="1"
              name="totalQuestions"
              value={formData.totalQuestions}
              onChange={handleChange}
              placeholder="Example: 50"
              required
            />
          </label>

          <label className="field-group">
            <span>Score</span>
            <input
              type="number"
              min="0"
              step="0.1"
              name="score"
              value={formData.score}
              onChange={handleChange}
              placeholder="Example: 37"
              required
            />
          </label>

          <label className="field-group field-span-2">
            <span>Teacher comment</span>
            <textarea
              name="teacherComment"
              value={formData.teacherComment}
              onChange={handleChange}
              placeholder="Example: Good attempt, but revise geometry proofs."
              rows="4"
            />
          </label>

          {error ? <p className="form-error field-span-2">{error}</p> : null}

          <div className="button-row field-span-2">
            <button className="primary-button" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Update test" : "Save test"}
            </button>
            <Link className="secondary-button" to="/tests">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </section>
  );
}

export default UploadTestPage;
