import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import { deleteTask, getAllTask } from '../../../redux/task/action';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import UpdateTask from '../board/update';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { addComment, getComment, updateComment, deleteComment } from '../../../redux/addcomment/actions';
import { getsingleMileStone } from '../../../redux/milestone/action';

// import CustomAvatar from '../TableComponents/CustomAvatar'

import moment from 'moment';

const TaskInformation = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 15px;
    min-height: 106px;
    border-radius: 5px;
    max-width: 311px;
    /* background: ${({ isDragging }) => (isDragging ? 'rgba(255, 59, 59, 0.15)' : 'white')}; */
    background: white;
    margin-top: 15px;

    .secondary-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        font-size: 12px;
        font-weight: 400px;
        color: #7d7d7d;
    }
`;

const TaskCard = ({ item, index, closeModal }) => {
    const store = useSelector(state => state)
    console.log("items data", item)
    const [editData, setEditData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const getAllMilestoneData = store?.getSigleMileStone?.data?.response;
    const userId = store?.Auth?.user?.userId;
    const getComments = item?.comments;
    const historyData = store?.getHistoryData?.data?.response;
    console.log("history data", historyData)
    const handelUpdate = (data) => {
        setEditData(data);
        setOpenEditModal(true);

        //dispatch(getsingleMileStone({id:editData?.projectInfo?._id,status:1}))
    };
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();



    const closeupdatemodal = (val) => {
        closeModal('render');
        setOpenEditModal(false);
    };
    const dispatch = useDispatch();


    const deleteData = (id) => {
        dispatch(deleteTask({ taskId: id }));
        dispatch(getAllTask());
    };
    const [allComment, setComment] = useState([])

    useEffect(() => {
        for (let i = 0; i < getComments?.length; i++) {
            setComment(getComments[i]);
        }

    }, [])
    console.log("allCommenttttttttttttttttttttt", allComment)
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => setShow(true);

    const [showData, setShowData] = useState(false);

    const handleCloseData = () => setShowData(false);
    const handleShowData = () => {
        setShowData(true)

    };
    const [getCommentId, setCommentId] = useState('');
    const onSubmit = (e) => {

        if (getCommentId == "") {
            const commentData = {
                userId: userId,
                taskId: e.taskid,
                comment: e.comment
            }
            dispatch(addComment(commentData))
        }
        else {
            const body = {
                commentId: getCommentId,
                comment: e.comment
            }

            dispatch(updateComment(body))

        }
    }

    const EditData = (item) => {
        setCommentId(item?._id);
        setValue("comment", item?.comment);
    }
    const DeleteData = (id) => {

        dispatch(deleteComment({ commentId: id }));
    }
    return (
        <>
            <Draggable key={item?.taskInfo?._id} draggableId={item?.taskInfo?._id} index={index}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TaskInformation>
                            {/* <div className="action_icon">
                                <button
                                    type="button"
                                    onClick={() => {
                                        handelUpdate(item);
                                    }}>
                                    <i class="uil-edit-alt m-0 p-0"></i>
                                </button>
                                <button type="button" onClick={() => deleteData(item.id)}>
                                    <i class="mdi mdi-delete m-0 p-0"></i>
                                </button>
                            </div> */}
                            <div onClick={handleShow}>
                                <p>{item?.taskInfo?.summary}</p>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: item?.taskInfo?.description,
                                    }}></div>

                                <div className="secondary-details">
                                    <p>
                                        <span>{item?.taskInfo?.startDate ? moment(item?.taskInfo?.startDate).format('ll') : ''}</span>
                                    </p>
                                </div>
                            </div>
                            <p>Assignee: &nbsp; {item?.assigneeInfo?.userName.charAt(0)}</p>

                        </TaskInformation>
                    </div>
                )}
            </Draggable>

            <Modal show={show} onHide={handleClose} backdrop="static" className='modal_details'>
                <Modal.Header closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className='cardinfo'>
                    

                    
                    <div className='comments'>
                        <h4>Activity</h4>



                        {/* <div className="history">
                            history:
                            {historyData?.map((datainfo,index)=>
                                <p>{datainfo.currentStatus}</p>
                            )}
                        
                        </div> */}
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
                                            <table>

                                                {allComment?.map((comm, inc) =>
                                                    <tr key={inc}>
                                                        <td>{comm?.comment}</td>
                                                        <td>
                                                            <div class="action_icon">
                                                                <button type="button" onClick={() => EditData(comm)} ><i class="uil-edit-alt m-0 p-0"></i></button>
                                                                <button type="button" onClick={() => DeleteData(comm?._id)}><i class="mdi mdi-delete m-0 p-0"></i></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}


                                            </table>

                                        </div>

                                    </div>


                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <input type="hidden" value={item.id} {...register('taskid')} />
                                        <input type="text" id="exampleForm.ControlTextarea1" class="form-control" placeholder='Add Comment' {...register('comment')} />
                                      <button type="submit" class="mybutton btn btn-info">Add</button>
                                    </form>

                                </div>
                            </div>
                            <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">
                            
                                <div className="history">
                                <div className='history_data_info'>
                                {historyData?.map((datainfo, index) =>
                                        <h4>{datainfo.currentStatus}</h4>
                                    )}

                                </div>
                                   <div className='history_data_info'>
                                   {historyData?.map((datainfo, index) =>
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
                                {item?.taskInfo?.summary}
                            </li>
                            

                            
                          
                            <li>
                            <label>Description:</label>
                                
                                <div className='description'
                                    dangerouslySetInnerHTML={{
                                        __html: item?.taskInfo?.description,
                                    }}></div>
                            </li>
                           
                          
                            <li>
                            <label>Start Date:</label>
                              
                                {item?.startDate ? moment(item?.taskInfo?.startDate).format('ll') : ''}
                            </li>
                           
                            
                            <li>
                            <label> Priority:</label>
                               
                                {item.taskInfo?.priority ? 'medium' : ''}
                            </li>
                          
                            
                            <li>
                            <label>End Date: </label>
                                
                                {item?.taskInfo?.dueDate ? moment(item?.dueDate).format('ll') : ''}
                            </li>
                 
                           
                            <li>
                            <label> Assignee Name:</label>
                           
                            {item?.assigneeInfo?.userName}
                            </li>
                    
                         
                            <li>
                            <label> Reporter:</label>
                           
                            {item.taskInfo?.reporterInfo?.role}
                            </li>
                             
                         
                            <li>
                            <label>Project Name:</label>
                            
                            {item.taskInfo?.projectName}
                            </li>
                            


                        </ul>
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
            </Modal>

            <Modal show={showData} onHide={handleCloseData}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Task Card</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onClick={handleSubmit(onSubmit)}>
                        <div class="row mb-2">
                            <div class="col-lg-6">
                                <label class="form-label" for="exampleForm.ControlTextarea1">
                                    Project
                                    <span class="text-danger">*</span>:
                                </label>
                                <select class="form-select" id="exampleForm.ControlInput1" {...register('project')}>
                                    <option value="">--Select--</option>
                                </select>
                            </div>

                            <div class="col-lg-6">
                                <label class="form-label" for="exampleForm.ControlTextarea1">
                                    Milestone
                                    <span class="text-danger">*</span>:
                                </label>
                                <select class="form-select" id="exampleForm.ControlInput1" {...register('Milestone')}>
                                    <option value="">--Select--</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="mb-2">
                                    <label class="form-label" for="exampleForm.ControlTextarea1">
                                        Summary
                                        <span class="text-danger">*</span>:
                                    </label>
                                    <input
                                        placeholder="Please Enter Summary"
                                        type="text"
                                        id="exampleForm.ControlTextarea1"
                                        class="form-control"
                                        name="Summary"
                                    />
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <label class="form-label" for="exampleForm.ControlTextarea1">
                                    Sprint
                                    <span class="text-danger">*</span>:
                                </label>
                                <select class="form-select" id="exampleForm.ControlInput1" {...register('Milestone')}>
                                    <option value="">--Select--</option>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-12">
                                <div class="mb-2">
                                    <label class="form-label" for="exampleForm.ControlInput1">
                                        Description
                                        <span class="text-danger">*</span>:
                                    </label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data="<p>Write Somthing...</p>"
                                        onReady={(editor) => {
                                            // You can store the "editor" and use when it is needed.
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                        }}
                                        onBlur={(event, editor) => { }}
                                        onFocus={(event, editor) => { }}
                                    />
                                    {/* <input placeholder="Please Enter Description" type="text" id="exampleForm.ControlInput1" class="form-control" name="Description" /> */}
                                </div>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-lg-6">
                                <label class="form-label" for="exampleForm.ControlTextarea1">
                                    Assignee
                                    <span class="text-danger">*</span>:
                                </label>
                                <select class="form-select" id="exampleForm.ControlInput1" {...register('Assignee')}>
                                    <option value="">--Select--</option>
                                </select>
                            </div>

                            <div class="col-lg-6">
                                <label class="form-label" for="exampleForm.ControlTextarea1">
                                    Reporter
                                    <span class="text-danger">*</span>:
                                </label>
                                <select class="form-select" id="exampleForm.ControlInput1" {...register('Report')}>
                                    <option value="">--Select--</option>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-6">
                                <div class="mb-2">
                                    <label class="form-label" for="exampleForm.ControlTextarea1">
                                        Start Date<span class="text-danger">*</span>:
                                    </label>
                                    <input
                                        placeholder="Please start Date "
                                        type="date"
                                        id="exampleForm.ControlTextarea1"
                                        class="form-control"
                                        name="start_date"
                                    />
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-2">
                                    <label class="form-label" for="exampleForm.ControlTextarea1">
                                        End Date<span class="text-danger">*</span>:
                                    </label>
                                    <input
                                        placeholder="Please end Date"
                                        type="date"
                                        id="exampleForm.ControlTextarea1"
                                        class="form-control"
                                        name="last_date"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-6">
                                <div class="mb-1">
                                    <label class="form-label" for="exampleForm.ControlInput1">
                                        Priority <span class="text-danger">*</span>:
                                    </label>
                                    <select
                                        name="priority"
                                        class="form-select"
                                        id="exampleForm.ControlInput1"
                                        disabled="">
                                        <option>Medium</option>
                                        <option value="1">High</option>
                                        <option value="2">Medium</option>
                                        <option value="3">Low</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-2">
                                    <label class="form-label" for="exampleForm.ControlTextarea1">
                                        Status<span class="text-danger">*</span>:
                                    </label>
                                    <input
                                        disabled=""
                                        name="status"
                                        placeholder="Live"
                                        type="text"
                                        id="exampleForm.ControlTextarea1"
                                        class="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="update_btn">
                            <button type="submit" className="btn btn-info">
                                update
                            </button>
                        </div>
                    </form>

                </Modal.Body>


                {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseData}>
            Close
          </Button>
          <Button variant="primary" onClick={handleShowData}>
            Save Changes
          </Button>
        </Modal.Footer> */}
            </Modal>
            <UpdateTask modal={openEditModal} closeModal={closeupdatemodal} editData={editData} />
        </>
    );
};

export default TaskCard;

// <span className="priority">
// {item.Priority === 'High' ? (<RedArrow />) : item.Priority === 'Medium' ? (<YellowArrow />) : (<BlueArrow />)}
// </span>
// <div><CustomAvatar name={item.Assignee} isTable={false} size={16} /></div>
