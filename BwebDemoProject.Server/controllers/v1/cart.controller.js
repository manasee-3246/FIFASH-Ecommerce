import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

/**
 * @desc    Get user cart
 * @route   GET /api/v1/cart
 * @access  Private
 */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get cart", error: error.message });
  }
};

/**
 * @desc    Sync local cart to database after login
 * @route   POST /api/v1/cart/sync
 * @access  Private
 */
export const syncCart = async (req, res) => {
  try {
    const { localItems } = req.body; // Array of { _id (product), quantity, ... }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    if (localItems && Array.isArray(localItems) && localItems.length > 0) {
      for (const localItem of localItems) {
        // Find existing item in db cart
        const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === localItem._id
        );

        if (itemIndex > -1) {
          // If it exists, take the maximum quantity
          // or just overwrite with the local quantity. We'll add them up for safety.
          cart.items[itemIndex].quantity = Math.max(cart.items[itemIndex].quantity, localItem.quantity);
        } else {
          // Add new item if it doesn't exist
          cart.items.push({ product: localItem._id, quantity: localItem.quantity });
        }
      }
      await cart.save();
    }

    // Return populated cart after sync
    cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    res.json({
      success: true,
      message: "Cart synced successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to sync cart", error: error.message });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/v1/cart/add
 * @access  Private
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    res.json({ success: true, message: "Item added to cart", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add item to cart", error: error.message });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/v1/cart/update
 * @access  Private
 */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
      return res.json({ success: true, message: "Cart updated", data: cart });
    } else {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update cart", error: error.message });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/v1/cart/remove/:productId
 * @access  Private
 */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();
    cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    res.json({ success: true, message: "Item removed from cart", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove item", error: error.message });
  }
};

export default {
  getCart,
  syncCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
