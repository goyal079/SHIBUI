import Product from "../models/Product.js";
export default async function updateStock(id, qty) {
  const product = await Product.findById(id);
  product.stock -= qty;
  await product.save();
}
