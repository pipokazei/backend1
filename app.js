import express from "express";
import productRoutes from "./src/routes/products.js";
import cartRoutes from "./src/routes/carts.js";

const app = express();

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

app.listen(8080, () => console.log("server started"));
