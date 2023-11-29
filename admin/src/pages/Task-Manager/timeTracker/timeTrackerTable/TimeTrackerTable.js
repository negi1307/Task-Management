import React, { useState, useEffect } from 'react';
import HeaderMain from '../../header/HeaderMain';
import { Button, Card, Table, Row, Col } from 'react-bootstrap';

const TimeTrackerTable = () => {
    return (<>
        <Card>
            <Card.Body>
                <div>
                    <HeaderMain />
                </div>
                <div className="d-flex align-items-center justify-content-center">
                    <h4 className="header-title heading_data mb-1">Time Tracker</h4>
                </div>
                <div>
                    <div>
                        <Table className="mb-0 add_Color_font" striped>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th> First Name</th>
                                    <th>Project</th>
                                    <th>Description</th>
                                    <th> Status</th>
                                    <th> Type</th>
                                    <th> Stage</th>
                                    <th> Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="align-middle">
                                    <th scope="row">
                                        1
                                        {/* {(skip - 1) * 10 + ind + 1} */}
                                    </th>
                                    <td className="cp">
                                        <span className="namelink">
                                            2
                                            {/* {ele?.clientName}  */}
                                        </span>
                                    </td>
                                    <td className="cp">
                                        <span className="namelink">
                                            3
                                            {/* {ele?.projectName}  */}
                                        </span>
                                    </td>
                                    <td className="w-20">
                                        <span className="namelink">
                                            4
                                            {' '}
                                            {/* {ele?.description?.slice(0, 10).concat('...')} */}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="namelink">
                                            5
                                            {/* {ele?.status === 1 ? (
                                                                    <>CONVERTED</>
                                                                ) : ele?.status === 2 ? (
                                                                    <>NOT-CONVERTED</>
                                                                ) : (
                                                                    ''
                                                                )} */}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="namelink">
                                            6
                                            {/* {ele?.stage === 1 ? (
                                                                    <>HOT</>
                                                                ) : ele?.stage === 2 ? (
                                                                    <>COLD</>
                                                                ) : ele?.stage === 3 ? (
                                                                    <>MEDIUM</>
                                                                ) : (
                                                                    <></>
                                                                )} */}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="namelink">
                                            {' '}
                                            7
                                            {/* {ele?.type?.map((ele) => (
                                                                    <p className="p-0 m-0">{ele}</p>
                                                                ))} */}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="namelink">
                                            <span>
                                                <i
                                                    class="bi bi-pencil-square"
                                                // onClick={() => {
                                                //     EditModalhandle(ele);
                                                // }}
                                                ></i>
                                            </span>
                                            <span className="ms-2">
                                                <i
                                                    class="bi bi-trash"
                                                // onClick={() => {
                                                //     deleteIdGet(ele?._id);
                                                // }}
                                                ></i>
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        {/* <Row>
                                <Col
                                    lg={12}
                                    className="d-flex justify-content-end my-3 pe-4 position-absolute bottom-0">
                                    {store?.getPreSaleReducer?.data?.totalPages > 0 && (
                                        <Stack spacing={2}>
                                            <Pagination
                                                defaultPage={skip}
                                                count={store?.getPreSaleReducer?.data?.totalPages}
                                                color="primary"
                                                variant="outlined"
                                                onChange={handlePaginationChange}
                                            />
                                        </Stack>
                                    )}
                                </Col>
                            </Row> */}
                    </div>
                </div>
            </Card.Body>
        </Card>    </>)
}

export default TimeTrackerTable