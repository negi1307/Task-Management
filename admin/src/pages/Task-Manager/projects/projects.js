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
import Pagesaddtask from '../../../layouts/AllPagesRightbar';
import { getAssignUserAction } from '../../../redux/task/action';
import { getAllTask, getAllRoles } from '../../../redux/actions'
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
    const [projectStatus, setprojectStatus] = useState();
    const [checkedData, setCheckedData] = useState();
    const [checkedStatus, setCheckedStatus] = useState();
    const [statusModal, setStatusModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const updateResponse = store?.updateProject?.data?.status;

    const sessionData = sessionStorage.getItem('hyper_user');
    const userData = JSON.parse(sessionData);
    const userRole = userData.role;
    const closeaddModal = () => {
        // getalltasks();
    }

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
        updateProjectList();
    };
    const updateProjectList = () => {
        dispatch(getAllProjects({ status: status, skip: skip, projectStatus: projectStatus }));
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
        updateProjectList();
    };
    const handleYes = async () => {
        try {
            if (checkedStatus) {
                let body = {
                    projectId: checkedData._id,
                    activeStatus: true,
                };
                await dispatch(updateProject(body));
            } else {
                let body = {
                    projectId: checkedData._id,
                    activeStatus: false,
                };
                await dispatch(updateProject(body));
            }


        } catch (error) {
            console.error("Error updating project:", error);
        }

        // Close the status modal
        setStatusModal(false);
    };

    const handleStatusChange = async (e, data) => {
        if (userRole === 'Testing') {
            // Show toast indicating that testing user cannot change status
            // Adjust the ToastHandle function according to your toast implementation
            ToastHandle('error', 'Tester is not allowed to change project status');
            return; // Return early, preventing further execution
        }

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
            setSkip(1);
            dispatch(getAllProjects({ status: 1, skip: 1, projectStatus: projectStatus }));
        } else {
            setStatus(0);
            setSkip(1);
            dispatch(getAllProjects({ status: 0, skip: 1, projectStatus: projectStatus }));
        }
    };
    useEffect(() => {
        // Set initial projectStatus to "Ongoing"
        setprojectStatus('Ongoing');
        let body = {
            status: status,
            skip: skip,
            projectStatus: 'Ongoing', // Hardcode for initial fetch
        };
        dispatch(getAllProjects(body));
        if (updateResponse === '200') {
            dispatch(getAllProjects({ status: status, skip: skip, projectStatus: projectStatus }));
        }
    }, [status, skip, updateResponse]);
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
        if (val === '1') {
            setprojectStatus('Ongoing');
            setSkip(1);
            dispatch(getAllProjects({ status: status, skip: 1, projectStatus: "Ongoing" }));
        } else if (val === '2') {
            setprojectStatus('Support');
            setSkip(1);
            dispatch(getAllProjects({ status: status, skip: 1, projectStatus: 'Support' }));
        } else if (val === '3') {
            setSkip(1);
            setprojectStatus('Delivered');
            dispatch(getAllProjects({ status: status, skip: 1, projectStatus: 'Delivered' }));
        }
    };


    return (
        <>
            <div>
                <Card>
                    <Card.Body>
                        <div className="row mx-auto">
                            {userRole !== 'Testing' && (
                                <div className="row d-flex align-items-center">
                                    <div className={`col-auto  cp ${projectStatus == 'Ongoing' ? 'Active_data' : 'InActive_data'}`}>
                                        <p className="p-0 m-0 p-1 cp" onClick={() => handleProjectStatus('1')}>
                                            Ongoing
                                        </p>
                                    </div>
                                    <div className={`col-auto  cp ${projectStatus == "Support" ? 'Active_data' : 'InActive_data'}`}>
                                        <p className="p-0 m-0 p-1 cp" onClick={() => handleProjectStatus('2')}>
                                            Support
                                        </p>
                                    </div>

                                    <div className={`col-auto  cp ${projectStatus == "Delivered" ? 'Active_data' : 'InActive_data'}`}>
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
                            )}

                            <div className="d-flex col-6 mt-3">
                                <div className="row d-flex align-items-center">
                                    <div className={`col-auto  cp ${status == 1 ? 'Active_data' : 'InActive_data'}`}>
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
                            {status == 1 ? (
                                <div className="col-6 d-flex align-items-center justify-content-end gap-3 pe-0">
                                    {userRole !== "Testing" && (
                                        <Button
                                            className="mybutton btn p-1 fw-bold py-1  web_button"
                                            variant="info"
                                            onClick={() => {
                                                handelCreate();
                                            }}>
                                            Add Projects
                                        </Button>
                                    )}
                                    <button
                                        type="button"
                                        className="mybutton btn p-1 fw-bold py-1  web_button"
                                        onClick={() => {
                                            // console.log('button click');
                                            // handeladdtask()
                                            setShowModal(!showModal);
                                            // dispatchActions();
                                            // dispatch(getAllTask({ projectId: projectId, mileStoneId: milestoneId, sprintId: spriteId }))

                                        }}>
                                        Add Task
                                    </button>
                                    <Pagesaddtask
                                        className="d-none"
                                        // onFormSubmit={handleFormSubmit}
                                        showModal={showModal}
                                        closeModal={closeaddModal}
                                        setShowModal={setShowModal}
                                    />
                                </div>

                            ) : (
                                ''
                            )}
                            <div className="col-12 d-flex align-items-center justify-content-center">
                                <h4 className="header-title py-1 heading_data page_headings">Projects</h4>
                            </div>
                        </div>


                        {getProjectList?.loading ? (
                            <>
                                <MainLoader />
                            </>
                        ) : (
                            <Table className="mb-0 add_Color_font" striped style={{ fontSize: '13px!important' }}>
                                <thead>
                                    <tr>
                                        <th className='fw-bold text-start'>#</th>
                                        <th className='fw-bold text-start'>Project Name</th>
                                        <th className='fw-bold text-start'>Client Name</th>
                                        <th className='fw-bold text-start'>Project Type</th>
                                        <th className='fw-bold text-start'>Project Start Date</th>
                                        <th className='fw-bold text-start'>Days Left</th>
                                        <th className='fw-bold text-start'>Project End Date</th>
                                        <th className='fw-bold text-start'>Status</th>
                                        <th className='fw-bold text-start'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store?.getProject?.data?.response?.projects?.map((ele, ind) => {
                                        return (
                                            <tr className="align-middle" key={ele._id}>
                                                <th scope="row" className='text-start'>{(skip - 1) * 10 + ind + 1}</th>
                                                <td className="cp text-start">

                                                    <Link to={`/dashboard/projects/${ele?._id}`}>
                                                        <span className="namelink text-secondary"> {ele?.projectName} </span>
                                                    </Link>
                                                </td>
                                                <td className="text-start w-20">
                                                    <span className="namelink"> {ele?.clientName}</span>
                                                </td>
                                                <td className='text-start'>
                                                    <span className="text-start namelink"> {ele?.projectType}</span>
                                                </td>
                                                <td className='text-start'>
                                                    <span className="namelink">
                                                        {moment(ele?.startDate).format("DD/MM/YYYY")}
                                                    </span>
                                                </td>
                                                <td className='text-start'>{ele?.daysLeft}</td>

                                                <td className='text-start'>
                                                    <span className="namelink">
                                                        {' '}
                                                        {moment(ele?.endDate).format('L')}
                                                    </span>
                                                </td>
                                                <td className='text-start'>
                                                    <Form.Check
                                                        type="switch"
                                                        checked={ele?.activeStatus}
                                                        onChange={(e) => handleStatusChange(e, ele)}
                                                    />
                                                </td>
                                                <td className='text-start'>
                                                    <Row>
                                                        <Col>
                                                            <p className="action-icon m-0 p-0 ">
                                                                <Link to={`/dashboard/projects/${ele?._id}`}>
                                                                    <i className="mdi mdi-eye m-0 p-0"></i>
                                                                </Link>
                                                            </p>
                                                            {userRole !== "Testing" && (
                                                                <p className="action-icon m-0 p-0  ">
                                                                    <i
                                                                        className="uil-edit-alt m-0 p-0"
                                                                        onClick={() => {
                                                                            handelUpdate(ele);
                                                                        }}></i>
                                                                </p>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        )}
                        {getProjectList?.data?.response?.totalPages > 0 && (
                            <Row>
                                <Col lg={12} className="d-flex justify-content-end my-3 pe-4">
                                    <Pagination
                                        defaultPage={skip}
                                        count={store?.getProject?.data?.response?.totalPages}
                                        color="primary"
                                        variant="outlined"
                                        onChange={handlePaginationChange}
                                    />
                                </Col>
                            </Row>
                        )}
                    </Card.Body>
                </Card>

                <Create modal={openModal} closeModal={closeModal} />

                {/* Update modal */}
                <Update modal={openEditModal} closeModal={closeupdatemodal} editData={editData} />

                {/* Delete confirmation modal */}
                <Modal show={statusModal} onHide={() => {
                    setStatusModal(false)
                    dispatch(getAllProjects({ status: status, skip: skip, projectStatus: projectStatus }));
                }}>
                    <Modal.Body>
                        Are you sure you want to {checkedStatus ? 'activate' : 'deactivate'} this Project?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className='border-0'
                            onClick={() => {
                                setStatusModal(false);
                                // let body = {
                                //     status: status,
                                //     skip: skip,
                                //     projectStatus: projectStatus, // Use projectStatus state directly
                                // };
                                // dispatch(getAllProjects(body));
                            }}>No</Button>
                        <Button variant="primary" className='web_buttons bg-black text-white border-0' onClick={() => handleYes()}>Yes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Projects;
