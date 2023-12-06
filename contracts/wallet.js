const crypto = require('crypto');
const { createHash } = require('crypto');
const secp256k1 = require('secp256k1'); 

function generateECDSAKeys() { // function generates keys
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'secp256k1' // eliptic curve used on both ETH and BTC mainnets
    });

    return {
        privateKey: privateKey.export({
            type: 'sec1', // compliant with sec1 standard
            format: 'pem'
        }),
        publicKey: publicKey.export({
            type: 'spki', // subject public key info format
            format: 'pem' // privacy enhanced mail
        })
    };
}

function publicKeyToAddress(publicKey) {
    const sha256 = createHash('sha256').update(publicKey).digest();
    const ripemd160 = createHash('ripemd160').update(sha256).digest();
    return ripemd160.toString('hex'); // This is a simplified version, but it works to generate an address
}

function signTransaction(transaction, privateKey) {
    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(transaction));
    sign.end();
    const signature = sign.sign(privateKey, 'hex');
    return signature;
}



// Example usage
const keys = generateECDSAKeys();
console.log('Private Key:', keys.privateKey);
console.log('Public Key:', keys.publicKey);

const address = publicKeyToAddress(keys.publicKey);
console.log('Address:', address);






