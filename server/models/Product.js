import mongoose from "mongoose";

const Schema = mongoose.Schema;

let productSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      maxlength: 8,
    },
    rating: {
      type: Number,
      default: 0, //ajhsdfuhhimanhuhadfsdfgadf
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      maxlength: 4,
      default: 1,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const productModel = new mongoose.model("Product", productSchema, "products");

export default productModel;
