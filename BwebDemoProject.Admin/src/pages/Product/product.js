import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Button,
} from "reactstrap";
import DataTable from "react-data-table-component";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { API_V1_BASE_URL, buildAssetUrl } from "../../utils/api";

function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    subCategory: "",
    size: "",
    image: null,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubCategories();
    fetchSizes();
  }, []);

  useEffect(() => {
    const result = products.filter(
      (item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        item.subCategory?.toLowerCase().includes(search.toLowerCase()) ||
        item.size?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(result);
  }, [search, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_V1_BASE_URL}/products`);
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_V1_BASE_URL}/categories`);
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${API_V1_BASE_URL}/subcategories`);
      setSubCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSizes = async () => {
    try {
      const res = await axios.get(`${API_V1_BASE_URL}/size`);
      setSizes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (e) => {
    setNewProduct({
      ...newProduct,
      image: e.target.files[0],
    });
  };

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setEditMode(false);
      setEditId("");
      setNewProduct({
        name: "",
        price: "",
        category: "",
        subCategory: "",
        size: "",
        image: null,
      });
    }
  };

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const addProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("subCategory", newProduct.subCategory);
      formData.append("size", newProduct.size);
      formData.append("image", newProduct.image);

      await axios.post(`${API_V1_BASE_URL}/products/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchProducts();
      toggleModal();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_V1_BASE_URL}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const editProduct = (item) => {
    setEditMode(true);
    setEditId(item._id);
    setNewProduct({
      name: item.name || "",
      price: item.price || "",
      category: item.category || "",
      subCategory: item.subCategory || "",
      size: item.size || "",
      image: null,
    });
    setModal(true);
  };

  const updateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("subCategory", newProduct.subCategory);
      formData.append("size", newProduct.size);

      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }

      await axios.put(`${API_V1_BASE_URL}/products/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchProducts();
      toggleModal();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "Sr No",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={buildAssetUrl(row.image)}
          alt="product"
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
      ),
    },
    {
      name: "Product Name",
      selector: (row) => row.name,
    },
    {
      name: "Price",
      selector: (row) => row.price,
    },
    {
      name: "Category",
      selector: (row) => row.category,
    },
    {
      name: "Sub Category",
      selector: (row) => row.subCategory,
    },
    {
      name: "Size",
      selector: (row) => row.size,
    },
    {
      name: "Action",
      width: "220px",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button color="success" size="sm" onClick={() => editProduct(row)}>
            Edit
          </Button>
          <Button color="danger" size="sm" onClick={() => deleteProduct(row._id)}>
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Product" pageTitle="Ecommerce" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center flex-wrap">
                <h2>Product Management</h2>
                <div className="d-flex gap-3">
                  <Button color="success" onClick={toggleModal}>
                    + Add
                  </Button>
                  <Input
                    placeholder="Search Product, Size..."
                    style={{ width: "250px" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardBody>
                <DataTable
                  columns={columns}
                  data={filteredProducts}
                  pagination
                  responsive
                  highlightOnHover
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal isOpen={modal}>
          <ModalHeader toggle={toggleModal}>
            {editMode ? "Edit Product" : "Add Product"}
          </ModalHeader>
          <ModalBody>
            <Label>Product Name</Label>
            <Input name="name" value={newProduct.name} onChange={handleChange} />

            <Label className="mt-3">Price</Label>
            <Input name="price" value={newProduct.price} onChange={handleChange} />

            <Label className="mt-3">Category</Label>
            <Input type="select" name="category" value={newProduct.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Input>

            <Label className="mt-3">Sub Category</Label>
            <Input type="select" name="subCategory" value={newProduct.subCategory} onChange={handleChange}>
              <option value="">Select SubCategory</option>
              {subCategories
                .filter((sub) => sub.category === newProduct.category)
                .map((sub) => (
                  <option key={sub._id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
            </Input>

            <Label className="mt-3">Size</Label>
            <Input type="select" name="size" value={newProduct.size} onChange={handleChange}>
              <option value="">Select Size</option>
              {sizes
                .filter((s) => s.isActive)
                .map((s) => (
                  <option key={s._id} value={s.sizeName}>
                    {s.sizeName} ({s.sizeCode})
                  </option>
                ))}
            </Input>

            <Label className="mt-3">Upload Image</Label>
            <Input type="file" onChange={handleImageUpload} />
          </ModalBody>
          <ModalFooter>
            {editMode ? (
              <Button color="success" onClick={updateProduct}>
                Update
              </Button>
            ) : (
              <Button color="success" onClick={addProduct}>
                Save
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
}

export default Product;
