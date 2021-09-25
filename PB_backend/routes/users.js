var express = require("express");
var router = express.Router();
let User = require("../models/userSchema");
const bcrypt = require("bcrypt"); //bcrypt is slow & SHA is fast thus bcrypt is good
const saltRounds = 14; //as slow as hashing more diffcult for hacker to hacker
let yup = require("yup");
let userSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required().min(5).max(15),
  email: yup.string().required(),
});

/*

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/", async (req, res) => {
  try {
    const validationResult = userSchema.validateSync(req.body);
    const pwdHash = bcrypt.hashSync(req.body.password, saltRounds);
    const user = new User({ ...req.body, password: pwdHash });
    try {
      const result = await user.save();
      res.status = 201;
      res.json({ message: "User create successfully" + result._id });
    } catch (err) {
      res.status = 500;
      res.json({ error: "Can not create user" });
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = router;
