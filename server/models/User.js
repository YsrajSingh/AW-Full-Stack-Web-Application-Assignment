const mongoose = require('mongoose');
const { validatePassword, isPasswordHash } = require('../utils/password.js');
const { randomUUID } = require("crypto");

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function () { return this.authMethod === 'email'; }, // Only required for email signup
    validate: { validator: isPasswordHash, message: 'Invalid password hash' },
  },
  authMethod: {
    type: String,
    required: true,
    enum: ['email', 'google'], // Store how the user authenticated (either email/password or Google)
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  refreshToken: {
    type: String,
    unique: true,
    index: true,
    default: () => randomUUID(),
  },
  passwordResetToken: {
    type: String,
    index: true
  },
  passwordResetExpires: {
    type: Date
  },
  googleId: {
    type: String,
    sparse: true, // Ensures that Google ID is only populated for Google-authenticated users
  }
}, {
  versionKey: false,
});

schema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model('User', schema);

module.exports = User;
