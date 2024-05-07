// import fileSizeFormatter from './fileSizeFormatter.js';

// const formatFiles = async (req) => {
//     console.log('req.files', req.files)

//     let filesArray = [];

//     req.files.forEach(element => {
//         const file = {
//             fileName: element.originalname,
//             filePath: `${element.path}`,
//             fileType: element.mimetype,
//             fileSize: fileSizeFormatter(element.size, 2) // 0.00
//         };
//         filesArray.push(file);
//     });
//     return filesArray;
// };

// export default formatFiles;






import fileSizeFormatter from './fileSizeFormatter.js';
import { exec } from 'child_process';
import ffprobePath from '@ffprobe-installer/ffprobe';
import util from 'util';

const formatFiles = async (req) => {
    console.log('req.files', req.files);
    const resolutions = [
        { name: '240p', width: 426, height: 240 },
        { name: '360p', width: 640, height: 360 },
        { name: '480p', width: 854, height: 480 },
        { name: '720p', width: 1280, height: 720 },
        { name: '1080p', width: 1920, height: 1080 },
        { name: '1440p', width: 2560, height: 1440 },
        { name: '2160p', width: 3840, height: 2160 }
    ];
    let filesArray = [];

    for (const file of req.files) {
        const Targetfile = `./${file.path}`;
        const fileDuration = await getFileDuration(Targetfile, file.mimetype);
        const { width, height } = await getFileMetadata(Targetfile, file.mimetype); 
        const formatedDuration = fileDuration !== undefined ? formatDuration(fileDuration) : fileDuration
        const formatedResolution = width && height ? {width, height} : fileDuration;
        const originalResolution = width && height ? { width, height } : fileDuration; // Assuming width and height are obtained from getFileMetadata function
        const availableResolutions = resolutions.filter(resolution => {
            return resolution.width <= originalResolution.width && resolution.height <= originalResolution.height;
        });

        console.log('formatedDuration', formatedDuration);
        console.log('formatDuration', formatDuration);
        const formattedFile = {
            fileName: file.originalname,
            filePath: file.path,
            fileType: file.mimetype,
            fileSize: fileSizeFormatter(file.size, 2),
            duration: formatedDuration,
            originalUpload: true,
            resolution: formatedResolution,
            availableResolutions: availableResolutions

        };

        console.log('formattedFile', formattedFile);

        filesArray.push(formattedFile);
    }

    console.log('filesArray', filesArray);

    return filesArray;
};

async function getFileDuration(filePath, mimeType) {
    if (mimeType.startsWith('video/')) {
        return new Promise((resolve, reject) => {
            const ffprobeCommand = `"${ffprobePath.path}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
            console.log('ffprobeCommand:', ffprobeCommand); // Log the command for debugging

            // Execute the command and handle stdout and stderr
            util.promisify(exec)(ffprobeCommand)
                .then(({ stdout, stderr }) => {
                    console.log('stdout:', stdout); // Log the stdout value
                    console.log('stderr:', stderr); // Log any error messages

                    const durationInSeconds = parseFloat(stdout.trim());
                    resolve(durationInSeconds);
                })
                .catch((err) => {
                    console.error('Error executing ffprobe:', err);
                    reject(err);
                });
        });
    } else {
        return undefined; // Return undefined for non-video files
    }
}



function formatDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    const formattedHours = hours > 0 ? `${hours}:` : ''; // Include hours only if greater than 0
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}

async function getFileMetadata(filePath, mimeType) {
    if (mimeType.startsWith('video/')) {
        return new Promise((resolve, reject) => {
            const ffprobeCommand = `"${ffprobePath.path}" -v error -select_streams v:0 -show_entries stream=width,height -of json "${filePath}"`;
            console.log('ffprobeCommand:', ffprobeCommand); // Log the command for debugging

            // Execute the command and handle stdout and stderr
            util.promisify(exec)(ffprobeCommand)
                .then(({ stdout, stderr }) => {
                    console.log('stdout:', stdout); // Log the stdout value
                    console.log('stderr:', stderr); // Log any error messages

                    const metadata = JSON.parse(stdout.trim());
                    const width = metadata.streams[0].width;
                    const height = metadata.streams[0].height;
                    resolve({ width, height });
                })
                .catch((err) => {
                    console.error('Error executing ffprobe:', err);
                    reject(err);
                });
        });
    } else {
        return undefined; // Return undefined for non-video files
    }
}



export default formatFiles;
