const crypto = require('crypto');
const User = require('../models/User');
const { generatePasswordHash, validatePassword } = require('../utils/password');

class UserService {
  static async list() {
    try {
      return await User.find();
    } catch (err) {
      throw new Error(`Database error while listing users: ${err}`);
    }
  }

  static async get(id) {
    try {
      return await User.findOne({ _id: id }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their ID: ${err}`);
    }
  }

  static async getByEmail(email) {
    try {
      return await User.findOne({ email }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by email: ${err}`);
    }
  }

  static async update(id, data) {
    try {
      return await User.findOneAndUpdate({ _id: id }, data, { new: true, upsert: false });
    } catch (err) {
      throw new Error(`Database error while updating user ${id}: ${err}`);
    }
  }

  static async delete(id) {
    try {
      const result = await User.deleteOne({ _id: id }).exec();
      return result.deletedCount === 1;
    } catch (err) {
      throw new Error(`Database error while deleting user ${id}: ${err}`);
    }
  }

  static async authenticateWithPassword(email, password) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    try {
      const user = await User.findOne({ email }).exec();
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

  static async create({ email, password, name = '', authMethod }) {
    if (!email) throw new Error('Email is required');
    if (!password && authMethod === 'email') throw new Error('Password is required for email registration');

    const existingUser = await UserService.getByEmail(email);
    if (existingUser) {
      if (existingUser.authMethod !== authMethod) {
        throw new Error(`This email is already registered with ${existingUser.authMethod}. Please use ${existingUser.authMethod} login.`);
      }
      throw new Error('User with this email already exists');
    }

    const hash = authMethod === 'email' ? await generatePasswordHash(password) : undefined;

    try {
      const user = new User({
        email,
        password: hash,
        name,
        authMethod,
      });

      await user.save();
      return user;
    } catch (err) {
      throw new Error(`Database error while creating new user: ${err}`);
    }
  }

  static async setPassword(user, password) {
    if (!password) throw new Error('Password is required');
    user.password = await generatePasswordHash(password);

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

      const resetToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      user.passwordResetExpires = Date.now() + 30 * 60 * 1000;

      await user.save();
      return resetToken;
    } catch (err) {
      throw new Error(`Error creating password reset token: ${err}`);
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new Error('Token is invalid or has expired');
      }

      await this.setPassword(user, newPassword);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return user;
    } catch (err) {
      throw new Error(`Error resetting password: ${err}`);
    }
  }
}

module.exports = UserService;
