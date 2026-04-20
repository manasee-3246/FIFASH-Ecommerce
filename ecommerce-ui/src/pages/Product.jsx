
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Product.css";

function Product() {
  return (
    <>
      <Navbar />

      <section className="products">
        <h1>Our Collection</h1>

        <div className="product-grid">

          <div className="card">
            <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" />
            <h3>Premium Jacket</h3>
            <p>$120</p>
          </div>

          <div className="card">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" />
            <h3>Running Shoes</h3>
            <p>$90</p>
          </div>

          <div className="card">
            <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500" />
            <h3>Luxury Watch</h3>
            <p>$180</p>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default Product;

