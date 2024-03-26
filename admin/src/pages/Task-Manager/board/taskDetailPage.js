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
    // console.log(editData, 'editdataaaaaaaaaaa');
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
    const bugs = store?.getBugsReducer?.data?.response;
    console.log(bugs,'nisll')
    
  
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
        console.error(editData._id, 'this is the task id');
        if (!taskId) {
            console.error('taskId is missing');
            return;
        }

        let subtask_body = new FormData();
        subtask_body.append('taskId', taskId);
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

        if (taskId !== '') {
            dispatch(createSubTask(subtask_body));
        }

        setValue('Summary', '');
        setValue('priority', '');
        setValue('start_date', '');
        setValue('last_date', '');
        setValue('description', '');
        setStartDate("");
        setEndDate("");
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
                                <Modal.Title id="" className="mx-auto">
                                    Task Detail
                                </Modal.Title>
                            </Col>
                            <Col lg={5} className="text-end pt-2">
                                <CloseButton onClick={closeModalHandle} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <Modal.Body>
                    <Row>
                        <Col lg={9}>
                            <h4>Activity</h4>
                            <Row>
                                <Col lg={12}>
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('All');
                                        }}
                                        style={{
                                            backgroundColor: '#f3f3f3',
                                            borderColor: '#f3f3f3',
                                            color: 'black',
                                            boxShadow: 'none',
                                        }}>
                                        All
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('Comments');
                                        }}
                                        style={{
                                            backgroundColor: '#f3f3f3',
                                            borderColor: '#f3f3f3',
                                            color: 'black',
                                            boxShadow: 'none',
                                        }}
                                        className="ms-2">
                                        Comments
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('History');
                                        }}
                                        style={{
                                            backgroundColor: '#f3f3f3',
                                            borderColor: '#f3f3f3',
                                            color: 'black',
                                            boxShadow: 'none',
                                        }}
                                        className="ms-2">
                                        History
                                    </Button>

                                    {/* Add Sub-tasks button */}
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('Subtasks');
                                        }

                                        }
                                        style={{
                                            backgroundColor: '#f3f3f3',
                                            borderColor: '#f3f3f3',
                                            color: 'black',
                                            boxShadow: 'none',
                                        }}
                                        className="ms-2">
                                       Add Sub-tasks
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('Bugs');
                                        }}
                                        style={{
                                            backgroundColor: '#f3f3f3',
                                            borderColor: '#f3f3f3',
                                            color: 'black',
                                            boxShadow: 'none',
                                        }}
                                        className="ms-2">
                                        Bugs
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            connectComponentCheck('view_Subtask');
                                        }}
                                        style={{
                                            backgroundColor: '#f3f3f3',
                                            borderColor: '#f3f3f3',
                                            color: 'black',
                                            boxShadow: 'none',
                                        }}
                                        className="ms-2">
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
                                                                {/* {moment(ele?.createdAt).add(1, 'days').calendar()}     */}
                                                            </p>
                                                            {/* <p className='ps-1 m-0 p-0'>{moment(ele?.createdAt).startOf('hour').fromNow()}</p> */}
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
                            ) : connectComponent === 'Subtasks' ? (
                                <form onSubmit={handleSubmit(subtasksSubmit)}>
                                    <Row className="mt-2">
                                        <Col sm={6}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label className='mb-0'>
                                                    Summary<span className='text-danger'>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Subtask Name"
                                                    {...register('summary', { required: true })}
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
                                                    placeholder="Expected Hours"
                                                    {...register('expectedHours')}
                                                />

                                            </Form.Group>
                                        </Col>

                                        <Col sm={6}>
                                            <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                                <Form.Label className="w-100">
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
                                                <Form.Label className="w-100">
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
                                                    type='file'
                                                    {...register('uploadfile')}
                                                />

                                            </Form.Group>
                                        </Col>
                                        <Row>
                                            <Col className='text-center'>
                                                <Button type="submit">{buttonChange ? 'Add' : 'Update'}</Button>
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
                                                <Button type="submit">{buttonChange ? 'Add' : 'Update'}</Button>
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

                                <div>
                                    {getHistory?.map((ele) => (
                                        <>

                                            <div className="d-flex align-items-center pt-2">
                                                <span
                                                    style={{
                                                        backgroundColor: '#605e5a',
                                                        borderRadius: '100%',
                                                        padding: '11px 11px',
                                                        color: 'white',
                                                        fontWeight: '800',
                                                        textTransform: "uppercase"
                                                    }}>
                                                    {ele?.userId?.firstName.charAt(0)}
                                                    {ele?.userId?.lastName.charAt(0)}
                                                </span>
                                                <h4 className="pe-1 ps-1">
                                                    {ele?.userId?.firstName} {ele?.userId?.lastName}
                                                </h4>
                                                {ele?.userActivity}  {moment(ele?.time).format('LLL')}
                                            </div>
                                        </>
                                    ))}
                                </div>

                            ) : connectComponent === 'Bugs' ? (

                                <div className='bg-white'>
                                    <div className="container-fluid">
                                        <div className="row ">
                                            <div className="col-12 p-1">
                                                <Table className="mb-0 add_Color_font" >
                                                    <thead>
                                                        <tr>
                                                            <th className='fw-bold'>#</th>
                                                            <th className='fw-bold'>Summary</th>
                                                            <th className='fw-bold'>Decription</th>
                                                            <th className='fw-bold'>ExpectedHours</th>
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
                                                    {bug?.summary.slice(0,8)} 
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
                                                    {bug?.startDate.slice(0,10)}
                                                </span>
                                               </td>
                                               <td>
                                                <span>
                                                    {bug?.dueDate.slice(0,10)}
                                                </span>
                                               </td>
                                              
                                               
                                            </tr>
                                        );
                                    })}
                                                    </tbody>
                                               
                                                </Table>

                                            </div>

                                        </div>
                                    </div>
                                </div>

                            ) :  connectComponent === 'view_Subtask' ? (

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
                                                    {bug?.summary.slice(0,8)} 
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
                                                    {bug?.startDate.slice(0,10)}
                                                </span>
                                               </td>
                                               <td>
                                                <span>
                                                    {bug?.dueDate.slice(0,10)}
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
                        <Col lg={3}>
                            <div className="p-2">
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Project Name :</h4>
                                    <p className="ms-2 p-0">{editData?.projects?.projectName}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Milestone Name :</h4>
                                    <p className="ms-2 p-0">{editData?.milestones?.title}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Sprint Name :</h4>
                                    <p className="ms-2 p-0">{editData?.sprints?.sprintName} </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Summary :</h4>
                                    <p className="ms-2 p-0">{editData?.summary}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0"> Description :</h4>
                                    <p className="ms-2 p-0">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: editData?.description,
                                            }}
                                        />
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0"> Start Date :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.startDate ? moment(editData?.startDate).format('DD/MM/YYYY') : ''}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0"> End Date :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.dueDate ? moment(editData?.dueDate).format('DD/MM/YYYY') : ''}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0"> Assignee :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.assigneeInfo?.firstName}{' '}
                                        {editData?.assigneeInfo?.lastName}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Reporter :</h4>
                                    <p className="ms-2 p-0">{editData?.reporterInfo?.firstName}{''}{editData?.reporterInfo?.lastName}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Priority :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.priority == "High"
                                            ? 'High'
                                            : '' || editData?.priority == "Medium"
                                                ? 'Medium'
                                                : '' || editData?.priority == "Low"
                                                    ? 'Low'
                                                    : ''}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Status :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.status == 1
                                            ? 'To-Do'
                                            : '' || editData?.status == 2
                                                ? 'In-Progress'
                                                : '' || editData?.status == 3
                                                    ? 'Hold'
                                                    : '' || editData?.status == 4
                                                        ? 'Done'
                                                        : ''}
                                    </p>
                                </div>
                                {editData?.attachment !== '' ? (
                                    <div className=" d-flex">
                                        <h4 className="m-0 p-0 me-2">Attachment:</h4>
                                        <a
                                            href={editData?.attachment}
                                            download
                                            target="_blank"
                                            className="align_icon_dowl">
                                            <i className="dripicons-download download_color"></i>
                                        </a>
                                        <img
                                            style={{ width: '10rem', height: '10rem' }}
                                            className="img_style ps-1"
                                            src={
                                                editData?.attachmentType !== 'application/pdf'
                                                    ? editData?.attachment
                                                    : pdfImage
                                            }
                                        />

                                        {/* <img src={editData?.attachment} /> */}
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </Col>
                    </Row>
                </Modal.Body >
            </Modal >
        </>
    );
};

export default TaskDetailPage;
