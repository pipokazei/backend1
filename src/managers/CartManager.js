import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager {
  constructor(filePath) {
    this.path = path.resolve(__dirname, filePath);
  }

  async getFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async saveFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this.getFile();
    const id = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
    const newCart = { id, products: [] };
    carts.push(newCart);
    await this.saveFile(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.getFile();
    return carts.find((cart) => cart.id === parseInt(cid));
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getFile();
    const cart = carts.find((cart) => cart.id === parseInt(cid));
    if (!cart) return null;

    const existing = cart.products.find((p) => p.product === parseInt(pid));
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: parseInt(pid), quantity: 1 });
    }

    await this.saveFile(carts);
    return cart;
  }
}

export default CartManager;
