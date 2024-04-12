import { useEffect, useState } from 'react'
import { getAllTask, getsingleSprintTask } from '../../../redux/task/action'
import { useSelector, useDispatch } from 'react-redux'
import { ListGroup, Container, Row, Col, Table, Button, Form, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { getAllProjects } from '../../../redux/projects/action';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const ListTask = () => {
    const store = useSelector(state => state)
    const dispatch = useDispatch()
    const listTaskData = store?.getSigleSprintTask?.data?.response
    // console.log("listTaskDatalistTaskData",listTaskData)
    const [skip, setSkip] = useState(1)
    const { projectId, milestoneId, spriteId } = useParams()
    const [activeStatus, setActiveStatus] = useState('1'); // State variable to track active status

    // console.log("projectId", spriteId)
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

    useEffect(() => {
        // Set 'Todo' status as active by default
        taskStatus('1');
    }, []);

    const assigneeId = localStorage.getItem('userId')
    console.log("assigneeId", assigneeId)
    const statusInfo = (status) => {
        let body = {
            skip: skip,
            sprintId: spriteId,
            status: status,
            activeStatus: true,
            skip: 1,
            assigneeId: assigneeId,
        };
        dispatch(getsingleSprintTask(body));
    }

    const taskStatus = (status) => {
        setActiveStatus(status); // Update active status when a button is clicked

        if (status == '1') {
            setSkip(1)
            statusInfo(1)
            dispatch(getsingleSprintTask({ skip: skip, sprintId: spriteId, activeStatus: true, assigneeId: assigneeId, taskStatus: status }))
        } else if (status == '2') {
            setSkip(1)
            statusInfo(2)
            dispatch(getsingleSprintTask({ skip: skip, sprintId: spriteId, activeStatus: true, assigneeId: assigneeId, taskStatus: status }))
        } else if (status == '3') {
            setSkip(1)
            statusInfo(3)
            dispatch(getsingleSprintTask({ skip: skip, sprintId: spriteId, activeStatus: true, assigneeId: assigneeId, taskStatus: status }))
        } else if (status == '4') {
            setSkip(1)
            statusInfo(4)
            dispatch(getsingleSprintTask({ skip: skip, sprintId: spriteId, activeStatus: true, assigneeId: assigneeId, taskStatus: status }))
        } else if (status == '5') {
            setSkip(1)
            statusInfo(5)
            dispatch(getsingleSprintTask({ skip: skip, sprintId: spriteId, activeStatus: true, assigneeId: assigneeId, taskStatus: status }))
        }
    }
    // const handlePaginationChange = (event, value) => {
    //     setSkip(value);
    //     dispatch(getsingleSprintTask({
    //         skip: value,
    //         sprintId: spriteId,
    //         activeStatus: true,
    //         assigneeId: assigneeId
    //     }));
    // };
    const handlePaginationChange = (event, value) => {
        setSkip(value);
        const status = activeStatus;
        dispatch(getsingleSprintTask({
            skip: value,
            sprintId: spriteId,
            activeStatus: true,
            assigneeId: assigneeId,
            taskStatus: status,
        }));
    };
    // console.log(skip)
    return (
        <>

            <Row>
                <div class="row mx-auto border-bottom mb-2">
                    <div className="row d-flex align-items-center pb-2">
                        <div className={`col-auto cp  ${activeStatus === '1' ? 'Active_data' : 'InActive_data'}`}>
                            <p className="p-0 text-white fw-bold  m-0 p-1 cp" onClick={() => taskStatus('1')}> Todo</p>
                        </div>
                        <div className={`col-auto cp  ${activeStatus === '2' ? 'Active_data' : 'InActive_data'}`}>
                            <p onClick={() => taskStatus('2')} className="p-0 text-white fw-bold m-0 p-1 cp">In Progress</p>
                        </div>
                        <div className={`col-auto cp  ${activeStatus === '3' ? 'Active_data' : 'InActive_data'}`}>
                            <p onClick={() => taskStatus('3')} className="p-0 text-white fw-bold  m-0 p-1 cp">Testing</p>
                        </div>
                        <div className={`col-auto cp  ${activeStatus === '4' ? 'Active_data' : 'InActive_data'}`}>
                            <p onClick={() => taskStatus('4')} className="p-0 text-white fw-bold  m-0 p-1 cp">Done</p>
                        </div>
                        <div className={`col-auto cp  ${activeStatus === '5' ? 'Active_data' : 'InActive_data'}`}>
                            <p onClick={() => taskStatus('5')} className="p-0 text-white fw-bold m-0 p-1 cp">Hold</p>
                        </div>
                    </div>

                </div>
                <Col className="mx-auto" lg={12}>
                    <Row>
                        <Col className="" lg={12}>
                            <Table striped>
                                <thead>
                                    <tr className='text-start'>
                                        <th>#</th>
                                        <th>Description</th>
                                        <th>Summary</th>
                                        <th>Assignee</th>
                                        <th>Reporter</th>
                                        <th>Priority</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {

                                        listTaskData?.map((item, index) =>
                                            <tr className='text-start'>
                                                <td>{index = index + 1}</td>
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
                                            </tr >

                                        )}
                                </tbody >

                            </Table >
                            <Row>
                                <Col lg={12} className="d-flex justify-content-end my-3  pe-4 bottom-0">
                                    {store?.getSigleSprintTask?.data?.totalPages > 0 && (
                                        <Stack spacing={2}>
                                            <Pagination
                                                defaultPage={skip}
                                                count={store?.getSigleSprintTask?.data?.totalPages}
                                                color="primary"
                                                variant="outlined"
                                                onChange={handlePaginationChange}
                                            />
                                        </Stack>
                                    )}
                                </Col>
                            </Row>
                        </Col >
                    </Row >
                </Col >
            </Row >
        </>
    )
}

export default ListTask;