import {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";

import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import SubCategory from "../components/SubCategory";
import "../styles/Home.css";

function Home() {
  const [products, setProducts] =
    useState([]);

  const [filteredProducts,
    setFilteredProducts] =
    useState([]);

  const [subCategories,
    setSubCategories] =
    useState([]);

  const [selectedCategory,
    setSelectedCategory] =
    useState("All");

  const [selectedSubCategory,
    setSelectedSubCategory] =
    useState("All");

  const [selectedSize,
    setSelectedSize] =
    useState("All");

  const [sizes, setSizes] = useState([]);

  const productsRef =
    useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchSubCategories();
    fetchSizes();
  }, []);

  const fetchProducts =
    async () => {
      const res =
        await axios.get(
          "http://localhost:7002/api/v1/products"
        );

      setProducts(res.data);
      setFilteredProducts(
        res.data
      );
    };

  const fetchSubCategories =
    async () => {
      const res =
        await axios.get(
          "http://localhost:7002/api/v1/subcategories"
        );

      setSubCategories(
        res.data
      );
    };

  const fetchSizes = async () => {
    try {
      const res = await axios.get("http://localhost:7002/api/v1/size");
      setSizes(res.data);
    } catch (error) {
      console.error("Failed to fetch sizes:", error);
    }
  };

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedSubCategory !== "All") {
      filtered = filtered.filter((item) => item.subCategory === selectedSubCategory);
    }

    if (selectedSize !== "All") {
      filtered = filtered.filter((item) => item.size === selectedSize);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedSubCategory, selectedSize]);

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory("All");
    setSelectedSize("All");

    // Auto-scroll down to products grid when a category is clicked
    setTimeout(() => {
      productsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const filterBySubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  return (
    <div className="page-shell">
      <Navbar
        filterByCategory={
          filterByCategory
        }
      />

      <Banner />

      <SubCategory
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        subCategories={subCategories}
        filterByCategory={filterByCategory}
        filterBySubCategory={filterBySubCategory}
      />

      <div className="size-dropdown-wrapper">
        <select
          className="size-dropdown"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          <option value="All">All Sizes</option>
          {sizes.map((size) => (
            <option key={size._id} value={size.sizeName}>
              {size.sizeName}
            </option>
          ))}
        </select>
      </div>
      <section
        className="products-section"
        ref={productsRef}
      >
        <div className="products-grid">
          {filteredProducts.map(
            (
              item
            ) => (
              <ProductCard
                key={
                  item._id
                }
                product={
                  item
                }
              />
            )
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;