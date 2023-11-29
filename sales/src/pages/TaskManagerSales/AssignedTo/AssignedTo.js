import React, { useEffect, useState } from 'react';

import { Accordion, Col, Form, Row, Table, Card, Button } from 'react-bootstrap';
import HeaderMain from '../../Task-Manager/header/HeaderMain';
import { useDispatch, useSelector } from 'react-redux';
import { getPresales } from '../../../reduxSales/preSales/action';
const AssignedTo = () => {
    const [preSale, setPreSale] = useState([]);
    const [modal, setModal] = useState(false);
    const [childModal, setChildModal] = useState(false);
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const getPresaleReducer = store?.getPreSales?.data?.response;
    console.log(getPresaleReducer, '00000000000000');
    useEffect(() => {
        dispatch(getPresales());
        if (getPresaleReducer?.data?.status == '200') {
            setPreSale(getPresaleReducer?.data?.response);
        }
    }, []);
    return (
        <>
            <HeaderMain />
            <div className="d-flex m-2 justify-content-end">
                <Button className="m-2">Add Task</Button>
            </div>
            {/* <Table striped bordered variant="light"> */}
            {/* <thead> */}
            {/* <tr className=""> */}
            <Row className="accordion d-flex flex-row">
                <Col className="accordionColumn" colSpan={4}>
                    <div className="d-flex justify-content-around">
                        <Form.Check type="checkbox" />A Task <span className="mdi mdi-10px mdi-chevron-down"></span>
                    </div>
                </Col>
                <Col className="accordionColumn">
                    <div className="d-flex justify-content-around flex-row ">
                        <span className="mdi mdi-arrow-down-drop-circle-outline mdi-10px d-flex justify-content-between flex-row"></span>
                        <span>Status</span>
                        <span className="mdi mdi-10px mdi-chevron-down"></span>
                    </div>
                </Col>
                <Col className="accordionColumn">
                    <div className="d-flex justify-content-around">
                        <span className="mdi mdi-calendar-text"></span>
                        Due date
                        <span className="mdi mdi-10px mdi-chevron-down"></span>
                    </div>
                </Col>
                <Col className="accordionColumn">
                    <div className="d-flex justify-content-around">
                        <span className="mdi mdi-function"></span>
                        Days
                    </div>
                </Col>
            </Row>
            {/* </tr> */}
            {/* </thead> */}
            {/* </Table> */}
            {/* <Button onClick={() => (modal ? setModal(false) : setModal(true))}>
                <span className="mdi mdi-36px mdi-chevron-down"></span>
            </Button> */}
            {getPresaleReducer?.map((ele) => {
                {
                    console.log();
                }

                return (
                    <>
                        {
                            <>
                                <div className="d-flex flex-column mt-2">
                                    <Button
                                        className="downButtonParent"
                                        onClick={() => (modal ? setModal(false) : setModal(true))}>
                                        <Row className="accordion d-flex flex-row">
                                            <Col className="accordionColumn d-flex flex-row justify-content-between">
                                                <span className="mdi mdi-36px mdi-chevron-down"></span>
                                                <div className="d-flex flex-column">
                                                    <label htmlFor="">Assigned To</label>
                                                    <div className="d-flex flex-row">
                                                        <span class="mdi mdi-24px mdi-checkbox-blank-circle  p-1"></span>
                                                        <h6>{ele?.clientName}</h6>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p>Count 1</p>
                                                </div>
                                            </Col>
                                            <Col className="accordionColumn">
                                                {/* <div className="d-flex justify-content-around flex-row ">
                                                    <span className="mdi mdi-arrow-down-drop-circle-outline mdi-10px d-flex justify-content-between flex-row"></span>
                                                    <span>Status</span>
                                                    <span className="mdi mdi-10px mdi-chevron-down"></span>
                                                </div> */}
                                            </Col>
                                            <Col className="accordionColumn">
                                                {/* <div className="d-flex justify-content-around">
                                                    <span className="mdi mdi-calendar-text"></span>
                                                    Due date
                                                    <span className="mdi mdi-10px mdi-chevron-down"></span>
                                                </div> */}
                                            </Col>
                                            <Col className="accordionColumn">
                                                {/* <div className="d-flex justify-content-around">
                                                    <span className="mdi mdi-function"></span>
                                                    Days
                                                </div> */}
                                            </Col>
                                        </Row>
                                    </Button>
                                    {modal ? (
                                        <Button
                                            onClick={() => (childModal ? setChildModal(false) : setChildModal(true))}
                                            className="downButtonParent">
                                            {childModal ? (
                                                <Row className="accordion d-flex flex-row">
                                                    <Col className="accordionColumn d-flex flex-row justify-content-between">
                                                        <span className="mdi mdi-36px mdi-chevron-down"></span>
                                                        <div className="d-flex flex-column">
                                                            <label htmlFor="">Assigned To</label>
                                                            <div className="d-flex flex-row">
                                                                <span class="mdi mdi-24px mdi-checkbox-blank-circle  p-1"></span>
                                                                <h6>Jordan Peretz</h6>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p>Count 1</p>
                                                        </div>
                                                    </Col>
                                                    <Col className="accordionColumn">
                                                        {/* <div className="d-flex justify-content-around flex-row ">
                                                        <span className="mdi mdi-arrow-down-drop-circle-outline mdi-10px d-flex justify-content-between flex-row"></span>
                                                        <span>Status</span>
                                                        <span className="mdi mdi-10px mdi-chevron-down"></span>
                                                    </div> */}
                                                    </Col>
                                                    <Col className="accordionColumn">
                                                        {/* <div className="d-flex justify-content-around">
                                                        <span className="mdi mdi-calendar-text"></span>
                                                        Due date
                                                        <span className="mdi mdi-10px mdi-chevron-down"></span>
                                                    </div> */}
                                                    </Col>
                                                    <Col className="accordionColumn">
                                                        {/* <div className="d-flex justify-content-around">
                                                        <span className="mdi mdi-function"></span>
                                                        Days
                                                    </div> */}
                                                    </Col>
                                                </Row>
                                            ) : (
                                                <>
                                                    <div className="d-flex flex-column">
                                                        <div className="d-flex ">
                                                            <span className="mdi mdi-dots-horizontal "></span>
                                                            <p className="ps-1">PROJECTS</p>
                                                        </div>
                                                        <div className="d-flex ps-3">{ele?.projectName}</div>
                                                    </div>
                                                </>
                                            )}
                                        </Button>
                                    ) : null}
                                </div>
                            </>
                        }
                    </>
                );
            })}
        </>
    );
};

export default AssignedTo;
