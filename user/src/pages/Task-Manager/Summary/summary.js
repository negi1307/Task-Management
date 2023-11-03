import React from 'react'
import { Card, ProgressBar } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import {getPriorityTaskBoard,getweekTaskBoard,getTaskStatusCount,getTaskCount} from '../../../redux/Summary/action'
import { useDispatch, useSelector, dispatch } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';

const Summary = () => {
  const store=useSelector(state=>state)
  console.log("priorty dataaaaaaaaaaaaaaaaaa",store)
  const [priorityGraph,setPriorityGraph]=useState([])
  const PriorityGraphDta=store?.getPriorityTaskBoard;
  const weekTaskCount=store?.getWeekCountTaskBoard?.data?.response
  const StatusCount=store?.getTaskStatusCount;
  const TaskCount=store?.getTaskCount?.data?.response
  const [StatusCountDonut,setStatusCount]=useState([])
  console.log("PriorityGraphDtaaa",PriorityGraphDta)
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(getPriorityTaskBoard())
    dispatch(getweekTaskBoard())
    dispatch(getTaskStatusCount())
    dispatch(getTaskCount())
   
    
  },[])
  useEffect(() => {
    if (PriorityGraphDta?.data?.status == 200) {
      setPriorityGraph(PriorityGraphDta?.data?.response)
    }
}, [PriorityGraphDta]);
useEffect(() => {
  if (StatusCount?.data?.status == 200) {
    setStatusCount(StatusCount?.data?.response)
  }
}, [StatusCount]);
const apexDonutOpts = {
  chart: {
      height: 340,
      type: 'donut',
  },
  labels: StatusCountDonut?.map((ele, i) => {
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
  // colors: ['#FF5733', '#FFC300', '#DAF7A6', '#5DADE2', '#AF7AC5'], // Specify different colors for each bar
  dataLabels: {
      enabled: false,
  },
  xaxis: {
      categories: priorityGraph?.map((ele, ind) => ele?.name),
  },
  colors: ['#727cf5', '#0acf97', '#fa5c7c'],
};

const series = [
  {
      name: 'Series 1',
      data: priorityGraph?.map((ele, ind) => ele?.count),
  },
];

const apexDonutData = [44, 55, 41, 17];
  return (
    <div className="all_bg">
    <div className="container">
      <div className="row">
        <div className="col  border_clr  m-2 rounded-4 bg-white">
          <div className="d-flex  p-4">
            <div className="bg_clr  py-3 px-4 rounded-circle text-center ">
              <i className="bi bi-check-lg w-size" />
            </div>
            <div className="mx-3 ">
              <b>
                <h5 className="mb-0 mt-1 text-secondary">{weekTaskCount?.createdCount}</h5>
              </b>
              <b>
                <p className="m-0 text-secondary">createdCount in the last 7 days</p>
              </b>
            </div>
          </div>
        </div>
        <div className="col  border_clr  m-2 rounded-4 bg-white">
          <div className="d-flex  p-4">
            <div className="bg_clr  py-3 px-4 rounded-circle text-center ">
              <i className="bi bi-pencil-fill w-size" />
            </div>
            <div className="mx-3 ">
              <b>
                <h5 className="mb-0 mt-1 text-secondary">{weekTaskCount?.updatedCount}</h5>
              </b>
              <b>
                <p className="m-0 text-secondary">in the last 7 days</p>
              </b>
            </div>
          </div>
        </div>
        <div className="col  border_clr  m-2 rounded-4 bg-white">
          <div className="d-flex  p-4">
            <div className="bg_clr  py-3 px-4 rounded-circle text-center ">
              <i className="bi bi-plus-lg w-size " />
            </div>
            <div className="mx-3 ">
              <b>
                <h5 className="mb-0 mt-1 text-secondary">{weekTaskCount?.dueCount}</h5>
              </b>
              <b>
                <p className="m-0 text-secondary">in the last 7 days</p>
              </b>
            </div>
          </div>
        </div>
        <div className="col  border_clr  m-2 rounded-4 bg-white">
          <div className="d-flex  p-4">
            <div className="bg_clr  py-3 px-4 rounded-circle text-center ">
              <i className="bi bi-calendar-week w-size" />
            </div>
            <div className="mx-3 ">
              <b>
                <h5 className="mb-0 mt-1 text-secondary">{weekTaskCount?.doneCount}</h5>
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
              <h5 className="mb-3"><b>States overview</b></h5>
              <h6>Get a snapshot of the States of your items. <a href className="text-decoration-none">View
                  all items</a></h6>
                 
            </div>
            <div className="chart_div ">
              <div className="donut-chart">
              <Chart
                    options={apexDonutOpts}
                    series={StatusCountDonut?.map((ele, i) => {
                                            return ele.count;
                                        })}
                    type="donut"
                    height={222}
                    className="apex-charts mb-4 mt-4"
                />
                <ul className="legend mx-4">
                  {/* <li><span className="color" style={{backgroundColor: 'rgb(217, 216, 216)'}} />Open
                  </li> */}
                  <li><span className="color" style={{backgroundColor: 'rgb(244, 108, 108)'}} />To-do
                  
                  </li>
                  <li><span className="color" style={{backgroundColor: 'rgb(100, 100, 245)'}} />In
                    Progress</li>
                  <li><span className="color" style={{backgroundColor: 'rgb(187, 125, 245)'}} />In
                    Review</li>
                  {/* <li><span className="color" style={{backgroundColor: '#71d871'}} />Cancelled</li> */}
                  <li><span className="color" style={{backgroundColor: '#59d3ec'}} />done</li>
                  {/* <li><span className="color" style={{backgroundColor: '#f1cc36'}} />Rejected</li> */}
                  <li><b>Total</b></li>
                </ul>
              </div>
              <div className="donut-chart2">
                <ul className="legend ">
                {StatusCountDonut?.map((item,index)=> <li><span className="text-primary">{item?.count}</span></li>)}

                
                 
             
             
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col border_clr  m-2 rounded-4 bg-white">
          <div className="p-4 ">
            <div className="col-10">
              <h5 className="mb-3"><b>Recent activity</b></h5>
              <h6>Stay up to date with what"s happening across the project.</h6>
            </div>
            <div className="scrollable-content">
              <div className="col-10 mt-4">
                <div className="sticky-top bg-white">
                  <p className="text-secondary day_date "><b> WEDNESDAY,11 OCTOBER 2023 </b></p>
                </div>
                <div className="row">
                  <div className="col-2">
                    <div className="bg-dark rounded-circle text-center ">
                      <h6 className="text-white mb-0 p-3">NN</h6>
                    </div>
                  </div>
                  <div className="col-10"><a href className="text-decoration-none mx-1">Nisha
                      Negi</a>changed
                    the
                    status to Done on <i className="bi bi-check-square-fill" style={{color: '#59d3ec'}} /> <a href className="text-decoration-none">TAS-1 -
                      ertyuiopiuygfdghjkl;</a>
                    <p className="text-secondary">8 days ago</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <div className="bg-dark rounded-circle text-center ">
                      <h6 className="text-white mb-0 p-3">NN</h6>
                    </div>
                  </div>
                  <div className="col-10"><a href className="text-decoration-none mx-1">Nisha
                      Negi</a>changed
                    the
                    status to Done on <i className="bi bi-check-square-fill" style={{color: '#59d3ec'}} /> <a href className="text-decoration-none">TAS-1 -
                      ertyuiopiuygfdghjkl;</a>
                    <p className="text-secondary">8 days ago</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <div className="bg-dark rounded-circle text-center ">
                      <h6 className="text-white mb-0 p-3">NN</h6>
                    </div>
                  </div>
                  <div className="col-10"><a href className="text-decoration-none mx-1">Nisha
                      Negi</a>changed
                    the
                    status to Done on <i className="bi bi-check-square-fill" style={{color: '#59d3ec'}} /> <a href className="text-decoration-none">TAS-1 -
                      ertyuiopiuygfdghjkl;</a>
                    <p className="text-secondary">8 days ago</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <div className="bg-dark rounded-circle text-center ">
                      <h6 className="text-white mb-0 p-3">NN</h6>
                    </div>
                  </div>
                  <div className="col-10"><a href className="text-decoration-none mx-1">Nisha
                      Negi</a>changed
                    the
                    status to Done on <i className="bi bi-check-square-fill" style={{color: '#59d3ec'}} /> <a href className="text-decoration-none">TAS-1 -
                      ertyuiopiuygfdghjkl;</a>
                    <p className="text-secondary">8 days ago</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <div className="bg-dark rounded-circle text-center ">
                      <h6 className="text-white mb-0 p-3">NN</h6>
                    </div>
                  </div>
                  <div className="col-10"><a href className="text-decoration-none mx-1">Nisha
                      Negi</a>changed
                    the
                    status to Done on <i className="bi bi-check-square-fill" style={{color: '#59d3ec'}} /> <a href className="text-decoration-none">TAS-1 -
                      ertyuiopiuygfdghjkl;</a>
                    <p className="text-secondary">8 days ago</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <div className="bg-dark rounded-circle text-center ">
                      <h6 className="text-white mb-0 p-3">NN</h6>
                    </div>
                  </div>
                  <div className="col-10"><a href className="text-decoration-none mx-1">Nisha
                      Negi</a>changed
                    the
                    status to Done on <i className="bi bi-check-square-fill" style={{color: '#59d3ec'}} /> <a href className="text-decoration-none">TAS-1 -
                      ertyuiopiuygfdghjkl;</a>
                    <p className="text-secondary">8 days ago</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <div className="bg-dark rounded-circle text-center ">
                      <h6 className="text-white mb-0 p-3">NN</h6>
                    </div>
                  </div>
                  <div className="col-10"><a href className="text-decoration-none mx-1">Nisha
                      Negi</a>changed
                    the
                    status to Done on <i className="bi bi-check-square-fill" style={{color: '#59d3ec'}} /> <a href className="text-decoration-none">TAS-1 -
                      ertyuiopiuygfdghjkl;</a>
                    <p className="text-secondary">8 days ago</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <div className="bg-dark rounded-circle text-center ">
                      <h6 className="text-white mb-0 p-3">NN</h6>
                    </div>
                  </div>
                  <div className="col-10"><a href className="text-decoration-none mx-1">Nisha
                      Negi</a>changed
                    the
                    status to Done on <i className="bi bi-check-square-fill" style={{color: '#59d3ec'}} /> <a href className="text-decoration-none">TAS-1 -
                      ertyuiopiuygfdghjkl;</a>
                    <p className="text-secondary">8 days ago</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <div className="bg-dark rounded-circle text-center ">
                      <h6 className="text-white mb-0 p-3">NN</h6>
                    </div>
                  </div>
                  <div className="col-10"><a href className="text-decoration-none mx-1">Nisha
                      Negi</a>changed
                    the
                    status to Done on <i className="bi bi-check-square-fill" style={{color: '#59d3ec'}} /> <a href className="text-decoration-none">TAS-1 -
                      ertyuiopiuygfdghjkl;</a>
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
              <h5 className="mb-3"><b>Priority breakdown</b></h5>
              <h6>You"ll need to create a few items before you can start prioritizing work. <a href className="text-decoration-none">
                  Create an item</a></h6>
                  <Chart options={options} series={series} type="bar" height={350} />
            </div>
          </div>
        </div>
        <div className="col border_clr  m-2 rounded-4 bg-white">
          <div className="p-4 ">
            <div className="col-12">
              <h5 className="mb-3"><b>Types of work</b></h5>
              <h6>You"ll need to create a few items for your project to get started . <a href className="text-decoration-none">
                  Create an item</a></h6>
                  <h4>Task Count: {TaskCount?.tasksCount}</h4>
            </div>
            <div className="p-4">
              <div className="row ">
                <div className="col">
                  <p className="text-secondary">Type</p>  
                  <div className="d-flex mb-4">
                    <i className="bi bi-check-square-fill mx-2 icon_s" style={{color: '#59d3ec'}} />
                    <p className="mb-0">Task</p>
                  </div>
                  <div className="d-flex mb-4">
                    <div style={{backgroundColor: '#59d3ec', color: 'aliceblue'}} className="rounded-2 mx-2">
                      <i className="bi bi-subtract mx-1   " /> 
                    </div>
                    <p className="mb-0">Sub-task</p>
                  </div>
                  <div className="d-flex mb-4">
                    <div style={{backgroundColor: '#59d3ec', color: 'aliceblue'}} className="rounded-2 mx-2">
                      <i className="bi bi-gear-wide mx-1" />
                    </div>
                    <p className="mb-0">Manage types</p>
                  </div>
                </div>
                <div className="col">
                  <p className="text-secondary">Distribution</p>
                  <div className="progress-w-percent">
                        <span className="progress-value fw-bold">0%</span>
                        <ProgressBar now={72} className="progress-sm" />
                    </div>
                    <div className="progress-w-percent">
                        <span className="progress-value fw-bold">0%</span>
                        <ProgressBar now={72} className="progress-sm" />
                    </div>
                </div>
                <div className="col ">
                  <p className="text-secondary">Count</p>
                  <p className="text-primary  mx-4 mb-4">0</p>
                  <p className="text-primary mx-4 mb-4 pt-3">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  )
}

export default Summary