import { useEffect } from 'react'
import {getAllTask} from '../../../redux/task/action'
import { useSelector,useDispatch } from 'react-redux'
import { ListGroup, Container, Row, Col, Table, Button, Form, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moment from 'moment';


const ListTask=()=>{
    const store=useSelector(state=>state)
    const dispatch=useDispatch()
    const listTaskData=store?.getAllTaskReducer?.data?.response
    const { projectId, milestoneId ,spriteId } = useParams()
    console.log("projectId",projectId)
  useEffect(() => {
    let body={
        flag:2,
        status:true,
        searchString:"",
        projectId:projectId,
        milestoneId:milestoneId,
        sprintId:spriteId,
        skip:1
      }
      dispatch(getAllTask(body))   
  }, [])

    return(
        <>
        <Row>
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
                                            {/* {
                                                
                                                listTaskData?.taskInfo?.map((item,index)=>
                                                    <tr>
                                                    <td>{index=index+1}</td>
                                                    <td>{item?.description}</td>
                                                    <td>{item?.summary}</td>
                                                    <td>{item?.assigneeInfo?.firstName} {item?.assigneeInfo?.lastName}</td>
                                                    <td>{item?.reporterInfo?.role}</td>
                                                    <td>
                                                    {item?.priority == 1
                                                        ? 'High'
                                                        : '' || item?.priority == 2
                                                        ? 'Medium'
                                                        : '' || item?.priority == 3
                                                        ? 'Low'
                                                        : ''}
                                                    </td>
                                                    <td> {moment(item?.startDate).format('L')}</td>
                                                <td>{moment(item?.dueDate).format('L')}</td>
                                                </tr>
                                                
                                            )} */}
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