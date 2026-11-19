import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAssignment } from '../api/assignments.js';
import AssignmentForm from '../components/AssignmentForm.jsx';
import { tomorrowEndOfDay } from '../utils/dates.js';

export default function NewAssignmentPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverDetails, setServerDetails] = useState([]);

  const initialValues = {
    title: '',
    course: '',
    description: '',
    category: 'Assignment',
    dueDate: tomorrowEndOfDay(),
    priority: 'Medium',
    status: 'Pending',
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setServerError('');
    setServerDetails([]);
    try {
      const created = await createAssignment(payload);
      // Redirect to the new record's detail page after a successful submit
      navigate(`/assignments/${created._id}`, { state: { flash: 'Assignment added successfully.' } });
    } catch (err) {
      setServerError(err.message);
      setServerDetails(err.details || []);
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <h1>Add assignment</h1>
      </div>
      <AssignmentForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Add assignment"
        submitting={submitting}
        serverError={serverError}
        serverDetails={serverDetails}
      />
    </>
  );
}
