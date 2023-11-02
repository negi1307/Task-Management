import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListGroup, Container, Row, Col, Table, Button, Form, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { TaskStatusAction, deleteTask, getsingleSprintTask } from '../../../redux/task/action';
import MainLoader from '../../../constants/Loader/loader';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ToastHandle from '../../../constants/toaster/toaster';
import Create from './modal/create';
import { getAllRoles, getAllUsers } from '../../../redux/actions';
const TaskList = () => {
    const { projectId, milestoneId, spriteId } = useParams();
    const [skip, setSkip] = useState(1);
    const store = useSelector((state) => state);
    const [openModal, SetOpenModal] = useState(false);
    const [editopenModal, SetEditOpenModal] = useState(false);
    const dispatch = useDispatch();
    const [status, setStatus] = useState(1);
    const [checkedData, setCheckedData] = useState();
    const [checkedStatus, setCheckedStatus] = useState();
    const [editData, setEditData] = useState();
    const [render, setRender] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const [activeStatus, setActiveStatus] = useState(true);

    const getSingleSprintTask = store?.getSigleSprintTask?.data?.response;
    const deletehandle = store?.TaskStatusReducer?.data;
    const loaderhandel = store?.getSigleSprintTask;
    const handleCreate = () => {
        SetOpenModal(true);
    };
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        dispatch(getsingleSprintTask({ id: '', skip: value, activeStatus: activeStatus }));
    };
    const CloseModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
        SetOpenModal(false);
    };
    const handleActive = (val) => {
        if (val) {
            setStatus(1);
            setActiveStatus(true);
            let data = {
                id: '',
                activeStatus: true,
                skip: skip,
            };
            dispatch(getsingleSprintTask(data));
        } else {
            setStatus(0);
            setActiveStatus(false);
            let data = {
                id: '',
                activeStatus: false,
                skip: skip,
            };
            dispatch(getsingleSprintTask(data));
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
                taskId: checkedData._id,
                activeStatus: true,
            };
            dispatch(TaskStatusAction(body));
        } else {
            let body = {
                taskId: checkedData._id,
                activeStatus: false,
            };
            dispatch(TaskStatusAction(body));
        }
        setStatusModal(false);
        setStatus(1);
    };
    const handelUpdate = (data) => {
        setEditData(data);
        SetEditOpenModal(true);
    };

    const CloseUpdateModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
        SetEditOpenModal(false);
    };
    useEffect(() => {
        dispatch(getsingleSprintTask({ id: '', activeStatus: true, skip: 1 }));
    }, [render]);
    useEffect(() => {
        dispatch(getAllRoles());
        dispatch(getAllUsers());
    }, []);
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
    return (
        <>
            <Card>
                <Card.Body>
                    <div className="project_detail">
                        <div className="taskinfo">
                            <ul>
                                <li>
                                    {' '}
                                    <Link to="/summary">Summary</Link>{' '}
                                </li>
                                <li>
                                    {' '}
                                    <Link to="/taskList">List</Link>{' '}
                                </li>
                                <li>
                                    {' '}
                                    <Link to="/dashboard/boards">Board</Link>{' '}
                                </li>
                            </ul>
                        </div>
                    </div>
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
                            <h4 className="header-title heading_data"> Tasks</h4>
                        </div>
                        {status == 1 ? (
                            <div className="col-4 d-flex align-items-center justify-content-end pe-0">
                                <Button className="web_button" variant="info" onClick={handleCreate}>
                                    Create Task
                                </Button>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                    {loaderhandel.loading ? (
                        <MainLoader />
                    ) : (
                        <Row>
                            <Col className="mx-auto" lg={12}>
                                <Row>
                                    <Col className="" lg={12}>
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th>#</th>

                                                    <th> Description</th>
                                                    <th> Summary</th>

                                                    <th>Assignee</th>
                                                    <th>Reporter</th>
                                                    <th>Priority</th>
                                                    <th> Start Date</th>
                                                    <th> End Date</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getSingleSprintTask?.map((item, index) => (
                                                    <tr>
                                                        <td>{(skip - 1) * 5 + index + 1}</td>
                                                        <td>{item?.summary}</td>
                                                        <td>
                                                            {' '}
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: item?.description,
                                                                }}
                                                            />
                                                        </td>

                                                        <td>{item?.assignees?.assigneeInfo?.firstName} {item?.assignees?.assigneeInfo?.lastName}</td>
                                                        <td>{item?.assignees?.reporterInfo?.role}</td>
                                                        <td>
                                                            {item?.priority == 1
                                                                ? 'High'
                                                                : '' || item?.priority == 2
                                                                ? 'Medium'
                                                                : '' || item?.priority == 3
                                                                ? 'Low'
                                                                : ''}
                                                        </td>
                                                        <td> {moment(item?.startDate).format('L')}</td>
                                                        <td>{moment(item?.dueDate).format('L')}</td>
                                                        <td>
                                                            <Form.Check
                                                                type="switch"
                                                                checked={item?.activeStatus}
                                                                onChange={(e) => handleStatusChange(e, item)}
                                                            />
                                                        </td>
                                                        <td>
                                                            {/* <Row>
                                                                <Col>
                                                                    <p className="action-icon m-0 p-0  ">
                                                                        <i
                                                                            className="uil-edit-alt m-0 p-0"
                                                                            onClick={() => {
                                                                                handelUpdate(item);
                                                                            }}></i>
                                                                    </p>
                                                                </Col>
                                                            </Row> */}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12} className="d-flex justify-content-end mt-3">
                                        {store?.getSigleSprintTask?.data?.totalPages > 0 && (
                                            <Stack spacing={2}>
                                                <Pagination
                                                    defaultPage={skip}
                                                    count={store?.getSigleSprintTask?.data?.totalPages}
                                                    color="primary"
                                                    variant="outlined"
                                                    onChange={handlePaginationChange}
                                                />
                                            </Stack>
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>

            <Create modal={openModal} CloseModal={CloseModal} />
            {/* <Update modal={editopenModal} CloseModal={CloseUpdateModal} editData={editData} /> */}
            {/* delete modal */}
            <Modal show={statusModal} onHide={() => setStatusModal(false)}>
                <Modal.Body>
                    Are you sure you want to {!checkedStatus ? 'deactivate' : 'activate'} this Task ?
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

export default TaskList;
