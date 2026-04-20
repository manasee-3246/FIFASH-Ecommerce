import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);

  const cartItem = cart.find((item) => item._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const getImageSrc = (imagePath) => {
    if (!imagePath) {
      return "https://via.placeholder.com/400x500?text=No+Image";
    }

    let finalUrl = imagePath;

    if (
      !imagePath.startsWith("http://") &&
      !imagePath.startsWith("https://") &&
      !imagePath.startsWith("blob:")
    ) {
      finalUrl = `http://localhost:7002/uploads/${imagePath}`;
    }

    // Safety: only encode the part after the protocol to avoid double encoding http://
    if (finalUrl.startsWith("http")) {
      const url = new URL(finalUrl);
      url.pathname = encodeURI(decodeURI(url.pathname));
      return url.toString();
    }

    return finalUrl.startsWith("blob:") ? finalUrl : encodeURI(finalUrl);
  };

  const imageSrc = getImageSrc(product.image);

  return (
    <article className="product-card">
      <div className="product-media">
        <img src={imageSrc} alt={product.name} />
        <span className="product-tag">{product.tag || product.category}</span>
      </div>
      <div className="product-content">
        <div className="product-meta">
          <span>{product.category}</span>
          {product.size && <span>Size: {product.size}</span>}
          <span>{product.rating || 0} star</span>
        </div>
        <h3>{product.name}</h3>
        <div className="product-footer">
          <p>Rs. {product.price}</p>
          {quantity > 0 ? (
            <div className="quantity-selector">
              <button 
                className="quantity-btn" 
                onClick={() => quantity === 1 ? removeFromCart(product._id) : updateQuantity(product._id, quantity - 1)}
              >
                −
              </button>
              <span className="quantity-count">{quantity}</span>
              <button 
                className="quantity-btn" 
                onClick={() => addToCart(product)}
              >
                +
              </button>
            </div>
          ) : (
            <button className="product-button" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
