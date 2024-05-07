// RSAKeyPairGenerator.js

import { useState } from "react";
import { Buffer } from 'buffer';

const generateRSAKeyPair = async () => {
    try {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
                hash: "SHA-256",
            },
            true, // extractable (private key can be exported)
            ["encrypt", "decrypt"] // key usages
        );

        const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);

        return { privateKey, publicKey };
    } catch (error) {
        console.error("Error generating RSA key pair:", error);
        return null;
    }
};

const RSAKeyPairGenerator = () => {
    const [keys, setKeys] = useState(null);

    const handleGenerateKeys = async () => {
        const keyPair = await generateRSAKeyPair();
        setKeys(keyPair);
    };

    return (
        <div>
            <button onClick={handleGenerateKeys}>Generate RSA Key Pair</button>
            {keys && (
                <div>
                    <p>Private Key (PEM format): {Buffer.from(keys.privateKey).toString("base64")}</p>
                    <p>Public Key (PEM format): {Buffer.from(keys.publicKey).toString("base64")}</p>
                </div>
            )}
        </div>
    );
};

export default RSAKeyPairGenerator;
