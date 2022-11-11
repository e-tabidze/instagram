const mongoose = require("mongoose");

const savedTagsSchema = new mongoose.Schema({
  tag: {
    type: String,
  },
});

const SavedTags = mongoose.model("SavedTags", savedTagsSchema);

module.exports.SavedTags = SavedTags;
module.exports.TagsSchema = savedTagsSchema;