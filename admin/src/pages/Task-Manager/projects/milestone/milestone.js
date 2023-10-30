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
    const GetSinglemilstonesData = store?.getSigleMileStone?.data?.response;
    const loaderhandel = store?.getSigleMileStone;
    const [skip, setSkip] = useState(1);
    const [checkedStatus, setCheckedStatus] = useState();
    const [statusModal, setStatusModal] = useState(false);
    const [checkedData, setCheckedData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editData, setEditData] = useState();
    const deletehandle = store?.deleteMileStone?.data;
    const closeModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
        setOpenModel(false);
    };
    const handleActive = (val) => {
        if (val) {
            setStatus(1);
            let data = {
                id: id,
                activeStatus: 1,
                skip
                , mileStoneId: ""
            };
            dispatch(getsingleMileStone(data));
        } else {
            setStatus(0);
            let data = {
                id: id,
                activeStatus: 0,
                skip, mileStoneId: ""
            };
            dispatch(getsingleMileStone(data));
        }
    };
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        dispatch(getsingleMileStone({ id: id, activeStatus: status, skip: value, mileStoneId: "" }));
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
                milestoneId: checkedData._id,
                activeStatus: true,
            };
            dispatch(deleteMileStone(body));
        } else {
            let body = {
                milestoneId: checkedData._id,
                activeStatus: false,
            };
            dispatch(deleteMileStone(body));
        }
        setStatusModal(false);
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
    useEffect(() => {
        dispatch(getsingleMileStone({ id: id, activeStatus: status, skip, mileStoneId: "" }));
    }, [render]);

    return (
        <>
            {/* {/ <h1>{id}</h1> /} */}
            <div className="my-3">
                <Row>
                    {/* <Col className="text-end" lg={12}>
                        <Button
                            onClick={() => {
                                setOpenModel(true);
                            }}
                           

                            variant="info"
                            type="submit"
                            className="btn fs-5  text-white p-1   web_button">
                            Add Milestone
                        </Button>
                    </Col> */}
                </Row>
                {loaderhandel.loading ? (
                    <MainLoader />
                ) : (
                    <>

                        <Card className="mx-0">
                            <Card.Body>
                                <Col className="mx-0" lg={12}>
                                    <Row >
                                        <div className="row   ">
                                            <div className="d-flex col-4">
                                                <div className="row d-flex align-items-center">
                                                    <div
                                                        className={`col-auto  cp ${status == 1 ? 'Active_data' : 'InActive_data'
                                                            }`}>
                                                        <p
                                                            className="p-0 m-0 p-1 cp"
                                                            onClick={() => handleActive(true)}>
                                                            Active
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={`col-auto  cp ${status == 0 ? 'Active_data' : 'InActive_data'
                                                            }`}>
                                                        <p
                                                            className=" p-0 m-0 p-1 cp"
                                                            onClick={() => handleActive(false)}>
                                                            Deactive
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4 d-flex align-items-center justify-content-center">
                                                <h4 className="header-title heading_data"> Milestones</h4>
                                            </div>
                                            <div className="col-4 d-flex align-items-center justify-content-end">
                                                <Button
                                                    onClick={() => {
                                                        setOpenModel(true);
                                                    }}


                                                    variant="info"
                                                    type="submit"
                                                    className="btn fs-5  text-white p-1   web_button">
                                                    Add Milestone
                                                </Button>
                                            </div>
                                        </div>
                                        <Col className="" lg={12}>
                                            <Table striped>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th> MileStone Name</th>
                                                        <th> Description</th>
                                                        <th> Start Date</th>
                                                        <th> End Date</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {GetSinglemilstonesData?.map((item, index) => (
                                                        <tr>
                                                            <td>{(skip - 1) * 10 + index + 1}</td>
                                                            <td>{item?.title}</td>
                                                            <td>
                                                                {' '}
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: item?.description,
                                                                    }}
                                                                />
                                                            </td>

                                                            <td> {moment(item?.startDate).format('L')}</td>
                                                            <td>{moment(item?.completionDate).format('L')}</td>
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
                                                                                to={`/dashboard/singleMilestonesprint/projectId=/${item?.projectId?._id}&milestoneId=/${item?._id}`}>
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
                                    </Row>
                                </Col>
                                <Row>
                                    <Col lg={12} className="d-flex justify-content-end mt-3">
                                        {store?.getSigleMileStone?.data?.totalPages > 0 && (
                                            <Stack spacing={2}>
                                                <Pagination
                                                    defaultPage={skip}
                                                    count={store?.getSigleMileStone?.data?.totalPages}
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
                {/* delete modal */}
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
                        <Button className=" web_button " variant="primary" onClick={() => handleYes()}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Milestone;
