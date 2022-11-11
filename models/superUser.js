const mongoose = require("mongoose");
const Joi = require("joi");
const Jwt = require("jsonwebtoken");
const { TagsSchema } = require("./savedTags");
const { UsersSchema } = require("./savedUsers");

const superUserSchema = new mongoose.Schema({
  username: {
    type: String,
    maxlength: 50,
  },
  fullname: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024,
  },
  savedTags: [
    {
      type: [TagsSchema],
    },
  ],
  savedUsers: [
    {
      type: [UsersSchema],
    },
  ],
});

const generateAccessToken = (superUser) => {
  return Jwt.sign(
    { _id: superUser._id, username: superUser.username, fullname: superUser.fullname },
    process.env.ACCESS_TOKEN_SECRET
  );
};

const SuperUser = mongoose.model("SuperUsers", superUserSchema);

function validateSuperUser(superUser) {
  const schema = Joi.object({
    username: Joi.string().max(50),
    fullname: Joi.string().max(50),
    email: Joi.string().email().max(255),
    password: Joi.string().max(255).min(8),
  });

  return schema.validate(superUser);
}

module.exports.SuperUser = SuperUser;
module.exports.validate = validateSuperUser;
module.exports.generateAccessToken = generateAccessToken;
