import express from "express";
import hbs from "express-handlebars";
import productRoutes from "./src/routes/products.js";
import cartRoutes from "./src/routes/carts.js";
import viewRoutes from "./src/routes/views.js";
import { Server } from "socket.io";
import websockets from "./src/websockets.js";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;
const httpServer = http.createServer(app);
const io = new Server(httpServer);
websockets(io);

app.use(express.json());

app.use(express.static(path.join(__dirname, "src", "public")));

app.engine("handlebars", hbs.engine());
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "handlebars");

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", viewRoutes);

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // ✅ Correct
