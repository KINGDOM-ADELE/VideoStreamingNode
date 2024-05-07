import CryptoJS from 'crypto-js';

// RSA
// Encrypt data with RSA
const encryptWithRSA = async (publicKey, data) => {
    try {
        const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
        const encryptedData = publicKeyObj.encrypt(data, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha1.create()
            }
        });
        return forge.util.encode64(encryptedData);
    } catch (error) {
        console.error('Encryption failed:', error);
        throw error;
    }
};

// Decrypt data with RSA
const decryptWithRSA = async (privateKey, encryptedData) => {
    try {
        const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
        const decryptedData = privateKeyObj.decrypt(forge.util.decode64(encryptedData), 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha1.create()
            }
        });
        return decryptedData;
    } catch (error) {
        console.error('Decryption failed:', error);
        throw error;
    }
};



// Encrypt data with RSA
const encryptWithRsaBuffer = async (publicKey, data) => {
    try {
        const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
        const encryptedData = publicKeyObj.encrypt(Buffer.from(data), 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha1.create()
            }
        });
        return forge.util.encode64(encryptedData.getBytes());
    } catch (error) {
        console.error('Encryption failed:', error);
        throw error;
    }
};

// Decrypt data with RSA
const decryptWithRsaBuffer = async (privateKey, encryptedData) => {
    try {
        const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
        const decryptedData = privateKeyObj.decrypt(Buffer.from(forge.util.decode64(encryptedData)), 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha1.create()
            }
        });
        return decryptedData.toString();
    } catch (error) {
        console.error('Decryption failed:', error);
        throw error;
    }
};




// SYMMETRIC ENC
// Function to encrypt files to buffer asynchronously
const encryptFilesToBuffer = async (file, encryptionKey, iv) => {
  try {
    const encryptedData = await encryptFile(file, encryptionKey, iv);
    return new Blob([encryptedData], { type: 'application/octet-stream' });
  } catch (error) {
    console.error('Error encrypting files to buffer:', error);
    throw error;
  }
};

// Function to decrypt a buffer
const decryptFileFromBuffer = async (encryptedBuffer, encryptionKey, iv) => {
  try {
    const encryptedData = await readBlobAsText(encryptedBuffer);
    const decryptedText = decryptFile(encryptedData, encryptionKey, iv);
    return decryptedText;
  } catch (error) {
    console.error('Error decrypting buffer:', error);
    throw error;
  }
};

// Function to read Blob as text
const readBlobAsText = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(blob);
  });
};

// Function to encrypt a file
const encryptFile = (file, encryptionKey, iv) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const encryptedData = encryptData(reader.result, encryptionKey, iv);
      resolve(encryptedData);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Function to decrypt a file
const decryptFile = (encryptedData, encryptionKey, iv) => {
  try {
    const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedData);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedWordArray }, encryptionKey, { iv: iv });
    const decryptedBuffer = Buffer.from(decrypted.toString(CryptoJS.enc.Latin1), 'latin1');
    return decryptedBuffer;
  } catch (error) {
    console.error('Error decrypting file:', error);
    throw error;
  }
};

// Function to encrypt data
const encryptData = (plainText, encryptionKey, iv) => {
  try {
    const arrayData = JSON.stringify(plainText); // Modified this line
    const encrypted = CryptoJS.AES.encrypt(arrayData, encryptionKey, { iv: iv }).toString();
    return encrypted;
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw error;
  }
};

// Function to decrypt data
const decryptData = (encryptedText, encryptionKey, iv) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, encryptionKey, { iv: iv }).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
};

export { encryptWithRsaBuffer, decryptWithRsaBuffer, encryptWithRSA, decryptWithRSA, encryptFilesToBuffer, decryptFileFromBuffer, decryptData, encryptData };
