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
                                                    <th>#</th>

                                                    <th> Description</th>
                                                    <th> Summary</th>

                                                    <th>Assignee</th>
                                                    <th>Reporter</th>
                                                    <th>Priority</th>
                                                    <th> Start Date</th>
                                                    <th> End Date</th>
                                                  
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                
                                                listTaskData?.map((item,index)=>
                                                    <tr>
                                                    <td>{index=index+1}</td>
                                                    <td className='' title={item?.description} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {item?.description.split(' ').slice(0, 2).join(' ')}{item?.description.split(' ').length > 2 ? ' ...' : ''}
                                                </td>
                                                    <td>{item?.summary}</td>
                                                    <td>{item?.assigneeInfo?.firstName} {item?.assigneeInfo?.lastName}</td>
                                                    <td>{item?.reporterInfo?.role}</td>
                                                    <td className=''>
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
                                                    <td> {moment(item?.startDate).format('L')}</td>
                                                <td>{moment(item?.dueDate).format('L')}</td>
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