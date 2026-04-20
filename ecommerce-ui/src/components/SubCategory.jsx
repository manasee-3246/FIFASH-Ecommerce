function SubCategory({
  selectedCategory,
  selectedSubCategory,
  subCategories,
  filterByCategory,
  filterBySubCategory,
}) {
  if (
    selectedCategory ===
    "All"
  ) {
    return null;
  }

  return (
    <div className="subcategory-container">

      <h2 className="subcategory-heading">
        Browse {selectedCategory}
      </h2>

      <div className="subcategory-wrapper">

        <button
          className={`subcategory-btn ${selectedSubCategory === "All" ? "active" : ""}`}
          onClick={() =>
            filterByCategory(
              selectedCategory
            )
          }
        >
          All
        </button>

        {subCategories
          .filter(
            (sub) =>
              sub.category ===
              selectedCategory
          )
          .map((sub) => (
            <button
              key={sub._id}
              className={`subcategory-btn ${selectedSubCategory === sub.name ? "active" : ""}`}
              onClick={() =>
                filterBySubCategory(
                  sub.name
                )
              }
            >
              {sub.name}
            </button>
          ))}

      </div>

    </div>
  );
}

export default SubCategory;