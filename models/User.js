const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferences: {
    theme: {
      type: String,
      default: 'neon', // neon, dark, light
    },
    language: {
      type: String,
      default: 'en', // en, hi, es
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'business'],
      default: 'free',
    },
    trialStartedAt: {
      type: Date,
      default: Date.now,
    },
    trialExpiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000), // 7 days later
    }
  },
  stats: {
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
