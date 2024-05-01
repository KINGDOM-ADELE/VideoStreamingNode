import fs from 'fs';

const createLogFile = async () => {
    let DATE = new Date();
    let YY = DATE.getFullYear();
    let mm = String(DATE).split(' ')[1]; // to get the second element of the generated array
    let dd = String(DATE).split(' ')[2]; // to get the second element of the generated array

    const logFile = `./Log/log_${dd}_${mm}_${YY}.txt`;
    let dir = './Log';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return logFile;
};

export default createLogFile;
