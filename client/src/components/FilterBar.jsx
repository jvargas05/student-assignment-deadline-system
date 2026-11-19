import { STATUSES } from '../constants.js';

// Controlled inputs: the parent owns the filter state and passes it down.
export default function FilterBar({ filters, onChange }) {
  const update = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  return (
    <form className="filters" onSubmit={(e) => e.preventDefault()} role="search">
      <div className="field grow">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          name="search"
          type="search"
          placeholder="Title or course"
          value={filters.search}
          onChange={update}
        />
      </div>
      <div className="field">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={filters.status} onChange={update}>
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" name="sort" value={filters.sort} onChange={update}>
          <option value="dueDate">Earliest due</option>
          <option value="-dueDate">Latest due</option>
          <option value="newest">Newest added</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>
    </form>
  );
}
