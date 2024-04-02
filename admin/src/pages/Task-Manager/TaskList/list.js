import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListGroup, Container, Row, Col, Table, Button, Form, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';
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
    const [activeStatus, setActiveStatus] = useState(true);
    const [taskStatus, settaskStatus] = useState(1);
    const getSingleSprintTask = store?.getSigleSprintTask?.data?.response;
    const deletehandle = store?.TaskStatusReducer?.data;
    const loaderhandel = store?.getSigleSprintTask;
    // console.log(getSingleSprintTask, '11111111111111111111111111111111111111111111111111111111111111111111111111')
    const [assigneeFilter, setAssigneeFilter] = useState('');
    const filterAssignee = (item) => {
        if (!assigneeFilter) return true;
        return item.assigneeInfo?._id === assigneeFilter;
    };
    const [startDateFilter, setStartDateFilter] = useState(null);

    // Handler function for updating start date filter
    const handleStartDateFilterChange = (date) => {
        setStartDateFilter(date);
    };

    // Filter function for tasks based on start date
    const filterStartDate = (item) => {
        if (!startDateFilter) return true;
        return moment(item.startDate).isSame(startDateFilter, 'day');
    };

    const handleAssigneeFilterChange = (e) => {
        setAssigneeFilter(e.target.value);
    };

    const handleCreate = () => {
        SetOpenModal(true);
    };
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        dispatch(getsingleSprintTask({ id: spriteId, taskStatus: taskStatus, activeStatus: true, skip: skip, projectId: projectId, milestoneId: milestoneId }));
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
                milestoneId: milestoneId

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
    function truncateAfterTwoWords(text) {
        const words = text.split(' ');
        const truncatedText = words.slice(0, 2).join(' ');
        return truncatedText.length < text.length ? truncatedText + '...' : truncatedText;
    }
    function getTextFromHTML(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

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
                                            <th className='text-start'>#</th>
                                            <th className='text-start'>Description</th>
                                            <th className='text-start'>Summary</th>
                                            <th className='border-0 text-start '>
                                                <select
                                                    name="assigneeFilter"
                                                    className="custom-select list_select p-0 w-75 border-0"
                                                    style={{ outline: 'none !important' }}
                                                    value={assigneeFilter}
                                                    onChange={handleAssigneeFilterChange}
                                                >
                                                    <option value="">Assignees</option>
                                                    {store?.getAllUsers?.data?.response?.map((ele, ind) => (
                                                        <option key={ind} value={ele?._id}>
                                                            {ele?.firstName} {ele?.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </th>
                                            <th className='text-start'>Reporter</th>
                                            <th className='text-start'>Priority</th>
                                            <th className='border-0 text-start'>
                                                <DatePicker
                                                    selected={startDateFilter} // Pass selected date as prop
                                                    onChange={handleStartDateFilterChange} // Handle date change
                                                    dateFormat="dd/MM/yyyy" // Date format
                                                    className="w-50 add_width_input p-0 border-0  mb-0"
                                                    placeholderText='Start date'
                                                />
                                            </th>
                                            <th className='text-start'> End Date</th>
                                            <th className='text-start'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getSingleSprintTask?.filter(filterStartDate)?.filter(filterAssignee)?.length > 0 ? (
                                            getSingleSprintTask?.filter(filterStartDate)?.filter(filterAssignee)?.map((item, index) => (
                                                <tr>
                                                    <td className='text-start'>{(skip - 1) * 10 + index + 1}</td>
                                                    <td className='text-start text-nowrap '>{truncateAfterTwoWords(item?.summary)}</td>
                                                    <td className="text-start text-truncate" dangerouslySetInnerHTML={{ __html: truncateAfterTwoWords(getTextFromHTML(item?.description)) }} />

                                                    <td className='text-nowrap text-start'>
                                                        {item?.assigneeInfo?.firstName}{' '}
                                                        {item?.assigneeInfo?.lastName}
                                                    </td>
                                                    <td className='text-nowrap text-start'>
                                                        {item?.reporterInfo?.firstName} {''}
                                                        {item?.reporterInfo?.lastName}
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
                                                    <td className='text-start'> {moment(item?.startDate).format("DD/MM/YYYY")}</td>
                                                    <td className='text-start'>{moment(item?.dueDate).format("DD/MM/YYYY")}</td>
                                                    <td className='text-start'>
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

                                            ))
                                        ) : (

                                            <tr className='w-100 text-center'>
                                                <td colSpan={12}>
                                                    <p className='text-black fs-3 fw-bolder py-5'>No Data Found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} className="d-flex justify-content-end my-3 pe-4 position-absolute bottom-0">
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

            <Create modal={openModal} CloseModal={CloseModal} />
            {/* {/ <Update modal={editopenModal} CloseModal={CloseUpdateModal} editData={editData} /> /}
            {/ delete modal /} */}
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
