import multer from 'multer';
import path from 'path';
import { decryptWithRSA } from '../Utils_RSA/RSA_encryptionUtils.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        req.body.targetFilepath 
            ? cb(null, req.headers.targetFilepath)
            : cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const filefilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'video/mp4' || 
        file.mimetype === 'video/mpeg' || 
        file.mimetype === 'video/quicktime' ||
        file.mimetype === 'application/msword' || // Word documents
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // Word documents
        file.mimetype === 'application/vnd.ms-excel' || // Excel documents
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // Excel documents
        file.mimetype === 'application/vnd.ms-powerpoint' || // PowerPoint documents
        file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' // PowerPoint documents
    ){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadCrypto = multer({ storage: storage, fileFilter: filefilter });

// Middleware to decrypt the file before saving
const decryptFile = (req, res, next) => {
    
    if (req.file) {
        let encryptedFile;
        // Check if the encrypted file content is provided as a string
        if (typeof req.file.buffer === 'string') {
            // Convert the string to buffer
            encryptedFile = Buffer.from(req.file.buffer, 'base64'); // Assuming the encrypted file content is base64 encoded
        } else {
            encryptedFile = req.file.buffer; // If already in buffer format, no conversion needed
        }
        const decryptedFile = decryptWithRSA(encryptedFile); // Decrypt the file
        req.file.buffer = decryptedFile; // Replace encrypted file with decrypted file
    }
    next();

};

// export { upload, decryptFile };
export default uploadCrypto;
