import { useEffect } from 'react'
import {getAllTask} from '../../../redux/task/action'
import { useSelector,useDispatch } from 'react-redux'
import { ListGroup, Container, Row, Col, Table, Button, Form, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';


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
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {/* {listTaskData?.map((item,index)=>
                                                    <tr>
                                                    <td>{item?.taskInfo.summary}</td>
                                                </tr>
                                                
                                            )} */}
                                            </tbody>
                                            
                                            {/* <tbody>
                                                {listTaskData?.map((item,index)=>
                                                <tr>
                                                    <td>{item?.taskInfo.summary}</td>
                                                </tr>
                                                )}
                                            </tbody> */}
                                        </Table>
                                    </Col>
                                </Row>
                               
                            </Col>
                        </Row>
        </>
    )
}

export default ListTask;