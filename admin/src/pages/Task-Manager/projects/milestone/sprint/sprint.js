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
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
const Sprint = () => {
    const { projectId, milestoneId } = useParams();
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [render, setRender] = useState(false);
    const [skip, setSkip] = useState(1);
    const [data, setData] = useState();
    const [checkedStatus, setCheckedStatus] = useState();
    const [statusModal, setStatusModal] = useState(false);
    const [checkedData, setCheckedData] = useState();
    const [status, setStatus] = useState(1);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openModal, SetOpenModal] = useState(false);
    const [editData, setEditData] = useState();
    const GetAllSingleSprintData = store?.getAllSingleSprints?.data?.Response;
    const deletehandle = store?.deleteSprint?.data;
    const loaderhandel = store?.getAllSingleSprints;
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
                activeStatus: 1,
                skip
            };
            dispatch(getSingleSprint(data));
        } else {
            setStatus(0);
            let data = {
                id: milestoneId,
                activeStatus: 0,
                skip
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
                sprintId: checkedData._id,
                activeStatus: true,
            };
            dispatch(deleteSprint(body));
        } else {
            let body = {
                sprintId: checkedData._id,
                activeStatus: false,
            };
            dispatch(deleteSprint(body));
        }
        setStatusModal(false);
    };
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        dispatch(getSingleSprint({ activeStatus: status, id: milestoneId ,skip: value}));
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
    useEffect(() => {
        dispatch(getSingleSprint({ activeStatus: status, id: milestoneId ,skip }));
    }, [render]);
    return (
        <>
            <Card>
                <Card.Body>
                    <Col className="mx-auto" lg={12}>
                        <Row>
                            <div className="row mx-auto mt-2">
                                <div className="d-flex col-4">
                                    <div className="row d-flex align-items-center">
                                        <div
                                            className={`col-auto  cp ${status == 1 ? 'Active_data' : 'InActive_data'}`}>
                                            <p className="p-0 m-0 p-1 cp" onClick={() => handleActive(true)}>
                                                Active
                                            </p>
                                        </div>
                                        <div
                                            className={`col-auto  cp ${status == 0 ? 'Active_data' : 'InActive_data'}`}>
                                            <p className=" p-0 m-0 p-1 cp" onClick={() => handleActive(false)}>
                                                Deactive
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4 d-flex align-items-center justify-content-center">
                                    <h4 className="header-title heading_data"> Sprints</h4>
                                </div>
                                {status == 1 ? (
                                    <div className="col-4 d-flex align-items-center justify-content-end pe-0">
                                        <Button
                                            variant="info"
                                            onClick={handleCreate}
                                            className="btn fs-5  text-white p-1   web_button">
                                            Add Sprint
                                        </Button>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                            {loaderhandel.loading ? (
                                <MainLoader />
                            ) : (
                                <Col className="" lg={12}>
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>SprintName</th>
                                                <th>Sprint Description</th>
                                                <th>Sprint Start Date</th>
                                                <th>Sprint End Date</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {GetAllSingleSprintData?.map((item, index) => (
                                                <tr>
                                                    <td>{(skip - 1) * 10 + index + 1}</td>
                                                    <td>{item?.sprintName}</td>
                                                    <td>
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: item?.sprintDesc,
                                                            }}
                                                        />
                                                    </td>

                                                    <td> {moment(item?.startDate).format('L')}</td>
                                                    <td>{moment(item?.endDate).format('L')}</td>
                                                    <td>
                                                        {' '}
                                                        <Form.Check
                                                            type="switch"
                                                            checked={item?.activeStatus}
                                                            onChange={(e) => handleStatusChange(e, item)}
                                                        />
                                                    </td>
                                                    <td>
                                                        {' '}
                                                        <Row>
                                                            <Col>
                                                                <p className="action-icon m-0 p-0 ">
                                                                    <Link
                                                                        to={`/dashboard/taskBord/projectId=/${item?.projectId?._id}&milestoneId=/${item?.milestoneId?._id}&spriteId=/${item?._id}`}>
                                                                        <i className="mdi mdi-eye m-0 p-0"></i>
                                                                    </Link>
                                                                </p>
                                                                <p className="action-icon m-0 p-0  ">
                                                                    <i
                                                                        onClick={() => {
                                                                            handelUpdate(item);
                                                                        }}
                                                                        className="uil-edit-alt m-0 p-0"></i>
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
                                    <Col lg={12} className="d-flex justify-content-end mt-3">
                                        {store?.getAllSingleSprints?.data?.totalPages > 0 && (
                                          <Stack spacing={2}>
                                                <Pagination
                                                    defaultPage={skip}
                                                    count={store?.getAllSingleSprints?.data?.totalPages}
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
