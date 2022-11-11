const { SuperUser, validate, generateAccessToken } = require("../models/superUser");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.post("/signUp", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let superUser = await SuperUser.findOne({ email: req.body.email });
  if (superUser) return res.status(400).send("SuperUser is already registered");

  superUser = new SuperUser({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    fullname: req.body.fullname,
  });
  const salt = await bcrypt.genSalt(10);
  superUser.password = await bcrypt.hash(superUser.password, salt);

  return superUser
    .save()
    .then(async (newSuperUser) => {
      const accessToken = generateAccessToken(newSuperUser);
      res
        .header("x-auth-token", accessToken)
        .header("access-control-expose-headers", "x-auth-token")
        .send(_.pick(admin, ["_id", "username", "email", "fullname"]));
    })
    .catch((err) => new Error(err, "MongoDB Err"));
});

router.post("/signIn", async (req, res) => {
  const { error } = validateSignIn(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let superUser = await SuperUser.findOne({ email: req.body.email });
  if (!superUser) return res.status(400).send("Invalid email");

  const validPassword = await bcrypt.compare(req.body.password, superUser.password);
  if (!validPassword) return res.status(400).send("Invalid password");
  const token = generateAccessToken(superUser);
  res.send(token);
});

function validateSignIn(req) {
  const schema = Joi.object({
    email: Joi.string().email().max(255),
    password: Joi.string().max(255).min(8),
  });
  return schema.validate(req);
}

module.exports = router;
