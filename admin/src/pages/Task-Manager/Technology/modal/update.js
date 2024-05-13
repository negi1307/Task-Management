import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Row, Col, Card, Button, Alert, CloseButton } from 'react-bootstrap';
import { updateProject } from '../../../../redux/projects/action';
import ToastHandle from '../../../../constants/toaster/toaster';
import { useDispatch, useSelector } from 'react-redux';
import MainLoader from '../../../../constants/Loader/loader';
import { getAllTechnologyCategory, updateTechnology } from '../../../../redux/technology/action';

const Update = ({ modal, closeModal, editData }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const sucesshandel = store?.UpdateTechnologyReducer;
    const loaderhandle = store?.UpdateTechnologyReducer;
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        reset({
            category: editData?.techCategory_id?._id,
            TechnologyName: editData?.techName,
        });
    }, [modal]);

    const onSubmit = (data) => {
        let body = {
            id: editData?._id,
            techCategory_id: data?.category,
            techName: data?.TechnologyName,
        };
        dispatch(updateTechnology(body));
    };
    useEffect(() => {
        let body = {
            status: true,
        };
        dispatch(getAllTechnologyCategory(body));
    }, []);

    useEffect(() => {
        if (sucesshandel?.data?.status == 200) {
            ToastHandle('success', sucesshandel?.data?.message);
            closeModal('render');
        } else if (sucesshandel?.data?.status == 400) {
            ToastHandle('error', sucesshandel?.data?.message);
        } else if (sucesshandel?.data?.status == 500) {
            ToastHandle('error', sucesshandel?.data?.message);
        }
    }, [sucesshandel]);
    return (
        <>
            <Modal show={modal} onHide={closeModal}>
                <Row className="m-0 p-0">
                    <Col lg={12}>
                        <Row>
                            <Col lg={7} className="text-end">
                                <Modal.Title id="" className="mx-auto">
                                    Update Technology
                                </Modal.Title>
                            </Col>
                            <Col lg={5} className="text-end pt-2">
                                <CloseButton onClick={closeModal} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {loaderhandle?.loading ? (
                    <MainLoader />
                ) : (
                    <Modal.Body className="py-0">
                        <div className="p-2">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                            <Row>
                                                <Col lg={4}>
                                                    <Form.Label>
                                                        Category <span className="text-danger">*</span>:
                                                    </Form.Label>
                                                </Col>
                                                <Col lg={8}>
                                                    <Form.Select {...register('category', { required: true })}>
                                                        {/* <option value={''}>--Select--</option> */}
                                                        {store?.getAllTechnologyCategoryReducer?.data?.response?.map(
                                                            (ele, ind) => (
                                                                <option value={ele?._id}> {ele?.name} </option>
                                                            )
                                                        )}
                                                    </Form.Select>
                                                    {errors.category?.type === 'required' && (
                                                        <span className="text-danger"> This field is required *</span>
                                                    )}
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                            <Row>
                                                <Col lg={4}>
                                                    <Form.Label>
                                                        Technology Name <span className="text-danger">*</span>:
                                                    </Form.Label>
                                                </Col>
                                                <Col lg={8}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Please Enter Technology Name"
                                                        {...register('TechnologyName', {
                                                            required: true,
                                                            pattern: /^[^\s]+$/
                                                        })}
                                                    />
                                                    {errors.TechnologyName?.type === 'required' && (
                                                        <span className="text-danger"> This field is required *</span>
                                                    )}
                                                    {errors.TechnologyName?.type === 'pattern' && (
                                                        <span className="text-danger">Spaces are not allowed</span>
                                                    )}

                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col className="text-start d-flex align-items-center justify-content-center">
                                        <Button
                                            variant="info"
                                            type="submit"
                                            className="btn btn-sm  text-white pt-1 pb-1  web_button ">
                                            Update
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

export default Update;
