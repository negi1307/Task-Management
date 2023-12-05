import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import {
    AddComment,
    UpdateCommentAction,
    deleteComment,
    getComment,
    getHistoryAction,
} from '../../../redux/task/action';
import ToastHandle from '../../../constants/toaster/toaster';
import { Row, Col, Card, Button, Alert, CloseButton } from 'react-bootstrap';
import pdfImage from '../../../assets/images/pdff-removebg-preview.png';
import noimage from '../../../assets/images/noimage.png';
const TaskDetailPage = ({ modal, editData, closeModal }) => {
    console.log(editData, 'editdataaaaaaaaaaa');
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [connectComponent, setConnectComponent] = useState('All');
    const [buttonChange, setButtonChange] = useState(true);
    const [commentId, setCommentId] = useState();
    const [commentTextUpdate, setCommentTextUpdate] = useState(false);
    const getCommentData = store?.getComment?.data?.response;
    const getHistory = store?.getHistoryReducer?.data?.response;
    const connectComponentCheck = (type) => {
        setConnectComponent(type);
        setValue('comment', "");
        setButtonChange(true);
        if (type === 'History') {
            dispatch(getHistoryAction(editData?.id));
        }
    };
    const [allCommetUpdateId, setAllCommetUpdateId] = useState('');
    const [inputForUpdate, setInputForUpdate] = useState('');
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
        // dispatch(getComment({ taskId: editData?.id }));
        setValue('comment', '');
    };
    const handeldelete = (data) => {
        dispatch(deleteComment({ taskId: data?._id }));
    };
    const handelUpdate = (data) => {
        console.log(data);
        setCommentId(data?._id);
        setValue('comment', data?.comment);
        setButtonChange(false);
    };
    const handelUpdateAll = (data, indx) => {
        console.log(indx);
        setAllCommetUpdateId(data?._id);
        console.log(data?._id, 'in my id');
        reset({
            updated_comment: data?.comment,
        });
        setInputForUpdate(indx);
        console.log(data, allCommetUpdateId);

        // console.log(body);
    };
    const submitUpdateComment = (data) => {
        let body = {
            commentId: allCommetUpdateId,
            comment: data?.updated_comment,
        };
        dispatch(UpdateCommentAction(body));
        setInputForUpdate(false);
        console.log(data, allCommetUpdateId);
    };
    const closeModalHandle =()=>{
        closeModal()
        setValue('comment', "");
        setButtonChange(true);
    }
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
                                <CloseButton onClick={closeModalHandle} />
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
                                <Row className="mt-3">
                                    {getCommentData?.map((ele, ind) => (
                                        <ul style={{ listStyle: 'none' }}>
                                            <Row>
                                                <Col lg={12} className="d-flex">
                                                    <Col lg={2} className="pt-1">
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
                                            <Col className="m-0 p-0" lg={2}>
                                                <Button type="submit">{buttonChange ? 'Add' : 'Update'}</Button>
                                            </Col>
                                        </Row>
                                    </form>
                                    <Row>
                                        {getCommentData?.map((ele, ind) => (
                                            <ul style={{ listStyle: 'none' }}>
                                                <Row>
                                                    <Col lg={12} className="d-flex">
                                                        <Col lg={2} className="pt-1">
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
                                getHistory?.map((ele) => (
                                    <>
                                        <div className="d-flex align-items-center">
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
                                            <h4 className="pe-1 ps-1">
                                                {ele?.userId?.firstName} {ele?.userId?.lastName}
                                            </h4>
                                            {ele?.userActivity} {moment(ele?.time).format('LLL')}
                                        </div>
                                    </>
                                ))
                            ) : (
                                ''
                            )}
                        </Col>
                        <Col lg={6}>
                            <div className="p-2">
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
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TaskDetailPage;
