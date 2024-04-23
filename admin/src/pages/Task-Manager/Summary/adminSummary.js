import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPriorityGraphAction, getAllTaskCountAction, getTaskSummmaryDetail, getTaskWeekCountAction } from '../../../redux/Summary/action';
import { getSingleSprint, getAllTask, getProjectTasksAction, getProjectTimeSpentAction } from '../../../redux/actions';
import { getHistoryAction } from '../../../redux/task/action';
import { getAllProjects, getProjectsCount, getprojectUsers } from '../../../redux/projects/action';
import { getsingleMileStone } from '../../../redux/milestone/action';
import Chart from 'react-apexcharts';
import { ProgressBar, Col, Container, Row, Table, Form } from 'react-bootstrap';
import Loader from '../../../components/Loader';
import HeaderMain from '../header/HeaderMain';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Pagination from '@mui/material/Pagination';
// import Pagination from '../../../helpers/pagination/Pagination';
import Stack from '@mui/material/Stack';
import FilterModal from './modal/filter';
import Pagesaddtask from '../../../layouts/AllPagesRightbar';
import { TbReport } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { getAllUsers, getuserTasks } from '../../../redux/user/action';
import moment from 'moment';
import { extractSets, generateCombinations, VennDiagram } from '@upsetjs/react';
import { BarChart } from '@mui/x-charts/BarChart';
import * as d3 from "d3";
import { FaMessage } from "react-icons/fa6";

import * as venn from "venn.js";



const AdminDashboard = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [historyResponse, setHistoryResponse] = useState(null);
    const successHandle = store?.getTaskSummaryReducer;
    const BarGraphHandel = store?.getPriorityGraphReducer;
    const lastWeekCount = store?.getTaskWeekCountReducer?.data?.response;
    const [taskCount, setTaskCount] = useState(null);
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filterModal, setFilterModal] = useState(false);
    const [skip, setSkip] = useState(1);
    const [projectStatus, setprojectStatus] = useState(1);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userDataCount, setuserDataCount] = useState(null);
    const [userTaskDetails, setuserTaskDetails] = useState(null);
    const [showTasks, setshowTasks] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedProjectName, setselectedProjectName] = useState(null);
    const [projectSelected, setProjectSelected] = useState(false); // State to track project selection
    const [projectOverviewChange, setProjectOverviewChange] = useState(false);
    const [sprintDataLoaded, setSprintDataLoaded] = useState(false);
    const [differenceTimeHours, setdifferenceTimeHours] = useState();
    const [totalTimeHours, setTotalTimeHours] = useState();
    const getUsers = store?.getProjectUsers?.data?.response;
    const statusCount = store?.getProjectTasks?.data;
    const timeSpent = store?.getProjectTimeSpent?.data;
    const [circleSize, setCircleSize] = useState(null);
    const [circleTitle, setCircleTitle] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    useEffect(() => {
        if (successHandle?.data?.status === 200) {
            setData(successHandle?.data?.response);
        }
        const historyData = store?.getHistoryReducer?.data?.response;
        if (historyData) {
            setHistoryResponse(historyData);
        }
        const usertasks = store?.getuserTasks?.data?.response;
        if (usertasks) {
            // console.log({ usertasks })
            setuserDataCount(usertasks)
        }

        const usertasksdetails = store?.getuserTasks?.data?.tasks;
        if (usertasksdetails) {
            setuserTaskDetails(usertasksdetails)
        }
    }, [successHandle, store?.getHistoryReducer?.data?.response]);
    useEffect(() => {
        const taskTotalCount = store?.getTaskSummaryReducer?.data.response;
        // console.log({ taskTotalCount })
        if (taskTotalCount) {
            setTaskCount(taskTotalCount);
        }
        if (getUsers?.data?.status == 200) {
            setData(getUsers?.data?.response);
        }
    }, [store?.getTaskSummaryReducer?.data.response, getUsers]);

    const closeaddModal = () => {
        // getalltasks();
    }
    const closefilterModal = () => {
        setFilterModal(false);
    }
    useEffect(() => {
        dispatch(getAllUsers({ skip: skip }));
        dispatch(getTaskWeekCountAction());
        dispatch(getTaskSummmaryDetail());
        dispatch(getHistoryAction());
        dispatch(getProjectsCount());
        dispatch(getPriorityGraphAction());
        dispatch(getAllTaskCountAction());
        dispatch(getAllUsers());

        // if (milestoneSelected !== null) {
        //     dispatch(getSingleSprint({ activeStatus: true, id: milestoneSelected, skip: 1 }));
        // }
        // if (sprintSelected !== null) {
        //     dispatch(getAllTask({ sprintId: sprintSelected, searchString: '' }));
        // }
    }, [dispatch]);
    const vennData = [
        {
            // size: totalTimeHours,
            size: 400,
            sets: ["Total Time"]
        },

        {
            // size: timeSpent?.estimatedHours,
            size: 300,
            sets: ["Estimated Time"]
        },
        {
            // size: differenceTimeHours,
            size: 100,
            sets: ["Total Time", "Estimated Time"],
            common: true
        }
    ]
    useEffect(() => {
        const div = d3.select("#venn-chart");

        // Add hover functionality to the div
        div.on("mouseenter", handleMouseEnter);
        div.on("mouseleave", handleMouseLeave);

        if (!div.empty()) {
            const chart = venn.VennDiagram().width(600).height(250);
            div.datum(vennData).call(chart);

            // Add hover functionality to the Venn diagram circles
            div.selectAll(".venn-circle")
                .on("mouseenter", handleCircleMouseEnter)
                .on("mouseleave", handleCircleMouseLeave);
        }

        // Cleanup event listeners on unmount
        return () => {
            div.on("mouseenter", null);
            div.on("mouseleave", null);
        };
    }, [vennData]);

    // Event handlers for div hover
    const handleMouseEnter = () => {
        console.log("Mouse entered div");
    };

    const handleMouseLeave = () => {
        console.log("Mouse left div");
    };

    // Event handler for circle hover
    const handleCircleMouseEnter = (d, i) => {
        const size = d.size;
        let title = "";

        if (d.sets[0] === "Total Time") {
            title = "Total Time:";
        } else if (d.sets[0] === "Estimated Time") {
            title = "Estimated Time:";
        }

        // console.log(`Hovered over circle with size: ${size}`);
        setCircleSize(size);
        setCircleTitle(title);
    };

    const handleCircleMouseLeave = (d, i) => {
        console.log("Left circle");
        setCircleSize(null); // Reset the size when leaving the circle
        setCircleTitle(null); // Reset the title when leaving the circle
    };



    // // Event handlers for div hover
    // const handleMouseEnter = () => {
    //     console.log("Mouse entered div");
    // };

    // const handleMouseLeave = () => {
    //     console.log("Mouse left div");
    // };

    // // Event handler for circle hover
    // const handleCircleMouseEnter = (d, i) => {
    //     let size = d.size;
    //     console.log(`Hovered over circle with size: ${size}`);
    //     // You can display the size as a tooltip or directly in the UI
    //     // For example, set the state to show the size in a tooltip component
    //     // Or directly update a state variable to render the size in the UI
    // };

    // const handleCircleMouseLeave = (d, i) => {
    //     console.log("Left circle");
    //     // Remove the tooltip or update the state to hide the size
    // };



    const projectsCount = store?.getProjectsCount?.data?.response?.projectStatusCounts;
    const totalTasks = store?.getAllTaskCountReducer?.data;
    const getProjectList = store?.getProject?.data;
    const userCount = store?.getAllUsers?.data;
    const priorityData = store?.getPriorityGraphReducer?.data?.response;
    function generateLink(userActivity, item) {
        switch (userActivity) {
            case "Created milestone":
                return `/dashboard/projects/${item?.sprintId?.projectId}`;
            case "Created Sprint":
                return `/dashboard/singleMilestonesprint/${item?.sprintId?.projectId}/${item?.milestoneId?._id}`;
            case "Created Task":
                return `/dashboard/taskBord/projectId=${item?.sprintId?.projectId}&milestoneId=${item?.milestoneId?._id}&spriteId=${item?.sprintId?._id}`;
            case "Create Project":
                return "/dashboard/projects";
            default:
                return "/dashboard/adminsummary";
        }
    }
    // graph chart
    const options = {
        chart: {
            type: 'bar',
        },
        plotOptions: {
            bar: {
                horizontal: false,
            }
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: priorityData?.map((ele, ind) => ele?.name),
        },
    };

    const series = [
        {
            name: 'Count',
            data: priorityData?.map((ele, ind) => ele?.count),
        },
    ];

    const projectDetails = store?.getProject?.data?.response;
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSkip(value);
        dispatch(getprojectUsers({ projectId: selectedProject, page: value }));
    };
    const handleClick = (userId) => {
        setSelectedUserId(userId);
        dispatch(getuserTasks({ userId: userId, projectId: selectedProject }));
        setshowTasks(true);
    };
    // const openuserTasks = () => {
    //     setshowTasks(!showTasks)
    // }


    const handleProjectSelection = (_id, name) => {
        if (_id !== undefined && _id !== null) {
            setSelectedProject(_id);
            setselectedProjectName(name);
            setProjectOverviewChange(true);
            setProjectSelected(true);
            dispatch(getprojectUsers({ projectId: _id }));
            dispatch(getProjectTasksAction({ projectId: _id }));
            dispatch(getProjectTimeSpentAction({ projectId: _id }));
        }
    };



    const calculateTotalTimeHours = () => {
        const totaltimeString = timeSpent?.totalTime;
        if (totaltimeString) {
            // Regular expression to extract hours, minutes, and seconds
            const timeRegex = /(\d+) hours (\d+) minutes (\d+) seconds/;
            const match = totaltimeString.match(timeRegex);

            if (match) {
                // Extracting hours, minutes, and seconds from the match
                const hours = parseInt(match[1]);
                const minutes = parseInt(match[2]);
                const seconds = parseInt(match[3]);

                // Converting hours, minutes, and seconds into total hours
                const totalTimeInHours = hours + minutes / 60 + seconds / 3600;

                // Now totalTimeInHours will hold the total time in hours
                // console.log({ totalTimeInHours });
                setTotalTimeHours(totalTimeInHours);
            }
        }
    }
    // console.log(timeSpent?.difference);

    const calculateDifferenceTimeHours = () => {
        const differenceString = timeSpent?.difference;
        if (differenceString) {
            // Regular expression to extract hours, minutes, and seconds
            const difftimeRegex = /(\d+) hours (\d+) minutes (\d+) seconds/;
            const matchdiff = differenceString.match(difftimeRegex);

            if (matchdiff) {
                // Extracting hours, minutes, and seconds from the match
                const hours = parseInt(matchdiff[1]);
                const minutes = parseInt(matchdiff[2]);
                const seconds = parseInt(matchdiff[3]);

                // Converting hours, minutes, and seconds into total hours
                const differenceTimeInHours = hours + minutes / 60 + seconds / 3600;

                // Now differenceTimeInHours will hold the total time in hours
                // console.log({ differenceTimeInHours });
                setdifferenceTimeHours(differenceTimeInHours);
            }
        }
    }

    const calculateHours = () => {
        calculateTotalTimeHours();
        calculateDifferenceTimeHours();
    }



    return (
        <>
            <div className='pt-4' style={{ background: 'white' }}>
                <Container fluid className=''>
                    <div className="row pb-3">
                        <div className='col-12 mb-2'>
                            <HeaderMain />
                        </div>
                        <hr />
                        <div className='row'>
                            <div className='col-12 d-flex gap-2 justify-content-end'>
                                <button className='mybutton btn p-1 fw-bold py-1 web_button'
                                    onClick={() => setFilterModal(true)}>
                                    Filter
                                </button>
                                <FilterModal
                                    className='d-none'
                                    showFilter={filterModal}
                                    closeFilter={closefilterModal}
                                    setfilterModal={setFilterModal} />
                                <button
                                    type="button"
                                    className="mybutton btn p-1 fw-bold py-1  web_button"
                                    onClick={() => {
                                        setShowModal(!showModal);
                                    }}>
                                    Add Task
                                </button>
                                <Pagesaddtask
                                    className="d-none"
                                    showModal={showModal}
                                    closeModal={closeaddModal}
                                    setShowModal={setShowModal}
                                />
                            </div>
                            {/* {filterModal && <FilterModal closeModal={() => setFilterModal(false)} />} */}

                        </div>
                    </div>
                    <Row className='px-3 '>
                        <Col sm={6} className='border border-1 border-muted'>
                            <div className='row d-flex flex-column align-items-center justify-content-center'>
                                <div className='col-12'>
                                    <h5 className="mb-3 text-dark">
                                        <strong>Current Projects</strong>
                                    </h5>
                                </div>
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: `${projectsCount?.Ongoing}`, label: 'Ongoing', color: '#76FF7A' },
                                                { id: 1, value: `${projectsCount?.Support}`, label: 'Support', color: '#EE82EE' },
                                                { id: 2, value: `${projectsCount?.Delivered}`, label: 'Delivered', color: '#99FFFF' },
                                            ],
                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        },
                                    ]}
                                    height={250}
                                    width={600}
                                />
                            </div>
                        </Col>
                        <Col sm={6} className='border border-1 border-muted'>
                            <Row className=' p-2'>
                                <Col sm={12}>
                                    <h5 className='text-dark'> <strong>Ongoing Projects</strong></h5>
                                    <h6>Click on a project to show its details.</h6>
                                </Col>
                                <Col sm={12} className='scrollable-content'>
                                    <Table className="mb-0 add_Color_font text-nowrap">
                                        <thead>
                                            <tr>
                                                <th className='fw-bold text-start'>#</th>
                                                <th className='fw-bold text-start'>Project Name</th>
                                                <th className='fw-bold text-start'>Start Date</th>
                                                <th className='fw-bold text-start'>End Date</th>
                                                <th className='fw-bold text-start'>Due Days</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getProject?.data?.response?.projects?.map((ele, ind) => {
                                                return (
                                                    <tr className="align-middle" key={ele?._id}
                                                        onClick={() => handleProjectSelection(ele?._id, ele?.projectName)}>
                                                        <th scope="row" className='text-start'>{(skip - 1) * 10 + ind + 1}</th>
                                                        <td className="cp text-start namelink text-secondary">
                                                            {ele?.projectName}
                                                        </td>
                                                        <td className='text-start text-secondary'>
                                                            <span className="namelink">
                                                                {moment(ele?.startDate).format("DD/MM/YYYY")}
                                                            </span>
                                                        </td>
                                                        <td className='text-start text-secondary'>
                                                            <span className="namelink">
                                                                {moment(ele?.endDate).format("DD/MM/YYYY")}
                                                            </span>
                                                        </td>
                                                        <td className='text-start text-secondary'>{ele?.daysLeft}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </Col>
                                {/* <Col sm={12} className="text-end mb-2 ">
                                    <Link to='/dashboard/report'>
                                        View All
                                    </Link>
                                </Col> */}
                            </Row>
                        </Col>
                        {/* <Col sm={6} className='border border-1 border-muted'> */}
                        {/* <Row className='p-2'> */}

                        {/* <div className='col-12 h-100 d-flex'> */}
                        {/* {!projectOverviewChange && taskCount !== null && (
                                       
                                    )} */}
                        {/* {projectOverviewChange && ( */}
                        {/* <Row> */}
                        {/* <Col lg={4}>
                                                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>
                                                        {' '}
                                                        Project<span className="text-danger">*</span>:
                                                    </Form.Label>
                                                    <Form.Select
                                                        {...register('projectname', { required: true })}
                                                        onChange={(e) => setprojectSelected(e.target.value)}
                                                        value={projectSelected || ''}
                                                    >
                                                        <option value=''>Select Project</option>
                                                        {store?.getProject?.data?.response?.projects?.map((ele) => (
                                                            <option key={ele?._id} value={ele?.projectName}>{ele?.projectName}</option>
                                                        ))}
                                                    </Form.Select>
                                                    {errors.projectname?.type === 'required' && (
                                                        <span className="text-danger"> This field is required *</span>
                                                    )}
                                                </Form.Group>
                                            </Col> */}

                        {/* <Col lg={6}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label>
                                                    {' '}
                                                    Milestone<span className="text-danger">*</span>:
                                                </Form.Label>
                                                <Form.Select
                                                    {...register('Milestone', { required: true, disabled: !projectSelected })}
                                                    onChange={(e) => handleMilestoneChange(e)}
                                                    value={milestoneSelected || ''}
                                                >
                                                    <option value=''>Select Milestone</option>
                                                    {store?.getsingleMileStone?.data?.response?.map(milestone => {
                                                        // Check if the milestone matches the selected type
                                                        if (milestone.activeStatus === true) {
                                                            return (
                                                                <option key={milestone._id} value={milestone._id}>{milestone.title}</option>
                                                            );
                                                        } else {
                                                            // Handle inactive milestones if needed
                                                            return null; // Or any logic you need
                                                        }
                                                    })}
                                                </Form.Select>
                                                {errors.Milestone?.type === 'required' && (
                                                    <span className="text-danger"> This field is required *</span>
                                                )}
                                            </Form.Group>
                                        </Col> */}
                        {/* <Col sm={6}>
                                                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>
                                                        {' '}
                                                        Milestone<span className="text-danger">*</span>:
                                                    </Form.Label>
                                                    <Form.Select
                                                        {...register('Milestone', { required: true })}
                                                        onChange={(e) => setmilestoneSelected(e.target.value)}
                                                        value={milestoneSelected || ''} >
                                                        <option value=''>Select Milestone</option>
                                                        {store?.getSigleMileStone?.data?.response?.map(milestone => (
                                                            <option key={milestone?._id} value={milestone?._id}>{milestone?.title}</option>
                                                        ))}
                                                    </Form.Select>
                                                    {errors.Milestone?.type === 'required' && (
                                                        <span className="text-danger"> This field is required *</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>
                                                        Sprint <span className="text-danger">*</span>:
                                                    </Form.Label>
                                                    <Form.Select
                                                        {...register('Sprint', { required: true, disabled: !milestoneSelected })}
                                                        onChange={(e) => setsprintSelected(e.target.value)}
                                                        value={sprintSelected || ''}>
                                                        <option value="">Select Sprint</option>
                                                        {store?.getAllSingleSprints?.data?.response?.map(sprint => (
                                                            <option key={sprint?._id} value={sprint?._id}>{sprint?.sprintName}</option>
                                                        )
                                                        )}
                                                    </Form.Select>
                                                    {errors.Sprint?.type === 'required' && (
                                                        <span className="text-danger"> This field is required *</span>
                                                    )}
                                                </Form.Group>
                                            </Col> */}
                        {/* )} */}
                        {/* </Row> */}
                        {/* )} */}

                        {/* {!projectOverviewChange && (
                                        <button onClick={() => setProjectOverviewChange(true)}>Show Form</button>
                                    )} */}

                        {/* </div> */}
                        {/*  */}

                        {/* </Row> */}
                        {/* </Col> */}
                        {projectSelected && (
                            <>
                                <div className='col-6  d-flex flex-column border border-1 border-muted'>
                                    <div className="row">
                                        <div className='col-12'>
                                            <h5 className="mb-3 text-dark">
                                                <strong>Projects Overview</strong>
                                            </h5>
                                        </div>
                                        <PieChart
                                            series={[
                                                {
                                                    data: [
                                                        { id: 6, value: `${statusCount?.todoCount}`, label: `Todo: ${statusCount?.todoCount}` },
                                                        { id: 7, value: `${statusCount?.inProgressCount}`, label: `Inprogress: ${statusCount?.inProgressCount}` },
                                                        { id: 8, value: `${statusCount?.testingCount}`, label: `Testing: ${statusCount?.testingCount}` },
                                                        { id: 9, value: `${statusCount?.doneCount}`, label: `Done: ${statusCount?.doneCount} ` },
                                                        { id: 10, value: `${statusCount?.holdCount}`, label: `Hold: ${statusCount?.holdCount}` },
                                                    ],
                                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                                },
                                            ]}
                                            height={230}
                                            width={550}
                                        />
                                    </div>
                                </div>
                                <Col sm={6} className='border border-1  border-muted'>
                                    <Row>
                                        {/* <Col sm={12}>
                                            <Row>
                                                <Col sm={4} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}>
                                                    <p className='mb-0 mt-2 fw-bold text-black'>Expected Time</p>
                                                    <p className='mb-0'>{timeSpent?.expectedTime}</p>
                                                </Col>
                                                <Col sm={4} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}>
                                                    <p className='mb-0 mt-2 fw-bold text-black'>
                                                        Total Time
                                                    </p>
                                                    <p className='mb-0'>
                                                        {timeSpent?.totalTime}
                                                    </p>
                                                </Col>
                                                <Col sm={4} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}>
                                                    <p className='mb-0 mt-2 fw-bold text-black'>
                                                        Time Difference
                                                    </p>
                                                    <p className='mb-0'>
                                                        {timeSpent?.difference}
                                                    </p>
                                                </Col>
                                            </Row>
                                        </Col> */}
                                        <Col sm={12} className='d-flex justify-content-center'>
                                            {/* <VennDiagram
                                                sets={sets}
                                                combinations={combinations}
                                                width={400}
                                                height={300}
                                                selection={selection}
                                                onHover={setSelection}
                                            /> */}
                                            <Row>
                                                <Col sm={12}>
                                                    <h5 className="mb-3 text-dark">
                                                        Selected Project: {selectedProjectName}
                                                        <br />
                                                        {circleTitle} {circleSize}
                                                    </h5>
                                                </Col>
                                                <Col sm={12} className='d-flex justify-content-center mb-1  text-center'>
                                                    <div id="venn-chart">
                                                    </div>
                                                </Col>
                                            </Row>

                                        </Col>
                                    </Row>
                                </Col>
                                {/* <Col sm={6} className='border border-1 scrollable-content border-muted'>
                                    <Table className="mb-0 add_Color_font text-nowrap">
                                        <thead>
                                            <tr>
                                                <th className='fw-bold text-start'>#</th>
                                                <th className='fw-bold text-start'>Name</th>
                                                <th className='fw-bold text-start'>Description</th>
                                                <th className='fw-bold text-start'>Start Date</th>
                                                <th className='fw-bold text-start'>End Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {statusCount.response?.map((ele, ind) => {
                                                return (
                                                    <tr className="align-middle" key={ele?._id}>
                                                        <th scope="row" className='text-start'>{(skip - 1) * 10 + ind + 1}</th>
                                                        <td className="cp text-start namelink text-secondary">
                                                            {ele?.summary.charAt(0).toUpperCase() + ele?.summary.slice(1)}
                                                        </td>
                                                        <td className="cp text-start namelink text-secondary">
                                                            {ele?.description.charAt(0).toUpperCase() + ele?.description.slice(1)}
                                                        </td>
                                                        <td className='text-start text-secondary'>
                                                            <span className="namelink">
                                                                {moment(ele?.startDate).format("DD/MM/YYYY")}
                                                            </span>
                                                        </td>
                                                        <td className='text-start text-secondary'>
                                                            <span className="namelink">
                                                                {moment(ele?.dueDate).format("DD/MM/YYYY")}
                                                            </span>
                                                        </td>
                                                        <td className='text-start text-secondary'>{ele?.daysLeft}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </Col> */}
                                <Col sm={6} className='border border-1  border-muted'>
                                    <Row className='p-2 align-items-center '>
                                        <Col sm={6}>
                                            <h5 className='text-dark'> <strong>Users</strong></h5>
                                        </Col>
                                        <Col sm={6} className='text-end'>
                                            <Link to='/dashboard/report'>
                                                Users Report
                                            </Link>
                                        </Col>
                                        <Col sm={12}>
                                            <Table className="mb-0 mt-2 add_Color_font" style={{ fontSize: '13px' }}>
                                                <thead>
                                                    <tr className='text-start'>
                                                        <th className='fw-bold'>#</th>
                                                        <th className='fw-bold'>User Name</th>
                                                        <th className='fw-bold'>Email</th>
                                                        <th className='fw-bold'>Technology</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <>
                                                        {getUsers?.map((ele, ind) => {
                                                            return (
                                                                <tr className="align-middle text-start" key={ele?._id} onClick={() => { handleClick(ele?._id) }}>
                                                                    <th scope="row">{ind + 1}</th>
                                                                    <td className="cp">
                                                                        {`${ele?.firstName.charAt(0).toUpperCase() + ele?.firstName.slice(1)} ${ele?.lastName.charAt(0).toUpperCase() + ele?.lastName.slice(1)}`}
                                                                    </td>
                                                                    <td className="w-20">
                                                                        {ele?.email}
                                                                    </td>
                                                                    <td>{ele?.designationId?.name}</td>

                                                                    {/* <td>
                                                                <span className="namelink">{moment(ele?.createdAt).format("DD/MM/YYYY")}</span>
                                                            </td> */}
                                                                </tr>
                                                            );
                                                        })}
                                                    </>
                                                </tbody>
                                            </Table>
                                        </Col>
                                        <Col sm={12} className="text-end my-2 justify-content-end d-flex">
                                            <Pagination
                                                showFirstButton
                                                showLastButton
                                                defaultPage={skip}
                                                count={store?.getProjectUsers?.data?.totalPages}
                                                color="primary"
                                                variant="outlined"
                                                onChange={handlePaginationChange}
                                            />
                                        </Col>
                                    </Row>

                                </Col>
                                {showTasks && (
                                    <>
                                        <Col sm={6} className='border border-1 border-muted d-flex flex-column justify-content-center'>
                                            {/* {userDataCount !== undefined ? ( */}
                                            <div className='d-flex justify-content-center'>
                                                <PieChart
                                                    series={[
                                                        {
                                                            data: [
                                                                { id: 6, value: `${userDataCount?.Todo}`, label: 'Todo' },
                                                                { id: 7, value: `${userDataCount?.['In Progress']}`, label: 'Inprogress' },
                                                                { id: 8, value: `${userDataCount?.Testing}`, label: 'Testing' },
                                                                { id: 9, value: `${userDataCount?.Done}`, label: 'Done' },
                                                                { id: 10, value: `${userDataCount?.Hold}`, label: 'Hold' },
                                                            ],
                                                            innerRadius: 70,
                                                            outerRadius: 96,
                                                            paddingAngle: -2,
                                                            cornerRadius: 0,
                                                            startAngle: -180,
                                                            endAngle: 180,
                                                            cx: 150,
                                                            cy: 150,
                                                        },
                                                    ]}
                                                    width={400}
                                                    height={300}
                                                />
                                            </div>
                                            <div className='scrollable-content my-2'>
                                                <div className='d-flex justify-content-end'>
                                                    <Table className="mb-0 mt-2 add_Color_font" style={{ fontSize: '13px' }}>
                                                        <thead>
                                                            <tr className='text-start'>
                                                                <th className='fw-bold'>#</th>
                                                                <th className='fw-bold'>Task Name</th>
                                                                <th className='fw-bold'>Description</th>
                                                                <th className='fw-bold'>Expected Hours</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {userTaskDetails?.map((ele, ind) => {
                                                                return (
                                                                    <tr className="align-middle text-start" key={ele?._id}>
                                                                        <th scope="row">{ind + 1}</th>
                                                                        <td className="cp">
                                                                            <span className="namelink">{ele?.summary.charAt(0).toUpperCase() + ele?.summary.slice(1)}</span>
                                                                        </td>
                                                                        <td className="w-20">
                                                                            <span className="namelink">{ele?.description.charAt(0).toUpperCase() + ele?.description.slice(1)}</span>
                                                                        </td>
                                                                        <td>
                                                                            <span className="namelink">{ele?.expectedHours}</span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={12} className='border border-1 border-muted'>

                                        </Col>
                                    </>
                                )}
                                {!showTasks && (
                                    <Col sm={6} className='d-flex justify-content-center align-items-center'>
                                        Select a user to get his / her data
                                    </Col>
                                )}
                            </>
                        )}

                    </Row>
                    <Row className='px-3'>
                        <Col sm={6} className='border border-1 border-muted'>
                            <Row className='p-2'>
                                <Col sm={12}>
                                    <h5 className='text-dark'> <strong>Priority Breakdown</strong></h5>
                                </Col>
                                <Col sm={12}>
                                    <Chart options={options} series={series} type="bar" height={350} />
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={6} className='border border-1 border-muted'>
                            <Row className='p-2'>
                                <Col sm={12}>
                                    <h5 className='text-dark'>
                                        <strong>Recent Activity</strong>
                                    </h5>
                                    {/* <h6>
                                        Stay up to date with what"s happening across the project.
                                    </h6> */}
                                </Col>
                                <Col sm={12}>
                                    <div className="scrollable-content" style={{ fontSize: '14px' }}>
                                        {historyResponse && historyResponse.map((item, index) => (
                                            <div key={index} className='d-flex gap-2 align-items-center lh-lg text-nowrap'>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="tooltip1">
                                                            {item?.userId?.firstName}
                                                            {item?.userId?.lastName}
                                                        </Tooltip>
                                                    }>
                                                    <div className="mt-1 cp">
                                                        <span
                                                            style={{
                                                                backgroundColor: '#605e5a',
                                                                borderRadius: '100%',
                                                                padding: '3px 4px',

                                                                color: 'white',
                                                                fontWeight: '600',
                                                            }}>
                                                            {item?.userId?.firstName.charAt(0).toUpperCase()}
                                                            {item?.userId?.lastName.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </OverlayTrigger>
                                                <Link to={generateLink(item.userActivity, item)}
                                                    className='text-dark'>
                                                    <span>
                                                        {item?.userId?.firstName && item.userId.firstName.replace(/^\w/, (c) => c.toUpperCase())} {item?.userId?.lastName && item.userId.lastName.replace(/^\w/, (c) => c.toUpperCase())}
                                                        {item.userActivity === "Created milestone" && <span> created milestone</span>}
                                                        {item.userActivity === "Created Sprint" && <span> created sprint</span>}
                                                        {item.userActivity === "Create Project" && <span> create project</span>}
                                                        {item.userActivity === "Created Task" && <span> created task</span>}
                                                        {' on ' + new Date(item.createdAt).toLocaleDateString() + '.'} {/* Extracting date portion */}
                                                    </span>

                                                </Link>

                                            </div>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        {/* <Col sm={6} className='border border-1 border-muted'>
                            <Row className='p-2'>
                                <Col sm={12}>
                                    <h5 className='text-dark'><strong>All Details</strong></h5>
                                </Col>
                                <Col sm={12}>
                                    <Table className='text-nowrap'>
                                        <tr className='text-start '>
                                            <th className='fw-bold py-2  text-secondary' scope="row">Ongoing Projects</th>
                                            <td className='text-secondary py-2'>{getProjectList.totalCount}</td>
                                        </tr>
                                        <tr className='text-start '>
                                            <th className='fw-bold py-2  text-secondary' scope="row">Total Users</th>
                                            <td className='text-secondary py-2'>{userCount?.totalCount}</td>
                                        </tr>
                                        <tr className='text-start '>
                                            <th className='fw-bold py-2  text-secondary' scope="row">Tasks added in last 7 days</th>
                                            <td className='text-secondary py-2' colspan="2"> {lastWeekCount?.createdCount ? lastWeekCount?.createdCount : '0'}</td>
                                        </tr>
                                        <tr className='text-start '>
                                            <th className='fw-bold py-2  text-secondary' scope="row">Tasks due in last 7 days</th>
                                            <td className='text-secondary py-2' colspan="2">{lastWeekCount?.dueCount ? lastWeekCount?.dueCount : '0'}</td>
                                        </tr>
                                    </Table>
                                </Col>
                            </Row>
                        </Col> */}
                    </Row>
                </Container >
            </div >

        </>
    );
};

export default AdminDashboard;