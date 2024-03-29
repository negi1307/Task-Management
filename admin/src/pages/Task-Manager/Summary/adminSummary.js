import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPriorityGraphAction, getTaskSummmaryDetail, getTaskWeekCountAction } from '../../../redux/Summary/action';
import { getHistoryAction } from '../../../redux/task/action'
import Chart from 'react-apexcharts';
import { ProgressBar } from 'react-bootstrap';
import HeaderMain from '../header/HeaderMain';


const AdminDashboard = () => {
    const { projectId, milestoneId, spriteId } = useParams();
    // console.log(projectId, milestoneId, spriteId); // Check if URL parameters are correct

    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    // console.log(store); // Check store to see if data is being fetched

    const successHandle = store?.getTaskSummaryReducer;
    const BarGraphHandel = store?.getPriorityGraphReducer;
    const lastWeekCount = store?.getTaskWeekCountReducer?.data?.response;


    // console.log(lastWeekCount); // Check if data is being fetched
    const [data, setData] = useState([]);
    // const [barGraphData, setBarGraphData] = useState();
    useEffect(() => {
        if (successHandle?.data?.status === 200) {
            setData(successHandle?.data?.response);
        }
    }, [successHandle]);

    const priorityData = store?.getPriorityGraphReducer?.data?.response;
    const userName =
        useEffect(() => {
            dispatch(getTaskSummmaryDetail());
            dispatch(getPriorityGraphAction());
            dispatch(getTaskWeekCountAction());
            dispatch(getHistoryAction());

        }, [dispatch]);


    // const changeCreator =
    // useEffect(() => {
    //     if (store?.getPriorityGraphReducer?.data) {
    //         const priorityData = store?.getPriorityGraphReducer?.data?.response;
    //         setBarGraphData(priorityData)
    //     }
    // }, [store?.getPriorityGraphReducer?.data]);

    // console.log(priorityData, 'join');
    // const firstThreeNames = priorityData.slice(0, 3).map(item => item.name).join(', ');
    // console.log(firstThreeNames);

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
        colors: ['#727cf5', '#0acf97', '#fa5c7c', '#fff'],
    };

    const series = [
        {
            name: 'Count',
            data: priorityData?.map((ele, ind) => ele?.count),
        },
    ];




    return (
        <>
            <div className="bg-white pt-4">
                <div className="container">
                    <div className="row">
                        <div className='col-12 mb-2'>
                            <HeaderMain />
                        </div>
                        <div className="col  border_clr  m-2 rounded-4 bg-white">
                            <div className="d-flex  p-4  px-4 align-items-center jusstify-content-center">
                                <div className="bg_clr  p-3 rounded-circle text-center ">
                                    <i className="bi bi-check-lg w-size" />
                                </div>
                                <div className="mx-3 ">
                                    <strong>
                                        <h5 className="mb-0 mt-1 text-secondary">
                                            {lastWeekCount?.doneCount ? lastWeekCount?.doneCount : '0'} task done
                                        </h5>
                                    </strong>
                                    <strong>
                                        <p className="m-0 text-secondary">in the last 7 days</p>
                                    </strong>
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
                    <div className="row">
                        <div className="col border_clr  m-2 rounded-4 bg-white">
                            <div className="p-4 ">
                                <div className="col-10">
                                    <h5 className="mb-3">
                                        <b>States overview</b>
                                    </h5>
                                </div>
                                <div className="chart_div ">
                                    <div className="donut-chart">
                                        <Chart
                                            options={apexDonutOpts}
                                            series={data?.map((ele, i) => {
                                                return ele.count;
                                            })}
                                            type="donut"
                                            height={222}
                                            className="apex-charts mb-4 mt-4"
                                        />

                                        <ul className="legend mx-4">
                                            <li className='fs-6 fw-bold text-black'>
                                                <span className="color rounded-5" style={{ backgroundColor: '#727cf5' }} />
                                                To Do
                                            </li>
                                            <li className='fs-6 fw-bold text-black'>
                                                <span className="color rounded-5" style={{ backgroundColor: '#0acf97' }} /> In
                                                Progress
                                            </li>
                                            <li className='fs-6 fw-bold text-black'>
                                                <span className="color rounded-5" style={{ backgroundColor: '#FF00FF' }} />
                                                Testing
                                            </li>
                                            <li className='fs-6 fw-bold text-black'>
                                                <span className="color rounded-5" style={{ backgroundColor: '#fa5c7c' }} />
                                                Hold
                                            </li>
                                            <li className='fs-6 fw-bold text-black'>
                                                <span className="color rounded-5" style={{ backgroundColor: '#ffbc00' }} />
                                                Done
                                            </li>
                                        </ul>
                                        <ul>
                                            {data?.map((ele, i) => {
                                                return <li className="mb-2">{ele.count}</li>;
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col border_clr  m-2 rounded-4 bg-white">
                            <div className="p-4 ">
                                <div className="col-10">
                                    <h5 className="mb-3">
                                        <b>Recent activity</b>
                                    </h5>
                                    <h6>Stay up to date with what"s happening across the project.</h6>
                                </div>
                                <div className="scrollable-content">
                                    <div className="col-10 mt-4">
                                        <div className="sticky-top bg-white">
                                            <p className="text-secondary day_date ">
                                                <b> WEDNESDAY,11 OCTOBER 2023 </b>
                                            </p>
                                        </div>
                                        <div className="row">
                                            <div className="col-2">
                                                <div className="bg-dark rounded-circle text-center ">
                                                    <h6 className="text-white mb-0 p-2 py-3">NN</h6>
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <a href className="text-decoration-none mx-1">
                                                    Nisha Negi
                                                </a>
                                                changed the status to Done on{' '}
                                                <i className="bi bi-check-square-fill" style={{ color: '#59d3ec' }} />{' '}
                                                <a href className="text-decoration-none">
                                                    TAS-1 - ertyuiopiuygfdghjkl;
                                                </a>
                                                <p className="text-secondary">8 days ago</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-2">
                                                <div className="bg-dark rounded-circle text-center ">
                                                    <h6 className="text-white mb-0 p-2 py-3">NN</h6>
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <a href className="text-decoration-none mx-1">
                                                    Nisha Negi
                                                </a>
                                                changed the status to Done on{' '}
                                                <i className="bi bi-check-square-fill" style={{ color: '#59d3ec' }} />{' '}
                                                <a href className="text-decoration-none">
                                                    TAS-1 - ertyuiopiuygfdghjkl;
                                                </a>
                                                <p className="text-secondary">8 days ago</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-2">
                                                <div className="bg-dark rounded-circle text-center ">
                                                    <h6 className="text-white mb-0 p-2 py-3">NN</h6>
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <a href className="text-decoration-none mx-1">
                                                    Nisha Negi
                                                </a>
                                                changed the status to Done on{' '}
                                                <i className="bi bi-check-square-fill" style={{ color: '#59d3ec' }} />{' '}
                                                <a href className="text-decoration-none">
                                                    TAS-1 - ertyuiopiuygfdghjkl;
                                                </a>
                                                <p className="text-secondary">8 days ago</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-2">
                                                <div className="bg-dark rounded-circle text-center ">
                                                    <h6 className="text-white mb-0 p-2 py-3">NN</h6>
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <a href className="text-decoration-none mx-1">
                                                    Nisha Negi
                                                </a>
                                                changed the status to Done on{' '}
                                                <i className="bi bi-check-square-fill" style={{ color: '#59d3ec' }} />{' '}
                                                <a href className="text-decoration-none">
                                                    TAS-1 - ertyuiopiuygfdghjkl;
                                                </a>
                                                <p className="text-secondary">8 days ago</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-2">
                                                <div className="bg-dark rounded-circle text-center ">
                                                    <h6 className="text-white mb-0 p-2 py-3">NN</h6>
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <a href className="text-decoration-none mx-1">
                                                    Nisha Negi
                                                </a>
                                                changed the status to Done on{' '}
                                                <i className="bi bi-check-square-fill" style={{ color: '#59d3ec' }} />{' '}
                                                <a href className="text-decoration-none">
                                                    TAS-1 - ertyuiopiuygfdghjkl;
                                                </a>
                                                <p className="text-secondary">8 days ago</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-2">
                                                <div className="bg-dark rounded-circle text-center ">
                                                    <h6 className="text-white mb-0 p-2 py-3">NN</h6>
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <a href className="text-decoration-none mx-1">
                                                    Nisha Negi
                                                </a>
                                                changed the status to Done on{' '}
                                                <i className="bi bi-check-square-fill" style={{ color: '#59d3ec' }} />{' '}
                                                <a href className="text-decoration-none">
                                                    TAS-1 - ertyuiopiuygfdghjkl;
                                                </a>
                                                <p className="text-secondary">8 days ago</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-2">
                                                <div className="bg-dark rounded-circle text-center ">
                                                    <h6 className="text-white mb-0 p-2 py-3">NN</h6>
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <a href className="text-decoration-none mx-1">
                                                    Nisha Negi
                                                </a>
                                                changed the status to Done on{' '}
                                                <i className="bi bi-check-square-fill" style={{ color: '#59d3ec' }} />{' '}
                                                <a href className="text-decoration-none">
                                                    TAS-1 - ertyuiopiuygfdghjkl;
                                                </a>
                                                <p className="text-secondary">8 days ago</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-2">
                                                <div className="bg-dark rounded-circle text-center ">
                                                    <h6 className="text-white mb-0 p-2 py-3">NN</h6>
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <a href className="text-decoration-none mx-1">
                                                    Nisha Negi
                                                </a>
                                                changed the status to Done on{' '}
                                                <i className="bi bi-check-square-fill" style={{ color: '#59d3ec' }} />{' '}
                                                <a href className="text-decoration-none">
                                                    TAS-1 - ertyuiopiuygfdghjkl;
                                                </a>
                                                <p className="text-secondary">8 days ago</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-2">
                                                <div className="bg-dark rounded-circle text-center ">
                                                    <h6 className="text-white mb-0 p-2 py-3">NN</h6>
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <a href className="text-decoration-none mx-1">
                                                    Nisha Negi
                                                </a>
                                                changed the status to Done on{' '}
                                                <i className="bi bi-check-square-fill" style={{ color: '#59d3ec' }} />{' '}
                                                <a href className="text-decoration-none">
                                                    TAS-1 - ertyuiopiuygfdghjkl;
                                                </a>
                                                <p className="text-secondary">8 days ago</p>
                                            </div>
                                        </div>
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
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
