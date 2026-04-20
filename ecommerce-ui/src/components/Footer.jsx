import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__intro">
        <p className="footer__eyebrow">Fashion House</p>
        <h2>FIFASH</h2>
        <p className="footer__copy">
          Crafted for modern wardrobes with premium essentials, elegant
          silhouettes, and a polished shopping experience.
        </p>
      </div>

      <div className="footer__grid">
        <div className="footer__column">
          <h3>Shop</h3>
          <a href="/">Women</a>
          <a href="/">Men</a>
          <a href="/">Accessories</a>
          <a href="/">New Arrivals</a>
        </div>

        <div className="footer__column">
          <h3>About</h3>
          <a href="/">Our Story</a>
          <a href="/">Collections</a>
          <a href="/">Lookbook</a>
          <a href="/">Journal</a>
        </div>

        <div className="footer__column">
          <h3>Support</h3>
          <a href="/">Shipping</a>
          <a href="/">Returns</a>
          <a href="/">FAQ</a>
          <a href="/">Contact</a>
        </div>

        <div className="footer__column footer__column--feature">
          <h3>Visit Studio</h3>
          <p>22 Fashion Avenue, New Delhi</p>
          <p>Mon - Sat, 10:00 AM - 8:00 PM</p>
          <a href="/">Book a private styling session</a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; 2026 FIFASH. All rights reserved.</p>
        <div className="footer__bottom-links">
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
