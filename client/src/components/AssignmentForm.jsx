import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PRIORITIES, STATUSES } from '../constants.js';

// Reusable controlled form for both "add" and "edit".
// Props: initialValues, onSubmit(payload), submitLabel, submitting, serverError, serverDetails, cancelTo
export default function AssignmentForm({
  initialValues,
  onSubmit,
  submitLabel = 'Save',
  submitting = false,
  serverError = '',
  serverDetails = [],
  cancelTo = '/assignments',
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const found = {};
    const title = values.title.trim();
    if (!title) found.title = 'Title is required';
    else if (title.length < 3) found.title = 'Title must be at least 3 characters';
    else if (title.length > 120) found.title = 'Title must be at most 120 characters';

    if (!values.course.trim()) found.course = 'Course is required';
    if (!values.dueDate) found.dueDate = 'Due date and time are required';
    if (values.description.length > 1000) found.description = 'Description must be at most 1000 characters';
    return found;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      ...values,
      title: values.title.trim(),
      course: values.course.trim(),
      description: values.description.trim(),
      dueDate: new Date(values.dueDate).toISOString(),
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="form-error" role="alert">
          <strong>{serverError}</strong>
          {serverDetails.length > 0 && (
            <ul>
              {serverDetails.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="field">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
          placeholder="e.g. React Router Activity"
        />
        {errors.title && <p id="title-error" className="field-error">{errors.title}</p>}
      </div>

      <div className="field">
        <label htmlFor="course">Course *</label>
        <input
          id="course"
          name="course"
          value={values.course}
          onChange={handleChange}
          aria-invalid={Boolean(errors.course)}
          aria-describedby={errors.course ? 'course-error' : undefined}
          placeholder="e.g. DCIT 26"
        />
        {errors.course && <p id="course-error" className="field-error">{errors.course}</p>}
      </div>

      <div className="field">
        <label htmlFor="dueDate">Due date and time *</label>
        <input
          id="dueDate"
          name="dueDate"
          type="datetime-local"
          value={values.dueDate}
          onChange={handleChange}
          aria-invalid={Boolean(errors.dueDate)}
          aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
        />
        {errors.dueDate && <p id="dueDate-error" className="field-error">{errors.dueDate}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={values.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={values.priority} onChange={handleChange}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="formStatus">Status</label>
          <select id="formStatus" name="status" value={values.status} onChange={handleChange}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Notes / description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={values.description}
          onChange={handleChange}
          aria-invalid={Boolean(errors.description)}
          placeholder="Requirements, submission link, reminders..."
        />
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      <div className="btn-row">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <Link to={cancelTo} className="btn">
          Cancel
        </Link>
      </div>
    </form>
  );
}
