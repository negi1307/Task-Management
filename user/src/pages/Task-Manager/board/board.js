import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { columnsFromBackend } from './data';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { getAllTask, updateTask } from '../../../redux/actions';
import MainLoader from '../../../constants/Loader/loader';
import { getHistory } from '../../../redux/addcomment/actions';
import { getTaskStatusCount } from '../../../redux/Summary/action';
import { getComment } from '../../../redux/addcomment/actions';
import Taskdetail from './taskdetail';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import ToastHandle from '../../../constants/toaster/toaster';
import { listProjectAssignee } from '../../../redux/task/action';

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
    const [showTaskModel, setshowTaskModel] = useState(false);
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState('');


    const assigneeId = localStorage.getItem('userId')
    // console.log({ assigneeId })
    useEffect(() => {
        // let body = {
        //     flag: 1,
        //     status: true,
        //     searchString: '',
        //     // projectId: projectId,
        //     // milestoneId: milestoneId,
        //     sprintId: spriteId,
        //     skip: 1,
        //     activeStatus: true,
        //     assigneeId: assigneeId
        // };

        // dispatch(getAllTask(body));
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
    }, [successHandle]);
    // const fajnf = store?.getBugsReducer?.data?.response
    // console.log({ fajnf })

    const handelupdatetask = (ele) => {
        let body = {
            taskId: ele?.draggableId,
            status: ele?.destination?.droppableId
        };
        // dispatch(updateTaskStatus(body));
        // setloader(false);

    };

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;


        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = sourceColumn.items?.slice();
            const destItems = destColumn.items?.slice();
            const [removed] = sourceItems?.splice(source.index, 1);
            destItems?.splice(destination.index, 0, removed);
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
            handelupdatetask(result);
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
            handelupdatetask(result);

        }
    };

    const historyData = store?.getHistoryData?.data?.response;
    const userId = store?.Auth?.user?.userId;

    const selectUserTask = store?.getAllTaskReducer?.data?.done?.tasks?.taskInfo;

    const showTaskDetailMOdel = (item) => {
        setshowTaskModel(true);
        setCommentData(item);
        dispatch(getComment(item?.taskId));
        dispatch(getHistory(item?.taskId));
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


    // const callAlltaskData = () => {
    //     let body = {
    //         flag: 1,
    //         status: true,
    //         searchString: '',
    //         projectId: projectId,
    //         milestoneId: milestoneId,
    //         sprintId: '66026a52b110e4325bc04618',
    //         skip: 1,
    //         activeStatus: '',
    //     };
    //     dispatch(getAllTask(body));
    // };
    const closeModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
    };


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // const selectTask = (e) => {
    //     if (e.target.value !== '') {
    //         setTimeout(() => {
    //             let body = {
    //                 flag: 1,
    //                 status: true,
    //                 searchString: e.target.value,
    //                 projectId: projectId,
    //                 milestoneId: milestoneId,
    //                 sprintId: '66026a52b110e4325bc04618',
    //                 skip: 1,
    //                 activeStatus: '',
    //             };
    //             dispatch(getAllTask(body));
    //         }, 500);
    //     }
    // };
    return (
        <>
            <div className="status">
                {/* <ul>
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
                    </div> */}
                {/* <div className="ms-3">
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
                    </div> */}

                {/* <li className="info_cls">
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
                </ul> */}
                <div className="search_info ms-auto">
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
                    {/* <div className="add_task">
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
                    </div> */}
                </div>
            </div>

            <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
                {successHandle.loading ? (
                    <MainLoader />
                ) : (
                    <Container className='overflow-scroll'>
                        <TaskColumnStyles style={{ height: '90vh !important' }}>
                            {Object.entries(columns)?.map(([columnId, column], index) => {
                                return (
                                    <Droppable key={columnId} droppableId={columnId}>
                                        {(provided, snapshot) => (
                                            <TaskList
                                                className="three"
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}>
                                                <Title className='text-dark fw-bold' >{column?.title}   <span className='py-0 p-1  rounded-circle text-dark bg-white'>{column?.count}</span></Title>

                                                {column?.items?.map((item, index) => (
                                                    <TaskCard
                                                        showTaskDetailMOdel={showTaskDetailMOdel}
                                                        key={item}
                                                        item={item}
                                                        index={index}
                                                        projectId={projectId}
                                                        mileStoneId={milestoneId}
                                                        sprintId={spriteId}
                                                        closeModal={closeModal}
                                                        isInProgressColumn={columnId == '2'}
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
