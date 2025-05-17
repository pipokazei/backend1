import { Router } from "express";
import productModel from "../models/product.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().lean();
    res.render("home", { products });
  } catch (err) {
    res.status(500).send("Error loading products");
  }
});

router.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;

    const filter = query
      ? {
          $or: [
            { category: { $regex: query, $options: "i" } },
            { status: query === "available" ? true : false },
          ],
        }
      : {};

    const sortOption =
      sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const result = await productModel.paginate(filter, {
      limit,
      page,
      sort: sortOption,
      lean: true,
    });

    const {
      docs: products,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = result;

    res.render("products", {
      products,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page,
      limit,
      sort,
      query,
    });
  } catch (err) {
    console.error("Error loading paginated products:", err);
    res.status(500).send("Error al cargar los productos paginados.");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).lean();
    if (!product) {
      return res
        .status(404)
        .render("404", { message: "Producto no encontrado" });
    }
    res.render("productDetail", { product });
  } catch (error) {
    res.status(500).render("500", { message: "Error del servidor" });
  }
});

router.get("/cart", async (req, res) => {
  console.log();
  const cartId =
    req.cookies.cartId || req.query.cartId || req.headers["x-cart-id"] || null;

  if (!cartId) {
    return res.status(400).send("No se encontró el carrito.");
  }

  const cart = await cartModel
    .findById(cartId)
    .populate("products.product")
    .lean();

  if (!cart) {
    return res.status(404).send("Carrito no encontrado.");
  }

  res.render("cart", { products: cart.products });
});

export default router;
