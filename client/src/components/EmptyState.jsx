import { Link } from 'react-router-dom';

export default function EmptyState({ title, message, action }) {
  return (
    <div className="state-box">
      <h2>{title}</h2>
      <p>{message}</p>
      {action && (
        <div className="btn-row center">
          <Link to={action.to} className="btn btn-primary">
            {action.label}
          </Link>
        </div>
      )}
    </div>
  );
}
