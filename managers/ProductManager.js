import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
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

  async createFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async addProduct(product) {
    const products = await this.getFile();
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = { id, ...product };
    products.push(newProduct);
    await this.createFile(products);
    return newProduct;
  }

  async getProducts() {
    return await this.getFile();
  }

  async getProductById(id) {
    const products = await this.getFile();
    return products.find((prod) => prod.id === parseInt(id));
  }

  async updateProduct(id, update) {
    const products = await this.getFile();
    const index = products.findIndex((prod) => prod.id === parseInt(id));
    if (index === -1) return null;
    const updatedProduct = {
      ...products[index],
      ...update,
      id: products[index].id,
    };
    products[index] = updatedProduct;
    await this.createFile(products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.getFile();
    const updated = products.filter((prod) => prod.id !== parseInt(id));
    await this.createFile(updated);
    return products.length !== updated.length;
  }
}

export default ProductManager;
