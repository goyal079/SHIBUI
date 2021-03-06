import express from "express";
import verifyToken from "../../middlewares/auth/index.js";
const router = express.Router();

import Product from "../../models/Product.js";
import User from "../../models/User.js";
import ApiFeatures from "../../utils/apiFeatures.js";
import isAdmin from "../../helpers/isAdmin.js";
import { reviewValidations } from "../../middlewares/validations/index.js";
import cloudinary from "cloudinary";
/*
      API EndPoint : /api/products/
      Method : GET
      Payload :  None 
      Access Type : Public
      Description :Get all products
*/
router.get("/", async (req, res) => {
  try {
    const pageResults = 8;
    const productCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();
    let products = await apiFeatures.query;
    let filteredCount = products.length;
    apiFeatures.pagination(pageResults);
    products = await apiFeatures.query;
    res
      .status(200)
      .json({ products, productCount, pageResults, filteredCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

router.get("/admin", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});
/*
      API EndPoint : /api/products/review/
      Method : GET
      Payload :  None   
      Access Type : Public
      Description :Get product reviews
*/
router.get("/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return res.status(404).json({ errormsg: "Product Not Found" });
    }
    res.status(200).json(product.reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/products/id
      Method : GET
      Payload :  None 
      Access Type : Public
      Description :Get one products details
*/
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ errormsg: "Product Not Found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/products/new
      Method : POST
      Payload :  product model 
      Access Type : Private/Admin
      Description :Add new product
*/
router.post("/admin/new", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }

    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
      const results = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLink.push({
        public_id: results.public_id,
        url: results.url,
      });
    }
    req.body.images = imagesLink;
    req.body.user = req.user._id;
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/products/update/:id
      Method : PUT
      Payload :  new product data   
      Access Type : Admin
      Description :Update products
*/
router.put("/admin/update/:id", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ errormsg: "Product Not Found" });
    }
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (images !== undefined) {
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
    }
    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
      const results = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLink.push({
        public_id: results.public_id,
        url: results.url,
      });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/products/delete/:id
      Method : DELETE
      Payload :  None 
      Access Type : Admin
      Description :Delete product
*/
router.delete("/admin/delete/:id", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ errormsg: "Product Not Found" });
    }
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    await product.remove();
    res.status(200).json({ successmsg: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/products/review
      Method : PUT
      Payload :  Review data 
      Access Type : Private
      Description :Add Review
*/
router.put("/review", reviewValidations(), verifyToken, async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ errormsg: "Product Not Found" });
    }
    const newReview = {
      name: req.user.name,
      user: req.user._id,
      comment,
      rating: Number(rating),
    };
    const isReviewed = product.reviews.some(
      (rev) => rev.user.toString() == req.user._id.toString()
    );
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() == req.user._id.toString()) {
          rev.rating = Number(rating);
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(newReview);
      product.reviewCount = product.reviews.length;
    }
    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    product.rating = avg / product.reviews.length;
    await product.save();
    res.status(200).json({ successmsg: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/products/review/
      Method : GET
      Payload :  None   
      Access Type : Public
      Description :Get product reviews
*/
router.delete("/reviews", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return res.status(404).json({ errormsg: "Product Not Found" });
    }
    product.reviews = product.reviews.filter((rev) => rev._id != req.query.id);
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    if (product.reviews.length > 0) {
      product.rating = avg / product.reviews.length;
    } else {
      product.rating = 0;
    }
    product.reviewCount = product.reviews.length;
    await product.save();
    res.status(200).json(product.reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});
export default router;
