import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import crypto from 'crypto';
import fs from 'fs';
import AutoLogFile from '../Utils/AutoLogFile.js';

const { Schema, model } = mongoose;

const DATE = new Date();
const YY = DATE.getFullYear();
const mm = String(DATE).split(' ')[1]; // to get the second element of the generated array
const thisMonth = `${mm}/${YY}`;

const userSchema = new Schema({
    firstName: { type: String, required: [true, 'Please enter your first name'], trim: true },
    middleName: { type: String, required: [true, 'Please enter your middle name'], trim: true },
    lastName: { type: String, required: [true, 'please enter your last name'], trim: true },
    profileImg: Object,
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter email'],
        lowercase: true,
        trim: true,
        // validate: [validator.isEmail, 'please enter a valid email']
    },
    phone: { type: String, required: [true, 'Please enter phone'], trim: true },
    gender: { type: String, enum: ['Male', 'Female'], default: 'Male' },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [8, 'password must be at least 8 characters'],
        select: false,
    },
    country: { type: String, required: [true, 'Please enter a valid country'], trim: true },

    
    // confirmPassword: {
    //     type: String,
    //     required: [true, 'Please enter value for confirmPassword'],
    //     // validate: {
    //     //     validator: function(val){ return val == this.password },
    //     //     message: `Password and confirmPassword does not match! `
    //     // }
    // },


    // role: { type: String, enum: ['user', 'admin', 'owner'], default: 'user' },
    role: { type: [String], enum: ['user', 'admin', 'owner'], default: ['user'] },

    approved: { type: Boolean, required: true, default: false },
    failedLogginAttempts: { type: Number, default: 0, trim: true },
    lastAttemptTime: { type: Date, default: Date.now, trim: true },
    status: { type: String, enum: ['none', 'alumni', 'student', 'deffered'], default: 'none' },
    emailVerified: { type: Boolean, required: true, default: false, immutable: true, trim: true },
    passwordResetToken: String,
    passwordChangedAt: { type: Date, default: Date.now, trim: true },
    loggedOutAllAt: { type: Date, default: Date.now, trim: true },
    month: { type: String, default: thisMonth, immutable: true, trim: true },
    passwordResetTokenExp: Date,
    emailVerificationToken: String,
    emailVerificationTokenExp: Date,
    created: { type: Date, default: Date.now, immutable: true, trim: true, select: false },
    updated: { type: Date, default: Date.now, trim: true, select: false },
});

// USING MONGOOSE MIDDLEWARE
userSchema.pre(/^find/, async function (next) {
    this.startTime = Date.now();
    next();
});

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 12);
//     this.confirmPassword = undefined; // removes confirmPassword from the database
//     next();
// });

// creating a user instance method that compares password
userSchema.methods.comparePasswordInDb = async function (password, passwordDb) {
    return await bcrypt.compare(password, passwordDb);
};

// check if the user has changed password since the token was issued
userSchema.methods.isPasswordChanged = async function (jwtTimeStamp) {
    if (this.passwordChangedAt) {
        const passwordChangedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // in base 10
        return jwtTimeStamp < passwordChangedTimeStamp; // password has been changed
    }
    return false;
};

// check if the user has logged out from the server since the token was issued
userSchema.methods.isLoggedOut = async function (jwtTimeStamp) {
    if (this.loggedOutAllAt) {
        const LoggedOutAllTimeStamp = parseInt(this.loggedOutAllAt.getTime() / 1000, 10); // in base 10
        return jwtTimeStamp < LoggedOutAllTimeStamp; // password has been changed
    }
    return false;
};

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // prepares the user document with the encrypted password reset token
    this.passwordResetTokenExp = Date.now() + 10 * 60 * 1000; // prepares the user document with the encrypted password reset token expiration time
    // we will save this info in the authController
    return resetToken; // returns the plain resetToken to the authController to be sent to the user
};

userSchema.methods.createEmailVerificationToken = function () {
    const verifyToken = crypto.randomBytes(25).toString('hex') + ' ' + this.email;
    this.emailVerificationToken = crypto.createHash('sha256').update(verifyToken).digest('hex'); // prepares the user document with the encrypted password reset token
    this.emailVerificationTokenExp = Date.now() + 10 * 60 * 1000; // prepares the user document with the encrypted password reset token expiration time
    // we will save this info in the authController
    return verifyToken; // returns the plain verifyToken to the authController to be sent to the user
};

// post hook
userSchema.post('save', async function (doc, next) {
    const logFile = await AutoLogFile();
    const content = `A new User document created with ${doc.userId} on ${doc.created}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
    next();
});

userSchema.post(/^find/, async function (docs, next) {
    // this here points to the current query
    this.endTime = Date.now();
    const logFile = await AutoLogFile();
    const content = `Action took  ${this.endTime - this.startTime} in milliseconds to create the documents, on ${new Date()}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
    next();
});

const User = model('User', userSchema);
export default User;
