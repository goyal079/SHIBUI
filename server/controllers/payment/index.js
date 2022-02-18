import Stripe from "stripe";
import "dotenv/config";
import express from "express";
import verifyToken from "../../middlewares/auth/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/process", verifyToken, async (req, res) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "Equilibrium",
      },
    });
    res.status(200).json({ client_secret: myPayment.client_secret });
  } catch (error) {
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});

router.get("/stripeapikey", verifyToken, async (req, res) => {
  try {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
  } catch (error) {
    res.status(500).json({ errormsg: "Internal Server Error" });
  }
});
export default router;
