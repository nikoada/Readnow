const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nodeSchema = new Schema({}, {strict: false});

nodeSchema.pre("save", function(next) {
  let currentDate = new Date();
  this.updated = currentDate;
  next();
});

let Node = mongoose.model("nodes", nodeSchema);

module.exports = Node;
