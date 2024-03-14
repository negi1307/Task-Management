import React, { useState, useEffect } from 'react';
import { Row, Button, Col, Form, Card, Table, CloseButton, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CreateCategory from './modal/create';
import { deleteTechnologyCategory, getAllTechnologyCategory, updateTechnologyCategory } from '../../../redux/technology/action';
import CategoryUpdate from './modal/update';
import { Modal } from 'react-bootstrap';
import ToastHandle from '../../../constants/toaster/toaster';
import MainLoader from '../../../constants/Loader/loader';
const Category = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [status, setStatus] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [render, setRender] = useState(false);
    const [editData, setEditData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [checkedData, setCheckedData] = useState();
    const [checkedStatus, setCheckedStatus] = useState();
    const [statusModal, setStatusModal] = useState(false);
    const deletehandle = store?.deleteTechnologyCategory?.data;
    const loader = store?.getAllTechnologyCategoryReducer;
    const handelCreate = () => {
        setOpenModal(true);
    };
    const handelUpdate = (data) => {
        setEditData(data);
        setOpenEditModal(true);
    };
    const closeupdatemodal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
        setOpenEditModal(false);
    };
    const closeModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
        setOpenModal(false);
    };
    const handleActive = (val) => {
        if (val) {
            setStatus(true);
            let body = {
                status: true,
            };
            dispatch(getAllTechnologyCategory(body));
        } else {
            setStatus(false);
            let body = {
                status: false,
            };
            dispatch(getAllTechnologyCategory(body));
        }
    };
    const handleStatusChange = (e, data) => {
        if (e.target.checked) {
            setCheckedStatus(true);
        } else {
            setCheckedStatus(false);
        }
        setCheckedData(data);
        setStatusModal(true);
    };
    const handleYes = () => {
        if (checkedStatus) {
            let body = {
                id: checkedData._id,
                status: true,
            };
            dispatch(updateTechnologyCategory(body));
        } else {
            let body = {
                id: checkedData._id,
                status: false,
            };
            dispatch(updateTechnologyCategory(body));
        }
        setStatusModal(false);
    };
    useEffect(() => {
        let body = {
            status: status,
        };
        dispatch(getAllTechnologyCategory(body));
    }, [render]);
    useEffect(() => {
        if (deletehandle?.status == 200) {
            ToastHandle('success', deletehandle?.message);
            closeModal('render');
        } else if (deletehandle?.status == 400) {
            ToastHandle('error', deletehandle?.message);
        } else if (deletehandle?.status == 500) {
            ToastHandle('error', deletehandle?.message);
        }
    }, [deletehandle]);
    return (
        <>
            <Row>
                <Col lg={12}>
                    <Card>
                        <Card.Body>
                            <div className="row mx-auto mt-2">
                                <div className="d-flex col-4">
                                    <div className="row d-flex align-items-center">
                                        <div
                                            className={`col-auto  cp ${
                                                status == true ? 'Active_data' : 'InActive_data'
                                            }`}>
                                            <p className="p-0 m-0 p-1 cp" onClick={() => handleActive(true)}>
                                                Active
                                            </p>
                                        </div>
                                        <div
                                            className={`col-auto  cp ${
                                                status == false ? 'Active_data' : 'InActive_data'
                                            }`}>
                                            <p className=" p-0 m-0 p-1 cp" onClick={() => handleActive(false)}>
                                                Deactive
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4 d-flex align-items-center justify-content-center">
                                    <h4 className="header-title heading_data"> Category</h4>
                                </div>
                                {status == 1 ? (
                                    <div className="col-4 d-flex align-items-center justify-content-end pe-0">
                                        <Button
                                            className="web_button"
                                            variant="info"
                                            onClick={() => {
                                                handelCreate();
                                            }}>
                                            Add Category
                                        </Button>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                            {loader?.loading ? (
                                <MainLoader />
                            ) : (
                                <Table className="mb-0 add_Color_font" striped>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th> Category Name</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {store?.getAllTechnologyCategoryReducer?.data?.response?.map((ele, ind) => {
                                            return (
                                                <tr className="align-middle">
                                                    <th scope="row">{ind + 1}</th>
                                                    <td className="cp">
                                                        <span className="namelink"> {ele?.name} </span>
                                                    </td>

                                                    <td>
                                                        <Form.Check
                                                            type="switch"
                                                            checked={ele?.status}
                                                            onChange={(e) => handleStatusChange(e, ele)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Row>
                                                            <Col>
                                                                <p className="action-icon m-0 p-0  ">
                                                                    <i
                                                                        className="uil-edit-alt m-0 p-0"
                                                                        onClick={() => {
                                                                            handelUpdate(ele);
                                                                        }}></i>
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <CreateCategory modal={openModal} closeModal={closeModal} />
            <CategoryUpdate modal={openEditModal} closeModal={closeupdatemodal} editData={editData} />
            {/* delete modal */}
            <Modal show={statusModal} onHide={() => setStatusModal(false)}>
                <Modal.Body>
                    Are you sure you want to {!checkedStatus ? 'deactivate' : 'activate'} this Category ?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setStatusModal(false);
                        }}>
                        No
                    </Button>
                    <Button className=" web_button " variant="primary" onClick={() => handleYes()}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Category;
