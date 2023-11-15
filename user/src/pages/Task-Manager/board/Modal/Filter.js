import React, { useState } from 'react';

import { Badge, CloseButton, Col, Form, Modal, Row } from 'react-bootstrap';

const Filter = ({ modal, closeModal }) => {
    const closemodal = () => {
        closeModal();
    };
    // const assigneeArray = new Array(15);
    const [assigneeArray, setAssigneeArray] = useState([1, 2, 1, 2, 1, 2, 1]);
    const [tickHandleAssigned, setTickHandleAssigned] = useState(false);
    const [tickHandleDue, setTickHandleDue] = useState(false);
    return (
        <Modal show={modal} onHide={closemodal}>
            <Modal.Header>
                <h4>FILTERS</h4>
                <span>Clear</span>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <h4>
                        <Row>
                            <Col lg={1}>
                                <span class="mdi mdi-account-circle me-2"></span>
                            </Col>
                            <Col onClick={() => setTickHandleAssigned(!tickHandleAssigned)} lg={6}>
                                Assigned To Me
                            </Col>
                            {tickHandleAssigned ? (
                                <Col className="d-flex justify-content-end" lg={4}>
                                    <span class="mdi mdi-check"></span>
                                </Col>
                            ) : null}
                        </Row>
                    </h4>

                    <h4>
                        <Row>
                            <Col lg={1}>
                                <span class="mdi mdi-calendar-blank me-2"></span>
                            </Col>
                            <Col onClick={() => setTickHandleDue(!tickHandleDue)} lg={6}>
                                Due this Week
                            </Col>
                            {tickHandleDue ? (
                                <Col className="d-flex justify-content-end" lg={4}>
                                    <span class="mdi mdi-check"></span>
                                </Col>
                            ) : null}
                        </Row>
                    </h4>
                </div>
                <hr />
                <Row>
                    <Col>
                        <h5 className="mt-2">ASSIGNEE</h5>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex flex-row">
                        <div className="round_icons d-flex justify-content-center align-items-center me-1">AM</div>
                        <div className="round_icons d-flex justify-content-center align-items-center">NN</div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h5 className="mt-3">CATEGORY</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="checkboxStyle d-flex justify-content-center align-items-center p-2">
                            <Form.Check // prettier-ignore
                                type="checkbox"
                                id="custom-switch"
                                label="No Category"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h5 className="mt-3">ISSUE TYPE</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="darkCheckBox p-2 d-flex justify-content-center align-items-center">
                            <Form.Check // prettier-ignore
                                type="checkbox"
                                id="custom-switch"
                                label="Task"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h5 className="mt-3">ISSUE TYPE</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="checkboxStyle p-2 d-flex justify-content-center align-items-center">
                            <Form.Check // prettier-ignore
                                type="checkbox"
                                id="custom-switch"
                                label="No Label"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h5 className="mt-3">PRIORITY</h5>
                    </Col>
                </Row>
                <Row>
                    <Col className="priorityButtons">
                        <span className="mdi mdi-36px mdi-chevron-double-up "></span>
                        <span className="mdi mdi-36px mdi-chevron-up"></span>
                        <span className="mdi mdi-36px mdi-equal"></span>
                        <span className="mdi mdi-36px mdi-chevron-down"></span>
                        <span className="mdi mdi-36px mdi-chevron-double-down"></span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h5>REPORTER</h5>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex flex-wrap">
                        {assigneeArray.map(() => {
                            return (
                                <>
                                    <div className="round_icons d-flex justify-content-center align-items-center m-1">
                                        AM
                                    </div>
                                    <div className="round_icons d-flex justify-content-center align-items-center m-1">
                                        NN
                                    </div>
                                </>
                            );
                        })}
                    </Col>
                </Row>
                <Row>
                    <Col className="mt-2">
                        <h5>STATUS</h5>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex flex-wrap">
                        <div className="checkboxStyle d-flex justify-content-center align-items-center m-1 p-2">
                            <span>
                                <Form.Check
                                    className="d-flex justify-content-center align-items-center cancelled"
                                    type="checkbox"
                                    id="custom-switch"
                                    label="CANCELLED"
                                />
                            </span>
                        </div>
                        <div className="checkboxStyle d-flex justify-content-center align-items-center m-1 p-2">
                            <span>
                                <Form.Check
                                    className="d-flex justify-content-center align-items-center done"
                                    type="checkbox"
                                    id="custom-switch"
                                    label="DONE"
                                />
                            </span>
                        </div>
                        <div className="checkboxStyle d-flex justify-content-center align-items-center m-1 p-2">
                            <span>
                                <Form.Check
                                    className="d-flex justify-content-center align-items-center progresss"
                                    type="checkbox"
                                    id="custom-switch"
                                    label="IN PROGRESS"
                                />
                            </span>
                        </div>
                        <div className="checkboxStyle d-flex justify-content-center align-items-center m-1 p-2">
                            <span className="">
                                <Form.Check
                                    className="d-flex justify-content-center align-items-center review"
                                    type="checkbox"
                                    id="custom-switch"
                                    label="IN REVIEW"
                                />
                            </span>
                        </div>
                        <div className="round_icons d-flex justify-content-center align-items-center m-1">...</div>
                    </Col>
                </Row>
                <hr />
            </Modal.Body>
        </Modal>
    );
};

export default Filter;
