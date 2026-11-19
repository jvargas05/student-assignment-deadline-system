import { Link } from 'react-router-dom';
import Badge from './Badge.jsx';
import { formatDateTime, getDueInfo } from '../utils/dates.js';

const priorityTone = { High: 'overdue', Medium: 'today', Low: 'neutral' };

export default function AssignmentCard({
  assignment,
  onToggleSubmitted,
  onDelete,
  busy = false,
}) {
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

      {(onToggleSubmitted || onDelete) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

          {onDelete && (
            <button
              type="button"
              className="btn btn-small"
              disabled={busy}
              onClick={() => onDelete(assignment)}
              title="Delete assignment"
              aria-label="Delete assignment"
              style={{
                padding: '6px 9px',
                borderColor: '#b91c1c',
                color: '#991b1b',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                xmlns="http://w3.org"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          )}
        </div>
      )}
    </li>
  );
}
