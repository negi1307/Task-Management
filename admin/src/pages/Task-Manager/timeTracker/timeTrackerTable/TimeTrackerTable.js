import React, { useEffect, useState } from 'react';
import HeaderMain from '../../header/HeaderMain';
import { Card, Table, } from 'react-bootstrap';
import { getTimeTracterAction } from '../../../../redux/timeTracker/action';
import { useSelector, useDispatch } from 'react-redux';
import MainLoader from '../../../../constants/Loader/loader';
const TimeTrackerTable = () => {
    const store = useSelector((state) => state)
    const dispatch = useDispatch();
    const timeTrackerData = store?.getTimeTrackerReducer?.timeTracker?.data?.response?.projectUserTime;
    const timeTrackerTotalTime = store?.getTimeTrackerReducer?.timeTracker?.data?.response?.totalUserTime
    const timeTrackerLoading = store?.getTimeTrackerReducer?.loading
    useEffect(() => {
        dispatch(getTimeTracterAction())
    }, [])

    return (<>
        <Card>
            <Card.Body>
                <div>
                    <HeaderMain />
                </div>
                <div className="d-flex align-items-center justify-content-center">
                    <h4 className="header-title heading_data mb-1">Time Tracker</h4>
                </div>
                {timeTrackerLoading ? <MainLoader /> : <div>
                    <div>
                        {timeTrackerData?.length != 0 ?

                            <Table className="mb-0 add_Color_font" striped>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th> First Name</th>
                                        <th>Last Name</th>
                                        <th>Project</th>
                                        <th> Tracking Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>{timeTrackerData?.map((item, index) => {
                                        return (
                                            <tr className="align-middle">
                                                <th scope="row">
                                                    {index + 1}
                                                </th>
                                                <td className="cp">
                                                    <span className="namelink">
                                                        {item?.userName}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="namelink">
                                                        {item?.userLastName}
                                                    </span>
                                                </td>
                                                <td className="cp">
                                                    <span className="namelink">
                                                        {item?.project}
                                                    </span>
                                                </td>
                                                <td className="w-20">
                                                    <span className="namelink">
                                                        {item?.formattedTrackingTime}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}</>
                                </tbody>
                            </Table>
                            : <div className='text-danger d-flex justify-content-center  align-items-center' style={{height:'30vh'}}>
                                Data Not Found
                            </div>}
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
                </div>}
                <div className="d-flex align-items-center justify-content-center">
                    <h4 className="header-title heading_data mb-1 mt-5">Total Time Tracker</h4>
                </div>
                {timeTrackerLoading ? <MainLoader /> : <div>
                    <div>{timeTrackerTotalTime?.length!==0?<Table className="mb-0 add_Color_font" striped>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th> First Name</th>
                                    <th>Last Name</th>
                                    <th> Total Time Tracking </th>
                                </tr>
                            </thead>
                            <tbody>
                                {timeTrackerTotalTime?.map((item, index) => {
                                    return (
                                        <tr className="align-middle">
                                            <th scope="row">
                                                {index + 1}
                                            </th>
                                            <td className="cp">
                                                <span className="namelink">
                                                    {item?.userName

                                                    }
                                                </span>
                                            </td>
                                            <td>
                                                <span className="namelink">
                                                    {item?.userLastName

                                                    }
                                                </span>
                                            </td>
                                            <td className="cp">
                                                <span className="namelink">
                                                    {item?.totalTrackingTime}

                                                </span>
                                            </td>
                                            {/* <td className="w-20">
                                            <span className="namelink">
                                                {item?.formattedTrackingTime}

                                            </span>
                                        </td> */}

                                        </tr>
                                    )
                                })}

                            </tbody>
                        </Table>:<div className='text-danger d-flex justify-content-center  align-items-center' style={{height:'30vh'}}>
                                Data Not Found
                            </div>}
                        
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
                </div>}

            </Card.Body>
        </Card>    </>)
}

export default TimeTrackerTable