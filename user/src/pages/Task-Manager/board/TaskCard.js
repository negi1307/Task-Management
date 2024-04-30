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
import { FaPlay } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";
import { addLoginTime, addLoginTimeStop } from '../../../redux/user/action'
import ToastHandle from '../../../constants/toaster/toaster';
import moment from 'moment-timezone';
import Taskdetail from './taskdetail';

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
const TaskCard = ({ item, index, closeModal, showTaskDetailMOdel, isInProgressColumn, onTaskStart }) => {
    console.log(item, 'pankajsingh')
    const store = useSelector(state => state)
    const [editData, setEditData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const getAllMilestoneData = store?.getSigleMileStone?.data?.response;
    const userId = store?.Auth?.user?.userId;
    const getComments = item?.comments;
    const historyData = store?.getHistoryData?.data?.response;
    const [elapsedTime, setElapsedTime] = useState(null);

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
    const [commentId, setCommentId] = useState('');
    const [showData, setShowData] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    // useEffect(() => {
    //     let timer;
    //     const isTaskInProgress = localStorage.getItem(`task_${item._id}_inProgress`);
    //     setIsPlay(isTaskInProgress === 'true');


    //     return () => clearInterval(timer);
    // }, [isPlay, item._id]);

    const handleCloseData = () => setShowData(false);
    const handleShowData = () => {
        setShowData(true)
    };

    useEffect(() => {
        if (isInProgressColumn && item.inProgressDate) {
            const inProgressDate = new Date(item.inProgressDate);
            const interval = setInterval(() => {
                const currentTime = new Date();
                const elapsedMilliseconds = currentTime - inProgressDate;
                const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
                setElapsedTime(formatTime(elapsedSeconds));
            }, 1000); // Update every second

            return () => clearInterval(interval);
        }
    }, [isInProgressColumn, item.inProgressDate]);



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


    return (
        <>
            <Draggable key={item?.id} draggableId={item?.id} index={index} style={{ width: '260px', }}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TaskInformation className=" mt-2 shadow-lg mx-auto rounded-2  " style={{ width: '250px', marginTop: '1px' }}>
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
                                            {/* <p onClick={startTime}>hbsd</p> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12" onClick={() => {
                                    showTaskDetailMOdel(item);
                                }}>
                                    <p className='m-0'>{item?.projects?.projectName}</p>

                                    <p className='m-0'>
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
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id="tooltip1">
                                                {priorityWithLetter}
                                            </Tooltip>
                                        }>
                                        <div className="cp"
                                            onClick={() => {
                                                showTaskDetailMOdel(item);
                                            }}>
                                            <span
                                            >
                                                {backgroundColorClass}
                                            </span>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                                <div className="col-12">
                                    <div className="row d-flex align-items-center">
                                        <div className='col-6 text-start fw-bold'>
                                            {item?.startDate ? moment(item?.startDate).format("DD/MM/YYYY") : ''}
                                        </div>
                                        <div className='col-6 text-end'>
                                            {isInProgressColumn && (
                                                <div className=" fw-bold">
                                                    {elapsedTime}
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>

                                {/* <div className="col-12">
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
                                            <div> */}

                                {/* <div>
                                                    {isPlaying ? (
                                                        <FaPause onClick={stopTime} />
                                                    ) : (
                                                        <FaPlay onClick={startTime} />
                                                    )}
                                                </div> */}
                                {/* <div className="cp d-flex align-items-center gap-1">
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
                                        </div> */}
                                {/* </div> */}
                                {/* </div> */}
                                {/* </div> */}

                            </div>

                        </TaskInformation>
                    </div >
                )}
            </Draggable >
            <UpdateTask modal={openEditModal} closeModal={closeupdatemodal} editData={editData} />
        </>
    );
};

// Function to format seconds into HH:MM:SS format
const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
};

// Function to pad single digit numbers with leading zeros
const pad = (num) => {
    return num < 10 ? '0' + num : num;
};
export default TaskCard;