import mongoose from "mongoose";
import productModel from "./src/models/product.js"; // adjust path

const MONGO_URI =
  "mongodb+srv://zelif:3J0sOj6DIqkJGW5D@cluster0.fjefkwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function listProducts() {
  await mongoose.connect(MONGO_URI);
  const products = await productModel.find({});
  console.log(products);
  await mongoose.disconnect();
}

listProducts();
