import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListGroup, Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import './milstone.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Create from '../milestone/modal/create';
import { getProjectsById } from '../../../../redux/projects/action';
import { deleteMileStone, getallMileStones, getsingleMileStone } from './../../../../redux/milestone/action';
import MainLoader from '../../../../constants/Loader/loader';
import Modal from 'react-bootstrap/Modal';
import ToastHandle from '../../../../constants/toaster/toaster';
import Update from './modal/update';
import { getAllProjects } from '../../../../redux/projects/action';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// import ToastHandle from '../../../constants/toaster/toaster';

const Milestone = () => {
    const { id } = useParams();
    const store = useSelector((state) => state);
    const dispatch = useDispatch();

    const [openModel, setOpenModel] = useState(false);
    const [render, setRender] = useState(false);
    const [status, setStatus] = useState(1);
    const [checkedStatus, setCheckedStatus] = useState();
    const [statusModal, setStatusModal] = useState(false);
    const [checkedData, setCheckedData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editData, setEditData] = useState();
    const [skip, setSkip] = useState(1);

    const GetDataById = store?.getProjectById?.data?.project;
    const getMileStoneData = store?.getProject?.data?.response;
    const loaderhandel = store?.getSigleMileStone;
    const deletehandle = store?.deleteMileStone?.data;

    const closeModal = (val) => {
        if (val === 'render') {
            setRender(!render);
        }
        setOpenModel(false);
    };

    const handleActive = (val) => {
        const newStatus = val ? 1 : 0;
        setStatus(newStatus);
        dispatch(getsingleMileStone({ id: id, status: newStatus }));
    };

    const handleStatusChange = (e, data) => {
        const newCheckedStatus = e.target.checked;
        setCheckedStatus(newCheckedStatus);
        setCheckedData(data);
        setStatusModal(true);
    };

    const handleYes = () => {
        const newStatus = checkedStatus ? true : false;
        const body = {
            id: checkedData._id,
            status: newStatus,
        };
        dispatch(deleteMileStone(body));
        setStatusModal(false);
    };

    const handelUpdate = (data) => {
        setEditData(data);
        setOpenEditModal(true);
    };

    const closeupdatemodal = (val) => {
        if (val === 'render') {
            setRender(!render);
        }
        setOpenEditModal(false);
    };

    useEffect(() => {
        if (deletehandle?.status === 200) {
            ToastHandle('success', deletehandle?.message);
            closeModal('render');
        } else if (deletehandle?.status === 400 || deletehandle?.status === 500) {
            ToastHandle('error', deletehandle?.message);
        }
    }, [deletehandle]);

    useEffect(() => {
        dispatch(getProjectsById(id));
        dispatch(getsingleMileStone({ id: id, status: status }));
    }, [render]);

    useEffect(() => {
        const body = {
            flag: 'milestone',
            projectId: id,
            milestoneId: '',
            sprintId: '',
            skip: 1,
        };
        dispatch(getAllProjects(body));
    }, []);

    const handlePaginationChange = (event, value) => {
        setSkip(value);
        const body = {
            flag: 'milestone',
            projectId: id,
            milestoneId: '',
            skip: value,
        };
        dispatch(getAllProjects(body));
    };

    return (
        <>
            <div className='title'><h3>MILESTONES</h3></div>
            {loaderhandel.loading ? (
                <MainLoader />
            ) : (
                <>
                    <Card className="mt-3">
                        <Card.Body>
                            <Col className="mx-auto" lg={12}>
                                <Row>
                                    <Col className="" lg={12}>
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th> MileStone Name</th>
                                                    <th> Description</th>
                                                    <th> Start Date</th>
                                                    <th>Due Days</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getMileStoneData?.map((item, index) => (
                                                    <tr key={item._id}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <Link
                                                                className='text-secondary'
                                                                to={`/dashboard/singleMilestonesprint/projectId=/${item?.milestoneId}&milestoneId=/${item?._id}`}>
                                                                {item.title}
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: item.description,
                                                                }}
                                                            />
                                                        </td>
                                                        <td> {moment(item.start_date).format('DD/MM/YYYY')}</td>
                                                        <td>{item.daysLeft}</td>
                                                        <td>
                                                            <Row>
                                                                <Col>
                                                                    <p className="action-icon m-0 p-0 ">
                                                                        <Link
                                                                            to={`/dashboard/singleMilestonesprint/projectId=/${item?.milestoneId?.projectId}&milestoneId=/${item?.milestoneId?._id}`}>
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
                </>
            )}

            <Create modal={openModel} closeModal={closeModal} />
            <Update modal={openEditModal} closeModal={closeupdatemodal} editData={editData} />
            
            <Modal show={statusModal} onHide={() => setStatusModal(false)}>
                <Modal.Body>
                    Are you sure you want to {!checkedStatus ? 'deactivate' : 'activate'} this MileStone?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setStatusModal(false);
                        }}>
                        No
                    </Button>
                    <Button className=" web_button " variant="primary" onClick={handleYes}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Milestone;
