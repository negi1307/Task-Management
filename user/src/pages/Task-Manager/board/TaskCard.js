import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import { deleteTask, getAllTask } from '../../../redux/task/action';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { useState, useEffect, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import UpdateTask from '../board/update';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { addComment, getComment, updateComment, deleteComment, getCommentId } from '../../../redux/addcomment/actions';
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

const TaskCard = ({ item, index, closeModal, showTaskDetailMOdel }) => {
    console.log("itmmmem")
    const store = useSelector(state => state)
    const [editData, setEditData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const getAllMilestoneData = store?.getSigleMileStone?.data?.response;
    const userId = store?.Auth?.user?.userId;
    const getComments = item?.comments;
    const historyData = store?.getHistoryData?.data?.response;

    const handelUpdate = (data) => {
        setEditData(data);
        setOpenEditModal(true);
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


    const [commentId, setCommentId] = useState('');

    const [showData, setShowData] = useState(false);

    const handleCloseData = () => setShowData(false);
    const handleShowData = () => {
        setShowData(true)
    };


    const EditData = (item) => {
        setCommentId(item?._id);
        setValue("comment", item?.comment);
    }
    const DeleteData = (id) => {
        dispatch(deleteComment({ commentId: id }));
    }
    // console.log(item ,"item")
    return (
        <>
            <Draggable key={item?.taskInfo?._id} draggableId={item?.taskInfo?._id} index={index}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TaskInformation onClick={() => showTaskDetailMOdel(item)}>
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
                            <div >

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
                            <div className='username_info'>
                                <ul>
                                    <li>
                                        {item?.reporterInfo?.role.charAt(0)}
                                    </li>
                                    <li>
                                        {item?.assigneeInfo?.firstName.charAt(0)}{item?.assigneeInfo?.lastName.charAt(0)}
                                    </li>
                                </ul>

                            </div>






                        </TaskInformation>
                    </div>
                )}
            </Draggable>



            <UpdateTask modal={openEditModal} closeModal={closeupdatemodal} editData={editData} />
        </>
    );
};

export default TaskCard;

// <span className="priority">
// {item.Priority === 'High' ? (<RedArrow />) : item.Priority === 'Medium' ? (<YellowArrow />) : (<BlueArrow />)}
// </span>
// <div><CustomAvatar name={item.Assignee} isTable={false} size={16} /></div>
