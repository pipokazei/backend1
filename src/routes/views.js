import { Router } from "express";
import productModel from "../models/product.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().lean();
    res.render("home", { products });
  } catch (err) {
    res.status(500).send("Error loading products");
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await productModel.find().lean();
    res.render("realTimeProducts", { products });
  } catch (err) {
    res.status(500).send("Error loading real-time products");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).lean();
    if (!product) {
      return res
        .status(404)
        .render("404", { message: "Producto no encontrado" });
    }
    res.render("productDetail", { product });
  } catch (error) {
    res.status(500).render("500", { message: "Error del servidor" });
  }
});

router.get("/cart", async (req, res) => {
  console.log();
  const cartId =
    req.cookies.cartId || req.query.cartId || req.headers["x-cart-id"] || null;

  if (!cartId) {
    return res.status(400).send("No se encontró el carrito.");
  }

  const cart = await cartModel
    .findById(cartId)
    .populate("products.product")
    .lean();

  if (!cart) {
    return res.status(404).send("Carrito no encontrado.");
  }

  res.render("cart", { products: cart.products });
});

export default router;
