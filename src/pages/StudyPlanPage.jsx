import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import LoadingScreen from "../components/LoadingScreen";
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  fetchUserMistakes,
  fetchUserSessions,
  updateMistake,
} from "../services/examService";
import { buildRevisionPlan } from "../utils/analyzer";

function StudyPlanPage() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useDocumentTitle("Study Plan | Exam Mistake Analyzer");

  async function loadStudyPlan() {
    if (!currentUser) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [sessionData, mistakeData] = await Promise.all([
        fetchUserSessions(currentUser.uid),
        fetchUserMistakes(currentUser.uid),
      ]);

      setSessions(sessionData);
      setMistakes(mistakeData);
    } catch (loadError) {
      setError("Could not load the study plan right now.");
      console.error(loadError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudyPlan();
  }, [currentUser]);

  const sessionNames = useMemo(() => {
    const map = {};

    sessions.forEach((session) => {
      map[session.id] = session.examTitle;
    });

    return map;
  }, [sessions]);

  const revisionPlan = useMemo(() => {
    return buildRevisionPlan(mistakes);
  }, [mistakes]);

  const pendingMistakes = useMemo(() => {
    return mistakes.filter((mistake) => mistake.revisionStatus !== "Done");
  }, [mistakes]);

  async function toggleRevisionStatus(mistake) {
    const nextStatus =
      mistake.revisionStatus === "Done" ? "Needs Revision" : "Done";

    try {
      await updateMistake(mistake.id, {
        questionNumber: mistake.questionNumber,
        topic: mistake.topic,
        questionText: mistake.questionText,
        correctAnswer: mistake.correctAnswer,
        studentAnswer: mistake.studentAnswer,
        studentNote: mistake.studentNote,
        rootCause: mistake.rootCause,
        revisionStatus: nextStatus,
      });

      await loadStudyPlan();
    } catch (updateError) {
      setError("Could not update the revision status.");
      console.error(updateError);
    }
  }

  if (loading) {
    return <LoadingScreen message="Building your study plan..." />;
  }

  return (
    <section className="page-section">
      <section className="hero-card">
        <p className="eyebrow">Targeted revision plan</p>
        <h2>Study the topics that actually caused marks to drop</h2>
        <p>
          This page turns your saved mistakes into a priority list. The more often a
          topic appears, the earlier it should be revised.
        </p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      {revisionPlan.length ? (
        <section className="card">
          <div className="section-heading">
            <h2>Priority topics</h2>
            <p>Start from the top and work downward.</p>
          </div>

          <div className="plan-grid">
            {revisionPlan.map((item) => (
              <article className="plan-card" key={item.topic}>
                <p className="eyebrow">{item.mainReason}</p>
                <h3>{item.topic}</h3>
                <p>{item.action}</p>
                <span className="status-badge">
                  {item.totalMistakes} active mistake{item.totalMistakes > 1 ? "s" : ""}
                </span>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="Your plan is empty"
          description="Once you save mistakes, this page will suggest what to revise first."
        />
      )}

      <section className="card">
        <div className="section-heading">
          <h2>Revision checklist</h2>
          <p>Mark an item as done after you revise it properly.</p>
        </div>

        {pendingMistakes.length ? (
          <div className="checklist-grid">
            {pendingMistakes.map((mistake) => (
              <article className="checklist-card" key={mistake.id}>
                <div>
                  <p className="eyebrow">{sessionNames[mistake.sessionId] || "Saved test"}</p>
                  <h3>
                    Q{mistake.questionNumber} - {mistake.topic}
                  </h3>
                  <p>{mistake.rootCause}</p>
                  <p>{mistake.studentNote}</p>
                </div>

                <button className="primary-button" onClick={() => toggleRevisionStatus(mistake)}>
                  Mark as done
                </button>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="All revision tasks are done"
            description="Nice work. Add a new test or update a mistake if you want to continue tracking."
          />
        )}
      </section>
    </section>
  );
}

export default StudyPlanPage;
