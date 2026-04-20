import React, { useContext, useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Label,
    Input,
} from "reactstrap";

import DataTable from "react-data-table-component";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import { toast } from "react-toastify";

import {
    createMenu,
    deleteMenu,
    getMenuById,
    updateMenu,
    getAllMenus,
    getAllMenuGroups,
} from "../../api/menus.api";

import Select from "react-select";
import { MenuContext } from "../../context/MenuContext";

const initialState = {
    menuName: "",
    menuUrl: "",
    sequence: "",
    isParent: false,
    isChild: false,
};

const MenuMaster = () => {
    const { currentPagePermissions } = useContext(MenuContext);

    const [values, setValues] = useState(initialState);
    const [menus, setMenus] = useState([]);
    const [menuGroups, setMenuGroups] = useState([]);

    const [modal_list, setmodal_list] = useState(false);

    const [selectedParentMenu, setSelectedParentMenu] = useState(null);
    const [selectedMenuGroup, setSelectedMenuGroup] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMenus();
        fetchMenuGroups();
    }, []);

    const fetchMenus = async () => {
        setLoading(true);
        try {
            const res = await getAllMenus();
            setMenus(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const fetchMenuGroups = async () => {
        try {
            const res = await getAllMenuGroups();
            setMenuGroups(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const tog_list = () => {
        setmodal_list(!modal_list);

        setValues(initialState);

        setSelectedParentMenu(null);

        setSelectedMenuGroup(null);
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
            await createMenu({
                ...values,
                parentMenu: selectedParentMenu?.value,
                menuGroup: selectedMenuGroup?.value,
            });

            toast.success("Menu Added Successfully");

            setmodal_list(false);

            fetchMenus();
        } catch (err) {
            toast.error("Add Failed");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteMenu(id);

            toast.success("Deleted");

            fetchMenus();
        } catch {
            toast.error("Delete Failed");
        }
    };

    const columns = [
        {
            name: "Menu Name",
            selector: (row) => row.menuName,
        },
        {
            name: "Menu URL",
            selector: (row) => row.menuUrl,
        },
        {
            name: "Sequence",
            selector: (row) => row.sequence,
        },
        {
            name: "Type",
            selector: (row) =>
                row.isParent
                    ? "Parent"
                    : row.isChild
                    ? "Child"
                    : "-",
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm px-3">
                        Edit
                    </button>

                    <button
                        className="btn btn-danger btn-sm px-3"
                        onClick={() => handleDelete(row._id)}
                    >
                        Remove
                    </button>
                </div>
            ),
            width: "220px",
        },
    ];

    return (
        <div className="page-content">
            <Container fluid>

                <BreadCrumb
                    title="Menu Master"
                    pageTitle="Master"
                />

                <Card>
                    <CardHeader>
                        <FormsHeader
                            formName="Menu Master"
                            tog_list={tog_list}
                        />
                    </CardHeader>

                    <CardBody>
                        <DataTable
                            columns={columns}
                            data={menus}
                            pagination
                            progressPending={loading}
                        />
                    </CardBody>
                </Card>

                <Modal
                    isOpen={modal_list}
                    toggle={tog_list}
                >
                    <ModalHeader toggle={tog_list}>
                        Add Menu
                    </ModalHeader>

                    <ModalBody>

                        <Label>Menu Group</Label>
                        <Select
                            options={menuGroups.map((group) => ({
                                value: group._id,
                                label: group.menuGroupName,
                            }))}
                            value={selectedMenuGroup}
                            onChange={setSelectedMenuGroup}
                        />

                        <Label className="mt-3">
                            Menu Name
                        </Label>
                        <Input
                            name="menuName"
                            value={values.menuName}
                            onChange={handleChange}
                        />

                        <Label className="mt-3">
                            Menu URL
                        </Label>
                        <Input
                            name="menuUrl"
                            value={values.menuUrl}
                            onChange={handleChange}
                        />

                        <Label className="mt-3">
                            Sequence
                        </Label>
                        <Input
                            type="number"
                            name="sequence"
                            value={values.sequence}
                            onChange={handleChange}
                        />

                        <div className="form-check mt-3">
                            <Input
                                type="checkbox"
                                name="isParent"
                                checked={values.isParent}
                                onChange={handleCheck}
                            />
                            <Label className="ms-2">
                                Parent Menu
                            </Label>
                        </div>

                        <div className="form-check mt-2">
                            <Input
                                type="checkbox"
                                name="isChild"
                                checked={values.isChild}
                                onChange={handleCheck}
                            />
                            <Label className="ms-2">
                                Child Menu
                            </Label>
                        </div>

                        {values.isChild && (
                            <>
                                <Label className="mt-3">
                                    Select Parent Menu
                                </Label>

                                <Select
                                    options={menus
                                        .filter((m) => m.isParent)
                                        .map((menu) => ({
                                            value: menu._id,
                                            label: menu.menuName,
                                        }))}
                                    value={selectedParentMenu}
                                    onChange={setSelectedParentMenu}
                                />
                            </>
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <FormsFooter
                            handleSubmit={handleClick}
                        />
                    </ModalFooter>
                </Modal>

            </Container>
        </div>
    );
};

export default MenuMaster;