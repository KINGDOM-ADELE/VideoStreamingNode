import { useState } from 'react';
import axios from 'axios'; // For making HTTP requests to the server

const EncryptionKeyAndIvGen = () => {
    const [encryptionKey, setEncryptionKey] = useState('');
    const [iv, setIV] = useState('');

    const generateEncryptionKeyAndIV = async () => {
        // Generate random encryption key and IV
        const newEncryptionKey = generateRandomString(55, 70); // 256-bit key
        const newIV = generateRandomString(16); // 128-bit IV

        // Store the keys in the component state
        setEncryptionKey(newEncryptionKey);
        setIV(newIV);

        // Send the keys to the server
        try {
            await axios.post('/store-keys', { encryptionKey: newEncryptionKey, iv: newIV });
        } catch (error) {
            console.error('Error storing keys:', error);
        }
    };

    // Function to generate a random string of given length
    const generateRandomString = (minLength, maxLength) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomString;
    };

    return (
        <div>
            <button onClick={generateEncryptionKeyAndIV}>Generate Keys</button>
            <div>
                <p>Encryption Key: {encryptionKey}</p>
                <p>Initialization Vector (IV): {iv}</p>
            </div>
        </div>
    );
};

export default EncryptionKeyAndIvGen;
