import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import LoadingScreen from "../components/LoadingScreen";
import MistakeForm from "../components/MistakeForm";
import MistakeTable from "../components/MistakeTable";
import StatCard from "../components/StatCard";
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  createMistake,
  deleteMistake,
  fetchSessionForUser,
  fetchSessionMistakesForUser,
  updateMistake,
} from "../services/examService";
import { getTopRootCause, suggestRootCause } from "../utils/analyzer";

const emptyMistakeForm = {
  questionNumber: "",
  topic: "",
  questionText: "",
  correctAnswer: "",
  studentAnswer: "",
  studentNote: "",
  rootCause: "",
  revisionStatus: "Needs Revision",
};

function SessionDetailPage() {
  const { currentUser } = useAuth();
  const { sessionId } = useParams();
  const location = useLocation();
  const formAnchorRef = useRef(null);
  const [session, setSession] = useState(location.state?.session || null);
  const [mistakes, setMistakes] = useState([]);
  const [formData, setFormData] = useState(emptyMistakeForm);
  const [editingMistakeId, setEditingMistakeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useDocumentTitle("Test Details | Exam Mistake Analyzer");

  useEffect(() => {
    async function loadSessionPage() {
      if (!currentUser) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const fallbackSession = location.state?.session || null;
        const [sessionData, mistakeData] = await Promise.all([
          fetchSessionForUser(currentUser.uid, sessionId),
          fetchSessionMistakesForUser(currentUser.uid, sessionId),
        ]);

        setSession(sessionData || fallbackSession);
        setMistakes(mistakeData);
      } catch (loadError) {
        setError("Could not load this test right now.");
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    }

    loadSessionPage();
  }, [currentUser, location.state, sessionId]);

  const suggestedRootCause = useMemo(() => {
    return suggestRootCause(formData);
  }, [formData]);

  const filteredMistakes = useMemo(() => {
    return mistakes.filter((mistake) => {
      const matchesSearch =
        mistake.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mistake.questionText.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesReason = reasonFilter ? mistake.rootCause === reasonFilter : true;

      return matchesSearch && matchesReason;
    });
  }, [mistakes, reasonFilter, searchTerm]);

  const stats = useMemo(() => {
    const openMistakes = mistakes.filter((mistake) => mistake.revisionStatus !== "Done");

    return {
      totalMistakes: mistakes.length,
      openMistakes: openMistakes.length,
      mainReason: getTopRootCause(mistakes),
    };
  }, [mistakes]);

  function resetForm() {
    setFormData(emptyMistakeForm);
    setEditingMistakeId("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        [name]: value,
      };
    });
  }

  async function reloadMistakes() {
    if (!currentUser) {
      return;
    }

    const updatedMistakes = await fetchSessionMistakesForUser(currentUser.uid, sessionId);
    setMistakes(updatedMistakes);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUser) {
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      questionNumber: Number(formData.questionNumber),
      topic: formData.topic.trim(),
      questionText: formData.questionText.trim(),
      correctAnswer: formData.correctAnswer.trim(),
      studentAnswer: formData.studentAnswer.trim(),
      studentNote: formData.studentNote.trim(),
      rootCause: formData.rootCause || suggestedRootCause,
      revisionStatus: formData.revisionStatus,
    };

    try {
      if (editingMistakeId) {
        await updateMistake(editingMistakeId, payload);
      } else {
        await createMistake(currentUser.uid, sessionId, payload);
      }

      await reloadMistakes();
      resetForm();
    } catch (saveError) {
      setError(`The mistake could not be saved. ${saveError.message || ""}`.trim());
      console.error(saveError);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(mistake) {
    setEditingMistakeId(mistake.id);
    setFormData({
      questionNumber: String(mistake.questionNumber),
      topic: mistake.topic,
      questionText: mistake.questionText,
      correctAnswer: mistake.correctAnswer,
      studentAnswer: mistake.studentAnswer,
      studentNote: mistake.studentNote,
      rootCause: mistake.rootCause,
      revisionStatus: mistake.revisionStatus,
    });

    if (formAnchorRef.current) {
      formAnchorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  async function handleDelete(mistake) {
    const shouldDelete = window.confirm(
      `Delete question ${mistake.questionNumber} from this test?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteMistake(mistake.id);
      await reloadMistakes();
    } catch (deleteError) {
      setError("The mistake could not be deleted.");
      console.error(deleteError);
    }
  }

  if (loading) {
    return <LoadingScreen message="Loading test details..." />;
  }

  if (!session) {
    return (
      <EmptyState
        title="Test not found"
        description="This test might have been deleted."
        action={
          <Link className="primary-button" to="/tests">
            Back to tests
          </Link>
        }
      />
    );
  }

  return (
    <section className="page-section">
      <section className="hero-card">
        <div className="hero-content-grid">
          <div>
            <p className="eyebrow">{session.subject}</p>
            <h2>{session.examTitle}</h2>
            <p>
              Taken on {session.examDate}. Score: {session.score} / {session.totalQuestions}
            </p>
            {session.teacherComment ? (
              <p className="teacher-note">Teacher note: {session.teacherComment}</p>
            ) : null}
          </div>

          <div className="button-row">
            <Link className="secondary-button" to={`/tests/${session.id}/edit`}>
              Edit test
            </Link>
            <Link className="primary-button" to="/study-plan">
              Open study plan
            </Link>
          </div>
        </div>

      </section>

      <section className="stats-grid">
        <StatCard
          label="Mistakes in this test"
          value={stats.totalMistakes}
          helpText="Each row is one saved wrong answer."
        />
        <StatCard
          label="Pending revision"
          value={stats.openMistakes}
          helpText="These mistakes are still active in your study plan."
        />
        <StatCard
          label="Main root cause"
          value={stats.mainReason}
          helpText="This is the most repeated problem in this test."
        />
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <MistakeForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        suggestedRootCause={suggestedRootCause}
        isSaving={saving}
        isEditing={Boolean(editingMistakeId)}
        formAnchorRef={formAnchorRef}
      />

      <section className="card">
        <div className="section-heading">
          <h2>Saved mistakes</h2>
          <p>Filter the list to focus on one topic or one type of error.</p>
        </div>

        <div className="form-grid">
          <label className="field-group">
            <span>Search by topic or question</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search mistakes"
            />
          </label>

          <label className="field-group">
            <span>Filter by root cause</span>
            <select
              value={reasonFilter}
              onChange={(event) => setReasonFilter(event.target.value)}
            >
              <option value="">All reasons</option>
              <option value="Concept Gap">Concept Gap</option>
              <option value="Careless Error">Careless Error</option>
              <option value="Misread Question">Misread Question</option>
              <option value="Weak Revision Habit">Weak Revision Habit</option>
              <option value="Needs More Review">Needs More Review</option>
            </select>
          </label>
        </div>

        <MistakeTable
          mistakes={filteredMistakes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </section>
  );
}

export default SessionDetailPage;
