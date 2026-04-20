import React, { useState, useEffect } from "react";
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
import axios from "axios";

function Category() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] =
    useState([]);

  const [search, setSearch] = useState("");

  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");

  const [newCategory, setNewCategory] = useState({
    name: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const result = categories.filter((item) =>
      item.name
        .toLowerCase()
        .startsWith(search.toLowerCase())
    );

    setFilteredCategories(result);
  }, [search, categories]);

  const fetchCategories = async () => {
    const res = await axios.get(
      "http://localhost:7002/api/v1/categories"
    );

    setCategories(res.data);
    setFilteredCategories(res.data);
  };

  const toggleModal = () => {
    setModal(!modal);

    if (modal) {
      setEditMode(false);
      setEditId("");

      setNewCategory({
        name: "",
      });
    }
  };

  const handleChange = (e) => {
    setNewCategory({
      ...newCategory,
      [e.target.name]: e.target.value,
    });
  };

  const addCategory = async () => {
    await axios.post(
      "http://localhost:7002/api/v1/categories/add",
      newCategory
    );

    fetchCategories();
    toggleModal();
  };

  const deleteCategory = async (id) => {
    await axios.delete(
      `http://localhost:7002/api/v1/categories/${id}`
    );

    fetchCategories();
  };

  const editCategory = (item) => {
    setEditMode(true);
    setEditId(item._id);

    setNewCategory({
      name: item.name,
    });

    setModal(true);
  };

  const updateCategory = async () => {
    await axios.put(
      `http://localhost:7002/api/v1/categories/${editId}`,
      newCategory
    );

    fetchCategories();
    toggleModal();
  };

  const columns = [
    {
      name: "Sr No",
      selector: (row, index) => index + 1,
      width: "100px",
    },
    {
      name: "Category Name",
      selector: (row) => row.name,
    },
    {
      name: "Action",
      width: "220px",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button
            color="success"
            size="sm"
            onClick={() => editCategory(row)}
          >
            Edit
          </Button>

          <Button
            color="danger"
            size="sm"
            onClick={() =>
              deleteCategory(row._id)
            }
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title="Category"
          pageTitle="Ecommerce"
        />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center flex-wrap">

                <h2>Category Management</h2>

                <div className="d-flex gap-3">

                  <Button
                    color="success"
                    onClick={toggleModal}
                  >
                    + Add
                  </Button>

                  <Input
                    placeholder="Search Category..."
                    style={{ width: "250px" }}
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                </div>
              </CardHeader>

              <CardBody>
                <DataTable
                  columns={columns}
                  data={filteredCategories}
                  pagination
                  highlightOnHover
                  responsive
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal isOpen={modal}>
          <ModalHeader toggle={toggleModal}>
            {editMode
              ? "Edit Category"
              : "Add Category"}
          </ModalHeader>

          <ModalBody>
            <Label>Category Name</Label>

            <Input
              name="name"
              value={newCategory.name}
              onChange={handleChange}
            />
          </ModalBody>

          <ModalFooter>
            {editMode ? (
              <Button
                color="success"
                onClick={updateCategory}
              >
                Update
              </Button>
            ) : (
              <Button
                color="success"
                onClick={addCategory}
              >
                Save
              </Button>
            )}

            <Button
              color="secondary"
              onClick={toggleModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
}

export default Category;