const socket = io();

const form = document.querySelector("#product-form");
const productList = document.querySelector("#product-list");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const product = Object.fromEntries(formData.entries());
  product.price = parseFloat(product.price);
  product.stock = parseInt(product.stock);

  socket.emit("new-product", product);
  form.reset();
});

socket.on("update-products", (products) => {
  productList.innerHTML = "";
  products.forEach((p) => {
    productList.innerHTML += `
      <li data-id="${p._id}">
        <strong>${p.title}</strong> - $${p.price}
        <button class="delete-btn">Delete</button>
      </li>
    `;
  });
});

productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest("li");
    const id = li.dataset.id;
    socket.emit("delete-product", id);
  }
});
