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
      
}
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
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

//console.log('Starting the miner again!');
//myCoin.minePendingTransactions("xaviers-address");

//console.log('Balance of Xaviers address is', myCoin.getBalanceOfAddress('xaviers-address'));
// Output: 100