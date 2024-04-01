import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPriorityGraphAction, getAllTaskCountAction, getTaskSummmaryDetail, getTaskWeekCountAction } from '../../../redux/Summary/action';
import { getHistoryAction } from '../../../redux/task/action';
import Chart from 'react-apexcharts';
import { ProgressBar } from 'react-bootstrap';
import Loader from '../../../components/Loader'
import HeaderMain from '../header/HeaderMain';
import { PieChart } from '@mui/x-charts/PieChart';

const AdminDashboard = () => {
    const { projectId, milestoneId, spriteId } = useParams();

    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [historyResponse, setHistoryResponse] = useState(null);
    const [userData, setUserData] = useState(null);
    const [skip, setSkip] = useState(1);

    // const [skip, setSkip] = useState(1);


    const successHandle = store?.getTaskSummaryReducer;
    const BarGraphHandel = store?.getPriorityGraphReducer;
    const lastWeekCount = store?.getTaskWeekCountReducer?.data?.response;


    const [taskCount, setTaskCount] = useState(null);
    const [data, setData] = useState([]);
    useEffect(() => {
        if (successHandle?.data?.status === 200) {
            setData(successHandle?.data?.response);
        }
    }, [successHandle]);

    useEffect(() => {
        const historyData = store?.getHistoryReducer?.data?.response;
        if (historyData) {
            setHistoryResponse(historyData);
        }
    }, [store?.getHistoryReducer?.data?.response]);
    useEffect(() => {
        const taskTotalCount = store?.getTaskSummaryReducer?.data.response;
        if (taskTotalCount) {
            setTaskCount(taskTotalCount);
        }
    }, [store?.getTaskSummaryReducer?.data.response]);

    // if (taskCount !== null) {
    //     console.log(taskCount, '///task');
    // }


    useEffect(() => {
        dispatch(getTaskWeekCountAction());
        dispatch(getTaskSummmaryDetail());
        dispatch(getHistoryAction());
        dispatch(getPriorityGraphAction());
        dispatch(getAllTaskCountAction());
    }, [dispatch]);
    const priorityData = store?.getPriorityGraphReducer?.data?.response;


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
        <>
            <div className="bg-white pt-4">
                <div className="container">
                    <div className="row">
                        <div className='col-12 mb-2'>
                            <HeaderMain />
                        </div>
                        <div className="col  border_clr m-2 rounded-4 bg-white">
                            <div className="d-flex  p-4 px-4 align-items-center jusstify-content-center">
                                <div className="bg_clr p-3 rounded-circle text-center ">
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
                        <div className='col border_clr  m-2 rounded-4 bg-white'>
                            <div className='row'>
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
                                            height={200}
                                            colors={['#727cf5', '#0acf97', '#ff00ff', '#fa5c7c', '#ffbc00']}
                                        />
                                    )}

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
                                    {historyResponse && historyResponse.map((item, index) => (
                                        <p key={index}>{item?.userId?.firstName + ' ' + item?.userId?.lastName + ' ' + item?.userActivity + ' on ' + item?.createdAt}</p>

                                    ))}
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
