import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, getComment, gettaskId } from '../../../redux/task/action';
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

const TaskCard = ({ item, index, Column, closeModal }) => {
    console.log(item, 'item');
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const [editData, setEditData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDetailPage, setOpenDetailPage] = useState(false);
    const [detailData, setDetailData] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const store = useSelector((state) => state);

    const dispatch = useDispatch();
    const deleteData = (id) => {
        setDeleteId(id);
        setDeleteModal(true);
    };
    const handleYes = () => {
        dispatch(deleteTask({ taskId: deleteId }));
        setDeleteModal(false);
    };
    const handelUpdate = (data) => {
        setEditData(data);
        setOpenEditModal(true);
    };
    const closeupdatemodal = (val) => {
        closeModal('render');
        setOpenEditModal(false);
    };
    const handleDetailPage = (data) => {
        setOpenDetailPage(true);
        setDetailData(data);
        dispatch(getComment({ taskId: data?.id }));
        dispatch(gettaskId(data?.id));
    };
    const closeDetailPage = () => {
        setOpenDetailPage(false);
    };
    function toggle() {
        setIsOpen((isOpen) => !isOpen);
    }
    return (
        <>
            <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TaskInformation className="py-2 pe-0">
                            <div className="row w-100">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-6 d-flex align-items-center">
                                            <a
                                                href="#"
                                                onClick={() => {
                                                    handleDetailPage(item);
                                                }}>
                                                {item.summary}
                                            </a>
                                        </div>
                                        <div className="col-6 pe-0">
                                            <div className="action_icon position-relative">
                                                <div className="col-12 d-flex align-items-center justify-content-end">
                                                    <i
                                                        onClick={toggle}
                                                        class="fa fa-ellipsis-h cp bg-light p-2 rounded-3"
                                                        aria-hidden="true"></i>
                                                </div>
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
                                                                            class="uil-edit-alt m-0 p-0 me-2"
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
                                                                        <i class="mdi mdi-delete m-0 p-0 me-2"></i>
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 py-2">
                                    <p className="m-0 p-0">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: item?.description,
                                            }}></div>
                                    </p>
                                </div>
                                <div className="col-12">
                                    <div className="row mb-1">
                                        <div className="col-6 d-flex align-items-center">
                                            <div className="secondary-details d-flex align-items-center">
                                                <p className="m-0 p-0">
                                                    <span>
                                                        {item?.startDate ? moment(item?.startDate).format('ll') : ''}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-6 d-flex align-items-center justify-content-end pe-0">
                                            <div className=" d-flex">
                                                {/* <h5 className="m-0 p-0"> Assignee :</h5> */}
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="tooltip1">
                                                            {item?.assignees?.assigneeInfo?.firstName}{' '}
                                                            {item?.assignees?.assigneeInfo?.lastName}
                                                        </Tooltip>
                                                    }>
                                                    <div className="mt-1 cp">
                                                        <span
                                                            style={{
                                                                backgroundColor: '#605e5a',
                                                                borderRadius: '100%',
                                                                padding: '7px',
                                                                color: 'white',
                                                                fontWeight: '800',
                                                            }}>
                                                            {item?.assignees?.assigneeInfo?.firstName.charAt(0)}
                                                            {item?.assignees?.assigneeInfo?.lastName.charAt(0)}
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
                            </div>
                        </TaskInformation>
                    </div>
                )}
            </Draggable>
            {/* delete modal */}
            <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
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

            <UpdateTask modal={openEditModal} closeModal={closeupdatemodal} editData={editData} />
            <TaskDetailPage modal={openDetailPage} editData={detailData} closeModal={closeDetailPage} />
        </>
    );
};

export default TaskCard;

// <span className="priority">
// {item.Priority === 'High' ? (<RedArrow />) : item.Priority === 'Medium' ? (<YellowArrow />) : (<BlueArrow />)}
// </span>
// <div><CustomAvatar name={item.Assignee} isTable={false} size={16} /></div>
