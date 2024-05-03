import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { columnsFromBackend } from './data';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { getAllTask, updateTask } from '../../../redux/actions';
import MainLoader from '../../../constants/Loader/loader';
import { getHistoryAction } from '../../../redux/addcomment/actions';
import { getTaskStatusCount } from '../../../redux/Summary/action';
import { getComment } from '../../../redux/addcomment/actions';
import Taskdetail from './taskdetail';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import ToastHandle from '../../../constants/toaster/toaster';
import { listProjectAssignee, updateTaskStatus } from '../../../redux/task/action';
import { addLoginTime, addLoginTimeStop } from '../../../redux/user/action'

const Container = styled.div`
    display: flex;
`;

const TaskList = styled.div`
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    background: #f3f3f3;
    overflow: scroll;
    min-width: 341px;
    border-radius: 5px;
    padding: 15px 15px;
    margin-right: 45px;
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: transparent;
        // border-radius: 6px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: gray;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
        // border-radius: 10px;
    }
`;

const TaskColumnStyles = styled.div`
    margin: 8px;
    display: flex;
    width: 100%;
    overflow:auto;
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
    const { projectId, milestoneId, spriteId } = useParams();
    const dispatch = useDispatch();
    const [render, setRender] = useState(false);
    const [loader, setloader] = useState(false);
    const store = useSelector((state) => state);
    const { register, setValue } = useForm();
    const taskId = store?.getTaskId?.data;
    const taskStatusCount = store?.getTaskStatusCount?.data?.response;
    const taskStatusCountdata = store?.getAllTaskReducer?.data;
    const updateComment = store?.updateComment;
    const successHandle = store?.getAllTaskReducer;
    const statushandle = store?.updateTaskStatus;
    const assigneeName = store?.getAllAssigneeName?.data?.response;
    const [showModal, setShowModal] = useState(false);
    const [columns, setColumns] = useState(columnsFromBackend);
    const [commentdata, setCommentData] = useState([]);
    // console.log(commentdata, '66666666666666666666666666666666')
    const [showTaskModel, setshowTaskModel] = useState(false);
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState('');
    // const updateResponse = store?.updateTaskStatus;
    // console.log({ updateResponse })
    const assigneeId = localStorage.getItem('userId')
    useEffect(() => {
        dispatch(getAllTask({ sprintId: spriteId, searchString: '', assigneeId: assigneeId }));
    }, []);

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

    useEffect(() => {
        if (successHandle?.data?.status == 200) {
            setColumns({
                [1]: {
                    title: 'To-do',
                    bgColor: 'red',
                    items: successHandle?.data?.Response?.todo?.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                    count: successHandle?.data?.Response?.todoCount
                },
                [2]: {
                    title: 'In Progress',
                    bgColor: 'lightblue',
                    items: successHandle?.data?.Response?.inProgress.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                    count: successHandle?.data?.Response?.inProgressCount
                },
                [3]: {
                    title: 'Testing',
                    bgColor: 'chocolate',
                    items: successHandle?.data?.Response?.testing.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                    count: successHandle?.data?.Response?.testingCount
                },
                [5]: {
                    title: 'Hold',
                    bgColor: 'lime',
                    items: successHandle?.data?.Response?.hold.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                    count: successHandle?.data?.Response?.holdCount
                },
                [4]: {
                    title: 'Done',
                    bgColor: 'green',
                    items: successHandle?.data?.Response?.done.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                    count: successHandle?.data?.Response?.doneCount,
                },
            });
        }
    }, [successHandle, dispatch]);
    const handelupdatetask = (ele) => {
        let body = {
            taskId: ele?.draggableId,
            status: ele?.destination?.droppableId
        };
        dispatch(updateTaskStatus(body));
        setloader(false);
    };
    const [BooleanUpdate, setBooleanUpdate] = useState(false);
    const persistColumnsToLocalStorage = (columns) => {
        localStorage.setItem("columns", JSON.stringify(columns));
    };
    const onDragEnd = (result, columns, setColumns) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];

        const sourceItems = sourceColumn.items.slice();
        const destItems = destColumn.items.slice();
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

        // persistColumnsToLocalStorage(columns); // Persist columns to local storage
        handelupdatetask(result);
        setBooleanUpdate(true);
    }

    useEffect(() => {
        if (statushandle?.data?.status == 200) {
            closeModal('render');
        } else if (statushandle?.data?.status == 400) {
            ToastHandle('error', statushandle?.data?.message);
        } else if (statushandle?.status !== 200) {
            ToastHandle('error', statushandle?.message?.error);
        }
    }, [statushandle]);

    useEffect(() => {
        if (BooleanUpdate) {
            dispatch(getAllTask({ sprintId: spriteId, searchString: '', assigneeId: assigneeId }));
        } else {
            dispatch(getAllTask({ sprintId: spriteId, searchString: '', assigneeId: assigneeId }));
        }
        setBooleanUpdate(false);
    }, [BooleanUpdate]);

    const historyData = store?.getHistoryData?.data?.response;
    const userId = store?.Auth?.user?.userId;

    const selectUserTask = store?.getAllTaskReducer?.data?.done?.tasks?.taskInfo;

    const showTaskDetailMOdel = (item) => {
        setshowTaskModel(true);
        setCommentData(item);
        dispatch(getComment(item?.taskId));
        dispatch(getHistoryAction(item?.taskId));
    };

    const closeTaskDetailMOdel = () => {
        setshowTaskModel(false);
    };

    const handleSearchChange = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
        dispatch(
            getAllTask({
                projectId: projectId,
                milestoneId: milestoneId,
                sprintId: spriteId,
                assigneeId: assigneeId,
                searchString: e.target.value,
            })
        );
    };

    const closeModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
    };
    // const handleTaskStart = (taskId) => {
    //     // Dispatch action for task start time
    //     dispatch(addLoginTime(taskId)); // Replace with your actual action
    // };
    return (
        <>
            <div className="status">

                <div className="search_info ms-auto ">

                    <input
                        type="search"
                        value={search}
                        onChange={(e) => {
                            handleSearchChange(e);
                        }}
                        placeholder="Search here..."
                        className="border-0 rounded-2"
                    // onKeyUp={selectTask}
                    />

                </div>
            </div>

            <DragDropContext
                onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
                shouldRespectForcePress={true} // Add this line
            >
                {loader ? (
                    <MainLoader />
                ) : (
                    <Container>
                        <TaskColumnStyles className='task-page-columns'>
                            {Object.entries(columns).map(([columnId, column]) => (
                                <Droppable key={columnId} droppableId={columnId}>
                                    {(provided, snapshot) => (
                                        <div
                                            className="task-list-col "
                                            ref={provided?.innerRef}
                                            {...provided?.droppableProps}

                                        >
                                            <TaskList>
                                                <Title className='text-dark fw-bold ' style={{ position: 'sticky', top: '0', zIndex: '2', backgroundColor: '#F3F3F3' }} >{column.title}   <span className='py-0 p-1  rounded-circle text-dark bg-primary'>{column.count}</span></Title>
                                                {column.items?.map((item, index) => (
                                                    <TaskCard
                                                        key={item.id}
                                                        item={item}
                                                        index={index}
                                                        columns={columns}
                                                        projectId={projectId}
                                                        mileStoneId={milestoneId}
                                                        sprintId={spriteId}
                                                        closeModal={closeModal}
                                                        showTaskDetailMOdel={showTaskDetailMOdel}
                                                        isInProgressColumn={columnId == '2'}

                                                    // onTaskStart={handleTaskStart}
                                                    />
                                                ))}
                                                {provided?.placeholder}
                                            </TaskList>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
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
