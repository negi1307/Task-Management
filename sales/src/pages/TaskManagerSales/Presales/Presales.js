import React, { useEffect, useState } from 'react';

import { Col, Form, Row, Table, Card, Button } from 'react-bootstrap';
import HeaderMain from '../../Task-Manager/header/HeaderMain';
import { useDispatch, useSelector } from 'react-redux';
import { getPresales } from '../../../reduxSales/preSales/action';
import Pagination from '@mui/material/Pagination';
import Accordion from 'react-bootstrap/Accordion';

const AssignedTo = () => {
    function CheckCondition(index) {
        this.indexValue = index;
        console.log(this.indexValue, '006666600000');
    }
    const [isOpen, setIsOpen] = useState(false);

    const [skip, setSkip] = useState(1);
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        dispatch(getPresales({ skip }));
    };
    const [preSaleId, setPreSaleId] = useState('');
    const [preSale, setPreSale] = useState([]);
    const [modal, setModal] = useState('');
    const [childModal, setChildModal] = useState(false);
    const [parentModal, setParentModal] = useState([]);
    const [checkCondition, setCheckCondition] = [];
    // console.log(checkCondition, '====checkCondition=====');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const getPresaleReducer = store?.getPreSales;
    let mainData = [];

    useEffect(() => {
        let body = {
            skip: 1,
        };
        dispatch(getPresales(body));

        // mainData.push(getPresaleReducer);
    }, []);
    function checkFunction(indValue) {
        console.log(indValue, '====working===');
        checkCondition.push({ index: indValue, condition: true });
        console.log(checkCondition, '====workiing====');
    }
    const parenModalFunction = (ele, index) => {
        console.log(ele);
        setPreSaleId(ele?._id);
    };
    const toggle = (id, index) => {
        setPreSaleId(index);
        console.log(id, preSaleId !== preSaleId, 'kkkkkk');
        setIsOpen((isOpen) => !isOpen);
    };
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <HeaderMain />
                <div className="d-flex m-2 justify-content-end">
                    <Button className="m-2">Add Task</Button>
                </div>
                <Row className="accordion d-flex flex-row">
                    <Col className="accordionColumn">
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

                {store?.getPreSales?.data?.response?.map((ele, index) => {
                    return (
                        <>
                            {
                                <>
                                    <div className="d-flex flex-column mt-2">
                                        <Button
                                            onClick={() => toggle(ele?._id, index)}
                                            className="downButtonParent mt-2">
                                            <Row className="accordion d-flex flex-row">
                                                <Col className="accordionColumn d-flex flex-row justify-content-between">
                                                    <span className="mdi mdi-36px mdi-chxevron-down"></span>
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
                                                <Col className="accordionColumn"></Col>
                                                <Col className="accordionColumn"></Col>
                                                <Col className="accordionColumn"></Col>
                                            </Row>
                                        </Button>
                                        {preSaleId === index && (
                                            <Button
                                                onClick={() =>
                                                    childModal ? setChildModal(false) : setChildModal(true)
                                                }
                                                className="downButtonParent">
                                                {childModal ? (
                                                    <Row className="accordion d-flex flex-row">
                                                        <Col lg={3}>
                                                            <div className="d-flex ">
                                                                <span className="mdi mdi-36px mdi-chevron-right"></span>

                                                                <span className="mdi mdi-dots-horizontal "></span>
                                                                <p className="ps-1">PROJECTS</p>
                                                            </div>
                                                        </Col>
                                                        <Col lg={3} className="accordionColumn"></Col>
                                                        <Col lg={3} className="accordionColumn"></Col>
                                                        <Col lg={3} className="accordionColumn"></Col>
                                                    </Row>
                                                ) : (
                                                    <>
                                                        {console.log(mainData)}
                                                        <Row className="accordion d-flex flex-row">
                                                            <Col
                                                                lg={3}
                                                                className="accordionColumn d-flex flex-column justify-content-between ">
                                                                <div className="d-flex flex-column">
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <div className="d-flex ">
                                                                            <span className="mdi mdi-36px mdi-chevron-down"></span>

                                                                            <span className="mdi mdi-dots-horizontal "></span>
                                                                            <p className="ps-1">PROJECTS</p>
                                                                        </div>
                                                                        <div className="d-flex justify-content-end">
                                                                            <p>1</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="d-flex ps-4">
                                                                        {ele?.projectName}
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex ms-1 innerModal">
                                                                    <Form.Check></Form.Check>
                                                                    <span className="mdi mdi-arrow-expand ps-2 "></span>
                                                                </div>
                                                            </Col>
                                                            <Col lg={3} className="accordionColumn"></Col>
                                                            <Col lg={3} className="accordionColumn"></Col>
                                                            <Col lg={3} className="accordionColumn"></Col>
                                                        </Row>
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        {/* );
                                        })} */}
                                    </div>
                                </>
                            }
                        </>
                    );
                })}
                {/* <table>
                    <tr>
                        <th>Company</th>
                        <th>Contact</th>
                        <th>Country</th>
                    </tr>
                    <tr>
                        <td>
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Accordion Item #1</Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </td>
                        <td>Maria Anders</td>
                        <td>Germany</td>
                    </tr>
                    <tr>
                        <td>Centro comercial Moctezuma</td>
                        <td>Francisco Chang</td>
                        <td>Mexico</td>
                    </tr>
                    <tr>
                        <td>Ernst Handel</td>
                        <td>Roland Mendel</td>
                        <td>Austria</td>
                    </tr>
                    <tr>
                        <td>Island Trading</td>
                        <td>Helen Bennett</td>
                        <td>UK</td>
                    </tr>
                    <tr>
                        <td>Laughing Bacchus Winecellars</td>
                        <td>Yoshi Tannamuri</td>
                        <td>Canada</td>
                    </tr>
                    <tr>
                        <td>Magazzini Alimentari Riuniti</td>
                        <td>Giovanni Rovelli</td>
                        <td>Italy</td>
                    </tr>
                </table> */}

                <Pagination
                    defaultPage={skip}
                    count={store?.getPreSales?.data?.totalPages}
                    color="primary"
                    variant="outlined"
                    className="mt-4"
                    onChange={handlePaginationChange}
                />
            </div>
        </>
    );
};

export default AssignedTo;
