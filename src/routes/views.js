import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

const manager = new ProductManager("data/products.json");

router.get("/realtimeproducts", async (req, res) => {
  const products = await manager.getProducts();
  res.render("realTimeProducts", { products });
});

router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.render("home", { products });
});

export default router;
