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
  Badge,
} from "reactstrap";
import DataTable from "react-data-table-component";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { API_V1_BASE_URL } from "../../utils/api";

function SizeMaster() {
  const [sizes, setSizes] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");

  const [formData, setFormData] = useState({
    sizeName: "",
    sizeCode: "",
    displayOrder: "",
    isActive: true,
  });

  useEffect(() => {
    fetchSizes();
  }, []);

  useEffect(() => {
    const result = sizes.filter((item) =>
      item.sizeName?.toLowerCase().includes(search.toLowerCase()) ||
      item.sizeCode?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSizes(result);
  }, [search, sizes]);

  const fetchSizes = async () => {
    try {
      const res = await axios.get(`${API_V1_BASE_URL}/size`);
      setSizes(res.data);
      setFilteredSizes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setEditMode(false);
      setEditId("");
      setFormData({
        sizeName: "",
        sizeCode: "",
        displayOrder: "",
        isActive: true,
      });
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSelectChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value === "true",
    });
  };

  const addSize = async () => {
    try {
      await axios.post(`${API_V1_BASE_URL}/size/add`, formData);
      fetchSizes();
      toggleModal();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSize = async (id) => {
    try {
      await axios.delete(`${API_V1_BASE_URL}/size/${id}`);
      fetchSizes();
    } catch (error) {
      console.log(error);
    }
  };

  const editSize = (item) => {
    setEditMode(true);
    setEditId(item._id);
    setFormData({
      sizeName: item.sizeName || "",
      sizeCode: item.sizeCode || "",
      displayOrder: item.displayOrder || "",
      isActive: item.isActive,
    });
    setModal(true);
  };

  const updateSize = async () => {
    try {
      await axios.put(`${API_V1_BASE_URL}/size/${editId}`, formData);
      fetchSizes();
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
      name: "Size Name",
      selector: (row) => row.sizeName,
    },
    {
      name: "Size Code",
      selector: (row) => row.sizeCode,
    },
    {
      name: "Display Order",
      selector: (row) => row.displayOrder,
    },
    {
      name: "Status",
      cell: (row) => (
        <Badge color={row.isActive ? "success" : "danger"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      name: "Action",
      width: "220px",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button color="success" size="sm" onClick={() => editSize(row)}>
            Edit
          </Button>
          <Button color="danger" size="sm" onClick={() => deleteSize(row._id)}>
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Size" pageTitle="Ecommerce" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center flex-wrap">
                <h2>Size Master</h2>
                <div className="d-flex gap-3">
                  <Button color="success" onClick={toggleModal}>
                    + Add
                  </Button>
                  <Input
                    placeholder="Search Size or Code..."
                    style={{ width: "250px" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardBody>
                <DataTable
                  columns={columns}
                  data={filteredSizes}
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
            {editMode ? "Edit Size" : "Add Size"}
          </ModalHeader>
          <ModalBody>
            <Label>Size Name</Label>
            <Input 
              name="sizeName" 
              placeholder="e.g. Medium" 
              value={formData.sizeName} 
              onChange={handleChange} 
            />

            <Label className="mt-3">Size Code</Label>
            <Input 
              name="sizeCode" 
              placeholder="e.g. M" 
              value={formData.sizeCode} 
              onChange={handleChange} 
            />

            <Label className="mt-3">Display Order</Label>
            <Input 
              type="number" 
              name="displayOrder" 
              placeholder="e.g. 2" 
              value={formData.displayOrder} 
              onChange={handleChange} 
            />

            <Label className="mt-3">Status</Label>
            <Input 
              type="select" 
              name="isActive" 
              value={formData.isActive} 
              onChange={handleSelectChange}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </Input>
          </ModalBody>
          <ModalFooter>
            {editMode ? (
              <Button color="success" onClick={updateSize}>
                Update
              </Button>
            ) : (
              <Button color="success" onClick={addSize}>
                Save
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
}

export default SizeMaster;
