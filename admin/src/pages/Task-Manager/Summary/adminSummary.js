import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPriorityGraphAction, getAllTaskCountAction, getTaskSummmaryDetail, getTaskWeekCountAction } from '../../../redux/Summary/action';
import { getHistoryAction } from '../../../redux/task/action';
import { getAllProjects } from '../../../redux/projects/action'
import Chart from 'react-apexcharts';
import { ProgressBar, Col, Container, Row, Table } from 'react-bootstrap';
import Loader from '../../../components/Loader'
import HeaderMain from '../header/HeaderMain';
import { PieChart } from '@mui/x-charts/PieChart';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import FilterModal from './modal/filter';
import Pagesaddtask from '../../../layouts/AllPagesRightbar';
import { TbReport } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { getAllUsers } from '../../../redux/user/action'
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
    }, [successHandle, store?.getHistoryReducer?.data?.response]);

    useEffect(() => {
        const taskTotalCount = store?.getTaskSummaryReducer?.data.response;
        // console.log({ taskTotalCount })
        if (taskTotalCount) {
            setTaskCount(taskTotalCount);
        }
    }, [store?.getTaskSummaryReducer?.data.response]);

    const closeaddModal = () => {
        // getalltasks();
    }
    const closefilterModal = () => {
        setFilterModal(false);
    }
    useEffect(() => {
        dispatch(getAllProjects({ status: 1, projectStatus: 'Ongoing' }));
        dispatch(getAllUsers());
        dispatch(getTaskWeekCountAction());
        dispatch(getTaskSummmaryDetail());
        dispatch(getHistoryAction());
        dispatch(getPriorityGraphAction());
        dispatch(getAllTaskCountAction());
    }, [dispatch]);

    const totalTasks = store?.getAllTaskCountReducer?.data;
    // console.log({ totalTasks })
    const getProjectList = store?.getProject?.data;
    // console.log({ getProjectList })
    const userCount = store?.getAllUsers?.data;
    const priorityData = store?.getPriorityGraphReducer?.data?.response;
    // console.log({ priorityData })
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
    return (
        // <>
        //     <div className="pt-4" style={{ background: 'white', }}>
        //         <div className="container-fluid px-5">
        //             <div className="row">
        //                 <div className='col-12 mb-2'>
        //                     <HeaderMain />
        //                 </div>
        //                 <hr />
        //                 <div className='row'>
        //                     <div className='col-12 d-flex gap-2 justify-content-end'>
        //                         <button className='mybutton btn p-1 fw-bold py-1 web_button'
        //                             onClick={() => setFilterModal(true)}>
        //                             Filter
        //                         </button>
        //                         <FilterModal
        //                             className='d-none'
        //                             showFilter={filterModal}
        //                             closeFilter={closefilterModal}
        //                             setfilterModal={setFilterModal} />
        //                         <button
        //                             type="button"
        //                             className="mybutton btn p-1 fw-bold py-1  web_button"
        //                             onClick={() => {
        //                                 // console.log('button click');
        //                                 // handeladdtask()
        //                                 setShowModal(!showModal);
        //                                 // dispatchActions();
        //                                 // dispatch(getAllTask({ projectId: projectId, mileStoneId: milestoneId, sprintId: spriteId }))

        //                             }}>
        //                             Add Task
        //                         </button>
        //                         <Pagesaddtask
        //                             className="d-none"
        //                             showModal={showModal}
        //                             closeModal={closeaddModal}
        //                             setShowModal={setShowModal}
        //                         />
        //                     </div>
        //                     {/* {filterModal && <FilterModal closeModal={() => setFilterModal(false)} />} */}

        //                 </div>
        //                 <div className="col  border_clr m-2   rounded-3 bg-white">
        //                     <Link to='/dashboard/projects'>
        //                         <div className="d-flex  p-4 px-4 align-items-center jusstify-content-center">
        //                             <div className="bg_clr p-3 rounded-circle text-center ">
        //                                 <TbReport className='w-size text-secondary' />
        //                             </div>
        //                             <div className="mx-3 ">
        //                                 <strong>
        //                                     <h5 className="mb-0 mt-1 text-secondary">
        //                                         {getProjectList.totalCount}
        //                                     </h5>

        //                                     <Link to='/dashboard/projects'>
        //                                         <span className="m-0 text-secondary">Ongoing Projects</span>
        //                                     </Link>
        //                                 </strong>
        //                             </div>
        //                         </div>
        //                     </Link>
        //                 </div>
        //                 <div className="col  border_clr  m-2   rounded-3 bg-white">
        //                     <Link to='/dashboard/alluser'>
        //                         <div className="d-flex  p-4 px-4 align-items-center jusstify-content-center">
        //                             <div className="bg_clr  p-3 rounded-circle text-center ">
        //                                 <FaUsers className='w-size text-secondary' />
        //                             </div>
        //                             <div className="mx-3 ">
        //                                 <strong>
        //                                     <h5 className="mb-0 mt-1 text-secondary">
        //                                         {userCount?.totalCount}
        //                                     </h5>
        //                                     <p className="m-0 text-secondary">Total Users</p>
        //                                 </strong>
        //                             </div>
        //                         </div>
        //                     </Link>
        //                 </div>
        //                 <div className="col  border_clr  m-2   rounded-3 bg-white">
        //                     <div className="d-flex  p-4 px-4 align-items-center jusstify-content-center">
        //                         <div className="bg_clr  p-3 rounded-circle text-center ">
        //                             <i className="bi bi-plus-lg w-size " />
        //                         </div>
        //                         <div className="mx-3 ">
        //                             <b>
        //                                 <h5 className="mb-0 mt-1 text-secondary">
        //                                     {lastWeekCount?.createdCount ? lastWeekCount?.createdCount : '0'} Tasks added
        //                                 </h5>
        //                                 <p className="m-0 text-secondary">in last 7 days</p>
        //                             </b>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="col  border_clr  m-2   rounded-3 bg-white">
        //                     <div className="d-flex  p-4 px-4 align-items-center jusstify-content-center">
        //                         <div className="bg_clr  p-3 rounded-circle text-center ">
        //                             <i className="bi bi-calendar-week w-size" />
        //                         </div>
        //                         <div className="mx-3 ">
        //                             <b>
        //                                 <h5 className="mb-0 mt-1 text-secondary">
        //                                     {lastWeekCount?.dueCount ? lastWeekCount?.dueCount : '0'} task due
        //                                 </h5>
        //                             </b>
        //                             <b>
        //                                 <p className="m-0 text-secondary">in the last 7 days</p>
        //                             </b>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="col-12 text-end">
        //                     <Link to='/dashboard/report'>
        //                         View All
        //                     </Link>
        //                 </div>
        //             </div>
        //             <div className="row">
        //                 <div className='col-6  my-2 bg-white'>
        //                     <div className='row border_clr p-4 h-100 rounded-4'>
        //                         <div className='col-12'>
        //                             <h5 className="mb-3">
        //                                 <b>States overview</b>
        //                             </h5>
        //                         </div>
        //                         <div className='col-12'>
        //                             {taskCount !== null && (
        //                                 <PieChart
        //                                     series={[
        //                                         {
        //                                             data: taskCount.map((item, index) => ({
        //                                                 id: index,
        //                                                 value: item.taskCount,
        //                                                 label: item.name,
        //                                             })),
        //                                         },
        //                                     ]}
        //                                     width={500}
        //                                     height={300}
        //                                     colors={['#727cf5', '#0acf97', '#ff00ff', '#fa5c7c', '#ffbc00']}
        //                                 />
        //                             )}

        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="col-6  my-2 px-2  bg-white">
        //                     <div className="p-4 border_clr rounded-4">
        //                         <div className="col-10">
        //                             <h5 className="mb-3">
        //                                 <b>Recent activity</b>
        //                             </h5>
        //                             <h6>Stay up to date with what"s happening across the project.</h6>
        //                         </div>
        //                         <div className="scrollable-content">

        //                             {historyResponse && historyResponse.map((item, index) => (
        //                                 <div key={index} className='d-flex gap-2 align-items-center lh-lg'>
        //                                     <OverlayTrigger
        //                                         placement="top"
        //                                         overlay={
        //                                             <Tooltip id="tooltip1">
        //                                                 {item?.userId?.firstName}
        //                                                 {item?.userId?.lastName}
        //                                             </Tooltip>
        //                                         }>
        //                                         <div className="mt-1 cp">
        //                                             <span
        //                                                 style={{
        //                                                     backgroundColor: '#605e5a',
        //                                                     borderRadius: '100%',
        //                                                     padding: '5px 6px',

        //                                                     color: 'white',
        //                                                     fontWeight: '700',
        //                                                 }}>
        //                                                 {item?.userId?.firstName.charAt(0).toUpperCase()}
        //                                                 {item?.userId?.lastName.charAt(0).toUpperCase()}
        //                                             </span>
        //                                         </div>
        //                                     </OverlayTrigger>
        //                                     <Link to={generateLink(item.userActivity, item)}
        //                                         className='text-dark'>
        //                                         <span>
        //                                             {item?.userId?.firstName} {item?.userId?.lastName}
        //                                             {item.userActivity === "Created milestone" && <span> created milestone</span>}
        //                                             {item.userActivity === "Created Sprint" && <span> created sprint</span>}
        //                                             {item.userActivity === "Create Project" && <span> create project</span>}
        //                                             {item.userActivity === "Created Task" && <span> created task</span>}
        //                                             {' on ' + item?.createdAt}
        //                                         </span>
        //                                     </Link>

        //                                 </div>
        //                             ))}
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="row">
        //                 <div className="col border_clr  m-2 rounded-4 bg-white">
        //                     <div className="p-4 ">
        //                         <div className="col-12">
        //                             <h5 className="mb-3">
        //                                 <b>Priority breakdown</b>
        //                             </h5>
        //                             <Chart options={options} series={series} type="bar" height={350} />
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="col border_clr  m-2 rounded-4 bg-white">
        //                     <div className="p-4 ">
        //                         <div className="col-12">
        //                             <h5 className="mb-3">
        //                                 <b>Types of work</b>
        //                             </h5>
        //                         </div>
        //                         <div className="p-4">
        //                             <div className="row ">
        //                                 <div className="col-5">
        //                                     <p className="text-secondary">Type</p>
        //                                     <div className="d-flex mb-4">
        //                                         <i
        //                                             className="bi bi-check-square-fill mx-2 icon_s"
        //                                             style={{ color: '#59d3ec' }}
        //                                         />
        //                                         <p className="mb-0">Task</p>
        //                                     </div>
        //                                     <div className="d-flex mb-4">
        //                                         <div
        //                                             style={{ backgroundColor: '#59d3ec', color: 'aliceblue' }}
        //                                             className="rounded-2 mx-2">
        //                                             <i className="bi bi-subtract mx-1   " />
        //                                         </div>
        //                                         <p className="mb-0">Sub-task</p>
        //                                     </div>
        //                                     <div className="d-flex mb-4">
        //                                         <div
        //                                             style={{ backgroundColor: '#59d3ec', color: 'aliceblue' }}
        //                                             className="rounded-2 mx-2">
        //                                             <i className="bi bi-gear-wide mx-1" />
        //                                         </div>
        //                                         <p className="mb-0 text-nowrap">Manage types</p>
        //                                     </div>
        //                                 </div>
        //                                 <div className="col-4">
        //                                     <p className="text-secondary">Distribution</p>
        //                                     <div className="progress-w-percent">
        //                                         <span className="progress-value fw-bold">90%</span>
        //                                         <ProgressBar now={90} className="progress-sm" />
        //                                     </div>
        //                                     <div className="progress-w-percent">
        //                                         <span className="progress-value fw-bold">72%</span>
        //                                         <ProgressBar now={72} className="progress-sm" />
        //                                     </div>
        //                                 </div>
        //                                 <div className="col-3">
        //                                     <p className="text-secondary">Count</p>
        //                                     <p className="text-primary  mx-4 mb-4">10</p>
        //                                     <p className="text-primary mx-4 mb-4 pt-3">8</p>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </>
        <>
            <div className='pt-4' style={{ background: 'white' }}>
                <Container fluid className=''>
                    <div className="row">
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
                                        // console.log('button click');
                                        // handeladdtask()
                                        setShowModal(!showModal);
                                        // dispatchActions();
                                        // dispatch(getAllTask({ projectId: projectId, mileStoneId: milestoneId, sprintId: spriteId }))

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
                    <Row className='px-3 py-2'>
                        <Col sm={4} className='border border-1 border-muted'>
                            <Row className=' p-2'>
                                <Col sm={12}>
                                    <h5 className='text-dark'> <strong>All Details </strong></h5>
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
                                <Col sm={12} className="text-end mb-2">
                                    <Link to='/dashboard/report'>
                                        View All
                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={4} className='border border-1 border-muted'>
                            <Row className='p-2'>
                                <div className='col-12'>
                                    <h5 className="mb-3 text-dark">
                                        <strong>Projects Overview</strong>
                                    </h5>
                                </div>
                                <div className='col-12'>
                                    {taskCount !== null && (
                                        <PieChart
                                            series={[
                                                {
                                                    data: taskCount.map((item, index) => ({
                                                        id: index,
                                                        value: item.taskCount,
                                                        label: item.name,
                                                    })),
                                                },
                                            ]}
                                            width={450}
                                            height={300}
                                            colors={['#727cf5', '#0acf97', '#ff00ff', '#fa5c7c', '#ffbc00']}
                                        />
                                    )}

                                </div>
                            </Row>
                        </Col>
                        <Col sm={4} className='border border-1 border-muted'>
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

                    </Row>
                    <Row className='px-3 py-2'>
                        <Col sm={4} className='border border-1  border-muted'>
                            <Row className='p-2'>
                                <Col sm={12}>
                                    <h5 className='text-dark'> <strong>All Details</strong></h5>
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
                                            <th className='fw-bold py-2  text-secondary' scope="row">Total Tasks</th>
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
                        </Col>
                        <Col sm={4} className='border border-1 border-muted'>
                            <Row className='p-2'>
                                <Col sm={12}>
                                    <h5 className='text-dark'> <strong>Priority Breakdown</strong></h5>
                                </Col>
                                <Col sm={12}>
                                    <Chart options={options} series={series} type="bar" height={350} />
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={4} className='border border-1 border-muted'>
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
                        </Col>
                    </Row>
                </Container>
            </div>

        </>
    );
};

export default AdminDashboard;