const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, prevHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index + this.prevHash + this.timestamp + JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    //change timestamp to local time
    return new Block(0, "01/01/2017", "genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}

let bidBlock = new Blockchain();
bidBlock.addBlock(new Block(1, "02/07/2002", { value: 100 }));
bidBlock.addBlock(new Block(2, "02/07/2002", { value: 125 }));
bidBlock.addBlock(new Block(3, "02/07/2002", { value: 10 }));
