import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListGroup, Container, Row, Col, Table, Button, Form, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { TaskStatusAction, deleteTask, getsingleSprintTask, updateTask } from '../../../redux/task/action';
import MainLoader from '../../../constants/Loader/loader';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ToastHandle from '../../../constants/toaster/toaster';
import Create from './modal/create';
import { getAllProjects } from '../../../redux/projects/action';
import { getAllRoles, getAllUsers, getSingleSprint, getsingleMileStone } from '../../../redux/actions';
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
    const [taskStatus, settaskStatus] = useState(1);
    const [assigneeFilter, setAssigneeFilter] = useState(); //
    const getSingleSprintTask = store?.getSigleSprintTask?.data?.response;
    const deletehandle = store?.TaskStatusReducer?.data;
    const loaderhandel = store?.getSigleSprintTask;
    const handleCreate = () => {
        SetOpenModal(true);
    };
    const handleAssigneeFilterChange = (e) => {
        const selectedAssigneeId = e.target.value;
        dispatch(getsingleSprintTask({
            id: spriteId,
            activeStatus: true,
            skip: 1,
            taskStatus: taskStatus,
            projectId: projectId,
            milestoneId: milestoneId,
            assigneeId: selectedAssigneeId,
        }));
    }
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value); // Update skip state with the new page number
        dispatch(getsingleSprintTask({
            id: spriteId,
            taskStatus: taskStatus,
            activeStatus: true,
            skip: value, // Use the new page number (value) instead of the current state (skip)
            projectId: projectId,
            milestoneId: milestoneId
        }));
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
            setSkip(1);

            let data = {
                id: spriteId,
                activeStatus: true,
                skip: 1,
                taskStatus: taskStatus,
                projectId: projectId,
                milestoneId: milestoneId,

            };
            dispatch(getsingleSprintTask(data));
        } else {
            setStatus(0);
            setSkip(1);

            let data = {
                id: spriteId,
                activeStatus: false,
                skip: 1,
                taskStatus: taskStatus,
                projectId: projectId,
                milestoneId: milestoneId
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
            dispatch(updateTask(body));
        } else {
            let body = {
                taskId: checkedData._id,
                activeStatus: false,
            };
            dispatch(updateTask(body));
        }
        setStatusModal(false);
        setStatus(1);
    };
    useEffect(() => {
        dispatch(getsingleSprintTask({ id: spriteId, taskStatus: taskStatus, activeStatus: true, skip: skip, projectId: projectId, milestoneId: milestoneId }));
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
    useEffect(() => {
        let body = {
            status: 1,
            skip: '',
            projectStatus: '',
        };
        dispatch(getAllProjects(body));
    }, [render]);
    const handleTaskStatus = (val) => {
        if (val == '1') {
            settaskStatus(1);
            setSkip(1);
            dispatch(getsingleSprintTask({ id: spriteId, activeStatus: true, skip: 1, taskStatus: 1, projectId: projectId, milestoneId: milestoneId }));
        } else if (val == '2') {
            settaskStatus(2);
            setSkip(1);
            dispatch(getsingleSprintTask({ id: spriteId, activeStatus: true, skip: 1, taskStatus: 2, projectId: projectId, milestoneId: milestoneId }));
        } else if (val == '3') {
            setSkip(1);
            settaskStatus(3);
            dispatch(getsingleSprintTask({ id: spriteId, activeStatus: true, skip: 1, taskStatus: 3, projectId: projectId, milestoneId: milestoneId }));
        } else if (val == '4') {
            setSkip(1);
            settaskStatus(4);
            dispatch(getsingleSprintTask({ id: spriteId, activeStatus: true, skip: 1, taskStatus: 4, projectId: projectId, milestoneId: milestoneId }));
        } else {
            setSkip(1);
            settaskStatus(5);
            dispatch(getsingleSprintTask({ id: spriteId, activeStatus: true, skip: 1, taskStatus: 5, projectId: projectId, milestoneId: milestoneId }));
        }
    };

    return (
        <>
            <div className="row mx-auto">
                <div className="row d-flex align-items-center">
                    <div className={`col-auto  cp ${taskStatus == 1 ? 'Active_data' : 'InActive_data'}`}>
                        <p className="p-0 m-0 p-1 cp" onClick={() => handleTaskStatus('1')}>
                            Todo
                        </p>
                    </div>
                    <div className={`col-auto  cp ${taskStatus == 2 ? 'Active_data' : 'InActive_data'}`}>
                        <p className="p-0 m-0 p-1 cp" onClick={() => handleTaskStatus('2')}>
                            In Progress
                        </p>
                    </div>

                    <div className={`col-auto  cp ${taskStatus == 3 ? 'Active_data' : 'InActive_data'}`}>
                        <p className=" p-0 m-0 p-1 cp" onClick={() => handleTaskStatus('3')}>
                            Testing
                        </p>
                    </div>

                    <div className={`col-auto  cp ${taskStatus == 4 ? 'Active_data' : 'InActive_data'}`}>
                        <p className=" p-0 m-0 p-1 cp" onClick={() => handleTaskStatus('4')}>
                            Done
                        </p>
                    </div>
                    <div className={`col-auto  cp ${taskStatus == 5 ? 'Active_data' : 'InActive_data'}`}>
                        <p className="p-0 m-0 p-1 cp" onClick={() => handleTaskStatus('5')}>
                            Hold
                        </p>
                    </div>
                </div>
                <div className="d-flex col-4 mt-2">
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
                <div className="col-4 d-flex align-items-center justify-content-center">
                    <h4 className="header-title heading_data"> Tasks</h4>
                </div>
                {status == 1 && taskStatus == 1 ? (
                    <div className="col-4 d-flex align-items-center justify-content-end pe-0">
                        <Button className="mybutton btn px-2 fw-bold py-1  web_button" variant="info" onClick={handleCreate}>
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
                                    <thead style={{ fontSize: '13px!important' }}>
                                        <tr className='text-nowrap'>
                                            <th className='text-start fw-bold'>#</th>
                                            <th className='text-start fw-bold'>Description</th>
                                            <th className='text-start fw-bold'>Summary</th>
                                            <th className='text-start'>
                                                <select
                                                    name="assigneeFilter"
                                                    className="form-select list-table-filter border-0 p-0 text-black fw-bold w-75"
                                                    onChange={handleAssigneeFilterChange}
                                                    style={{ fontSize: '12px' }}
                                                >
                                                    <option value="">Assignee</option>
                                                    {store?.getAllUsers?.data?.response?.map((ele, ind) => (
                                                        <option key={ind} value={ele?._id}>
                                                            {ele?.firstName} {ele?.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </th>
                                            <th className='text-start fw-bold'>Reporter</th>
                                            <th className='text-start fw-bold'>Technology</th>
                                            <th className='text-start fw-bold'>Priority</th>
                                            <th className='d-flex text-black fw-bold justify-content-center'>
                                                Start Date
                                            </th>
                                            <th className='text-start fw-bold'> End Date</th>
                                            <th className='text-start fw-bold'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className='fw-medium' style={{ fontSize: '12px' }}>
                                        {getSingleSprintTask?.map((item, index) => (

                                            <tr className='text-nowrap'>
                                                <td className='text-start'>{(skip - 1) * 10 + index + 1}</td>
                                                <td className='text-start'>{item?.summary.split(' ').slice(0, 2).join(' ')}{item?.summary.split(' ').length > 2 ? ' ...' : ''}</td>
                                                <td className='text-start' style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {item?.description.split(' ').slice(0, 2).join(' ')}{item?.description.split(' ').length > 2 ? ' ...' : ''}
                                                </td>


                                                <td className='text-start'>
                                                    {item?.assigneeInfo?.firstName}{' '}
                                                    {item?.assigneeInfo?.lastName}
                                                </td>
                                                <td className='text-start'>{item?.reporterInfo?.firstName} {''}
                                                    {item?.reporterInfo?.lastName}
                                                </td>
                                                <td className='text-start'>{item?.technology?.name}
                                                </td>
                                                <td className='text-start'>
                                                    {item?.priority == 'Critical'
                                                        ? 'Critical'
                                                        : '' || item?.priority == 'High'
                                                            ? 'High'
                                                            : '' || item?.priority == 'Medium'
                                                                ? 'Medium'
                                                                : '' || item?.priority == 'Low'
                                                                    ? 'Low'
                                                                    : ''}
                                                </td>
                                                <td className='text-center'> {moment(item?.startDate).format("DD/MM/YYYY")}</td>
                                                <td className='text-start'>{moment(item?.dueDate).format("DD/MM/YYYY")}</td>
                                                <td className='text-center'>
                                                    <Form.Check
                                                        type="switch"
                                                        className='text-center pe-1 '
                                                        checked={item?.activeStatus}
                                                        onChange={(e) => handleStatusChange(e, item)}
                                                    />
                                                </td>
                                                <td className='text-start'>
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
                            <Col lg={12} className="d-flex justify-content-end my-3 pe-4 position-absolute bottom-0">
                                {store?.getSigleSprintTask?.data?.totalPages > 0 && (
                                    <Stack spacing={2}>
                                        <Pagination
                                            showFirstButton
                                            showLastButton
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

            <Create modal={openModal} CloseModal={CloseModal} />
            <Modal show={statusModal} onHide={() => setStatusModal(false)}>
                <Modal.Body>
                    Are you sure you want to {!checkedStatus ? 'Inactivate' : 'activate'} this Task ?
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
