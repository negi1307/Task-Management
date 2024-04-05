import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import '../../../../node_modules/react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import {
    AddComment,
    UpdateCommentAction,
    createSubTask,
    deleteComment,
    getHistoryAction,
} from '../../../redux/task/action';
import ToastHandle from '../../../constants/toaster/toaster';
import { Row, Col, Card, Button, Alert, CloseButton, Table } from 'react-bootstrap';
import pdfImage from '../../../assets/images/pdff-removebg-preview.png';
import noimage from '../../../assets/images/noimage.png';
const TaskDetailPage = ({ modal, editData, closeModal, taskId }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [connectComponent, setConnectComponent] = useState('All');
    const [buttonChange, setButtonChange] = useState(true);
    const [showBugForm, setShowBugForm] = useState(false)
    const [commentId, setCommentId] = useState();
    const [commentTextUpdate, setCommentTextUpdate] = useState(false);
    const [subtaskName, setSubtaskName] = useState('');
    const [subtaskButtonClicked, setSubtaskButtonClicked] = useState(false);
    const getCommentData = store?.getComment?.data?.response;
    const getHistory = store?.getHistoryReducer?.data?.response;


    const historyLoader = store?.getHistoryReducer
    const connectComponentCheck = (type) => {
        setConnectComponent(type);
        setValue('comment', "");
        setValue('subtasks', "");
        setButtonChange(true);
        if (type === 'History') {
            dispatch(getHistoryAction(editData?.id));
        }
    };


    const [allCommetUpdateId, setAllCommetUpdateId] = useState('');
    const [inputForUpdate, setInputForUpdate] = useState('');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const today = new Date();
    const handleStartDate = (date) => {
        setStartDate(date);
    };
    const handleEndDate = (date) => {
        setEndDate(date);

    };
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm();


    const subtasksSubmit = (e) => {
        if (!taskId) {
            return;
        }

        // dispatch(getSubtasks())
        let subtask_body = new FormData();
        subtask_body.append('taskId', editData._id);
        subtask_body.append('summary', e.summary);
        subtask_body.append('description', e.description);
        subtask_body.append('priority', e.priority);
        subtask_body.append('expectedHours', e.expectedHours);
        subtask_body.append('startDate', startDate);
        subtask_body.append('dueDate', endDate);
        subtask_body.append('type', e.type);

        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput.files.length > 0) {
            subtask_body.append('attachment', fileInput.files[0]);
        }

        if (editData._id !== '') {
            dispatch(createSubTask(subtask_body));
            ToastHandle('success', 'Sub-task created successfully');
        }

        setStartDate("");
        setEndDate("");
        reset();
    }



    const onSubmit = (val) => {
        if (buttonChange) {
            let body = {
                taskId: editData?._id,
                comment: val?.comment,
            };
            dispatch(AddComment(body));
        } else {
            let body = {
                commentId: commentId,
                comment: val?.comment,
            };
            dispatch(UpdateCommentAction(body));
            setButtonChange(true);
        }
        setValue('comment', '');
    };
    const handeldelete = (data) => {
        dispatch(deleteComment({ taskId: data?._id }));
    };
    const handelUpdate = (data) => {
        setCommentId(data?._id);
        setValue('comment', data?.comment);
        setButtonChange(false);
    };
    const handelUpdateAll = (data, indx) => {
        setAllCommetUpdateId(data?._id);
        reset({
            updated_comment: data?.comment,
        });
        setInputForUpdate(indx);

    };
    const submitUpdateComment = (data) => {
        let body = {
            commentId: allCommetUpdateId,
            comment: data?.updated_comment,
        };
        dispatch(UpdateCommentAction(body));
        setInputForUpdate(false);
    };
    const closeModalHandle = () => {
        closeModal()
        setValue('comment', "");
        setButtonChange(true);
    }

    return (
        <>
            <Modal show={modal} onHide={closeModal} size={'xl'}>
                <Row className="m-0 p-0">
                    <Col lg={12}>
                        <Row>
                            <Col lg={7} className="text-end">
                                <Modal.Title id="" className="mx-auto modal_titles">
                                    Task Detail
                                </Modal.Title>
                            </Col>
                            <Col lg={5} className="text-end pt-2">
                                <button type="button" className="close bg-black text-white" onClick={closeModalHandle} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <Modal.Body>
                    <Row>
                        <Col lg={7}>
                            <h4 className='modal_titles'>Activity</h4>
                            <Row>
                                <Col lg={12} className='d-flex align-items-center gap-1'>
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('All');
                                        }}
                                        className={`mybutton btn px-2 fw-bold py-1  web_button ${connectComponent === 'All' ? 'active-button-tdp' : 'inactive-button-tdp'}`}
                                    >
                                        All
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('Comments');
                                        }}
                                        className={`mybutton btn px-2 fw-bold py-1  web_button ${connectComponent === 'Comments' ? 'active-button-tdp' : 'inactive-button-tdp'}`}
                                    >
                                        Comments
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('History');
                                        }}
                                        className={`mybutton btn px-2 fw-bold py-1  web_button ${connectComponent === 'History' ? 'active-button-tdp' : 'inactive-button-tdp'}`}
                                    >
                                        History
                                    </Button>

                                    {/* Add Sub-tasks button */}
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('AddSubtask');
                                        }
                                        }
                                        className={`mybutton btn px-2 fw-bold py-1  web_button ${connectComponent === 'AddSubtask' ? 'active-button-tdp' : 'inactive-button-tdp'}`}
                                    >
                                        Add Sub-tasks
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('Bugs');
                                        }}
                                        className={`mybutton btn px-2 fw-bold py-1  web_button ${connectComponent === 'Bugs' ? 'active-button-tdp' : 'inactive-button-tdp'}`}
                                    >
                                        Bugs
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('Subtask');
                                        }}
                                        className={`mybutton btn px-2 fw-bold py-1  web_button ${connectComponent === 'Subtask' ? 'active-button-tdp' : 'inactive-button-tdp'}`}
                                    >
                                        SubTask
                                    </Button>


                                </Col>
                            </Row>
                            {connectComponent === 'All' ? (
                                <Row className="mt-3">
                                    {getCommentData?.map((ele, ind) => (
                                        <ul style={{ listStyle: 'none' }}>
                                            <Row>
                                                <Col lg={12} className="d-flex">
                                                    <Col lg={2} className="pt-2">
                                                        <span
                                                            style={{
                                                                backgroundColor: '#605e5a',
                                                                borderRadius: '100%',
                                                                padding: '11px 15px',
                                                                color: 'white',
                                                                fontWeight: '800',
                                                            }}>
                                                            {ele?.userId?.firstName.charAt(0)}
                                                            {ele?.userId?.lastName.charAt(0)}
                                                        </span>
                                                    </Col>
                                                    <Col lg={10} className="m-0 p-0">
                                                        <div className="d-flex">
                                                            <h4 className="m-0 p-0"> {ele?.userId?.firstName}</h4>
                                                            <h4 className="ps-1 m-0 p-0"> {ele?.userId?.lastName}</h4>
                                                            <p className="ps-1 m-0 p-0">
                                                                {moment(ele?.createdAt).fromNow()}
                                                            </p>
                                                        </div>
                                                        {inputForUpdate === ind ? (
                                                            <form onSubmit={handleSubmit(submitUpdateComment)}>
                                                                <Row className="mt-2 d-flex">
                                                                    <Col lg={9}>
                                                                        <Form.Group
                                                                            className="mb-1"
                                                                            controlId="exampleForm.ControlInput1">
                                                                            <Form.Control
                                                                                type="text"
                                                                                placeholder="Update comment"
                                                                                {...register(`updated_comment`)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col className="m-0 p-0" lg={1}>
                                                                        <Button type="submit">Update</Button>
                                                                    </Col>
                                                                </Row>
                                                            </form>
                                                        ) : (
                                                            <>
                                                                <div className="m-0 p-0">
                                                                    <li className="font-18  ">{ele?.comment}</li>
                                                                </div>
                                                                <div className="d-flex m-0 p-0">
                                                                    <p
                                                                        className=" p-0"
                                                                        onClick={() => handelUpdateAll(ele, ind)}>
                                                                        Edit
                                                                    </p>
                                                                    {/* <p
                                                                        className=" cp  p-0 ps-2"
                                                                        onClick={() => handeldelete(ele)}>
                                                                        Delete
                                                                    </p> */}
                                                                </div>
                                                            </>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Row>
                                        </ul>
                                    ))}
                                </Row>
                            ) : connectComponent === 'AddSubtask' ? (
                                <form onSubmit={handleSubmit(subtasksSubmit)}>
                                    <Row className="mt-2">
                                        <Col>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label className='mb-0'>
                                                    Summary<span className='text-danger'>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Subtask Name"
                                                    {...register('summary', { required: true })}
                                                    style={{ border: '1px solid #a6b3c3' }}
                                                />
                                                {errors.summary?.type === 'required' && (
                                                    <span className="text-danger"> This field is required *</span>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        <Col sm={12}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>
                                                    Description<span className='text-danger'>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    placeholder="Enter Subtask Description"
                                                    {...register('description', { required: true })}
                                                    style={{ border: '1px solid #a6b3c3' }}
                                                />
                                                {errors.description?.type === 'required' && (
                                                    <span className="text-danger"> This field is required *</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label className='mb-0'>
                                                    Priority<span className='text-danger'>*</span>
                                                </Form.Label>
                                                <select
                                                    name="priority"
                                                    className="form-select"
                                                    style={{ border: '1px solid #a6b3c3' }}
                                                    {...register('priority', { required: true })}>
                                                    <option hidden selected>
                                                        Select
                                                    </option>
                                                    <option value="Critical">
                                                        &#128308;
                                                        Critical
                                                    </option>
                                                    <option value="High">
                                                        &#128992;
                                                        High</option>
                                                    <option value="Medium">
                                                        &#128993;
                                                        Medium</option>
                                                    <option value="Low">
                                                        &#128994;
                                                        Low</option>
                                                </select>

                                                {errors?.priority?.type === 'required' && (
                                                    <span className="text-danger"> This field is required *</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label className='mb-0'>
                                                    Expected Hours<span className='text-danger'>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    style={{ border: '1px solid #a6b3c3' }}
                                                    placeholder="Expected Hours"
                                                    {...register('expectedHours')}
                                                />

                                            </Form.Group>
                                        </Col>

                                        <Col sm={6}>
                                            <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                                <Form.Label className="w-100 mb-0">
                                                    Start Date<span className="text-danger">*</span>:
                                                </Form.Label>

                                                <DatePicker
                                                    selected={startDate}
                                                    // onChange={(date) => setStartDate(date)}
                                                    onChange={(date) => handleStartDate(date)}
                                                    placeholderText="mm-dd-yyyy"
                                                    minDate={today}
                                                    className="add_width_input"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                                <Form.Label className="w-100 mb-0">
                                                    End Date<span className="text-danger">*</span>:
                                                </Form.Label>

                                                <DatePicker
                                                    selected={endDate}
                                                    disabled={startDate == '' || startDate == undefined}
                                                    // onChange={(date) => setEndDate(date)}
                                                    onChange={(date) => handleEndDate(date)}
                                                    placeholderText="mm-dd-yyyy"
                                                    minDate={startDate}
                                                    className="add_width_input"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label className='mb-0'>
                                                    Subtask Type<span className='text-danger'>*</span>
                                                </Form.Label>
                                                <select
                                                    style={{ border: '1px solid #a6b3c3' }}
                                                    name="type"
                                                    className="form-select"
                                                    {...register('type', { required: true })}>
                                                    <option hidden selected>
                                                        Select
                                                    </option>
                                                    <option value="SubTask">
                                                        SubTask
                                                    </option>
                                                    <option value="Bug">
                                                        Bug
                                                    </option>
                                                </select>

                                                {errors?.type?.type === 'required' && (
                                                    <span className="text-danger"> This field is required *</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label className='mb-0'>
                                                    Attachment
                                                </Form.Label>
                                                <Form.Control
                                                    style={{ border: '1px solid #a6b3c3' }}
                                                    type='file'
                                                    {...register('uploadfile')}
                                                />

                                            </Form.Group>
                                        </Col>
                                        <Row>
                                            <Col className='text-center'>
                                                <Button type="submit" className='mybutton btn px-2 fw-bold py-1 mt-2 web_button'>{buttonChange ? 'Add' : 'Update'}</Button>
                                            </Col>
                                        </Row>
                                    </Row>
                                </form>
                            ) : connectComponent === 'Comments' ? (
                                <>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Row className="mt-2">
                                            <Col lg={10}>
                                                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Add comment"
                                                        {...register('comment', { required: true })}
                                                    />
                                                    {/* {errors.comment?.type === 'required' && (
                                                <span className="text-danger"> This field is required *</span>
                                            )} */}
                                                </Form.Group>
                                            </Col>
                                            <Col className="m-0 p-0" lg={2}>
                                                <Button type="submit" className='bg-black border-0'>{buttonChange ? 'Add' : 'Update'}</Button>
                                            </Col>
                                        </Row>
                                    </form>
                                    <Row>
                                        {getCommentData?.map((ele, ind) => (
                                            <ul style={{ listStyle: 'none' }}>
                                                <Row>
                                                    <Col lg={12} className="d-flex pt-2">
                                                        <Col lg={2} className="pt-2">
                                                            <span
                                                                style={{
                                                                    backgroundColor: '#605e5a',
                                                                    borderRadius: '100%',
                                                                    padding: '11px 15px',
                                                                    color: 'white',
                                                                    fontWeight: '800',
                                                                }}>
                                                                {ele?.userId?.firstName.charAt(0)}
                                                                {ele?.userId?.lastName.charAt(0)}
                                                            </span>
                                                        </Col>
                                                        <Col lg={10} className="m-0 p-0">
                                                            <div className="d-flex">
                                                                <h4 className="m-0 p-0"> {ele?.userId?.firstName}</h4>
                                                                <h4 className="ps-1 m-0 p-0">
                                                                    {' '}
                                                                    {ele?.userId?.lastName}
                                                                </h4>
                                                                <p className="ps-1 m-0 p-0">
                                                                    {moment(ele?.createdAt).fromNow()}{' '}
                                                                    {/* {moment(ele?.createdAt).add(1, 'days').calendar()}     */}
                                                                </p>
                                                                {/* <p className='ps-1 m-0 p-0'>{moment(ele?.createdAt).startOf('hour').fromNow()}</p> */}
                                                            </div>
                                                            <div className="m-0 p-0">
                                                                <li className="font-18  ">{ele?.comment}</li>
                                                            </div>
                                                            <div className="d-flex m-0 p-0">
                                                                <p className=" p-0" onClick={() => handelUpdate(ele)}>
                                                                    Edit
                                                                </p>
                                                                {/* <p
                                                                    className=" cp  p-0 ps-2"
                                                                    onClick={() => handeldelete(ele)}>
                                                                    Delete
                                                                </p> */}
                                                            </div>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </ul>
                                        ))}
                                    </Row>
                                </>
                            ) : connectComponent === 'History' ? (

                                // <div>
                                //     {store?.getHistoryReducer?.data?.response?.map((ele) => (
                                //         <>

                                //             <div className="d-flex align-items-center pt-2">
                                //                 <span
                                //                     style={{
                                //                         backgroundColor: '#605e5a',
                                //                         borderRadius: '100%',
                                //                         padding: '11px 11px',
                                //                         color: 'white',
                                //                         fontWeight: '800',
                                //                         textTransform: "uppercase"
                                //                     }}>
                                //                     {ele.userId.firstName?.charAt(0)}
                                //                     {ele.userId.lastName?.charAt(0)}
                                //                 </span>
                                //             )}
                                //             <h4 className="pe-1 ps-1">
                                //                 {ele.userId?.firstName} {ele.userId?.lastName}
                                //             </h4>
                                //             {ele.userActivity} {ele.time && moment(ele.time).format('LLL')}
                                //         </div>
                                //     ))}
                                // </div>
                                ''


                            ) : connectComponent === 'Bugs' ? (

                                <Table className="mb-0 add_Color_font" striped>
                                    <thead>
                                        <tr>
                                            <th className='fw-bold'>#</th>
                                            <th className='fw-bold'>Summary</th>
                                            <th className='fw-bold'>Decription</th>
                                            <th className='fw-bold'>Assignee</th>
                                            <th className='fw-bold'>Priority</th>
                                            <th className='fw-bold'>Start Date</th>
                                            <th className='fw-bold'>End Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {store?.getBugsReducer?.data?.response?.map((bug, ind) => {
                                            return (
                                                <tr className="align-middle">
                                                    <th>{ind + 1}</th>

                                                    <td>
                                                        <span title={bug?.summary}>
                                                            {bug?.summary.slice(0, 8)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span title={bug?.description}>{bug?.description.slice(0, 10)}</span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {bug?.expectedHours}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {bug?.priority}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {bug?.startDate.slice(0, 10)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {bug?.dueDate.slice(0, 10)}
                                                        </span>
                                                    </td>


                                                </tr>
                                            );
                                        })}

                                    </tbody>
                                </Table>




                            ) : connectComponent === 'Subtask' ? (

                                <Table className="mb-0 add_Color_font" striped>
                                    <thead>
                                        <tr>
                                            <th className='fw-bold'>#</th>
                                            <th className='fw-bold'>Summary</th>
                                            <th className='fw-bold'>Decription</th>
                                            <th className='fw-bold'>Assignee</th>
                                            <th className='fw-bold'>Priority</th>
                                            <th className='fw-bold'>Start Date</th>
                                            <th className='fw-bold'>End Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {store?.getSubTaskReducer?.data?.response?.map((bug, ind) => {
                                            return (
                                                <tr className="align-middle">
                                                    <th>{ind + 1}</th>

                                                    <td>
                                                        <span title={bug?.summary}>
                                                            {bug?.summary.slice(0, 8)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span title={bug?.description}>{bug?.description.slice(0, 10)}</span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {bug?.expectedHours}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {bug?.priority}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {bug?.startDate.slice(0, 10)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {bug?.dueDate.slice(0, 10)}
                                                        </span>
                                                    </td>


                                                </tr>
                                            );
                                        })}

                                    </tbody>
                                </Table>
                            ) : (
                                ''
                            )}
                        </Col>
                        <Col lg={5}>
                            <div class="table-responsive">
                                <table class="table lh-sm table-borderless text-nowrap" style={{ fontSize: '14px' }} >
                                    <tbody className='text-start'>
                                        <tr className='text-start'>
                                            <th className='fw-bold' style={{ width: 'fit-content', }}>Project Name :</th>
                                            <td>{editData?.projects?.projectName}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold' style={{ width: 'fit-content', }}>Milestone Name :</th>
                                            <td>{editData?.milestones?.title}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold' style={{ width: 'fit-content', }}>Sprint Name :</th>
                                            <td>{editData?.sprints?.sprintName}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold' style={{ width: 'fit-content', }}>Summary :</th>
                                            <td>{editData?.summary}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold' style={{ width: 'fit-content', }}>Description :</th>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: editData?.description }} />
                                            </td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold' style={{ width: 'fit-content', }}>Start Date :</th>
                                            <td>{editData?.startDate ? moment(editData?.startDate).format('DD/MM/YYYY') : ''}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold' style={{ width: 'fit-content', }}>End Date :</th>
                                            <td>{editData?.dueDate ? moment(editData?.dueDate).format('DD/MM/YYYY') : ''}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold' style={{ width: 'fit-content', }}>Assignee :</th>
                                            <td>{editData?.assigneeInfo?.firstName} {editData?.assigneeInfo?.lastName}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold' style={{ width: 'fit-content', }}>Reporter :</th>
                                            <td>{editData?.reporterInfo?.firstName} {editData?.reporterInfo?.lastName}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold' style={{ width: 'fit-content', }}>Priority :</th>
                                            <td class="fw-bold">{editData?.priority}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold' style={{ width: 'fit-content', }}>Status :</th>
                                            <td>
                                                {editData?.status == 1 ? 'To-Do' : ''}
                                                {editData?.status == 2 ? 'In-Progress' : ''}
                                                {editData?.status == 3 ? 'Hold' : ''}
                                                {editData?.status == 4 ? 'Done' : ''}
                                            </td>
                                        </tr>
                                        {editData?.attachment !== '' ? (
                                            <tr className='text-start'>
                                                <th className='fw-bold' style={{ width: 'fit-content', }}>Attachment:</th>
                                                <td>
                                                    <a href={editData?.attachment} download target="_blank">
                                                        <i class="dripicons-download download_color"></i>
                                                    </a>
                                                    <img style="width: 10rem; height: 10rem;" class="img_style ps-1" src={editData?.attachmentType !== 'application/pdf' ? editData?.attachment : pdfImage} />
                                                </td>
                                            </tr>
                                        ) : (
                                            ''
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </Col>
                    </Row>
                </Modal.Body >
            </Modal >
        </>
    );
};

export default TaskDetailPage;
