import React, { useState, useEffect } from 'react';
import { Row, Button, Col, Form, Card, Table, CloseButton, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Create from './modal/create';
import Update from './modal/update';
import { deleteProject, getAllProjects } from '../../../redux/projects/action';
import { useDispatch, useSelector } from 'react-redux';
import MainLoader from '../../../constants/Loader/loader';
import ToastHandle from '../../../constants/toaster/toaster';
import moment from 'moment';

const Projects = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [openModal, setOpenModal] = useState(false);
    const [render, setRender] = useState(false);
    const [deleteId, setdeleteId] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [deletemodal, setDeleteModal] = useState(false);
    const [editData, setEditData] = useState();
    const getProjectList = store?.getProject;
    const deletehandle = store?.deleteProject?.data;
    const [status, setStatus] = useState(1);
    const [checkedData, setCheckedData] = useState();
    const [checkedStatus, setCheckedStatus] = useState();
    const [statusModal, setStatusModal] = useState(false);
    const handeldelete = (ele) => {
        setdeleteId(ele?._id);
        setDeleteModal(true);
    };
    const handelCreate = () => {
        setOpenModal(true);
    };
    const closeModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
        setOpenModal(false);
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
    const handleYes = () => {
        if (checkedStatus) {
            let body = {
                projectId: checkedData._id,
                activeStatus: true,
            };
            dispatch(deleteProject(body));
        } else {
            let body = {
                projectId: checkedData._id,
                activeStatus: false,
            };
            dispatch(deleteProject(body));
        }
        setStatusModal(false);
    };
    console.log(checkedData, 'oooooooooooooooooooooooooooo');
    const handleStatusChange = (e, data) => {
        if (e.target.checked) {
            setCheckedStatus(true);
        } else {
            setCheckedStatus(false);
        }
        setCheckedData(data);
        setStatusModal(true);
    };
    const handleActive = (val) => {
        console.log(val);
        if (val) {
            setStatus(1);
            let data = {
                status: 1,
            };
            dispatch(getAllProjects(data));
        } else {
            setStatus(0);
            let data = {
                status: 0,
            };
            dispatch(getAllProjects(data));
        }
    };
    useEffect(() => {
        let body = {
            status: status,
        };
        dispatch(getAllProjects(body));
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
            <div>
                <Card>
                    <Card.Body>
                        <div className="row mx-auto mt-2">
                            <div className="d-flex col-4">
                                <div className="row d-flex align-items-center">
                                    <div className={`col-auto  cp ${status == 1 ? 'Active_data' : 'InActive_data'}`}>
                                        <p className="p-0 m-0 p-1 cp" onClick={() => handleActive(true)}>
                                            Active
                                        </p>
                                    </div>
                                    <div className={`col-auto  cp ${status == 0 ? 'Active_data' : 'InActive_data'}`}>
                                        <p className=" p-0 m-0 p-1 cp" onClick={() => handleActive(false)}>
                                            Deactive
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 d-flex align-items-center justify-content-center">
                                <h4 className="header-title heading_data"> Projects</h4>
                            </div>
                            {status == 1 ? (
                                <div className="col-4 d-flex align-items-center justify-content-end pe-0">
                                    <Button
                                        className="web_button"
                                        variant="info"
                                        onClick={() => {
                                            handelCreate();
                                        }}>
                                        Add Projects
                                    </Button>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>

                        {getProjectList?.loading ? (
                            <>
                                <MainLoader />
                            </>
                        ) : (
                            <Table className="mb-0 add_Color_font" striped>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th> Project Name</th>
                                        <th>Client Name</th>
                                        <th>Project Type</th>
                                        <th>Project Start Date</th>
                                        <th>Project End Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store?.getProject?.data?.response?.map((ele, ind) => {
                                        return (
                                            <tr className="align-middle">
                                                <th scope="row">{ind + 1}</th>
                                                <td className="cp">
                                                    <span className="namelink"> {ele?.projectName} </span>
                                                </td>
                                                <td className="w-20">
                                                    <span className="namelink"> {ele?.clientName}</span>
                                                </td>
                                                <td>
                                                    <span className="namelink"> {ele?.projectType}</span>
                                                </td>
                                                <td>
                                                    <span className="namelink">
                                                        {moment(ele?.startDate).format('L')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="namelink">
                                                        {' '}
                                                        {moment(ele?.endDate).format('L')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Form.Check
                                                        type="switch"
                                                        checked={ele?.activeStatus}
                                                        onChange={(e) => handleStatusChange(e, ele)}
                                                    />
                                                </td>
                                                <td>
                                                    <Row>
                                                        <Col>
                                                            <p className="action-icon m-0 p-0 ">
                                                                <Link to={`/dashboard/projects/${ele?._id}`}>
                                                                    <i className="mdi mdi-eye m-0 p-0"></i>
                                                                </Link>
                                                            </p>
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

                <Create modal={openModal} closeModal={closeModal} />
                <Update modal={openEditModal} closeModal={closeupdatemodal} editData={editData} />

                <Modal show={statusModal} onHide={() => setStatusModal(false)}>
                    <Modal.Body>
                        Are you sure you want to {!checkedStatus ? 'deactivate' : 'activate'} this Project ?
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
            </div>
        </>
    );
};

export default Projects;
