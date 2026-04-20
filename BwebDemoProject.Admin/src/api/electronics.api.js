const API_URL = "http://localhost:5000/api";

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  return await res.json();
}

export async function addProduct(product) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
  return await res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
  return await res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE"
  });
  return await res.json();
}
