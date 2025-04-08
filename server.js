import express from "express";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/carts.js";

const server = express();

server.use(express.json());

server.use("/api/products", productRoutes);
server.use("/api/carts", cartRoutes);

server.listen(8080, () => console.log("server started"));
