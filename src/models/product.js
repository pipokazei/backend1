import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: Array,
});

mongoosePaginate.paginate.options = {
  customLabels: {
    docs: "payload",
    page: "currentPage",
    limit: false,
    pagingCounter: false,
    totalDocs: false,
  },
};

productSchema.plugin(mongoosePaginate);

const productModel = model(productCollection, productSchema);

export default productModel;
