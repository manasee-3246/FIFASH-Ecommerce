import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Container,
  Row,
  Col,
} from "reactstrap";

import DataTable from "react-data-table-component";
import BreadCrumb from "../../Components/Common/BreadCrumb";

function BannerMaster() {
  const [banners, setBanners] =
    useState([]);

  const [modal, setModal] =
    useState(false);

  const [editMode, setEditMode] =
    useState(false);

  const [editId, setEditId] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [bannerData, setBannerData] =
    useState({
      title: "",
      subtitle: "",
      description: "",
      image: null,
    });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners =
    async () => {
      try {
        const res =
          await axios.get(
            "http://localhost:7002/api/v1/banner/all"
          );

        setBanners(
          res.data
            ? (Array.isArray(res.data) ? res.data : [res.data])
            : []
        );
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]);
      }
    };

  const handleChange =
    (e) => {
      setBannerData({
        ...bannerData,
        [e.target.name]:
          e.target.value,
      });
    };

  const handleImage =
    (e) => {
      setBannerData({
        ...bannerData,
        image:
          e.target.files[0],
      });
    };

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditMode(false);
      setEditId("");
      setBannerData({
        title: "",
        subtitle: "",
        image: null,
      });
    }
  };

  const editBanner = (item) => {
    setEditMode(true);
    setEditId(item._id);
    setBannerData({
      title: item.title || "",
      subtitle: item.subtitle || "",
      image: null,
    });
    setModal(true);
  };

  const saveBanner =
    async () => {
      try {
        const formData =
          new FormData();

        Object.keys(
          bannerData
        ).forEach((key) => {
          if (bannerData[key] !== null) {
            formData.append(
              key,
              bannerData[key]
            );
          }
        });

        if (editMode) {
          await axios.put(
            `http://localhost:7002/api/v1/banner/${editId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        } else {
          await axios.post(
            "http://localhost:7002/api/v1/banner/add",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }

        fetchBanners();
        setModal(false);
      } catch (error) {
        console.error("Error saving banner:", error);
        alert(error.response?.data?.message || "Error saving banner. Please check all fields.");
      }
    };

  const deleteBanner =
    async (id) => {
      await axios.delete(
        `http://localhost:7002/api/v1/banner/${id}`
      );

      fetchBanners();
    };

  const filteredBanners =
    banners.filter(
      (item) =>
        item?.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const columns = [
    {
      name: "Sr No",
      selector: (
        row,
        index
      ) => index + 1,
    },

    {
      name: "Title",
      selector: (row) =>
        row.title,
    },

    {
      name: "Subtitle",
      selector: (row) =>
        row.subtitle,
    },

    {
      name: "Image",
      cell: (row) => {
        const imgSrc = row.image || row.bannerImage;
        const validSrc = imgSrc && imgSrc.startsWith("http") ? imgSrc : `http://localhost:7002/${imgSrc || ""}`;
        return (
          <img
            src={validSrc}
            alt=""
            width="90"
            height="60"
            style={{
              borderRadius:
                "10px",
              objectFit:
                "cover",
            }}
          />
        );
      },
    },

    {
      name: "Action",
      cell: (row) => (
        <>
          <Button
            color="success"
            size="sm"
            className="me-2"
            onClick={() =>
              editBanner(row)
            }
          >
            Edit
          </Button>

          <Button
            color="danger"
            size="sm"
            onClick={() =>
              deleteBanner(
                row._id
              )
            }
          >
            Remove
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Banner Master" pageTitle="Master" />
        <Row>
          <Col lg={12}>
            <Card>

              <CardHeader className="border-bottom">

                <div className="d-flex justify-content-between align-items-center">

                  <h1 className="mb-0">
                    Banner Management
                  </h1>

                  <div className="d-flex gap-3">

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
                        width: "250px",
                      }}
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

              </CardHeader>

              <CardBody>

                <DataTable
                  columns={columns}
                  data={filteredBanners}
                  pagination
                />

              </CardBody>

              <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>
                  {editMode ? "Edit Banner" : "Add Banner"}
                </ModalHeader>

                <ModalBody>

                  <Label>
                    Title
                  </Label>

                  <Input
                    name="title"
                    value={bannerData.title}
                    onChange={
                      handleChange
                    }
                  />

                  <Label>
                    Subtitle
                  </Label>

                  <Input
                    name="subtitle"
                    value={bannerData.subtitle}
                    onChange={
                      handleChange
                    }
                  />

                  <Label>
                    Description
                  </Label>

                  <Label>
                    Upload Image
                  </Label>

                  <Input
                    type="file"
                    onChange={
                      handleImage
                    }
                  />

                </ModalBody>

                <ModalFooter>

                  <Button
                    color="success"
                    onClick={
                      saveBanner
                    }
                  >
                    {editMode ? "Update" : "Save"}
                  </Button>

                </ModalFooter>

              </Modal>

            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BannerMaster;