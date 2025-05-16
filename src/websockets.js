import ProductModel from "./models/product.js";

export default (io) => {
  io.on("connection", async (socket) => {
    console.log("Cliente conectado:", socket.id);

    const initial = await ProductModel.find().lean();
    socket.emit("update-products", initial);

    socket.on("new-product", async (data) => {
      try {
        await ProductModel.create(data);
        const updated = await ProductModel.find().lean();
        io.emit("update-products", updated);
      } catch (err) {
        console.error("Error creating product:", err);
      }
    });

    socket.on("delete-product", async (id) => {
      try {
        console.log(id);
        await ProductModel.findByIdAndDelete(id);
        const updated = await ProductModel.find().lean();
        io.emit("update-products", updated);
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    });
  });
};
