const mongoose = require("mongoose");
const express = require("express");

//tenders schema
const BiddersSchema = new mongoose.Schema({
  titleId: {
    type: String,
  },
  data: {
    type: Object,
  },
});

module.exports = new mongoose.model("Bidders", BiddersSchema);
