import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAssignments, patchAssignment, deleteAssignment } from '../api/assignments.js';
import AssignmentCard from '../components/AssignmentCard.jsx';
import StatsSummary from '../components/StatsSummary.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function DashboardPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Load data from the Express API
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    getAssignments({ sort: 'dueDate' })
      .then((data) => {
        if (!ignore) setAssignments(data);
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
  }, [reloadKey]);

  const handleToggle = async (assignment) => {
    setBusyId(assignment._id);
    setActionError('');
    try {
      const status = assignment.status === 'Submitted' ? 'Pending' : 'Submitted';
      const updated = await patchAssignment(assignment._id, { status });
      setAssignments((list) => list.map((a) => (a._id === updated._id ? updated : a)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (assignment) => {
    if (!window.confirm(`Delete "${assignment.title}"?`)) return;
    setBusyId(assignment._id);
    setActionError('');
    try {
      await deleteAssignment(assignment._id);
      setAssignments((list) => list.filter((a) => a._id !== assignment._id));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loading text="Loading your deadlines..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />;

  if (assignments.length === 0) {
    return (
      <EmptyState
        title="No assignments yet"
        message="Add your first assignment or exam to start tracking deadlines."
        action={{ to: '/assignments/new', label: 'Add assignment' }}
      />
    );
  }

  const upcoming = assignments.filter((a) => a.status !== 'Submitted').slice(0, 3);

  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
        <Link to="/assignments/new" className="btn btn-primary">+ Add assignment</Link>
      </div>

      <StatsSummary assignments={assignments} />

      <h2 className="section-title">Next up</h2>
      {actionError && <p className="form-error" role="alert">{actionError}</p>}
      {upcoming.length === 0 ? (
        <p className="muted">All caught up. Nothing left to submit!</p>
      ) : (
        <ul className="card-list">
          {upcoming.map((a) => (
            <AssignmentCard
              key={a._id}
              assignment={a}
              onToggleSubmitted={handleToggle}
              onDelete={handleDelete}
              busy={busyId === a._id}
            />
          ))}
        </ul>
      )}
      <p className="more-link">
        <Link to="/assignments">View all assignments →</Link>
      </p>
    </>
  );
}
