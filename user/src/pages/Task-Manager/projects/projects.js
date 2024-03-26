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
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Projects = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const projectDataInfo = store?.getProject?.data?.response;
    const [openModal, setOpenModal] = useState(false);
    const [render, setRender] = useState(false);
    const [deleteId, setdeleteId] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [deletemodal, setDeleteModal] = useState(false);
    const [editData, setEditData] = useState();
    const getProjectList = store?.getProject;
    const deletehandle = store?.deleteProject?.data;
    const [status, setStatus] = useState(1);
    const [skip, setSkip] = useState(1);
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
        if (val) {
            setStatus(1);
            let data = {
                status: 1,
                projectstatus: 1,
            };
            dispatch(getAllProjects(data));
        } else {
            setStatus(0);
            let data = {
                status: 1,
                projectstatus: 1,
            };
            dispatch(getAllProjects(data));
        }
    };
    useEffect(() => {
        let body = {
            flag: "project",
            projectId: '',
            milestoneId: '',
            sprintId: '',
            projectStatus: 1,
            skip: 1,
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

    const statusInfo = (status) => {
        let body = {
            flag: 'project',
            projectId: '',
            milestoneId: '',
            skip: 1,
        };
        dispatch(getAllProjects(body));
    };
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        let body = {
            flag: 'project',
            projectId: '',
            milestoneId: '',
            skip: value,
        };
        dispatch(getAllProjects(body));
    };
    console.log(getProjectList, '11111111111111111111111111111112222222222222222222222')
    return (
        <>
            <div>
                <div className="title">
                    <h3>PROJECTS</h3>
                </div>
                <Card>
                    <Card.Body>
                        {/* <div class="row mx-auto border-bottom mb-2">
                    <div class="row d-flex align-items-center pb-2">
                    <div class="col-auto  cp InActive_data">
                    <p class="p-0 m-0 p-1 cp" onClick={()=>statusInfo(1)}> Todo</p></div>
                    <div class="col-auto  cp InActive_data"><p onClick={()=>statusInfo(2)} class="p-0 m-0 p-1 cp">Live</p></div>
                    <div class="col-auto  cp InActive_data"><p onClick={()=>statusInfo(3)} class=" p-0 m-0 p-1 cp">Hold</p></div>
                    <div class="col-auto  cp InActive_data"><p onClick={()=>statusInfo(4)} class=" p-0 m-0 p-1 cp">Completed</p></div>
                    </div>
                    </div> */}
                        <div className="row mx-auto mt-2">
                            {/* <div className="d-flex col-4">
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
                            </div> */}

                            {status == 1 ? (
                                <div className="col-4 d-flex align-items-center justify-content-end pe-0">
                                    {/* <Button
                                        className="web_button"
                                        variant="info"
                                        onClick={() => {
                                            handelCreate();
                                        }}>
                                        Add Projects
                                    </Button> */}
                                </div>
                            ) : (
                                ''
                            )}
                        </div>

                        {/* {getProjectList?.loading ? (
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
                                        <th>Due Days</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projectDataInfo?.map((ele, ind) => {
                                        return (
                                            <tr className="align-middle">
                                                <th scope="row">{ind + 1}</th>
                                                <td className="cp">
                                                    <span className="namelink"> {ele?.projectId?.projectName} </span>
                                                </td>
                                                <td className="w-20">
                                                    <span className="namelink"> {ele?.projectId?.clientName}</span>
                                                </td>
                                                <td>
                                                    <span className="namelink"> {ele?.projectId?.projectType}</span>
                                                </td>
                                                <td>
                                                    <span className="namelink">
                                                        {moment(ele?.projectId?.startDate).format('DD/MM/YYYY')}

                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="namelink">{ele?.projectId?.daysLeft}</span>
                                                </td>

                                                <td>
                                                    <Row>
                                                        <Col>
                                                            <p className="action-icon m-0 p-0 ">
                                                                <Link to={`/dashboard/projects/${ele?.projectId?._id}`}>
                                                                    <i className="mdi mdi-eye m-0 p-0"></i>
                                                                </Link>
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
                         */}
                        {getProjectList?.loading ? (
                            <MainLoader />
                        ) : (
                            <Table className="mb-0 add_Color_font" striped>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Project Name</th>
                                        <th>Client Name</th>
                                        <th>Project Type</th>
                                        <th>Project Start Date</th>
                                        <th>Due Days</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projectDataInfo?.map((ele, ind) => {
                                        return (
                                            <tr key={ind} className="align-middle">
                                                <td scope="row">{ind + 1}</td>
                                                <td className="cp">
                                                    <Link to={`/dashboard/projects/${ele._id}`}>
                                                        <span className="namelink text-dark">{ele.projectName}</span>
                                                    </Link>
                                                </td>

                                                <td className="w-20">
                                                    <span className="namelink">{ele.clientName}</span>
                                                </td>
                                                <td>
                                                    <span className="namelink">{ele.projectType}</span>
                                                </td>
                                                <td>
                                                    <span className="namelink">
                                                        {moment(ele.startDate).format('DD/MM/YYYY')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="namelink">{ele.daysLeft}</span>
                                                </td>
                                                <td>
                                                    <Row>
                                                        <Col>
                                                            <p className="action-icon m-0 p-0 ">
                                                                <Link to={`/dashboard/projects/${ele._id}`}>
                                                                    <i className="mdi mdi-eye m-0 p-0"></i>
                                                                </Link>
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

                        <Row>
                            <Col lg={12} className="d-flex justify-content-end my-3 pe-4 position-absolute bottom-0">
                                {store?.getProject?.data?.totalPages > 0 && (
                                    <Stack spacing={2}>
                                        <Pagination
                                            defaultPage={skip}
                                            count={store?.getProject?.data?.totalPages}
                                            color="primary"
                                            variant="outlined"
                                            onChange={handlePaginationChange}
                                        />
                                    </Stack>
                                )}
                            </Col>
                        </Row>
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
