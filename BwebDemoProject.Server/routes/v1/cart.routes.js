import express from "express";
import { getCart, syncCart, addToCart, updateCartItem, removeFromCart } from "../../controllers/v1/cart.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// All cart routes require user authentication
router.use(authMiddleware(["user"]));

router.get("/", getCart);
router.post("/sync", syncCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove/:productId", removeFromCart);

export default router;
