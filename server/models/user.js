'use strict';
import bcrypt from 'bcryptjs';
import {
  encryptToken,
  decryptToken,
  getTimeDifference
} from '../helpers/crypto'
import {
  sendEmail
} from '../email/email';
import {
  resetConstants
} from '../email/constants/passwordResetConstants';
import {
  expiryTime
} from '../config/config';
import {
  hashPassword
} from '../helpers/password';
import {
  verifyConstants
} from '../email/constants/verificationConstants';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      allowNull: false,
      autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    resetToken: DataTypes.STRING,
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    password: DataTypes.STRING,
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    //hash password before creating Instance
    hooks: {
      beforeCreate: (user) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
        return user.password
      }
    }
  });
  User.associate = db => {};

  User.prototype.generateResetToken = async function () {
    this.resetToken = encryptToken();
    this.save();
    await this.reload();
    return this.resetToken;
  }
  User.prototype.sendPasswordResetEmail = async function (url) {
    const {
      firstName,
      lastName,
      email
    } = this;
    const resetToken = await this.generateResetToken();
    const resetUrl = `${url}/${resetToken}`;
    await sendEmail(firstName, lastName, email, 'RESET EMAIL', resetUrl, resetConstants)
  }
  User.prototype.resetPassword = async function (password, token) {
    if (getTimeDifference(decryptToken(token)) > Number(expiryTime)) {
      throw new Error('The Link has expired')
    }
    this.password = hashPassword(password);
    this.resetToken = '';
    this.save();
    await this.reload()
  }
  User.prototype.sendVerificationEmail = async function (url) {
    const {
      firstName,
      lastName,
      email
    } = this;
    await sendEmail(firstName, lastName, email, 'VERIFICATION EMAIL', url, verifyConstants);
  }
  User.prototype.activateAccount = async function () {
    this.isVerified = true;
    this.save();
    await this.reload();
    return this;
  }
  User.prototype.updateProfile = async function (user) {
    const {
      firstName,
      lastName,
    } = user;
    this.firstName = firstName || this.firstName,
    this.lastName = lastName || this.lastName
    this.save()
    await this.reload();
    return this;
  }
  return User;
};