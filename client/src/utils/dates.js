export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const pad = (n) => String(n).padStart(2, '0');

// Date -> value for <input type="datetime-local"> (local time, no timezone)
export function toInputValue(value) {
  const d = new Date(value);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Default due date for the "add" form: tomorrow at 11:59 PM
export function tomorrowEndOfDay() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(23, 59, 0, 0);
  return toInputValue(d);
}

function distance(ms) {
  const minutes = Math.round(Math.abs(ms) / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'}`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
}

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Works out how urgent an assignment is.
// tone: 'done' | 'overdue' | 'today' | 'soon' | 'later'
export function getDueInfo(assignment, now = new Date()) {
  if (assignment.status === 'Submitted') return { label: 'Submitted', tone: 'done' };

  const due = new Date(assignment.dueDate);
  const diff = due - now;

  if (diff < 0) return { label: `Overdue by ${distance(diff)}`, tone: 'overdue' };
  if (sameDay(due, now)) return { label: `Due today (in ${distance(diff)})`, tone: 'today' };
  if (diff <= 3 * 24 * 60 * 60 * 1000) return { label: `Due in ${distance(diff)}`, tone: 'soon' };
  return { label: `Due in ${distance(diff)}`, tone: 'later' };
}
