import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ListGroup, Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import Create from './modal/create';
import { getSingleSprint, deleteSprint } from '../../../../../redux/sprint/action';
import ToastHandle from '../../../../../constants/toaster/toaster';
import Update from './modal/update';
import { Link } from 'react-router-dom';
import MainLoader from '../../../../../constants/Loader/loader';
import { getAllProjects } from '../../../../../redux/projects/action';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
const Sprint = () => {
    const { projectId, milestoneId } = useParams();
    // console.log(projectId, 'bvcxcvbnbvcxcvbnmnbvcxn');
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [render, setRender] = useState(false);
    const [data, setData] = useState();
    const [checkedStatus, setCheckedStatus] = useState();
    const [statusModal, setStatusModal] = useState(false);
    const [checkedData, setCheckedData] = useState();
    const [status, setStatus] = useState(1);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openModal, SetOpenModal] = useState(false);
    const [editData, setEditData] = useState();
    const GetAllSingleSprintData = store?.getProject?.data?.response;
    // console.log(GetAllSingleSprintData, 'jjkkjkkyawsdfghjnmk');
    const deletehandle = store?.deleteSprint?.data;
    const loaderhandel = store?.getAllSingleSprints;
    const [skip, setSkip] = useState(1);
    const handelUpdate = (data) => {
        setEditData(data);
        setOpenEditModal(true);
    };

    // useEffect(() => {
    //     dispatch(getSingleSprint({ activeStatus: status, id: milestoneId, skip }));
    //     dispatch(getAllProjects());
    // })
    const closeupdatemodal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
        setOpenEditModal(false);
    };
    const CloseModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
        SetOpenModal(false);
    };
    const handleCreate = () => {
        SetOpenModal(true);
    };
    const handleActive = (val) => {
        if (val) {
            setStatus(1);
            let data = {
                id: milestoneId,
                status: 1,
            };
            dispatch(getSingleSprint(data));
        } else {
            setStatus(0);
            let data = {
                id: milestoneId,
                status: 0,
            };
            dispatch(getSingleSprint(data));
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
            dispatch(deleteSprint(body));
        } else {
            let body = {
                id: checkedData._id,
                status: false,
            };
            dispatch(deleteSprint(body));
        }
        setStatusModal(false);
    };
    useEffect(() => {
        if (deletehandle?.status == 200) {
            ToastHandle('success', deletehandle?.message);
            CloseModal('render');
        } else if (deletehandle?.status == 400) {
            ToastHandle('error', deletehandle?.message);
        } else if (deletehandle?.status == 500) {
            ToastHandle('error', deletehandle?.message);
        }
    }, [deletehandle]);
    // useEffect(() => {
    //     dispatch(getSingleSprint({status:status ,id:milestoneId}));
    // }, [render]);


    useEffect(() => {
        let body = {
            flag: 'sprint',
            projectId: projectId,
            milestoneId: milestoneId,
            sprintId: '',
            skip: 1,
        };

        dispatch(getAllProjects(body));
    }, []);
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        let body = {
            flag: 'sprint',
            projectId: projectId,
            milestoneId: milestoneId,
            sprintId: '',
            skip: 1,
        };
        dispatch(getAllProjects(body));
    };
    return (
        <>
            <div className='title'><h3>SPRINTS</h3></div>
            <Card>
                <Card.Body>
                    <Col className="mx-auto" lg={12}>
                        <Row>


                            {loaderhandel.loading ? (
                                <MainLoader />
                            ) : (
                                <Col className="" lg={12}>
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Sprint Name</th>
                                                <th>Sprint Description</th>
                                                <th>Sprint Start Date</th>
                                                <th>Due Days</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {GetAllSingleSprintData?.map((item, index) => (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item?.sprintId?.sprintName}</td>
                                                    <td>
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: item?.sprintId?.sprintDesc,
                                                            }}
                                                        />
                                                    </td>

                                                    <td> {moment(item?.sprintId?.startDate).format('DD/MM/YYYY')}</td>
                                                    <td> {item?.sprintId?.daysLeft}</td>

                                                    <td>
                                                        {' '}
                                                        <Row>
                                                            <Col>
                                                                <p className="action-icon m-0 p-0 ">
                                                                    <Link
                                                                        to={`/dashboard/taskboard/projectId=/${item?.sprintId?.projectId}&milestoneId=/${item?.sprintId?.milestoneId}&spriteId=/${item?.sprintId?._id}`}>
                                                                        <i className="mdi mdi-eye m-0 p-0"></i>
                                                                    </Link>
                                                                </p>

                                                            </Col>
                                                        </Row>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            )}
                        </Row>
                    </Col>
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
            <Create modal={openModal} CloseModal={CloseModal} projectId={projectId} milestoneId={milestoneId} />
            <Update modal={openEditModal} closeModal={closeupdatemodal} editData={editData} />
            <Modal show={statusModal} onHide={() => setStatusModal(false)}>
                <Modal.Body>
                    Are you sure you want to {!checkedStatus ? 'deactivate' : 'activate'} this Sprint?
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
export default Sprint;
