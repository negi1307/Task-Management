import React from 'react';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Row, Col, Button, CloseButton, Card } from 'react-bootstrap';
import { addSprint } from '../../../../../../redux/sprint/action';
import ToastHandle from '../../../../../../constants/toaster/toaster';
import MainLoader from '../../../../../../constants/Loader/loader';
import DatePicker from 'react-datepicker';
import '../../../../../../../node_modules/react-datepicker/dist/react-datepicker.css';
const Create = ({ modal, CloseModal, projectId, milestoneId }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const successHandle = store?.addSprint;
    const loaderHandle = store?.addSprint
    //
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    // disable previous date
    const today = new Date();
    console.log(today, 'today');
    // end date
    const handleStartDate = (date) => {
        setStartDate(date);
    };
    const handleEndDate = (date) => {
        setEndDate(date);
        
    };
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    console.log(projectId, 'projectId');
    const onSubmit = (val) => {
        let body = {
            projectId: projectId,
            milestoneId: milestoneId,
            sprintName: val?.Name,
            sprintDesc: val?.description,
            startDate: startDate,
            endDate: endDate,
        };
        dispatch(addSprint(body));
    };
    useEffect(() => {
        reset();
        setStartDate("")
        setEndDate("")
    }, [modal]);
    useEffect(() => {
        if (successHandle?.data?.status == 200) {
            ToastHandle('success', successHandle?.data?.message);
            CloseModal('render');
        } else if (successHandle?.data?.status == 400) {
            ToastHandle('error', successHandle?.data?.message);
        } else if (successHandle?.data?.status == 500) {
            ToastHandle('error', successHandle?.data?.message);
        }
    }, [successHandle?.data?.status]);
    console.log(successHandle,'testing')
    const handleClose = () => {
        CloseModal();
    };
    return (
        <>
            <Modal show={modal} onHide={handleClose}>
                <Row className="m-0 p-0">
                    <Col lg={12}>
                        <Row>
                            <Col lg={7} className="text-end">
                                <Modal.Title id="" className="mx-auto">
                                    Add Sprint
                                </Modal.Title>
                            </Col>
                            <Col lg={5} className="text-end pt-2">
                                <CloseButton onClick={handleClose} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {loaderHandle?.loading ? (
                    <MainLoader />
                ) : (
                    <Modal.Body className="py-0">
                        <div className="p-2">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                {' '}
                                                Sprint Name <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Please Enter Sprint Name"
                                                {...register('Name', { required: true })}
                                            />
                                            {errors.Name?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={12}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                Description <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                type="text"
                                                placeholder="Please Enter Description"
                                                {...register('description', { required: true })}
                                            />
                                            {errors.description?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={12}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label className="w-100">
                                                Start Date<span className="text-danger">*</span>:
                                            </Form.Label>

                                            <DatePicker
                                                selected={startDate}
                                                // onChange={(date) => setStartDate(date)}
                                                onChange={(date) => handleStartDate(date)}
                                                placeholderText="mm-dd-yyyy"
                                                minDate={today}
                                                className="add_width_input"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={12}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label className="w-100">
                                                End Date<span className="text-danger">*</span>:
                                            </Form.Label>

                                            <DatePicker
                                                selected={endDate}
                                                disabled={startDate == '' || startDate == undefined}
                                                // onChange={(date) => setEndDate(date)}
                                                onChange={(date) => handleEndDate(date)}
                                                placeholderText="mm-dd-yyyy"
                                                minDate={startDate}
                                                className="add_width_input"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-start d-flex align-items-center justify-content-center">
                                        <Button
                                            variant="info"
                                            type="submit"
                                            className="btn btn-sm  text-white pt-1 pb-1 mt-3 web_button ">
                                            Add
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Modal.Body>
                )}
            </Modal>
        </>
    );
};

export default Create;
