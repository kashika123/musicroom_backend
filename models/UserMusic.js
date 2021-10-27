const mongoose = require("mongoose");
const User = require("./User");
const Album = require("./Album");
const Category = require("./Category");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Album,
      required: true,
    },
    categoryId: {
      type: "string",
      ref: Category,
      required: true,
    },
  },
  { toJSON: { virtuals: true } }
);

userSchema.virtual("albumCollection", {
  ref: "album",
  localField: "album",
  foreignField: "_id",
  justOne: true,
});

userSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

const UserMusic = mongoose.model("UserMusic", userSchema);

module.exports = UserMusic;
