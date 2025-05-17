import { Router } from "express";
import productModel from "../models/product.js";

const router = Router();

router.get("/", async (req, res) => {
  const queries = new PaginationParameters(req).get();
  const response = await productModel.paginate({}, queries);

  let prevLink = null;
  let nextLink = null;
  if (response.hasPrevPage) prevLink = `${PATH}/?page=${response.prevPage}`;
  if (response.hasNextPage) nextLink = `${PATH}/?page=${response.nextPage}`;

  delete response.offset;
  response.status = "success";
  response.prevLink = prevLink;
  response.nextLink = nextLink;
  res.json(response);
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnails, code, stock, category } =
      req.body;

    if (
      !title ||
      !description ||
      !price ||
      !code ||
      stock == null ||
      !category
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Campos requeridos faltantes" });
    }

    const newProduct = await productModel.create({
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      category,
    });

    res.status(201).json({ status: "success", payload: newProduct });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Error al crear producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedProduct)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ status: "success", payload: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.pid);
    if (!deletedProduct)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;
