import React, { useState, useEffect,useRef  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ListGroup, Container, Row, Col, Table, Button, Card, CloseButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import MainLoader from '../../../constants/Loader/loader';
import ToastHandle from '../../../constants/toaster/toaster';
import { deleteUser, getAllUsers, getCSVdata } from '../../../redux/user/action';
import HeaderMain from '../header/HeaderMain';
import { CSVLink } from 'react-csv'
// import Update from './Sprint/update';
const AllUsers = () => {
    const store = useSelector((state) => state);
    const csvLink = useRef()
    
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [deleteId, setdeleteId] = useState();
    const [render, setRender] = useState(false);
    const getUsers = store?.getAllUsers;
    const deletehandle = store?.deleteUser;
    const [deletemodal, setDeleteModal] = useState(false);
    const [csvdownload, setcsvdownload] = useState([]);
    const [editData, setEditData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const csvdownloaddata = store?.getCsvDataReducer?.data?.loginRecords
    const [dataa, setDataa] = useState([])
    console.log(csvdownloaddata,"nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
    // const handelUpdate = (data) => {
    //     setEditData(data);
    //     setOpenEditModal(true);
    // };
    const closeupdatemodal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
        setOpenEditModal(false);
    };
    const handeldelete = (ele) => {
        setdeleteId(ele?._id);
        setDeleteModal(true);
    };

    const handeldYes = () => {
        dispatch(deleteUser(deleteId));
        setDeleteModal(false);
    };

    useEffect(() => {
        dispatch(getAllUsers());
        // dispatch(getCSVdata())
    }, [render]);
    useEffect(() => {
        if (getUsers?.data?.status == 200) {
            setData(getUsers?.data?.response);
        }
    }, [getUsers]);
    useEffect(() => {
        if (deletehandle?.data?.status == 200) {
            ToastHandle('success', deletehandle?.data?.message);
            closeupdatemodal('render');
        } else if (deletehandle?.status == 400) {
            ToastHandle('error', deletehandle?.data?.message);
        } else if (deletehandle?.status == 500) {
            ToastHandle('error', deletehandle?.data?.message);
        }
    }, [deletehandle]);
    const handelCsvDownload = (ele) => {
     dispatch(getCSVdata(ele?._id));
        setcsvdownload(csvdownloaddata, "getttttttt");
        console.log(csvdownloaddata, "dattaaaaaaaaa")
        if(csvdownloaddata){
            setDataa(csvdownloaddata)
        }
        csvLink.current.link.click()
    };
console.log( dataa,"bvcxcvbnmmmmmmmmmmmmmmmmmmmmm")
    return (
        <div>
            <Card>
                <Card.Body>
                    <div className="row mx-auto">
                        <HeaderMain />

                        <div className="col-6 d-flex align-items-end justify-content-end">
                            <h4 className="header-title heading_data"> All Users</h4>
                        </div>
                    </div>
                    {getUsers?.loading ? (
                        <MainLoader />
                    ) : (
                        <Table className="mb-0 add_Color_font" striped>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th> First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th> Create Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                <>
                                    {data?.map((ele, ind) => {
                                        return (
                                            <tr className="align-middle">
                                                <th scope="row">{ind + 1}</th>
                                                <td className="cp">
                                                    <span className="namelink"> {ele?.firstName} </span>
                                                </td>
                                                <td className="cp">
                                                    <span className="namelink"> {ele?.lastName} </span>
                                                </td>
                                                <td className="w-20">
                                                    <span className="namelink"> {ele?.email}</span>
                                                </td>

                                                <td>
                                                    <span className="namelink">
                                                        {moment(ele?.createdAt).format('L')}
                                                    </span>
                                                </td>

                                                <td>
                                                    <Row>
                                                        <Col>
                                                            <p className="action-icon m-0 p-0  ">
                                                                <i
                                                                    className="mdi mdi-delete m-0 p-0"
                                                                    onClick={() => {
                                                                        handeldelete(ele);
                                                                    }}></i>
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </td>
                                                <td>
                                                    <button onClick={() => handelCsvDownload(ele)}></button>
                                                    {/* <CSVLink
                                                        data={csvdownloaddata}
                                                        filename="userdata.csv"
                                                        className="hidden"
                                                        ref={csvLink}
                                                        target="_blank"
                                                    /> */}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </>
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
            {/* delete modal */}
            <Modal show={deletemodal} onHide={() => setDeleteModal(false)}>
                {deletehandle?.loading ? (
                    <MainLoader />
                ) : (
                    <>
                        <Row>
                            <Col lg={12} className="text-end mt-1 ">
                                <CloseButton
                                    className="pe-2"
                                    onClick={() => {
                                        setDeleteModal(false);
                                    }}
                                />
                            </Col>
                        </Row>

                        <Modal.Body>Are you sure you want to delete this User</Modal.Body>
                        <Modal.Footer>
                            <Button className=" web_button " variant="primary" onClick={handeldYes}>
                                Yes
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setDeleteModal(false);
                                }}>
                                No
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default AllUsers;
