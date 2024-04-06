import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPriorityGraphAction, getTaskSummmaryDetail, getTaskWeekCountAction } from '../../../redux/Summary/action';
import { getHistoryAction } from '../../../redux/task/action';

import Chart from 'react-apexcharts';
import { ProgressBar } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { PieChart } from '@mui/x-charts/PieChart';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Summary = () => {
    const { projectId, milestoneId, spriteId } = useParams();
    // console.log(projectId, milestoneId, spriteId); // Check if URL parameters are correct
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    // console.log(store); // Check store to see if data is being fetched

    const successHandle = store?.getTaskSummaryReducer;
    const BarGraphHandel = store?.getPriorityGraphReducer;
    const lastWeekCount = store?.getTaskWeekCountReducer?.data?.response;
    const [taskCount, setTaskCount] = useState(null);
    const [historyResponse, setHistoryResponse] = useState(null);

    // console.log(lastWeekCount); // Check if data is being fetched
    const [data, setData] = useState([]);
    // const [barGraphData, setBarGraphData] = useState();
    useEffect(() => {
        if (successHandle?.data?.status === 200) {
            setData(successHandle?.data?.response);
        }
    }, [successHandle]);
    useEffect(() => {
        const taskTotalCount = store?.getTaskSummaryReducer?.data.response;
        if (taskTotalCount) {
            setTaskCount(taskTotalCount);
        }
    }, [store?.getTaskSummaryReducer?.data.response]);


    useEffect(() => {
        const historyData = store?.getHistoryReducer?.data?.response;
        if (historyData) {
            setHistoryResponse(historyData);
        }
    }, [store?.getHistoryReducer?.data?.response]);

    const priorityData = store?.getPriorityGraphReducer?.data?.response;

    console.log({ spriteId })

    useEffect(() => {
        dispatch(getTaskWeekCountAction({ sprintId: spriteId }));
        dispatch(getTaskSummmaryDetail({ sprintId: spriteId }));
        dispatch(getHistoryAction({ sprintId: spriteId }));
        dispatch(getPriorityGraphAction({ sprintId: spriteId }));
        // dispatch(getAllTaskCountAction());
    }, [dispatch]);

    const apexDonutOpts = {
        chart: {
            height: 340,
            type: 'donut',
        },
        labels: data?.map((ele, i) => {
            return ele.name;
        }),
        colors: ['#727cf5', '#0acf97', '#fa5c7c', '#ffbc00'],
        legend: {
            show: false,
        },
        responsive: [
            {
                breakpoint: 376,
                options: {
                    chart: {
                        width: 250,
                        height: 250,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
    };
    //end
    // graph chart
    const options = {
        chart: {
            type: 'bar',
        },
        plotOptions: {
            bar: {
                horizontal: false,
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: priorityData?.map((ele, ind) => ele?.name),
        },
        colors: ['#727cf5', '#0acf97', '#fa5c7c'],
    };

    const series = [
        {
            name: 'Count',
            data: priorityData?.map((ele, ind) => ele?.count),
        },
    ];




    return (
        <>
            <div className="pt-2">
                <div className="all_bg add_height_task">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col  border_clr  m-2 rounded-4 bg-white">
                                <div className="d-flex  p-4  px-4 align-items-center jusstify-content-center">
                                    <div className="bg_clr  p-3 rounded-circle text-center ">
                                        <i className="bi bi-check-lg w-size" />
                                    </div>
                                    <div className="mx-3 ">
                                        <b>
                                            <h5 className="mb-0 mt-1 text-secondary">
                                                {lastWeekCount?.doneCount ? lastWeekCount?.doneCount : '0'} task done
                                            </h5>
                                        </b>
                                        <b>
                                            <p className="m-0 text-secondary">in the last 7 days</p>
                                        </b>
                                    </div>
                                </div>
                            </div>
                            <div className="col  border_clr  m-2 rounded-4 bg-white">
                                <div className="d-flex  p-4 px-4 align-items-center jusstify-content-center">
                                    <div className="bg_clr  p-3 rounded-circle text-center ">
                                        <i className="bi bi-pencil-fill w-size" />
                                    </div>
                                    <div className="mx-3 ">
                                        <b>
                                            <h5 className="mb-0 mt-1 text-secondary">
                                                {lastWeekCount?.updatedCount ? lastWeekCount?.updatedCount : '0'} task
                                                updated
                                            </h5>
                                        </b>
                                        <b>
                                            <p className="m-0 text-secondary">in the last 7 days</p>
                                        </b>
                                    </div>
                                </div>
                            </div>
                            <div className="col  border_clr  m-2 rounded-4 bg-white">
                                <div className="d-flex  p-4 px-4 align-items-center jusstify-content-center">
                                    <div className="bg_clr  p-3 rounded-circle text-center ">
                                        <i className="bi bi-plus-lg w-size " />
                                    </div>
                                    <div className="mx-3 ">
                                        <b>
                                            <h5 className="mb-0 mt-1 text-secondary">
                                                {lastWeekCount?.createdCount ? lastWeekCount?.createdCount : '0'} task Add
                                            </h5>
                                        </b>
                                        <b>
                                            <p className="m-0 text-secondary">in the last 7 days</p>
                                        </b>
                                    </div>
                                </div>
                            </div>
                            <div className="col  border_clr  m-2 rounded-4 bg-white">
                                <div className="d-flex  p-4 px-4 align-items-center jusstify-content-center">
                                    <div className="bg_clr  p-3 rounded-circle text-center ">
                                        <i className="bi bi-calendar-week w-size" />
                                    </div>
                                    <div className="mx-3 ">
                                        <b>
                                            <h5 className="mb-0 mt-1 text-secondary">
                                                {lastWeekCount?.dueCount ? lastWeekCount?.dueCount : '0'} task due
                                            </h5>
                                        </b>
                                        <b>
                                            <p className="m-0 text-secondary">in the last 7 days</p>
                                        </b>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="row"> */}
                        <div className='row p-1'>
                            <div className='col-6 my-2 px-2'>
                                <div className='row border_clr  px-2  bg-white rounded-4 h-100'>
                                    <div className='col-12'>
                                        <h5 className="mb-3">
                                            <b>States overview</b>
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
                                                width={500}
                                                height={300}
                                                colors={['#727cf5', '#0acf97', '#ff00ff', '#fa5c7c', '#ffbc00']}
                                            />
                                        )}

                                    </div>
                                </div>
                            </div>
                            {/* </div> */}
                            <div div className="col-6  my-2 px-2">
                                <div className="p-4 bg-white border_clr rounded-4">
                                    <div className="col-10">
                                        <h5 className="mb-3">
                                            <b>Recent activity</b>
                                        </h5>
                                        <h6>Stay up to date with what"s happening across the project.</h6>
                                    </div>
                                    <div className="scrollable-content">

                                        {historyResponse && historyResponse.map((item, index) => (
                                            <div key={index} className='d-flex gap-2 align-items-center lh-lg'>
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
                                                                padding: '5px 6px',

                                                                color: 'white',
                                                                fontWeight: '700',
                                                            }}>
                                                            {item?.userId?.firstName.charAt(0).toUpperCase()}
                                                            {item?.userId?.lastName.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </OverlayTrigger>
                                                <span>{item?.userId?.firstName + ' ' + item?.userId?.lastName + ' ' + item?.userActivity + ' on ' + item?.createdAt}</span>

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
                                    <h5 className="mb-3">
                                        <b>Priority breakdown</b>
                                    </h5>
                                    <Chart options={options} series={series} type="bar" height={350} />
                                    {/* <Bar data={chartData} options={chartOptions} /> */}

                                </div>
                            </div>
                        </div>
                        <div className="col border_clr  m-2 rounded-4 bg-white">
                            <div className="p-4 ">
                                <div className="col-12">
                                    <h5 className="mb-3">
                                        <b>Types of work</b>
                                    </h5>
                                </div>
                                <div className="p-4">
                                    <div className="row ">
                                        <div className="col-5">
                                            <p className="text-secondary">Type</p>
                                            <div className="d-flex mb-4">
                                                <i
                                                    className="bi bi-check-square-fill mx-2 icon_s"
                                                    style={{ color: '#59d3ec' }}
                                                />
                                                <p className="mb-0">Task</p>
                                            </div>
                                            <div className="d-flex mb-4">
                                                <div
                                                    style={{ backgroundColor: '#59d3ec', color: 'aliceblue' }}
                                                    className="rounded-2 mx-2">
                                                    <i className="bi bi-subtract mx-1   " />
                                                </div>
                                                <p className="mb-0">Sub-task</p>
                                            </div>
                                            <div className="d-flex mb-4">
                                                <div
                                                    style={{ backgroundColor: '#59d3ec', color: 'aliceblue' }}
                                                    className="rounded-2 mx-2">
                                                    <i className="bi bi-gear-wide mx-1" />
                                                </div>
                                                <p className="mb-0 text-nowrap">Manage types</p>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <p className="text-secondary">Distribution</p>
                                            <div className="progress-w-percent">
                                                <span className="progress-value fw-bold">90%</span>
                                                <ProgressBar now={90} className="progress-sm" />
                                            </div>
                                            <div className="progress-w-percent">
                                                <span className="progress-value fw-bold">72%</span>
                                                <ProgressBar now={72} className="progress-sm" />
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <p className="text-secondary">Count</p>
                                            <p className="text-primary  mx-4 mb-4">10</p>
                                            <p className="text-primary mx-4 mb-4 pt-3">8</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
};

export default Summary;
