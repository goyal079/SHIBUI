import express from "express";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import verifyToken from "../../middlewares/auth/index.js";
import isAdmin from "../../helpers/isAdmin.js";
import updateStock from "../../helpers/updateStock.js";
const router = express.Router();

/*
      API EndPoint : /api/orders/new
      Method : POST
      Payload :  Order Details 
      Access Type : Private
      Description :Create New Order
*/
router.post("/new/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product.stock <= 0) {
      return res.status(404).json({ errormsg: "Out of Stock" });
    }
    const newOrder = new Order({
      ...req.body,
      user: req.user._id,
      paidAt: Date.now(),
    });
    await newOrder.save();
    res.status(200).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/orders/myOrders
      Method : GET
      Payload :  None 
      Access Type : Private
      Description :Create New Order
*/
router.get("/my", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
      return res.status(404).json({ errormsg: "No orders available" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/orders/all
      Method : GET
      Payload :  Order Details 
      Access Type : Private/Admin
      Description :Create New Order
*/
router.get("/all", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }
    const orders = await Order.find({}).populate("user", "name email");
    if (!orders) {
      return res.status(404).json({ errormsg: "No orders available" });
    }
    let totalAmount = 0;
    orders.forEach((ord) => (totalAmount += ord.totalPrice));
    res.status(200).json({ totalAmount, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/orders/:id
      Method : GET
      Payload :  Order Details 
      Access Type : Private
      Description :Get Order Details
*/
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) {
      return res.status(404).json({ errormsg: "Order Not Found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/orders/:id
      Method : PUT
      Payload :  None 
      Access Type : Private/Admin
      Description :Update order status
*/
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ errormsg: "Order Not Found" });
    }
    if (order.orderStatus == "delivered") {
      return res.status(404).json({ errormsg: "ALready Delivered" });
    }
    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity);
    });
    order.orderStatus = req.body.status.toLowerCase();
    if (req.body.status.toLowerCase() == "delivered") {
      order.deliveredAt = Date.now();
    }
    await order.save();
    res.status(200).json({ successmsg: "Order Status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

/*
      API EndPoint : /api/orders/:id
      Method : DELETE
      Payload :  None 
      Access Type : Private/Admin
      Description :Delete order
*/

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const admin = await isAdmin(req.user._id);
    if (!admin) {
      return res.status(400).json({ errormsg: "Missing Admin Access" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ errormsg: "Order Not Found" });
    }
    await order.remove();
    res.status(200).json({ successmsg: "Order Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});
export default router;
