const express = require("express");
const app = require("../app");
const router = express.Router();
const yup = require("yup");
const db = require("../databseConnection");
let Product = require("../models/productSchema");

/* Doing server side validation using 3rd party validation library
    for getting search nodejs validation library
   ex- validate.js/JOI/YUP
    using yup here
*/
let productSchema = yup.object().shape({
  product_name: yup.string().required(),
  price: yup.number().required().positive(),
  quantity: yup.number().positive().integer(),
  description: yup.string().max(300), //upper-limit requires so that hackers can't misuse it
});

/*
 *
 * If in app.js file we write app.use('/products', Router) so
 * here router.get('/',()=>{}) will mean /products only
 */
router.get("/", async (req, res) => {
  const { json } = req.query;
  if (json !== undefined) {
    const result = await Product.find();
    res.json(result);
  } else {
    //to render prodcts.ejs as html on the screen to get new products
    res.render("products", {});
  }
});

router.post("/", (req, res) => {
  //get the body, bcoz od urlencoded all the form data we got in req.body
  console.log(req.body);
  //html validation-did
  //client side validation(can be turned off)
  //server side validation -need to do this here in nodejs(server)
  try {
    //validating
    const result = productSchema.validateSync(req.body);
    //once validated inserting in dabatbase
    const product = new Product(req.body);
    try {
      product.save();
    } catch (err) {
      console.log(err);
    }
    //render form again if validated correctly
    res.render("products", { previousInsertionSuccessful: true });
  } catch (err) {
    res.render("products", { hasError: err.message });
  }
});

module.exports = router;
