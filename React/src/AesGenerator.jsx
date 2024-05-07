import { useState } from "react";
import { Buffer } from 'buffer';


const generateEncryptionKey = () => {
    const keyBytes = new Uint8Array(60); // 256 bits
    crypto.getRandomValues(keyBytes);
    return Buffer.from(keyBytes).toString("base64");
};

const generateInitializationVector = () => {
    const ivBytes = new Uint8Array(12); // 96 bits
    crypto.getRandomValues(ivBytes);
    return Buffer.from(ivBytes).toString("base64");
};

const AesGenerator = () => {
    const [encryptionKey, setEncryptionKey] = useState("");
    const [iv, setIV] = useState("");

    const handleGenerateKey = () => {
        const newKey = generateEncryptionKey();
        const newIV = generateInitializationVector();
        setEncryptionKey(newKey);
        setIV(newIV);
    };

    return (
        <div>
            <button onClick={handleGenerateKey}>Generate Key and IV</button>
            {encryptionKey && <p>Encryption Key: {encryptionKey}</p>}
            {iv && <p>Initialization Vector (IV): {iv}</p>}
        </div>
    );
};

export default AesGenerator;
