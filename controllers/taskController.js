const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all active tasks for user
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user }).sort('order');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a task
// @route   POST /api/tasks
const addTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, subtasks, labels, reminderTime } = req.body;
    
    const tasksCount = await Task.countDocuments({ user: req.user });

    const task = await Task.create({
      user: req.user,
      title,
      description,
      priority,
      dueDate,
      reminderTime,
      labels: labels || [],
      subtasks: subtasks || [],
      order: tasksCount, // Add to bottom by default
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user, { $inc: { 'stats.totalTasks': 1 } });

    res.status(201).json(task);
  } catch (error) {
    console.error('ADD TASK ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const wasCompleted = task.completed;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Update completed stats if completion state changed
    if (!wasCompleted && updatedTask.completed) {
      await User.findByIdAndUpdate(req.user, { $inc: { 'stats.completedTasks': 1 } });
    } else if (wasCompleted && !updatedTask.completed) {
      await User.findByIdAndUpdate(req.user, { $inc: { 'stats.completedTasks': -1 } });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const wasCompleted = task.completed;
    await task.deleteOne();

    // Update user stats
    await User.findByIdAndUpdate(req.user, { 
      $inc: { 
        'stats.totalTasks': -1,
        'stats.completedTasks': wasCompleted ? -1 : 0
      } 
    });

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update tasks order (Drag & Drop)
// @route   PUT /api/tasks/reorder
const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body; // Expects an array of objects: { id, order }

    if (!tasks || tasks.length === 0) {
      return res.status(400).json({ message: 'No tasks provided' });
    }

    // Process all updates concurrently
    await Promise.all(
      tasks.map(async (t) => {
        await Task.findOneAndUpdate(
          { _id: t.id, user: req.user },
          { order: t.order }
        );
      })
    );

    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask, reorderTasks };
