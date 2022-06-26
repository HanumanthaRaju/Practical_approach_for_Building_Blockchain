// Import the elliptic library and initialize a curve.
// You can use other curves if you want.
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Generate a new key pair and convert them to hex-strings
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

// Print the keys to the console
console.log();
console.log('Your public key:', publicKey);

console.log();
console.log('Your private key', privateKey);