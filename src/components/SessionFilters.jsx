function SessionFilters({
  searchTerm,
  subjectFilter,
  subjects,
  onSearchChange,
  onSubjectChange,
}) {
  return (
    <section className="card">
      <div className="section-heading">
        <h2>Find a test quickly</h2>
        <p>Use the filters below to search by title or subject.</p>
      </div>

      <div className="form-grid">
        <label className="field-group">
          <span>Search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search by exam title"
          />
        </label>

        <label className="field-group">
          <span>Subject</span>
          <select value={subjectFilter} onChange={onSubjectChange}>
            <option value="">All subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

export default SessionFilters;
