import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Row, Col, Card, Button, Alert, CloseButton } from 'react-bootstrap';
import ToastHandle from '../../../../../constants/toaster/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { updateMileStone } from '../../../../../redux/milestone/action';
// import MainLoader from '../../../../constants/Loader/loader';
import { Container, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import '../../../../../../node_modules/react-datepicker/dist/react-datepicker.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { parseISO } from 'date-fns';
const Update = ({ modal, closeModal, editData }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const sucesshandel = store?.updateMilestone;
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    // disable previous date
    const today = new Date();
    // end date
    const handleStartDate = (date) => {
        setStartDate(date);
    };
    const handleEndDate = (date) => {
        setEndDate(date);
    };
    useEffect(() => {
        reset({
            title: editData?.title,
            // startDate: handleDate(editData?.startDate),
            // endDate: handleDate(editData?.completionDate),
            description: editData?.description,
        });
        // setStartDate(handleDate(editData?.startDate))
        // setEndDate(handleDate(editData?.completionDate))
        if (editData?.startDate || editData?.completionDate) {
            const parsedDate = parseISO(editData?.startDate)
            const endate = parseISO(editData?.completionDate)
            if (parsedDate || endate) {
                setStartDate(parsedDate);
                setEndDate(endate)
            } else {
                console.error('Invalid date format:', editData.startDate);
            }
        }
    }, [modal]);

    const onSubmit = (data) => {
        let body = {
            milestoneId: editData?._id,
            title: data?.title,
            description: data?.description,
            startDate: startDate,
            completionDate: endDate,
        };
        dispatch(updateMileStone(body));
        closeModal('render');
    };

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    const CloseModal = () => {
        closeModal();
    };
    useEffect(() => {
        if (sucesshandel?.data?.status == 200) {
            ToastHandle('success', 'Updated Successfully');
            closeModal('render');
        } else if (sucesshandel?.data?.status == 400) {
            ToastHandle('error', sucesshandel?.data?.message);
        } else if (sucesshandel?.data?.status == 500) {
            ToastHandle('error', sucesshandel?.data?.message);
        }
    }, [sucesshandel]);
    return (
        <>
            <Modal show={modal} onHide={CloseModal}>
                <Row className="m-0 p-0">
                    <Col lg={12}>
                        <Row>
                            <Col lg={12} className="text-end pt-2">
                                <button type="button" className="close border-0 bg-black text-white" onClick={closeModal} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </Col>
                            <Col lg={12} className="text-center">
                                <Modal.Title id="" className="modal_titles text-center mx-auto">
                                    Update Milestone
                                </Modal.Title>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Modal.Body className="py-0">
                    <div className="p-3">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col lg={12}>
                                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                        <Form.Label>
                                            Milestone Name<span className="text-danger">*</span>:
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Please Enter  Milestone Name"
                                            {...register('title', { required: true, pattern: /^[^\s].*$/ })}
                                        />
                                        {errors.title?.type === 'required' && (
                                            <span className="text-danger"> This field is required *</span>
                                        )}

                                        {errors.title?.type === 'pattern' && (
                                            <span className="text-danger"> Empty fields / space at first character is not allowed</span>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col lg={12}>
                                    <Form.Group className="mb-2 " controlId="exampleForm.ControlTextarea1">
                                        <Form.Label className="mb-0">
                                            Description :
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Please Enter Description"
                                            rows={3}
                                            type="text"
                                            {...register('description', { required: true })}
                                        />
                                        {errors.description?.type === 'required' && (
                                            <span className="text-danger"> This field is required *</span>
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
                                        Update
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Update;
