import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

// Utility function to resize the video
const resizeVideo = async (videoPath, outputPath, width, height) => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .size(`${width}x${height}`)
            .output(outputPath)
            .on('end', () => {
                console.log(`Resized video to ${width}x${height}`);
                resolve();
            })
            .on('error', (err) => {
                console.error('Error resizing video:', err);
                reject(err);
            })
            .run();
    });
};
