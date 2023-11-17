import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Row, Col } from 'react-bootstrap';
import Create from './modal/create';
import { useDispatch, useSelector } from 'react-redux';
import { getuploadProjectDetailAction } from '../../../redux/clientRepository/action';
const Upload = () => {
    const dispatch = useDispatch();
    const [openModal, SetOpenModal] = useState(false);
    
    const handleUpload = () => {
        SetOpenModal(true);
    };
    const closeModal = () => {
        SetOpenModal(false);
    };
    useEffect(() => {
        dispatch(getuploadProjectDetailAction());
    }, []);

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
                                  
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Create modal={openModal} closemodal={closeModal} />
        </>
    );
};

export default Upload;
