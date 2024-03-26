import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Breadcrumb, Badge } from 'react-bootstrap';
import styled from '@emotion/styled';
import { columnsFromBackend } from './data';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getAllTask, updateTask } from '../../../redux/actions';
import { v4 as uuidv4 } from 'uuid';
import MainLoader from '../../../constants/Loader/loader';
import RightBar from '../../../layouts/AddRightSideBar';
import { getAssignUserAction, getComment, getHistoryAction, updateTaskStatus } from '../../../../src/redux/task/action';
import ToastHandle from '../../../constants/toaster/toaster';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { deleteTask, getAllProjects, getAllRoles, getAllUsers, getsingleMileStone } from '../../../redux/actions';
import { getSingleSprint } from '../../../redux/sprint/action';
import { getSprintId } from '../../../redux/sprint/reducres';
import { getMilestoneId, getMilestonetId } from '../../../redux/milestone/reducer';
import { getProjectId } from '../../../redux/projects/reducers';

const Container = styled.div`
    display: flex;
`;

const TaskList = styled.div`
    height: 98vh;
    display: flex;
    flex-direction: column;
    background: #f3f3f3;
    width: 100%;
    border-radius: 5px;
    padding: 15px 15px;
    margin-right: 45px;
`;

const TaskColumnStyles = styled.div`
    margin: 8px;
    display: flex;
    width: 100%;
    overflow: auto;

    /* Bootstrap grid classes */
    .task-list-col {
        flex: 0 0 25%; 
        max-width: 25%; 
        padding: 0 8px; 
    }
`;


const Title = styled.span`
    color: #10957d;
    background: rgba(16, 149, 125, 0.15);
    padding: 2px 10px;
    border-radius: 5px;
    align-self: flex-start;
`;

const Boards = () => {
    const { projectId, milestoneId, spriteId } = useParams();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const successHandle = store?.getAllTaskReducer;
    const statushandle = store?.updateTaskStatus;
    const deletehandel = store?.deleteTask;
    const updatehandel = store?.UpdateTaskReducer;
    const Createhandel = store?.createTaskReducer;
    const updateComment = store?.updateCommentReducer;
    const AssignUserName = store?.getAssignUserReducer?.data?.response;
    const [render, setRender] = useState(false);
    const [projectNameHeading, setProjectName] = useState('Select Project Name');
    const [showModal, setShowModal] = useState(false);
    const [columns, setColumns] = useState(columnsFromBackend);
    const sprintId = store?.getSprintId?.data;
    const taskId = store?.getTaskId?.data;
    const CreateCommenthandel = store?.AddCommentReducer;
    const deleteCommenthandel = store?.deleteCommentReducer;
    const [loader, setloader] = useState(false);
    const [search, setSearch] = useState('');
    console.log(columns,'col')

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = sourceColumn.items?.slice(); // Create a shallow copy
            const destItems = destColumn.items?.slice(); // Create a shallow copy
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

    useEffect(() => {
        dispatch(getAllTask({ projectId: projectId, milestoneId: milestoneId, sprintId: spriteId, searchString: '' }));
        dispatch(getAssignUserAction({ projectId: projectId, milestoneId: milestoneId, sprintId: spriteId }));
        dispatch(getAllRoles())
        setColumns(columns)

    }, [render]);

    useEffect(() => {
        if (successHandle?.data?.status == 200) {
            setColumns({
                [1]: {
                    title: 'To-do',
                    items: successHandle?.data?.Response?.todo?.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                },
                [2]: {
                    title: 'In Progress',
                    items: successHandle?.data?.Response?.inProgress.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                },
                [3]: {
                    title: 'Hold',
                    items: successHandle?.data?.Response?.hold.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                },
                [4]: {
                    title: 'Done',
                    items: successHandle?.data?.Response?.done.map((ele) => {
                        return { ...ele, id: ele._id };
                    }),
                },
            });
        }
    }, [successHandle]);

    const handelupdatetask = (ele) => {
        let body = {
            taskId: ele?.draggableId ,
            status: ele?.destination?.droppableId
        };
        dispatch(updateTaskStatus(body));
        setloader(false);

    };

    const closeModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
    };

    useEffect(() => {
        if (statushandle?.data?.status == 200) {
            closeModal('render');
        } else if (statushandle?.data?.status == 400) {
            ToastHandle('error', statushandle?.data?.message);
        } else if (statushandle?.status !== 200) {
            ToastHandle('error', statushandle?.message?.error);
        }
    }, [statushandle]);

    // Other useEffects for handling various Redux actions

    const handleSearchChange = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
        dispatch(
            getAllTask({
                projectId: projectId,
                milestoneId: milestoneId,
                sprintId: spriteId,
                searchString: e.target.value,
            })
        );
    };

    // const handleSearch=()=>{
    //     dispatch(getAllTask({ projectId: projectId, milestoneId: milestoneId, sprintId: spriteId ,searchString : search}));
    //     setSkip(1)
    // }
    return (
        <>
            {/* <div className="project_detail"> */}
            {/* <div className="project_name"> */}
            {/* <h3>{projectNameHeading}</h3> */}
            {/* </div> */}
            {/* <div className="taskinfo">
                    <ul>
                    <li>
                            {' '}
                            <Link to="/summary">Summary</Link>{' '}
                        </li>
                        <li>
                            {' '}
                            <Link to="/taskList">List</Link>{' '}
                        </li>
                        <li>
                            {' '}
                            <Link   to={`/dashboard/boards/projectId=/${projectId}&milestoneId=/${milestoneId}&spriteId=/${spriteId}`}>Board</Link>{' '}
                        </li>
                       
                    </ul>
                </div> */}
            <div className="add_task row d-flex pb-2 pt-1">
                <div className="col-lg-8 d-flex  align -items-center">
                    <div>
                        {' '}
                        <h4 className="page-title bg-black  text-white rounded-2 p-2 py-1" >
                            {' '}
                            To-Do :
                            <Badge className="bg-white text-dark ms-1 align-items-center justify-content-center">
                                {successHandle?.data?.Response?.todoCount}
                            </Badge>
                        </h4>{' '}
                    </div>
                    <div className="ms-3">
                        {' '}
                        <h4 className="page-title bg-black text-white rounded-2 p-2 py-1">
                            {' '}
                            In-Progress :
                            <Badge className="bg-white text-dark ms-1 align-items-center justify-content-center">
                                {successHandle?.data?.Response?.inProgressCount}
                            </Badge>
                        </h4>{' '}
                    </div>
                    <div className="ms-3">
                        {' '}
                        <h4 className="page-title bg-black text-white rounded-2 p-2 py-1">
                            {' '}
                            Hold :
                            <Badge className="bg-white text-dark ms-1 align-items-center justify-content-center">
                                {successHandle?.data?.Response?.holdCount}
                            </Badge>
                        </h4>{' '}
                    </div>
                    <div className="ms-3">
                        {' '}
                        <h4 className="page-title  bg-black text-white rounded-2 p-2 py-1">
                            {' '}
                            Done :
                            <Badge className="bg-white text-dark ms-1 align-items-center justify-content-center">
                                {successHandle?.data?.Response?.doneCount}
                            </Badge>
                        </h4>{' '}
                    </div>
                    <div className="ms-3 me-2">
                        {' '}
                        <h4 className="page-title bg-black text-white rounded-2 p-2 py-1">
                            {' '}
                            Due Task:
                            <Badge className="bg-white text-dark ms-1 align-items-center justify-content-center">
                                {successHandle?.data?.Response?.dueTasksCount}
                            </Badge>
                        </h4>{' '}
                    </div>
                    {AssignUserName?.map((ele, ind) => (
                        <>
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id="tooltip1">
                                        {ele?.assigneeId?.firstName}
                                        {ele?.assigneeId?.lastName}
                                    </Tooltip>
                                }>
                                <div className="d-flex align-items-center cp">
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
                                        {ele?.assigneeId?.firstName.charAt(0)}
                                        {ele?.assigneeId?.lastName.charAt(0)}
                                    </span>
                                </div>
                            </OverlayTrigger>
                        </>
                    ))}
                </div>

                <div className="col-lg-4 d-flex justify-content-end align-items-center">
                    <div className="page-title-box">
                        <div className="">
                            <form className="d-flex text  align-items-center ">
                                <div className="app-search px-0">
                                    <div className=" position-relative ">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => {
                                                handleSearchChange(e);
                                            }}
                                            className="form-control  py-1  "
                                            placeholder="Search "
                                        />
                                        <span className="mdi mdi-magnify search-icon"></span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div>
                        {/* <Button className="web_button ms-2" variant="info" onClick={handleSearch}>
                                    <i className="mdi mdi-magnify search-icon"></i>
                                 </Button> */}
                    </div>
                    <div className="ms-2">
                        <button
                            type="button"
                            className="mybutton btn p-1 fw-bold py-1  web_button"
                            onClick={() => {
                                console.log('button click');
                                setShowModal(!showModal);
                            }}>
                            Add Task
                        </button>
                        <RightBar
                            className="d-none"
                            projectId={projectId}
                            mileStoneId={milestoneId}
                            sprintId={spriteId}
                            showModal={showModal}
                            setShowModal={setShowModal}
                        />
                    </div>
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
                        <TaskColumnStyles>
                            {Object?.entries(columns)?.map(([columnId, column]) => {
                                return (
                                    <Droppable key={columnId} droppableId={columnId}>
                                        {(provided, snapshot) => (
                                            <div className="task-list-col">
                                                <TaskList ref={provided?.innerRef} {...provided?.droppableProps}>
                                                    <Title>{column?.title}</Title>
                                                    {column?.items?.map((item, index) => (
                                                        <TaskCard
                                                            key={item.id}
                                                            item={item}
                                                            index={index}
                                                            closeModal={closeModal}
                                                        />
                                                    ))}
                                                    {provided?.placeholder}
                                                </TaskList>
                                            </div>
                                        )}
                                    </Droppable>
                                );
                            })}
                        </TaskColumnStyles>
                    </Container>
                )}
            </DragDropContext>
        </>
    );
};

export default Boards;
