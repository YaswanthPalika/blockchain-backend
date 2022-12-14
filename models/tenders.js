const mongoose = require("mongoose");
const express = require("express");

//tenders schema
const TendersSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  objective: {
    type: String,
  },
  expire: {
    type: Date,
  },
});

module.exports = new mongoose.model("Tender", TendersSchema);
