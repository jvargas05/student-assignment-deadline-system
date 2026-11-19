import { getDueInfo } from '../utils/dates.js';

// Receives the full list through props and shows simple counts.
export default function StatsSummary({ assignments }) {
  const now = new Date();
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const open = assignments.filter((a) => a.status !== 'Submitted');
  const overdue = open.filter((a) => getDueInfo(a, now).tone === 'overdue').length;
  const dueThisWeek = open.filter((a) => {
    const due = new Date(a.dueDate);
    return due >= now && due <= weekAhead;
  }).length;
  const submitted = assignments.length - open.length;

  const stats = [
    { label: 'Open', value: open.length, tone: 'neutral' },
    { label: 'Overdue', value: overdue, tone: 'overdue' },
    { label: 'Due in 7 days', value: dueThisWeek, tone: 'soon' },
    { label: 'Submitted', value: submitted, tone: 'done' },
  ];

  return (
    <section className="stats" aria-label="Summary">
      {stats.map((s) => (
        <div key={s.label} className={`stat stat-${s.tone}`}>
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </section>
  );
}
