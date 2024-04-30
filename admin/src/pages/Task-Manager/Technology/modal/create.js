import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Row, Col, Card, Button, Alert, CloseButton } from 'react-bootstrap';
import ToastHandle from '../../../../constants/toaster/toaster';
import MainLoader from '../../../../constants/Loader/loader';
import { MultiSelect } from 'react-multi-select-component';
import { createTechnology, getAllTechnologyCategory } from '../../../../redux/technology/action';
const Create = ({ modal, closeModal }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [selected, setSelected] = useState([]);
    const errorhandel = store?.createTechnologyReducer;
    const loaderhandel = store?.createTechnologyReducer;
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        let body = {
            techCategory_id: data?.category,
            techName: data?.technologyName,
        };
        dispatch(createTechnology(body));
    };
    useEffect(() => {
        if (errorhandel?.data?.status == 200) {
            ToastHandle('success', errorhandel?.data?.message);
            closeModal('render');
        } else if (errorhandel?.data?.status == 400) {
            ToastHandle('error', errorhandel?.data?.message);
        } else if (errorhandel?.data?.status == 500) {
            ToastHandle('error', errorhandel?.data?.message);
        }
    }, [errorhandel]);
    useEffect(() => {
        reset();
    }, [modal]);
    useEffect(() => {
        let body = {
            status: true,
        };
        dispatch(getAllTechnologyCategory(body));
    }, []);

    return (
        <>
            <Modal show={modal} className="add_round" onHide={closeModal}>
                <Row className="m-0 p-0">
                    <Col lg={12}>
                        <Row>
                            <Col lg={12} className="text-end pt-2">
                                <CloseButton onClick={closeModal} />
                            </Col>
                            <Col lg={12} className="text-center page_headings mt-1 mb-2">
                                <Modal.Title id="" className="mx-auto">
                                    Create Technology
                                </Modal.Title>
                            </Col>

                        </Row>
                    </Col>
                </Row>
                {loaderhandel?.loading ? (
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
                                                        <option value={''}>--Select--</option>
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
                                                        {...register('technologyName', {
                                                            required: true,
                                                            pattern: /^[^\s]+$/
                                                        })}
                                                    />
                                                    {errors.technologyName && (
                                                        <span className="text-danger">
                                                            {errors.technologyName.type === 'required' && 'This field is required *'}
                                                            {errors.technologyName.type === 'pattern' && 'Spaces are not allowed'}
                                                        </span>
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
