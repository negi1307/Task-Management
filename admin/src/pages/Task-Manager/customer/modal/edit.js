import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { addPreSalesData, getPreSalesData, updatePreSalesData } from '../../../../redux/customer/action';
import { useSelector, useDispatch } from 'react-redux';
import ToastHandle from '../../../../constants/toaster/toaster';
// import {ButtonLoading} from '../../../../constants/Loader/loader';
const Edit = ({ modal, editData, closemodal }) => {
    console.log(editData, 'mmmmmmmmmmmmmmmmmmm');
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const updatePreSaleStatus = store?.updatePreSaleReducer?.updatePreSale?.status;
    const updatePreSaleMessage = store?.updatePreSaleReducer?.updatePreSale?.message;
    // update
    const closeModal = () => {};
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        dispatch(
            updatePreSalesData({
                preSalesId: editData?._id,
                clientName: data?.name,
                projectName: data?.project,
                description: data?.description,
                stage: data?.stage,
                type: data?.type,
                status: data?.status,
            })
        );
    };

    useEffect(() => {
        if (updatePreSaleStatus === '200') {
            ToastHandle('success', updatePreSaleMessage);
            closemodal('render');
        } else if (updatePreSaleStatus === 400) {
            ToastHandle('error', updatePreSaleMessage);
        }
    }, [updatePreSaleStatus]);
    // model check two type add and edite;

    useEffect(() => {
        reset({
            name: editData?.clientName,
            project: editData?.projectName,
            description: editData?.description,
            status: editData?.status,
            stage: editData?.stage,
            type: editData?.type,
        });
    }, [modal]);

    return (
        <>
            <Modal
                // {...props}
                show={modal}
                onHide={closemodal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">update</Modal.Title>
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
                                        <option value="" hidden selected>
                                            {' '}
                                            --select--
                                        </option>
                                        <option value="1">CONVERTED</option>
                                        <option value="2">NOT-CONVERTED</option>
                                    </Form.Select>

                                    {errors?.status?.type === 'required' && (
                                        <span className="text-danger"> This feild is required *</span>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6}>
                                <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>
                                        STAGE<span className="text-danger">*</span>:
                                    </Form.Label>
                                    <Form.Select {...register('stage', { required: true })}>
                                        <option value="" hidden selected>
                                            {' '}
                                            --select--
                                        </option>
                                        <option value="1">HOT</option>
                                        <option value="2">COLD</option>
                                        <option value="3">MEDIUM</option>
                                    </Form.Select>
                                    {errors?.stage?.type === 'required' && (
                                        <span className="text-danger"> This feild is required *</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>
                                        TYPE<span className="text-danger">*</span>:
                                    </Form.Label>

                                    <Form.Select {...register('type', { required: true })}>
                                        <option value="" hidden selected>
                                            {' '}
                                            --select--
                                        </option>
                                        <option value="1">WEB</option>
                                        <option value="2">MOBILE</option>
                                    </Form.Select>
                                    {errors?.type?.type === 'required' && (
                                        <span className="text-danger"> This feild is required *</span>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} className="text-end">
                                <Button type="submit web_button" className="web_button">
                                    Update
                                </Button>
                            </Col>
                            <Col lg={6}>
                                <Button className="btn btn-danger " onClick={closemodal}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default Edit;
