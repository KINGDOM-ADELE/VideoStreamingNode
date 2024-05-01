import mongoose from 'mongoose';
import fs from 'fs';
import AutoLogFile from '../Utils/AutoLogFile.js';

const { Schema, model } = mongoose;

const videoAdsSchema = new Schema({
    title: { type: String, required: [true, 'please enter your full name'], trim: true },
    description: { type: String, unique: true, required: [true, 'Please enter email'], lowercase: true, trim: true },
    category : { type: String, required: [true, 'please enter video category'], trim: true },
    keywords : { type: String, required: [true, 'please enter video category'], trim: true },
    files: {
        type: [Object], // Assuming you want an array of objects
        required: true
      }
    "createdBy": {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Please complete the hidden field createdBy'],
        trim: true
    },
    releaseDate: { type: Date, default: Date.now, required: true, trim: true },
    created: { type: Date, default: Date.now, immutable: true, trim: true },
    updated: { type: Date, default: Date.now, trim: true, select: false },
});

// USING MONGOOSE MIDDLEWARE
// Post hook
videoAdsSchema.post('save', async function (doc, next) {
    const logFile = await AutoLogFile();
    const content = `A new Video document created with ${doc.userId} on ${doc.created}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
    next();
});

videoAdsSchema.pre(/^find/, async function (next) {
    // Note: this model will not serve anything that is not up to its release date
    // else remove this middleware
    this.find({ releaseDate: { $lte: Date.now() } });
    this.startTime = Date.now();
    next();
});

videoAdsSchema.post(/^find/, async function (docs, next) {
    this.endTime = Date.now();
    const logFile = await AutoLogFile();
    const content = `Query took  ${this.endTime - this.startTime} in milliseconds to fetch the documents, on ${new Date}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
    next();
});

// AGGREGATION MIDDLEWARES
videoAdsSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } });
    next();
});

export default model('videoads', videoAdsSchema);