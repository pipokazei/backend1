import express from "express";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/carts.js";

const app = express();

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

app.listen(8080, () => console.log("server started"));
