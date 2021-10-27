const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const albumSchema = new Schema({
  id: { type: String },
  name: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId },
  image: { type: String },
  artistName: { type: String },
  spotifyLink: { type: String },
});
const Album = mongoose.model("album", albumSchema);
module.exports = Album;
