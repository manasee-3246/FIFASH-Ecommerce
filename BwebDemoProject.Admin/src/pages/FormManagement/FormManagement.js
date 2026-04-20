import React, { useEffect, useState } from "react";
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
  Table,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const FormManagement = () => {
  const [forms, setForms] = useState([]);
  const [totalForms, setTotalForms] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [modal_add, setmodal_add] = useState(false);
  const [modal_edit, setmodal_edit] = useState(false);

  const [editData, setEditData] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const initialFormState = {
    First_name: "",
    Last_name: "",
    email: "",
    phone: "",
    Collage_Name: "",
    Degree: "",
    Semester: "",
    Branch: "",
    SPI: "",
    passing_year: "",
    image: "",
  };

  const [newForm, setNewForm] = useState(initialFormState);

  useEffect(() => {
    fetchForms();
  }, [currentPage, rowsPerPage, debouncedQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery]);

  const fetchForms = async () => {
    try {
      const endpoint = debouncedQuery
        ? "http://localhost:7002/api/v1/forms/search"
        : "http://localhost:7002/api/v1/forms";

      const res = await axios.get(endpoint, {
        params: {
          page: currentPage,
          limit: rowsPerPage,
          query: debouncedQuery || undefined,
        },
      });

      setForms(res.data.data);
      setTotalForms(res.data.total);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.log(error);
    }
  };

  const indexOfFirstRow =
    totalForms === 0 ? 0 : (currentPage - 1) * rowsPerPage;

  const indexOfLastRow =
    totalForms === 0
      ? 0
      : indexOfFirstRow + forms.length;

  const addForm = async () => {
    try {
      const formData = new FormData();

      Object.keys(newForm).forEach((key) => {
        formData.append(key, newForm[key]);
      });

      await axios.post(
        "http://localhost:7002/api/v1/forms/submit",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setmodal_add(false);
      fetchForms();
      setNewForm(initialFormState);
    } catch (error) {
      alert(error.response?.data?.msg);
    }
  };

  const deleteForm = async (id) => {
    await axios.delete(
      `http://localhost:7002/api/v1/forms/${id}`
    );

    fetchForms();
  };

  const handleEdit = (row) => {
    setEditData(row);
    setmodal_edit(true);
  };

  const updateForm = async () => {
    await axios.put(
      `http://localhost:7002/api/v1/forms/${editData._id}`,
      editData
    );

    setmodal_edit(false);
    fetchForms();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    return `http://localhost:7002/uploads/${imagePath}`;
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          maintitle="Forms"
          title="Form Management"
          pageTitle="Forms"
        />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <h2>Form Management</h2>

                  <div className="d-flex gap-2 align-items-center">
                    <button
                      onClick={() =>
                        setmodal_add(true)
                      }
                      style={{
                        backgroundColor:
                          "#198754",
                        color: "white",
                        padding:
                          "10px 18px",
                        borderRadius: "8px",
                        border: "none",
                      }}
                    >
                      + Add
                    </button>

                    <Input
                      placeholder="Search..."
                      value={query}
                      onChange={(e) =>
                        setQuery(
                          e.target.value
                        )
                      }
                      style={{
                        width: "220px",
                      }}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>College</th>
                      <th>Degree</th>
                      <th>Semester</th>
                      <th>Branch</th>
                      <th>SPI</th>
                      <th>Passing Year</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {forms.map(
                      (row, index) => (
                        <tr
                          key={row._id}
                        >
                          <td>
                            {indexOfFirstRow +
                              index +
                              1}
                          </td>
                          <td>
                            {
                              row.First_name
                            }
                          </td>
                          <td>
                            {
                              row.Last_name
                            }
                          </td>
                          <td>
                            {row.email}
                          </td>
                          <td>
                            {row.phone}
                          </td>
                          <td>
                            {
                              row.Collage_Name
                            }
                          </td>
                          <td>
                            {row.Degree}
                          </td>
                          <td>
                            {
                              row.Semester
                            }
                          </td>
                          <td>
                            {row.Branch}
                          </td>
                          <td>
                            {row.SPI}
                          </td>
                          <td>
                            {
                              row.passing_year
                            }
                          </td>

                          <td>
                            {row.image ? (
                              <a
                                href={getImageUrl(
                                  row.image
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <button
                                  className="btn btn-primary btn-sm"
                                  style={{
                                    minWidth:
                                      "70px",
                                    borderRadius:
                                      "6px",
                                  }}
                                >
                                  View
                                </button>
                              </a>
                            ) : (
                              "No Image"
                            )}
                          </td>

                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems:
                                  "center",
                                gap: "10px",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                handleEdit(
                                  row
                                )
                              }
                              style={{
                                width: "54px",
                                height: "38px",
                                padding: "6px 0",
                                borderRadius:
                                  "6px",
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                deleteForm(
                                  row._id
                                )
                              }
                              style={{
                                width: "82px",
                                height: "38px",
                                padding: "6px 0",
                                borderRadius:
                                  "6px",
                              }}
                            >
                              Remove
                            </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>

                {/* Pagination */}
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "flex-end",
                    alignItems:
                      "center",
                    gap: "15px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <span>
                    Rows per page:
                  </span>

                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(
                        Number(
                          e.target.value
                        )
                      );
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>
                      5
                    </option>
                    <option value={10}>
                      10
                    </option>
                    <option value={25}>
                      25
                    </option>
                    <option value={100}>
                      100
                    </option>
                  </select>

                  <span>
                    {totalForms === 0
                      ? "0-0"
                      : `${indexOfFirstRow + 1}-${indexOfLastRow}`}{" "}
                    of {totalForms}
                  </span>

                  <button
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setCurrentPage(1)
                    }
                    style={{
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      background:
                        "transparent",
                      color:
                        currentPage === 1
                          ? "#c8ced8"
                          : "#9aa5b5",
                      fontSize: "18px",
                      padding: "4px 6px",
                    }}
                  >
                    {"<<"}
                  </button>

                  <button
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage - 1
                      )
                    }
                    style={{
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      background:
                        "transparent",
                      color:
                        currentPage === 1
                          ? "#c8ced8"
                          : "#9aa5b5",
                      fontSize: "18px",
                      padding: "4px 6px",
                    }}
                  >
                    {"<"}
                  </button>

                  <button
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage + 1
                      )
                    }
                    style={{
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      background:
                        "transparent",
                      color:
                        currentPage ===
                        totalPages
                          ? "#c8ced8"
                          : "#9aa5b5",
                      fontSize: "18px",
                      padding: "4px 6px",
                    }}
                  >
                    {">"}
                  </button>

                  <button
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        totalPages
                      )
                    }
                    style={{
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      background:
                        "transparent",
                      color:
                        currentPage ===
                        totalPages
                          ? "#c8ced8"
                          : "#9aa5b5",
                      fontSize: "18px",
                      padding: "4px 6px",
                    }}
                  >
                    {">>"}
                  </button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ADD MODAL */}
      <Modal isOpen={modal_add}>
        <ModalHeader
          toggle={() =>
            setmodal_add(false)
          }
        >
          Add Record
        </ModalHeader>

        <ModalBody>
          {Object.keys(
            initialFormState
          ).map((field) => (
            <div
              key={field}
              className="mb-2"
            >
              <Label>{field}</Label>

              {field === "image" ? (
                <Input
                  type="file"
                  onChange={(e) =>
                    setNewForm({
                      ...newForm,
                      image:
                        e.target
                          .files[0],
                    })
                  }
                />
              ) : (
                <Input
                  value={
                    newForm[field]
                  }
                  onChange={(e) =>
                    setNewForm({
                      ...newForm,
                      [field]:
                        e.target
                          .value,
                    })
                  }
                />
              )}
            </div>
          ))}
        </ModalBody>

        <ModalFooter>
          <button
            className="btn btn-success"
            onClick={addForm}
          >
            Save
          </button>
        </ModalFooter>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={modal_edit}>
        <ModalHeader
          toggle={() =>
            setmodal_edit(false)
          }
        >
          Edit Record
        </ModalHeader>

        <ModalBody>
          {Object.keys(
            initialFormState
          )
            .filter(
              (field) =>
                field !== "image"
            )
            .map((field) => (
              <div
                key={field}
                className="mb-2"
              >
                <Label>{field}</Label>

                <Input
                  value={
                    editData[
                      field
                    ] || ""
                  }
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      [field]:
                        e.target
                          .value,
                    })
                  }
                />
              </div>
            ))}
        </ModalBody>

        <ModalFooter>
          <button
            className="btn btn-success"
            onClick={updateForm}
          >
            Update
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default FormManagement;
