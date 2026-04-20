import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import LoadingScreen from "../components/LoadingScreen";
import SessionCard from "../components/SessionCard";
import SessionFilters from "../components/SessionFilters";
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  deleteSessionAndMistakes,
  fetchUserMistakes,
  fetchUserSessions,
} from "../services/examService";
import { getTopRootCause } from "../utils/analyzer";

function TestsPage() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useDocumentTitle("Tests | Exam Mistake Analyzer");

  useEffect(() => {
    async function loadTestsPage() {
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
        setError("Could not load the tests page right now.");
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    }

    loadTestsPage();
  }, [currentUser]);

  const subjects = useMemo(() => {
    const uniqueSubjects = new Set();

    sessions.forEach((session) => {
      uniqueSubjects.add(session.subject);
    });

    return [...uniqueSubjects].sort();
  }, [sessions]);

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

  const filteredSessions = useMemo(() => {
    return sessionsWithSummary.filter((session) => {
      const matchesSearch = session.examTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesSubject = subjectFilter ? session.subject === subjectFilter : true;

      return matchesSearch && matchesSubject;
    });
  }, [searchTerm, sessionsWithSummary, subjectFilter]);

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
    return <LoadingScreen message="Loading your tests..." />;
  }

  return (
    <section className="page-section">
      <section className="hero-card compact-hero">
        <div>
          <p className="eyebrow">All saved tests</p>
          <h2>Store every graded paper in one place</h2>
          <p>
            Upload a test, save each wrong answer, and keep a clean record of your progress.
          </p>
        </div>

        <Link className="primary-button" to="/tests/new">
          Add new test
        </Link>
      </section>

      <SessionFilters
        searchTerm={searchTerm}
        subjectFilter={subjectFilter}
        subjects={subjects}
        onSearchChange={(event) => setSearchTerm(event.target.value)}
        onSubjectChange={(event) => setSubjectFilter(event.target.value)}
      />

      {error ? <p className="form-error">{error}</p> : null}

      {filteredSessions.length ? (
        <div className="card-grid">
          {filteredSessions.map((session) => (
            <SessionCard key={session.id} session={session} onDelete={handleDeleteSession} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tests match your filter"
          description="Try another search term or add a new graded test."
          action={
            <Link className="primary-button" to="/tests/new">
              Upload test
            </Link>
          }
        />
      )}
    </section>
  );
}

export default TestsPage;
