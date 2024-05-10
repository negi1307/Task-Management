import React, { useEffect, useState } from 'react';
import HeaderMain from '../../header/HeaderMain';
import { Card, Table, Form } from 'react-bootstrap';
import { getTimeTracterAction, getUserRecord } from '../../../../redux/timeTracker/action';
import { useSelector, useDispatch } from 'react-redux';
import MainLoader from '../../../../constants/Loader/loader';
import { getAllUsers } from '../../../../redux/actions'
import DatePicker from 'react-datepicker';
import ToastHandle from '../../../../constants/toaster/toaster';

const TimeTrackerTable = () => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const users = store?.getAllUsers?.data?.response;
    const userRecord = store?.getUserRecordReducer?.data?.data;
    console.log({ userRecord })
    const loading = store?.getUserRecordReducer?.loading;
    // console.log({ userRecord })
    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleEndDate = (date) => {
        setEndDate(date);
    };

    const handleStartDate = (date) => {
        setStartDate(date);
    };
    const onSubmit = (e) => {
        e.preventDefault()
        if (userId !== null && startDate !== '' && endDate !== '') {
            let body = {
                startTime: startDate,
                endTime: endDate,
                userId: userId
            };
            dispatch(getUserRecord(body));
        }
    };

    const totalTime = store?.getUserRecordReducer?.data?.totalTime;
    const userfirstName = userRecord?.[0]?.assigneeId?.firstName;
    const userLastName = userRecord?.[0]?.assigneeId?.lastName;
    const formatTime = (milliseconds) => {
        // Convert milliseconds to seconds
        let seconds = Math.floor(milliseconds / 1000);

        // Calculate hours, minutes, and remaining seconds
        let hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        let minutes = Math.floor(seconds / 60);
        seconds %= 60;

        // Format hours, minutes, and seconds with leading zeros if necessary
        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');

        // Return the formatted time string
        return `${hours}hours ${minutes}minutes ${seconds}seconds`;
    };
    return (
        <Card>
            <Card.Body>
                <div>
                    <HeaderMain />
                </div>
                <div className="d-flex align-items-center justify-content-center">
                    <h4 className="header-title heading_data">User Time Tracking</h4>
                </div>
                <div className="row my-3">
                    <Form onSubmit={onSubmit}>
                        <div className="row d-flex align-items-center ">
                            <div className='col-4'>
                                <Form.Label className='fw-bold'>
                                    Select User<span className='text-danger'>*</span>
                                </Form.Label>
                                <select
                                    name="Assignee"
                                    role='button'
                                    className="form-select add_width_input bg-transparent ps-1"
                                    id="exampleForm.ControlInput1"
                                    onChange={(e) => setUserId(e.target.value)}
                                    style={{ backgroundColor: '#F1F3FA' }}
                                >
                                    <option value={''}>Select User</option>
                                    {users && users.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.firstName} {user.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-4">
                                <Form.Label className='fw-bold'>
                                    Select Start Date<span className='text-danger'>*</span>
                                </Form.Label>
                                <Form.Group controlId="startDatePicker">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleStartDate}
                                        placeholderText="Start date"
                                        className="add_width_input"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Label className='fw-bold'>
                                    Select End Date<span className='text-danger'>*</span>
                                </Form.Label>
                                <Form.Group controlId="endDatePicker">
                                    <DatePicker
                                        selected={endDate}
                                        disabled={!startDate}
                                        onChange={handleEndDate}
                                        placeholderText="End Date"
                                        minDate={startDate}
                                        className="add_width_input"

                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="col-12 mt-2 text-start text-danger">
                            Fill up the form to get user data...
                        </div>
                        <div className="col-12 mt-2 text-center">
                            <button className='web_button'>Get Data</button>
                        </div>
                    </Form>
                </div>
                {loading ? (
                    <MainLoader />
                ) : (
                    <>
                        <div className="row">
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12 d-flex align-items-center gap-1">
                                        <h5>Username:</h5><span>{userfirstName} {userLastName} </span>
                                    </div>
                                    <div className="col-12 d-flex align-items-center gap-1">
                                        <h5>Total Time:</h5>
                                        <span>{formatTime(totalTime)}</span>
                                    </div >
                                </div >
                                {/* ))} */}
                            </div >

                            <div className="col-12 scrollable-content" >
                                <Table className='text-nowrap' style={{ overflowX: 'scroll' }}>
                                    <thead>
                                        <tr>
                                            <th className='fw-bold text-start'>#</th>
                                            <th className='fw-bold text-start'>Project Name</th>
                                            <th className='fw-bold text-start'>Task Name</th>
                                            <th className='fw-bold text-start'>Priority</th>
                                            <th className='fw-bold text-start'>Expected Hours</th>
                                            <th className='fw-bold text-start'>Added to In-progress</th>
                                            <th className='fw-bold text-start'>Marked Done</th>
                                            <th className='fw-bold text-start'>Time Taken</th>
                                        </tr>
                                    </thead>
                                    {userRecord && userRecord?.map((record, index) => (
                                        <tbody key={index}>
                                            <tr>
                                                <td className='text-start'>{index + 1}</td>
                                                <td className='text-start'>{(record?.projectId?.projectName.charAt(0).toUpperCase() + record?.projectId?.projectName.slice(1)).slice(0, 15)}</td>
                                                <td className='text-start'>{(record?.summary.charAt(0).toUpperCase() + record?.summary.slice(1)).slice(0, 25) + '...'}</td>
                                                <td className='text-start'>{record?.priority}</td>
                                                <td className='text-start'>{record?.expectedHours ? record?.expectedHours : 'N/A'}</td>
                                                <td className='text-start'>{record?.inProgressDate ? record.inProgressDate.split('T')[0] : 'Not yet added'}</td>
                                                <td className='text-start'>{record?.doneDate ? record.doneDate.split('T')[0] : 'Not completed yet'}</td>
                                                <td className='text-start'>{isNaN(record?.timeTracker) ? 'Not started yet' : formatTime(record.timeTracker)}</td>
                                            </tr>
                                        </tbody>
                                    ))}

                                </Table>
                            </div>
                        </div >
                    </>
                )}
            </Card.Body >
        </Card >
    );
};

export default TimeTrackerTable;
