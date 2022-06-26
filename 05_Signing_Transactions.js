const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    mineBlock(difficulty) {
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log("BLOCK MINED: " + this.hash);
	}
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
      }
    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
    
        return true;
    }
      
}
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount)
                .toString();
    }
    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets!');
        }
    
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }
    isValid(){
        if(this.fromAddress === null) return true;
      
          if(!this.signature || this.signature.length === 0){
              throw new Error('No signature in this transaction');
          }
      
          const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
          return publicKey.verify(this.calculateHash(), this.signature);
      }
}

class Blockchain{
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 5;

		// Place to store transactions in between block creation
		this.pendingTransactions = [];

		// How many coins a miner will get as a reward for his/her efforts
		this.miningReward = 100;
	}
    createGenesisBlock() {
		return new Block(0, "18/05/2021", "Genesis block", "0");
	}

    createTransaction(transaction) {
        // There should be some validation here!
    
        // Push into onto the "pendingTransactions" array
        this.pendingTransactions.push(transaction);
    }
    minePendingTransactions(miningRewardAddress) {
        // Create new block with all pending transactions and mine it..
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
    
        // Add the newly mined block to the chain
        this.chain.push(block);
    
        // Reset the pending transactions and send the mining reward
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    isChainValid(){

        // ....
    
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
    
            // ...
    
            if (!currentBlock.hasValidTransactions()) {
                return false;
            }
        }
    }
    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }
    
        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain');
        }
    
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address){
        let balance = 0; // you start at zero!
    
        // Loop over each block and each transaction inside the block
        for(const block of this.chain){
            for(const trans of block.transactions){
    
                // If the given address is the sender -> reduce the balance
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
    
                // If the given address is the receiver -> increase the balance
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
    
        return balance;
    }
}

let myCoin = new Blockchain();

console.log('Creating some transactions...');
myCoin.createTransaction(new Transaction('address1', 'address2', 100));
myCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('Starting the miner...');
myCoin.minePendingTransactions('xaviers-address');

console.log('Balance of Xaviers address is', myCoin.getBalanceOfAddress('xaviers-address'));
// Output: 0

console.log('Starting the miner again!');
myCoin.minePendingTransactions("xaviers-address");

console.log('Balance of Xaviers address is', myCoin.getBalanceOfAddress('xaviers-address'));
//Output: 100

//Import elliptic;
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Create key object
const myKey = ec.keyFromPrivate('2c18084018976648b93377b090f2f89f267634a009b0bf1a1849bd92b8b88d04');
const myWalletAddress = myKey.getPublic('hex');

// Create new instance of Blockchain class
const myCoin1 = new Blockchain();

// Make a transaction
const tx1 = new Transaction(myWalletAddress, '04268f75d05c25f1fa0229e3d9049ae828005841b3da2fa5642809a8f044eac6d72788fcabcc27146fb4805f50668bff9ac6be7632a290c0cd6c5c7ba54c6a2229', 10);
tx1.signTransaction(myKey);
myCoin1.addTransaction(tx1);

// Mine block
myCoin1.minePendingTransactions(myWalletAddress);

console.log('Balance of xavier is', myCoin1.getBalanceOfAddress(myWalletAddress));

// Tampering
myCoin1.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log();
console.log('Blockchain valid?', myCoin1.isChainValid() ? 'Yes' : 'No');

// Tampering
myCoin1.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log();
console.log('Blockchain valid?', myCoin1.isChainValid() ? 'Yes' : 'No');