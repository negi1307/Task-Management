import React, { useState, useEffect, useRef } from 'react';
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
import { CSVLink } from 'react-csv';
import Pagination from '@mui/material/Pagination';
import { BiSolidDownload } from "react-icons/bi";
const AllUsers = () => {
    const store = useSelector((state) => state);
    const csvLink = useRef();
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [deleteId, setdeleteId] = useState();
    const [render, setRender] = useState(false);
    const getUsers = store?.getAllUsers;
    const deletehandle = store?.deleteUser;
    const [deletemodal, setDeleteModal] = useState(false);
    const [csvdownload, setcsvdownload] = useState([]);
    const [csvName, setCsvName] = useState();
    const [editData, setEditData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const csvdownloaddata = store?.getCsvDataReducer;

    const handeldelete = (ele) => {
        setdeleteId(ele?._id);
        setDeleteModal(true);
    };

    const handeldYes = async () => {
        await dispatch(deleteUser(deleteId));
        setDeleteModal(false);
        await dispatch(getAllUsers());
    };

    useEffect(() => {
        dispatch(getAllUsers());
    }, [render]);


    useEffect(() => {
        if (getUsers?.data?.status == 200) {
            setData(getUsers?.data?.response);
        }
    }, [getUsers]);

    useEffect(() => {
        if (deletehandle?.data?.status == 200) {
            ToastHandle('success', deletehandle?.data?.message);
        } else if (deletehandle?.status == 400) {
            ToastHandle('error', deletehandle?.data?.message);
        } else if (deletehandle?.status == 500) {
            ToastHandle('error', deletehandle?.data?.message);
        }
    }, [deletehandle]);
    const handelCsvDownload = (ele) => {
        setCsvName(ele?.firstName + ele?.lastName + ".csv")
        dispatch(getCSVdata(ele?._id));
    };
    useEffect(() => {
        if (csvdownloaddata?.data?.status == 200 && csvdownloaddata?.data?.length !== 0) {
            setcsvdownload(
                csvdownloaddata?.data?.data?.map((ele) => {
                    return {
                        Name: ele?.userId?.firstName + ' ' + ele?.userId?.lastName,
                        Time: moment(ele?.loginTime).format('LT'),
                        Date: moment(ele?.loginTime).format('DD-MM-YYYY'),
                    };
                })
            );
            setTimeout(() => {
                csvLink.current.link.click();
            }, 1000);
        }
    }, [csvdownloaddata]);
    useEffect(() => {
        if (csvdownloaddata?.data?.status == 200) {
            ToastHandle('success', csvdownloaddata?.data?.message);
        } else if (csvdownloaddata?.data?.status == 404) {
            ToastHandle('error', csvdownloaddata?.data?.message);
        } else if (csvdownloaddata?.data?.status == 500) {
            ToastHandle('error', csvdownloaddata?.data?.message);
        }
    }, [csvdownloaddata]);

    return (
        <div>
            <Card>
                <Card.Body>
                    <div className="row mx-auto">
                        <div className='col-12'>
                            <HeaderMain />
                        </div>
                        <div className="col-12 mt-2 text-center">
                            <h4 className="header-title py-1 heading_data page_headings">All Users</h4>
                        </div>
                    </div>
                    {getUsers?.loading ? (
                        <MainLoader />
                    ) : (
                        <Table className="mb-0 mt-2 add_Color_font" striped style={{ fontSize: '13px' }}>
                            <thead>
                                <tr className='text-start'>
                                    <th className='fw-bold'>#</th>
                                    <th className='fw-bold'>Username</th>
                                    <th className='fw-bold'>Role</th>
                                    <th className='fw-bold'>Email</th>
                                    <th className='fw-bold'>Create Date</th>
                                    <th className='fw-bold'>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                <>
                                    {data?.map((ele, ind) => {
                                        return (
                                            <tr className="align-middle text-start">
                                                <th scope="row">{ind + 1}</th>
                                                <td className="cp">
                                                    <span className="namelink"> {ele?.firstName.charAt(0).toUpperCase() + ele?.firstName.slice(1)} {ele?.lastName.charAt(0).toUpperCase() + ele?.lastName.slice(1)} </span>
                                                </td>
                                                <td className='namelink'>{ele?.role}</td>
                                                <td className="w-20">
                                                    <span className="namelink"> {ele?.email}</span>
                                                </td>
                                                <td>
                                                    <span className="namelink">
                                                        {moment(ele?.createdAt).format("DD/MM/YYYY")}
                                                    </span>
                                                </td>
                                                <td className='d-flex align-items-center gap-1'>
                                                    <i
                                                        className="mdi mdi-delete cursor_p  fs-5"
                                                        onClick={() => {
                                                            handeldelete(ele);
                                                        }}></i>
                                                    <BiSolidDownload className='fs-4 cursor_p' onClick={() => {
                                                        handelCsvDownload(ele);
                                                    }} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </>
                            </tbody>
                        </Table>
                    )}
                    <CSVLink
                        data={csvdownload}
                        filename={csvName}
                        className="hidden"
                        ref={csvLink}
                        id={`csvid`}
                        target="_blank">
                        <span></span>
                    </CSVLink>
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
