import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import LoadingScreen from "../components/LoadingScreen";
import SessionCard from "../components/SessionCard";
import StatCard from "../components/StatCard";
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  deleteSessionAndMistakes,
  fetchUserMistakes,
  fetchUserSessions,
} from "../services/examService";
import { getTopRootCause } from "../utils/analyzer";

function DashboardPage() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useDocumentTitle("Dashboard | Exam Mistake Analyzer");

  useEffect(() => {
    async function loadDashboard() {
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
        setError("Could not load your dashboard data right now.");
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [currentUser]);

  const sessionsWithSummary = useMemo(() => {
    return sessions.map((session) => {
      const relatedMistakes = mistakes.filter((mistake) => mistake.sessionId === session.id);

      return {
        ...session,
        mistakeCount: relatedMistakes.length,
        topReason: getTopRootCause(relatedMistakes),
      };
    });
  }, [sessions, mistakes]);

  const stats = useMemo(() => {
    const openMistakes = mistakes.filter((mistake) => mistake.revisionStatus !== "Done");
    const topicCounts = {};

    openMistakes.forEach((mistake) => {
      const topic = mistake.topic || "General";
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    const hardestTopic = Object.entries(topicCounts).sort((firstItem, secondItem) => {
      return secondItem[1] - firstItem[1];
    })[0];

    return {
      totalTests: sessions.length,
      totalMistakes: mistakes.length,
      openMistakes: openMistakes.length,
      topRootCause: getTopRootCause(mistakes),
      hardestTopic: hardestTopic ? hardestTopic[0] : "No data yet",
    };
  }, [sessions, mistakes]);

  async function handleDeleteSession(session) {
    const shouldDelete = window.confirm(
      `Delete "${session.examTitle}" and all the mistakes saved inside it?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteSessionAndMistakes(session);
      setSessions((currentSessions) => {
        return currentSessions.filter((currentSession) => currentSession.id !== session.id);
      });
      setMistakes((currentMistakes) => {
        return currentMistakes.filter((mistake) => mistake.sessionId !== session.id);
      });
    } catch (deleteError) {
      setError("The test could not be deleted.");
      console.error(deleteError);
    }
  }

  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <section className="page-section">
      <section className="hero-card">
        <p className="eyebrow">Project problem statement</p>
        <h2>Students repeat the same exam mistakes because they never analyze them properly.</h2>
        <p>
          This app stores graded tests, studies every wrong answer, finds the root cause,
          and turns the results into a revision plan that is easy to follow.
        </p>

        <div className="button-row">
          <Link className="primary-button" to="/tests/new">
            Upload graded test
          </Link>
          <Link className="secondary-button" to="/study-plan">
            View study plan
          </Link>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Saved tests"
          value={stats.totalTests}
          helpText="Every uploaded test becomes one study record."
        />
        <StatCard
          label="Logged mistakes"
          value={stats.totalMistakes}
          helpText="These are the wrong answers you have analyzed."
        />
        <StatCard
          label="Still to revise"
          value={stats.openMistakes}
          helpText="These mistakes are not marked as done yet."
        />
        <StatCard
          label="Most common reason"
          value={stats.topRootCause}
          helpText={`Current hardest topic: ${stats.hardestTopic}`}
        />
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="card">
        <div className="section-heading">
          <h2>Recent tests</h2>
          <p>Open a test to add mistakes, edit details, or review the uploaded image.</p>
        </div>

        {sessionsWithSummary.length ? (
          <div className="card-grid">
            {sessionsWithSummary.slice(0, 3).map((session) => (
              <SessionCard key={session.id} session={session} onDelete={handleDeleteSession} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tests added yet"
            description="Start by uploading one graded test. After that, you can store each wrong answer and build a revision plan."
            action={
              <Link className="primary-button" to="/tests/new">
                Add first test
              </Link>
            }
          />
        )}
      </section>
    </section>
  );
}

export default DashboardPage;
