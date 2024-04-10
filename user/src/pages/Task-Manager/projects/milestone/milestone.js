import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Button, Modal, Row, Col, Card } from 'react-bootstrap';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import MainLoader from '../../../../constants/Loader/loader';
import ToastHandle from '../../../../constants/toaster/toaster';
import Create from '../milestone/modal/create';
import Update from './modal/update';
import { getProjectsById } from '../../../../redux/projects/action';
import { deleteMileStone, getallMileStones, getsingleMileStone } from './../../../../redux/milestone/action';
import { getAllProjects } from '../../../../redux/projects/action';

const Milestone = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const store = useSelector(state => state);
    // console.log({ id })
    const [openModel, setOpenModel] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const [checkedData, setCheckedData] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [skip, setSkip] = useState(1);

    const getMileStoneData = store.getProject.data?.response;
    const loaderhandle = store.getSigleMileStone;
    const deletehandle = store.deleteMileStone?.data;

    useEffect(() => {
        dispatch(getProjectsById(id));
        dispatch(getsingleMileStone({ id: id, status: 1 }));
        dispatch(getAllProjects({ flag: 'milestone', projectId: id, milestoneId: '', skip: 1 }));
    }, [id]);

    useEffect(() => {
        if (deletehandle) {
            if (deletehandle.status === 200) {
                ToastHandle('success', deletehandle.message);
                closeModal();
            } else {
                ToastHandle('error', deletehandle.message);
            }
        }
    }, [deletehandle]);

    const closeModal = () => {
        setOpenModel(false);
        setOpenEditModal(false);
        setStatusModal(false);
    };

    const handleStatusChange = (e, data) => {
        const newCheckedStatus = e.target.checked;
        setCheckedData(data);
        setStatusModal(newCheckedStatus);
    };

    const handleYes = () => {
        const newStatus = checkedData.status ? false : true;
        const body = { id: checkedData._id, status: newStatus };
        dispatch(deleteMileStone(body));
        setStatusModal(false);
    };

    const handlePaginationChange = (event, value) => {
        setSkip(value);
        dispatch(getAllProjects({ flag: 'milestone', projectId: id, milestoneId: '', skip: value }));
    };

    return (
        <>
            <div className='title'><h3>MILESTONES</h3></div>
            {loaderhandle.loading ? (
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
                                                <tr className='text-start'>
                                                    <th>#</th>
                                                    <th>MileStone Name</th>
                                                    <th>Description</th>
                                                    <th>Start Date</th>
                                                    <th>Due Days</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getMileStoneData && getMileStoneData.map((item, index) => (
                                                    <tr className='text-start' key={item._id}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <Link className='text-secondary'
                                                                to={`/dashboard/singleMilestonesprint/projectId=/${id}&milestoneId=/${item?._id}`}>
                                                                {item.title}
                                                            </Link>
                                                        </td>
                                                        <td dangerouslySetInnerHTML={{ __html: item.description }} />
                                                        <td>{moment(item.start_date).format('DD/MM/YYYY')}</td>
                                                        <td>{item.daysLeft}</td>
                                                        <td>
                                                            <Row>
                                                                <Col>
                                                                    <p className="action-icon m-0 p-0 ">
                                                                        <Link
                                                                            to={`/dashboard/singleMilestonesprint/projectId=/${id}&milestoneId=/${item?._id}`}>
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
                                    {store.getProject.data.totalPages > 0 && (
                                        <Stack spacing={2}>
                                            <Pagination
                                                defaultPage={skip}
                                                count={store.getProject.data.totalPages}
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
            <Update modal={openEditModal} closeModal={closeModal} editData={editData} />

            <Modal show={statusModal} onHide={() => setStatusModal(false)}>
                <Modal.Body>
                    Are you sure you want to {!checkedData?.status ? 'deactivate' : 'activate'} this MileStone?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>No</Button>
                    <Button className=" web_button " variant="primary" onClick={handleYes}>Yes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Milestone;
