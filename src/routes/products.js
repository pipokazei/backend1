import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager("data/products.json");

router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  product
    ? res.json(product)
    : res.status(404).json({ error: "Producto no encontrado" });
});

router.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing or invalid fields" });
    }
    const result = await manager.addProduct(req.body);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "view console" });
  }
});

router.put("/:pid", async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body);
  updated
    ? res.json(updated)
    : res.status(404).json({ error: "No se pudo actualizar" });
});

router.delete("/:pid", async (req, res) => {
  const deleted = await manager.deleteProduct(req.params.pid);
  deleted
    ? res.json({ success: true })
    : res.status(404).json({ error: "No encontrado" });
});

export default router;
