import { useEffect } from 'react'
import {getAllTask, getsingleSprintTask} from '../../../redux/task/action'
import { useSelector,useDispatch } from 'react-redux'
import { ListGroup, Container, Row, Col, Table, Button, Form, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { getAllProjects } from '../../../redux/projects/action';


const ListTask=()=>{
    const store=useSelector(state=>state)
    const dispatch=useDispatch()
    const listTaskData=store?.getSigleSprintTask?.data?.response
    console.log("listTaskDatalistTaskData",listTaskData)
    const { projectId, milestoneId ,spriteId } = useParams()
    
    console.log("projectId",spriteId)
//   useEffect(() => {
//     let body={
//         flag:2,
//         status:true,
//         searchString:"",
//         projectId:projectId,
//         milestoneId:milestoneId,
//         sprintId:spriteId,
//         skip:1
//       }
//       dispatch(getAllTask(body))   
//   }, [])
useEffect(()=>{
    statusInfo(1)
},[])

  const statusInfo =(status)=>{
    let body = {
        // flag: 2,
        // projectId: projectId,
        // milestoneId:milestoneId,
        sprintId:spriteId,
        status:status,
        activeStatus:true,
        // searchString:'',
        skip: 1,
    };
    dispatch(getsingleSprintTask(body));

}
    return(
        <>
        
        <Row>
        <div class="row mx-auto border-bottom mb-2">
                    <div class="row d-flex align-items-center pb-2">
                    <div class="col-auto  cp InActive_data">
                    <p class="p-0 m-0 p-1 cp" onClick={()=>statusInfo(1)}> Todo</p></div>
                    <div class="col-auto  cp InActive_data"><p onClick={()=>statusInfo(2)} class="p-0 m-0 p-1 cp">Live</p></div>
                    <div class="col-auto  cp InActive_data"><p onClick={()=>statusInfo(3)} class=" p-0 m-0 p-1 cp">Hold</p></div>
                    <div class="col-auto  cp InActive_data"><p onClick={()=>statusInfo(4)} class=" p-0 m-0 p-1 cp">Completed</p></div>
                    </div>
                    </div>
                            <Col className="mx-auto" lg={12}>
                                <Row>
                                    <Col className="" lg={12}>
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th className='text-start'>#</th>

                                                    <th className='text-start'> Description</th>
                                                    <th className='text-start'> Summary</th>

                                                    <th className='text-start'>Assignee</th>
                                                    <th className='text-start'>Reporter</th>
                                                    <th className='text-start'>Priority</th>
                                                    <th className='text-start'> Start Date</th>
                                                    <th className='text-start'> End Date</th>
                                                      
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                
                                                listTaskData?.map((item,index)=>
                                                    <tr>
                                                    <td className='text-start'>{index=index+1}</td>
                                                    <td className='text-start' title={item?.description} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {item?.description.split(' ').slice(0, 2).join(' ')}{item?.description.split(' ').length > 2 ? ' ...' : ''}
                                                </td>
                                                    <td className='text-start'>{item?.summary}</td>
                                                    <td className='text-start'>{item?.assigneeInfo?.firstName} {item?.assigneeInfo?.lastName}</td>
                                                    <td className='text-start'>{item?.reporterInfo?.role}</td>
                                                    <td className='text-start'>
                                                    {item?.priority == 'Critical'
                                                        ? 'Critical'
                                                        : '' || item?.priority == 'High'
                                                            ? 'High'
                                                            : '' || item?.priority == 'Medium'
                                                                ? 'Medium'
                                                                : '' || item?.priority == 'Low'
                                                                    ? 'Low'
                                                                    : ''}
                                                </td>
                                                    <td className='text-start'> {moment(item?.startDate).format('L')}</td>
                                                <td className='text-start'>{moment(item?.dueDate).format('L')}</td>
                                                </tr>
                                                
                                            )}
                                            </tbody>
                                            
                                        </Table>
                                    </Col>
                                </Row>
                               
                            </Col>
                        </Row>
        </>
    )
}

export default ListTask;