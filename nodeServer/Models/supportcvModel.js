import mongoose from 'mongoose';
import fs from 'fs';
import AutoLogFile from '../Utils/AutoLogFile.js';

const { Schema, model } = mongoose;

const supportcvSchema = new Schema({
    name: { type: String, required: [true, 'please enter your full name'], trim: true },
    email: { type: String, unique: true, required: [true, 'Please enter email'], lowercase: true, trim: true },
    phone: { type: String, required: [true, 'Please enter phone'], trim: true },
    files: [Object],
    releaseDate: { type: Date, default: Date.now, required: true, trim: true },
    created: { type: Date, default: Date.now, immutable: true, trim: true },
    updated: { type: Date, default: Date.now, trim: true, select: false },
});

// USING MONGOOSE MIDDLEWARE
// Post hook
supportcvSchema.post('save', async function (doc, next) {
    const logFile = await AutoLogFile();
    const content = `A new support document with issueCode ${doc.issueCode} created by ${doc.createdBy} on ${doc.created}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
    next();
});

supportcvSchema.pre(/^find/, async function (next) {
    // Note: this model will not serve anything that is not up to its release date
    // else remove this middleware
    this.find({ releaseDate: { $lte: Date.now() } });
    this.startTime = Date.now();
    next();
});

supportcvSchema.post(/^find/, async function (docs, next) {
    this.endTime = Date.now();
    const logFile = await AutoLogFile();
    const content = `Query took  ${this.endTime - this.startTime} in milliseconds to fetch the documents, on ${new Date}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
    next();
});

// AGGREGATION MIDDLEWARES
supportcvSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } });
    next();
});

export default model('supportcv', supportcvSchema);