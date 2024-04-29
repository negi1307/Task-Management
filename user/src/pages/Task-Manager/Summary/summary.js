import React from 'react'
import { Card, ProgressBar } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { getPriorityTaskBoard, getTaskCount } from '../../../redux/Summary/action';
import { useDispatch, useSelector, dispatch } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import { getAllTask, getHistoryAction } from '../../../redux/actions';
import { useParams } from 'react-router-dom';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Table } from '@mui/material';
import { MdOutlinePending } from "react-icons/md";


const Summary = () => {
    const { projectId, milestoneId, spriteId } = useParams();
    const store = useSelector(state => state)
    const weekTaskCount = store?.getWeekCountTaskBoard?.data?.response;
    const priorityTaskCount = store?.getPriorityTaskBoard?.data?.response;
    // console.log({ priorityTaskCount })
    const TaskCount = store?.getTaskCount?.data?.response
    const dispatch = useDispatch()
    const assigneeId = localStorage.getItem('userId')
    const tasks = store?.getAllTaskReducer?.data.Response;
    const [historyResponse, setHistoryResponse] = useState(null);
    useEffect(() => {
        dispatch(getAllTask({ sprintId: spriteId, searchString: '', assigneeId: assigneeId }));
        dispatch(getTaskCount({ sprintId: spriteId }));
        dispatch(getPriorityTaskBoard({ sprintId: spriteId }));
        dispatch(getHistoryAction())
    }, []);
    useEffect(() => {
        const historyData = store?.getHistoryReducer?.data?.response;
        if (historyData) {
            setHistoryResponse(historyData);
        }
    })
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
            categories: priorityTaskCount?.map((ele, ind) => ele?.name),
        },
    };

    const series = [
        {
            name: 'Count',
            data: priorityTaskCount?.map((ele, ind) => ele?.count),
        },
    ];

    // function generateLink(userActivity, item) {
    //     switch (userActivity) {
    //         case "Created milestone":
    //             return `/dashboard/projects/${item?.sprintId?.projectId}`;
    //         case "Created Sprint":
    //             return `/dashboard/singleMilestonesprint/${item?.sprintId?.projectId}/${item?.milestoneId?._id}`;
    //         case "Created Task":
    //             return `/dashboard/taskBord/projectId=${item?.sprintId?.projectId}&milestoneId=${item?.milestoneId?._id}&spriteId=${item?.sprintId?._id}`;
    //         case "Create Project":
    //             return "/dashboard/projects";
    //         default:
    //             return "/dashboard/adminsummary";
    //     }
    // }
    return (
        <div className="all_bg add_height_task" style={{ height: '100%' }}>
            <div className="container">
                <div className="row">
                    <div className="col  border_clr  m-2 rounded-4 bg-white date">
                        <div className="d-flex flex-column justify-content-center countstatus">
                            <div className="bg_clrr bg_info_clr2">
                                <i class="fa fa-plus" aria-hidden="true"></i>
                            </div>
                            <div className="mx-3 ">
                                <h5 className="mb-0 mt-1 text-secondary count">
                                    {' '}
                                    {TaskCount?.tasksCount} <span>total tasks</span>
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div className="col  border_clr  m-2 rounded-4 bg-white date">
                        <div className="d-flex justify-content-center flex-column countstatus">
                            <div className="bg_clrr bg_info_clr4 ">
                                <i class="fa fa-calendar" aria-hidden="true"></i>
                            </div>
                            <div className="mx-3 text-start">
                                <h5 className="mb-0 mt-1 text-secondary count">
                                    {tasks?.todoCount} <span>tasks todo</span>
                                </h5>
                            </div>
                        </div>

                    </div>
                    <div className="col  border_clr  m-2 rounded-4 bg-white date">
                        <div className="d-flex justify-content-center flex-column countstatus">
                            <div className="bg_clrr bg_info_clr ">
                                <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            <div className="mx-3 class_info text-start">
                                <h5 className="mb-0 mt-1 text-secondary count">
                                    {tasks?.doneCount} <span>tasks done</span>
                                </h5>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col  border_clr  m-2 rounded-4 bg-white date">
                        <div className="d-flex countstatus ">
                            <div className="bg_clrr bg_info_clr3">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </div>
                            <div className="mx-3 ">
                                <h5 className="mb-0 mt-1 text-secondary count">
                                    {' '}
                                    {weekTaskCount?.updatedCount} <span>Updated</span>
                                </h5>
                            </div>
                        </div>

                        <p className="m-0 text-secondary">Count in the last 7 days</p>
                    </div> */}
                    <div className="col  border_clr  m-2 rounded-4 bg-white date">
                        <div className="d-flex flex-column justify-content-center countstatus">
                            <div className="bg_clrr bg_info_clr2">
                                <MdOutlinePending />
                            </div>
                            <div className="mx-3 ">
                                <h5 className="mb-0 mt-1 text-secondary count">
                                    {' '}
                                    {tasks?.holdCount} <span>tasks due</span>
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col border_clr  m-2 rounded-4 bg-white">
                        <div className="p-4 ">
                            <div className="col-10">
                                <h5 className="mb-3 states">States overview</h5>
                            </div>
                            <div className="chart_div ">
                                <div className="donut-chart">
                                    <PieChart
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: `${tasks?.todoCount}`, label: 'Todo', color: '#ADD8E6' },
                                                    { id: 1, value: `${tasks?.testingCount}`, label: 'Testing', color: '#90EE90' },
                                                    { id: 2, value: `${tasks?.inProgressCount}`, label: 'In-progress', color: '#FFFF00' },
                                                    { id: 3, value: `${tasks?.doneCount}`, label: 'Done', color: '#008000' },
                                                    { id: 4, value: `${tasks?.holdCount}`, label: 'Hold', color: '#FFA500' }
                                                ],
                                                highlightScope: { faded: 'global', highlighted: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                            },
                                        ]}
                                        height={250}
                                        width={600}
                                    />
                                </div>
                                <div className="donut-chart2">
                                    <ul className="legend ">
                                        {/* {StatusCountDonut?.map((item, index) => (
                                            <li>
                                                <span className="text-primary">{item?.count}</span>
                                            </li>
                                        ))} */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col border_clr  m-2 rounded-4 bg-white">
                        <div className="p-4 ">
                            <div className="col-10">
                                <h5 className="mb-3 states">Recent activity</h5>
                            </div>
                            <div className="scrollable-content">
                                <div className="col-10 mt-4">
                                    <div className="sticky-top bg-white">
                                        <p className="text-secondary day_date ">
                                            <b> WEDNESDAY,11 OCTOBER 2023 </b>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-12">
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
                                            <span>
                                                {item?.userId?.firstName && item.userId.firstName.replace(/^\w/, (c) => c.toUpperCase())} {item?.userId?.lastName && item.userId.lastName.replace(/^\w/, (c) => c.toUpperCase())}
                                                {item.userActivity === "Created milestone" && <span> created milestone</span>}
                                                {item.userActivity === "Created Sprint" && <span> created sprint</span>}
                                                {item.userActivity === "Create Project" && <span> create project</span>}
                                                {item.userActivity === "Created Task" && <span> created task</span>}
                                                {' on ' + new Date(item.createdAt).toLocaleDateString() + '.'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col border_clr  m-2 rounded-4 bg-white">
                        <div className="p-4 ">
                            <div className="col-12">
                                <h5 className="mb-3 states">Priority breakdown</h5>
                                <Chart options={options} series={series} type="bar" height={350} />
                                {/* <Chart options={options} series={series} type="bar" height={350} /> */}
                            </div>
                        </div>
                    </div>
                    {/* <div className="col border_clr  m-2 rounded-4 bg-white">
                        <div className="p-4 ">
                            <div className="col-12">
                                <h5 className="mb-3 states">Types of work</h5>

                                <h4>Task Count: {TaskCount?.tasksCount}</h4>
                            </div>
                            <div className="p-4">
                                <div className="row ">
                                    <Table className='text-nowrap lh-lg'>
                                        <thead>
                                            <tr>
                                                <th className='text-start'>Task</th>
                                                <th className='text-start'>Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className='text-start'>Todo</td>
                                                <td className='text-start'>{tasks?.todoCount}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-start'>In-progress</td>
                                                <td className='text-start'>{tasks?.inProgressCount}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-start'>Testing</td>
                                                <td className='text-start'>{tasks?.testingCount}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-start'>Done</td>
                                                <td className='text-start'>{tasks?.doneCount}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-start'>Hold</td>
                                                <td className='text-start'>{tasks?.holdCount}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Summary