const mongoose = require("mongoose");

const savedUsersSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  type: {
    type: String,
  },
  username: {
    type: String,
  },
  media_count: {
    type: Number,
  },
});

const SavedUser = mongoose.model("SavedUsers", savedUsersSchema);

module.exports.SavedUser = SavedUser;
module.exports.UsersSchema = savedUsersSchema;
