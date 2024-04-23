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
import { FaFilter } from "react-icons/fa";
import MainLoader from '../../../constants/Loader/loader';
import RightBar from '../../../layouts/AddRightSideBar';
import { getAssignUserAction, getsingleSprintTask, getComment, getHistoryAction, updateTaskStatus } from '../../../../src/redux/task/action';
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
import { TiPlus } from "react-icons/ti";

const Container = styled.div`
    display: flex;
        flex: 1;
`;
const TaskList = styled.div`
    height: 100%;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    background: #f3f3f3;
    width: 100%;
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
    console.log(columns, '6666666666666666666666666')
    const sprintId = store?.getSprintId?.data;
    const taskId = store?.getTaskId?.data;
    const CreateCommenthandel = store?.AddCommentReducer;
    const deleteCommenthandel = store?.deleteCommentReducer;
    const [loader, setloader] = useState(false);
    const [search, setSearch] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [assigneeFilter, setassigneeFilter] = useState(null);
    const [assigneeSelected, setassigneeSelected] = useState(false);
    const [assigneeId, setassigneeId] = useState('');


    // Callback function to be called when form is submitted successfully
    const handleFormSubmit = () => {
        // assigneeId
        if (assigneeSelected) {
            dispatch(getAllTask({ sprintId: spriteId, searchString: '', assigneeId: assigneeId }));
        } else {
            dispatch(getAllTask({ sprintId: spriteId, searchString: '' }));
        }
        dispatch(getAllTask({ sprintId: spriteId, searchString: '' }));
        dispatch(getAssignUserAction({ projectId: projectId, milestoneId: milestoneId, sprintId: spriteId }));
        dispatch(getAllRoles())
        setFormSubmitted(true);
    };

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

    useEffect(() => {
        if (assigneeSelected) {
            dispatch(getAllTask({ sprintId: spriteId, searchString: '', assigneeId: assigneeId }));
        } else {
            dispatch(getAllTask({ sprintId: spriteId, searchString: '' }));
        }
        dispatch(getAssignUserAction({ projectId: projectId, milestoneId: milestoneId, sprintId: spriteId }));
        dispatch(getAllRoles())
        setColumns(columns);
    }, [render]);
    const closeaddModal = () => {
        getalltasks();
    }
    const deleteTask = () => {

    }
    const getalltasks = () => {
        // dispatch(getAllTask({ projectId: projectId, milestoneId: milestoneId, sprintId: spriteId, searchString: '' }));
        // dispatch(getAssignUserAction({ projectId: projectId, milestoneId: milestoneId, sprintId: spriteId }));
        // dispatch(getAllRoles())
    }

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

    const handelupdatetask = (ele) => {
        let body = {
            taskId: ele?.draggableId,
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

    const handleAssigneefilter = (e) => {
        const assigneeId = e.target.value;
        setassigneeId(assigneeId);
        dispatch(getAllTask({
            sprintId: spriteId,
            assigneeId: assigneeId,
            searchString: ''
        }));
        setassigneeSelected(true);
    };

    return (
        <>
            <div className="add_task row d-flex  m-0 ">
                <div className="col-lg-8 d-flex  align -items-center">
                    <div className='position-relative'>
                        <FaFilter className='position-absolute fs-6' style={{ left: '4%', top: '30%', fontWeight: '900' }} />
                        <select
                            name="Assignee"
                            role='button'
                            className="form-select ps-3 border-0 fw-medium"
                            id="exampleForm.ControlInput1"
                            {...register('Assignee', { required: true })}
                            onChange={handleAssigneefilter}
                            style={{ backgroundColor: '#F1F3FA' }}
                        >
                            <option value={''} selected>
                                All Tasks
                            </option>
                            {store?.getAllUsers?.data?.response?.map((ele, ind) => (
                                <option value={ele?._id}>
                                    {' '}
                                    {ele?.firstName} {ele?.lastName}
                                </option>
                            ))}
                        </select>
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
                                            type="search"
                                            value={search}
                                            onChange={(e) => {
                                                handleSearchChange(e);
                                            }}
                                            className="form-control  py-0 m-0  "
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
                    <div className="ms-2 ">
                        <button
                            type="button"
                            className="mybutton btn p-1 fw-bold py-0 px-2 m-0  web_button"
                            onClick={() => {
                                // console.log('button click');
                                setShowModal(!showModal);
                                // dispatch(getAllTask({ projectId: projectId, mileStoneId: milestoneId, sprintId: spriteId }))

                            }}>
                            <TiPlus />
                        </button>
                        <RightBar
                            className="d-none"
                            projectId={projectId}
                            mileStoneId={milestoneId}
                            sprintId={spriteId}
                            onFormSubmit={handleFormSubmit}
                            showModal={showModal}
                            columns={columns}
                            closeModal={closeaddModal}
                            setShowModal={setShowModal}
                            centered
                        />
                    </div>
                </div>
            </div >

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
                                                <Title className='text-dark fw-bold' style={{ position: 'sticky', top: '0', zIndex: '2', backgroundColor: '#F3F3F3' }} >{column.title}   <span className='py-0 p-1  rounded-circle text-dark bg-primary'>{column.count}</span></Title>
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
        </>
    );
};

export default Boards;
