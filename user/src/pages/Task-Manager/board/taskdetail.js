import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { Col, Row, Form, Button } from 'react-bootstrap';
import moment from 'moment';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addComment, getComment, updateComment, deleteComment, getCommentId, getHistory } from '../../../redux/addcomment/actions';
import Attachments from './../../apps/Tasks/Details/Attachments';

const Taskdetail = (props) => {
    const { item } = props;

    // console.log(item, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [inputForUpdate, setInputForUpdate] = useState('');
    const [allCommetUpdateId, setAllCommetUpdateId] = useState('');
    const [updatedCommentValue, setUpdatedCommentValue] = useState('');
    const [updatedCommentInitialValue, setUpdatedCommentInitialValue] = useState('');
    const [unchangeComment, setUnchangeComment] = useState('');
    const [error, setError] = useState('');
    const [connectComponent, setConnectComponent] = useState('All');
    const [buttonChange, setButtonChange] = useState(true);

    const allComments = store?.getAllComment?.data?.response;
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm();

    const connectComponentCheck = (type) => {
        setConnectComponent(type);
        setValue('comment', "");
        setValue('subtasks', "");
        setButtonChange(true);
        // if (type === 'History') {
        // dispatch(getHistoryAction(props?.item?.id));
        // }
    };
    useEffect(() => {
        dispatch(getComment({ taskId: item?._id }))
    }, [dispatch])
    const onSubmitComment = (e) => {
        if (e.commentId !== "") {
            updateCommentData(e);
        }
        else {
            const commentData = {
                userId: props.userId,
                taskId: item?.taskId,
                comment: e.comment,
            };
            const data = {
                taskId: item?._id
            }
            dispatch(addComment(commentData));
            dispatch(getComment(data));
            dispatch(getHistory(item?.taskId))
        }
        setValue('comment', '');
    };
    const [isUpdate, setIsUpdate] = useState(false);
    const updateCommentData = (e) => {
        const commentData = {
            taskId: item?.taskId,
            commentId: e.commentId,
            comment: e.comment
        }
        dispatch(updateComment(commentData));
        //     setTimeout(() => {
        //         dispatch(getComment(item?.taskId));
        //         dispatch(getHistory(item?.taskId));
        //     }, 500);
        setIsUpdate(false);
    }


    const editComment = (item) => {
        setValue('comment', item?.comment);
        setValue('commentId', item?._id);
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
        // setTimeout(() => {
        //     dispatch(getComment(item?.taskId));
        // }, 500);
    };
    // console.log(updatedCommentValue, 'data===');
    const updateHandle = (condition) => {

        if (updatedCommentInitialValue !== '') {
            if (condition === 'updateComment') {
                let body = {
                    taskId: item?.taskId,
                    commentId: allCommetUpdateId,
                    comment: updatedCommentInitialValue,
                };
                dispatch(updateComment(body));
                // setTimeout(() => {
                //     dispatch(getComment(item?.taskId));
                // }, 500);
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
                size={'xl'}
                onHide={props.closeTaskDetailMOdel}
            >
                <Modal.Header onClick={() => updateHandle('closeModal')} closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="cardinfo">
                    <div className="row w-100">
                        <div className="col-7">
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
                                <div className="mt-3">
                                    ALL
                                </div>
                            ) : connectComponent === 'Comments' ? (
                                <div>
                                    COMMENTS
                                </div>
                            ) : connectComponent === 'History' ? (
                                <div>HISTORY</div>
                            ) : connectComponent === 'Subtask' ? (
                                // <Table className="mb-0 add_Color_font" striped>
                                //     <thead>
                                //         <tr>
                                //             <th className='fw-bold'>#</th>
                                //             <th className='fw-bold'>Summary</th>
                                //             <th className='fw-bold'>Decription</th>
                                //             <th className='fw-bold'>Assignee</th>
                                //             <th className='fw-bold'>Priority</th>
                                //             <th className='fw-bold'>Start Date</th>
                                //             <th className='fw-bold'>End Date</th>
                                //         </tr>
                                //     </thead>
                                //     {/* <tbody>

                                //         {store?.getSubTaskReducer?.data?.response?.map((bug, ind) => {
                                //             return (
                                //                 <tr className="align-middle">
                                //                     <th>{ind + 1}</th>

                                //                     <td>
                                //                         <span title={bug?.summary}>
                                //                             {bug?.summary.slice(0, 8)}
                                //                         </span>
                                //                     </td>
                                //                     <td>
                                //                         <span title={bug?.description}>{bug?.description.slice(0, 10)}</span>
                                //                     </td>
                                //                     <td>
                                //                         <span>
                                //                             {bug?.expectedHours}
                                //                         </span>
                                //                     </td>
                                //                     <td>
                                //                         <span>
                                //                             {bug?.priority}
                                //                         </span>
                                //                     </td>
                                //                     <td>
                                //                         <span>
                                //                             {bug?.startDate.slice(0, 10)}
                                //                         </span>
                                //                     </td>
                                //                     <td>
                                //                         <span>
                                //                             {bug?.dueDate.slice(0, 10)}
                                //                         </span>
                                //                     </td>


                                //                 </tr>
                                //             );
                                //         })}

                                //     </tbody> */}
                                // </Table>
                                <div>Subtask</div>

                            ) : connectComponent === 'Bugs' ? (
                                <div>NUGS</div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className='col-5'>
                            <div className="table-responsive">
                                <table className="table lh-sm table-borderless" style={{ fontSize: '14px' }} >
                                    <tbody className='text-start'>
                                        <tr className='text-start'>
                                            <th className='fw-bold text-nowrap' style={{ width: 'fit-content', }}>Project Name :</th>
                                            <td>{props?.item?.projects?.projectName}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold text-nowrap' style={{ width: 'fit-content', }}>Milestone Name :</th>
                                            <td>{props?.item?.milestones?.title}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold text-nowrap' style={{ width: 'fit-content', }}>Sprint Name :</th>
                                            <td>{props?.item?.sprints?.sprintName}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold text-nowrap' style={{ width: 'fit-content', }}>Summary :</th>
                                            <td>{props?.item?.summary}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold text-nowrap' style={{ width: 'fit-content', }}>Start Date :</th>
                                            <td>{props?.item?.startDate ? moment(props?.item?.startDate).format('DD/MM/YYYY') : ''}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold text-nowrap' style={{ width: 'fit-content', }}>End Date :</th>
                                            <td>{props?.item?.dueDate ? moment(props?.item?.dueDate).format('DD/MM/YYYY') : ''}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold text-nowrap' style={{ width: 'fit-content', }}>Assignee :</th>
                                            <td>{props?.item?.assigneeInfo?.firstName} {props?.item?.assigneeInfo?.lastName}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold text-nowrap' style={{ width: 'fit-content', }}>Reporter :</th>
                                            <td>{props?.item?.reporterInfo?.firstName} {props?.item?.reporterInfo?.lastName}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold text-nowrap' style={{ width: 'fit-content', }}>Priority :</th>
                                            <td class="fw-bold">{props?.item?.priority}</td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold text-nowrap' style={{ width: 'fit-content', }}>Status :</th>
                                            <td>
                                                {props?.item?.status == 1 ? 'To-Do' : ''}
                                                {props?.item?.status == 2 ? 'In-Progress' : ''}
                                                {props?.item?.status == 3 ? 'Hold' : ''}
                                                {props?.item?.status == 4 ? 'Done' : ''}
                                            </td>
                                        </tr>
                                        <tr className='text-start'>
                                            <th className='fw-bold'>Description:</th>
                                            <div style={{ maxHeight: '7rem', overflowY: 'scroll' }}>
                                                <td>

                                                    {props?.item?.description}
                                                    {/* </span> */}
                                                </td>
                                            </div>
                                        </tr>
                                        {props?.item?.attachment !== '' ? (
                                            <tr className='text-start'>
                                                <th className='fw-bold' style={{ width: 'fit-content', }}>Attachment:</th>
                                                <td>
                                                    <a href={props?.item?.attachment} download target="_blank">
                                                        <i class="dripicons-download download_color"></i>
                                                    </a>
                                                    <img style="width: 10rem; height: 10rem;" class="img_style ps-1" src={props?.item?.attachmentType !== 'application/pdf' ? props?.item?.attachment : pdfImage} />
                                                </td>
                                            </tr>
                                        ) : (
                                            ''
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>



                </Modal.Body >
            </Modal >
        </>
    );
};

export default Taskdetail;
