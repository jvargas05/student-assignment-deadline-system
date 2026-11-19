import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteAssignment, getAssignment, patchAssignment } from '../api/assignments.js';
import Badge from '../components/Badge.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { formatDateTime, getDueInfo } from '../utils/dates.js';

export default function AssignmentDetailPage() {
  const { id } = useParams(); // dynamic route: /assignments/:id
  const navigate = useNavigate();
  const location = useLocation();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [flash] = useState(location.state?.flash || '');

  // Clear the one-time success message from the history entry so it does not reappear on refresh
  useEffect(() => {
    if (location.state?.flash) navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    getAssignment(id)
      .then((data) => {
        if (!ignore) setAssignment(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  const handleToggle = async () => {
    setBusy(true);
    setActionError('');
    try {
      const status = assignment.status === 'Submitted' ? 'Pending' : 'Submitted';
      setAssignment(await patchAssignment(id, { status }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${assignment.title}"? This cannot be undone.`)) return;
    setBusy(true);
    setActionError('');
    try {
      await deleteAssignment(id);
      navigate('/assignments'); // go back to the list after deleting
    } catch (err) {
      setActionError(err.message);
      setBusy(false);
    }
  };

  if (loading) return <Loading text="Loading assignment..." />;
  if (error) {
    return (
      <ErrorMessage
        title="Could not load this assignment"
        message={error}
        onRetry={() => setReloadKey((k) => k + 1)}
        backTo={{ to: '/assignments', label: 'Back to assignments' }}
      />
    );
  }

  const due = getDueInfo(assignment);

  return (
    <article className="detail">
      <p className="breadcrumb">
        <Link to="/assignments">← All assignments</Link>
      </p>
      {flash && <p className="flash" role="status">{flash}</p>}

      <div className="detail-head">
        <h1>{assignment.title}</h1>
        <div className="badges">
          <Badge tone={assignment.status === 'Submitted' ? 'done' : 'neutral'}>{assignment.status}</Badge>
          <Badge tone={assignment.priority === 'High' ? 'overdue' : assignment.priority === 'Medium' ? 'today' : 'neutral'}>
            {assignment.priority} priority
          </Badge>
        </div>
      </div>

      <p className={`due-banner due-banner-${due.tone}`}>{due.label}</p>

      <dl className="detail-list">
        <div><dt>Course</dt><dd>{assignment.course}</dd></div>
        <div><dt>Category</dt><dd>{assignment.category}</dd></div>
        <div><dt>Due</dt><dd>{formatDateTime(assignment.dueDate)}</dd></div>
        <div><dt>Added</dt><dd>{formatDateTime(assignment.createdAt)}</dd></div>
        <div className="wide">
          <dt>Notes</dt>
          <dd>{assignment.description || <span className="muted">No notes added.</span>}</dd>
        </div>
      </dl>

      {actionError && <p className="form-error" role="alert">{actionError}</p>}

      <div className="btn-row">
        <button type="button" className="btn btn-primary" onClick={handleToggle} disabled={busy}>
          {assignment.status === 'Submitted' ? 'Undo submit' : 'Mark as submitted'}
        </button>
        <Link to={`/assignments/${assignment._id}/edit`} className="btn">Edit</Link>
        <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={busy}>
          Delete
        </button>
      </div>
    </article>
  );
}
