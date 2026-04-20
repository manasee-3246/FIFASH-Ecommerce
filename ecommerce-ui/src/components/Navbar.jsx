import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Navbar({
  filterByCategory,
}) {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="navbar">

      <Link
        to="/"
        className="brand-mark"
      >
        FIFASH
      </Link>
      <div className="nav-links">
      <a href="#"        onClick={(e) => {e.preventDefault();
            filterByCategory(
              "All"
            );
          }}
        >
          All
        </a>
     

     

        <a
          href="#products-section"
          onClick={(e) => {
            e.preventDefault();
            filterByCategory(
              "Men"
            );
          }}
        >
          Men
        </a>

        <a
          href="#products-section"
          onClick={(e) => {
            e.preventDefault();
            filterByCategory(
              "Women"
            );
          }}
        >
          Women
        </a>

        <a
          href="#products-section"
          onClick={(e) => {
            e.preventDefault();
            filterByCategory(
              "Kids"
            );
          }}
        >
          Kids
        </a>

      </div>
      <div className="nav-actions">
        {user ? (
          <div className="user-profile-nav">
             <div className="profile-icon">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
             </div>
             <button onClick={handleLogout} className="nav-logout-btn">
                Logout
             </button>
          </div>
        ) : (
          <>
            <Link
              to="/register"
              className="nav-register"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="nav-login"
            >
              Login
            </Link>
          </>
        )}

        <Link to="/cart">
          <button className="bag-button">
            <div className="bag-button__icon">🛒</div>
            <span className="bag-button__count" style={{ marginLeft: "5px", fontWeight: "bold" }}>
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </button>
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;