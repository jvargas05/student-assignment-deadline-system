import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAssignments, patchAssignment } from '../api/assignments.js';
import AssignmentCard from '../components/AssignmentCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function AssignmentsPage() {
  const [filters, setFilters] = useState({ search: '', status: '', sort: 'dueDate' });
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Reload from the API whenever the filters change (small delay while typing)
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    const timer = setTimeout(() => {
      getAssignments(filters)
        .then((data) => {
          if (!ignore) setAssignments(data);
        })
        .catch((err) => {
          if (!ignore) setError(err.message);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, 250);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [filters, reloadKey]);

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

  const hasFilters = Boolean(filters.search || filters.status);

  let content;
  if (loading) {
    content = <Loading text="Loading assignments..." />;
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />;
  } else if (assignments.length === 0) {
    content = hasFilters ? (
      <EmptyState
        title="No matching assignments"
        message="Try a different search or clear the status filter."
      />
    ) : (
      <EmptyState
        title="No assignments yet"
        message="Add your first assignment or exam to start tracking deadlines."
        action={{ to: '/assignments/new', label: 'Add assignment' }}
      />
    );
  } else {
    content = (
      <ul className="card-list">
        {assignments.map((a) => (
          <AssignmentCard
            key={a._id}
            assignment={a}
            onToggleSubmitted={handleToggle}
            busy={busyId === a._id}
          />
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className="page-head">
        <h1>All assignments</h1>
        <Link to="/assignments/new" className="btn btn-primary">+ Add assignment</Link>
      </div>
      <FilterBar filters={filters} onChange={setFilters} />
      {actionError && <p className="form-error" role="alert">{actionError}</p>}
      {content}
    </>
  );
}
