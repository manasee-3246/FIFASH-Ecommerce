import React, { useContext, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Row,
} from "reactstrap";

import DataTable from "react-data-table-component";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import FormUpdateFooter from "../../Components/Common/FormUpdateFooter";
import { toast } from "react-toastify";

import {
  createMenuGroup,
  deleteMenuGroup,
  getMenuGroupById,
  updateMenuGroup,
  searchMenuGroups,
} from "../../api/menus.api";

import { MenuContext } from "../../context/MenuContext";
import IconPicker from "../../Components/Common/IconPicker";

const initialState = {
  menuGroupName: "",
  sequence: "",
  isActive: false,
  isLink: false,
  menuUrl: "",
  icon: "",
};

const MenuGroup = () => {
  const { currentPagePermissions } = useContext(MenuContext);

  const [values, setValues] = useState(initialState);
  const [departments, setDepartments] = useState([]);

  const [modal_list, setmodal_list] = useState(false);
  const [modal_edit, setmodal_edit] = useState(false);

  const [_id, set_Id] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);

    try {
      const response = await searchMenuGroups({});

      if (response.data.data.length > 0) {
        setDepartments(response.data.data[0].data);
      } else {
        setDepartments([]);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const tog_list = () => {
    setmodal_list(!modal_list);
    setValues(initialState);
  };

  const handleTog_edit = (_id) => {
    setmodal_edit(!modal_edit);
    set_Id(_id);

    getMenuGroupById(_id)
      .then((res) => {
        setValues({
          menuGroupName: res.data.data.menuGroupName,
          sequence: res.data.data.sequence,
          isActive: res.data.data.isActive,
          isLink: res.data.data.isLink,
          menuUrl: res.data.data.menuUrl,
          icon: res.data.data.icon || "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheck = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await createMenuGroup(values);

      toast.success("Menu Group Added Successfully");

      setmodal_list(false);

      setValues(initialState);

      fetchDepartments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateMenuGroup(_id, values);

      toast.success("Menu Group Updated Successfully");

      setmodal_edit(false);

      fetchDepartments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDirectDelete = async (id) => {
    try {
      await deleteMenuGroup(id);

      toast.success("Menu Group Deleted Successfully");

      fetchDepartments();
    } catch (err) {
      console.log(err);

      toast.error("Delete Failed");
    }
  };

  const col = [
    {
      name: "Sr No",
      selector: (row, index) => index + 1,
    },
    {
      name: "Menu Group Name",
      selector: (row) => row.menuGroupName,
    },
    {
      name: "Sequence",
      selector: (row) => row.sequence,
    },
    {
      name: "Status",
      selector: (row) => (row.isActive ? "Active" : "Inactive"),
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="d-flex gap-2">

            {currentPagePermissions.edit && (
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleTog_edit(row._id)}
              >
                Edit
              </button>
            )}

            {currentPagePermissions.delete && (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDirectDelete(row._id)}
              >
                Remove
              </button>
            )}

          </div>
        );
      },
    },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Menu Group" pageTitle="Master" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <FormsHeader
                  formName="Menu Group"
                  tog_list={tog_list}
                />
              </CardHeader>

              <CardBody>
                <DataTable
                  columns={col}
                  data={departments}
                  progressPending={loading}
                  pagination
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* ADD MODAL */}
        <Modal isOpen={modal_list} toggle={tog_list}>
          <ModalHeader toggle={tog_list}>
            Add Menu Group
          </ModalHeader>

          <ModalBody>
            <Input
              name="menuGroupName"
              placeholder="Menu Group Name"
              value={values.menuGroupName}
              onChange={handleChange}
            />

            <Input
              className="mt-2"
              name="sequence"
              placeholder="Sequence"
              value={values.sequence}
              onChange={handleChange}
            />
          </ModalBody>

          <ModalFooter>
            <FormsFooter handleSubmit={handleClick} />
          </ModalFooter>
        </Modal>

        {/* EDIT MODAL */}
        <Modal isOpen={modal_edit} toggle={handleTog_edit}>
          <ModalHeader toggle={handleTog_edit}>
            Edit Menu Group
          </ModalHeader>

          <ModalBody>
            <Input
              name="menuGroupName"
              value={values.menuGroupName}
              onChange={handleChange}
            />

            <Input
              className="mt-2"
              name="sequence"
              value={values.sequence}
              onChange={handleChange}
            />
          </ModalBody>

          <ModalFooter>
            <FormUpdateFooter handleUpdate={handleUpdate} />
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default MenuGroup;