let cartId;

async function initCart() {
  cartId = localStorage.getItem("cartId");

  if (!cartId) {
    try {
      const res = await fetch("/api/carts", { method: "POST" });
      const data = await res.json();
      cartId = data._id;
      localStorage.setItem("cartId", cartId);
    } catch (err) {
      console.error("Error initializing cart:", err);
    }
  }
}

initCart();

window.getCartId = () => cartId;
