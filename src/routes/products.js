import { Router } from "express";
import productModel from "../models/product.js";

const router = Router();

// router.get("/", async (req, res) => {
//   try {
//     const { limit = 10, page = 1, sort, query } = req.query;

//     const filter = query
//       ? {
//           $or: [
//             { category: query },
//             { status: query === "available" ? true : false },
//           ],
//         }
//       : {};

//     const sortOption =
//       sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

//     const result = await productModel.paginate(filter, {
//       limit: parseInt(limit),
//       page: parseInt(page),
//       sort: sortOption,
//       lean: true,
//     });

//     const { docs, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage } =
//       result;

//     res.json({
//       status: "success",
//       payload: docs,
//       totalPages,
//       prevPage,
//       nextPage,
//       page: result.page,
//       hasPrevPage,
//       hasNextPage,
//       prevLink: hasPrevPage
//         ? `/api/products?limit=${limit}&page=${prevPage}`
//         : null,
//       nextLink: hasNextPage
//         ? `/api/products?limit=${limit}&page=${nextPage}`
//         : null,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// });

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const filter = query ? { $or: [{ category: query }, { status: query }] } : {};

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort:
      sort === "asc"
        ? { price: 1 }
        : sort === "desc"
        ? { price: -1 }
        : undefined,
    lean: true,
  };

  const result = await productModel.paginate(filter, options);
  res.render("home", {
    products: result.docs,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    totalPages: result.totalPages,
    prevLink: result.hasPrevPage ? `/?page=${result.prevPage}` : null,
    nextLink: result.hasNextPage ? `/?page=${result.nextPage}` : null,
  });
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
