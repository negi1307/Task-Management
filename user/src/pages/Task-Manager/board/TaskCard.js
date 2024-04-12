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
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCirclePlay } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";
import { addLoginTime, addLoginTimeStop } from '../../../redux/user/action'
import ToastHandle from '../../../constants/toaster/toaster';
import moment from 'moment-timezone';

const TaskInformation = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 15px;
    min-height: 106px;
    border-radius: 5px;
    max-width: 311px !important;
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
const TaskCard = ({ item, index, closeModal, showTaskDetailMOdel, isInProgressColumn }) => {
    const store = useSelector(state => state)
    const [editData, setEditData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const getAllMilestoneData = store?.getSigleMileStone?.data?.response;
    const userId = store?.Auth?.user?.userId;
    const getComments = item?.comments;
    const historyData = store?.getHistoryData?.data?.response;
    const handelUpdate = (data) => {
        setEditData(data);
        setOpenEditModal(true);
    };
    const indianDateTime = moment.tz(new Date(), 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
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
    const [timeElapsed, setTimeElapsed] = useState(0);
    useEffect(() => {
        let timer;
        const isTaskInProgress = localStorage.getItem(`task_${item._id}_inProgress`);
        setIsPlay(isTaskInProgress === 'true'); // Update isPlay state based on local storage value


        return () => clearInterval(timer);
    }, [isPlay, item._id]);

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
            backgroundColorClass = '🔴';
            break;
        case 'High':
            priorityWithLetter = 'High';
            backgroundColorClass = '🟠';
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

    const startTime = (e) => {
        dispatch(addLoginTime({ taskId: item?._id }))
        setIsPlay(true);
        localStorage.setItem(`task_${item?._id}_inProgress`, 'true');
        // console.log('========start', new Date())
    }
    const stopTime = (e) => {
        let stoptask = item?._id;
        dispatch(addLoginTimeStop(stoptask));
        setIsPlay(false);
        localStorage.removeItem(`task_${item?._id}_inProgress`);
        console.log('=======endtime', new Date())

    }

    const formatTime = (milliseconds) => {
        const duration = moment.duration(milliseconds, 'milliseconds');
        const hours = duration.hours().toString().padStart(2, '0');
        const minutes = duration.minutes().toString().padStart(2, '0');
        const seconds = duration.seconds().toString().padStart(2, '0');
        const millis = duration.milliseconds().toString().padStart(3, '0');
        return `${hours}:${minutes}:${seconds}.${millis}`;
    };

    return (
        <>
            <Draggable key={item?.taskInfo?._id} draggableId={item?.taskInfo?._id} index={index} style={{ width: '260px' }}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TaskInformation className=" mt-2 shadow-lg mx-auto rounded-4  " style={{ width: '250px', marginTop: '1px' }}>
                            <div className="row py-2">
                                <div className="col-12 pb-1">
                                    <div className="row d-flex align-items-center">
                                        <div className="col-9 m-0">
                                            <p className='fw-bold mb-0 text-primary text-truncate'
                                                onClick={() => {
                                                    showTaskDetailMOdel(item)
                                                }}
                                                title={item?.summary}>
                                                {item?.summary ? item.summary.slice(0, 10).charAt(0).toUpperCase() + item.summary.slice(1, 10) : ''}
                                            </p>

                                        </div>
                                        <div className="col-3 text-center">
                                            <div className="dropdown">
                                                <button className="border-0 bg-white icon_buttons" type="button" id="dropdownMenuButton1"
                                                    data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                                    <BsThreeDotsVertical />
                                                </button>
                                                <ul className="dropdown-menu py-0 dropdown-style dropdown-menu-end ps-1 dropdown-menu-lg-start border-0" aria-labelledby="dropdownMenuButton1">
                                                    <div className='d-flex w-50'>
                                                        <li className='w-50 ps-2 border-dark border-end border-1 py-0'>
                                                            <button className="dropdown-item m-0 p-0 border-0 bg-transparent">
                                                                <i className="uil-edit-alt m-0 p-0  text-dark del_edit" onClick={() => { handelUpdate(item); }}></i>
                                                            </button>
                                                        </li>
                                                        <li className='w-50 ps-2'>

                                                            <button className="dropdown-item m-0 p-0 border-0 bg-transparent" onClick={() => deleteData(item?.id)}>
                                                                <i className="mdi mdi-delete text-dark m-0 p-0  del_edit"></i>
                                                            </button>
                                                        </li>
                                                    </div>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12" onClick={() => {
                                    showTaskDetailMOdel(item);
                                }}>
                                    <p>
                                        <div className='task-title text-dark p-0' title={item?.description}>
                                            {item?.description ?
                                                (item.description.length > 25 ? item.description.slice(0, 25) + '...' : item.description)
                                                : ''}
                                        </div>
                                    </p>
                                </div>
                                <div className='col-12 d-flex justify-content-between pe-2'
                                    onClick={() => {
                                        showTaskDetailMOdel(item);
                                    }}>
                                    <div>
                                        {backgroundColorClass}
                                    </div>


                                </div>
                                <div className="col-12">
                                    <div className="row d-flex  align-items-center">
                                        <div className="col-8">
                                            <div className="secondary-details ">
                                                <p className="m-0 p-0">
                                                    <span className='task-title text-dark p-0'>
                                                        {item?.startDate ? moment(item?.startDate).format("DD/MM/YYYY") : ''}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-4 text-end ">
                                            <div className=" d-flex">
                                                <div className="cp d-flex align-items-center gap-1">
                                                    {isInProgressColumn && (
                                                        <span id='timestart'>
                                                            {isPlay ? (
                                                                <FaCirclePause onClick={stopTime} style={{ fontSize: '21px' }} />
                                                            ) : (
                                                                <FaCirclePlay onClick={startTime} style={{ fontSize: '21px' }} />
                                                            )}
                                                        </span>
                                                    )}
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id="tooltip1">
                                                                {item?.assigneeInfo?.firstName}{' '}
                                                                {item?.assigneeInfo?.lastName}
                                                            </Tooltip>
                                                        }>
                                                        <span
                                                            style={{
                                                                backgroundColor: '#605e5a',
                                                                borderRadius: '50%',
                                                                padding: '5px 6px',
                                                                fontSize: '11px',
                                                                color: 'white',
                                                                fontWeight: '800',
                                                            }}>
                                                            {item?.assigneeInfo?.firstName.charAt(0)}
                                                            {item?.assigneeInfo?.lastName.charAt(0)}
                                                        </span>
                                                    </OverlayTrigger>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </TaskInformation>
                    </div >
                )}
            </Draggable >
            <UpdateTask modal={openEditModal} closeModal={closeupdatemodal} editData={editData} />
        </>
    );
};
export default TaskCard;