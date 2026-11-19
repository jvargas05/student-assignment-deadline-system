import mongoose from 'mongoose';

export const STATUSES = ['Pending', 'In Progress', 'Submitted'];
export const PRIORITIES = ['Low', 'Medium', 'High'];
export const CATEGORIES = ['Assignment', 'Quiz', 'Project', 'Exam', 'Lab', 'Other'];

const oneOf = (label, values) => ({
  values,
  message: `${label} must be one of: ${values.join(', ')}`,
});

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title must be at most 120 characters'],
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
      maxlength: [60, 'Course must be at most 60 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must be at most 1000 characters'],
      default: '',
    },
    category: {
      type: String,
      enum: oneOf('Category', CATEGORIES),
      default: 'Assignment',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    priority: {
      type: String,
      enum: oneOf('Priority', PRIORITIES),
      default: 'Medium',
    },
    status: {
      type: String,
      enum: oneOf('Status', STATUSES),
      default: 'Pending',
    },
  },
  { timestamps: true }
);

assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ status: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
