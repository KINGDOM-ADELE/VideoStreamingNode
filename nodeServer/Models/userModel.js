import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import fs from 'fs';
import AutoLogFile from '../Utils/AutoLogFile.js';

const { Schema, model } = mongoose;

const DATE = new Date();
const YY = DATE.getFullYear();
const mm = String(DATE).split(' ')[1]; // to get the second element of the generated array
const thisMonth = `${mm}/${YY}`;

// Function to generate a random string within a specified length range
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
};


// Function to generate a random encryption key and IV
const generateEncryptionKeyAndIV = async () => {
    // Generate random encryption key and IV
    const iv = generateRandomString(16); // 128-bit IV
    console.log('iv', iv)
    const filekey = generateRandomString(32); // 256-bit key
    console.log('filekey', filekey)
    return { filekey, iv };
};

// Define the user schema
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
    },
    phone: { type: String, required: [true, 'Please enter phone'], trim: true },
    gender: { type: String, enum: ['Male', 'Female'], default: 'Male' },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
    },
    country: { type: String, required: [true, 'Please enter a valid country'], trim: true },
    role: { type: [String], enum: ['user', 'admin', 'owner'], default: ['user'] },
    filekey: {
        filekey: { type: String, immutable: true },
        iv: { type: String, immutable: true }
    },
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

// Mongoose middleware for pre-find operations
userSchema.pre(/^find/, async function (next) {
    this.startTime = Date.now();
    next();
});

// Mongoose pre-save hook to generate filePass passkey and iv
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const { filekey, iv } = await generateEncryptionKeyAndIV();
    this.filekey = { filekey, iv };
    next();
});

// Mongoose pre-save hook to hash the password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Mongoose instance method to compare passwords
userSchema.methods.comparePasswordInDb = async function (password, passwordDb) {
    return await bcrypt.compare(password, passwordDb);
};

// Mongoose instance method to check if the user has changed password since the token was issued
userSchema.methods.isPasswordChanged = async function (jwtTimeStamp) {
    if (this.passwordChangedAt) {
        const passwordChangedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // in base 10
        return jwtTimeStamp < passwordChangedTimeStamp; // password has been changed
    }
    return false;
};

// Mongoose instance method to check if the user has logged out from the server since the token was issued
userSchema.methods.isLoggedOut = async function (jwtTimeStamp) {
    if (this.loggedOutAllAt) {
        const LoggedOutAllTimeStamp = parseInt(this.loggedOutAllAt.getTime() / 1000, 10); // in base 10
        return jwtTimeStamp < LoggedOutAllTimeStamp; // password has been changed
    }
    return false;
};

// Mongoose instance method to create a reset password token
userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExp = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

// Mongoose instance method to create an email verification token
userSchema.methods.createEmailVerificationToken = function () {
    const verifyToken = crypto.randomBytes(25).toString('hex') + ' ' + this.email;
    this.emailVerificationToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
    this.emailVerificationTokenExp = Date.now() + 10 * 60 * 1000;
    return verifyToken;
};

// Mongoose post-save hook
userSchema.post('save', async function (doc, next) {
    const logFile = await AutoLogFile();
    const content = `A new User document created with ${doc.userId} on ${doc.created}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
    next();
});

// Mongoose post-find hook
userSchema.post(/^find/, async function (docs, next) {
    this.endTime = Date.now();
    const logFile = await AutoLogFile();
    const content = `Action took  ${this.endTime - this.startTime} in milliseconds to create the documents, on ${new Date()}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
    next();
});

// Create the User model
const User = model('User', userSchema);

// Export the User model
export default User;
