

import { useEffect } from 'react'
import {getAllTask} from '../../../redux/task/action'
import { useSelector,useDispatch } from 'react-redux'
import { ListGroup, Container, Row, Col, Table, Button, Form, Card } from 'react-bootstrap';


const ListTask=()=>{
    const store=useSelector(state=>state)
    console.log("listtaskk",store)
    const dispatch=useDispatch()
    const listTaskData=store?.getAllTaskReducer?.data
     
const projectId=store?.getProjectId?.data
const milstoneId=store?.getMilestoneId?.data
const SprintId=store?.getSprintId?.data

  useEffect(() => {
    dispatch(getAllTask({id:'' , mileStoneId:'',sprintId:''}))  
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