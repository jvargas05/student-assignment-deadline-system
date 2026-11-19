import { Link } from 'react-router-dom';

export default function ErrorMessage({ title = 'Something went wrong', message, onRetry, backTo }) {
  return (
    <div className="state-box state-error" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="btn-row center">
        {onRetry && (
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            Try again
          </button>
        )}
        {backTo && (
          <Link to={backTo.to} className="btn">
            {backTo.label}
          </Link>
        )}
      </div>
    </div>
  );
}
