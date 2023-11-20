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
// import ToastHandle from '../../../constants/toaster/toaster';
const Milestone = () => {
    const { id } = useParams();
    console.log(id,"nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
    const store = useSelector((state) => state);

    const dispatch = useDispatch();
    const [openModel, setOpenModel] = useState(false);
    const [render, setRender] = useState(false);
    const [status, setStatus] = useState(1);
    const GetDataById = store?.getProjectById?.data?.project;
    
    // const GetSinglemilstonesData = store?.getSigleMileStone?.data?.Response;
    const getMileStoneData=store?.getProject?.data?.response
    console.log("getMileStoneData",getMileStoneData)
    const loaderhandel = store?.getSigleMileStone;
    const [checkedStatus, setCheckedStatus] = useState();
    const [statusModal, setStatusModal] = useState(false);
    const [checkedData, setCheckedData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editData, setEditData] = useState();
    const deletehandle = store?.deleteMileStone?.data
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
                status: 1,
            };
            dispatch(getsingleMileStone(data));
        } else {
            setStatus(0);
            let data = {
                id: id,
                status: 0,
            };
            dispatch(getsingleMileStone(data));
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
                status: true
            }
            dispatch(deleteMileStone(body));
        } else {
            let body = {
                id: checkedData._id,
                status: false
            }
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
    }, [deletehandle])
    useEffect(() => {
        dispatch(getProjectsById(id));
        dispatch(getsingleMileStone({id:id ,status:status}));
    }, [render]);
useEffect(()=>{
    let body = {
        flag:2,
        projectId:id,
        milestoneId:'',
        skip:1

    };
dispatch(getAllProjects(body))
},[])

    return (
        <>
            {/* {/ <h1>{id}</h1> /} */}
       
                {/* <Row>
                    <Col className="text-end" lg={12}>
                        <Button
                            onClick={() => {
                                setOpenModel(true);
                            }}

                            variant="info"
                            type="submit"
                            className="btn fs-5  text-white p-1   web_button">
                            Add Milestone
                        </Button>
                    </Col>
                </Row> */}
                {loaderhandel.loading ? (
                    <MainLoader />
                ) : (
                    <>
                        {/* <Row>
                            <Col lg={12}>
                                <Row>
                                    <Col className="text-center" lg={12}>
                                        <h4> Project</h4>
                                    </Col>
                                    <Row>
                                        <Col lg={12} className='d-flex justify-content-between'>
                                            <div className='d-flex'><h5 className='p-0 m-0'>Project Name :</h5>
                                                <p className='p-0 m-0'>{GetDataById?.projectName}</p></div>
                                            <div className='d-flex '><h5 className='p-0 m-0'>Client Name :</h5>
                                                <p className='p-0 m-0'>{GetDataById?.clientName}</p></div>
                                            <div className='d-flex '><h5 className='p-0 m-0'>Project Type :</h5>
                                                <p className='p-0 m-0'>{GetDataById?.projectType}</p></div>
                                            <div className='d-flex '><h5 className='p-0 m-0'>Project Start Date :</h5>
                                                <p className='p-0 m-0'> {moment(GetDataById?.startDate).format('L')}</p></div>
                                            <div className='d-flex '><h5 className='p-0 m-0'>Project End Date :</h5>
                                                <p className='p-0 m-0'> {moment(GetDataById?.endDate).format('L')}</p></div>
                                        </Col>
                                    </Row>




                                </Row>
                            </Col>


                        </Row> */}
                        <Card className='mt-3'>
                            <Card.Body>
                                <Col className="mx-auto" lg={12}>
                                    <Row>
                                        {/* <div className="row mx-auto mt-2">
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
                                                <h4 className="header-title heading_data"> Milestones</h4>
                                            </div>
                                        </div> */}
                                        <Col className="" lg={12}>

                                            <Table striped>
                                                <thead >
                                                    <tr>
                                                        <th>#</th>
                                                        <th> MileStone Name</th>
                                                        <th> Description</th>
                                                        <th> Start Date</th>
                                                        <th> End Date</th>
                                                        {/* <th>Status</th> */}
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getMileStoneData?.map((item, index) => (
                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td>{item?.milestoneId?.title}</td>
                                                            <td>  <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: item?.milestoneId?.description,
                                                    }}
                                                /></td>

                                                            <td> {moment(item?.milestoneId?.start_date).format('L')}</td>
                                                            <td>{moment(item?.milestoneId?.completion_date).format('L')}</td>
                                                            {/* <td> <Form.Check
                                                                type="switch"
                                                                checked={item?.status}
                                                                onChange={(e) => handleStatusChange(e, item)}
                                                            /></td> */}
                                                            <td> <Row>
                                                                <Col>
                                                                    <p className="action-icon m-0 p-0 ">
                                                                        <Link to={`/dashboard/singleMilestonesprint/projectId=/${item?.projectId}&milestoneId=/${item?.milestoneId?._id}`}>
                                                                            <i className="mdi mdi-eye m-0 p-0"></i>
                                                                        </Link>
                                                                    </p>
                                                                    {/* <p className="action-icon m-0 p-0  ">
                                                                        <i
                                                                            onClick={() => {
                                                                                handelUpdate(item);
                                                                            }}
                                                                            className="uil-edit-alt m-0 p-0"
                                                                        ></i>
                                                                    </p> */}

                                                                </Col>
                                                            </Row></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>

                                        </Col>
                                    </Row>
                                </Col>
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
            
        </>
    );
};

export default Milestone;