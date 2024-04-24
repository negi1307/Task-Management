import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, getComment, gettaskId, getBugs, getSubTask } from '../../../redux/task/action';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import ToastHandle from '../../../constants/toaster/toaster';
import UpdateTask from './update';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// import CustomAvatar from '../TableComponents/CustomAvatar'
// import { ReactComponent as RedArrow } from '../../assets/icons/High.svg'
// import { ReactComponent as YellowArrow } from '../../assets/icons/Medium.svg'
// import { ReactComponent as BlueArrow } from '../../assets/icons/Low.svg'
import moment from 'moment';
import TaskDetailPage from './taskDetailPage';
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
    /* .priority{ */
    /* margin-right: 12px; */
    /* align-self: center;
    svg{
      width: 12px !important;
      height: 12px !important;
      margin-right: import Column from './../Boards/board/Column';
12px; */
    /* margin-top: 2px; */
    /* } */
    /* } */
`;

const TaskCard = ({ item, index, closeModal, columns, projectId, mileStoneId, sprintId }) => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const [editData, setEditData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDetailPage, setOpenDetailPage] = useState(false);
    const [detailData, setDetailData] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const store = useSelector((state) => state);
    // console.log(detailData,'pankaj')


    const dispatch = useDispatch();

    const closeOpenModal = () => {
        setOpenModal(false);
    };
    const deleteData = (id) => {
        setDeleteId(id);
        setDeleteModal(true);
        setOpenModal(false);
    };
    const handleYes = () => {
        dispatch(deleteTask({ taskId: deleteId }));
        setDeleteModal(false);

    };
    const handelUpdate = (data) => {
        setEditData(data);
        setOpenEditModal(true);
        setOpenModal(false);
    };
    const closeupdatemodal = (val) => {
        closeModal('render');
        setOpenEditModal(false);
    };
    const handleDetailPage = (data) => {
        setOpenDetailPage(true);
        setDetailData(data);
        dispatch(getComment({ taskId: data?.id }));
        dispatch(getBugs({ taskId: data?.id, type: "Bug" }));
        dispatch(getSubTask({ taskId: data?.id, type: "SubTask" }));
        dispatch(gettaskId(data?.id));
    };
    const closeDetailPage = () => {
        setOpenDetailPage(false);
    };
    function toggle() {
        setOpenModal(true);
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
            <Draggable key={item.id} draggableId={item?.id} index={index} style={{ width: '260px', }}>
                {(provided) => (
                    <div ref={provided?.innerRef} {...provided?.draggableProps} {...provided?.dragHandleProps} >
                        <TaskInformation className="mt-2 shadow-lg mx-auto rounded-2 " style={{ width: '250px', marginTop: '1px' }}>
                            <div className="row py-2">
                                <div className="col-12 pb-1">
                                    <div className="row d-flex align-items-center">
                                        <div className="col-9 m-0 ">
                                            {/* <span className={`task-title text-dark p-0 m-0 `}>
                                                {backgroundColorClass}
                                            </span> */}
                                            <a className='fw-bold text-truncate'
                                                href="#"
                                                onClick={() => {
                                                    handleDetailPage(item);
                                                }}
                                                title={item?.summary}>
                                                {item?.summary ? item.summary.slice(0, 10).charAt(0).toUpperCase() + item.summary.slice(1, 10) : ''}
                                            </a>

                                        </div>
                                        <div className="col-3 text-center">
                                            <div className="dropdown">
                                                <button className="border-0 bg-white icon_buttons" type="button" id="dropdownMenuButton1"
                                                    data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                                    <i className="bi bi-three-dots-vertical fs-5 fw-bold text-dark"></i>
                                                </button>
                                                <ul className="dropdown-menu py-0 dropdown-style dropdown-menu-end ps-1 dropdown-menu-lg-start bg-white border-0" aria-labelledby="dropdownMenuButton1">
                                                    <div className='d-flex w-100'>
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
                                        {/* <div className="col-6 pe-0">
                                            <div className="action_icon position-relative">
                                                <div className="col-12 d-flex align-items-center justify-content-end">
                                                    <i
                                                        onClick={toggle}
                                                        className="fa fa-ellipsis-h cp bg-light p-2 rounded-3"
                                                        aria-hidden="true"></i>
                                                </div>
                                                <Modal
                                                    show={openModal}
                                                    onHide={closeOpenModal}
                                                    className="bg_trans_modal">
                                                    <Modal.Body className="p-0">
                                                        <div className="row position-absolute add_position ">
                                                            <div className="col-4 border p-2 bg-white add_position_modal_edit">
                                                                <div className="row">
                                                                    <div className="col-12 pb-2 d-flex align-items-center justify-content-start">
                                                                        <h4 className="m-0 p-0">Action</h4>
                                                                    </div>
                                                                    <div className="col-12 pb-2 d-flex align-items-center justify-content-start">
                                                                        <button
                                                                            type="button "
                                                                            className="m-0 p-0 border-0 bg-transparent">
                                                                            <i
                                                                                className="uil-edit-alt m-0 p-0 me-2"
                                                                                onClick={() => {
                                                                                    handelUpdate(item);
                                                                                }}></i>
                                                                            Edit
                                                                        </button>
                                                                    </div>
                                                                    <div className="col-12 d-flex align-items-center justify-content-start">
                                                                        <button
                                                                            type="button"
                                                                            className="m-0 p-0 border-0 bg-transparent"
                                                                            onClick={() => deleteData(item?.id)}>
                                                                            <i className="mdi mdi-delete m-0 p-0 me-2"></i>
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Modal.Body>
                                                </Modal>
                                                {isOpen && (
                                                    <div className="row position-absolute add_position ">
                                                        <div className="col-12 border p-2 bg-white">
                                                            <div className="row">
                                                                <div className="col-12 pb-2 d-flex align-items-center justify-content-start">
                                                                    <h4 className="m-0 p-0">Action</h4>
                                                                </div>
                                                                <div className="col-12 pb-2 d-flex align-items-center justify-content-start">
                                                                    <button type="button " className="m-0 p-0">
                                                                        <i
                                                                            className="uil-edit-alt m-0 p-0 me-2"
                                                                            onClick={() => {
                                                                                handelUpdate(item);
                                                                            }}></i>
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                                <div className="col-12 d-flex align-items-center justify-content-start">
                                                                    <button
                                                                        type="button"
                                                                        className="m-0 p-0"
                                                                        onClick={() => deleteData(item?.id)}>
                                                                        <i className="mdi mdi-delete m-0 p-0 me-2"></i>
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-12" onClick={() => {
                                    handleDetailPage(item);
                                }}>
                                    <p>
                                        <div className='task-title text-dark p-0' title={item?.description}>
                                            {item?.description ?
                                                (item.description.length > 25 ? item.description.slice(0, 25) + '...' : item.description)
                                                : ''}
                                        </div>
                                    </p>
                                </div>

                                <div className='col-12 col-lg-2 px-2 py-0'
                                    onClick={() => {
                                        handleDetailPage(item);
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
                                                handleDetailPage(item);
                                            }}>
                                            <span
                                            >
                                                {backgroundColorClass}

                                            </span>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                                <div className="col-12"
                                    onClick={() => {
                                        handleDetailPage(item);
                                    }}>
                                    <div className="row d-flex  align-items-center">
                                        <div className="col-9">
                                            <div className="secondary-details ">
                                                <p className="m-0 p-0">
                                                    <span className='task-title text-dark p-0'>
                                                        {item?.startDate ? moment(item?.startDate).format("DD/MM/YYYY") : ''}
                                                    </span>
                                                </p>

                                            </div>
                                        </div>

                                        {/* <div className="col-3 text-end">
                                            <div className="secondary-details d-flex align-items-end justify-content-end">
                                                <p className=" mt-1 m-0 ">
                                                    <span className='task-title text-dark text-end p-0'>
                                                        <i className={`bi fs-3 mt-2 ${isPlaying ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`}
                                                            title={isPlaying ? 'Pause' : 'Play'}
                                                            onClick={handleClick} style={{ cursor: 'pointer' }} />
                                                    </span>
                                                </p>
                                            </div>
                                        </div> */}
                                        <div className="col-3 text-center ">
                                            <div className=" d-flex text-end">
                                                {/* <h5 className="m-0 p-0"> Assignee :</h5> */}
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="tooltip1">
                                                            {item?.assigneeInfo?.firstName}
                                                            {item?.assigneeInfo?.lastName}
                                                        </Tooltip>
                                                    }>
                                                    <div className="cp"
                                                        onClick={() => {
                                                            handleDetailPage(item);
                                                        }}>
                                                        <span
                                                            style={{
                                                                backgroundColor: '#605e5a',
                                                                borderRadius: '50%',
                                                                padding: '5px 6px',
                                                                fontSize: '11px',
                                                                color: 'white',
                                                                fontWeight: '800',
                                                            }} title={item?.assignees?.assigneeInfo?.firstName}>
                                                            {item?.assigneeInfo?.firstName.charAt(0)}
                                                            {item?.assigneeInfo?.lastName.charAt(0)}
                                                        </span>
                                                    </div>
                                                </OverlayTrigger>
                                                {/* <p className="ms-2 p-0">
                                                    {item?.assignees?.assigneeInfo?.firstName}{' '}
                                                    {item?.assignees?.assigneeInfo?.lastName}
                                                </p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </TaskInformation >
                    </div >
                )}
            </Draggable >
            {/* delete modal */}
            <Modal Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
                <Modal.Body>Are you sure you want to delete this Task ?</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setDeleteModal(false);
                        }}>
                        No
                    </Button>
                    <Button className=" web_button " variant="primary" onClick={() => handleYes()}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            <UpdateTask modal={openEditModal} closeModal={closeupdatemodal} editData={editData} columns={columns} projectId={projectId} mileStoneId={mileStoneId} sprintId={sprintId} />
            <TaskDetailPage modal={openDetailPage} editData={detailData} closeModal={closeDetailPage} taskId={item._id} />
        </>
    );
};

export default TaskCard;

// <span className="priority">
// {item.Priority === 'High' ? (<RedArrow />) : item.Priority === 'Medium' ? (<YellowArrow />) : (<BlueArrow />)}
// </span>
// <div><CustomAvatar name={item.Assignee} isTable={false} size={16} /></div>