import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask } from '../../../redux/task/action';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import ToastHandle from '../../../constants/toaster/toaster';
import UpdateTask from './update';
// import CustomAvatar from '../TableComponents/CustomAvatar'
// import { ReactComponent as RedArrow } from '../../assets/icons/High.svg'
// import { ReactComponent as YellowArrow } from '../../assets/icons/Medium.svg'
// import { ReactComponent as BlueArrow } from '../../assets/icons/Low.svg'
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
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const [editData, setEditData] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const store = useSelector((state) => state);
    const deletehandel = store?.deleteTask;
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
        closeModal();
        setOpenEditModal(false);
    };
    
    useEffect(() => {
        if (deletehandel?.data?.status == 200) {
            ToastHandle('success', deletehandel?.data?.message);
            setDeleteModal(false);
            closeModal('render');
        } else if (deletehandel?.data?.status == 400) {
            ToastHandle('error', deletehandel?.data?.message);
        } else if (deletehandel?.data?.status == 500) {
            ToastHandle('error', deletehandel?.data?.message);
        }
    }, [deletehandel]);

    return (
        <>
            <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TaskInformation>
                            <div className="action_icon">
                                <button type="button">
                                    <i
                                        class="uil-edit-alt m-0 p-0"
                                        onClick={() => {
                                            handelUpdate(item);
                                        }}></i>
                                </button>
                                <button type="button" onClick={() => deleteData(item.id)}>
                                    <i class="mdi mdi-delete m-0 p-0"></i>
                                </button>
                            </div>

                            <p>{item.summary}</p>
                            <p>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: item?.description,
                                    }}></div>
                            </p>
                            <div className="secondary-details">
                                <p>
                                    <span>{item?.createdAt ? moment(item?.createdAt).format('ll') : ''}</span>
                                </p>
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
        </>
    );
};

export default TaskCard;

// <span className="priority">
// {item.Priority === 'High' ? (<RedArrow />) : item.Priority === 'Medium' ? (<YellowArrow />) : (<BlueArrow />)}
// </span>
// <div><CustomAvatar name={item.Assignee} isTable={false} size={16} /></div>
