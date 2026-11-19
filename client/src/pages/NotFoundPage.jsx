import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="state-box">
      <p className="big-code" aria-hidden="true">404</p>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist or was moved.</p>
      <div className="btn-row center">
        <Link to="/" className="btn btn-primary">Go to dashboard</Link>
        <Link to="/assignments" className="btn">View assignments</Link>
      </div>
    </div>
  );
}
