const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Tenders = require("./models/tenders.js");
const Bidders = require("./models/Bidder");

const databasePath = path.join(__dirname, "sample.db");
const app = express();

const { spawn } = require("child_process");
//blockchain integration
const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(data, prevHash = "") {
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.prevHash + JSON.stringify(this.data)).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    //change timestamp to local time
    return new Block("genesis block", "0");
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
class Blockchain2 {
  constructor() {
    this.chain = [...bidBlock];
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
let bidBlock;
let updateBlock;
/*
let bidBlock = new Blockchain();
bidBlock.addBlock(new Block(1, "02/07/2002", { value: 100 }));
bidBlock.addBlock(new Block(2, "02/07/2002", { value: 125 }));
bidBlock.addBlock(new Block(3, "02/07/2002", { value: 10 }));

*/

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    //server running
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log("server started at PORT ", PORT);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/", async (req, res) => {
  res.send("block chain get route");
});

mongoose.set("strictQuery", false);

mongoose
  .connect(
    "mongodb+srv://yas:yas@cluster0.wdszhtf.mongodb.net/fooddb?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("connect to mongodb atlas");
  })
  .catch((e) => {
    console.log(e);
  });

//adding tenders
app.post("/tender", async (req, res) => {
  const { title, objective, expire } = req.body;
  tender = new Tenders({
    title: title,
    objective: objective,
    expire: expire,
  });
  tender
    .save()
    .then((data) => {
      let id = data._id.valueOf();
      bidBlock = new Blockchain();
      bidder = new Bidders({
        titleId: id,
        data: bidBlock,
      });
      bidder
        .save()
        .then(() => res.send({ data: "uploaded successfully" }))
        .catch(() => res.send("failed").status(500));
    })
    .catch(() => res.send("failed").status(500));
});

app.get("/tenders", async (req, res) => {
  Tenders.find()
    .then((tenders) => res.send(tenders))
    .catch((error) => res.send(error));
});

app.get("/tender/:id", async (req, res) => {
  const response = await Tenders.findById(req.params.id)
    .then((tender) => res.send(tender))
    .catch((e) => res.send(e).status(500));
});

app.post("/bidder", async (req, res) => {
  const { titleId, company, cost, time, description } = req.body;
  Bidders.findOne({ titleId: titleId }).then((bidder) => {
    bidBlock = bidder.data.chain;
    let idx = bidder._id.valueOf();
    updateBlock = new Blockchain2();
    updateBlock.addBlock(new Block({ company, cost, time, description }));
    //updating the blockchain
    Bidders.findByIdAndUpdate(idx, {
      data: updateBlock,
    })
      .then(() => console.log("updated"))
      .catch((err) => console.log(err));
  });
  res.send({ data: "uploaded successfully" });
});

app.get("/bids/:id", async (req, res) => {
  const response = await Bidders.findOne({ titleId: req.params.id })
    .then((tender) => {
      res.send(tender);
    })
    .catch((e) => res.send(e).status(500));
});
