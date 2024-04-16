import { useEffect, useState } from 'react'
import { getsingleSprintTask } from '../../../redux/task/action'
import { useSelector, useDispatch } from 'react-redux'
import { ListGroup, Container, Row, Col, Table, Button, Form, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const ListTask = () => {
    const store = useSelector(state => state)
    const dispatch = useDispatch()
    const listTaskData = store?.getSigleSprintTask?.data?.response
    const [skip, setSkip] = useState(1)
    const { spriteId } = useParams()
    const [activeStatus, setActiveStatus] = useState('1');

    useEffect(() => {
        taskStatus('1');
    }, []);

    const assigneeId = localStorage.getItem('userId')

    const statusInfo = (status) => {
        setActiveStatus(status);
        setSkip(1);
        dispatch(getsingleSprintTask({
            skip: 1,
            sprintId: spriteId,
            activeStatus: true,
            assigneeId: assigneeId,
            taskStatus: status
        }));
    }

    const taskStatus = (status) => {
        statusInfo(status);
    }

    const handlePaginationChange = (event, value) => {
        setSkip(value);
        const status = activeStatus;
        dispatch(getsingleSprintTask({
            skip: value,
            sprintId: spriteId,
            activeStatus: true,
            assigneeId: assigneeId,
            taskStatus: status
        }));
    };

    return (
        <>
            <Row>
                <div className="row mx-auto border-bottom mb-2">
                    <div className="row d-flex align-items-center pb-2">
                        {[1, 2, 3, 4, 5].map((status) => (
                            <div key={status} className={`col-auto cp ${activeStatus === status.toString() ? 'Active_data' : 'InActive_data'}`}>
                                <p onClick={() => taskStatus(status.toString())} className="p-0 text-white fw-bold m-0 p-1 cp">
                                    {status === 1 ? 'Todo' : status === 2 ? 'In Progress' : status === 3 ? 'Testing' : status === 4 ? 'Done' : 'Hold'}
                                </p>
                            </div>
                        ))}
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
                                    {listTaskData?.map((item, index) => (
                                        <tr key={item._id} className='text-start'>
                                            <td>{index + 1}</td>
                                            <td className='' title={item?.description} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item?.description.split(' ').slice(0, 2).join(' ')}{item?.description.split(' ').length > 2 ? ' ...' : ''}
                                            </td>
                                            <td>{item?.summary}</td>
                                            <td>{item?.assigneeInfo?.firstName} {item?.assigneeInfo?.lastName}</td>
                                            <td>{item?.reporterInfo?.role}</td>
                                            <td className=''>
                                                {item?.priority}
                                            </td>
                                            <td> {moment(item?.startDate).format('L')}</td>
                                            <td>{moment(item?.dueDate).format('L')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
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
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default ListTask;
