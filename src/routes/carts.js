import { Router } from "express";
import cartModel from "../models/cart.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartModel.create({ products: [] });
    res.status(201).json(newCart);
  } catch (err) {
    console.error("Error creating cart:", err);
    res.status(500).json({ error: "Failed to create cart" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartModel
      .findById(req.params.cid)
      .populate("products.product");
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ error: "Error fetching cart" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid });
    }

    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ error: "Error adding product" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ error: "Error removing product" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await cartModel.findByIdAndUpdate(
      cid,
      { products },
      { new: true }
    );
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ error: "Error updating cart" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const product = cart.products.find((p) => p.product.toString() === pid);
    if (!product)
      return res.status(404).json({ error: "Product not found in cart" });

    product.quantity = quantity;
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ error: "Error updating quantity" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = [];
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ error: "Error clearing cart" });
  }
});

export default router;
