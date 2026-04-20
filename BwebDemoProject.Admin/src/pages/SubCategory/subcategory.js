import React, {
  useState,
  useEffect,
} from "react";

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

function SubCategory() {
  const [subCategories, setSubCategories] =
    useState([]);

  const [filteredSubCategories, setFilteredSubCategories] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [modal, setModal] =
    useState(false);

  const [editMode, setEditMode] =
    useState(false);

  const [editId, setEditId] =
    useState("");

  const [newSubCategory, setNewSubCategory] =
    useState({
      name: "",
      category: "",
    });

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  useEffect(() => {
  const result = subCategories.filter(
    (item) =>
      item.name
        .toLowerCase()
        .startsWith(
          search.toLowerCase()
        ) ||
      item.category
        .toLowerCase()
        .startsWith(
          search.toLowerCase()
        )
  );

  setFilteredSubCategories(result);

}, [search, subCategories]);

  const fetchSubCategories =
    async () => {
      const res = await axios.get(
        "http://localhost:7002/api/v1/subcategories"
      );

      setSubCategories(res.data);
      setFilteredSubCategories(
        res.data
      );
    };

  const fetchCategories =
    async () => {
      const res = await axios.get(
        "http://localhost:7002/api/v1/categories"
      );

      setCategories(res.data);
    };

  const toggleModal = () => {
    setModal(!modal);

    if (modal) {
      setEditMode(false);

      setEditId("");

      setNewSubCategory({
        name: "",
        category: "",
      });
    }
  };

  const addSubCategory =
    async () => {
      await axios.post(
        "http://localhost:7002/api/v1/subcategories/add",
        newSubCategory
      );

      fetchSubCategories();

      toggleModal();
    };

  const deleteSubCategory =
    async (id) => {
      await axios.delete(
        `http://localhost:7002/api/v1/subcategories/${id}`
      );

      fetchSubCategories();
    };

  const editSubCategory =
    (item) => {
      setEditMode(true);

      setEditId(item._id);

      setNewSubCategory({
        name: item.name,
        category:
          item.category,
      });

      setModal(true);
    };

  const updateSubCategory =
    async () => {
      await axios.put(
        `http://localhost:7002/api/v1/subcategories/${editId}`,
        newSubCategory
      );

      fetchSubCategories();

      toggleModal();
    };

  const columns = [
    {
      name: "Sr No",
      selector: (row, index) =>
        index + 1,
      width: "100px",
    },

    {
      name: "Category Name",
      selector: (row) =>
        row.category,
    },

    {
      name: "Sub Category Name",
      selector: (row) =>
        row.name,
    },

    {
      name: "Action",
      width: "220px",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button
            color="success"
            size="sm"
            onClick={() =>
              editSubCategory(
                row
              )
            }
          >
            Edit
          </Button>

          <Button
            color="danger"
            size="sm"
            onClick={() =>
              deleteSubCategory(
                row._id
              )
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
          title="Sub Category"
          pageTitle="Ecommerce"
        />

        <Row>
          <Col lg={12}>
            <Card>

              <CardHeader className="d-flex justify-content-between align-items-center flex-wrap">

                <h2>
                  Sub Category
                </h2>

                <div className="d-flex gap-3 align-items-center">

                  <div>
                    <Input
                      type="checkbox"
                      defaultChecked
                    />{" "}
                    Active
                  </div>

                  <Button
                    color="success"
                    onClick={
                      toggleModal
                    }
                  >
                    + Add
                  </Button>

                  <Input
                    placeholder="Search..."
                    style={{
                      width:
                        "250px",
                    }}
                    value={
                      search
                    }
                    onChange={(
                      e
                    ) =>
                      setSearch(
                        e.target
                          .value
                      )
                    }
                  />

                </div>

              </CardHeader>

              <CardBody>
                <DataTable
                  columns={columns}
                  data={
                    filteredSubCategories
                  }
                  pagination
                  highlightOnHover
                  responsive
                />
              </CardBody>

            </Card>
          </Col>
        </Row>

        <Modal isOpen={modal}>
          <ModalHeader
            toggle={toggleModal}
          >
            {editMode
              ? "Edit Sub Category"
              : "Add Sub Category"}
          </ModalHeader>

          <ModalBody>

            <Label>
              Category
            </Label>

            <Input
              type="select"
              value={
                newSubCategory.category
              }
              onChange={(e) =>
                setNewSubCategory(
                  {
                    ...newSubCategory,
                    category:
                      e.target
                        .value,
                  }
                )
              }
            >
              <option>
                Select Category
              </option>

              {categories.map(
                (cat) => (
                  <option
                    key={
                      cat._id
                    }
                    value={
                      cat.name
                    }
                  >
                    {
                      cat.name
                    }
                  </option>
                )
              )}

            </Input>

            <Label className="mt-3">
              Sub Category Name
            </Label>

            <Input
              value={
                newSubCategory.name
              }
              onChange={(e) =>
                setNewSubCategory(
                  {
                    ...newSubCategory,
                    name:
                      e.target
                        .value,
                  }
                )
              }
            />

          </ModalBody>

          <ModalFooter>

            {editMode ? (
              <Button
                color="success"
                onClick={
                  updateSubCategory
                }
              >
                Update
              </Button>
            ) : (
              <Button
                color="success"
                onClick={
                  addSubCategory
                }
              >
                Save
              </Button>
            )}

          </ModalFooter>

        </Modal>

      </Container>
    </div>
  );
}

export default SubCategory;