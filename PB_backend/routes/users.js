var express = require("express");
var router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
let User = require("../models/userSchema");
let Product = require("../models/productSchema");
const bcrypt = require("bcrypt"); //bcrypt is slow & SHA is fast thus bcrypt is good
const saltRounds = 14; //as slow as hashing more diffcult for hacker to hacker
let yup = require("yup");
const Favorite = require("../models/favouriteSchema");
const { json } = require("express");
let userSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required().min(5).max(15),
  email: yup.string().required(),
});

let loginRequest = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});
/*

/* GET users listing. */
//users/username
router.get("/:username", async function (req, res, next) {
  const { username } = req.params;

  //query object & projection - which fields we want to retirieve
  //If don't specify projection then have to delete but deleting is bad we can forgot to delete
  const user = await User.findOne(
    { username },
    { _id: 1, username: 1, email: 1 } //1 means true we need, 0 meand dont need
  );
  if (!user) {
    //user not found
    res.sendStatus(404);
  } else {
    //usign projection instead of deleting
    // delete user.password; //remove password
    // delete user.__v; //remove versioning factor
    res.json(user);
  }
});

//users/login
router.post("/login", cors(), async (req, res) => {
  const validatingLoginCredentials = loginRequest.validateSync(req.body);
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    res.sendStatus(404); //forbidden
  } else {
    const pwdCorrect = bcrypt.compareSync(password, user.passwordHash);
    //send a signed (made from their id/username & password) if user is verified
    //json web token
    if (pwdCorrect) {
      const token = jwt.sign({ username: username }, process.env.JWT_SECRET);
      res.json({ token: token, username: user.username });
    } else {
      res.sendStatus(403);
    }
  }
});

router.post("/", cors(), async (req, res) => {
  try {
    const validationResult = userSchema.validateSync(req.body);
    const { email } = req.body;

    const pwdHash = bcrypt.hashSync(req.body.password, saltRounds);
    //goal is plain text password should never gooes to database
    delete req.body.passwordHash;
    const user = new User({ ...req.body, passwordHash: pwdHash });
    try {
      const result = await user.save();
      res.status = 201;
      res.json({ message: "User created successfully" });
    } catch (err) {
      res.status = 500;
      res.json({ error: "Can not create user" });
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get("/:username/favourite", auth, async (req, res) => {
  //creating midlleware to verify token & we can set any propertu using re.absc ="absd" & can acees those property here
  const bucket = await Favorite.findOne({ username: req.user.username });
  if (!bucket) {
    res.json({
      message: `${req.user.username} don't have anything in favorites`,
    });
  } else {
    const products = [];
    for (const id of bucket.productsIds) {
      const product = await Product.findById(id);
      products.push(product);
    }
    res.json(products);
  }
});

router.post("/:username/favourite", auth, async (req, res) => {
  //have to check authrized to add products u can only products to ur favourites
  //but u only have ur header(token) using auth thus u can't add to anybody else's favourites
  const { pid } = req.body;
  //find only those user where username matches from the username of token
  const bucket = await Favorite.findOne({ username: req.user.username });
  if (!bucket) {
    //If user is not in bucket then we have to add it
    let newFavourite = Favorite({
      username: req.user.username,
      productsIds: [pid],
    });
    await newFavourite.save();
    res.end("bucket created and saved");
  } else {
    //first have to check whether productid  exists in product or not
    const product = Product.findOne({ pid });
    if (product) {
      console.log(pid);
      bucket.productsIds.push(pid);
      await bucket.save();
      res.end("saved");
    } else {
      res.json({ message: "product doesn't exists!" });
    }
  }
});
async function auth(req, res, next) {
  //only the user who created the list can see the list
  const token = req.headers["authorization"];
  if (!token) {
    res.sendStatus(403); //forbidden
  } else {
    try {
      //verify token is not forged
      const obj = jwt.verify(token, process.env.JWT_SECRET);
      // In obj we get the payload the payload is the username in our case, we have create token using username & secret
      const username = obj.username;
      const user = await User.findOne({ username });
      req.user = user; // finding user & adding it in req so that next function can have the user
      next();
    } catch (err) {
      res.sendStatus(403); //forbidden
    }
  }
}
module.exports = router;
