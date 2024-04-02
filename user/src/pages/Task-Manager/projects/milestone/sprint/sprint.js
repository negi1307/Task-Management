import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ListGroup, Container, Row, Col, Card, Table, Form, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import Create from './modal/create';
import { getSingleSprint, updateSprint } from '../../../../../redux/sprint/action';
import ToastHandle from '../../../../../constants/toaster/toaster';
import Update from './modal/update';
import { Link } from 'react-router-dom';
import MainLoader from '../../../../../constants/Loader/loader';
import { getAllProjects } from '../../../../../redux/projects/action';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { getAllTask } from '../../../../../redux/task/action';
const Sprint = () => {
    const { projectId, milestoneId } = useParams();

    console.log(projectId, milestoneId, 'projectId');
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [render, setRender] = useState(false);
    const [data, setData] = useState();
    const [checkedStatus, setCheckedStatus] = useState([]);
    const [statusModal, setStatusModal] = useState(false);
    const [checkedData, setCheckedData] = useState();
    const [status, setStatus] = useState(1);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openModal, SetOpenModal] = useState(false);
    const [editData, setEditData] = useState();
    const GetAllSingleSprintData = store?.getProject?.data?.response;
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
            setStatus(true);
            setSkip(1);
            let data = {
                id: milestoneId,
                activeStatus: true,
                skip: 1,
            };
            dispatch(getSingleSprint(data));
        } else {
            setStatus(false);
            setSkip(1);

            let data = {
                id: milestoneId,
                activeStatus: false,
                skip: 1,
            };
            dispatch(getSingleSprint(data));
        }
        // console.log('9999999999999999999999999********************//////////////////')

    };
    const handleStatusChange = (e, data) => {
        if (e.target.checked) {
            setCheckedStatus(true);
        } else {
            setCheckedStatus(false);
        }
        setCheckedData(data);

        console.log(data, 'iddata')
        setStatusModal(true);
    };
    const handleYes = () => {
        if (checkedStatus) {
            let body = {
                sprintId: checkedData._id,
                activeStatus: true,
            };
            dispatch(updateSprint(body));
        } else {
            let body = {
                sprintId: checkedData._id,
                activeStatus: false,
            };
            dispatch(updateSprint(body));
            // console.log(checkedData, '2222222222222222222222222222222222222222222222222222222222222222222')
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
    useEffect(() => {
        dispatch(getSingleSprint({status:status ,id:milestoneId}));
    }, [render]);

    const sprintId = '660a549b60051a914094c6b2';
    useEffect(() => {
        let body = {
            flag: 'sprint',
            projectId: "65f18df95ef48c554ef88526",
            milestoneId: milestoneId,
            sprintId: sprintId,
            skip: 1,
            activeStatus: true,
            status: 1
        };


        dispatch(getAllProjects(body));
    }, []);


    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        let body = {
            flag: 'sprint',
            projectId: "65f18df95ef48c554ef88526",
            milestoneId: milestoneId,
            sprintId: '65f915d0e5a9aa48cfb11834',
            skip: 1,
        };
        dispatch(getAllProjects(body));
    };
    const truncateDescription = (description, maxLength = 30) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...';
        }
        return description;
    };
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
                                            className={`col-auto  cp ${status == true ? 'Active_data' : 'InActive_data'}`}>
                                            <p className="p-0 m-0 p-1 cp" onClick={() => handleActive(true)}>
                                                Active
                                            </p>
                                        </div>
                                        <div
                                            className={`col-auto  cp ${status == false ? 'Active_data' : 'InActive_data'}`}>
                                            <p className=" p-0 m-0 p-1 cp" onClick={() => handleActive(false)}>
                                                Inactive
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
                                            <tr >
                                                <th className='fw-bold'>#</th>
                                                <th className='fw-bold'>Sprint Name</th>
                                                <th className='fw-bold'>Sprint Description</th>
                                                <th className='fw-bold'>Sprint Start Date</th>
                                                <th className='fw-bold'>Days Left</th>
                                                <th className='fw-bold'>Sprint End Date</th>
                                                <th className='fw-bold'>Status</th>
                                                <th className='fw-bold'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {GetAllSingleSprintData?.map((item, index) => (
                                                <tr >
                                                    <td>{(skip - 1) * 10 + index + 1}</td>
                                                    <td>
                                                        <Link
                                                            className='text-secondary'
                                                            to={`/dashboard/taskBord/projectId=${projectId}&milestoneId=${item?._id}&spriteId=${sprintId}`}>
                                                            {item?.sprintName}
                                                        </Link>

                                                    </td>


                                                    <td>
                                                        <td className='d-flex justify-content-center'>
                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={<Tooltip>{truncateDescription(item?.sprintDesc)}</Tooltip>}
                                                            >
                                                                <div>
                                                                    {/* Show only a part of the description */}
                                                                    <div>{truncateDescription(item?.sprintDesc)}</div>
                                                                </div>
                                                            </OverlayTrigger>
                                                        </td>

                                                    </td>
                                                    <td> {moment(item?.startDate).format("DD/MM/YYYY")}</td>
                                                    <td>{item?.daysLeft}</td>
                                                    <td>{moment(item?.endDate).format('L')}</td>
                                                    <td>
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
                                                                        to={`/dashboard/taskBord/projectId=${projectId}&milestoneId=${item?._id}&spriteId=${sprintId}`}>
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
                        <Col lg={12} className="d-flex justify-content-end my-3 pe-4 position-absolute bottom-0">
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
