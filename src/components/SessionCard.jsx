import { Link } from "react-router-dom";

function SessionCard({ session, onDelete }) {
  return (
    <article className="card session-card">
      <div className="session-card-top">
        <div>
          <p className="eyebrow">{session.subject}</p>
          <h3>{session.examTitle}</h3>
        </div>
        <span className="status-badge">{session.examDate}</span>
      </div>

      <div className="session-meta">
        <p>
          Score: <strong>{session.score}</strong> / {session.totalQuestions}
        </p>
        <p>
          Mistakes saved: <strong>{session.mistakeCount}</strong>
        </p>
        <p>
          Main pattern: <strong>{session.topReason}</strong>
        </p>
      </div>

      <div className="button-row">
        <Link
          className="primary-button"
          to={`/tests/${session.id}`}
          state={{ session }}
        >
          Open details
        </Link>
        <Link
          className="secondary-button"
          to={`/tests/${session.id}/edit`}
          state={{ session }}
        >
          Edit test
        </Link>
        <button className="ghost-button danger-button" onClick={() => onDelete(session)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default SessionCard;
