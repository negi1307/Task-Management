import React from "react";
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const CustomerCreateFrom = (props) => {
    const { onHide } = props
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {

    };

    return (<>

        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header >
                <Modal.Title id="contained-modal-title-vcenter">
                    Create
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="pt-2">
                        <Col lg={6}>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label>
                                    Name<span className="text-danger">*</span>:
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Please Enter Name"
                                    {...register('name', { required: true })}
                                />
                                {errors?.name?.type === 'required' && (
                                    <span className="text-danger"> This feild is required *</span>
                                )}
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label>
                                    Project<span className="text-danger">*</span>:
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Project"
                                    {...register('project', { required: true })}
                                />
                                {errors?.project?.type === 'required' && (
                                    <span className="text-danger"> This feild is required *</span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>
                                    Description<span className="text-danger">*</span>:
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Description"
                                    {...register('description', { required: true })}
                                />
                                {errors?.description?.type === 'required' && (
                                    <span className="text-danger"> This feild is required *</span>
                                )}
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>
                                    Status<span className="text-danger">*</span>:
                                </Form.Label>
                                <Form.Select {...register('status', { required: true })}>
                                    <option value='' hidden selected> --select--</option>
                                    <option value="1">To-Do</option>
                                    <option value="2">Live</option>
                                    <option value="3">Hold</option>
                                    <option value="4">Completed</option>
                                </Form.Select>
                                {errors?.status?.type === 'required' && (
                                    <span className="text-danger"> This feild is required *</span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6} className="text-end">
                            <Button type="submit web_button" className="web_button">Add</Button>
                        </Col>
                        <Col lg={6}>
                            <Button type="submit web_button" className="btn btn-danger " onClick={() => { onHide() }}>Cancle</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    </>)
}
export default CustomerCreateFrom