import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import { AddComment, deleteComment, getComment } from '../../../redux/task/action';
import ToastHandle from '../../../constants/toaster/toaster';
import { Row, Col, Card, Button, Alert, CloseButton } from 'react-bootstrap';
const TaskDetailPage = ({ modal, editData, closeModal }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [date, setDate] = useState('');
    // setDate(editData?.createdAt);
    console.log(editData?.createdAt, 'attttt');
    // if (editData?.createdAt) {
    //     setDate(editData?.createdAt);
    // }
    const [connectComponent, setConnectComponent] = useState('All');
    const getCommentData = store?.getComment?.data?.response;
    const connectComponentCheck = (type) => {
        setConnectComponent(type);
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

    const onSubmit = (val) => {
        let body = {
            taskId: editData?._id,
            comment: val?.comment,
        };
        dispatch(AddComment(body));
        dispatch(getComment({ taskId: editData?.id }));
        setValue('comment', '');
    };
    // const handeldelete = (data) => {
    //     dispatch(deleteComment({ taskId: data?._id }));
    // };

    return (
        <>
            <Modal show={modal} onHide={closeModal} size={'lg'}>
                <Row className="m-0 p-0">
                    <Col lg={12}>
                        <Row>
                            <Col lg={7} className="text-end">
                                <Modal.Title id="" className="mx-auto">
                                    Task Detail
                                </Modal.Title>
                            </Col>
                            <Col lg={5} className="text-end pt-2">
                                <CloseButton onClick={closeModal} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <Modal.Body>
                    <Row>
                        <Col lg={6}>
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
                                </Col>
                            </Row>
                            {connectComponent === 'All' ? (
                                ''
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
                                                <span className="text-danger"> This feild is required *</span>
                                            )} */}
                                                </Form.Group>
                                            </Col>
                                            <Col lg={2}>
                                                <Button type="submit">Add</Button>
                                            </Col>
                                        </Row>
                                    </form>
                                    <Row>
                                        {getCommentData?.map((ele, ind) => (
                                            <ul style={{ listStyle: 'none' }}>
                                                <div className="d-flex">
                                                    <span
                                                        style={{
                                                            backgroundColor: '#605e5a',
                                                            borderRadius: '100%',
                                                            padding: '9px',
                                                            color: 'white',
                                                            fontWeight: '800',
                                                        }}>
                                                        {ele?.userId?.firstName.charAt(0)}
                                                        {ele?.userId?.lastName.charAt(0)}
                                                    </span>
                                                    <div className="">
                                                        {' '}
                                                        <li className="font-18 ms-2 ">{ele?.comment}</li>
                                                    </div>
                                                </div>
                                                <div className="d-flex m-0 p-0">
                                                    <p className="ms-4 ps-2 p-0">Edit</p>
                                                    {/* <p className="ms-2 cp  p-0" onClick={() => handeldelete(ele)}>
                                                        Delete
                                                    </p> */}
                                                </div>
                                            </ul>
                                        ))}
                                    </Row>
                                </>
                            ) : connectComponent === 'History' ? (
                                ''
                            ) : (
                                ''
                            )}
                        </Col>
                        <Col lg={6}>
                            <Card className="p-2">
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Project Name :</h4>
                                    <p className="ms-2 p-0">{editData?.projectInfo?.projectName}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Milestone Name :</h4>
                                    <p className="ms-2 p-0">{editData?.milestoneInfo?.title}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Sprint Name :</h4>
                                    <p className="ms-2 p-0">{editData?.sprintInfo?.sprintName}</p>
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
                                    <h4 className="m-0 p-0"> Start Time</h4>
                                    <p className="ms-2 p-0">
                                        {new Date(editData?.updatedAt).getUTCHours() +
                                            ':' +
                                            new Date(editData?.updatedAt).getUTCMinutes()}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0"> Start Date :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.startDate ? moment(editData?.startDate).format('L') : ''}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0"> End Date :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.dueDate ? moment(editData?.dueDate).format('L') : ''}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0"> Assignee :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.assignees?.assigneeInfo?.firstName}
                                        {editData?.assignees?.assigneeInfo?.lastName}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Reporter :</h4>
                                    <p className="ms-2 p-0">{editData?.assignees?.reporterInfo?.role}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Priority :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.priority == 1
                                            ? 'High'
                                            : '' || editData?.priority == 2
                                            ? 'Medium'
                                            : '' || editData?.priority == 3
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
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TaskDetailPage;
