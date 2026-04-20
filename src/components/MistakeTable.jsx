import EmptyState from "./EmptyState";

function MistakeTable({ mistakes, onEdit, onDelete }) {
  if (!mistakes.length) {
    return (
      <EmptyState
        title="No mistakes saved yet"
        description="Once you add wrong answers, they will appear here with their root cause and revision status."
      />
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Topic</th>
            <th>Root cause</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mistakes.map((mistake) => (
            <tr key={mistake.id}>
              <td>Q{mistake.questionNumber}</td>
              <td>{mistake.topic}</td>
              <td>{mistake.rootCause}</td>
              <td>{mistake.revisionStatus}</td>
              <td>
                <div className="button-row">
                  <button className="secondary-button" onClick={() => onEdit(mistake)}>
                    Edit
                  </button>
                  <button className="ghost-button danger-button" onClick={() => onDelete(mistake)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MistakeTable;
