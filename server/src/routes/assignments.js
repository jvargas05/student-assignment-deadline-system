import { Router } from 'express';
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignmentController.js';

// Express 4 does not catch rejected promises by itself, so wrap every async handler.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

router.get('/', wrap(getAssignments));
router.post('/', wrap(createAssignment));
router.get('/:id', wrap(getAssignmentById));
router.put('/:id', wrap(updateAssignment));
router.patch('/:id', wrap(updateAssignment));
router.delete('/:id', wrap(deleteAssignment));

export default router;
