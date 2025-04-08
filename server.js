import express from "express";
import CartManager from "./managers/CartManager.js";
import ProductManager from "./managers/ProductManager.js";

const server = express();

server.use(express.json());

const manager = new ProductManager("./data/products.json");

server.get("/api/products", async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

server.get("/api/products/:pid", async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  product
    ? res.json(product)
    : res.status(404).json({ error: "Producto no encontrado" });
});

server.post("/api/products", async (req, res) => {
  const product = await manager.addProduct(req.body);
  res.status(201).json(product);
});

server.put("/api/products/:pid", async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body);
  updated
    ? res.json(updated)
    : res.status(404).json({ error: "No se pudo actualizar" });
});

server.delete("/api/products/:pid", async (req, res) => {
  const deleted = await manager.deleteProduct(req.params.pid);
  deleted
    ? res.json({ success: true })
    : res.status(404).json({ error: "No encontrado" });
});

const cartManager = new CartManager("./data/carts.json");

server.post("/api/carts", async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

server.get("/api/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  cart
    ? res.json(cart.products)
    : res.status(404).json({ error: "Carrito no encontrado" });
});

server.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const result = await cartManager.addProductToCart(
    req.params.cid,
    req.params.pid
  );
  result
    ? res.json(result)
    : res.status(404).json({ error: "Error agregando producto" });
});

server.listen(8080, () => console.log("server started"));
