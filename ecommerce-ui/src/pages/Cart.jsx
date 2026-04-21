import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Home.css"; // Reuse existing layout styles

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="page-shell">
      <Navbar filterByCategory={() => { }} />

      <main style={{ padding: "40px", flex: 1, backgroundColor: "#f9f8f6" }}>
        <h2 style={{ fontSize: "32px", color: "#5a4a3e", marginBottom: "30px" }}>Shopping Cart</h2>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <h3 style={{ color: "#8e7e70" }}>Your cart is empty</h3>
            <Link to="/" style={{ display: "inline-block", marginTop: "20px", padding: "10px 20px", backgroundColor: "#8c6e5d", color: "#fff", textDecoration: "none", borderRadius: "5px" }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>

            <div style={{ flex: "2", minWidth: "300px" }}>
              {cart.map((item) => (
                <div key={item._id} style={{ display: "flex", gap: "20px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                  <img src={buildAssetUrl(item.image)} alt={item.name} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }} />

                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>{item.name}</h4>
                    <p style={{ margin: "0 0 15px 0", color: "#8e7e70" }}>Rs. {item.price}</p>

                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "5px", overflow: "hidden" }}>
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ padding: "5px 12px", border: "none", background: "#f0f0f0", cursor: "pointer" }}>-</button>
                        <span style={{ padding: "5px 15px", background: "#fff" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ padding: "5px 12px", border: "none", background: "#f0f0f0", cursor: "pointer" }}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} style={{ padding: "6px 12px", border: "none", backgroundColor: "#dc3545", color: "#fff", borderRadius: "5px", cursor: "pointer", fontSize: "12px" }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ flex: "1", minWidth: "300px" }}>
              <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin: "0 0 20px 0", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>Order Summary</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#666" }}>
                  <span>Subtotal ({cart.reduce((acc, curr) => acc + curr.quantity, 0)} items)</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", color: "#666" }}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", fontWeight: "bold", fontSize: "20px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                  <span>Total</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
                <button style={{ width: "100%", padding: "15px", backgroundColor: "#8c6e5d", color: "#fff", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} onClick={() => alert("Checkout flow not implemented yet!")}>
                  Proceed to Checkout
                </button>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Cart;
import { buildAssetUrl } from "../utils/assets";
