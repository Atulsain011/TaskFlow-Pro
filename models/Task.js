const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
  },
  reminderTime: {
    type: Date,
  },
  labels: {
    type: [String],
    default: [],
  },
  subtasks: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  order: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
