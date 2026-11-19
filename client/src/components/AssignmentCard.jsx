import { Link } from 'react-router-dom';
import Badge from './Badge.jsx';
import { formatDateTime, getDueInfo } from '../utils/dates.js';

const priorityTone = { High: 'overdue', Medium: 'today', Low: 'neutral' };

export default function AssignmentCard({ assignment, onToggleSubmitted, busy = false }) {
  const due = getDueInfo(assignment);
  const isSubmitted = assignment.status === 'Submitted';

  return (
    <li className={`card card-${due.tone}`}>
      <div className="card-main">
        <Link to={`/assignments/${assignment._id}`} className="card-title">
          {assignment.title}
        </Link>
        <p className="card-meta">
          {assignment.course} · {assignment.category}
        </p>
        <p className="card-due">
          <strong className={`due-${due.tone}`}>{due.label}</strong>
          <span className="muted"> · {formatDateTime(assignment.dueDate)}</span>
        </p>
        <div className="badges">
          <Badge tone={priorityTone[assignment.priority]}>{assignment.priority} priority</Badge>
          <Badge tone={isSubmitted ? 'done' : 'neutral'}>{assignment.status}</Badge>
        </div>
      </div>
      {onToggleSubmitted && (
        <button
          type="button"
          className="btn btn-small"
          disabled={busy}
          onClick={() => onToggleSubmitted(assignment)}
        >
          {isSubmitted ? 'Undo submit' : 'Mark submitted'}
        </button>
      )}
    </li>
  );
}
