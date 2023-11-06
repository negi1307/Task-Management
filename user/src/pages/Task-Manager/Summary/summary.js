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
        <div className="col  border_clr  m-2 rounded-4 bg-white date">
          <div className="d-flex countstatus">
            <div className="bg_clrr bg_info_clr ">
            <i class="fa fa-check" aria-hidden="true"></i>
            </div>
            <div className="mx-3 class_info ">
            
                <h5 className="mb-0 mt-1 text-secondary count">
                
               {weekTaskCount?.doneCount}  <span>Done</span></h5>
            </div>
          
          </div>
          <p className="m-0 text-secondary">
                 Count in the last 7 days</p>
        </div>
        <div className="col  border_clr  m-2 rounded-4 bg-white date">
          <div className="d-flex countstatus">
            <div className="bg_clrr bg_info_clr2">
            <i class="fa fa-plus" aria-hidden="true"></i>
            </div>
            <div className="mx-3 ">
                <h5 className="mb-0 mt-1 text-secondary count">  {weekTaskCount?.createdCount}  <span>Created</span></h5>
            </div>
          </div>
          <p className="m-0 text-secondary">Count in the last 7 days</p>
        </div>
        <div className="col  border_clr  m-2 rounded-4 bg-white date">
          <div className="d-flex countstatus ">
            <div className="bg_clrr bg_info_clr3">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </div>
            <div className="mx-3 ">
            
                <h5 className="mb-0 mt-1 text-secondary count"> {weekTaskCount?.updatedCount}  <span>Updated</span></h5>
          
            
            </div>
          </div>
          
          <p className="m-0 text-secondary">
               Count in the last 7 days</p>
        </div>
        <div className="col  border_clr  m-2 rounded-4 bg-white date">
          <div className="d-flex countstatus">
            <div className="bg_clrr bg_info_clr4 ">
            <i class="fa fa-calendar" aria-hidden="true"></i>
            </div>
            <div className="mx-3 ">
              
                <h5 className="mb-0 mt-1 text-secondary count">{weekTaskCount?.dueCount}  <span>Due</span></h5>
              
            
              
            </div>
          </div>
          
          <p className="m-0 text-secondary">
           
          Count in the last 7 days</p>
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
              <Chart
                    options={apexDonutOpts}
                    series={StatusCountDonut?.map((ele, i) => {
                                            return ele.count;
                                        })}
                    type="donut"
                    height={222}
                    className="apex-charts mb-4 mt-4"
                />
                <ul className="legend">
                  {/* <li><span className="color" style={{backgroundColor: 'rgb(217, 216, 216)'}} />Open
                  </li> */}
                  <li><span className="color" style={{backgroundColor: 'rgb(244, 108, 108)'}} />To-do
                  
                  </li>
                  <li><span className="color" style={{backgroundColor: 'rgb(100, 100, 245)'}} />In
                    Progress</li>
                  <li><span className="color" style={{backgroundColor: 'rgb(187, 125, 245)'}} />Hold</li>
                  {/* <li><span className="color" style={{backgroundColor: '#71d871'}} />Cancelled</li> */}
                  <li><span className="color" style={{backgroundColor: '#59d3ec'}} />done</li>
                  {/* <li><span className="color" style={{backgroundColor: '#f1cc36'}} />Rejected</li> */}
                  
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
              <h5 className="mb-3 states">Recent activity</h5>
             
            </div>
            <div className="scrollable-content">
              <div className="col-10 mt-4">
                <div className="sticky-top bg-white">
                  <p className="text-secondary day_date "><b> WEDNESDAY,11 OCTOBER 2023 </b></p>
                </div>
                <div className="row">
                  <div className="col-2">
                    <div className="bg-dark rounded-circle text-center ">
                    <p className='p-2 mt-1 text-white'>HH</p>  
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
                    <p className='p-2 mt-1 text-white'>HH</p>  
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
                    <p className='p-2 mt-1 text-white'>HH</p>  
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
                    <p className='p-2 mt-1 text-white'>HH</p>  
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
                    <p className='p-2 mt-1 text-white'>HH</p>  
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
                    <p className='p-2 mt-1 text-white'>HH</p>  
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
                    <p className='p-2 mt-1 text-white'>HH</p>  
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
                    <p className='p-2 mt-1 text-white'>HH</p>  
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
                 <p className='p-2 mt-1 text-white'>HH</p>  
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
              <h5 className="mb-3 states">Priority breakdown</h5>
             
                  <Chart options={options} series={series} type="bar" height={350} />
            </div>
          </div>
        </div>
        <div className="col border_clr  m-2 rounded-4 bg-white">
          <div className="p-4 ">
            <div className="col-12">
              <h5 className="mb-3 states">Types of work</h5>
              
                  <h4>Task Count: {TaskCount?.tasksCount}</h4>
            </div>
            <div className="p-4">
              <div className="row ">
                <div className="col">
                  <p className="text-secondary">Type</p>  
                  <div className="d-flex mb-4 ">
                  <i class="fa fa-check-square mx-1 icon_s" aria-hidden="true"  style={{color: '#59d3ec'}}></i>
                   
                    <p className="mb-0">Task</p>
                  </div>
                  <div className="d-flex mb-4">
                    <div style={{backgroundColor: '#59d3ec', color: 'aliceblue'}} className="rounded-2 mx-1">
                     
                      <i class="fa fa-clone mx-1" aria-hidden="true"></i> 
                    </div>
                    <p className="mb-0">Sub-task</p>
                  </div>
                  <div className="d-flex mb-4">
                    <div style={{backgroundColor: '#59d3ec', color: 'aliceblue'}} className="rounded-2 mx-1 ">
                    <i class="fa fa-cog p-1 " aria-hidden="true"></i>
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