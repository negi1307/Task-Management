import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import Create from "./modal/create"
const Upload = () => {
    const [openModal ,SetOpenModal]=useState(false);
    const handleUpload =()=>{
        SetOpenModal(true)
    }
    const closeModal =()=>{
        SetOpenModal(false)
    }
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
                </Card.Body>
            </Card>
            <Create modal={openModal} closemodal={closeModal}/>
        </>
    );
};

export default Upload;
