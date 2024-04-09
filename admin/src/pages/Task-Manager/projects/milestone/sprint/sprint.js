import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ListGroup, Container, Row, Col, Card, Table, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import Create from './modal/create';
import { getSingleSprint, deleteSprint, updateSprint } from '../../../../../redux/sprint/action';
import ToastHandle from '../../../../../constants/toaster/toaster';
import Update from './modal/update';
import { Link } from 'react-router-dom';
import MainLoader from '../../../../../constants/Loader/loader';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import getAllSingleSprints from '../../../../../constants/endpoint';

const Sprint = () => {
    const { projectId, milestoneId } = useParams();
    // console.log({ projectId, milestoneId });
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [render, setRender] = useState(false);
    const [skip, setSkip] = useState(1);
    const [data, setData] = useState();
    const [checkedStatus, setCheckedStatus] = useState();
    const [statusModal, setStatusModal] = useState(false);
    const [checkedData, setCheckedData] = useState();
    const [status, setStatus] = useState(true);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openModal, SetOpenModal] = useState(false);
    const [editData, setEditData] = useState();
    const GetAllSingleSprintData = store?.getAllSingleSprints?.data?.response;
    const deletehandle = store?.deleteSprint?.data;
    const loaderhandel = store?.getAllSingleSprints;
    const handelUpdate = (data) => {
        setEditData(data);
        setOpenEditModal(true);
    };
    // console.log({ GetAllSingleSprintData });

    // for getting the sprints on update and after adding new sprints
    const getUpdatedSprints = () => {
        dispatch(getSingleSprint({ activeStatus: status, id: milestoneId, skip }));
    }
    // ///////////////////////////
    const closeupdatemodal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
        setOpenEditModal(false);
        getUpdatedSprints();
    };


    // CReate nrw sprint modal functions
    const getAddedSprints = () => {
        dispatch(getSingleSprint({ activeStatus: status, id: milestoneId, skip }));
    }
    const handleCreate = () => {
        SetOpenModal(true);
    };
    // //////////////////////////////////////
    const CloseModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
        SetOpenModal(false);
        getAddedSprints();
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
    const handleStatusChange = async (e, data) => {
        setCheckedStatus(e.target.checked);
        setCheckedData(data);
        const body = {
            sprintId: data._id,
            activeStatus: e.target.checked,
        };

        await dispatch(updateSprint(body));


        dispatch(getSingleSprint({ activeStatus: status, id: milestoneId, skip }));

        setStatusModal(false);
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
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        dispatch(getSingleSprint({ activeStatus: status, id: milestoneId, skip: value }));
    };

    const fetchSprintData = () => {
        // console.log(status, milestoneId, skip);
        dispatch(getSingleSprint({ activeStatus: status, id: milestoneId, skip }));
    };

    useEffect(() => {
        if (deletehandle?.status === 200) {
            ToastHandle('success', deletehandle?.message);
            CloseModal('render');
        } else if (deletehandle?.status === 400) {
            ToastHandle('error', deletehandle?.message);
        } else if (deletehandle?.status === 500) {
            ToastHandle('error', deletehandle?.message);
        }
    }, [deletehandle]);


    useEffect(() => {
        // console.log("----------called");
        fetchSprintData(); // Fetch initial data
        // const intervalId = setInterval(fetchSprintData, 50000); // Fetch data every 5 seconds

        // return () => clearInterval(intervalId); // Clean up on unmount
    }, [status, milestoneId, skip]);

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
                                <div className="d-flex col-6">
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
                                                Inactive
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {status == 1 ? (
                                    <div className="col-6 d-flex align-items-center justify-content-end pe-0">
                                        <Button
                                            variant="info"
                                            onClick={handleCreate}
                                            className="mybutton btn p-1 fw-bold py-1  web_button">
                                            Add Sprint
                                        </Button>
                                    </div>
                                ) : (
                                    ''
                                )}
                                <div className="col-12 d-flex align-items-center justify-content-center">
                                    <h4 className="header-title page_headings heading_data py-1"> Sprints</h4>
                                </div>
                            </div>
                            {loaderhandel.loading ? (
                                <MainLoader />
                            ) : (
                                <Col className="" lg={12}>
                                    <Table striped style={{ fontSize: '13px!important' }}>
                                        <thead>
                                            <tr >
                                                <th className='fw-bold text-start'>#</th>
                                                <th className='fw-bold text-start'>Sprint Name</th>
                                                <th className='fw-bold text-start'>Sprint Description</th>
                                                <th className='fw-bold text-start'>Sprint Start Date</th>
                                                <th className='fw-bold text-start'>Sprint End Date</th>
                                                <th className='fw-bold text-start'>Days Left</th>
                                                <th className='fw-bold text-start'>Status</th>
                                                <th className='fw-bold text-start'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {GetAllSingleSprintData?.map((item, index) => (
                                                <tr>
                                                    <td className='text-start'>{(skip - 1) * 10 + index + 1}</td>
                                                    <td className='text-start'>
                                                        <Link
                                                            className='text-secondary'
                                                            to={`/dashboard/taskBord/projectId=/${item?.project?._id}&milestoneId=/${item?.milestone?._id}&spriteId=/${item?._id}`}>
                                                            {item?.sprintName}
                                                        </Link>
                                                    </td>


                                                    <td className='text-start'>
                                                        <td className='text-start'>
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
                                                    <td className='text-start'> {moment(item?.startDate).format("DD/MM/YYYY")}</td>
                                                    <td className='text-start'>{moment(item?.endDate).format('L')}</td>
                                                    <td className='text-start'>{item?.daysLeft}</td>
                                                    <td className='text-start'>
                                                        <Form.Check
                                                            type="switch"
                                                            checked={item?.activeStatus}
                                                            onChange={(e) => handleStatusChange(e, item)}
                                                        />
                                                    </td>
                                                    <td className='text-start'>
                                                        {' '}
                                                        <Row>
                                                            <Col>
                                                                <p className="action-icon m-0 p-0 ">
                                                                    <Link
                                                                        to={`/dashboard/taskBord/projectId=/${item?.project?._id}&milestoneId=/${item?.milestone?._id}&spriteId=/${item?._id}`}>
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
