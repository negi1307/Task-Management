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
    console.log(item, "itmmmem")
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
    let priorityWithLetter;
    let backgroundColorClass;

    switch (item?.priority) {
        case 'Critical':
            priorityWithLetter = 'Critical';
            backgroundColorClass = '🛑';
            break;
        case 'High':
            priorityWithLetter = 'High';
            backgroundColorClass = '🔴';
            break;
        case 'Medium':
            priorityWithLetter = 'Medium';
            backgroundColorClass = '🟡';
            break;
        case 'Low':
            priorityWithLetter = 'Low';
            backgroundColorClass = '🟢';
            break;
        default:
            priorityWithLetter = item?.priority;
            backgroundColorClass = '';
    }
    // console.log(item ,"item")
    return (
        <>
            <Draggable key={item?.taskInfo?._id} draggableId={item?.taskInfo?._id} index={index}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TaskInformation onClick={() => showTaskDetailMOdel(item)} className=" mt-2  pe-1 shadow-lg p-3 mx-auto    rounded-4 " style={{ width: '250px', height: '160px' }}>
                            <div className="row ">
                                <div className="col-9   m-0 ">
                                    <a className='fw-bold   m-0 fw-bold text-truncate rounded-pill'
                                        href="#"
                                       
                                        title={item?.summary}>
                                        {item?.summary ? item.summary.slice(0, 10).charAt(0).toUpperCase() + item.summary.slice(1, 10) : ''}
                                    </a>

                                </div>

                                <div className='col-12' title={item?.description}>{item?.description ? item.description.slice(0, 40) : ''}</div>
                                <div className='col-12 m-0 mb-1 '>
                                    <p className={`task-title text-dark p-0 m-0 `}>
                                        {backgroundColorClass}
                                    </p>
                                </div>
                                <div className="secondary-detail col-12 d-flex justify-content-between">
                                    <div>
                                        <span className='task-title text-dark p-0'>
                                            {item?.startDate ? moment(item?.startDate).format("DD/MM/YYYY") : ''}
                                        </span>
                                    </div>
                                    <div className='username_info'>
                                        <ul>

                                            <span style={{
                                                backgroundColor: '#605e5a',
                                                borderRadius: '50%',
                                                padding: '5px 6px',
                                                fontSize: '11px',
                                                color: 'white',
                                                fontWeight: '800',
                                            }}>
                                                {item?.assigneeInfo?.firstName.charAt(0)}{item?.assigneeInfo?.lastName.charAt(0)}
                                            </span>
                                        </ul>
                                    </div>
                                </div>

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
