import getLatestPublicKey  from '../Utils_RSA/RSA_getLatestPublicKey.js';
import asyncErrorHandler from "../Utils/asyncErrorHandler.js";
import decryptAsymData from "../Utils_RSA/RSA_Asym_Decrypt.js";
import encryptAndDecryptData from "../Utils_RSA/rsaTest.js";
import { encryptFilesToBuffer, decryptFileFromBuffer, decryptData, encryptData } from "../Utils_RSA/RSA_encryptionUtils.js";
import CryptoJS from 'crypto-js';




export const getTheLatestPublicKey = asyncErrorHandler(async (req, res, next) => {
    try {
      const latestPublicKey = await getLatestPublicKey(); // Call the renamed function

        console.log('Latest Public Key:', latestPublicKey);

        res.status(201).json({
            status: "success",
            resource: "latestPublicKey",
            data: latestPublicKey,
        });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

export const DecryptHeaderData = asyncErrorHandler(async (req, res, next) => {
    console.log('Decrypting header data')
    // console.log('req.headers',req.headers)
    console.log('')

    
    const cryptodetail = req.headers.cryptodetail;
    try {
      const decryptedData = await decryptAsymData(cryptodetail); // Call the renamed function
      const [succesCriteria, encryptionKey, iv] = decryptedData
      req.headers.succesCriteria = succesCriteria
      req.headers.encryptionKey = encryptionKey
      req.headers.iv = iv
      
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
    
    next()
});

export const TestRsa = asyncErrorHandler(async (req, res, next) => {
      const test = await encryptAndDecryptData(); // Call the renamed function
      res.status(201).json({
        status: "success",
        data: test,
    });
});



// Function to decrypt data
export const DecryptData = asyncErrorHandler(async (req, res, next) => {
    console.log('Decrypting body data')

    const succesCriteria = req.headers.succesCriteria 
    const encryptionKey = req.headers.encryptionKey 
    const iv = req.headers.iv 
    console.log('succesCriteria',succesCriteria)
    console.log('encryptionKey',encryptionKey)
    console.log('iv',iv)
    console.log('')
    console.log('req.body',req.body)

    let encryptedText = "no data"


            let encryptedTextObj = JSON.parse(req.body)
            console.log('encryptedTextObj',encryptedTextObj)

            console.log('encryptedTextObj.obj',encryptedTextObj.obj)
            
            encryptedText = req.body = encryptedTextObj.obj.data
            req.files = encryptedTextObj.obj.files
            
            console.log('')
            console.log('req.body',req.body)
            
            console.log('')
            
      
console.log('req.files',req.files)
    

    console.log('')
    console.log('encryptedText',encryptedText)
    // let decryptedArrayStr = CryptoJS.AES.decrypt(encryptedText, encryptionKey, { iv }).toString(CryptoJS.enc.Utf8);
    let decryptedArrayStr = decryptData(encryptedText, encryptionKey, { iv })

    console.log('')

    console.log('decryptedArrayStr',decryptedArrayStr)
    let decryptedArray = JSON.parse(decryptedArrayStr)
    console.log('decryptedArray',decryptedArray)
    console.log('')
    console.log('type of decryptedArray[1]',typeof(JSON.parse(decryptedArray[1])))

    req.body = JSON.parse(decryptedArray[1])
    console.log('')
    
    console.log('succesCriteria',succesCriteria)
    console.log('succesCriteria decryptedArray[0]',decryptedArray[0])

    if (succesCriteria !== decryptedArray[0]){
        let error = "Decryption failed"
        next(error)
    }
    console.log('decrypted req.body',req.body)
    console.log('')
    console.log('Decryption successful')
    console.log('')

    next()
});

// Function to decrypt data
export const DecryptFiles = asyncErrorHandler(async (req, res, next) => {
    console.log('Decrypting files data')
    console.log('req.files',req.files)

    req.files = await decryptWithRsaBuffer(req.files);
    console.log('new req.files',req.files)
    next()
});