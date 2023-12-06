import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { Col, Row, Form, Button } from 'react-bootstrap';
import moment from 'moment';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addComment, getComment, updateComment, deleteComment, getCommentId,getHistory } from '../../../redux/addcomment/actions';
import Attachments from './../../apps/Tasks/Details/Attachments';

const Taskdetail = (props) => {
    const { item } = props;
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [inputForUpdate, setInputForUpdate] = useState('');
    const [allCommetUpdateId, setAllCommetUpdateId] = useState('');
    const [updatedCommentValue, setUpdatedCommentValue] = useState('');
    const [updatedCommentInitialValue, setUpdatedCommentInitialValue] = useState('');
    const [unchangeComment, setUnchangeComment] = useState('');
    const [error, setError] = useState('');
    const allComments = store?.getAllComment?.data?.response;
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmitComment = (e) => {
        if(e.commentId !== ""){
            updateCommentData(e);
        }
        else{
            const commentData = {
                userId: props.userId,
                taskId: item?.taskId,
                comment: e.comment,
            };
            dispatch(addComment(commentData));
            dispatch(getComment(item?.taskId));
            dispatch(getHistory(item?.taskId))            
        }
        setValue('comment', '');
    };
    const[isUpdate,setIsUpdate] = useState(false);
    const updateCommentData=(e)=>{
       const commentData = {
        taskId:item?.taskId,
        commentId : e.commentId,
        comment : e.comment
       }
       dispatch(updateComment(commentData));
       setTimeout(() => {
        dispatch(getComment(item?.taskId));
       dispatch(getHistory(item?.taskId)); 
       }, 500);
       setIsUpdate(false);
    }


    const editComment =(item)=>{
        setValue('comment',item?.comment);
        setValue('commentId',item?._id);
        setIsUpdate(true);
      }
     
    const downloadFile = (file) => {
        fetch(file).then((response) => {
            response.blob().then((blob) => {
                const fileURL = window.URL.createObjectURL(blob);
                let alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = getfileNameFromUrl(file);
                alink.click();
            });
        });
    };
    const getfileNameFromUrl = (url) => {
        var filename = '';
        if (url != '') {
            filename = new URL(url).pathname.split('/').pop();
            getfileNameExt(url);
        }

        return filename;
    };
    const getfileNameExt = (url) => {
        var ext = '';
        if (url != '') {
            ext = new URL(url).pathname.split('.').pop();
        }
        return ext;
    };

    const DeleteData = (id) => {
        console.log(id);
        dispatch(deleteComment({ commentId: id._id }));
        setTimeout(() => {
            dispatch(getComment(item?.taskId));
        }, 500);
    };
    console.log(updatedCommentValue, 'data===');
    const updateHandle = (condition) => {

        if (updatedCommentInitialValue !== '') {
            if (condition === 'updateComment') {
                let body = {
                    taskId:item?.taskId,
                    commentId: allCommetUpdateId,
                    comment: updatedCommentInitialValue,
                };
                dispatch(updateComment(body));
                setTimeout(() => {
                    dispatch(getComment(item?.taskId));
                }, 500);
                setInputForUpdate(false);
            } else {
                setInputForUpdate(false);
            }
        } else {
            setError('This field is required');
            setInputForUpdate(false);
        }
    };
    const handelUpdateAll = (data, indx) => {

        setError('');
        setUnchangeComment(data?.comment);
        setAllCommetUpdateId(data?._id);
        setInputForUpdate(indx);
        setUpdatedCommentInitialValue(data?.comment);
    };
  
    
    return (
        <>
            <Modal
                show={props.show}
                size={'sm'}
                onHide={props.closeTaskDetailMOdel}
                backdrop="static"
                className="modal_details">
                <Modal.Header onClick={() => updateHandle('closeModal')} closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="cardinfo">
                    <div className="comments">
                        <h4>Activity</h4>
                        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button
                                    class="nav-link active"
                                    id="pills-home-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-home"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-home"
                                    aria-selected="true">
                                    All
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button
                                    class="nav-link"
                                    id="pills-profile-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-profile"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-profile"
                                    aria-selected="false">
                                    Comments
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button
                                    class="nav-link"
                                    id="pills-contact-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-contact"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-contact"
                                    aria-selected="false">
                                    History
                                </button>
                            </li>
                        </ul>
                        <div class="tab-content" id="pills-tabContent">
                            <div
                                class="tab-pane fade show active"
                                id="pills-home"
                                role="tabpanel"
                                aria-labelledby="pills-home-tab"
                                tabindex="0">
                                <div className="taskcardinfo">
                                    <Row className="mt-3">
                                        {allComments?.map((comm, ind) =>

                                        (
                                            <ul style={{ listStyle: 'none' }}>
                                                {/* <h6>{comm}</h6> */}
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
                                                                {comm?.userId?.firstName.charAt(0)}
                                                                {comm?.userId?.lastName.charAt(0)}
                                                            </span>
                                                        </Col>
                                                        <Col lg={10} className="m-0 p-0">
                                                            <div className="d-flex">
                                                                <h4 className="m-0 p-0"> {comm?.userId?.firstName}</h4>
                                                                <h4 className="ps-1 m-0 p-0">
                                                                    {' '}
                                                                    {comm?.userId?.lastName}
                                                                </h4>
                                                                <p className="ps-1 m-0 p-0">
                                                                    {moment(comm?.createdAt).fromNow()}{' '}

                                                                </p>

                                                            </div>
                                                            {inputForUpdate === ind ? (
                                                                <form>
                                                                    <Row className="mt-2">
                                                                        <Col lg={10}>
                                                                            <Form.Group
                                                                                className="mb-1"
                                                                                controlId="exampleForm.ControlInput1">
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    placeholder="Update Comment"
                                                                                    defaultValue={
                                                                                        updatedCommentInitialValue
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        setUpdatedCommentInitialValue(
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                />
                                                                                {error ? (
                                                                                    <div>
                                                                                        {error}
                                                                                        <label className="text-danger">
                                                                                            {' '}
                                                                                            *
                                                                                        </label>
                                                                                    </div>
                                                                                ) : null}
                                                                            </Form.Group>
                                                                        </Col>
                                                                        <Col className="m-0 p-0" lg={2}>
                                                                            <Button
                                                                                onClick={() =>
                                                                                    updateHandle('updateComment')
                                                                                }>
                                                                                Update
                                                                            </Button>
                                                                        </Col>
                                                                    </Row>
                                                                </form>
                                                            ) : (
                                                                <>
                                                                    <div className="m-0 p-0">
                                                                        <li className="font-18  comment_info">{comm?.comment}</li>
                                                                    </div>
                                                                    <div className="d-flex m-0 p-0">
                                                                        <p
                                                                            className=" p-0"
                                                                            onClick={() => handelUpdateAll(comm, ind)}>
                                                                            Edit
                                                                        </p>

                                                                    </div>
                                                                </>
                                                            )}
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </ul>
                                        ))}
                                    </Row>

                                </div>
                            </div>
                            <div
                                class="tab-pane fade"
                                id="pills-profile"
                                role="tabpanel"
                                aria-labelledby="pills-profile-tab"
                                tabindex="0">
                                <div className="addcommentname">
                                    <div className="edit_delte">
                                        <div className="taskcardinfo">
                                            <form onSubmit={handleSubmit(onSubmitComment)}>
                                               
                                                <Row className="mt-2">
                                                    <Col lg={10}>
                                                    
                                                        <Form.Group
                                                            className="mb-1"
                                                            controlId="exampleForm.ControlInput1">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Add comment"
                                                                {...register('comment', { required: true })}
                                                            />
                                                        <input {...register('commentId')} type='hidden'></input>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col className="m-0 p-0" lg={2}>
                                                       
                                                        <Button type="submit">{isUpdate ? "Update":"Add"}</Button>
                                                    </Col>
                                                </Row>
                                            </form>
                                            <table>
                                                {allComments?.reverse()?.map((comm, ind) => (
                                                    <>
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
                                                                        {comm?.userId?.firstName.charAt(0)}
                                                                        {comm?.userId?.lastName.charAt(0)}
                                                                    </span>
                                                                </Col>
                                                                <Col lg={10} className="m-0 p-0">
                                                                    <div className="d-flex">
                                                                        <h4 className="m-0 p-0">
                                                                            {' '}
                                                                            {comm?.userId?.firstName}
                                                                        </h4>
                                                                        <h4 className="ps-1 m-0 p-0">
                                                                            {' '}
                                                                            {comm?.userId?.lastName}
                                                                        </h4>
                                                                        <p className="ps-1 m-0 p-0">
                                                                            {moment(comm?.createdAt).fromNow()}{' '}
                                                                            {/* {moment(ele?.createdAt).add(1, 'days').calendar()}     */}
                                                                        </p>
                                                                        {/* <p className='ps-1 m-0 p-0'>{moment(ele?.createdAt).startOf('hour').fromNow()}</p> */}
                                                                    </div>
                                                                    <div className="m-0 p-0">
                                                                        <li
                                                                            style={{ listStyle: 'none' }}
                                                                            className="font-18  ">
                                                                            {comm?.comment}
                                                                        </li>
                                                                    </div>

                                                                    <div className="d-flex m-0 p-0">
                                                                        <a  className=" p-0" onClick={() => editComment(comm)}>Edit</a>
                                                                    </div>
                                                                </Col>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                ))}
                                            </table>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="tab-pane fade"
                                id="pills-contact"
                                role="tabpanel"
                                aria-labelledby="pills-contact-tab"
                                tabindex="0">
                                <div className="history">
                                    <div className="history_data_info">
                                        {props.historyData?.reverse()?.map((datainfo, index) => (
                                            <>
                                                <ul>
                                                    
                                                    <li>
                                                    <p class="username">{datainfo.userId?.firstName.charAt(0)}{datainfo.userId?.lastName.charAt(0)}</p> <span>{datainfo.userId?.firstName} {datainfo.userId?.lastName}</span>  {datainfo.userActivity} {moment(datainfo?.createdAt).fromNow()}
                                                    </li>
                                                    
                                                </ul>

                                            </>

                                        ))}
                                    </div>
                                    <div className="history_data_info">
                                        {props.historyData?.map((datainfo, index) => (
                                            <p>{datainfo?.taskId?.time}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div
                                class="tab-pane fade"
                                id="pills-disabled"
                                role="tabpanel"
                                aria-labelledby="pills-disabled-tab"
                                tabindex="0">
                                ...
                            </div>
                        </div>
                    </div>

                    <div class="card_detail">
                        <h4>Details</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <li>
                                <label>Project Name:</label>

                                {props.item.projectInfo?.projectName}
                            </li>
                            <li>
                                <label>Milestone Name:</label>
                                {props.item.milestoneInfo?.title}
                            </li>
                            <li>
                                <label>Sprint Name:</label>
                                {props.item.sprintInfo?.sprintName}
                            </li>
                            <li>
                                <label>Summary:</label>
                                {props.item?.taskInfo?.summary}
                            </li>
                            <li>
                                <label>Description:</label>

                                <div
                                    className="description"
                                    dangerouslySetInnerHTML={{
                                        __html: props.item?.taskInfo?.description,
                                    }}></div>
                            </li>

                            <li>
                                <label>Start Date:</label>

                                {props.item?.taskInfo?.startDate
                                    ? moment(props.item?.taskInfo?.startDate).format('ll')
                                    : ''}
                            </li>

                            <li>
                                <label> Priority:</label>

                                {props.item.taskInfo?.priority ? 'medium' : ''}
                            </li>

                            <li>
                                <label>End Date: </label>

                                {props.item?.taskInfo?.dueDate ? moment(props.item?.dueDate).format('ll') : ''}
                            </li>

                            <li>
                                <label> Assignee Name:</label>

                                {props.item?.assigneeInfo?.firstName}
                            </li>

                            <li>
                                <label> Reporter:</label>

                                {props.item.reporterInfo?.role}
                            </li>
                         
                               {props?.item?.taskInfo?.attachment !== "null" ? (<li class="card_img">
                                <label>Attachment:</label>
                                <img
                                    src={props.item?.taskInfo?.attachment}
                                    width={150}
                                    height={150}
                                />
                                <button type="button" onClick={() => downloadFile(props.item?.taskInfo?.attachment)}>
                                    <i class="dripicons-download download_color"></i>
                                </button>

                            </li>):('')}

                        </ul>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Taskdetail;
