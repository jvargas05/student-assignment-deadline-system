import Assignment, { STATUSES } from '../models/Assignment.js';

const ID_PATTERN = /^[0-9a-fA-F]{24}$/;
const EDITABLE_FIELDS = ['title', 'course', 'description', 'category', 'dueDate', 'priority', 'status'];

const SORTS = {
  dueDate: { dueDate: 1 },
  '-dueDate': { dueDate: -1 },
  newest: { createdAt: -1 },
  title: { title: 1 },
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Only allow known fields from the request body (prevents unwanted fields being saved)
function pickFields(body = {}) {
  const data = {};
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

const badId = (res) => res.status(400).json({ message: 'Invalid assignment ID' });
const missing = (res) => res.status(404).json({ message: 'Assignment not found' });

// GET /api/assignments?status=&search=&sort=
export async function getAssignments(req, res) {
  const { status, search, sort } = req.query;
  const filter = {};

  if (status) {
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status filter must be one of: ${STATUSES.join(', ')}` });
    }
    filter.status = status;
  }

  if (search && typeof search === 'string' && search.trim()) {
    const pattern = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ title: pattern }, { course: pattern }];
  }

  const assignments = await Assignment.find(filter).sort(SORTS[sort] || SORTS.dueDate);
  res.status(200).json(assignments);
}

// GET /api/assignments/:id
export async function getAssignmentById(req, res) {
  const { id } = req.params;
  if (!ID_PATTERN.test(id)) return badId(res);

  const assignment = await Assignment.findById(id);
  if (!assignment) return missing(res);
  res.status(200).json(assignment);
}

// POST /api/assignments
export async function createAssignment(req, res) {
  const assignment = await Assignment.create(pickFields(req.body));
  res.status(201).json(assignment);
}

// PUT or PATCH /api/assignments/:id
// Loads the record, applies the changes, then save() so ALL schema validation runs.
export async function updateAssignment(req, res) {
  const { id } = req.params;
  if (!ID_PATTERN.test(id)) return badId(res);

  const assignment = await Assignment.findById(id);
  if (!assignment) return missing(res);

  assignment.set(pickFields(req.body));
  await assignment.save();
  res.status(200).json(assignment);
}

// DELETE /api/assignments/:id
export async function deleteAssignment(req, res) {
  const { id } = req.params;
  if (!ID_PATTERN.test(id)) return badId(res);

  const deleted = await Assignment.findByIdAndDelete(id);
  if (!deleted) return missing(res);
  res.status(200).json({ message: 'Assignment deleted', id });
}
