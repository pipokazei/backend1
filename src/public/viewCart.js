const cartId = localStorage.getItem("cartId");

document.querySelectorAll(".remove-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const productId = btn.dataset.id;

    if (!cartId || !productId) {
      alert("No se encontró el carrito o el producto.");
      return;
    }

    try {
      const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        location.reload();
      } else {
        alert("Error al eliminar producto del carrito");
      }
    } catch (error) {
      alert("Error al eliminar producto del carrito");
      console.error(error);
    }
  });
});

document.getElementById("clearCartBtn")?.addEventListener("click", async () => {
  if (!cartId) {
    alert("No se encontró el carrito.");
    return;
  }

  try {
    const res = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      location.reload();
    } else {
      alert("Error al vaciar carrito");
    }
  } catch (error) {
    alert("Error al vaciar carrito");
    console.error(error);
  }
});
