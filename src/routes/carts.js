import { Router } from "express";
import cartModel from "../models/cart.js";
import mongoose from "mongoose";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartModel.create({ products: [] });
    res.status(201).json(newCart);
  } catch (err) {
    console.error("Error al crear el carrito:", err);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    if (!cartId) {
      return res.status(400).json({ error: "ID de carrito inválido" });
    }

    const cart = await cartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json({ status: "success", payload: cart });
  } catch (err) {
    console.error("Error al obtener el carrito:", err);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity == null || quantity < 1) {
      return res
        .status(400)
        .json({ error: "Debes proporcionar una cantidad válida (>= 1)" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(cid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      return res
        .status(400)
        .json({ error: "ID de carrito o producto inválido" });
    }

    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productIndex = cart.products.findIndex(
      (p) => p.productID?.toString?.() === pid
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (err) {
    console.error("Error al actualizar cantidad del producto:", err);
    res.status(500).json({
      error: "Error al actualizar cantidad del producto",
      details: err.message,
    });
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
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
