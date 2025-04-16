import express from "express";
import hbs from "express-handlebars";
import productRoutes from "./src/routes/products.js";
import cartRoutes from "./src/routes/carts.js";

const app = express();
const PORT = 8080;

app.use(express.json());

app.engine("handlebars", hbs.engine());
app.set("views", import.meta.dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
