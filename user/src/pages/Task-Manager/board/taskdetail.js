
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, getComment, updateComment, deleteComment,getCommentId } from '../../../redux/addcomment/actions';

const Taskdetail=(props)=>{
    const dispatch = useDispatch();
    const store = useSelector(state => state)
    var showMOdel = props.show ;
    const allComments = store?.getAllComment?.data?.response;
    console.log("stotre data", allComments)
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
 
    const [getCommentIdDta, setCommentId] = useState('');
    const onSubmitComment = useCallback((e)=>{
        if (getCommentIdDta == "") {
            const commentData = {
                userId: props.userId,
                taskId: e.taskid,
                comment: e.comment
            }
            dispatch(addComment(commentData))
            dispatch(getComment({taskId:props.item?.taskInfo?._id}));
        }
        else {
            const body = {
                commentId: getCommentIdDta,
                comment: e.comment
            }
            dispatch(updateComment(body))

        }
        
    },[])
  
    return(
        <>
          <Modal  show={showMOdel} size={'sm'} onHide={props.handleClose} backdrop="static" className='modal_details'>
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

                            </div>
                            <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
                                <div className='addcommentname'>
                                    <div className='edit_delte'>

                                        <div className='taskcardinfo'>
                                         {allComments?.map((comm,index)=>
                                                <p>{comm?.comment}</p>
                                    )}
                                            <table>

                                                {/* {allComment?.map((comm, inc) =>
                                                    <tr key={inc}>
                                                        <td>{comm?.comment}</td>
                                                        <td>
                                                            <div class="action_icon">
                                                                <button type="button" onClick={() => EditData(comm)} ><i class="uil-edit-alt m-0 p-0"></i></button>
                                                                <button type="button" onClick={() => DeleteData(comm?._id)}><i class="mdi mdi-delete m-0 p-0"></i></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )} */}


                                            </table>

                                        </div>

                                    </div>

                                  
                                    <form onSubmit={handleSubmit(onSubmitComment)}>
                                        <input type="hidden" value={props.item?.taskInfo?._id} {...register('taskid')} />
                                        <input type="text" id="exampleForm.ControlTextarea1" class="form-control" placeholder='Add Comment' {...register('comment')} />
                                        <button type="submit" class="mybutton btn btn-info">Add</button>
                                    </form>
                                   
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
                              
                                {props.item?.startDate?moment(props.item?.taskInfo?.startDate).format('ll') : ''}
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
                           
                            {props.item?.assigneeInfo?.userName}
                            </li>
                    
                         
                            <li>
                            <label> Reporter:</label>
                           
                            {props.item.taskInfo?.reporterInfo?.role}
                            </li>
                             
                         
                            <li>
                            <label>Project Name:</label>
                            
                            {props.item.taskInfo?.projectName}
                            </li>
                            


                        </ul>
                    </div>
                </Modal.Body>
                
            </Modal>

        </>
    )
}


export default Taskdetail


