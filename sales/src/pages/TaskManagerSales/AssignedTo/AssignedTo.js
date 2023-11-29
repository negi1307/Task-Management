import React from 'react';
import { Accordion, Col, Form, Row, Table, Card, Button } from 'react-bootstrap';
import HeaderMain from '../../Task-Manager/header/HeaderMain';
const AssignedTo = () => {
    const arr = [1, 2, 3, 4];
    const level1Panels = [
        { key: 'panel-1a', title: 'Level 1A', content: 'Level 1A Contents' },
        { key: 'panel-ba', title: 'Level 1B', content: 'Level 1B Contents' },
    ];
    // const AccordionExampleNested = () => <Accordion defaultActiveIndex={0} panels={rootPanels} styled />;
    return (
        <>
          <HeaderMain />
            <Table striped bordered variant="light">
                <thead>
                    <tr className="">
                        <th className="" colSpan={4}>
                            <div className="d-flex justify-content-between">
                                <Form.Check type="checkbox" />A Task{' '}
                                <span className="mdi mdi-10px mdi-chevron-down"></span>
                            </div>
                        </th>
                        <th className="">
                            <div className="d-flex justify-content-between flex-row ">
                                <span>Status</span>
                                <span className="mdi mdi-arrow-down-drop-circle-outline mdi-10px d-flex justify-content-between flex-row"></span>
                            </div>
                        </th>
                        <th colSpan={4}>
                            <div className="d-flex flex-row justify-content-between">
                                <div className="d-flex flex-row">
                                    <span className="mdi mdi-alphabetical pe-1"></span>
                                    <span>Subtask</span>
                                </div>
                                <div>
                                    <span className="mdi mdi-10px mdi-chevron-down"></span>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-around">
                                <span className="mdi mdi-account-circle"></span>
                                Assigned To
                                <span className="mdi mdi-10px mdi-chevron-down"></span>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-around">
                                <span className="mdi mdi-account-circle"></span>
                                Project Lead
                                <span className="mdi mdi-bell-outline"></span>
                                <span className="mdi mdi-10px mdi-chevron-down"></span>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-around">
                                <span className="mdi mdi-calendar-text"></span>
                                Kick Off
                                <span className="mdi mdi-10px mdi-chevron-down"></span>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-around">
                                <span className="mdi mdi-calendar-text"></span>
                                Due date
                                <span className="mdi mdi-10px mdi-chevron-down"></span>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-around">
                                <span className="mdi mdi-function"></span>
                                Days
                            </div>
                        </th>
                    </tr>
                </thead>
            </Table>
            {arr.map((ele) => {
                return (
                    <div className="mt-3">
                        <Accordion className="custom-accordion btntbnu">
                            <Accordion.Item className="custom-accordion" eventKey="0">
                                <Accordion.Header>
                                    <Table striped bordered variant="light">
                                        <thead>
                                            <tr className="">
                                                <th className="" colSpan={4}>
                                                    <div className="d-flex justify-content-between">
                                                        <Form.Check type="checkbox" />A Task{' '}
                                                        <span className="mdi mdi-10px mdi-chevron-down"></span>
                                                    </div>
                                                </th>
                                                <th className="">
                                                    <div className="d-flex justify-content-between flex-row ">
                                                        {/* <span>Status</span>
                                                        <span className="mdi mdi-arrow-down-drop-circle-outline mdi-10px d-flex justify-content-between flex-row"></span> */}
                                                    </div>
                                                </th>
                                                <th colSpan={4}>
                                                    <div className="d-flex flex-row justify-content-between">
                                                        <div className="d-flex flex-row">
                                                            <span className="mdi mdi-alphabetical pe-1"></span>
                                                            <span>Subtask</span>
                                                        </div>
                                                        <div>
                                                            <span className="mdi mdi-10px mdi-chevron-down"></span>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="d-flex justify-content-around">
                                                        <span className="mdi mdi-account-circle"></span>
                                                        Assigned To
                                                        <span className="mdi mdi-10px mdi-chevron-down"></span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="d-flex justify-content-around">
                                                        <span className="mdi mdi-account-circle"></span>
                                                        Project Lead
                                                        <span className="mdi mdi-bell-outline"></span>
                                                        <span className="mdi mdi-10px mdi-chevron-down"></span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="d-flex justify-content-around">
                                                        <span className="mdi mdi-calendar-text"></span>
                                                        Kick Off
                                                        <span className="mdi mdi-10px mdi-chevron-down"></span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="d-flex justify-content-around">
                                                        <span className="mdi mdi-calendar-text"></span>
                                                        Due date
                                                        <span className="mdi mdi-10px mdi-chevron-down"></span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="d-flex justify-content-around">
                                                        <span className="mdi mdi-function"></span>
                                                        Days
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                    </Table>
                                </Accordion.Header>
                                <Accordion.Body>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.
                                    <Accordion>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>Accordion Item #2</Accordion.Header>
                                            <Accordion.Body>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                                                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                                                occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                                                mollit anim id est laborum.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                );
            })}
        </>
    );
};

export default AssignedTo;
