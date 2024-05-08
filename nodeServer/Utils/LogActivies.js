import AutoLogToNamedFile from './AutoLogToNamedFile.js';
import fs from 'fs';


const logActivityDyration = async (logfileName, startTime) => {
    const endTime = Date.now();
    const logFile = await AutoLogToNamedFile(logfileName);
    const content = `Action took  ${ endTime - startTime} in milliseconds to complete, on ${new Date()}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
}
const logActivity = async (logfileName, startTime, report) => {
    const DATE = new Date();
    const YY = DATE.getFullYear();
    const mm = String(DATE).split(' ')[1]; // to get the second element of the generated array
    const thisMonth = `${mm}/${YY}`;
    const logFile = await AutoLogToNamedFile(logfileName);
    const content = `${report} on ${DATE}\n`;
    fs.writeFileSync(logFile, content, { flag: 'a' }, (err) => {});
    logActivityDyration(logfileName, startTime)
}

export default logActivity;
