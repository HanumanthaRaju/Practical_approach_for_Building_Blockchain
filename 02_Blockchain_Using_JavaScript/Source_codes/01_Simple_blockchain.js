const SHA256 = require('crypto-js/sha256');
													
class Block {
constructor(index, timestamp, data, previousHash =''){
this.index=index;
this.timestamp=timestamp;
this.data=data;
this.previousHash=previousHash;
this.hash= this.calculateHash();
}
calculateHash(){
return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
}
}
class Blockchain{
constructor(){
this.chain=[this.createGenesisBlock()];
}
createGenesisBlock(){
	return new Block(0,"18/05/2021","Genesis block","0");
}

getLatestBlock(){
 return this.chain[this.chain.length-1];
}

addBlock(newBlock){
newBlock.previousHash=this.getLatestBlock().hash;
newBlock.hash=newBlock.calculateHash();
this.chain.push(newBlock);
}
}


let myCoin = new Blockchain();
myCoin.addBlock(new Block(1,"19/05/2021", {amount: 4 }));
myCoin.addBlock(new Block(2,"20/05/2021", {amount: 10 }));

console.log(JSON.stringify(myCoin, null, 4));
