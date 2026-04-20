import { revisionStatusOptions, rootCauseOptions } from "../utils/analyzer";

function MistakeForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  suggestedRootCause,
  isSaving,
  isEditing,
  formAnchorRef,
}) {
  return (
    <section className="card" ref={formAnchorRef}>
      <div className="section-heading">
        <h2>{isEditing ? "Edit mistake" : "Add a wrong answer"}</h2>
        <p>
          Save what went wrong so the app can show your patterns and build a revision
          plan.
        </p>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <label className="field-group">
          <span>Question number</span>
          <input
            type="number"
            min="1"
            name="questionNumber"
            value={formData.questionNumber}
            onChange={onChange}
            placeholder="Example: 5"
            required
          />
        </label>

        <label className="field-group">
          <span>Topic</span>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={onChange}
            placeholder="Example: Trigonometry"
            required
          />
        </label>

        <label className="field-group field-span-2">
          <span>Question text</span>
          <textarea
            name="questionText"
            value={formData.questionText}
            onChange={onChange}
            placeholder="Paste the question or write a short version of it"
            rows="3"
            required
          />
        </label>

        <label className="field-group">
          <span>Correct answer</span>
          <input
            type="text"
            name="correctAnswer"
            value={formData.correctAnswer}
            onChange={onChange}
            placeholder="Write the correct answer"
            required
          />
        </label>

        <label className="field-group">
          <span>Your answer</span>
          <input
            type="text"
            name="studentAnswer"
            value={formData.studentAnswer}
            onChange={onChange}
            placeholder="Write your answer"
            required
          />
        </label>

        <label className="field-group field-span-2">
          <span>What went wrong?</span>
          <textarea
            name="studentNote"
            value={formData.studentNote}
            onChange={onChange}
            placeholder="Example: I forgot the formula and rushed the last step"
            rows="3"
            required
          />
        </label>

        <label className="field-group">
          <span>Root cause</span>
          <select name="rootCause" value={formData.rootCause} onChange={onChange}>
            <option value="">Use suggested category</option>
            {rootCauseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field-group">
          <span>Revision status</span>
          <select
            name="revisionStatus"
            value={formData.revisionStatus}
            onChange={onChange}
          >
            {revisionStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="info-banner field-span-2">
          Suggested root cause: <strong>{suggestedRootCause}</strong>
        </div>

        <div className="button-row field-span-2">
          <button className="primary-button" disabled={isSaving}>
            {isSaving ? "Saving..." : isEditing ? "Update mistake" : "Save mistake"}
          </button>

          {isEditing ? (
            <button className="secondary-button" type="button" onClick={onCancel}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default MistakeForm;
