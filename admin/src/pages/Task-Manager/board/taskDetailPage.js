import React from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import { Row, Col, Card, Button, Alert, CloseButton } from 'react-bootstrap';
const TaskDetailPage = ({ modal, editData, closeModal }) => {
    console.log(editData, 'dataaaaaaaaaa');
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    return (
        
        <>
            <Modal show={modal} onHide={closeModal} size={'lg'}>
                <Row className="m-0 p-0">
                    <Col lg={12}>
                        <Row>
                            <Col lg={7} className="text-end">
                                <Modal.Title id="" className="mx-auto">
                                    Task Detail
                                </Modal.Title>
                            </Col>
                            <Col lg={5} className="text-end pt-2">
                                <CloseButton onClick={closeModal} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <Modal.Body>
                    <Row>
                        <Col lg={6}>
                            <h4>Activity</h4>
                            <Row>
                                <Col lg={12}>
                                    <Button
                                        style={{
                                            backgroundColor: '#f3f3f3',
                                            borderColor: '#f3f3f3',
                                            color: 'black',
                                            boxShadow: 'none',
                                        }}>
                                        All
                                    </Button>
                                    <Button
                                        style={{
                                            backgroundColor: '#f3f3f3',
                                            borderColor: '#f3f3f3',
                                            color: 'black',
                                            boxShadow: 'none',
                                        }} className='ms-2'>
                                        Comments
                                    </Button>
                                    <Button
                                        style={{
                                            backgroundColor: '#f3f3f3',
                                            borderColor: '#f3f3f3',
                                            color: 'black',
                                            boxShadow: 'none',
                                        }}className='ms-2'>
                                        History
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                
                                <Col lg={12}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Control type="text" {...register('comment', { required: true })} />
                                            {/* {errors.comment?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )} */}
                                        </Form.Group>
                                    
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6}>
                            <Card className="p-2">
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Project Name :</h4>
                                    <p className="ms-2 p-0">{editData?.projectInfo?.projectName}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Milestone Name :</h4>
                                    <p className="ms-2 p-0">{editData?.milestoneInfo?.title}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Sprint Name :</h4>
                                    <p className="ms-2 p-0">{editData?.sprintInfo?.sprintName}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Summary :</h4>
                                    <p className="ms-2 p-0">{editData?.summary}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0"> Description :</h4>
                                    <p className="ms-2 p-0">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: editData?.description,
                                            }}
                                        />
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0"> Start Date :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.startDate ? moment(editData?.startDate).format('L') : ''}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0"> End Date :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.dueDate ? moment(editData?.dueDate).format('L') : ''}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0"> Assignee :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.assignees?.assigneeInfo?.firstName}
                                        {editData?.assignees?.assigneeInfo?.lastName}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Reporter :</h4>
                                    <p className="ms-2 p-0">{editData?.assignees?.reporterInfo?.role}</p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Priority :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.priority == 1
                                            ? 'High'
                                            : '' || editData?.priority == 2
                                            ? 'Medium'
                                            : '' || editData?.priority == 3
                                            ? 'Low'
                                            : ''}
                                    </p>
                                </div>
                                <div className=" d-flex">
                                    <h4 className="m-0 p-0">Status :</h4>
                                    <p className="ms-2 p-0">
                                        {editData?.status == 1
                                            ? 'To-Do'
                                            : '' || editData?.status == 2
                                            ? 'In-Progress'
                                            : '' || editData?.status == 3
                                            ? 'Hold'
                                            : '' || editData?.status == 4
                                            ? 'Done'
                                            : ''}
                                    </p>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TaskDetailPage;
