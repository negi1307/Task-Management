import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Row, Col, Breadcrumb, Badge } from 'react-bootstrap';

import { columnsFromBackend } from './data';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { getAllTask, updateTask } from '../../../redux/actions';
import { v4 as uuidv4 } from 'uuid';
import MainLoader from '../../../constants/Loader/loader';
import RightBar from '../../../layouts/AddRightSideBar';
import { updateTaskStatus } from '../../../../src/redux/task/action';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getsingleMileStone } from '../../../redux/milestone/action';
import { getAllMilstoneSprints } from '../../../redux/sprint/action';
import { getAllProjects } from '../../../redux/projects/action';
import { getHistory } from '../../../redux/addcomment/actions';
import { getTaskStatusCount } from '../../../redux/Summary/action';
import { addComment, getComment, deleteComment, getCommentId } from '../../../redux/addcomment/actions';
import Taskdetail from './taskdetail';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import ToastHandle from '../../../constants/toaster/toaster';
import { listProjectAssignee } from '../../../redux/task/action';

const Container = styled.div`
    display: flex;
`;

const TaskList = styled.div`
    min-height: 100px;
    display: flex;
    flex-direction: column;
    background: #f3f3f3;
    min-width: 341px;
    border-radius: 5px;
    padding: 15px 15px;
    margin-right: 45px;
`;

const TaskColumnStyles = styled.div`
    margin: 8px;
    display: flex;
    width: 100%;
    min-height: 80vh;
`;

const Title = styled.span`
    color: #10957d;
    background: rgba(16, 149, 125, 0.15);
    padding: 2px 10px;
    border-radius: 5px;
    align-self: flex-start;
`;


const Boards = (props) => {
    const { projectId, milestoneId, sprintId } = useParams();
    console.log( sprintId,'ssssssssssssssssssssssssssssssssssssss')

    const dispatch = useDispatch();
    const [render, setRender] = useState(false);
    const store = useSelector((state) => state);
    const { register, setValue } = useForm();
    const taskId = store?.getTaskId?.data;
    console.log('store', store);
    const taskStatusCount = store?.getTaskStatusCount?.data?.response;
    const taskStatusCountdata = store?.getAllTaskReducer?.data;
    const updateComment = store?.updateComment;
    const successHandle = store?.getAllTaskReducer;
    const statushandle = store?.updateTaskStatus;
    const assigneeName = store?.getAllAssigneeName?.data?.response;

    useEffect(() => {
        let body = {
            flag: 1,
            status: true,
            searchString: '',
            projectId: projectId,
            milestoneId: milestoneId,
            sprintId: sprintId,
            skip: 1,
            activeStatus: true,
        };

        dispatch(getAllTask(body));
    }, []);

    useEffect(() => {
        dispatch(listProjectAssignee({ projectId: projectId, milestoneId: milestoneId, sprintId: sprintId }));
        dispatch(getTaskStatusCount());
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [columns, setColumns] = useState(columnsFromBackend);

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems,
                },
            });
            if (destColumn.title == 'In Progress') {
                let body = {
                    taskId: result?.draggableId,
                    status: 2,
                };
                dispatch(updateTaskStatus(body));
            } else if (destColumn.title == 'Hold') {
                let body = {
                    taskId: result?.draggableId,
                    status: 3,
                };
                dispatch(updateTaskStatus(body));
            } else if (destColumn.title == 'Done') {
                let body = {
                    taskId: result?.draggableId,
                    status: 4,
                };
                dispatch(updateTaskStatus(body));
            } else if (destColumn.title == 'To-do') {
                let body = {
                    taskId: result?.draggableId,
                    status: 1,
                };
                dispatch(updateTaskStatus(body));
            }
            setTimeout(() => {
                let body = {
                    flag: 1,
                    status: true,
                    searchString: '',
                    projectId: projectId,
                    milestoneId: milestoneId,
                    sprintId: sprintId,
                    skip: 1,
                    activeStatus: true,
                };
                dispatch(getAllTask(body));
            }, 30);
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems,
                },
            });
        }
    };



    useEffect(() => {
        if (successHandle?.data?.status == 200) {
            setColumns({
                [uuidv4()]: {
                    title: 'To-do',
                    items: successHandle?.data?.response?.Todo?.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                },
                [uuidv4()]: {
                    title: 'In Progress',
                    items: successHandle?.data?.response?.Inprogress?.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                },

                [uuidv4()]: {
                    title: 'Hold',
                    items: successHandle?.data?.response?.Hold?.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                },
                [uuidv4()]: {
                    title: 'Done',
                    items: successHandle?.data?.response?.Done?.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                },
            });
        }
    }, [successHandle]);

    // const [body,setBody] = useState({});

    const [commentdata, setCommentData] = useState([]);
    const [showTaskModel, setshowTaskModel] = useState(false);
    const historyData = store?.getHistoryData?.data?.response;
    const userId = store?.Auth?.user?.userId;

    const selectUserTask = store?.getAllTaskReducer?.data?.done?.tasks?.taskInfo;

    console.log('selectUserTask', selectUserTask);

    const showTaskDetailMOdel = (item) => {
        setshowTaskModel(true);
        setCommentData(item);
        dispatch(getComment(item?.taskId));
        dispatch(getHistory(item?.taskId));
    };

    const closeTaskDetailMOdel = () => {
        setshowTaskModel(false);
    };
    useEffect(() => {
        if (updateComment?.data?.status == 200) {
            ToastHandle('success', updateComment?.data?.message);
            dispatch(getComment({ taskId: commentdata?.taskInfo?._id }));
        } else if (updateComment?.data?.status == 400) {
            ToastHandle('error', updateComment?.data?.message);
        } else if (updateComment?.data?.status == 500) {
            ToastHandle('error', updateComment?.data?.message);
        }
    }, [updateComment]);
    const callAlltaskData = () => {
        let body = {
            flag: 1,
            status: true,
            searchString: '',
            projectId: projectId,
            milestoneId: milestoneId,
            sprintId: sprintId,
            skip: 1,
            activeStatus: '',
        };
        dispatch(getAllTask(body));
    };
    const closeModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
    };
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const selectTask = (e) => {
        if (e.target.value !== '') {
            setTimeout(() => {
                let body = {
                    flag: 1,
                    status: true,
                    searchString: e.target.value,
                    projectId: projectId,
                    milestoneId: milestoneId,
                    sprintId: sprintId,
                    skip: 1,
                    activeStatus: '',
                };
                dispatch(getAllTask(body));
            }, 500);
        }
    };
    return (
        <>
            <div class="status">
                <ul>
                    <li>Task Status Count</li>
                    <div>
                        {' '}
                        <h4 className="page-title bg-black  text-white rounded-2 p-2 py-1">
                            {' '}
                            To-Do :
                            <Badge className="bg-white text-dark ms-1 align-items-center justify-content-center">
                                {taskStatusCountdata?.response?.TodoCount}
                            </Badge>
                        </h4>{' '}
                    </div>
                    <div className="ms-3">
                        {' '}
                        <h4 className="page-title bg-black text-white rounded-2 p-2 py-1">
                            {' '}
                            In-Progress :
                            <Badge className="bg-white text-dark ms-1 align-items-center justify-content-center">
                                {taskStatusCountdata?.response?.InprogressCount}
                            </Badge>
                        </h4>{' '}
                    </div>
                    <div className="ms-3">
                        {' '}
                        <h4 className="page-title bg-black text-white rounded-2 p-2 py-1">
                            {' '}
                            Hold :
                            <Badge className="bg-white text-dark ms-1 align-items-center justify-content-center">
                                {taskStatusCountdata?.response?.HoldCount}
                            </Badge>
                        </h4>{' '}
                    </div>
                    <div className="ms-3">
                        {' '}
                        <h4 className="page-title  bg-black text-white rounded-2 p-2 py-1">
                            {' '}
                            Done :
                            <Badge className="bg-white text-dark ms-1 align-items-center justify-content-center">
                                {taskStatusCountdata?.response?.DoneCount}
                            </Badge>
                        </h4>{' '}
                    </div>
                    <div className="ms-3 me-2">
                        {' '}
                        <h4 className="page-title bg-black text-white rounded-2 p-2 py-1">
                            {' '}
                            Due Task:
                            <Badge className="bg-white text-dark ms-1 align-items-center justify-content-center">
                                {taskStatusCountdata?.response?.DueTasksCount}
                            </Badge>
                        </h4>{' '}
                    </div>

                    <li className="info_cls">
                        {assigneeName?.map((item, index) => (
                            <div className=" d-flex align-items-center cp">
                                <span
                                    style={{
                                        zIndex: '0000000',
                                        backgroundColor: '#605e5a',
                                        borderRadius: '100%',
                                        // padding: '8px',
                                        height: '35px',
                                        width: '35px',
                                        display: 'flex',
                                        // alignitems: 'center',
                                        alignItems: 'center',
                                        // justifycontent: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '800',
                                        marginRight: '-8px',
                                        // zIndex: '999999',
                                    }}>
                                    {item?.assigneeId?.firstName.charAt(0)}
                                    {item?.assigneeId?.lastName.charAt(0)}
                                </span>
                            </div>
                        ))}
                    </li>
                </ul>
                <div className="search_info">
                    <input
                        type="search"
                        placeholder="Search here..."
                        className="border-0 rounded-2"
                        onKeyUp={selectTask}
                        {...register('textSearch')}
                    />
                    <div className="add_task">
                        <button
                            type="button"
                            className="mybutton btn btn-info web_button"
                            onClick={() => {
                                console.log('button click');
                                setShowModal(!showModal);
                            }}>
                            Add Task
                        </button>
                        <RightBar
                            callAlltaskData={callAlltaskData}
                            className="d-none"
                            projectId={props.projectId}
                            mileStoneId={props.mileStoneId}
                            sprintId={props.sprintId}
                            showModal={showModal}
                            setShowModal={setShowModal}
                        />
                    </div>
                </div>
            </div>

            <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
                {successHandle.loading ? (
                    <MainLoader />
                ) : (
                    <Container>
                        <TaskColumnStyles>
                            {Object.entries(columns)?.map(([columnId, column], index) => {
                                return (
                                    <Droppable key={columnId} droppableId={columnId}>
                                        {(provided, snapshot) => (
                                            <TaskList
                                                class="three"
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}>
                                                <Title class="">{column.title}</Title>

                                                {column?.items?.map((item, index) => (
                                                    <TaskCard
                                                        showTaskDetailMOdel={showTaskDetailMOdel}
                                                        key={item}
                                                        item={item}
                                                        index={index}
                                                        closeModal={closeModal}
                                                    />
                                                ))}
                                                {provided.placeholder}
                                            </TaskList>
                                        )}
                                    </Droppable>
                                );
                            })}
                        </TaskColumnStyles>
                    </Container>
                )}
            </DragDropContext>
            <Taskdetail
                closeTaskDetailMOdel={closeTaskDetailMOdel}
                show={showTaskModel}
                item={commentdata}
                historyData={historyData}
                userId={userId}
            />
        </>
    );
};

export default Boards;
