import React, { useState, useEffect, Suspense } from 'react';
import { Row, Button, Col, Form, Card, Table, CloseButton, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Create from './modal/create';
import Update from './modal/update';
import { deleteProject, getAllProjects, updateProject } from '../../../redux/projects/action';
import { useDispatch, useSelector } from 'react-redux';
import MainLoader from '../../../constants/Loader/loader';
import ToastHandle from '../../../constants/toaster/toaster';
import moment from 'moment';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import HeaderMain from '../header/HeaderMain';
// import 'bootstrap/dist/css/bootstrap.min.css';

const Projects = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [openModal, setOpenModal] = useState(false);
    const [render, setRender] = useState(false);
    const [deleteId, setdeleteId] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [deletemodal, setDeleteModal] = useState(false);
    const [editData, setEditData] = useState();
    const [skip, setSkip] = useState(1);
    const getProjectList = store?.getProject;
    const deletehandle = store?.deleteProject?.data;
    const [status, setStatus] = useState(1);
    const [projectStatus, setprojectStatus] = useState(1);
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
            dispatch(updateProject(body));
        } else {
            let body = {
                projectId: checkedData._id,
                activeStatus: false,
            };
            dispatch(updateProject(body));
        }
        setStatusModal(false);
    };
      const handleStatusChange = (e, data) => {
        const isChecked = e.target.checked;
        const projectId = data._id;

        const updatedStatus = isChecked ? true : false;
        const body = {
            projectId: projectId,
            activeStatus: updatedStatus,
        };
        dispatch(updateProject(body));

        dispatch(getAllProjects({ status: status, skip: skip, projectStatus: projectStatus }));

        setRender(!render);
    };

    const handleActive = (val) => {
        if (val) {
            setStatus(1);
            setSkip(1);
            dispatch(getAllProjects({ status: 1, skip: 1, projectStatus: projectStatus }));
        } else {
            setStatus(0);
            setSkip(1);
            dispatch(getAllProjects({ status: 0, skip: 1, projectStatus: projectStatus }));
        }
    };
    useEffect(() => {
        let body = {
            status: status,
            skip: skip,
            projectStatus: projectStatus,
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
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        dispatch(getAllProjects({ status: status, skip: value, projectStatus: projectStatus }));
    };


    const handleProjectStatus = (val) => {
        if (val == '1') {
            setprojectStatus(1);
            setSkip(1);
            dispatch(getAllProjects({ status: status, skip: 1, projectStatus: 1 }));
        } else if (val == '2') {
            setprojectStatus(2);
            setSkip(1);
            dispatch(getAllProjects({ status: status, skip: 1, projectStatus: 2 }));
        } else if (val == '3') {
            setSkip(1);
            setprojectStatus(3);
            dispatch(getAllProjects({ status: status, skip: 1, projectStatus: 3 }));
        } else {
            setSkip(1);
            setprojectStatus(4);
            dispatch(getAllProjects({ status: status, skip: 1, projectStatus: 4 }));
        }
    };
    
    return (
        <>
            <div>
                <Card>
                    <Card.Body>
                        <HeaderMain />
                        <div className="row mx-auto">
                            <div className="row d-flex align-items-center">
                                <div className={`col-auto  cp ${projectStatus == 1 ? 'Active_data' : 'InActive_data'}`}>
                                    <p className="p-0 m-0 p-1 cp" onClick={() => handleProjectStatus('1')}>
                                        Ongoing
                                    </p>
                                </div>
                                <div className={`col-auto  cp ${projectStatus == 2 ? 'Active_data' : 'InActive_data'}`}>
                                    <p className="p-0 m-0 p-1 cp" onClick={() => handleProjectStatus('2')}>
                                        Support
                                    </p>
                                </div>

                                <div className={`col-auto  cp ${projectStatus == 3 ? 'Active_data' : 'InActive_data'}`}>
                                    <p className="p-0 m-0 p-1 cp" onClick={() => handleProjectStatus('3')}>
                                        Delivered
                                    </p>
                                </div>
                                {/* <div className={`col-auto  cp ${projectStatus == 4 ? 'Active_data' : 'InActive_data'}`}>
                                    <p className=" p-0 m-0 p-1 cp" onClick={() => handleProjectStatus('4')}>
                                        Completed
                                    </p>
                                </div> */}
                            </div>
                            <div className="d-flex col-4 mt-3">
                                <div className="row d-flex align-items-center">
                                    <div className={`col-auto  cp ${status == 1  ? 'Active_data' : 'InActive_data'}`}>
                                        <p className="p-0 m-0 p-1 cp" onClick={() => handleActive(true)}>
                                            Active
                                        </p>
                                    </div>
                                    <div className={`col-auto  cp ${status == 0 ? 'Active_data' : 'InActive_data'}`}>
                                        <p className=" p-0 m-0 p-1 cp" onClick={() => handleActive(false)}>
                                            Inactive
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
                                        <th>Days Left</th>
                                        <th>Project End Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store?.getProject?.data?.response?.map((ele, ind) => {
                                        return (
                                            <tr className="align-middle">
                                                <th scope="row">{(skip - 1) * 10 + ind + 1}</th>
                                                <td className="cp">

                                                    <Link to={`/dashboard/projects/${ele?._id}`}>
                                                        <span className="namelink text-secondary"> {ele?.projectName} </span>
                                                    </Link>
                                                </td>
                                                <td className="w-20">
                                                    <span className="namelink"> {ele?.clientName}</span>
                                                </td>
                                                <td>
                                                    <span className="namelink"> {ele?.projectType}</span>
                                                </td>
                                                <td>
                                                    <span className="namelink">
                                                        {moment(ele?.startDate).format("DD/MM/YYYY")}
                                                    </span>
                                                </td>
                                                <td>{ele?.daysLeft}</td>
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
                        {getProjectList?.data?.totalPages > 0 && (
                            <Row>
                                <Col lg={12} className="d-flex justify-content-end my-3 pe-4">
                                    <Pagination
                                        defaultPage={skip}
                                        count={store?.getProject?.data?.totalPages}
                                        color="primary"
                                        variant="outlined"
                                        onChange={handlePaginationChange}
                                    />
                                </Col>
                            </Row>
                        )}
                    </Card.Body>
                </Card>

                <Create modal={openModal} closeModal={() => setOpenModal(false)} />

                {/* Update modal */}
                <Update modal={openEditModal} closeModal={() => setOpenEditModal(false)} editData={editData} />

                {/* Delete confirmation modal */}
                <Modal show={statusModal} onHide={() => setStatusModal(false)}>
                    <Modal.Body>
                        Are you sure you want to {checkedStatus ? 'Inactive' : 'active'} this Project?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setStatusModal(false)}>No</Button>
                        <Button variant="primary" onClick={handleYes}>Yes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Projects;
