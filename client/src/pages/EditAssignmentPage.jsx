import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAssignment, updateAssignment } from '../api/assignments.js';
import AssignmentForm from '../components/AssignmentForm.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { toInputValue } from '../utils/dates.js';

export default function EditAssignmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverDetails, setServerDetails] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

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

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setServerError('');
    setServerDetails([]);
    try {
      await updateAssignment(id, payload);
      navigate(`/assignments/${id}`, { state: { flash: 'Changes saved.' } });
    } catch (err) {
      setServerError(err.message);
      setServerDetails(err.details || []);
      setSubmitting(false);
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

  const initialValues = {
    title: assignment.title,
    course: assignment.course,
    description: assignment.description || '',
    category: assignment.category,
    dueDate: toInputValue(assignment.dueDate),
    priority: assignment.priority,
    status: assignment.status,
  };

  return (
    <>
      <div className="page-head">
        <h1>Edit assignment</h1>
      </div>
      <AssignmentForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        submitting={submitting}
        serverError={serverError}
        serverDetails={serverDetails}
        cancelTo={`/assignments/${id}`}
      />
    </>
  );
}
