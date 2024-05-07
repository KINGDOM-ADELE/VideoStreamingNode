import mongoose from 'mongoose';
import fs from 'fs';
import AutoLogFile from '../Utils/AutoLogFile.js';

const { Schema, model } = mongoose;

const videosSchema = new Schema({
    title: { type: String, required: [true, 'please enter video title'], trim: true },
    description: { type: String, required: [true, 'Please enter videodescription'], lowercase: true, trim: true },
    category : { type: String, required: [true, 'please enter video category'], trim: true },
    keywords : { type: String, required: [true, 'please enter video keywords'], trim: true },
    files: {
        type: [Object], // Assuming you want an array of objects
        required: true
    },
    promotions: {
        type: [Object]
    },

    views: { type: Number, default: 0, trim: true },
    like: { type: Number, default: 0, trim: true },
    dislike: { type: Number, default: 0, trim: true },
    
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
videosSchema.post('save', async function (doc, next) {
    const logFile = await AutoLogFile();
    const content = `A new Video document created with ${doc.userId} on ${doc.created}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
    next();
});

videosSchema.pre(/^find/, async function (next) {
    // Note: this model will not serve anything that is not up to its release date
    // else remove this middleware
    this.find({ releaseDate: { $lte: Date.now() } });
    this.startTime = Date.now();
    next();
});

videosSchema.post(/^find/, async function (docs, next) {
    this.endTime = Date.now();
    const logFile = await AutoLogFile();
    const content = `Query took  ${this.endTime - this.startTime} in milliseconds to fetch the documents, on ${new Date}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
    next();
});

// AGGREGATION MIDDLEWARES
videosSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } });
    next();
});

export default model('videos', videosSchema);