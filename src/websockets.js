import ProductManager from "./managers/ProductManager.js";

const manager = new ProductManager("data/products.json");

export default (io) => {
  io.on("connection", async (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("new-product", async (data) => {
      await manager.addProduct(data);
      const updated = await manager.getProducts();
      io.emit("update-products", updated);
    });

    socket.on("delete-product", async (id) => {
      await manager.deleteProduct(id);
      const updated = await manager.getProducts();
      io.emit("update-products", updated);
    });

    // Send initial product list
    const initial = await manager.getProducts();
    socket.emit("update-products", initial);
  });
};
