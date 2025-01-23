const { randomUUID } = require('crypto');
const crypto = require('crypto');

const User = require('../models/User.js');
const { generatePasswordHash, validatePassword } = require('../utils/password.js');

class UserService {
  static async list() {
    try {
      return User.find();
    } catch (err) {
      throw new Error(`Database error while listing users: ${err}`);
    }
  }

  static async get(id) {
    try {
      return User.findOne({ _id: id }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their ID: ${err}`);
    }
  }

  static async getByEmail(email) {
    try {
      return User.findOne({ email }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their email: ${err}`);
    }
  }

  static async update(id, data) {
    try {
      return User.findOneAndUpdate({ _id: id }, data, { new: true, upsert: false });
    } catch (err) {
      throw new Error(`Database error while updating user ${id}: ${err}`);
    }
  }

  static async delete(id) {
    try {
      const result = await User.deleteOne({ _id: id }).exec();
      return (result.deletedCount === 1);
    } catch (err) {
      throw new Error(`Database error while deleting user ${id}: ${err}`);
    }
  }

  static async authenticateWithPassword(email, password) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    try {
      const user = await User.findOne({email}).exec();
      if (!user) return null;

      const passwordValid = await validatePassword(password, user.password);
      if (!passwordValid) return null;

      user.lastLoginAt = Date.now();
      const updatedUser = await user.save();
      return updatedUser;
    } catch (err) {
      throw new Error(`Database error while authenticating user ${email} with password: ${err}`);
    }
  }

  static async create({ email, password, name = '' }) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    const existingUser = await UserService.getByEmail(email);
    if (existingUser) throw new Error('User with this email already exists');

    const hash = await generatePasswordHash(password);

    try {
      const user = new User({
        email,
        password: hash,
        name,
      });

      await user.save();
      return user;
    } catch (err) {
      throw new Error(`Database error while creating new user: ${err}`);
    }
  }

  static async setPassword(user, password) {
    if (!password) throw new Error('Password is required');
    user.password = await generatePasswordHash(password); // eslint-disable-line

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      throw new Error(`Database error while setting user password: ${err}`);
    }
  }

  static async createPasswordResetToken(email) {
    try {
      const user = await this.getByEmail(email);
      if (!user) {
        throw new Error('No user found with this email address');
      }

      console.log(`Generating password reset token for user: ${email}`);

      const resetToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

      await user.save();
      console.log(`Password reset token generated successfully for user: ${email}`);
      
      return resetToken;
    } catch (err) {
      console.error('Error creating password reset token:', err);
      throw new Error(`Error creating password reset token: ${err.stack}`);
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      console.log('Attempting to reset password with token');
      
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });

      if (!user) {
        console.error('Invalid or expired password reset token');
        throw new Error('Token is invalid or has expired');
      }

      console.log(`Resetting password for user: ${user.email}`);
      
      await this.setPassword(user, newPassword);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      console.log(`Password reset successful for user: ${user.email}`);
      
      return user;
    } catch (err) {
      console.error('Error resetting password:', err);
      throw new Error(`Error resetting password: ${err.stack}`);
    }
  }
}

module.exports = UserService;