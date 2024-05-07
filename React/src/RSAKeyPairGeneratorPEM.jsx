// RSAKeyPairGeneratorPEM.jsx

import { useState } from "react";
import jose from 'node-jose';

const generateRSAKeyPair = async () => {
    try {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        );

        const privateKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
        const publicKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);

        return { privateKeyJwk, publicKeyJwk };
    } catch (error) {
        console.error("Error generating RSA key pair:", error);
        return null;
    }
};

const RSAKeyPairGeneratorPEM = () => {
    const [keys, setKeys] = useState(null);

    const handleGenerateKeys = async () => {
        const keyPair = await generateRSAKeyPair();
        if (keyPair) {
            console.log("Private Key JWK:", keyPair.privateKeyJwk);
            console.log("Public Key JWK:", keyPair.publicKeyJwk);
            try {
                const privateKeyPem = await jose.JWK.asKey(keyPair.privateKeyJwk).toPEM(true);
                const publicKeyPem = await jose.JWK.asKey(keyPair.publicKeyJwk).toPEM();
                setKeys({ privateKeyPem, publicKeyPem });
            } catch (error) {
                console.error("Error converting JWK to PEM:", error);
            }
        }
    };

    return (
        <div>
            <button onClick={handleGenerateKeys}>Generate RSA Key Pair</button>
            {keys && (
                <div>
                    <p>Private Key (PEM format): {keys.privateKeyPem}</p>
                    <p>Public Key (PEM format): {keys.publicKeyPem}</p>
                </div>
            )}
        </div>
    );
};

export default RSAKeyPairGeneratorPEM;
