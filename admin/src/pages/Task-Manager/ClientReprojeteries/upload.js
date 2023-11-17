import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Row, Col } from 'react-bootstrap';
import Create from './modal/create';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getuploadProjectDetailAction } from '../../../redux/clientRepository/action';
import image from '../../../../src/assets/images/photo.png';
import csv from '../../../../src/assets/images/csv.png';
import pdf from '../../../../src/assets/images/pdf.png';
import zip from '../../../../src/assets/images/zip.png';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
const Upload = () => {
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const [openModal, SetOpenModal] = useState(false);
    const store = useSelector((state) => state);
    const [skip, setSkip] = useState(1);
    const getUploadedData = store?.getuploadProjectDetailReducer;
    const handleUpload = () => {
        SetOpenModal(true);
    };
    const closeModal = () => {
        SetOpenModal(false);
    };
    useEffect(() => {
        dispatch(getuploadProjectDetailAction({skip : skip , projectId: projectId}));
    }, []);
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        dispatch(getuploadProjectDetailAction({ skip: value , projectId: projectId}));
    };

    return (
        <>
            <Card>
                <Card.Body>
                    <div className="col-12 d-flex align-items-center justify-content-center pe-0">
                        <Button className="web_button" variant="info" onClick={handleUpload}>
                            Upload
                            <span className="ms-1">
                                <i class="bi bi-arrow-down-circle"></i>
                            </span>
                        </Button>
                    </div>
                    <Row>
                        <Col lg={12}>
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th> File Name</th>
                                        <th> File</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getUploadedData?.data?.response?.map((ele, ind) => (
                                        <tr>
                                            <td>{(skip - 1) * 10 + ind + 1}</td>
                                            <td>{ele?.fileName}</td>
                                            <td>
                                                <div style={{width: "3rem"}}>
                                                {ele?.attachmentType == 'application/zip' ? (
                                                    <img  style={{width: "100%"}} src={zip} />
                                                ) : '' || ele?.attachmentType == 'image/png' || ele?.attachmentType =="image/jpeg" || ele?.attachmentType == "image/webp" ? (
                                                    <img  style={{width: "100%"}} src={image} />
                                                ) : '' || ele?.attachmentType == 'text/csv' ? (
                                                    <img   style={{width: "100%"}} src={csv} />
                                                ) : 
                                                    '' || ele?.attachmentType == 'application/pdf' ? (
                                                        <img    style={{width: "100%"}} src={pdf} />
                                                    ) : 
                                                        '' 
                                                }
                                                </div>
                                              
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} className="d-flex justify-content-end mt-3">
                            {store?.getuploadProjectDetailReducer?.data?.totalPages > 0 && (
                                <Stack spacing={2}>
                                    <Pagination
                                        defaultPage={skip}
                                        count={store?.getuploadProjectDetailReducer?.data?.totalPages}
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
            <Create modal={openModal} closemodal={closeModal} />
        </>
    );
};

export default Upload;
