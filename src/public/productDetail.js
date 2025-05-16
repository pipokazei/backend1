(async () => {
  let cartId = localStorage.getItem("cartId");

  if (!cartId) {
    const res = await fetch("/api/carts", { method: "POST" });
    const data = await res.json();
    cartId = data._id;
    localStorage.setItem("cartId", cartId);
  }

  document.querySelectorAll(".addToCartBtn").forEach((btn) => {
    btn.addEventListener("click", () =>
      handleAddToCart(btn.dataset.id, cartId)
    );
  });

  const singleBtn = document.getElementById("addToCartBtn");
  if (singleBtn) {
    singleBtn.addEventListener("click", () =>
      handleAddToCart(singleBtn.dataset.id, cartId)
    );
  }

  async function handleAddToCart(productId, cartId) {
    if (!cartId || !productId) {
      alert("No se pudo encontrar el carrito o producto.");
      return;
    }

    try {
      const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Error agregando al carrito");

      alert("Producto agregado al carrito");
    } catch (err) {
      console.error(err);
      alert("Error agregando producto");
    }
  }
})();
