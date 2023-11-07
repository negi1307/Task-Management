
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';

import moment from 'moment';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addComment, getComment, updateComment, deleteComment, getCommentId } from '../../../redux/addcomment/actions';
import Attachments from './../../apps/Tasks/Details/Attachments';

const Taskdetail = (props) => {
    const dispatch = useDispatch();
    const store = useSelector(state => state)

    const allComments = store?.getAllComment?.data?.response;
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();


    const [getCommentIdDta, setCommentId] = useState('');
    const onSubmitComment = (e) => {
        if (getCommentIdDta == "") {
            const commentData = {
                userId: props.userId,
                taskId: e.taskid,
                comment: e.comment
            }
            dispatch(addComment(commentData))
            dispatch(getComment({ taskId: props.item?.taskInfo?._id }));
        }
        else {
            const body = {
                commentId: getCommentIdDta,
                comment: e.comment
            }
            dispatch(updateComment(body))

        }

    }


    const downloadFile = (file) => {
        fetch(file).then((response) => {
            response.blob().then((blob) => {
                const fileURL = window.URL.createObjectURL(blob);
                let alink = document.createElement("a");
                alink.href = fileURL;
                alink.download = getfileNameFromUrl(file);
                alink.click();
            });
        });
    };
    const getfileNameFromUrl = (url) => {
        var filename = "";
        if (url != "") {
            filename = new URL(url).pathname.split('/').pop();
            getfileNameExt(url);
        }

        return filename;
    }
    const getfileNameExt = (url) => {
        var ext = "";
        if (url != "") {
            ext = new URL(url).pathname.split('.').pop();
        }
        return ext;
    }

    const DeleteData = (id) => {
        dispatch(deleteComment({ commentId: id }))
        setTimeout(() => {
            dispatch(getComment({ taskId: props.item?.taskInfo?._id }));
        }, 500);
    }

    return (
        <>
            <Modal show={props.show} size={'sm'} onHide={props.closeTaskDetailMOdel} backdrop="static" className='modal_details'>
                <Modal.Header closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className='cardinfo'>

                    <div className='comments'>
                        <h4>Activity</h4>

                        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">All</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Comments</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">History</button>
                            </li>

                        </ul>
                        <div class="tab-content" id="pills-tabContent">
                            <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
                            <div className='taskcardinfo'>

                                            <table>
                                                {allComments?.slice(0).reverse().map((comm, index) =>
                                                    <>
                                                        <tr className='task_comment_info'>
                                                            <td className="user_name"><span>{comm?.userId?.firstName.charAt(0)}</span><p>{comm?.userId?.firstName} </p> Added a Comment   </td>
                                                        </tr>
                                                        <tr>  <td className='user_comment'>{comm?.comment}</td>

                                                            <td>
                                                                {moment(comm?.createdAt).add(24, 'hours').format("LT")}

                                                            </td>
                                                        </tr>
                                                        
                                                    </>

                                                )}
                                            </table>
                                            <table>

                                            </table>

                                        </div>
                            </div>
                            <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
                                <div className='addcommentname'>
                                    <div className='edit_delte'>

                                        <div className='taskcardinfo'>

                                            <form onSubmit={handleSubmit(onSubmitComment)}>
                                                <input type="hidden" value={props.item?.taskInfo?._id} {...register('taskid')} />
                                                <input type="text" id="exampleForm.ControlTextarea1" class="form-control" placeholder='Add Comment' {...register('comment')} />
                                                <button type="submit" class="mybutton btn btn-info">Add</button>
                                            </form>
                                            <table>
                                                {allComments?.slice(0).reverse().map((comm, index) =>
                                                    <>
                                                        <tr className='task_comment_info'>
                                                            <td className="user_name"><span>{comm?.userId?.firstName.charAt(0)}</span><p>{comm?.userId?.firstName}</p></td>
                                                        </tr>
                                                        <tr>  <td className='user_comment'>{comm?.comment}</td>

                                                            <td>
                                                                {moment(comm?.createdAt).format("hh:mm")}

                                                            </td>
                                                        </tr>
                                                        <tr><td><a href='javascript:void(0)' onClick={() => DeleteData(comm?._id)}>Delete</a></td></tr>
                                                    </>

                                                )}
                                            </table>
                                            <table>

                                            </table>

                                        </div>

                                    </div>



                                </div>
                            </div>
                            <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">

                                <div className="history">
                                    <div className='history_data_info'>
                                        {props.historyData?.map((datainfo, index) =>
                                            <h4>{datainfo.currentStatus}</h4>
                                        )}

                                    </div>
                                    <div className='history_data_info'>
                                        {props.historyData?.map((datainfo, index) =>
                                            <p>{datainfo?.taskId?.summary}</p>
                                        )}
                                    </div>



                                </div>
                            </div>
                            <div class="tab-pane fade" id="pills-disabled" role="tabpanel" aria-labelledby="pills-disabled-tab" tabindex="0">...</div>
                        </div>
                    </div>


                    <div class="card_detail">
                        <h4>Details</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <li>
                                <label>Summary:</label>
                                {props.item?.taskInfo?.summary}
                            </li>
                            <li>
                                <label>Description:</label>

                                <div className='description'
                                    dangerouslySetInnerHTML={{
                                        __html: props.item?.taskInfo?.description,
                                    }}></div>
                            </li>


                            <li>
                                <label>Start Date:</label>

                                {props.item?.taskInfo?.startDate ? moment(props.item?.taskInfo?.startDate).format('ll') : ''}
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


                            <li>
                                <label>Project Name:</label>

                                {props.item.projectInfo?.projectName}
                            </li>
                            <li>
                                <label>
                                    Attachment:
                                </label>

                                {
                                    (() => {
                                        const ext = props.item.taskInfo?.attachment ? getfileNameExt(props.item.taskInfo?.attachment) : "";
                                        if (ext == "png" || ext == "jpg" || ext == "jpeg") {
                                            return (
                                                <img src={props.item?.taskInfo?.attachment} title={props.item.taskInfo?.attachment ? getfileNameFromUrl(props.item.taskInfo?.attachment) : ""} width={150} height={100} />
                                            )
                                        }
                                        else if (ext == "pdf") {
                                            return (
                                                <a href={props.item?.taskInfo?.attachment} title={props.item.taskInfo?.attachment ? getfileNameFromUrl(props.item.taskInfo?.attachment) : ""}> <i class="fa fa-file-pdf-o" aria-hidden="true"></i></a>
                                            )
                                        }
                                        else if (ext == "docx" || ext == "doc") {
                                            return (
                                                <a href={props.item?.taskInfo?.attachment}>{props.item.taskInfo?.attachment ? getfileNameFromUrl(props.item.taskInfo?.attachment) : ""}</a>
                                            )
                                        }
                                    })()
                                }
                            </li>
                            <li>
                                <button type='button' onClick={() => downloadFile(props.item.taskInfo?.attachment)}>Download</button>

                            </li>


                        </ul>
                    </div>
                </Modal.Body>

            </Modal>

        </>
    )
}


export default Taskdetail


