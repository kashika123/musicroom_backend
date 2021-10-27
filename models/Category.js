const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  id: { type: String },
  name: { type: String },
  image: { type: String },
});
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
