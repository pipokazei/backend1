import { Schema, model } from "mongoose";

const cartCollection = "carts";

const cartSchema = new Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "products" },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const cartModel = model(cartCollection, cartSchema);

export default cartModel;
